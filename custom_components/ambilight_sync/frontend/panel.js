const TEXT = {
  ru: {
    title: "Ambilight Sync",
    subtitle: "0.1.0",
    tv: "Телевизор",
    running: "Синхронизация включена",
    stopped: "Синхронизация выключена",
    error: "Ошибка",
    zones: "Лампы и зоны",
    zonesHint: "Одна лампа может находиться только в одной зоне. Зоны «+ углы» берут основную сторону целиком и добавляют ближайшие участки соседних граней.",
    addLight: "Добавить лампу…",
    noLights: "Лампы не назначены",
    left: "Левая сторона",
    right: "Правая сторона",
    top: "Верх",
    bottom: "Низ",
    all: "Весь экран",
    left_corners: "Левая сторона + углы",
    right_corners: "Правая сторона + углы",
    top_corners: "Верх + углы",
    bottom_corners: "Низ + углы",
    engine: "Синхронизация",
    source: "Источник цвета",
    processed: "Processed · обработанный Ambilight",
    measured: "Measured · измеренный Ambilight",
    colorMode: "Алгоритм цвета",
    average: "Average · обычное усреднение",
    perceptual: "Perceptual · естественный ambient",
    dominant: "Dominant · выраженный главный цвет",
    averageDesc: "Average повторяет поведение v0.2. Все Ambilight-сегменты зоны имеют одинаковый вес, а RGB усредняется напрямую.",
    perceptualDesc: "Perceptual сильнее учитывает видимые и насыщенные цвета, почти чёрные сегменты меньше загрязняют оттенок. Общая темнота сцены при этом сохраняется в яркости. Обычно приятнее для фильмов.",
    dominantDesc: "Dominant группирует близкие оттенки и выбирает наиболее выраженную цветовую группу. Площадь зоны важнее одного случайного яркого сегмента. Режим более эффектный, чем Perceptual.",
    fps: "Частота обновления",
    transition: "Аппаратный transition",
    smoothing: "Программное сглаживание",
    brightness: "Максимальная яркость",
    minBrightness: "Минимальная яркость",
    minBrightnessDesc: "Нижняя граница яркости. При значении выше 0% чёрная сцена плавно опускает лампу до этого уровня вместо полного выключения.",
    saturation: "Насыщенность",
    threshold: "Порог изменения",
    blackHold: "Black hold",
    blackHoldDesc: "Сколько миллисекунд зона должна оставаться чёрной, прежде чем начнётся затухание. Короткие тёмные кадры не заставят лампу резко гаснуть.",
    fadeBlack: "Fade to black",
    fadeBlackDesc: "Отдельное время аппаратного перехода к минимальной яркости или выключению. Не зависит от обычного transition смены цвета.",
    cornerInfluence: "Corner influence",
    cornerInfluenceDesc: "Работает только для зон «+ углы». 0% = только основная сторона; 100% = ближайшая четверть соседних граней имеет полный вес. Промежуточные значения мягко смешивают углы.",
    restore: "Восстанавливать прежнее состояние ламп после выключения Sync",
    save: "Сохранить",
    saving: "Сохраняю…",
    saved: "Сохранено",
    loadError: "Не удалось загрузить настройки",
    saveError: "Не удалось сохранить настройки",
    noEntries: "Интеграция ещё не добавлена. Сначала добавь Philips Ambilight Matter Sync в «Устройства и службы» и пройди сопряжение с телевизором.",
    note: "В Home Assistant остаётся switch Ambilight Sync для включения/выключения и HomeKit. Остальные настройки живут здесь.",
    hz: "Гц",
    sec: "с",
    ms: "мс",
    percent: "%",
    remove: "Убрать",
  },
  en: {
    title: "Ambilight Sync",
    subtitle: "0.1.0",
    tv: "TV",
    running: "Sync is on",
    stopped: "Sync is off",
    error: "Error",
    zones: "Lights & zones",
    zonesHint: "A light can belong to one zone only. “+ corners” zones use the whole main edge plus the nearest parts of adjacent edges.",
    addLight: "Add light…",
    noLights: "No lights assigned",
    left: "Left side",
    right: "Right side",
    top: "Top",
    bottom: "Bottom",
    all: "Whole screen",
    left_corners: "Left side + corners",
    right_corners: "Right side + corners",
    top_corners: "Top + corners",
    bottom_corners: "Bottom + corners",
    engine: "Sync engine",
    source: "Color source",
    processed: "Processed · TV processed Ambilight",
    measured: "Measured · measured Ambilight",
    colorMode: "Color algorithm",
    average: "Average · legacy averaging",
    perceptual: "Perceptual · natural ambient",
    dominant: "Dominant · strongest color family",
    averageDesc: "Average preserves v0.2 behavior. Every Ambilight sample in the zone has equal weight and RGB is averaged directly.",
    perceptualDesc: "Perceptual favors visible saturated colors while near-black samples have less influence on hue. Overall scene darkness still affects brightness. Usually the most natural movie mode.",
    dominantDesc: "Dominant groups nearby hues and selects the strongest recurring color family. Area matters more than one accidental bright sample. It is more expressive than Perceptual.",
    fps: "Update rate",
    transition: "Device transition",
    smoothing: "Software smoothing",
    brightness: "Maximum brightness",
    minBrightness: "Minimum brightness",
    minBrightnessDesc: "Brightness floor. Above 0%, a black scene fades the light to this level instead of fully turning it off.",
    saturation: "Saturation",
    threshold: "Change threshold",
    blackHold: "Black hold",
    blackHoldDesc: "How long a zone must remain black before fading starts. Brief dark frames therefore do not make the light drop abruptly.",
    fadeBlack: "Fade to black",
    fadeBlackDesc: "Separate device-side transition used when fading to the minimum brightness or off. Independent from the normal color transition.",
    cornerInfluence: "Corner influence",
    cornerInfluenceDesc: "Used only by “+ corners” zones. 0% = main edge only; 100% = the nearest quarter of adjacent edges has full weight. Values in between blend the corners more gently.",
    restore: "Restore previous light state when Sync stops",
    save: "Save",
    saving: "Saving…",
    saved: "Saved",
    loadError: "Could not load settings",
    saveError: "Could not save settings",
    noEntries: "The integration has not been added yet. Add Philips Ambilight Matter Sync in Devices & services and pair the TV first.",
    note: "Home Assistant keeps the Ambilight Sync switch for on/off control and HomeKit. All other settings live here.",
    hz: "Hz",
    sec: "s",
    ms: "ms",
    percent: "%",
    remove: "Remove",
  },
};

