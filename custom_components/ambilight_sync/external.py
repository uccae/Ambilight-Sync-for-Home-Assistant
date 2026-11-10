"""Compare delayed native light reports against our own outstanding target."""

def changed(old, new):
    if old is None or new is None or old.state in ('unknown','unavailable') or new.state in ('unknown','unavailable'):
        return False
    return old.state != new.state or any(old.attributes.get(k) != new.attributes.get(k) for k in ('brightness','rgb_color','hs_color','xy_color','color_temp_kelvin','effect'))


def matches(state, service, data):
    if service == 'turn_off':
        return state.state == 'off'
    if state.state != 'on':
        return False
    attrs = state.attributes
    if 'brightness' in data and abs(attrs.get('brightness',data['brightness'])-data['brightness']) > 8:
        return False
    if 'rgb_color' in data and attrs.get('rgb_color') is not None:
        if max(abs(a-b) for a,b in zip(attrs['rgb_color'],data['rgb_color'])) > 15:
            return False
    return True
