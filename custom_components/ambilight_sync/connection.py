"""Bounded SSDP recovery with identity checks and the existing Philips library."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass
import ipaddress
import re
import socket
from typing import Any
from urllib.parse import urlsplit

from haphilipsjs import PhilipsTV
from .color import payload_has_samples

COLOR_TRANSPORT = "color_transport"
_ST = "urn:schemas-upnp-org:device:MediaRenderer:1"
_MAX_CANDIDATES = 8


def device_identity(system: dict, unique_id: str | None = None) -> dict[str, str]:
    """Use stable identifiers; never a display name, model or IP address."""
    aliases = {"serial": ("serialnumber", "serialNumber"), "deviceid": ("deviceid",),
               "udn": ("uuid", "UDN"), "ethernetmac": ("ethernetmac",), "wifimac": ("wifimac",), "mac": ("macaddress",)}
    result = {}
    for kind, keys in aliases.items():
        value = next((system[k] for k in keys if system.get(k)), None)
        if kind == "serial" and not value:
            value = unique_id
        if value:
            normalized = re.sub(r"[^a-z0-9]", "", str(value).lower().removeprefix("uuid:"))
            if len(normalized) >= 4 and normalized not in {"unknown", "none", "null", "000000", "000000000000"}:
                result[kind] = normalized
    return result


def same_device(expected: dict[str, str], actual: dict[str, str]) -> bool:
    if "serial" in expected and "serial" in actual:
        return expected["serial"] == actual["serial"]
    common = expected.keys() & actual.keys()
    return bool(common) and all(expected[k] == actual[k] for k in common)


@dataclass
class Candidate:
    host: str
    identity: dict[str, str]


def _local_host(location: str | None) -> str | None:
    try:
        parsed = urlsplit(location or "")
        address = ipaddress.ip_address(parsed.hostname or "")
        if parsed.scheme in ("http", "https") and not parsed.username and not parsed.password and not address.is_loopback and not address.is_unspecified and not address.is_multicast and address.is_private:
            return str(address) if address.version == 4 else f"[{address}]"
    except ValueError:
        pass
    return None


class _Search(asyncio.DatagramProtocol):
    def __init__(self):
        self.candidates: dict[str, Candidate] = {}

    def datagram_received(self, data, addr):
        if len(data) > 16384 or len(self.candidates) >= _MAX_CANDIDATES:
            return
        text = data.decode("utf-8", "replace")
        if not text.upper().startswith("HTTP/1.1 200"):
            return
        headers = {k.strip().lower(): v.strip() for line in text.splitlines()[1:] if ":" in line for k, v in [line.split(":", 1)]}
        host = _local_host(headers.get("location"))
        # A responder cannot direct probes at an unrelated network host.
        if host and host == addr[0] and headers.get("st", "").lower() == _ST.lower():
            self.candidates[host] = Candidate(host, {})


async def discovery_candidates(hass) -> list[Candidate]:
    candidates: dict[str, Candidate] = {}
    # Reuse HA's existing SSDP cache if it is loaded; do not start its scanner.
    if "ssdp" in getattr(hass, "data", {}):
        from homeassistant.components import ssdp
        try:
            for info in await ssdp.async_get_discovery_info_by_st(hass, _ST):
                host = _local_host(info.ssdp_location)
                if host:
                    candidates[host] = Candidate(host, device_identity(dict(info.upnp)))
        except Exception:
            pass
    # One short M-SEARCH window, only invoked during a failed connection.
    transport = None
    try:
        transport, protocol = await asyncio.get_running_loop().create_datagram_endpoint(_Search, local_addr=("0.0.0.0", 0), family=socket.AF_INET)
        request = f'M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: 2\r\nST: {_ST}\r\n\r\n'
        transport.sendto(request.encode(), ("239.255.255.250", 1900))
        await asyncio.sleep(2.5)
        for host, candidate in protocol.candidates.items():
            candidates.setdefault(host, candidate)
    except OSError:
        pass
    finally:
        if transport is not None:
            transport.close()
    return list(candidates.values())[:_MAX_CANDIDATES]


async def close_client(tv) -> None:
    try:
        async with asyncio.timeout(1):
            await tv.session.aclose()
    except Exception:
        pass


async def supports_http_colors(host: str, api_version: int, system: dict) -> bool:
    """Probe read-only HTTP during setup without affecting the pairing client."""
    tv = None
    try:
        async with asyncio.timeout(3):
            tv = PhilipsTV(host, api_version=api_version, system=system, secured_transport=False)
            await tv.setTransport(False)
            return payload_has_samples(await tv.getAmbilightProcessed())
    except Exception:
        return False
    finally:
        if tv is not None:
            await close_client(tv)


@dataclass
class RecoveredConnection:
    tv: Any
    host: str
    transport: str
    system: dict


async def probe_candidate(candidate: Candidate, options: dict, expected: dict, source: str) -> RecoveredConnection | None:
    protocols = ("https", "http") if options.get("secured_transport") else ("http", "https")
    for protocol in protocols:
        probe = None
        reader = None
        try:
            async with asyncio.timeout(4):
                # Do not send credentials to an unverified new IP. Cached UPnP
                # serial identity permits authenticated system verification.
                trusted_hint = same_device(expected, candidate.identity)
                probe_options = {**options, "host": candidate.host, "system": {}, "username": None, "password": None, "secured_transport": protocol == "https"}
                if trusted_hint and protocol == "https":
                    probe_options.update(username=options.get("username"), password=options.get("password"))
                probe = PhilipsTV(**probe_options)
                await probe.setTransport(protocol == "https")
                await probe.getSystem()
                system = dict(probe.system or {})
                if not same_device(expected, device_identity(system)):
                    continue
                reader_options = {**options, "host": candidate.host, "system": system, "secured_transport": protocol == "https"}
                if protocol == "http":
                    reader_options.update(username=None, password=None)
                reader = PhilipsTV(**reader_options)
                await reader.setTransport(protocol == "https")
                payload = await (reader.getAmbilightMeasured() if source == "measured" else reader.getAmbilightProcessed())
                if payload_has_samples(payload):
                    # Finish awaited cleanup before transferring ownership. A
                    # cancellation here must still close the unreturned reader.
                    await close_client(probe)
                    probe = None
                    result = RecoveredConnection(reader, candidate.host, protocol, system)
                    reader = None  # ownership is transferred to the manager
                    return result
        except Exception:
            pass
        finally:
            if probe is not None:
                await close_client(probe)
            if reader is not None:
                await close_client(reader)
    return None


async def recover_connection(hass, options: dict, unique_id: str | None, source: str) -> RecoveredConnection | None:
    expected = device_identity(options.get("system", {}), unique_id)
    if not expected:
        return None
    # Check protocol recovery at the known address before any network search.
    result = await probe_candidate(Candidate(options["host"], {}), options, expected, source)
    if result is not None:
        return result
    for candidate in await discovery_candidates(hass):
        if candidate.host == options["host"]:
            continue
        if candidate.identity and not same_device(expected, candidate.identity):
            continue
        result = await probe_candidate(candidate, options, expected, source)
        if result is not None:
            return result
    return None
