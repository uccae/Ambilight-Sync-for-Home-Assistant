const TEXT = {
  ru: {
    title: "Ambilight Sync",
    subtitle: "0.2.0",
    tv: "Телевизор",
    running: "Синхронизация включена",
    stopped: "Синхронизация выключена",
    error: "Ошибка",
    note: "Переключатель Sync остаётся обычной сущностью Home Assistant и может быть опубликован в HomeKit. Все настройки находятся здесь.",
    presets: "Пресеты",
    preset: "Редактируемый пресет",
    active: "Активен",
    activate: "Активировать",
    create: "Создать",
    duplicate: "Дублировать",
    rename: "Переименовать",
    delete: "Удалить",
    presetName: "Название пресета",
    duplicateName: "Название копии",
    cannotDeleteLast: "Нельзя удалить последний пресет.",
    confirmDelete: "Удалить этот пресет?",
    serviceHint: "Пресеты также можно переключать из автоматизаций сервисом ambilight_sync.activate_preset.",
    global: "Общие настройки пресета",
    globalHint: "Эти значения наследуют все светильники, пока для конкретного параметра не включён индивидуальный override.",
    source: "Источник цвета",
    processed: "Processed · обработанный Ambilight",
    measured: "Measured · измеренный Ambilight",
    colorMode: "Алгоритм цвета",
    average: "Average · обычное усреднение",
    perceptual: "Perceptual · естественный ambient",
    dominant: "Dominant · выраженный главный цвет",
    averageDesc: "Прямое усреднение RGB. Самый предсказуемый и совместимый режим.",
    perceptualDesc: "Сильнее учитывает видимые и насыщенные цвета, а почти чёрные сегменты меньше загрязняют оттенок. Обычно приятнее для фильмов.",
    dominantDesc: "Группирует близкие оттенки и выбирает наиболее выраженную цветовую группу. Более эффектный режим.",
    pollRate: "Частота опроса TV",
    pollRateDesc: "Как часто считывается свежий Ambilight-кадр с телевизора. Можно опрашивать TV чаще, чем отправлять команды лампам.",
    fps: "Частота отправки лампам",
    fpsDesc: "Максимальная частота команд по умолчанию. Каждый светильник может переопределить её отдельно. Значение выше частоты опроса TV не создаёт дополнительных кадров.",
    transition: "Аппаратный transition",
    smoothing: "Программное сглаживание",
    brightness: "Максимальная яркость",
    minBrightness: "Минимальная яркость",
    saturation: "Насыщенность",
    threshold: "Порог изменения",
    blackHold: "Black hold",
    fadeBlack: "Fade to black",
    cornerInfluence: "Corner influence",
    restore: "Восстанавливать прежнее состояние ламп после выключения Sync",
    lights: "Светильники",
    lightsHint: "У каждого светильника может быть несколько цветовых источников с весами. Например Left 50% + Right 50% для лампы между двумя зонами. Веса нормализуются автоматически.",
    addLight: "Добавить светильник…",
    noLights: "В этом пресете пока нет светильников.",
    removeLight: "Удалить светильник",
    sources: "Источники цвета",
    sourceZone: "Зона",
    weight: "Вес",
    addSource: "+ Добавить источник",
    removeSource: "Удалить источник",
    overrides: "Индивидуальные настройки",
    overridesHint: "Отметь только параметры, которые должны отличаться от общих настроек пресета.",
    override: "Override",
    preview: "Preview",
    input: "Input",
    output: "Output",
    inherited: "из общих",
    save: "Сохранить",
    saving: "Сохраняю…",
    saved: "Сохранено",
    activated: "Активировано",
    loadError: "Не удалось загрузить настройки",
    saveError: "Не удалось сохранить настройки",
    noEntries: "Интеграция ещё не добавлена. Сначала добавь Ambilight Sync в «Устройства и службы» и пройди сопряжение с телевизором.",
    hz: "Гц", sec: "с", ms: "мс", percent: "%",
    left: "Левая сторона", right: "Правая сторона", top: "Верх", bottom: "Низ", all: "Весь экран",
    left_corners: "Левая сторона + углы", right_corners: "Правая сторона + углы",
    top_corners: "Верх + углы", bottom_corners: "Низ + углы",
  },
  en: {
    title: "Ambilight Sync",
    subtitle: "0.2.0",
    tv: "TV",
    running: "Sync is on",
    stopped: "Sync is off",
    error: "Error",
    note: "The Sync switch remains a normal Home Assistant entity and can be exposed to HomeKit. All configuration lives here.",
    presets: "Presets",
    preset: "Preset being edited",
    active: "Active",
    activate: "Activate",
    create: "Create",
    duplicate: "Duplicate",
    rename: "Rename",
    delete: "Delete",
    presetName: "Preset name",
    duplicateName: "Copy name",
    cannotDeleteLast: "The last preset cannot be deleted.",
    confirmDelete: "Delete this preset?",
    serviceHint: "Presets can also be switched from automations with ambilight_sync.activate_preset.",
    global: "Preset global settings",
    globalHint: "Every light inherits these values until an individual override is enabled for that parameter.",
    source: "Color source",
    processed: "Processed · TV processed Ambilight",
    measured: "Measured · measured Ambilight",
    colorMode: "Color algorithm",
    average: "Average · direct averaging",
    perceptual: "Perceptual · natural ambient",
    dominant: "Dominant · strongest color family",
    averageDesc: "Direct RGB averaging. The most predictable and compatible mode.",
    perceptualDesc: "Favors visible saturated colors while near-black samples influence hue less. Usually the most natural movie mode.",
    dominantDesc: "Groups nearby hues and selects the strongest recurring color family. More expressive than Perceptual.",
    pollRate: "TV polling rate",
    pollRateDesc: "How often a fresh Ambilight frame is read from the TV. The TV can be polled faster than commands are sent to lights.",
    fps: "Default light update rate",
    fpsDesc: "Maximum command rate used by default. Each light can override it. A value above the TV polling rate does not create extra frames.",
    transition: "Device transition",
    smoothing: "Software smoothing",
    brightness: "Maximum brightness",
    minBrightness: "Minimum brightness",
    saturation: "Saturation",
    threshold: "Change threshold",
    blackHold: "Black hold",
    fadeBlack: "Fade to black",
    cornerInfluence: "Corner influence",
    restore: "Restore previous light state when Sync stops",
    lights: "Lights",
    lightsHint: "Each light can mix multiple color sources with weights. For example Left 50% + Right 50% for a light placed between both sides. Weights are normalized automatically.",
    addLight: "Add light…",
    noLights: "No lights in this preset yet.",
    removeLight: "Remove light",
    sources: "Color sources",
    sourceZone: "Zone",
    weight: "Weight",
    addSource: "+ Add source",
    removeSource: "Remove source",
    overrides: "Individual settings",
    overridesHint: "Enable only the parameters that should differ from the preset global settings.",
    override: "Override",
    preview: "Preview",
    input: "Input",
    output: "Output",
    inherited: "global",
    save: "Save",
    saving: "Saving…",
    saved: "Saved",
    activated: "Activated",
    loadError: "Could not load settings",
    saveError: "Could not save settings",
    noEntries: "The integration has not been added yet. Add Ambilight Sync in Devices & services and pair the TV first.",
    hz: "Hz", sec: "s", ms: "ms", percent: "%",
    left: "Left side", right: "Right side", top: "Top", bottom: "Bottom", all: "Whole screen",
    left_corners: "Left side + corners", right_corners: "Right side + corners",
    top_corners: "Top + corners", bottom_corners: "Bottom + corners",
  },
};