const ZONES = [
  "left",
  "right",
  "top",
  "bottom",
  "all",
  "left_corners",
  "right_corners",
  "top_corners",
  "bottom_corners",
];

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
}[c]));

class AmbilightSyncPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._entries = [];
    this._entryId = null;
    this._draft = null;
    this._loading = false;
    this._saving = false;
    this._statusTimer = null;
    this._lastStatus = null;
  }

  set hass(value) {
    const first = !this._hass;
    this._hass = value;
    // HA replaces `hass` frequently. Never rebuild the form here: doing that
    // destroys an open native <select> and was the disappearing-dropdown bug.
    if (first && this.isConnected) this._load();
  }
  get hass() { return this._hass; }
  set panel(value) { this._panel = value; }
  get panel() { return this._panel; }

  connectedCallback() {
    if (this._hass && !this._loading && !this._entries.length) this._load();
    if (!this._statusTimer) {
      this._statusTimer = window.setInterval(() => this._refreshStatus(), 2000);
    }
  }

  disconnectedCallback() {
    if (this._statusTimer) window.clearInterval(this._statusTimer);
    this._statusTimer = null;
  }

  get t() {
    const lang = (this._hass?.language || navigator.language || "en").toLowerCase();
    return lang.startsWith("ru") ? TEXT.ru : TEXT.en;
  }

  get currentEntry() {
    return this._entries.find((e) => e.entry_id === this._entryId) || this._entries[0] || null;
  }

  _cloneEntry(entry) {
    return JSON.parse(JSON.stringify({ zones: entry.zones || {}, settings: entry.settings || {} }));
  }

  async _load() {
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._renderLoading();
    try {
      const data = await this._hass.connection.sendMessagePromise({ type: "ambilight_sync/get_config" });
      this._entries = data.entries || [];
      if (!this._entryId || !this._entries.some((e) => e.entry_id === this._entryId)) {
        this._entryId = this._entries[0]?.entry_id || null;
      }
      const entry = this.currentEntry;
      this._draft = entry ? this._cloneEntry(entry) : null;
      this._lastStatus = entry?.status || null;
      this._render();
    } catch (err) {
      this._renderError(`${this.t.loadError}: ${err?.message || err}`);
    } finally {
      this._loading = false;
    }
  }

  _allLights() {
    if (!this._hass?.states) return [];
    return Object.keys(this._hass.states)
      .filter((id) => id.startsWith("light."))
      .sort((a, b) => this._lightName(a).localeCompare(this._lightName(b)));
  }

  _lightName(entityId) {
    return this._hass?.states?.[entityId]?.attributes?.friendly_name || entityId;
  }

  _zoneOwner(entityId) {
    for (const zone of ZONES) {
      if ((this._draft?.zones?.[zone] || []).includes(entityId)) return zone;
    }
    return null;
  }

  _moveLight(entityId, targetZone) {
    if (!entityId || !targetZone || !this._draft) return;
    for (const zone of ZONES) {
      this._draft.zones[zone] = (this._draft.zones[zone] || []).filter((id) => id !== entityId);
    }
    this._draft.zones[targetZone] = [...(this._draft.zones[targetZone] || []), entityId];
    // This re-render happens only after the user has completed a selection.
    this._render();
  }

  _removeLight(entityId) {
    if (!this._draft) return;
    for (const zone of ZONES) {
      this._draft.zones[zone] = (this._draft.zones[zone] || []).filter((id) => id !== entityId);
    }
    this._render();
  }

  _readControls() {
    if (!this._draft) return;
    const root = this.shadowRoot;
    this._draft.settings.source = root.getElementById("source").value;
    this._draft.settings.color_mode = root.getElementById("color_mode").value;
    this._draft.settings.update_rate = Number(root.getElementById("update_rate").value);
    this._draft.settings.transition = Number(root.getElementById("transition").value);
    this._draft.settings.smoothing = Number(root.getElementById("smoothing").value);
    this._draft.settings.brightness = Number(root.getElementById("brightness").value);
    this._draft.settings.minimum_brightness = Number(root.getElementById("minimum_brightness").value);
    this._draft.settings.saturation = Number(root.getElementById("saturation").value);
    this._draft.settings.threshold = Number(root.getElementById("threshold").value);
    this._draft.settings.black_hold_ms = Number(root.getElementById("black_hold_ms").value);
    this._draft.settings.fade_to_black = Number(root.getElementById("fade_to_black").value);
    this._draft.settings.corner_influence = Number(root.getElementById("corner_influence").value);
    this._draft.settings.restore_on_stop = root.getElementById("restore_on_stop").checked;
  }

  async _save() {
    if (!this.currentEntry || !this._draft || this._saving) return;
    this._readControls();
    this._saving = true;
    this._setSaveState(this.t.saving, true);
    try {
      const updated = await this._hass.connection.sendMessagePromise({
        type: "ambilight_sync/save_config",
        entry_id: this.currentEntry.entry_id,
        zones: this._draft.zones,
        settings: this._draft.settings,
      });
      const idx = this._entries.findIndex((e) => e.entry_id === updated.entry_id);
      if (idx >= 0) this._entries[idx] = updated;
      this._draft = this._cloneEntry(updated);
      this._lastStatus = updated.status;
      this._syncNormalizedControlValues();
      this._updateStatusDom(updated.status);
      this._setSaveState(this.t.saved, false);
      window.setTimeout(() => this._setSaveState(this.t.save, false), 1400);
    } catch (err) {
      this._setSaveState(`${this.t.saveError}: ${err?.message || err}`, false, true);
    } finally {
      this._saving = false;
    }
  }

  _syncNormalizedControlValues() {
    // Backend may safely clamp values (for example minimum brightness cannot be
    // above maximum brightness). Update only the affected controls, no re-render.
    const s = this._draft?.settings;
    if (!s) return;
    const ids = [
      "update_rate", "transition", "smoothing", "brightness", "minimum_brightness",
      "saturation", "threshold", "black_hold_ms", "fade_to_black", "corner_influence",
    ];
    for (const id of ids) {
      const input = this.shadowRoot?.getElementById(id);
      if (input && s[id] !== undefined) input.value = s[id];
      this._updateRangeOutput(id);
    }
  }

  _setSaveState(text, disabled, error = false) {
    const btn = this.shadowRoot?.getElementById("save");
    if (!btn) return;
    btn.textContent = text;
    btn.disabled = disabled;
    btn.classList.toggle("save-error", error);
  }

  async _refreshStatus() {
    if (!this._hass || !this._entryId || this._loading) return;
    try {
      const status = await this._hass.connection.sendMessagePromise({
        type: "ambilight_sync/get_status",
        entry_id: this._entryId,
      });
      this._lastStatus = status;
      // Only text/classes are updated. The configuration DOM stays untouched.
      this._updateStatusDom(status);
    } catch (_) {
      // Informational only; never damage the editing form because polling failed.
    }
  }

  _updateStatusDom(status) {
    const badge = this.shadowRoot?.getElementById("status-badge");
    const error = this.shadowRoot?.getElementById("status-error");
    if (badge) {
      badge.textContent = status?.running ? this.t.running : this.t.stopped;
      badge.classList.toggle("on", Boolean(status?.running));
    }
    if (error) {
      error.textContent = status?.last_error ? `${this.t.error}: ${status.last_error}` : "";
      error.hidden = !status?.last_error;
    }
  }

  _zoneCard(zone) {
    const t = this.t;
    const assigned = this._draft?.zones?.[zone] || [];
    const options = this._allLights().map((id) => {
      const owner = this._zoneOwner(id);
      const suffix = owner && owner !== zone ? ` · ${t[owner]}` : "";
      return `<option value="${esc(id)}">${esc(this._lightName(id))}${esc(suffix)}</option>`;
    }).join("");

    const chips = assigned.length
      ? assigned.map((id) => `
          <div class="light-chip">
            <span class="dot"></span>
            <span class="light-label"><strong>${esc(this._lightName(id))}</strong><small>${esc(id)}</small></span>
            <button class="chip-remove" data-remove="${esc(id)}" title="${esc(t.remove)}">×</button>
          </div>`).join("")
      : `<div class="empty">${esc(t.noLights)}</div>`;

    return `
      <section class="zone-card">
        <div class="zone-head"><h3>${esc(t[zone])}</h3><span>${assigned.length}</span></div>
        <div class="chips">${chips}</div>
        <select class="add-light" data-zone="${esc(zone)}">
          <option value="">${esc(t.addLight)}</option>
          ${options}
        </select>
      </section>`;
  }

  _range(id, label, min, max, step, value, unit, description = "") {
    return `
      <label class="control range-control">
        <span class="control-title">${esc(label)}</span>
        <div class="range-row">
          <input id="${esc(id)}" type="range" min="${min}" max="${max}" step="${step}" value="${esc(value)}">
          <output id="${esc(id)}_out">${esc(value)}${unit ? ` ${esc(unit)}` : ""}</output>
        </div>
        ${description ? `<small class="help">${esc(description)}</small>` : ""}
      </label>`;
  }

  _rangeUnit(id) {
    const t = this.t;
    return {
      update_rate: t.hz,
      transition: t.sec,
      smoothing: t.percent,
      brightness: t.percent,
      minimum_brightness: t.percent,
      saturation: t.percent,
      threshold: "",
      black_hold_ms: t.ms,
      fade_to_black: t.sec,
      corner_influence: t.percent,
    }[id] ?? "";
  }

  _updateRangeOutput(id) {
    const input = this.shadowRoot?.getElementById(id);
    const output = this.shadowRoot?.getElementById(`${id}_out`);
    if (!input || !output) return;
    const unit = this._rangeUnit(id);
    output.textContent = `${input.value}${unit ? ` ${unit}` : ""}`;
  }

  _updateColorModeDescription() {
    const select = this.shadowRoot?.getElementById("color_mode");
    const help = this.shadowRoot?.getElementById("color_mode_help");
    if (!select || !help) return;
    const key = `${select.value}Desc`;
    help.textContent = this.t[key] || "";
  }

  _wireEvents() {
    const root = this.shadowRoot;
    const entrySelect = root.getElementById("entry-select");
    if (entrySelect) entrySelect.addEventListener("change", () => {
      this._entryId = entrySelect.value;
      const entry = this.currentEntry;
      this._draft = entry ? this._cloneEntry(entry) : null;
      this._lastStatus = entry?.status || null;
      this._render();
    });

    root.querySelectorAll("select.add-light").forEach((select) => {
      select.addEventListener("change", () => {
        const entityId = select.value;
        if (entityId) this._moveLight(entityId, select.dataset.zone);
      });
    });

    root.querySelectorAll("button[data-remove]").forEach((button) => {
      button.addEventListener("click", () => this._removeLight(button.dataset.remove));
    });

    [
      "update_rate", "transition", "smoothing", "brightness", "minimum_brightness",
      "saturation", "threshold", "black_hold_ms", "fade_to_black", "corner_influence",
    ].forEach((id) => {
      const input = root.getElementById(id);
      if (!input) return;
      input.addEventListener("input", () => this._updateRangeOutput(id));
    });

    root.getElementById("color_mode")?.addEventListener("change", () => this._updateColorModeDescription());
    root.getElementById("save")?.addEventListener("click", () => this._save());
  }

  _renderLoading() {
    this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="loading">Ambilight Sync…</div></main>`;
  }

  _renderError(message) {
    this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="error-card">${esc(message)}</div></main>`;
  }

  _render() {
    const t = this.t;
    const entry = this.currentEntry;
    if (!entry || !this._draft) {
      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <main>
          <header><div class="logo">A</div><div><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div></header>
          <div class="empty-state">${esc(t.noEntries)}</div>
        </main>`;
      return;
    }

    const s = this._draft.settings;
    const entries = this._entries.map((e) => `<option value="${esc(e.entry_id)}" ${e.entry_id === this._entryId ? "selected" : ""}>${esc(e.title)}</option>`).join("");
    const status = this._lastStatus || entry.status || {};
    const colorMode = s.color_mode || "average";

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <main>
        <header>
          <div class="logo">A</div>
          <div class="head-copy"><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div>
          <div class="status-wrap">
            <span id="status-badge" class="status-badge ${status.running ? "on" : ""}">${esc(status.running ? t.running : t.stopped)}</span>
            <span id="status-error" class="status-error" ${status.last_error ? "" : "hidden"}>${status.last_error ? esc(`${t.error}: ${status.last_error}`) : ""}</span>
          </div>
        </header>

        <section class="topbar card">
          <label><span>${esc(t.tv)}</span><select id="entry-select">${entries}</select></label>
          <div class="note">${esc(t.note)}</div>
        </section>

        <div class="section-title"><div><h2>${esc(t.zones)}</h2><p>${esc(t.zonesHint)}</p></div></div>
        <div class="zone-grid">${ZONES.map((zone) => this._zoneCard(zone)).join("")}</div>

        <div class="section-title"><div><h2>${esc(t.engine)}</h2></div></div>
        <section class="card settings-grid">
          <label class="control">
            <span class="control-title">${esc(t.source)}</span>
            <select id="source">
              <option value="processed" ${s.source === "processed" ? "selected" : ""}>${esc(t.processed)}</option>
              <option value="measured" ${s.source === "measured" ? "selected" : ""}>${esc(t.measured)}</option>
            </select>
          </label>

          <label class="control">
            <span class="control-title">${esc(t.colorMode)}</span>
            <select id="color_mode">
              <option value="average" ${colorMode === "average" ? "selected" : ""}>${esc(t.average)}</option>
              <option value="perceptual" ${colorMode === "perceptual" ? "selected" : ""}>${esc(t.perceptual)}</option>
              <option value="dominant" ${colorMode === "dominant" ? "selected" : ""}>${esc(t.dominant)}</option>
            </select>
            <small id="color_mode_help" class="help">${esc(t[`${colorMode}Desc`] || "")}</small>
          </label>

          ${this._range("update_rate", t.fps, 1, 30, 1, s.update_rate ?? 15, t.hz)}
          ${this._range("transition", t.transition, 0, 2, 0.1, s.transition ?? 0.1, t.sec)}
          ${this._range("smoothing", t.smoothing, 0, 95, 5, s.smoothing ?? 0, t.percent)}
          ${this._range("brightness", t.brightness, 10, 100, 5, s.brightness ?? 100, t.percent)}
          ${this._range("minimum_brightness", t.minBrightness, 0, 100, 1, s.minimum_brightness ?? 0, t.percent, t.minBrightnessDesc)}
          ${this._range("saturation", t.saturation, 0, 150, 5, s.saturation ?? 100, t.percent)}
          ${this._range("threshold", t.threshold, 0, 100, 1, s.threshold ?? 6, "")}
          ${this._range("black_hold_ms", t.blackHold, 0, 1000, 50, s.black_hold_ms ?? 0, t.ms, t.blackHoldDesc)}
          ${this._range("fade_to_black", t.fadeBlack, 0, 5, 0.1, s.fade_to_black ?? 0, t.sec, t.fadeBlackDesc)}
          ${this._range("corner_influence", t.cornerInfluence, 0, 100, 5, s.corner_influence ?? 35, t.percent, t.cornerInfluenceDesc)}
          <label class="check-row"><input id="restore_on_stop" type="checkbox" ${s.restore_on_stop !== false ? "checked" : ""}><span>${esc(t.restore)}</span></label>
        </section>

        <div class="actions"><button id="save" class="primary">${esc(t.save)}</button></div>
      </main>`;

    this._wireEvents();
  }

  _css() {
    return `
      :host{display:block;min-height:100%;background:var(--primary-background-color);color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}
      *{box-sizing:border-box}main{max-width:1180px;margin:0 auto;padding:30px 24px 70px}header{display:flex;align-items:flex-start;gap:16px;margin-bottom:24px}.logo{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--primary-color);color:#fff;font-size:23px;font-weight:800;flex:none}.head-copy{flex:1}h1{font-size:30px;line-height:1.08;margin:1px 0 6px}h2{font-size:21px;margin:0}h3{font-size:16px;margin:0}p{margin:0;color:var(--secondary-text-color);line-height:1.45}.status-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:7px}.status-badge{padding:8px 12px;border-radius:999px;background:var(--secondary-background-color);font-weight:700;font-size:13px;white-space:nowrap}.status-badge.on{background:color-mix(in srgb,var(--success-color,#43a047) 18%,var(--card-background-color));color:var(--success-color,#43a047)}.status-error{font-size:12px;color:var(--error-color,#db4437);max-width:320px;text-align:right}
      .card,.zone-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;box-shadow:var(--ha-card-box-shadow,none)}.topbar{padding:17px 18px;display:grid;grid-template-columns:minmax(240px,360px) 1fr;gap:22px;align-items:end}.topbar label,.control{display:flex;flex-direction:column;gap:7px}.topbar label>span,.control-title{font-size:12px;font-weight:700;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.035em}.note{font-size:13px;color:var(--secondary-text-color);line-height:1.45}
      select,input[type=range],button{font:inherit}select{width:100%;border:1px solid var(--divider-color);border-radius:10px;padding:10px 11px;background:var(--secondary-background-color);color:var(--primary-text-color);outline:none}select:focus{border-color:var(--primary-color)}
      .section-title{display:flex;justify-content:space-between;align-items:end;margin:30px 2px 13px}.section-title p{margin-top:5px;font-size:13px;max-width:900px}.zone-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.zone-card{padding:16px}.zone-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px}.zone-head span{font-size:12px;color:var(--secondary-text-color);background:var(--secondary-background-color);border-radius:999px;padding:4px 8px}.chips{display:flex;flex-direction:column;gap:8px;min-height:42px;margin-bottom:12px}.light-chip{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:9px 9px 9px 11px;border:1px solid var(--divider-color);border-radius:11px}.dot{width:9px;height:9px;background:var(--primary-color);border-radius:50%}.light-label{min-width:0}.light-label strong,.light-label small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.light-label strong{font-size:14px}.light-label small{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.chip-remove{width:29px;height:29px;border:0;border-radius:8px;background:transparent;color:var(--secondary-text-color);font-size:21px;line-height:1;cursor:pointer}.chip-remove:hover{background:var(--secondary-background-color);color:var(--error-color,#db4437)}.empty{font-size:13px;color:var(--secondary-text-color);padding:10px 1px}
      .settings-grid{padding:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 24px}.range-row{display:grid;grid-template-columns:1fr 76px;gap:12px;align-items:center}.range-row output{text-align:right;font-variant-numeric:tabular-nums;font-size:13px;color:var(--secondary-text-color)}input[type=range]{width:100%;accent-color:var(--primary-color)}.help{display:block;color:var(--secondary-text-color);font-size:12px;line-height:1.45;font-weight:400;text-transform:none;letter-spacing:normal}.check-row{grid-column:1/-1;display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}.check-row input{width:18px;height:18px;accent-color:var(--primary-color)}
      .actions{position:sticky;bottom:0;margin-top:18px;padding:12px 0 0;display:flex;justify-content:flex-end;background:linear-gradient(transparent,var(--primary-background-color) 28%)}button.primary{border:0;border-radius:12px;padding:12px 22px;background:var(--primary-color);color:var(--text-primary-color,#fff);font-weight:800;cursor:pointer;min-width:150px;box-shadow:0 5px 18px rgba(0,0,0,.12)}button.primary:disabled{opacity:.65;cursor:default}.save-error{background:var(--error-color,#db4437)!important;max-width:520px}.loading,.empty-state,.error-card{padding:36px;border-radius:16px;background:var(--card-background-color);border:1px solid var(--divider-color);color:var(--secondary-text-color)}.error-card{color:var(--error-color,#db4437)}
      @media(max-width:900px){.zone-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:760px){main{padding:20px 12px 60px}header{flex-wrap:wrap}.status-wrap{width:100%;align-items:flex-start}.status-error{text-align:left}.topbar{grid-template-columns:1fr}.zone-grid{grid-template-columns:1fr}.settings-grid{grid-template-columns:1fr}.check-row{grid-column:auto}h1{font-size:26px}.actions{padding-bottom:max(8px,env(safe-area-inset-bottom))}}
    `;
  }
}

if (!customElements.get("ambilight-sync-panel")) {
  customElements.define("ambilight-sync-panel", AmbilightSyncPanel);
}
