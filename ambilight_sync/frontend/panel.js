const TEXT = {
  ru: {
    title: "Ambilight Sync",
    subtitle: "0.4.0",
    basics: "Основные", speed: "Скорость и плавность", spatialSettings: "Пространственное смешивание",
    intensity: "Интенсивность", intensityDesc: "Усиление яркости до 4×: 100% сохраняет прежний уровень, 200% — вдвое, 400% — вчетверо. Минимум и максимум ограничивают результат: на этих границах изменение может быть незаметно. Цвет не меняется.",
    processedDesc: "Рекомендуется. Обработанные Philips цвета, обычно более насыщенные и ближе к встроенному Ambilight.",
    measuredDesc: "Более сырые цвета изображения, на некоторых телевизорах заметно бледнее. Меньшая задержка не гарантируется.",
    spatialSettingsDesc: "Corner influence применяется к Manual-зонам с углами. X/Y, spread и Manual mapping настраиваются в группе «Позиционирование» каждого светильника.",
    debug: "Debug · Алгоритмы и диагностика", debugHint: "Для диагностики тёмного цветового шума. Изменения применяются только после сохранения.",
    neutralStrength: "Стабилизация тёмных цветов", neutralStrengthDesc: "Плавно подавляет слабый цветовой шум перед нормализацией RGB. 0% отключает; 100% — рекомендуемая сила. Уверенные насыщенные цвета сохраняются.",
    neutralNoise: "Уровень шума RGB", neutralNoiseDesc: "Уровень 8-битного шума, по умолчанию 3. Чем больше, тем шире область стабилизации в тёмных кадрах. 0 отключает стабилизацию.",
    debugReset: "Вернуть рекомендуемые значения", debugWaiting: "Диагностика появится после обновления backend и включения Sync.",
    debugPipeline: "Этапы цветового вывода", info: "Подробнее", darkShort: "Выключение используется только при Minimum brightness = 0%.",
    tv: "Телевизор",
    running: "Синхронизация включена",
    stopped: "Синхронизация выключена",
    error: "Ошибка",
    syncControl: "Синхронизация",
    turnOn: "Включить",
    turnOff: "Выключить",
    syncHint: "Этот же переключатель остаётся обычной сущностью Home Assistant и по-прежнему может быть опубликован в HomeKit.",
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
    processed: "Processed — цвета Ambilight · рекомендуется",
    measured: "Measured — цвета изображения",
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
    blackThreshold: "Black threshold",
    blackThresholdDesc: "Чёрный определяется по сырым Ambilight-сегментам до Average/Perceptual/Dominant. 0% означает только точный чёрный. При значении выше 0 используется небольшой пропорциональный hysteresis.",
    blackHold: "Задержка перед затемнением",
    blackHoldDesc: "Сколько чёрный должен непрерывно продержаться до старта затемнения. 0 мс = реагировать сразу. При Minimum brightness = 0% полное выключение произойдёт через эту задержку + Transition затемнения + Задержку перед выключением.",
    fadeBlack: "Transition затемнения",
    fadeBlackDesc: "Длительность одной аппаратной команды затемнения до Minimum brightness (или 1%).",
    offDelay: "Задержка перед выключением",
    offDelayDesc: "После достижения 1% яркости лампа остаётся включённой ещё это время и только затем выключается. Используется только при Minimum brightness = 0%.",
    sceneCuts: "Резкие смены сцен",
    sceneCutsHint: "При большом скачке цвета команда отправляется немедленно, в обход обычной частоты, smoothing и change threshold. Возврат из black-cycle имеет тот же приоритет.",
    sceneCutThreshold: "Scene-cut threshold",
    sceneCutThresholdDesc: "Чувствительность к резкой смене сцены. 0% отключает детектор; меньшее значение реагирует чаще.",
    sceneCutTransition: "Scene-cut transition",
    sceneCutTransitionDesc: "Короткий аппаратный transition для резкой смены сцены или мгновенного выхода из black-cycle.",
    darkScenes: "Тёмные сцены",
    darkScenesHint: "Порог определяет black; задержка фильтрует короткие тёмные кадры; transition быстро опускает яркость до minimum/1%; Off delay задаёт паузу на 1% перед выключением.",
    saveHint: "Изменения настроек применяются после сохранения.",
    cornerInfluence: "Corner influence",
    restore: "Восстанавливать прежнее состояние ламп после выключения Sync",
    lights: "Светильники",
    lightsHint: "У каждого светильника может быть несколько цветовых источников с весами. Например Left 50% + Right 50% для лампы между двумя зонами. Веса нормализуются автоматически.",
    addLight: "Добавить светильник…",
    noLights: "В этом пресете пока нет светильников.",
    removeLight: "Удалить светильник",
    positioning: "Позиционирование",
    positionMode: "Режим позиции",
    spatial: "Spatial · автоматически",
    manual: "Manual · вручную",
    spatialDesc: "X/Y используют отдельные физические Ambilight-сегменты телевизора и смешивают их по расстоянию. Это точнее, чем усреднение целых сторон.",
    zoneFalloff: "Zone falloff / spread",
    zoneFalloffDesc: "Насколько широкую область периметра видит светильник. Меньше = ближайшие сегменты, больше = более широкий ambient-микс.",
    spreadInfluence: "Реальное влияние сегментов",
    spreadWaiting: "Визуализация появится после получения Ambilight-кадра.",
    manualDesc: "Расширенный режим: зоны и веса задаются вручную.",
    positionX: "X · слева ↔ справа",
    positionY: "Y · сверху ↔ снизу",
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
    diagnostics: "Диагностика",
    tvDiagnostics: "TV polling",
    targetRate: "цель",
    queuedRate: "queued",
    actualRate: "факт",
    replaced: "заменено",
    latency: "latency",
    errorsCount: "ошибок",
    stuckProcessed: "processed долго отдаёт 0,0,0",
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
    subtitle: "0.4.0",
    basics: "Basics", speed: "Speed & smoothing", spatialSettings: "Spatial mixing",
    intensity: "Intensity", intensityDesc: "Brightness gain up to 4×: 100% keeps the previous level, 200% doubles it, 400% quadruples it. Minimum and maximum clamp the result, so changes at those limits may not be visible. Color is unchanged.",
    processedDesc: "Recommended. Philips-processed colors, usually more saturated and closer to the TV's built-in Ambilight.",
    measuredDesc: "Rawer image colors; these can look noticeably paler on some TVs. Lower latency is not guaranteed.",
    spatialSettingsDesc: "Corner influence affects Manual corner zones. Set X/Y, spread and Manual mapping in each light's Positioning group.",
    debug: "Debug · Algorithms & diagnostics", debugHint: "For diagnosing dark color noise. Changes take effect only after Save.",
    neutralStrength: "Dark color stabilization", neutralStrengthDesc: "Smoothly suppresses uncertain chroma before RGB normalization. 0% disables; 100% is recommended. Confident saturated colors are retained.",
    neutralNoise: "RGB noise floor", neutralNoiseDesc: "8-bit noise level, default 3. Higher values broaden stabilization in dark frames. 0 disables stabilization.",
    debugReset: "Restore recommended values", debugWaiting: "Diagnostics appear after updating the backend and enabling Sync.",
    debugPipeline: "Color output stages", info: "More information", darkShort: "Full switch-off is used only when Minimum brightness = 0%.",
    tv: "TV",
    running: "Sync is on",
    stopped: "Sync is off",
    error: "Error",
    syncControl: "Synchronization",
    turnOn: "Turn on",
    turnOff: "Turn off",
    syncHint: "The same switch remains a normal Home Assistant entity and can still be exposed to HomeKit.",
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
    processed: "Processed — Ambilight colors · recommended",
    measured: "Measured — Screen colors",
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
    blackThreshold: "Black threshold",
    blackThresholdDesc: "Black is detected from raw Ambilight samples before Average/Perceptual/Dominant processing. 0% means exact black only. Values above 0 use a small proportional hysteresis.",
    blackHold: "Black delay",
    blackHoldDesc: "How long black must persist before dimming starts. 0 ms reacts immediately. With Minimum brightness = 0%, full switch-off happens after this delay + Fade transition + Off delay.",
    fadeBlack: "Fade transition",
    fadeBlackDesc: "Duration of the single device transition down to Minimum brightness (or 1%).",
    offDelay: "Delay before switch-off",
    offDelayDesc: "After reaching 1% brightness, keep the light on for this long before OFF. Used only when Minimum brightness is 0%.",
    sceneCuts: "Scene cuts",
    sceneCutsHint: "Large color discontinuities are sent immediately, bypassing the normal output rate, smoothing and change threshold. Returning from the black cycle gets the same priority.",
    sceneCutThreshold: "Scene-cut threshold",
    sceneCutThresholdDesc: "Sensitivity to abrupt scene changes. 0% disables detection; lower values trigger more often.",
    sceneCutTransition: "Scene-cut transition",
    sceneCutTransitionDesc: "Short device transition used for abrupt cuts and immediate recovery from the black cycle.",
    darkScenes: "Dark scenes",
    darkScenesHint: "Threshold detects black; delay filters short dark frames; transition dims to the minimum/1%; Off delay holds 1% before the final OFF.",
    saveHint: "Setting changes are applied after saving.",
    cornerInfluence: "Corner influence",
    restore: "Restore previous light state when Sync stops",
    lights: "Lights",
    lightsHint: "Each light can mix multiple color sources with weights. For example Left 50% + Right 50% for a light placed between both sides. Weights are normalized automatically.",
    addLight: "Add light…",
    noLights: "No lights in this preset yet.",
    removeLight: "Remove light",
    positioning: "Positioning",
    positionMode: "Position mode",
    spatial: "Spatial · automatic",
    manual: "Manual · advanced",
    spatialDesc: "X/Y uses the TV’s individual Ambilight pixels and weights them by distance. This is more precise than averaging whole edges.",
    zoneFalloff: "Zone falloff / spread",
    zoneFalloffDesc: "How wide an area of the Ambilight perimeter this light sees. Lower = nearest pixels, higher = wider ambient blend.",
    spreadInfluence: "Actual segment influence",
    spreadWaiting: "Visualization appears after an Ambilight frame is received.",
    manualDesc: "Advanced mode: choose zones and weights manually.",
    positionX: "X · left ↔ right",
    positionY: "Y · top ↔ bottom",
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
    diagnostics: "Diagnostics",
    tvDiagnostics: "TV polling",
    targetRate: "target",
    queuedRate: "queued",
    actualRate: "actual",
    replaced: "replaced",
    latency: "latency",
    errorsCount: "errors",
    stuckProcessed: "processed has been all 0,0,0 for a long time",
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
const OVERRIDES = ["color_mode", "update_rate", "transition", "smoothing", "brightness", "minimum_brightness", "saturation", "threshold", "black_threshold", "black_hold_ms", "fade_to_black", "off_delay", "scene_cut_threshold", "scene_cut_transition", "corner_influence"];
const RANGE_META = {
  intensity: [50, 400, 1, "percent"], neutral_strength: [0, 100, 5, "percent"], neutral_noise_floor: [0, 8, 0.25, ""],
  poll_rate: [0.25, 30, 0.25, "hz"], update_rate: [0.25, 30, 0.25, "hz"], transition: [0, 2, 0.1, "sec"], smoothing: [0, 95, 5, "percent"],
  brightness: [10, 100, 5, "percent"], minimum_brightness: [0, 100, 1, "percent"], saturation: [0, 150, 5, "percent"],
  threshold: [0, 100, 1, ""], black_threshold: [0, 20, 0.5, "percent"], black_hold_ms: [0, 1000, 50, "ms"], fade_to_black: [0, 10, 0.1, "sec"], off_delay: [0, 10, 0.1, "sec"], scene_cut_threshold: [0, 100, 1, "percent"], scene_cut_transition: [0, 2, 0.05, "sec"], corner_influence: [0, 100, 5, "percent"],
};

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const clone = (value) => JSON.parse(JSON.stringify(value));
const GLOBAL_RANGES = Object.keys(RANGE_META);
OVERRIDES.push("intensity");
const NEW_DEFAULTS = {intensity: 100, neutral_strength: 100, neutral_noise_floor: 3};

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
    this._toggling = false;
    this._statusTimer = null;
    this._openSettings = "basics";
    this._debugVisible = false;
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

  _globalValue(key) { return this.currentPreset?.global?.[key] ?? NEW_DEFAULTS[key]; }
  _overrideValue(entityId, key) {
    const overrides = this.currentPreset?.lights?.[entityId]?.overrides || {};
    return Object.prototype.hasOwnProperty.call(overrides, key) ? overrides[key] : this._globalValue(key);
  }

  _range(id, label, value, extra = "") {
    const [min,max,step,unitKey] = RANGE_META[id];
    const unit = unitKey ? this.t[unitKey] : "";
    const help = extra ? this._info(`${id}_help`, extra.replace(/<[^>]*>/g, "")) : "";
    return `<div class="control range-control"><div class="control-heading"><label class="control-title" for="${esc(id)}">${esc(label)}</label>${help}</div><div class="range-row"><input id="${esc(id)}" type="range" min="${min}" max="${max}" step="${step}" value="${esc(value)}"><output id="${esc(id)}_out" for="${esc(id)}">${esc(value)}${unit ? ` ${esc(unit)}` : ""}</output></div></div>`;
  }

  _info(id, text) {
    return `<details class="info-tip"><summary aria-label="${esc(this.t.info)}">ⓘ</summary><div id="${esc(id)}" class="info-content" role="note">${text}</div></details>`;
  }

  _settingsSummary(section, settings = this.currentPreset?.global || {}) {
    const v = (key) => this.shadowRoot?.getElementById(key)?.value ?? settings[key] ?? NEW_DEFAULTS[key];
    switch (section) {
      case "basics": return `${v("source") === "measured" ? "Measured" : "Processed"} · ${v("color_mode")} · ${this.t.intensity} ${v("intensity")}% · ${this.t.saturation} ${v("saturation")}%`;
      case "speed": return `TV ${v("poll_rate")} Hz · Lamps ${v("update_rate")} Hz · ${this.t.smoothing} ${v("smoothing")}%`;
      case "dark": return `Threshold ${v("black_threshold")}% · Min ${v("minimum_brightness")}% · Off ${v("off_delay")} s`;
      case "cuts": return `${v("scene_cut_threshold")}% · ${v("scene_cut_transition")} s`;
      case "spatial": return `${this.t.cornerInfluence} ${v("corner_influence")}%`;
      default: return "";
    }
  }

  _updateSettingsSummaries() {
    this.shadowRoot.querySelectorAll("[data-settings-summary]").forEach((el) => {
      el.textContent = this._settingsSummary(el.dataset.settingsSummary);
    });
  }

  _setSettingsSection(section) {
    this._openSettings = this._openSettings === section ? null : section;
    this.shadowRoot.querySelectorAll("[data-settings-toggle]").forEach((button) => {
      const open = button.dataset.settingsToggle === this._openSettings;
      button.setAttribute("aria-expanded", String(open));
      this.shadowRoot.getElementById(button.getAttribute("aria-controls")).hidden = !open;
    });
  }

  _settingsMarkup(g) {
    const t = this.t;
    const range = (key, label, help = "") => this._range(key, label, g[key] ?? NEW_DEFAULTS[key], help ? esc(help) : "");
    const section = (id, title, content) => `<div class="settings-section"><button type="button" class="settings-toggle" data-settings-toggle="${id}" aria-expanded="${this._openSettings === id}" aria-controls="settings-${id}"><span><strong>${esc(title)}</strong><small data-settings-summary="${id}">${esc(this._settingsSummary(id, g))}</small></span><span class="chevron" aria-hidden="true">›</span></button><div id="settings-${id}" class="section-controls" ${this._openSettings === id ? "" : "hidden"}>${content}</div></div>`;
    const source = `<div class="control"><div class="control-heading"><label for="source" class="control-title">${esc(t.source)}</label>${this._info("source_help", esc(g.source === "measured" ? t.measuredDesc : t.processedDesc))}</div><select id="source"><option value="processed" ${g.source !== "measured" ? "selected" : ""}>${esc(t.processed)}</option><option value="measured" ${g.source === "measured" ? "selected" : ""}>${esc(t.measured)}</option></select></div>`;
    const mode = g.color_mode || "average";
    const algorithm = `<div class="control"><div class="control-heading"><label for="color_mode" class="control-title">${esc(t.colorMode)}</label>${this._info("color_mode_help", esc(t[`${mode}Desc`]))}</div><select id="color_mode">${["average", "perceptual", "dominant"].map((key) => `<option value="${key}" ${mode === key ? "selected" : ""}>${esc(t[key])}</option>`).join("")}</select></div>`;
    return `<section class="card settings-accordion">
      ${section("basics", t.basics, source + algorithm + range("intensity", t.intensity, t.intensityDesc) + range("saturation", t.saturation) + range("minimum_brightness", t.minBrightness) + range("brightness", t.brightness))}
      ${section("speed", t.speed, range("poll_rate", t.pollRate, t.pollRateDesc) + range("update_rate", t.fps, t.fpsDesc) + range("transition", t.transition) + range("smoothing", t.smoothing) + range("threshold", t.threshold))}
      ${section("dark", t.darkScenes, `<p class="section-note">${esc(t.darkShort)}</p>` + range("black_threshold", t.blackThreshold, t.blackThresholdDesc) + range("black_hold_ms", t.blackHold, t.blackHoldDesc) + range("fade_to_black", t.fadeBlack, t.fadeBlackDesc) + range("off_delay", t.offDelay, t.offDelayDesc))}
      ${section("cuts", t.sceneCuts, range("scene_cut_threshold", t.sceneCutThreshold, t.sceneCutThresholdDesc) + range("scene_cut_transition", t.sceneCutTransition, t.sceneCutTransitionDesc))}
      ${section("spatial", t.spatialSettings, range("corner_influence", t.cornerInfluence) + `<p class="section-note">${esc(t.spatialSettingsDesc)}</p>`)}
    </section>
    <button id="debug-toggle" class="secondary" type="button" aria-expanded="${this._debugVisible}" aria-controls="debug-settings">Debug</button>
    <section id="debug-settings" class="debug-settings card" ${this._debugVisible ? "" : "hidden"}><strong>${esc(t.debug)}</strong><p>${esc(t.debugHint)}</p><div class="section-controls">
      ${range("neutral_strength", t.neutralStrength, t.neutralStrengthDesc)}${range("neutral_noise_floor", t.neutralNoise, t.neutralNoiseDesc)}
      <button id="debug-reset" class="secondary" type="button">${esc(t.debugReset)}</button>
      <div class="debug-pipeline"><strong>${esc(t.debugPipeline)}</strong><select id="debug-light" aria-label="${esc(t.diagnostics)}">${Object.keys(this.currentPreset?.lights || {}).map((id) => `<option value="${esc(id)}" ${this._debugLight === id ? "selected" : ""}>${esc(this._lightName(id))}</option>`).join("")}</select><pre id="debug-pipeline">${esc(t.debugWaiting)}</pre></div>
    </div></section>`;
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

  _spatialSegmentsMarkup(spatialMap = []) {
    if (!Array.isArray(spatialMap)) return "";
    return spatialMap.map((segment) => {
      const px = Number(segment.x ?? 0);
      const py = Number(segment.y ?? 0);
      const left = 25 + ((px + 100) / 200) * 50;
      const top = 25 + ((py + 100) / 200) * 50;
      const rgb = Array.isArray(segment.rgb) ? segment.rgb : [90,90,90];
      return `<span class="ambilight-segment" data-spatial-segment data-x="${esc(px)}" data-y="${esc(py)}" data-side="${esc(segment.side || "")}" style="left:${left}%;top:${top}%;background:rgb(${rgb.join(",")})"></span>`;
    }).join("");
  }

  _refreshSpatialWeights(card) {
    if (!card) return;
    const segments = [...card.querySelectorAll("[data-spatial-segment]")];
    const summary = card.querySelector("[data-spread-summary]");
    if (!segments.length) {
      if (summary) summary.textContent = this.t.spreadWaiting;
      return;
    }

    const x = Number(card.querySelector("[data-position-x]")?.value || 0);
    const y = Number(card.querySelector("[data-position-y]")?.value || 0);
    const falloff = Math.max(5, Math.min(100, Number(card.querySelector("[data-position-falloff]")?.value || 45)));
    const sigma = 18 + 1.2 * falloff;
    const raw = segments.map((segment) => {
      const px = Number(segment.dataset.x || 0);
      const py = Number(segment.dataset.y || 0);
      const distance = Math.hypot(px - x, py - y);
      return Math.exp(-0.5 * Math.pow(distance / sigma, 2));
    });
    const maxWeight = Math.max(...raw, 0);
    const cutoffRatio = falloff >= 90 ? 0.01 : 0.025;
    const sideTotals = { top:0, right:0, bottom:0, left:0 };
    let total = 0;

    segments.forEach((segment, index) => {
      const relative = maxWeight > 0 ? raw[index] / maxWeight : 0;
      const active = relative >= cutoffRatio;
      const visual = active ? relative : 0;
      segment.classList.toggle("active", active);
      segment.style.opacity = active ? String(0.22 + 0.78 * Math.pow(visual, 0.72)) : "0.07";
      segment.style.transform = `translate(-50%,-50%) scale(${active ? (0.72 + 0.72 * visual) : 0.62})`;
      segment.style.filter = active ? `saturate(${1 + visual * 0.35})` : "saturate(.45)";
      if (active) {
        const side = segment.dataset.side;
        if (Object.prototype.hasOwnProperty.call(sideTotals, side)) sideTotals[side] += raw[index];
        total += raw[index];
      }
    });

    if (summary) {
      const order = ["left", "top", "right", "bottom"];
      const parts = order
        .filter((side) => sideTotals[side] > 0 && total > 0)
        .map((side) => `${this.t[side]} ${Math.round(sideTotals[side] / total * 100)}%`);
      summary.textContent = parts.length ? `${this.t.spreadInfluence}: ${parts.join(" · ")}` : this.t.spreadWaiting;
    }
  }

  _updateSpatialMapDom(entityId, preview) {
    const card = [...(this.shadowRoot?.querySelectorAll("[data-light-card]") || [])].find((el) => el.dataset.entity === entityId);
    const container = card?.querySelector("[data-position-segments]");
    if (!card || !container || !Array.isArray(preview?.spatial_map)) return;
    container.innerHTML = this._spatialSegmentsMarkup(preview.spatial_map);
    this._refreshSpatialWeights(card);
  }

  _lightCard(entityId) {
    const t = this.t;
    const cfg = this.currentPreset.lights[entityId];
    const sources = cfg.sources || [];
    const positionMode = cfg.position_mode || "manual";
    const posX = Number(cfg.position_x ?? 0);
    const posY = Number(cfg.position_y ?? 0);
    const posFalloff = Number(cfg.position_falloff ?? 45);
    const preview = this.profile?.active_preset === this._editPresetId ? (this._lastStatus?.previews?.[entityId] || null) : null;
    const diag = this.profile?.active_preset === this._editPresetId ? (this._lastStatus?.diagnostics?.lights?.[entityId] || null) : null;
    const rgb = preview?.output_rgb || [60,60,60];
    const inputRgb = preview?.input_rgb || null;
    const spatialMap = preview?.spatial_map || [];
    const sourceRows = sources.map((source, index) => `<div class="source-row" data-source-index="${index}"><select data-source-zone>${this._zoneOptions(source.zone)}</select><label class="weight"><input data-source-weight type="number" min="1" max="1000" step="1" value="${esc(source.weight ?? 100)}"><span>%</span></label><button class="icon-btn" data-remove-source="${index}" title="${esc(t.removeSource)}">×</button></div>`).join("");
    const overrideCount = Object.keys(cfg.overrides || {}).length;
    const previewText = inputRgb ? `${t.input} rgb(${inputRgb.join(", ")}) · ${t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0) / 255 * 100)}%` : "—";
    const diagText = diag ? `${t.targetRate} ${diag.target_rate_hz} Hz · ${t.queuedRate} ${diag.queued_rate_hz} Hz · ${t.actualRate} ${diag.actual_rate_hz} Hz · cuts ${diag.scene_cuts ?? 0} (${diag.scene_cut_score ?? 0}%) · ${t.replaced} ${diag.replaced_frames} · ${t.latency} ${diag.avg_latency_ms} ms` : "—";
    const left = Math.max(0, Math.min(100, (posX + 100) / 2));
    const top = Math.max(0, Math.min(100, (posY + 100) / 2));

    return `<section class="light-card" data-light-card data-entity="${esc(entityId)}">
      <div class="light-head"><div class="preview-dot" data-preview="${esc(entityId)}" style="background:rgb(${rgb.join(",")})"></div><div class="light-name"><strong>${esc(this._lightName(entityId))}</strong></div><button class="remove-light" data-remove-light="${esc(entityId)}">${esc(t.removeLight)}</button></div>
      <details class="light-diagnostics"><summary>${esc(t.diagnostics)}</summary><small>${esc(entityId)}</small>
      <div class="preview-line"><span>${esc(t.preview)}</span><span data-preview-text="${esc(entityId)}">${esc(previewText)}</span></div>
      <div class="diagnostic-line"><span>${esc(t.diagnostics)}</span><span data-diagnostics-text="${esc(entityId)}">${esc(diagText)}</span></div>
      </details>

      <details class="position-settings"><summary>${esc(t.positioning)}</summary>
      <label class="control position-mode-control"><span class="control-title">${esc(t.positionMode)}</span><select data-position-mode><option value="spatial" ${positionMode === "spatial" ? "selected" : ""}>${esc(t.spatial)}</option><option value="manual" ${positionMode === "manual" ? "selected" : ""}>${esc(t.manual)}</option></select><small class="help" data-position-help>${esc(positionMode === "spatial" ? t.spatialDesc : t.manualDesc)}</small></label>

      <div class="spatial-box" data-spatial-config ${positionMode === "spatial" ? "" : "hidden"}>
        <div class="position-preview"><div class="position-segments" data-position-segments>${this._spatialSegmentsMarkup(spatialMap)}</div><div class="tv-shape">TV</div><div class="position-point" data-position-point style="left:${left}%;top:${top}%"></div></div>
        <div class="spread-summary" data-spread-summary>${esc(spatialMap.length ? t.spreadInfluence : t.spreadWaiting)}</div>
        <label class="position-range"><span>${esc(t.positionX)}</span><div class="range-row"><input type="range" min="-100" max="100" step="1" value="${esc(posX)}" data-position-x><output data-position-x-out>${esc(posX)}</output></div></label>
        <label class="position-range"><span>${esc(t.positionY)}</span><div class="range-row"><input type="range" min="-100" max="100" step="1" value="${esc(posY)}" data-position-y><output data-position-y-out>${esc(posY)}</output></div></label>
        <label class="position-range"><span>${esc(t.zoneFalloff)}</span><div class="range-row"><input type="range" min="5" max="100" step="1" value="${esc(posFalloff)}" data-position-falloff><output data-position-falloff-out>${esc(posFalloff)} ${esc(t.percent)}</output></div><small class="help">${esc(t.zoneFalloffDesc)}</small></label>
      </div>

      <div data-manual-config ${positionMode === "manual" ? "" : "hidden"}>
        <div class="subhead manual-subhead"><strong>${esc(t.sources)}</strong></div>
        <div class="source-list">${sourceRows}</div>
        <button class="secondary add-source" data-add-source="${esc(entityId)}">${esc(t.addSource)}</button>
      </div>

      </details>
      <details class="override-box"><summary>${esc(t.overrides)}${overrideCount ? ` · ${overrideCount}` : ""}</summary><p>${esc(t.overridesHint)}</p><div class="override-grid">
        ${this._overrideColorMode(entityId)}
        ${this._overrideRange(entityId, "update_rate", t.fps)}
        ${this._overrideRange(entityId, "transition", t.transition)}
        ${this._overrideRange(entityId, "smoothing", t.smoothing)}
        ${this._overrideRange(entityId, "intensity", t.intensity)}
        ${this._overrideRange(entityId, "brightness", t.brightness)}
        ${this._overrideRange(entityId, "minimum_brightness", t.minBrightness)}
        ${this._overrideRange(entityId, "saturation", t.saturation)}
        ${this._overrideRange(entityId, "threshold", t.threshold)}
        ${this._overrideRange(entityId, "black_threshold", t.blackThreshold)}
        ${this._overrideRange(entityId, "black_hold_ms", t.blackHold)}
        ${this._overrideRange(entityId, "fade_to_black", t.fadeBlack)}
        ${this._overrideRange(entityId, "off_delay", t.offDelay)}
        ${this._overrideRange(entityId, "scene_cut_threshold", t.sceneCutThreshold)}
        ${this._overrideRange(entityId, "scene_cut_transition", t.sceneCutTransition)}
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
    GLOBAL_RANGES.forEach((key) => { g[key] = Number(root.getElementById(key).value); });
    g.restore_on_stop = root.getElementById("restore_on_stop").checked;

    root.querySelectorAll("[data-light-card]").forEach((card) => {
      const entityId = card.dataset.entity;
      const light = preset.lights[entityId];
      if (!light) return;
      light.position_mode = card.querySelector("[data-position-mode]")?.value || "manual";
      light.position_x = Number(card.querySelector("[data-position-x]")?.value || 0);
      light.position_y = Number(card.querySelector("[data-position-y]")?.value || 0);
      light.position_falloff = Number(card.querySelector("[data-position-falloff]")?.value || 45);
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
    this.currentPreset.lights[entityId] = { position_mode: "spatial", position_x: 0, position_y: 0, position_falloff: 45, sources: [{ zone: "all", weight: 100 }], overrides: {} };
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
      this._updateDiagnosticsDom(updated.status?.diagnostics || {});
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
      this._updateDiagnosticsDom(status.diagnostics || {});
    } catch (_) {}
  }

  _updateStatusDom(status) {
    const state = this.shadowRoot?.getElementById("sync-status");
    const toggle = this.shadowRoot?.getElementById("sync-toggle");
    const error = this.shadowRoot?.getElementById("status-error");
    const running = Boolean(status?.running);
    if (state) { state.textContent = running ? this.t.running : this.t.stopped; state.classList.toggle("on", running); }
    if (toggle) {
      toggle.textContent = this._toggling ? "…" : (running ? this.t.turnOff : this.t.turnOn);
      toggle.classList.toggle("on", running);
      toggle.disabled = this._toggling;
      toggle.setAttribute("aria-pressed", String(running));
    }
    if (error) { error.textContent = status?.last_error ? `${this.t.error}: ${status.last_error}` : ""; error.hidden = !status?.last_error; }
  }

  async _toggleSync() {
    if (this._toggling || !this.currentEntry) return;
    this._toggling = true;
    this._updateStatusDom(this._lastStatus || this.currentEntry.status || {});
    try {
      const running = !Boolean((this._lastStatus || this.currentEntry.status || {}).running);
      const status = await this._hass.connection.sendMessagePromise({
        type: "ambilight_sync/set_running",
        entry_id: this.currentEntry.entry_id,
        running,
      });
      this._lastStatus = status;
      this._updateStatusDom(status);
      this._updatePreviewDom(status.previews || {});
      this._updateDiagnosticsDom(status.diagnostics || {});
    } catch (err) {
      const error = this.shadowRoot?.getElementById("status-error");
      if (error) { error.textContent = `${this.t.error}: ${err?.message || err}`; error.hidden = false; }
    } finally {
      this._toggling = false;
      this._updateStatusDom(this._lastStatus || this.currentEntry.status || {});
    }
  }

  _updatePreviewDom(previews) {
    if (this.profile?.active_preset !== this._editPresetId) return;
    const debug = this.shadowRoot?.getElementById("debug-pipeline");
    const selectedDebugLight = this.shadowRoot?.getElementById("debug-light")?.value;
    if (debug) debug.textContent = Object.entries(previews).filter(([id]) => id === selectedDebugLight).map(([id, p]) => {
      const rgb = (key) => p[key] ? `(${p[key].join(", ")})` : "—";
      const samples = (p.spatial_map || []).filter((s) => s.active).slice(0, 6).map((s) => s.rgb.join(",")).join(" | ");
      const raw = `${this._lightName(id)} · ${p.state || "active"}\nRAW luma ${p.luminance ?? "—"}% · samples ${samples || "—"}`;
      if (p.state && p.state !== "active") {
        const note = (this._hass?.language || "").startsWith("ru")
          ? "Black-cycle: обычный цветовой pipeline пропущен. Последний желаемый выход (не текущий цвет входа и не измерение лампы)"
          : "Black-cycle: normal color pipeline skipped. Last desired output (not current input color or measured light state)";
        return `${raw}\n${note}: RGB ${rgb("output_rgb")} · ${p.brightness ?? "—"}/255`;
      }
      return `${raw}\nAlgorithm ${rgb("input_rgb")} → smooth ${rgb("smoothed_rgb")}\nNeutral ${rgb("neutral_rgb")} → saturation / desired RGB ${rgb("output_rgb")}\nSource luma ${p.source_luminance ?? "—"}% · intensity ${p.intensity ?? "—"}% → brightness ${p.brightness ?? "—"}/255`;
    }).join("\n\n") || this.t.debugWaiting;
    for (const [entityId, preview] of Object.entries(previews)) {
      const dot = [...(this.shadowRoot?.querySelectorAll("[data-preview]") || [])].find((el) => el.dataset.preview === entityId);
      const text = [...(this.shadowRoot?.querySelectorAll("[data-preview-text]") || [])].find((el) => el.dataset.previewText === entityId);
      const rgb = preview.output_rgb || [0,0,0];
      if (dot) dot.style.background = `rgb(${rgb.join(",")})`;
      if (text) { const input = preview.input_rgb || [0,0,0]; text.textContent = `${this.t.input} rgb(${input.join(", ")}) · ${this.t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0)/255*100)}%`; }
      this._updateSpatialMapDom(entityId, preview);
    }
  }

  _updateDiagnosticsDom(diagnostics) {
    const tv = diagnostics?.tv || {};
    const tvEl = this.shadowRoot?.getElementById("tv-diagnostics");
    if (tvEl) {
      const stuck = tv.processed_stuck_warning ? ` · ⚠ ${this.t.stuckProcessed}` : "";
      tvEl.textContent = `${this.t.targetRate} ${tv.target_poll_rate_hz ?? 0} Hz · ${this.t.actualRate} ${tv.actual_poll_rate_hz ?? 0} Hz${stuck}`;
    }
    for (const [entityId, diag] of Object.entries(diagnostics?.lights || {})) {
      const text = [...(this.shadowRoot?.querySelectorAll("[data-diagnostics-text]") || [])].find((el) => el.dataset.diagnosticsText === entityId);
      if (!text) continue;
      text.textContent = `${this.t.targetRate} ${diag.target_rate_hz ?? 0} Hz · ${this.t.queuedRate} ${diag.queued_rate_hz ?? 0} Hz · ${this.t.actualRate} ${diag.actual_rate_hz ?? 0} Hz · ${this.t.replaced} ${diag.replaced_frames ?? 0} · ${this.t.latency} ${diag.avg_latency_ms ?? 0} ms · ${this.t.errorsCount} ${diag.errors ?? 0}`;
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

  _syncDarkSceneUi() {
    const min = this.shadowRoot?.getElementById("minimum_brightness");
    const off = this.shadowRoot?.getElementById("off_delay");
    if (!min || !off) return;
    const inactive = Number(min.value) > 0;
    off.disabled = inactive;
    const control = off.closest(".control");
    if (control) control.classList.toggle("inactive-control", inactive);
  }

  _wireEvents() {
    const root = this.shadowRoot;
    root.getElementById("debug-toggle")?.addEventListener("click", () => {
      this._debugVisible = !this._debugVisible;
      root.getElementById("debug-settings").hidden = !this._debugVisible;
      root.getElementById("debug-toggle").setAttribute("aria-expanded", String(this._debugVisible));
    });
    root.getElementById("debug-light")?.addEventListener("change", (event) => {
      this._debugLight = event.target.value;
      this._updatePreviewDom(this._lastStatus?.previews || {});
    });
    root.querySelectorAll("[data-settings-toggle]").forEach((button) => button.addEventListener("click", () => this._setSettingsSection(button.dataset.settingsToggle)));
    root.getElementById("source")?.addEventListener("change", () => {
      root.getElementById("source_help").textContent = this.t[root.getElementById("source").value === "measured" ? "measuredDesc" : "processedDesc"];
      this._updateSettingsSummaries();
    });
    root.getElementById("debug-reset")?.addEventListener("click", () => {
      for (const key of ["neutral_strength", "neutral_noise_floor"]) {
        const input = root.getElementById(key);
        input.value = NEW_DEFAULTS[key];
        this._updateRangeOutput(input);
      }
    });
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
    root.getElementById("sync-toggle")?.addEventListener("click", () => this._toggleSync());
    root.getElementById("save")?.addEventListener("click", () => this._save(false));
    root.getElementById("add-light")?.addEventListener("change", (e) => { const id=e.target.value; if(id) this._addLight(id); });

    GLOBAL_RANGES.forEach((key) => {
      const input = root.getElementById(key);
      input?.addEventListener("input", () => {
        this._updateRangeOutput(input);
        this._syncInheritedOverrideValues(key);
        if (key === "minimum_brightness") this._syncDarkSceneUi();
        this._updateSettingsSummaries();
      });
    });
    this._syncDarkSceneUi();
    this._updateSettingsSummaries();
    root.getElementById("color_mode")?.addEventListener("change", () => {
      const select=root.getElementById("color_mode"); const help=root.getElementById("color_mode_help"); if(help) help.textContent=this.t[`${select.value}Desc`] || "";
      this._syncInheritedOverrideValues("color_mode");
      this._updateSettingsSummaries();
    });

    root.querySelectorAll("[data-position-mode]").forEach((select) => select.addEventListener("change", () => {
      const card = select.closest("[data-light-card]");
      const spatial = card?.querySelector("[data-spatial-config]");
      const manual = card?.querySelector("[data-manual-config]");
      const help = card?.querySelector("[data-position-help]");
      const isSpatial = select.value === "spatial";
      if (spatial) spatial.hidden = !isSpatial;
      if (manual) manual.hidden = isSpatial;
      if (help) help.textContent = isSpatial ? this.t.spatialDesc : this.t.manualDesc;
    }));
    root.querySelectorAll("[data-position-x], [data-position-y], [data-position-falloff]").forEach((input) => input.addEventListener("input", () => {
      const card = input.closest("[data-light-card]");
      const x = Number(card?.querySelector("[data-position-x]")?.value || 0);
      const y = Number(card?.querySelector("[data-position-y]")?.value || 0);
      const xOut = card?.querySelector("[data-position-x-out]");
      const yOut = card?.querySelector("[data-position-y-out]");
      const falloff = Number(card?.querySelector("[data-position-falloff]")?.value || 45);
      const falloffOut = card?.querySelector("[data-position-falloff-out]");
      const point = card?.querySelector("[data-position-point]");
      if (xOut) xOut.textContent = String(x);
      if (yOut) yOut.textContent = String(y);
      if (falloffOut) falloffOut.textContent = `${falloff} ${this.t.percent}`;
      if (point) { point.style.left = `${Math.max(0, Math.min(100, (x + 100) / 2))}%`; point.style.top = `${Math.max(0, Math.min(100, (y + 100) / 2))}%`; }
      this._refreshSpatialWeights(card);
    }));

    root.querySelectorAll("[data-light-card]").forEach((card) => this._refreshSpatialWeights(card));

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
      <header><div class="logo">A</div><div class="head-copy"><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div></header>

      <section class="topbar card">
        <label class="tv-control"><span>${esc(t.tv)}</span><select id="entry-select">${entryOptions}</select></label>
        <div class="sync-control">
          <div class="sync-copy"><span class="eyebrow">${esc(t.syncControl)}</span><strong id="sync-status" class="sync-status ${status.running ? "on" : ""}">${esc(status.running ? t.running : t.stopped)}</strong><small>${esc(t.syncHint)}</small></div>
          <button id="sync-toggle" class="sync-toggle ${status.running ? "on" : ""}" aria-pressed="${status.running ? "true" : "false"}">${esc(status.running ? t.turnOff : t.turnOn)}</button>
        </div>
        <div class="top-diagnostics"><span class="eyebrow">${esc(t.tvDiagnostics)}</span><strong id="tv-diagnostics">${esc(t.targetRate)} ${status?.diagnostics?.tv?.target_poll_rate_hz ?? g.poll_rate} Hz · ${esc(t.actualRate)} ${status?.diagnostics?.tv?.actual_poll_rate_hz ?? 0} Hz</strong></div>
      </section>
      <div id="status-error" class="status-error" ${status.last_error ? "" : "hidden"}>${status.last_error ? esc(`${t.error}: ${status.last_error}`) : ""}</div>

      <div class="section-title"><div><h2>${esc(t.presets)}</h2><p>${esc(t.serviceHint)}</p></div></div>
      <section class="card preset-card"><label class="preset-select-wrap"><span>${esc(t.preset)}</span><div class="preset-select-line"><select id="preset-select">${presetOptions}</select><span id="active-preset-badge" class="active-badge" ${isActive ? "" : "hidden"}>${esc(t.active)}</span></div></label><div class="preset-actions"><button id="create-preset" class="secondary">${esc(t.create)}</button><button id="duplicate-preset" class="secondary">${esc(t.duplicate)}</button><button id="rename-preset" class="secondary">${esc(t.rename)}</button><button id="delete-preset" class="secondary danger">${esc(t.delete)}</button><button id="activate-preset" class="secondary accent" ${isActive ? "disabled" : ""}>${esc(t.activate)}</button></div></section>

      <div class="section-title"><div><h2>${esc(t.global)}</h2><p>${esc(t.globalHint)}</p></div></div>
      ${this._settingsMarkup(g)}

      <div class="section-title lights-title"><div><h2>${esc(t.lights)}</h2><p>${esc(t.lightsHint)}</p></div><select id="add-light"><option value="">${esc(t.addLight)}</option>${availableLights}</select></div>
      <div class="lights-grid">${lightCards || `<div class="empty-state">${esc(t.noLights)}</div>`}</div>

      <label class="check-row restore-control"><input id="restore_on_stop" type="checkbox" ${g.restore_on_stop !== false ? "checked" : ""}><span>${esc(t.restore)}</span></label>

      <div class="actions"><span class="save-hint">${esc(t.saveHint)}</span><button id="save" class="primary">${esc(t.save)}</button></div>
    </main>`;
    this._wireEvents();
  }

  _css() { return `
    :host{display:block;container-type:inline-size;min-height:100%;background:var(--primary-background-color);color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}*{box-sizing:border-box}[hidden]{display:none!important}
    #debug-toggle{margin-top:12px;font-size:12px}.debug-pipeline select{display:block;margin-top:10px;width:100%}.light-diagnostics{margin:14px 0;color:var(--secondary-text-color);font-size:12px}.light-diagnostics>summary{cursor:pointer}.light-diagnostics>small{display:block;margin-top:10px;overflow-wrap:anywhere}
    .settings-accordion{overflow:visible}.settings-section+.settings-section{border-top:1px solid var(--divider-color)}.settings-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:14px 18px;background:transparent;border:0;color:inherit;text-align:left;border-radius:14px}.settings-toggle:hover{background:color-mix(in srgb,var(--primary-color) 5%,transparent)}.settings-toggle strong{display:block;font-size:15px}.settings-toggle small{display:block;margin-top:4px;font-size:12px;line-height:1.4;color:var(--secondary-text-color);overflow-wrap:anywhere}.chevron{font-size:25px;color:var(--secondary-text-color);transition:transform .15s}.settings-toggle[aria-expanded=true] .chevron{transform:rotate(90deg)}.section-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 24px;padding:4px 18px 18px}.section-note{font-size:12px;grid-column:1/-1;line-height:1.45}.control-heading{display:flex;align-items:center;justify-content:space-between;gap:8px}.control{min-width:0}.control-title{overflow-wrap:anywhere}.control select{width:100%;min-width:0}.restore-control{margin:18px 2px}.debug-settings{padding:14px 18px;margin-top:14px}.debug-settings>summary,.position-settings>summary{cursor:pointer;font-weight:650;font-size:14px}.debug-settings>p{font-size:12px;margin:10px 0}.debug-settings .section-controls{padding:8px 0}.debug-pipeline{grid-column:1/-1;min-width:0;font-size:12px}.debug-pipeline pre{font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:10px 0 0}.position-settings>summary{margin:4px 0 12px}.position-settings[open]{margin-bottom:10px}.info-tip{position:relative;flex:none;font-size:14px;color:var(--secondary-text-color)}.info-tip>summary{cursor:pointer;list-style:none;width:28px;height:28px;display:grid;place-items:center;border-radius:50%}.info-tip>summary::-webkit-details-marker{display:none}.info-content{display:none;position:absolute;right:0;top:30px;width:min(270px,72vw);padding:12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);box-shadow:0 6px 22px #0004;z-index:12;font-size:12px;line-height:1.5;text-transform:none;letter-spacing:normal;font-weight:400}.info-tip[open]>.info-content,.info-tip:hover>.info-content{display:block}.range-row{min-width:0}.range-row input{min-width:0}.topbar>*{min-width:0}.top-diagnostics strong{white-space:normal!important}.preview-line,.diagnostic-line{overflow-wrap:anywhere}.settings-toggle:focus-visible,.info-tip summary:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
    main{max-width:1180px;margin:0 auto;padding:26px 24px 78px}header{display:flex;align-items:center;gap:14px;margin-bottom:18px}.logo{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--primary-color);color:#fff;font-size:22px;font-weight:800;flex:none}.head-copy{flex:1}h1{font-size:29px;line-height:1.08;margin:1px 0 4px}h2{font-size:21px;margin:0}p{margin:0;color:var(--secondary-text-color);line-height:1.45}.status-error{margin:10px 2px 0;padding:9px 12px;border-radius:10px;background:color-mix(in srgb,var(--error-color,#db4437) 10%,transparent);font-size:12px;color:var(--error-color,#db4437)}
    .card,.light-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;box-shadow:var(--ha-card-box-shadow,none)}.topbar{padding:16px 18px;display:grid;grid-template-columns:minmax(240px,330px) minmax(330px,1fr) auto;gap:20px;align-items:center}.topbar label,.control,.preset-select-wrap{display:flex;flex-direction:column;gap:7px}.topbar label>span,.control-title,.preset-select-wrap>span,.eyebrow{font-size:11px;font-weight:750;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.055em}.sync-control{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-left:18px;border-left:1px solid var(--divider-color)}.sync-copy{display:flex;flex-direction:column;gap:4px;min-width:0}.sync-copy small{font-size:11px;line-height:1.35;color:var(--secondary-text-color);max-width:430px}.sync-status{font-size:14px}.sync-status.on{color:var(--success-color,#43a047)}.sync-toggle{min-width:102px;border:1px solid var(--primary-color);border-radius:11px;padding:10px 14px;background:transparent;color:var(--primary-color);font-weight:750}.sync-toggle.on{border-color:var(--error-color,#db4437);color:var(--error-color,#db4437)}.sync-toggle:disabled{opacity:.55;cursor:default}.top-diagnostics{display:flex;flex-direction:column;gap:5px;align-items:flex-end;text-align:right;padding-left:18px;border-left:1px solid var(--divider-color)}.top-diagnostics strong{font-size:12px;font-weight:650;white-space:nowrap;color:var(--secondary-text-color)}
    select,input,button{font:inherit}select,input[type=number]{border:1px solid var(--divider-color);border-radius:10px;padding:10px 11px;background:var(--secondary-background-color);color:var(--primary-text-color);outline:none}select:focus,input[type=number]:focus{border-color:var(--primary-color)}button{cursor:pointer}.section-title{display:flex;justify-content:space-between;gap:20px;align-items:end;margin:26px 2px 11px}.section-title p{margin-top:5px;font-size:13px;max-width:900px}.lights-title select{width:min(320px,42vw)}
    .preset-card{padding:17px 18px;display:grid;grid-template-columns:minmax(260px,390px) 1fr;gap:18px;align-items:end}.preset-select-line{display:flex;gap:10px;align-items:center}.preset-select-line select{flex:1}.active-badge{padding:7px 10px;border-radius:999px;background:color-mix(in srgb,var(--success-color,#43a047) 18%,var(--card-background-color));color:var(--success-color,#43a047);font-size:12px;font-weight:800}.preset-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.secondary{border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);font-weight:650}.secondary:hover{border-color:var(--primary-color)}.secondary:disabled{opacity:.45;cursor:default}.secondary.accent{border-color:var(--primary-color);color:var(--primary-color)}.secondary.danger{color:var(--error-color,#db4437)}
    .settings-grid{padding:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 24px}.settings-subgroup{grid-column:1/-1;margin-top:2px;padding:15px;border:1px solid var(--divider-color);border-radius:13px;background:color-mix(in srgb,var(--secondary-background-color) 58%,transparent)}.subgroup-title{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:14px}.subgroup-title strong{font-size:13px}.subgroup-title small{font-size:11px;color:var(--secondary-text-color);text-align:right;max-width:680px}.subgroup-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 24px}.range-row{display:grid;grid-template-columns:1fr 76px;gap:12px;align-items:center}.range-row output{text-align:right;font-variant-numeric:tabular-nums;font-size:13px;color:var(--secondary-text-color)}input[type=range]{width:100%;accent-color:var(--primary-color)}.help{display:block;color:var(--secondary-text-color);font-size:12px;line-height:1.45;font-weight:400;text-transform:none;letter-spacing:normal}.check-row{grid-column:1/-1;display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}.check-row input,.override-check input{width:18px;height:18px;accent-color:var(--primary-color)}
    .lights-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.light-card{padding:17px}.light-head{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center}.preview-dot{width:28px;height:28px;border-radius:50%;box-shadow:0 0 0 1px var(--divider-color),0 3px 12px rgba(0,0,0,.18)}.light-name{min-width:0}.light-name strong,.light-name small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.light-name small{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.remove-light{border:0;background:transparent;color:var(--error-color,#db4437);font-size:12px}.preview-line,.diagnostic-line{display:flex;justify-content:space-between;gap:16px;margin:12px 0 8px;padding:8px 10px;border-radius:10px;background:var(--secondary-background-color);font-size:11px;color:var(--secondary-text-color)}.diagnostic-line{margin-top:0;margin-bottom:16px}.preview-line span:last-child,.diagnostic-line span:last-child{text-align:right}.subhead{font-size:12px;text-transform:uppercase;letter-spacing:.035em;color:var(--secondary-text-color);margin-bottom:8px}.position-mode-control{margin-bottom:10px}.spatial-box{padding:12px;border-radius:12px;background:var(--secondary-background-color);margin-bottom:14px}.position-preview{height:150px;position:relative;border:1px dashed var(--divider-color);border-radius:12px;margin-bottom:8px;overflow:hidden;background:radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--primary-color) 4%,transparent),transparent 62%)}.position-segments{position:absolute;inset:0;z-index:2;pointer-events:none}.ambilight-segment{position:absolute;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%) scale(.62);opacity:.07;box-shadow:0 0 0 1px color-mix(in srgb,var(--primary-text-color) 30%,transparent);transition:opacity .12s ease,transform .12s ease,filter .12s ease}.ambilight-segment.active{box-shadow:0 0 0 1px color-mix(in srgb,var(--primary-text-color) 55%,transparent),0 0 8px color-mix(in srgb,var(--primary-color) 32%,transparent)}.tv-shape{position:absolute;z-index:1;left:25%;top:25%;width:50%;height:50%;border:2px solid var(--primary-color);border-radius:8px;display:grid;place-items:center;font-size:12px;font-weight:800;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 7%,var(--card-background-color))}.position-point{position:absolute;z-index:4;width:15px;height:15px;border-radius:50%;background:var(--primary-color);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary-color) 20%,transparent),0 2px 10px rgba(0,0,0,.35);transform:translate(-50%,-50%)}.spread-summary{min-height:18px;margin:0 2px 10px;font-size:11px;line-height:1.35;color:var(--secondary-text-color)}.position-range{display:block;font-size:12px;color:var(--secondary-text-color);margin-top:8px}.position-range>span{display:block;margin-bottom:5px}.manual-subhead{margin-top:12px}.source-list{display:flex;flex-direction:column;gap:7px}.source-row{display:grid;grid-template-columns:1fr 100px 34px;gap:7px;align-items:center}.weight{display:flex;align-items:center;gap:4px}.weight input{width:100%;min-width:0}.weight span{font-size:12px;color:var(--secondary-text-color)}.icon-btn{width:34px;height:34px;border:0;border-radius:9px;background:transparent;color:var(--secondary-text-color);font-size:20px}.icon-btn:hover{background:var(--secondary-background-color);color:var(--error-color,#db4437)}.add-source{margin-top:8px;width:100%}
    .override-box{margin-top:15px;border-top:1px solid var(--divider-color);padding-top:12px}.override-box summary{cursor:pointer;font-weight:750;font-size:14px}.override-box>p{font-size:12px;margin:8px 0 12px}.override-grid{display:flex;flex-direction:column;gap:10px}.override-row{display:grid;grid-template-columns:minmax(150px,.8fr) minmax(180px,1.2fr);gap:12px;align-items:center}.override-check{display:flex;align-items:center;gap:8px;font-size:13px}.override-row select{width:100%}.override-row input:disabled,.override-row select:disabled{opacity:.5}.override-row .range-row{grid-template-columns:1fr 62px}
    .actions{position:sticky;bottom:0;margin-top:22px;padding:11px 12px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid var(--divider-color);background:color-mix(in srgb,var(--primary-background-color) 92%,transparent);backdrop-filter:blur(10px);z-index:4}.save-hint{font-size:11px;color:var(--secondary-text-color)}button.primary{border:0;border-radius:12px;padding:12px 24px;background:var(--primary-color);color:var(--text-primary-color,#fff);font-weight:800;min-width:160px;box-shadow:0 5px 18px rgba(0,0,0,.12)}button.primary:disabled{opacity:.65;cursor:default}.save-error{background:var(--error-color,#db4437)!important;max-width:520px}.loading,.empty-state,.error-card{padding:32px;border-radius:16px;background:var(--card-background-color);border:1px solid var(--divider-color);color:var(--secondary-text-color)}.error-card{color:var(--error-color,#db4437)}
    @media(max-width:1000px){.topbar{grid-template-columns:minmax(230px,1fr) minmax(320px,1.4fr)}.top-diagnostics{grid-column:1/-1;align-items:flex-start;text-align:left;border-left:0;border-top:1px solid var(--divider-color);padding:11px 0 0}.lights-grid{grid-template-columns:1fr}.preset-card{grid-template-columns:1fr}.preset-actions{justify-content:flex-start}}
    @media(max-width:760px){main{padding:18px 12px 68px}header{margin-bottom:15px}.topbar,.settings-grid,.subgroup-grid{grid-template-columns:1fr}.sync-control{padding:14px 0 0;border-left:0;border-top:1px solid var(--divider-color);align-items:flex-start}.sync-copy small{max-width:none}.top-diagnostics{grid-column:auto}.check-row{grid-column:auto}.section-title{align-items:stretch;flex-direction:column}.lights-title select{width:100%}.override-row{grid-template-columns:1fr}.source-row{grid-template-columns:1fr 88px 34px}h1{font-size:26px}.subgroup-title{align-items:flex-start;flex-direction:column;gap:5px}.subgroup-title small{text-align:left}.actions{padding-bottom:max(10px,env(safe-area-inset-bottom));margin-left:-12px;margin-right:-12px}.save-hint{display:none}}
    @media(max-width:760px){.section-controls{grid-template-columns:1fr;gap:16px}.settings-toggle{padding:13px 14px}.section-controls{padding:4px 14px 16px}.topbar{grid-template-columns:minmax(0,1fr)!important}.preset-select-line select{min-width:0}.light-head{grid-template-columns:auto minmax(0,1fr)}.light-head .remove-light{grid-column:2;justify-self:start}.preview-line,.diagnostic-line{flex-direction:column;gap:4px}.preview-line span:last-child,.diagnostic-line span:last-child{text-align:left!important}.source-row{grid-template-columns:minmax(0,1fr) 68px 30px!important}.source-row select{min-width:0;width:100%}.range-row{grid-template-columns:minmax(0,1fr) 64px!important}}
    @container(max-width:1000px){.topbar{grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)}.top-diagnostics{grid-column:1/-1;align-items:flex-start;border-left:0;border-top:1px solid var(--divider-color);padding:10px 0 0;text-align:left}.lights-grid,.preset-card{grid-template-columns:1fr}.preset-actions{justify-content:flex-start}}
    @container(max-width:760px){main{padding:18px 12px 68px}.section-controls{grid-template-columns:1fr;padding:4px 14px 16px}.topbar{grid-template-columns:minmax(0,1fr)!important}.sync-control{padding:14px 0 0;border-left:0;border-top:1px solid var(--divider-color)}.settings-toggle{padding:13px 14px}.section-title{align-items:stretch;flex-direction:column}.lights-title select{width:100%}.preset-select-line select{min-width:0}.override-row{grid-template-columns:1fr}.light-head{grid-template-columns:auto minmax(0,1fr)}.light-head .remove-light{grid-column:2;justify-self:start}.preview-line,.diagnostic-line{flex-direction:column;gap:4px}.preview-line span:last-child,.diagnostic-line span:last-child{text-align:left!important}.source-row{grid-template-columns:minmax(0,1fr) 68px 30px!important}.source-row select{min-width:0;width:100%}.range-row{grid-template-columns:minmax(0,1fr) 64px!important}.actions{margin-left:-12px;margin-right:-12px;padding-bottom:max(10px,env(safe-area-inset-bottom))}.save-hint{display:none}}
  `; }
}

// Match the content-hash-specific element name registered by frontend.py.
// This avoids the browser reusing an already-defined old custom element after
// Home Assistant restarts/reconnects without a full document reload.
const _moduleUrl = new URL(import.meta.url);
const _panelRev = (_moduleUrl.searchParams.get("rev") || "fallback").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
const _panelTag = `ambilight-sync-panel-${_panelRev}`;
if (!customElements.get(_panelTag)) customElements.define(_panelTag, AmbilightSyncPanel);