const ZONES = ["left", "right", "top", "bottom", "all", "left_corners", "right_corners", "top_corners", "bottom_corners"];
const OVERRIDES = ["color_mode", "update_rate", "transition", "smoothing", "brightness", "minimum_brightness", "saturation", "threshold", "black_hold_ms", "fade_to_black", "corner_influence"];
const RANGE_META = {
  poll_rate: [0.25, 30, 0.25, "hz"], update_rate: [0.25, 30, 0.25, "hz"], transition: [0, 2, 0.1, "sec"], smoothing: [0, 95, 5, "percent"],
  brightness: [10, 100, 5, "percent"], minimum_brightness: [0, 100, 1, "percent"], saturation: [0, 150, 5, "percent"],
  threshold: [0, 100, 1, ""], black_hold_ms: [0, 1000, 50, "ms"], fade_to_black: [0, 5, 0.1, "sec"], corner_influence: [0, 100, 5, "percent"],
};

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const clone = (value) => JSON.parse(JSON.stringify(value));

class AmbilightSyncPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._entries = [];
    this._entryId = null;
    this._draft = null;
    this._editPresetId = null;
    this._lastStatus = null;
    this._loading = false;
    this._saving = false;
    this._statusTimer = null;
  }

  set hass(value) {
    const first = !this._hass;
    this._hass = value;
    // Never re-render on routine HA state updates. Native dropdowns stay open.
    if (first && this.isConnected) this._load();
  }
  get hass() { return this._hass; }
  set panel(value) { this._panel = value; }
  get panel() { return this._panel; }

  connectedCallback() {
    if (this._hass && !this._loading && !this._entries.length) this._load();
    if (!this._statusTimer) this._statusTimer = window.setInterval(() => this._refreshStatus(), 1500);
  }
  disconnectedCallback() {
    if (this._statusTimer) window.clearInterval(this._statusTimer);
    this._statusTimer = null;
  }

  get t() {
    const lang = (this._hass?.language || navigator.language || "en").toLowerCase();
    return lang.startsWith("ru") ? TEXT.ru : TEXT.en;
  }
  get currentEntry() { return this._entries.find((e) => e.entry_id === this._entryId) || this._entries[0] || null; }
  get profile() { return this._draft?.profile_config || null; }
  get currentPreset() { return this.profile?.presets?.[this._editPresetId] || null; }

  async _load() {
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._renderLoading();
    try {
      const data = await this._hass.connection.sendMessagePromise({ type: "ambilight_sync/get_config" });
      this._entries = data.entries || [];
      if (!this._entryId || !this._entries.some((e) => e.entry_id === this._entryId)) this._entryId = this._entries[0]?.entry_id || null;
      const entry = this.currentEntry;
      this._draft = entry ? clone(entry) : null;
      this._editPresetId = this.profile?.active_preset || Object.keys(this.profile?.presets || {})[0] || null;
      this._lastStatus = entry?.status || null;
      this._render();
    } catch (err) {
      this._renderError(`${this.t.loadError}: ${err?.message || err}`);
    } finally { this._loading = false; }
  }

  _allLights() {
    if (!this._hass?.states) return [];
    return Object.keys(this._hass.states).filter((id) => id.startsWith("light.")).sort((a,b) => this._lightName(a).localeCompare(this._lightName(b)));
  }
  _lightName(entityId) { return this._hass?.states?.[entityId]?.attributes?.friendly_name || entityId; }
  _presetIds() { return Object.keys(this.profile?.presets || {}); }
  _newPresetId() {
    let id = `p_${Date.now().toString(36)}`;
    let i = 1;
    while (this.profile.presets[id]) id = `p_${Date.now().toString(36)}_${i++}`;
    return id;
  }

  _globalValue(key) { return this.currentPreset?.global?.[key]; }
  _overrideValue(entityId, key) {
    const overrides = this.currentPreset?.lights?.[entityId]?.overrides || {};
    return Object.prototype.hasOwnProperty.call(overrides, key) ? overrides[key] : this._globalValue(key);
  }

  _range(id, label, value, extra = "") {
    const [min,max,step,unitKey] = RANGE_META[id];
    const unit = unitKey ? this.t[unitKey] : "";
    return `<label class="control range-control"><span class="control-title">${esc(label)}</span><div class="range-row"><input id="${esc(id)}" type="range" min="${min}" max="${max}" step="${step}" value="${esc(value)}"><output id="${esc(id)}_out">${esc(value)}${unit ? ` ${esc(unit)}` : ""}</output></div>${extra}</label>`;
  }

  _overrideRange(entityId, key, label) {
    const overrides = this.currentPreset?.lights?.[entityId]?.overrides || {};
    const enabled = Object.prototype.hasOwnProperty.call(overrides, key);
    const value = enabled ? overrides[key] : this._globalValue(key);
    const [min,max,step,unitKey] = RANGE_META[key];
    const unit = unitKey ? this.t[unitKey] : "";
    return `<div class="override-row" data-override-row="${esc(key)}"><label class="override-check"><input type="checkbox" data-override-check="${esc(key)}" ${enabled ? "checked" : ""}><span>${esc(label)}</span></label><div class="range-row"><input type="range" data-override-value="${esc(key)}" min="${min}" max="${max}" step="${step}" value="${esc(value)}" ${enabled ? "" : "disabled"}><output data-override-out="${esc(key)}">${esc(value)}${unit ? ` ${esc(unit)}` : ""}</output></div></div>`;
  }

  _overrideColorMode(entityId) {
    const overrides = this.currentPreset?.lights?.[entityId]?.overrides || {};
    const enabled = Object.prototype.hasOwnProperty.call(overrides, "color_mode");
    const value = enabled ? overrides.color_mode : this._globalValue("color_mode");
    return `<div class="override-row"><label class="override-check"><input type="checkbox" data-override-check="color_mode" ${enabled ? "checked" : ""}><span>${esc(this.t.colorMode)}</span></label><select data-override-value="color_mode" ${enabled ? "" : "disabled"}><option value="average" ${value === "average" ? "selected" : ""}>${esc(this.t.average)}</option><option value="perceptual" ${value === "perceptual" ? "selected" : ""}>${esc(this.t.perceptual)}</option><option value="dominant" ${value === "dominant" ? "selected" : ""}>${esc(this.t.dominant)}</option></select></div>`;
  }

  _zoneOptions(selected) {
    return ZONES.map((zone) => `<option value="${zone}" ${zone === selected ? "selected" : ""}>${esc(this.t[zone])}</option>`).join("");
  }

  _lightCard(entityId) {
    const t = this.t;
    const cfg = this.currentPreset.lights[entityId];
    const sources = cfg.sources || [];
    const preview = this.profile?.active_preset === this._editPresetId ? (this._lastStatus?.previews?.[entityId] || null) : null;
    const rgb = preview?.output_rgb || [60,60,60];
    const inputRgb = preview?.input_rgb || null;
    const sourceRows = sources.map((source, index) => `<div class="source-row" data-source-index="${index}"><select data-source-zone>${this._zoneOptions(source.zone)}</select><label class="weight"><input data-source-weight type="number" min="1" max="1000" step="1" value="${esc(source.weight ?? 100)}"><span>%</span></label><button class="icon-btn" data-remove-source="${index}" title="${esc(t.removeSource)}">×</button></div>`).join("");
    const overrideCount = Object.keys(cfg.overrides || {}).length;

    return `<section class="light-card" data-light-card data-entity="${esc(entityId)}">
      <div class="light-head"><div class="preview-dot" data-preview="${esc(entityId)}" style="background:rgb(${rgb.join(",")})"></div><div class="light-name"><strong>${esc(this._lightName(entityId))}</strong><small>${esc(entityId)}</small></div><button class="remove-light" data-remove-light="${esc(entityId)}">${esc(t.removeLight)}</button></div>
      <div class="preview-line"><span>${esc(t.preview)}</span><span data-preview-text="${esc(entityId)}">${inputRgb ? `${t.input} rgb(${inputRgb.join(", ")}) · ${t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0) / 255 * 100)}%` : "—"}</span></div>
      <div class="subhead"><strong>${esc(t.sources)}</strong></div>
      <div class="source-list">${sourceRows}</div>
      <button class="secondary add-source" data-add-source="${esc(entityId)}">${esc(t.addSource)}</button>
      <details class="override-box"><summary>${esc(t.overrides)}${overrideCount ? ` · ${overrideCount}` : ""}</summary><p>${esc(t.overridesHint)}</p><div class="override-grid">
        ${this._overrideColorMode(entityId)}
        ${this._overrideRange(entityId, "update_rate", t.fps)}
        ${this._overrideRange(entityId, "transition", t.transition)}
        ${this._overrideRange(entityId, "smoothing", t.smoothing)}
        ${this._overrideRange(entityId, "brightness", t.brightness)}
        ${this._overrideRange(entityId, "minimum_brightness", t.minBrightness)}
        ${this._overrideRange(entityId, "saturation", t.saturation)}
        ${this._overrideRange(entityId, "threshold", t.threshold)}
        ${this._overrideRange(entityId, "black_hold_ms", t.blackHold)}
        ${this._overrideRange(entityId, "fade_to_black", t.fadeBlack)}
        ${this._overrideRange(entityId, "corner_influence", t.cornerInfluence)}
      </div></details>
    </section>`;
  }

  _readCurrentPresetControls() {
    const preset = this.currentPreset;
    if (!preset || !this.shadowRoot?.getElementById("update_rate")) return;
    const root = this.shadowRoot;
    const g = preset.global;
    g.source = root.getElementById("source").value;
    g.color_mode = root.getElementById("color_mode").value;
    ["poll_rate","update_rate","transition","smoothing","brightness","minimum_brightness","saturation","threshold","black_hold_ms","fade_to_black","corner_influence"].forEach((key) => { g[key] = Number(root.getElementById(key).value); });
    g.restore_on_stop = root.getElementById("restore_on_stop").checked;

    root.querySelectorAll("[data-light-card]").forEach((card) => {
      const entityId = card.dataset.entity;
      const light = preset.lights[entityId];
      if (!light) return;
      light.sources = [...card.querySelectorAll(".source-row")].map((row) => ({ zone: row.querySelector("[data-source-zone]").value, weight: Number(row.querySelector("[data-source-weight]").value) || 0 })).filter((source) => source.weight > 0);
      const overrides = {};
      card.querySelectorAll("[data-override-check]").forEach((check) => {
        if (!check.checked) return;
        const key = check.dataset.overrideCheck;
        const input = card.querySelector(`[data-override-value="${CSS.escape(key)}"]`);
        overrides[key] = key === "color_mode" ? input.value : Number(input.value);
      });
      light.overrides = overrides;
    });
  }

  _switchEditPreset(id) {
    this._readCurrentPresetControls();
    if (this.profile?.presets?.[id]) { this._editPresetId = id; this._render(); }
  }

  _createPreset(duplicate = false) {
    this._readCurrentPresetControls();
    const t = this.t;
    const proposed = duplicate ? `${this.currentPreset?.name || "Preset"} copy` : "New preset";
    const name = window.prompt(duplicate ? t.duplicateName : t.presetName, proposed);
    if (!name?.trim()) return;
    const id = this._newPresetId();
    if (duplicate && this.currentPreset) {
      this.profile.presets[id] = clone(this.currentPreset);
      this.profile.presets[id].name = name.trim();
    } else {
      this.profile.presets[id] = { name: name.trim(), global: clone(this.currentPreset?.global || {}), lights: {} };
    }
    this._editPresetId = id;
    this._render();
  }

  _renamePreset() {
    this._readCurrentPresetControls();
    if (!this.currentPreset) return;
    const name = window.prompt(this.t.presetName, this.currentPreset.name);
    if (!name?.trim()) return;
    this.currentPreset.name = name.trim();
    this._render();
  }

  _deletePreset() {
    this._readCurrentPresetControls();
    const ids = this._presetIds();
    if (ids.length <= 1) { window.alert(this.t.cannotDeleteLast); return; }
    if (!window.confirm(this.t.confirmDelete)) return;
    const deleting = this._editPresetId;
    delete this.profile.presets[deleting];
    const next = Object.keys(this.profile.presets)[0];
    if (this.profile.active_preset === deleting) this.profile.active_preset = next;
    this._editPresetId = next;
    this._render();
  }

  _addLight(entityId) {
    this._readCurrentPresetControls();
    if (!entityId || !this.currentPreset || this.currentPreset.lights[entityId]) return;
    this.currentPreset.lights[entityId] = { sources: [{ zone: "all", weight: 100 }], overrides: {} };
    this._render();
  }
  _removeLight(entityId) { this._readCurrentPresetControls(); if (this.currentPreset?.lights?.[entityId]) { delete this.currentPreset.lights[entityId]; this._render(); } }
  _addSource(entityId) { this._readCurrentPresetControls(); const l=this.currentPreset?.lights?.[entityId]; if(l){ l.sources ||= []; l.sources.push({zone:"all",weight:100}); this._render(); } }
  _removeSource(entityId,index) { this._readCurrentPresetControls(); const l=this.currentPreset?.lights?.[entityId]; if(!l) return; if((l.sources||[]).length<=1) return; l.sources.splice(index,1); this._render(); }

  async _save(activate = false) {
    if (!this.currentEntry || !this.profile || this._saving) return;
    this._readCurrentPresetControls();
    if (activate) this.profile.active_preset = this._editPresetId;
    this._saving = true;
    this._setSaveState(this.t.saving, true);
    try {
      const updated = await this._hass.connection.sendMessagePromise({ type:"ambilight_sync/save_profile_config", entry_id:this.currentEntry.entry_id, profile_config:this.profile });
      const idx = this._entries.findIndex((e) => e.entry_id === updated.entry_id);
      if (idx >= 0) this._entries[idx] = updated;
      this._draft = clone(updated);
      this._lastStatus = updated.status;
      if (!this.profile.presets[this._editPresetId]) this._editPresetId = this.profile.active_preset;
      this._updateStatusDom(updated.status);
      this._setSaveState(activate ? this.t.activated : this.t.saved, false);
      this._updatePresetBadge();
      window.setTimeout(() => this._setSaveState(this.t.save, false), 1400);
    } catch (err) {
      this._setSaveState(`${this.t.saveError}: ${err?.message || err}`, false, true);
    } finally { this._saving = false; }
  }

  async _refreshStatus() {
    if (!this._hass || !this._entryId || this._loading) return;
    try {
      const status = await this._hass.connection.sendMessagePromise({ type:"ambilight_sync/get_status", entry_id:this._entryId });
      this._lastStatus = status;
      if (status?.active_preset && this.profile?.presets?.[status.active_preset]) {
        this.profile.active_preset = status.active_preset;
        this._updatePresetBadge();
      }
      this._updateStatusDom(status);
      this._updatePreviewDom(status.previews || {});
    } catch (_) {}
  }

  _updateStatusDom(status) {
    const badge = this.shadowRoot?.getElementById("status-badge");
    const error = this.shadowRoot?.getElementById("status-error");
    if (badge) { badge.textContent = status?.running ? this.t.running : this.t.stopped; badge.classList.toggle("on", Boolean(status?.running)); }
    if (error) { error.textContent = status?.last_error ? `${this.t.error}: ${status.last_error}` : ""; error.hidden = !status?.last_error; }
  }

  _updatePreviewDom(previews) {
    if (this.profile?.active_preset !== this._editPresetId) return;
    for (const [entityId, preview] of Object.entries(previews)) {
      const dot = [...(this.shadowRoot?.querySelectorAll("[data-preview]") || [])].find((el) => el.dataset.preview === entityId);
      const text = [...(this.shadowRoot?.querySelectorAll("[data-preview-text]") || [])].find((el) => el.dataset.previewText === entityId);
      const rgb = preview.output_rgb || [0,0,0];
      if (dot) dot.style.background = `rgb(${rgb.join(",")})`;
      if (text) { const input = preview.input_rgb || [0,0,0]; text.textContent = `${this.t.input} rgb(${input.join(", ")}) · ${this.t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0)/255*100)}%`; }
    }
  }

  _updatePresetBadge() {
    const badge = this.shadowRoot?.getElementById("active-preset-badge");
    if (!badge) return;
    const isActive = this.profile?.active_preset === this._editPresetId;
    badge.hidden = !isActive;
    const activate = this.shadowRoot?.getElementById("activate-preset");
    if (activate) activate.disabled = isActive;
  }

  _setSaveState(text, disabled, error=false) {
    const btn = this.shadowRoot?.getElementById("save");
    if (!btn) return;
    btn.textContent = text; btn.disabled = disabled; btn.classList.toggle("save-error", error);
  }

  _updateRangeOutput(input) {
    const key = input.id || input.dataset.overrideValue;
    const meta = RANGE_META[key];
    if (!meta) return;
    const unit = meta[3] ? this.t[meta[3]] : "";
    let output = null;
    if (input.id) output = this.shadowRoot.getElementById(`${input.id}_out`);
    else output = input.closest(".override-row")?.querySelector("[data-override-out]");
    if (output) output.textContent = `${input.value}${unit ? ` ${unit}` : ""}`;
  }

  _syncInheritedOverrideValues(key) {
    const globalInput = this.shadowRoot?.getElementById(key);
    if (!globalInput) return;
    this.shadowRoot.querySelectorAll(`[data-override-check="${CSS.escape(key)}"]`).forEach((check) => {
      if (check.checked) return;
      const card = check.closest("[data-light-card]");
      const input = card?.querySelector(`[data-override-value="${CSS.escape(key)}"]`);
      if (!input) return;
      input.value = globalInput.value;
      if (input.type === "range") this._updateRangeOutput(input);
    });
  }

  _wireEvents() {
    const root = this.shadowRoot;
    root.getElementById("entry-select")?.addEventListener("change", (e) => {
      this._readCurrentPresetControls();
      this._entryId = e.target.value;
      const entry = this.currentEntry;
      this._draft = entry ? clone(entry) : null;
      this._editPresetId = this.profile?.active_preset || Object.keys(this.profile?.presets || {})[0] || null;
      this._lastStatus = entry?.status || null;
      this._render();
    });
    root.getElementById("preset-select")?.addEventListener("change", (e) => this._switchEditPreset(e.target.value));
    root.getElementById("create-preset")?.addEventListener("click", () => this._createPreset(false));
    root.getElementById("duplicate-preset")?.addEventListener("click", () => this._createPreset(true));
    root.getElementById("rename-preset")?.addEventListener("click", () => this._renamePreset());
    root.getElementById("delete-preset")?.addEventListener("click", () => this._deletePreset());
    root.getElementById("activate-preset")?.addEventListener("click", () => this._save(true));
    root.getElementById("save")?.addEventListener("click", () => this._save(false));
    root.getElementById("add-light")?.addEventListener("change", (e) => { const id=e.target.value; if(id) this._addLight(id); });

    ["poll_rate","update_rate","transition","smoothing","brightness","minimum_brightness","saturation","threshold","black_hold_ms","fade_to_black","corner_influence"].forEach((key) => {
      const input = root.getElementById(key);
      input?.addEventListener("input", () => { this._updateRangeOutput(input); this._syncInheritedOverrideValues(key); });
    });
    root.getElementById("color_mode")?.addEventListener("change", () => {
      const select=root.getElementById("color_mode"); const help=root.getElementById("color_mode_help"); if(help) help.textContent=this.t[`${select.value}Desc`] || "";
      this._syncInheritedOverrideValues("color_mode");
    });

    root.querySelectorAll("[data-remove-light]").forEach((b) => b.addEventListener("click", () => this._removeLight(b.dataset.removeLight)));
    root.querySelectorAll("[data-add-source]").forEach((b) => b.addEventListener("click", () => this._addSource(b.dataset.addSource)));
    root.querySelectorAll("[data-remove-source]").forEach((b) => b.addEventListener("click", () => this._removeSource(b.closest("[data-light-card]").dataset.entity, Number(b.dataset.removeSource))));

    root.querySelectorAll("[data-override-check]").forEach((check) => check.addEventListener("change", () => {
      const card=check.closest("[data-light-card]"); const key=check.dataset.overrideCheck; const input=card.querySelector(`[data-override-value="${CSS.escape(key)}"]`); if(input) input.disabled=!check.checked;
    }));
    root.querySelectorAll('input[type="range"][data-override-value]').forEach((input) => input.addEventListener("input", () => this._updateRangeOutput(input)));
  }

  _renderLoading() { this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="loading">Ambilight Sync…</div></main>`; }
  _renderError(message) { this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="error-card">${esc(message)}</div></main>`; }

  _render() {
    const t = this.t;
    const entry = this.currentEntry;
    if (!entry || !this.profile || !this.currentPreset) {
      this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><header><div class="logo">A</div><div><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div></header><div class="empty-state">${esc(t.noEntries)}</div></main>`;
      return;
    }

    const status = this._lastStatus || entry.status || {};
    const preset = this.currentPreset;
    const g = preset.global;
    const entryOptions = this._entries.map((e) => `<option value="${esc(e.entry_id)}" ${e.entry_id === this._entryId ? "selected" : ""}>${esc(e.title)}</option>`).join("");
    const presetOptions = this._presetIds().map((id) => `<option value="${esc(id)}" ${id === this._editPresetId ? "selected" : ""}>${esc(this.profile.presets[id].name)}</option>`).join("");
    const isActive = this.profile.active_preset === this._editPresetId;
    const usedLights = new Set(Object.keys(preset.lights || {}));
    const availableLights = this._allLights().filter((id) => !usedLights.has(id)).map((id) => `<option value="${esc(id)}">${esc(this._lightName(id))}</option>`).join("");
    const lightCards = Object.keys(preset.lights || {}).sort((a,b) => this._lightName(a).localeCompare(this._lightName(b))).map((id) => this._lightCard(id)).join("");
    const colorMode = g.color_mode || "average";

    this.shadowRoot.innerHTML = `<style>${this._css()}</style><main>
      <header><div class="logo">A</div><div class="head-copy"><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div><div class="status-wrap"><span id="status-badge" class="status-badge ${status.running ? "on" : ""}">${esc(status.running ? t.running : t.stopped)}</span><span id="status-error" class="status-error" ${status.last_error ? "" : "hidden"}>${status.last_error ? esc(`${t.error}: ${status.last_error}`) : ""}</span></div></header>

      <section class="topbar card"><label><span>${esc(t.tv)}</span><select id="entry-select">${entryOptions}</select></label><div class="note">${esc(t.note)}</div></section>

      <div class="section-title"><div><h2>${esc(t.presets)}</h2><p>${esc(t.serviceHint)}</p></div></div>
      <section class="card preset-card"><label class="preset-select-wrap"><span>${esc(t.preset)}</span><div class="preset-select-line"><select id="preset-select">${presetOptions}</select><span id="active-preset-badge" class="active-badge" ${isActive ? "" : "hidden"}>${esc(t.active)}</span></div></label><div class="preset-actions"><button id="create-preset" class="secondary">${esc(t.create)}</button><button id="duplicate-preset" class="secondary">${esc(t.duplicate)}</button><button id="rename-preset" class="secondary">${esc(t.rename)}</button><button id="delete-preset" class="secondary danger">${esc(t.delete)}</button><button id="activate-preset" class="secondary accent" ${isActive ? "disabled" : ""}>${esc(t.activate)}</button></div></section>

      <div class="section-title"><div><h2>${esc(t.global)}</h2><p>${esc(t.globalHint)}</p></div></div>
      <section class="card settings-grid">
        <label class="control"><span class="control-title">${esc(t.source)}</span><select id="source"><option value="processed" ${g.source === "processed" ? "selected" : ""}>${esc(t.processed)}</option><option value="measured" ${g.source === "measured" ? "selected" : ""}>${esc(t.measured)}</option></select></label>
        <label class="control"><span class="control-title">${esc(t.colorMode)}</span><select id="color_mode"><option value="average" ${colorMode === "average" ? "selected" : ""}>${esc(t.average)}</option><option value="perceptual" ${colorMode === "perceptual" ? "selected" : ""}>${esc(t.perceptual)}</option><option value="dominant" ${colorMode === "dominant" ? "selected" : ""}>${esc(t.dominant)}</option></select><small id="color_mode_help" class="help">${esc(t[`${colorMode}Desc`] || "")}</small></label>
        ${this._range("poll_rate", t.pollRate, g.poll_rate, `<small class="help">${esc(t.pollRateDesc)}</small>`)}${this._range("update_rate", t.fps, g.update_rate, `<small class="help">${esc(t.fpsDesc)}</small>`)}${this._range("transition", t.transition, g.transition)}${this._range("smoothing", t.smoothing, g.smoothing)}${this._range("brightness", t.brightness, g.brightness)}${this._range("minimum_brightness", t.minBrightness, g.minimum_brightness)}${this._range("saturation", t.saturation, g.saturation)}${this._range("threshold", t.threshold, g.threshold)}${this._range("black_hold_ms", t.blackHold, g.black_hold_ms)}${this._range("fade_to_black", t.fadeBlack, g.fade_to_black)}${this._range("corner_influence", t.cornerInfluence, g.corner_influence)}
        <label class="check-row"><input id="restore_on_stop" type="checkbox" ${g.restore_on_stop !== false ? "checked" : ""}><span>${esc(t.restore)}</span></label>
      </section>

      <div class="section-title lights-title"><div><h2>${esc(t.lights)}</h2><p>${esc(t.lightsHint)}</p></div><select id="add-light"><option value="">${esc(t.addLight)}</option>${availableLights}</select></div>
      <div class="lights-grid">${lightCards || `<div class="empty-state">${esc(t.noLights)}</div>`}</div>

      <div class="actions"><button id="save" class="primary">${esc(t.save)}</button></div>
    </main>`;
    this._wireEvents();
  }

  _css() { return `
    :host{display:block;min-height:100%;background:var(--primary-background-color);color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}*{box-sizing:border-box}
    main{max-width:1220px;margin:0 auto;padding:30px 24px 76px}header{display:flex;align-items:flex-start;gap:16px;margin-bottom:24px}.logo{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--primary-color);color:#fff;font-size:23px;font-weight:800;flex:none}.head-copy{flex:1}h1{font-size:30px;line-height:1.08;margin:1px 0 6px}h2{font-size:21px;margin:0}p{margin:0;color:var(--secondary-text-color);line-height:1.45}.status-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:7px}.status-badge{padding:8px 12px;border-radius:999px;background:var(--secondary-background-color);font-weight:700;font-size:13px;white-space:nowrap}.status-badge.on{background:color-mix(in srgb,var(--success-color,#43a047) 18%,var(--card-background-color));color:var(--success-color,#43a047)}.status-error{font-size:12px;color:var(--error-color,#db4437);max-width:360px;text-align:right}
    .card,.light-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;box-shadow:var(--ha-card-box-shadow,none)}.topbar{padding:17px 18px;display:grid;grid-template-columns:minmax(240px,360px) 1fr;gap:22px;align-items:end}.topbar label,.control,.preset-select-wrap{display:flex;flex-direction:column;gap:7px}.topbar label>span,.control-title,.preset-select-wrap>span{font-size:12px;font-weight:700;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.035em}.note{font-size:13px;color:var(--secondary-text-color);line-height:1.45}
    select,input,button{font:inherit}select,input[type=number]{border:1px solid var(--divider-color);border-radius:10px;padding:10px 11px;background:var(--secondary-background-color);color:var(--primary-text-color);outline:none}select:focus,input[type=number]:focus{border-color:var(--primary-color)}button{cursor:pointer}.section-title{display:flex;justify-content:space-between;gap:20px;align-items:end;margin:30px 2px 13px}.section-title p{margin-top:5px;font-size:13px;max-width:900px}.lights-title select{width:min(320px,42vw)}
    .preset-card{padding:17px 18px;display:grid;grid-template-columns:minmax(260px,390px) 1fr;gap:18px;align-items:end}.preset-select-line{display:flex;gap:10px;align-items:center}.preset-select-line select{flex:1}.active-badge{padding:7px 10px;border-radius:999px;background:color-mix(in srgb,var(--success-color,#43a047) 18%,var(--card-background-color));color:var(--success-color,#43a047);font-size:12px;font-weight:800}.preset-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.secondary{border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);font-weight:650}.secondary:hover{border-color:var(--primary-color)}.secondary:disabled{opacity:.45;cursor:default}.secondary.accent{border-color:var(--primary-color);color:var(--primary-color)}.secondary.danger{color:var(--error-color,#db4437)}
    .settings-grid{padding:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 24px}.range-row{display:grid;grid-template-columns:1fr 76px;gap:12px;align-items:center}.range-row output{text-align:right;font-variant-numeric:tabular-nums;font-size:13px;color:var(--secondary-text-color)}input[type=range]{width:100%;accent-color:var(--primary-color)}.help{display:block;color:var(--secondary-text-color);font-size:12px;line-height:1.45;font-weight:400;text-transform:none;letter-spacing:normal}.check-row{grid-column:1/-1;display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}.check-row input,.override-check input{width:18px;height:18px;accent-color:var(--primary-color)}
    .lights-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.light-card{padding:17px}.light-head{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center}.preview-dot{width:28px;height:28px;border-radius:50%;box-shadow:0 0 0 1px var(--divider-color),0 3px 12px rgba(0,0,0,.18)}.light-name{min-width:0}.light-name strong,.light-name small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.light-name small{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.remove-light{border:0;background:transparent;color:var(--error-color,#db4437);font-size:12px}.preview-line{display:flex;justify-content:space-between;gap:16px;margin:12px 0 16px;padding:8px 10px;border-radius:10px;background:var(--secondary-background-color);font-size:11px;color:var(--secondary-text-color)}.preview-line span:last-child{text-align:right}.subhead{font-size:12px;text-transform:uppercase;letter-spacing:.035em;color:var(--secondary-text-color);margin-bottom:8px}.source-list{display:flex;flex-direction:column;gap:7px}.source-row{display:grid;grid-template-columns:1fr 100px 34px;gap:7px;align-items:center}.weight{display:flex;align-items:center;gap:4px}.weight input{width:100%;min-width:0}.weight span{font-size:12px;color:var(--secondary-text-color)}.icon-btn{width:34px;height:34px;border:0;border-radius:9px;background:transparent;color:var(--secondary-text-color);font-size:20px}.icon-btn:hover{background:var(--secondary-background-color);color:var(--error-color,#db4437)}.add-source{margin-top:8px;width:100%}
    .override-box{margin-top:15px;border-top:1px solid var(--divider-color);padding-top:12px}.override-box summary{cursor:pointer;font-weight:750;font-size:14px}.override-box>p{font-size:12px;margin:8px 0 12px}.override-grid{display:flex;flex-direction:column;gap:10px}.override-row{display:grid;grid-template-columns:minmax(150px,.8fr) minmax(180px,1.2fr);gap:12px;align-items:center}.override-check{display:flex;align-items:center;gap:8px;font-size:13px}.override-row select{width:100%}.override-row input:disabled,.override-row select:disabled{opacity:.5}.override-row .range-row{grid-template-columns:1fr 62px}
    .actions{position:sticky;bottom:0;margin-top:20px;padding:12px 0 0;display:flex;justify-content:flex-end;background:linear-gradient(transparent,var(--primary-background-color) 28%)}button.primary{border:0;border-radius:12px;padding:12px 24px;background:var(--primary-color);color:var(--text-primary-color,#fff);font-weight:800;min-width:160px;box-shadow:0 5px 18px rgba(0,0,0,.12)}button.primary:disabled{opacity:.65;cursor:default}.save-error{background:var(--error-color,#db4437)!important;max-width:520px}.loading,.empty-state,.error-card{padding:32px;border-radius:16px;background:var(--card-background-color);border:1px solid var(--divider-color);color:var(--secondary-text-color)}.error-card{color:var(--error-color,#db4437)}
    @media(max-width:900px){.lights-grid{grid-template-columns:1fr}.preset-card{grid-template-columns:1fr}.preset-actions{justify-content:flex-start}}
    @media(max-width:760px){main{padding:20px 12px 60px}header{flex-wrap:wrap}.status-wrap{width:100%;align-items:flex-start}.status-error{text-align:left}.topbar,.settings-grid{grid-template-columns:1fr}.check-row{grid-column:auto}.section-title{align-items:stretch;flex-direction:column}.lights-title select{width:100%}.override-row{grid-template-columns:1fr}.source-row{grid-template-columns:1fr 88px 34px}h1{font-size:26px}.actions{padding-bottom:max(8px,env(safe-area-inset-bottom))}}
  `; }
}

if (!customElements.get("ambilight-sync-panel")) customElements.define("ambilight-sync-panel", AmbilightSyncPanel);
