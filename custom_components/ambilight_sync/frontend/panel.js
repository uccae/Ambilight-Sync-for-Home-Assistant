const TEXT = {
  ru: {
    renderingMode:"Движок освещения", classicMode:"Classic · обычная синхронизация", ambientMode:"Ambient · комната в 3D",
    roomTitle:"Расположение в комнате", roomHint:"X — влево/вправо, Y — высота от пола, Z — глубина. Все расстояния в метрах. TV при 0° направлен в сторону +Z.",
    frontView:"Спереди · X / Y", topView:"Сверху · X / Z", roomObject:"Выбранный объект", roomX:"X · влево / вправо, m", roomY:"Y · высота от пола, m", roomZ:"Z · глубина, m",
    roomYaw:"Поворот TV, °", roomDimensions:"Размер экрана", roomWidth:"Ширина экрана, m", roomHeight:"Высота экрана, m",
    behavior:"Характер света", natural:"Natural · нейтральный", matte:"Matte · рассеянный", reflective:"Reflective · локальные акценты", atmospheric:"Atmospheric · Matte + Phosphor",
    phosphor:"Phosphor · слабое послесвечение",
    roomWaiting:"Для предпросмотра нужен хотя бы один полученный кадр TV.", roomPreviewError:"Предпросмотр недоступен",
    roomClassic:"Classic использует прежние Manual/Spatial настройки. Переключение на Ambient открывает общую комнату в трёх измерениях.",
    roomSave:"Характер света хранится в пресете; расположение — общее для всех пресетов. Изменения применяет кнопка «Применить изменения».", roomLights:"Добавьте светильники на вкладке «Светильники», затем разместите их здесь.",
    roomOpen:"Разместить в комнате", roomLimit:"Ambient поддерживает до 64 светильников.",
    title: "Ambilight Sync",
    atmosphere: "Атмосфера", settings: "Настройки", liveColors: "Цвета Ambilight", liveHint: "Цвета сегментов Ambilight из последнего ответа телевизора", previewWaiting: "Цвета появятся после включения синхронизации", lightsCount: "светильников", version: "Версия",
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
    globalHint: "Эти значения действуют для всех светильников, пока для параметра не включена индивидуальная настройка.",
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
    transition: "Переход устройства",
    smoothing: "Программное сглаживание",
    brightness: "Максимальная яркость",
    minBrightness: "Минимальная яркость",
    saturation: "Насыщенность",
    threshold: "Порог изменения",
    blackThreshold: "Порог темноты",
    blackThresholdDesc: "Чёрный определяется по сырым Ambilight-сегментам до Average/Perceptual/Dominant. 0% означает только точный чёрный. При значении выше 0 используется небольшой пропорциональный hysteresis.",
    blackHold: "Задержка перед затемнением",
    blackHoldDesc: "Сколько чёрный должен непрерывно продержаться до старта затемнения. 0 мс = реагировать сразу. При Minimum brightness = 0% полное выключение произойдёт через эту задержку + Transition затемнения + Задержку перед выключением.",
    fadeBlack: "Плавное затемнение",
    fadeBlackDesc: "Длительность одной аппаратной команды затемнения до Minimum brightness (или 1%).",
    offDelay: "Задержка перед выключением",
    offDelayDesc: "После достижения 1% яркости лампа остаётся включённой ещё это время и только затем выключается. Используется только при Minimum brightness = 0%.",
    sceneCuts: "Резкие смены сцен",
    sceneCutsHint: "При большом скачке цвета команда отправляется немедленно, в обход обычной частоты, smoothing и change threshold. Возврат из black-cycle имеет тот же приоритет.",
    sceneCutThreshold: "Порог смены сцены",
    sceneCutThresholdDesc: "Чувствительность к резкой смене сцены. 0% отключает детектор; меньшее значение реагирует чаще.",
    sceneCutTransition: "Переход при смене сцены",
    sceneCutTransitionDesc: "Короткий аппаратный transition для резкой смены сцены или мгновенного выхода из black-cycle.",
    darkScenes: "Тёмные сцены",
    darkScenesHint: "Порог определяет black; задержка фильтрует короткие тёмные кадры; transition быстро опускает яркость до minimum/1%; Off delay задаёт паузу на 1% перед выключением.",
    saveHint: "Изменения настроек применяются после сохранения.",
    cornerInfluence: "Смешивание углов",
    restore: "Восстанавливать прежнее состояние ламп после выключения Sync",
    lights: "Светильники",
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
    preview: "Предпросмотр",
    input: "Input",
    output: "Output",
    diagnostics: "Диагностика",
    tvDiagnostics: "Опрос телевизора",
    targetRate: "цель",
    queuedRate: "queued",
    actualRate: "факт",
    replaced: "заменено",
    latency: "latency",
    errorsCount: "ошибок",
    stuckProcessed: "processed долго отдаёт 0,0,0",
    inherited: "из общих",
    save: "Применить изменения",
    saving: "Сохраняю…",
    saved: "Изменения применены",
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
    renderingMode:"Rendering engine", classicMode:"Classic · normal synchronization", ambientMode:"Ambient · 3D room",
    roomTitle:"Room layout", roomHint:"X is left/right, Y is height above the floor, Z is depth. Distances are in meters. At 0°, TV faces +Z.",
    frontView:"Front · X / Y", topView:"Top · X / Z", roomObject:"Selected object", roomX:"X · left / right, m", roomY:"Y · height above floor, m", roomZ:"Z · depth, m",
    roomYaw:"TV rotation, °", roomDimensions:"Screen dimensions", roomWidth:"Screen width, m", roomHeight:"Screen height, m",
    behavior:"Light behavior", natural:"Natural · neutral", matte:"Matte · diffuse", reflective:"Reflective · local accents", atmospheric:"Atmospheric · Matte + Phosphor",
    phosphor:"Phosphor · subtle afterglow",
    roomWaiting:"Preview requires at least one received TV frame.", roomPreviewError:"Preview unavailable",
    roomClassic:"Classic keeps the existing Manual/Spatial mappings. Ambient opens one shared room with three dimensions.",
    roomSave:"Light behavior belongs to a preset; placement is shared by all presets. Use Apply changes.", roomLights:"Add entities on the Lights tab, then place them here.",
    roomOpen:"Place in room", roomLimit:"Ambient supports up to 64 lights.",
    title: "Ambilight Sync",
    atmosphere: "Atmosphere", settings: "Settings", liveColors: "Ambilight colors", liveHint: "Ambilight segment colors from the latest TV response", previewWaiting: "Colors will appear when sync is running", lightsCount: "lights", version: "Version",
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
    save: "Apply changes",
    saving: "Saving…",
    saved: "Changes applied",
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
// Google Material Symbols Rounded (Apache-2.0). SVG size and accessibility attributes adapted.
// Original assets and license: reference/google_material_symbols and frontend/licenses/material-symbols.
const ROOM_TOOL_ICONS = {
  "undo": "<svg class=\"room-tool-icon\" data-material-symbol=\"undo\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\"><path d=\"M320-200q-17 0-28.5-11.5T280-240q0-17 11.5-28.5T320-280h244q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l76 76q11 11 11 28t-11 28q-11 11-28 11t-28-11L188-572q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l144-144q11-11 28-11t28 11q11 11 11 28t-11 28l-76 76h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H320Z\"/></svg>",
  "redo": "<svg class=\"room-tool-icon\" data-material-symbol=\"redo\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\"><path d=\"M648-560H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h244q17 0 28.5 11.5T680-240q0 17-11.5 28.5T640-200H396q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252l-76-76q-11-11-11-28t11-28q11-11 28-11t28 11l144 144q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L628-428q-11 11-28 11t-28-11q-11-11-11-28t11-28l76-76Z\"/></svg>"
};
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
    this._tvPreview = null;
    this._loading = false;
    this._saving = false;
    this._toggling = false;
    this._statusTimer = null;
    this._tvPreviewTimer = null;
    this._previewRequest = null;
    this._statusRequest = null;
    this._configRequest = null;
    this._draftRevision = 0;
    this._entryEpoch = 0;
    this._requestError = null;
    this._connectionError = null;
    this._dismissedErrors = new Map();
    this._conflict = false;
    this._openSettings = "speed";
    this._tab = "atmosphere";
    this._dirty = false;
    this._debugVisible = false;
    this._lightNodes = new Map();
    this._latestPreviews = {};
    this._roomNode = null;
    this._roomViews = {};
    this._roomDrag = null;
    this._roomPreview = null;
    this._roomRequest = null;
    this._roomPreviewVersion = 0;
    this._roomPreviewTimer = null;
    this._roomPreviewQueued = false;
    this._roomResizeObserver = null;
    this._roomHistory = [];
    this._roomFuture = [];
    this._roomInputBefore = null;
    this._identifyOwner = globalThis.crypto?.randomUUID?.() || `room-${Date.now()}-${Math.random()}`;
    this._identifySerial = Promise.resolve();
    this._identifySeq = 0;
    this._identifyLeaseTimer = null;
    this._identifyTarget = null;
    this._roomClickOnNode = false;
    this._visibilityChanged=()=>{if(document.hidden)this._clearRoomSelection();};
    this._dismissRoomSelection=event=>{
      if(!this._roomNode || this._roomDrag)return;
      const target=event.composedPath()[0];
      if(this._roomClickOnNode && target?.closest?.('[data-room-view]')){this._roomClickOnNode=false;return;}
      if(target?.closest?.('[data-room-node],#room-node,#room-object-properties,.room-tools,dialog,[data-room-open]'))return;
      this._clearRoomSelection();
    };
    this._dismissMenus=event=>{
      const target=event.composedPath()[0];
      if(!target?.closest?.(".light-menu"))this._closeLightMenus();
    };
    this._menuEscape=event=>{if(event.key==="Escape" && !this.shadowRoot.querySelector("dialog[open]"))this._closeLightMenus(true);};
  }

  set hass(value) {
    const first = !this._hass;
    if (this._hass?.connection !== value?.connection) {
      this._clearRoomSelection();
      this._identifySerial=Promise.resolve();
      this._identifyOwner=globalThis.crypto?.randomUUID?.() || `room-${Date.now()}-${Math.random()}`;
      this._previewRequest = null;
      this._statusRequest = null;
      this._configRequest = null;
      this._cancelRoomPreview();
    }
    this._hass = value;
    this.dataset.theme = value?.themes?.darkMode ? "dark" : "light";
    // Never re-render on routine HA state updates. Native dropdowns stay open.
    if (first && this.isConnected) this._load();
  }
  get hass() { return this._hass; }
  set panel(value) { this._panel = value; }
  get panel() { return this._panel; }

  connectedCallback() {
    document.addEventListener("visibilitychange",this._visibilityChanged);
    document.addEventListener("pointerdown",this._dismissMenus);
    document.addEventListener("keydown",this._menuEscape);
    document.addEventListener("click",this._dismissRoomSelection);
    if (this._hass && !this._loading && !this._entries.length) this._load();
    if (!this._statusTimer) this._statusTimer = window.setInterval(() => this._refreshStatus(), 1500);
    if (!this._tvPreviewTimer) this._tvPreviewTimer = window.setInterval(() => this._refreshTVPreview(), 500);
  }
  disconnectedCallback() {
    document.removeEventListener("visibilitychange",this._visibilityChanged);
    document.removeEventListener("pointerdown",this._dismissMenus);
    document.removeEventListener("keydown",this._menuEscape);
    document.removeEventListener("click",this._dismissRoomSelection);
    this._endIdentify();
    this._roomResizeObserver?.disconnect();
    if (this._statusTimer) window.clearInterval(this._statusTimer);
    if (this._tvPreviewTimer) window.clearInterval(this._tvPreviewTimer);
    this._statusTimer = null;
    this._tvPreviewTimer = null;
    this._previewRequest = null;
    this._statusRequest = null;
    this._configRequest = null;
    this._cancelRoomPreview();
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
    this._clearRoomSelection();
    this._roomHistory=[];this._roomFuture=[];
    this._entryEpoch++;
    this._renderLoading();
    try {
      const data = await this._hass.connection.sendMessagePromise({ type: "ambilight_sync/get_config" });
      this._entries = data.entries || [];
      if (!this._entryId || !this._entries.some((e) => e.entry_id === this._entryId)) this._entryId = this._entries[0]?.entry_id || null;
      const entry = this.currentEntry;
      this._draft = entry ? clone(entry) : null;
      this._draftRevision++;
      this._requestError = null;
      this._connectionError = null;
      this._conflict = false;
      this._editPresetId = this.profile?.active_preset || Object.keys(this.profile?.presets || {})[0] || null;
      this._lastStatus = entry?.status || null;
      this._tvPreview = this._lastStatus?.tv_preview || null;
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

  _rendering() {
    const preset = this.currentPreset;
    if (!preset) return null;
    const raw = preset.rendering || {};
    const shared = this._draft?.room;
    const tvDefaults = {x:0,y:1.2,z:0,yaw:0,width:1.4,height:.8};
    const r = preset.rendering = {version:1, mode:raw.mode === "ambient" ? "ambient" : "classic",
      behavior:["natural","matte","reflective","atmospheric"].includes(raw.behavior) ? raw.behavior : "natural",
      phosphor:raw.phosphor === true, room:{tv:{...tvDefaults,...(raw.room?.tv || {})},lights:{}}};
    if(shared) r.room.tv=shared.tv;
    const ids = Object.keys(preset.lights || {}).sort().slice(0,64);
    ids.forEach((id,index) => {
      const light = preset.lights[id], spatial = light.position_mode === "spatial";
      const defaults = {x:spatial ? Number(light.position_x || 0)/100*2.5 : Math.max(-3.5,Math.min(3.5,(index-(ids.length-1)/2)*.8)),
        y:spatial ? Math.max(0,1.2-Number(light.position_y || 0)/100*.8) : 1.2, z:1.5};
      r.room.lights[id] = {...defaults,...(raw.room?.lights?.[id] || {})};
      if(shared) r.room.lights[id]=shared.lights[id] ||= clone(r.room.lights[id]);
    });
    return r;
  }

  _roomMarkup() {
    const t=this.t, r=this._rendering(), active=r.mode === "ambient";
    const count=Object.keys(this.currentPreset.lights || {}).length;
    const select=(id,label,options)=>`<label class="control"><span class="control-title ${id==="rendering-mode"?"visually-hidden":""}">${esc(label)}</span><select id="${id}">${options}</select></label>`;
    const option=(value,label,selected)=>`<option value="${value}" ${selected===value ? "selected" : ""}>${esc(label)}</option>`;
    const number=(key,label,min,max,step="any",tv=false)=>`<label><span>${esc(label)}</span><input type="number" min="${min}" max="${max}" step="${step}" ${tv ? `data-room-tv="${key}"` : `data-room-value="${key}"`} aria-label="${esc(label)}"></label>`;
    return `<section class="card rendering-card" id="rendering-card"><h2>${esc(t.renderingMode)}</h2>
      ${select("rendering-mode",t.renderingMode,option("classic",t.classicMode,r.mode)+`<option value="ambient" ${active?"selected":""} ${count>64?"disabled":""}>${esc(t.ambientMode)}</option>`)}
      <p class="help">${esc(active?t.roomSave:t.roomClassic)}${count>64?` ${esc(t.roomLimit)}`:""}</p>
      <div id="ambient-room-settings" ${active?"":"hidden"}>
        <div class="ambient-behavior-row">${select("ambient-behavior",t.behavior,["natural","matte","reflective","atmospheric"].map(v=>option(v,t[v],r.behavior)).join(""))}
          <div><label class="check-row"><input id="ambient-phosphor" type="checkbox" ${r.phosphor||r.behavior==="atmospheric"?"checked":""} ${r.behavior==="atmospheric"?"disabled":""}><span>${esc(t.phosphor)}</span></label></div></div>
        <div class="room-heading"><h3>${esc(t.roomTitle)}</h3></div>
        <p class="help">${esc(t.roomHint)}</p>
        <div class="room-tools"><div><button type="button" id="room-undo" class="secondary" title="Ctrl / ⌘ Z">${ROOM_TOOL_ICONS.undo}<span>${esc(this._label("Отменить","Undo"))}</span></button> <button type="button" id="room-redo" class="secondary" title="Ctrl / ⌘ Shift Z">${ROOM_TOOL_ICONS.redo}<span>${esc(this._label("Повторить","Redo"))}</span></button></div><span id="identify-state" class="help" role="status" hidden></span></div>
        ${this._draft?.room_alternates?.length?`<details class="room-alternates disclosure"><summary>${esc(this._label("Сохранённые схемы до миграции","Layouts preserved during migration"))} · ${this._draft.room_alternates.length}</summary><p class="help">${esc(this._label("Активная схема выбрана при обновлении. Отличающиеся координаты сохранены; применение варианта изменит общую комнату после сохранения.","The active layout took precedence on upgrade. Conflicting layouts are retained. Applying one changes the shared room after Save."))}</p><select id="room-alternate" aria-label="${esc(this._label("Старая схема","Old layout"))}">${this._draft.room_alternates.map((a,i)=>`<option value="${i}">${esc(a.name)} · ${esc(a.preset_id)}</option>`).join("")}</select><button type="button" id="room-use-alternate">${esc(this._label("Применить к черновику комнаты","Use in room draft"))}</button></details>`:""}
        <div class="room-views">${[["front",t.frontView],["top",t.topView]].map(([id,title])=>`<div class="room-view"><strong>${esc(title)}</strong><svg data-room-view="${id}" viewBox="0 0 600 360" role="group" aria-label="${esc(title)}"></svg></div>`).join("")}</div>
        <label class="control"><span class="control-title">${esc(t.roomObject)}</span><select id="room-node"><option value="">${esc(this._label("Не выбрано","None selected"))}</option><option value="tv">${esc(t.tv)}</option>${Object.keys(r.room.lights).map((id,index)=>`<option value="${esc(id)}">${index+1} · ${esc(this._lightName(id))}</option>`).join("")}</select></label>
        <div id="room-object-properties"><div class="room-coordinates">${number("x",t.roomX,-15,15)}${number("y",t.roomY,0,6)}${number("z",t.roomZ,-15,15)}</div>
        <div id="room-tv-controls"><div class="room-coordinates">${number("yaw",t.roomYaw,-180,180,"any",true)}</div><details class="disclosure"><summary>${esc(t.roomDimensions)}</summary><div class="room-coordinates">${number("diagonal",this._label("Диагональ экрана, дюймы","Screen diagonal, inches"),1,250,"any",true)}</div><p class="help">${esc(this._label("Пропорции экрана сохраняются. Ширина и высота рассчитываются автоматически.","The current aspect ratio is preserved. Width and height are calculated automatically."))}</p></details></div>
        </div><p class="help" id="room-preview-state" role="status" hidden></p>
        ${count?"":`<p class="help">${esc(t.roomLights)}</p>`}
      </div></section>`;
  }

  _label(ru,en) { return this.t === TEXT.ru ? ru : en; }

  _closeLightMenus(restoreFocus=false) {
    for(const menu of this.shadowRoot?.querySelectorAll(".light-menu[open]") || []){
      menu.open=false;if(restoreFocus)menu.querySelector("summary")?.focus({preventScroll:true});
    }
  }

  _lightCapabilities(id) {
    const known=this._draft?.capabilities?.[id];if(known)return known;
    const a=this._hass?.states?.[id]?.attributes || {},m=new Set(a.supported_color_modes || [a.color_mode || (a.rgb_color?"rgb":a.brightness!=null?"brightness":"onoff")]);
    return {color:["rgb","rgbw","rgbww","hs","xy"].some(v=>m.has(v)),brightness:["rgb","rgbw","rgbww","hs","xy","color_temp","white","brightness"].some(v=>m.has(v)),transition:!!(Number(a.supported_features || 0)&32)};
  }

  _showModal(title,content) {
    this.shadowRoot.querySelector("dialog")?.remove();
    const dialog=document.createElement("dialog");dialog.className="refinement-dialog";
    dialog.innerHTML=`<div class="dialog-heading"><h2>${esc(title)}</h2><button type="button" data-close-dialog aria-label="${esc(this._label("Закрыть","Close"))}">×</button></div><div class="dialog-body">${content}</div>`;
    this.shadowRoot.append(dialog);dialog.querySelector("[data-close-dialog]").onclick=()=>{dialog.close();dialog.remove();};
    dialog.addEventListener("cancel",()=>dialog.remove());dialog.showModal();return dialog;
  }

  _copySettings(source) {
    this._readCurrentPresetControls();
    const targets=Object.keys(this.currentPreset.lights).filter(id=>id!==source);
    const dialog=this._showModal(this._label("Копировать настройки","Copy Settings"),`<p>${esc(this._lightName(source))}</p><p class="help">${esc(this._label("Будут скопированы применимые параметры синхронизации. Расположение, зоны привязки и участие в синхронизации сохраняются у каждого устройства.","Copies applicable synchronization settings. Placement, zone assignments and participation stay individual."))}</p><div class="copy-targets">${targets.map(id=>`<label class="check-row"><input type="checkbox" data-copy-target="${esc(id)}" ${this._hass?.states?.[id]?"":"disabled"}><span>${esc(this._lightName(id))}</span></label>`).join("") || `<p>${esc(this._label("Добавьте другой светильник в пресет.","Add another light to this preset."))}</p>`}</div><p class="dialog-message help" aria-live="polite"></p><button type="button" class="primary" id="copy-confirm">${esc(this._label("Копировать в черновик","Copy to draft"))}</button>`);
    dialog.querySelector("#copy-confirm").onclick=async()=>{
      const ids=[...dialog.querySelectorAll("[data-copy-target]:checked")].map(el=>el.dataset.copyTarget);
      if(!ids.length)return;
      const preset=this._editPresetId,entry=this._entryId,epoch=this._entryEpoch,version=this._draftRevision,button=dialog.querySelector("#copy-confirm");button.disabled=true;
      try{
        const data=await this._hass.connection.sendMessagePromise({type:"ambilight_sync/copy_light_settings",entry_id:entry,profile_config:clone(this.profile),preset,source,targets:ids});
        if(!dialog.isConnected || entry!==this._entryId || epoch!==this._entryEpoch || preset!==this._editPresetId || version!==this._draftRevision)return;
        for(const [id,cfg] of Object.entries(data.lights))this.currentPreset.lights[id].overrides=clone(cfg.overrides);
        dialog.close();dialog.remove();this._markDirty();this._render();
      }catch(err){dialog.querySelector(".dialog-message").textContent=String(err?.message || err);}
      finally{button.disabled=false;}
    };
  }

  _importBackupDialog(backup) {
    const devices={},entities={},profiles=Array.isArray(backup.profiles)?backup.profiles:[];
    const ids=new Set(Object.keys(backup.room?.lights || {}));
    for(const p of profiles)for(const preset of Object.values(p.config?.presets || {}))for(const id of Object.keys(preset.lights || {}))ids.add(id);
    for(const id of backup.room?.excluded || [])ids.add(id);
    for(const item of backup.room?.migration || [])for(const id of Object.keys(item.room?.lights || {}))ids.add(id);
    const skip=this._label("Пропустить","Skip");
    const dialog=this._showModal(this._label("Импорт конфигурации","Import configuration"),`<p class="help">${esc(this._label("Выберите соответствия устройств. Импорт заменит сохранённые настройки выбранных TV и общую геометрию; несохранённый черновик закроется. Данные подключения телевизоров сохранятся.","Map devices to this installation. Import replaces selected TVs' saved settings and shared geometry and closes the unsaved draft. TV connection credentials are retained."))}</p><div class="backup-mappings">${profiles.map((p,i)=>`<label>${esc(p.title || p.device)}<select data-backup-device="${i}"><option value="">${esc(this._label("Выберите TV…","Choose TV…"))}</option>${this._entries.map(e=>`<option value="${esc(e.entry_id)}" ${p.device===e.entry_id?"selected":""}>${esc(e.title)}</option>`).join("")}<option value="__skip">${esc(skip)}</option></select></label>`).join("")}<details class="disclosure"><summary>${esc(this._label("Назначения светильников","Light assignments"))} · ${ids.size}</summary>${[...ids].sort().map((id,i)=>`<label>${esc(id)}<select data-backup-entity="${i}"><option value="">${esc(this._label("Выберите лампу…","Choose light…"))}</option>${this._allLights().map(e=>`<option value="${esc(e)}" ${id===e?"selected":""}>${esc(this._lightName(e))} · ${esc(e)}</option>`).join("")}<option value="__skip">${esc(skip)}</option></select></label>`).join("")}</details></div><div id="backup-plan" class="help" role="status"></div><div class="backup-actions"><button type="button" id="backup-preview">${esc(this._label("Проверить и показать изменения","Preview changes"))}</button><button type="button" id="backup-confirm" class="primary" disabled>${esc(this._label("Применить импорт","Apply import"))}</button></div>`);
    let plan=null;const sourceIds=[...ids].sort(),confirm=dialog.querySelector("#backup-confirm"),message=dialog.querySelector("#backup-plan");
    const collect=()=>{
      for(const select of dialog.querySelectorAll("[data-backup-device]"))devices[profiles[Number(select.dataset.backupDevice)].device]=select.value==="__skip"?null:select.value;
      for(const select of dialog.querySelectorAll("[data-backup-entity]"))entities[sourceIds[Number(select.dataset.backupEntity)]]=select.value==="__skip"?null:select.value;
    };
    const preview=async()=>{
      collect();confirm.disabled=true;
      try{
        plan=await this._hass.connection.sendMessagePromise({type:"ambilight_sync/preview_backup",backup,devices,entities});
        if(!dialog.isConnected)return;
        message.replaceChildren();
        for(const c of plan.changes){const p=document.createElement("p");p.textContent=`${c.title}: ${c.before_presets} → ${c.presets} ${this._label("пресетов","presets")} · ${c.lights} ${this._label("ламп","lights")} · ${c.active_preset}`;message.append(p);}
        const lines=[`${this._label("Общая геометрия","Shared geometry")}: ${plan.geometry_lights} ${this._label("ламп","lights")}`,...plan.warnings,...plan.unresolved.map(item=>`${this._label("Нужно назначить","Needs mapping")}: ${item.id}`)];
        if(plan.skipped.length)lines.push(`${this._label("Будут пропущены","Will skip")}: ${plan.skipped.join(", ")}`);
        if(plan.geometry_changed)lines.push(`${this._label("Изменится расположение ламп","Light positions changed")}: ${plan.geometry_changed}`);
        if(plan.geometry_removed?.length)lines.push(`${this._label("Из общей геометрии будут удалены","Will remove from shared geometry")}: ${plan.geometry_removed.join(", ")}`);
        if(plan.tv_positions_removed?.length)lines.push(`${this._label("Положения TV будут сброшены","TV positions reset")}: ${plan.tv_positions_removed.join(", ")}`);
        for(const line of lines){const p=document.createElement("p");p.textContent=line;message.append(p);}
        confirm.disabled=!plan.ready;
      }catch(err){message.textContent=String(err?.message || err);}
    };
    dialog.querySelector("#backup-preview").onclick=preview;
    dialog.querySelectorAll("select").forEach(select=>select.addEventListener("change",()=>{plan=null;confirm.disabled=true;message.textContent=this._label("Проверьте изменённые назначения.","Preview the changed mappings.");}));
    confirm.onclick=async()=>{
      if(!plan?.ready)return;confirm.disabled=true;dialog.querySelector("#backup-preview").disabled=true;
      try{
        await this._hass.connection.sendMessagePromise({type:"ambilight_sync/import_backup",backup,devices,entities,token:plan.token});
        dialog.close();dialog.remove();await this._load();
      }catch(err){message.textContent=String(err?.message || err);plan=null;dialog.querySelector("#backup-preview").disabled=false;}
    };
    preview();
  }

  _wireRefinement() {
    const root=this.shadowRoot;
    root.querySelectorAll(".light-menu").forEach(menu=>menu.addEventListener("toggle",()=>{
      if(menu.open)for(const other of root.querySelectorAll(".light-menu[open]"))if(other!==menu)other.open=false;
    }));
    root.querySelectorAll("[data-copy-settings]").forEach(b=>b.onclick=()=>{b.closest("details").open=false;this._copySettings(b.dataset.copySettings);});
    root.querySelectorAll("[data-participating]").forEach(input=>input.addEventListener("change",async()=>{
      const value=input.checked,entry=this._entryId,epoch=this._entryEpoch;input.disabled=true;
      try{
        const status=await this._hass.connection.sendMessagePromise({type:"ambilight_sync/set_participating",entry_id:entry,entity_id:input.dataset.participating,participating:value});
        if(entry!==this._entryId || epoch!==this._entryEpoch)return;
        this._lastStatus=status;this._draft.room_revision=status.room_revision;this._updateStatusDom(status);
      }catch(err){input.checked=!value;this._requestError=String(err?.message || err);this._updateStatusDom(this._lastStatus);}
      finally{input.disabled=false;}
    }));
    const color=new Set(["color_mode","saturation"]),brightness=new Set(["brightness","minimum_brightness","intensity"]),transition=new Set(["transition","scene_cut_transition"]);
    root.querySelectorAll("[data-light-card]").forEach(card=>{
      const cap=this._lightCapabilities(card.dataset.entity);
      card.querySelectorAll("[data-override-check]").forEach(input=>{const key=input.dataset.overrideCheck;if((color.has(key)&&!cap.color)||(brightness.has(key)&&!cap.brightness)||(transition.has(key)&&!cap.transition))input.closest(".override-row").hidden=true;});
    });
    root.getElementById("backup-export")?.addEventListener("click",async()=>{
      const status=root.getElementById("backup-status");
      try{
        const backup=await this._hass.connection.sendMessagePromise({type:"ambilight_sync/export_backup"});
        const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
        a.href=url;a.download="ambilight-sync-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        status.textContent=this._label("Экспортированы сохранённые настройки без данных подключения TV.","Exported saved settings without TV connection credentials.");
      }catch(err){status.textContent=String(err?.message || err);}
    });
    root.getElementById("backup-import")?.addEventListener("click",()=>root.getElementById("backup-file").click());
    root.getElementById("backup-file")?.addEventListener("change",async event=>{
      const file=event.target.files?.[0];event.target.value="";if(!file)return;
      try{if(file.size>512000)throw new Error(this._label("Файл слишком большой (максимум 512 KB).","File exceeds 512 KB."));const data=JSON.parse(await file.text());if(data?.format!=="ambilight_sync.backup" || data.version!==1 || !Array.isArray(data.profiles))throw new Error(this._label("Неподдерживаемый формат резервной копии.","Unsupported backup format."));this._importBackupDialog(data);}
      catch(err){root.getElementById("backup-status").textContent=String(err?.message || err);}
    });
  }

  _roomSnapshot() { return clone(this._draft?.room || this.currentPreset?.rendering?.room); }

  _recordRoomAction(before) {
    const after=this._roomSnapshot();
    if(!before || JSON.stringify(before)===JSON.stringify(after))return;
    this._roomHistory.push({before,after});
    if(this._roomHistory.length>50)this._roomHistory.shift();
    this._roomFuture=[];this._updateRoomHistory();
  }

  _updateRoomHistory() {
    const undo=this.shadowRoot.getElementById("room-undo"),redo=this.shadowRoot.getElementById("room-redo");
    if(undo)undo.disabled=!this._roomHistory.length;
    if(redo)redo.disabled=!this._roomFuture.length;
  }

  _roomUndo(redo=false) {
    if(this._roomInputBefore){this._recordRoomAction(this._roomInputBefore);this._roomInputBefore=null;}
    const from=redo?this._roomFuture:this._roomHistory,to=redo?this._roomHistory:this._roomFuture,action=from.pop();
    if(!action)return;
    const point=clone(redo?action.after:action.before);to.push(action);
    if(this._draft.room)this._draft.room=point;else this.currentPreset.rendering.room=point;
    this._rendering();this._syncRoomFields();this._markDirty();this._drawRoom();this._queueRoomPreview();
  }

  _setIdentifyMessage(message="") {
    const el=this.shadowRoot.getElementById("identify-state");if(el){el.textContent=message;el.hidden=!message;}
  }

  _selectRoomNode(node) {
    if(!node){this._clearRoomSelection();return;}
    if(this._roomInputBefore){this._recordRoomAction(this._roomInputBefore);this._roomInputBefore=null;}
    this._roomNode=node;this._syncRoomFields();this._drawRoom();this._identifyRoomNode();
  }

  _clearRoomSelection() {
    if(this._roomInputBefore){this._recordRoomAction(this._roomInputBefore);this._roomInputBefore=null;}
    this._roomNode=null;this._roomClickOnNode=false;this._endIdentify();
    if(this.shadowRoot.activeElement?.closest?.('[data-room-node]'))this.shadowRoot.activeElement.blur();
    this._syncRoomFields();this._drawRoom();
  }

  _identifyRoomNode(renew=false) {
    clearTimeout(this._identifyLeaseTimer);this._identifyLeaseTimer=null;
    if(!this._roomNode || this._roomNode==="tv" || this._tab!=="atmosphere" || this.currentPreset?.rendering?.mode!=="ambient" || document.hidden){this._endIdentify();return;}
    const seq=++this._identifySeq,entry=this._entryId,connection=this._hass?.connection,node=this._roomNode,owner=this._identifyOwner;
    this._identifyTarget={entry,connection,node,owner};this._setIdentifyMessage();
    this._identifySerial=this._identifySerial.catch(()=>{}).then(async()=>{
      if(seq!==this._identifySeq || !connection || !this.isConnected)return;
      try{
        const result=await connection.sendMessagePromise({type:"ambilight_sync/identify",entry_id:entry,entity_id:node,owner,hold:true,renew});
        if(seq!==this._identifySeq || connection!==this._hass?.connection || !this.isConnected)return;
        if(result.identifying!==node || result.owned===false){this._clearRoomSelection();return;}
        this._identifyLeaseTimer=setTimeout(()=>this._identifyRoomNode(true),5000);
      }catch(err){if(seq===this._identifySeq){this._clearRoomSelection();this._requestError=String(err?.message || err);this._dismissedErrors.delete(this._entryId);this._updateStatusDom(this._lastStatus || {});}}
    });
  }

  _endIdentify() {
    clearTimeout(this._identifyLeaseTimer);this._identifyLeaseTimer=null;
    this._identifySeq++;
    const entry=this._identifyTarget?.entry || this._entryId,connection=this._identifyTarget?.connection || this._hass?.connection,owner=this._identifyTarget?.owner || this._identifyOwner;
    this._identifyTarget=null;this._setIdentifyMessage();
    if(!entry || !connection)return;
    this._identifySerial=this._identifySerial.catch(()=>{}).then(()=>connection.sendMessagePromise({type:"ambilight_sync/identify",entry_id:entry,entity_id:null,owner})).catch(()=>{});
  }

  _roomPoint() { const r=this.currentPreset?.rendering; return this._roomNode === "tv" ? r?.room.tv : r?.room.lights[this._roomNode]; }

  _syncRoomFields() {
    const root=this.shadowRoot, r=this.currentPreset?.rendering;
    if(!r || !root.getElementById("room-node")) return;
    if(this._roomNode && this._roomNode!=="tv" && !r.room.lights[this._roomNode]){this._roomNode=null;this._endIdentify();}
    root.getElementById("room-node").value=this._roomNode || "";
    const p=this._roomPoint();
    root.getElementById("room-object-properties").hidden=!p;
    root.querySelectorAll("[data-room-value]").forEach(input=>{input.disabled=!p;input.value=p?String(p[input.dataset.roomValue]):"";});
    root.querySelectorAll("[data-room-tv]").forEach(input=>{
      input.disabled=!p;
      if(input.dataset.roomTv!=="diagonal"){input.value=String(r.room.tv[input.dataset.roomTv]);return;}
      const tv=r.room.tv,meters=Math.hypot(tv.width,tv.height),inches=meters/.0254;
      const minimum=Math.max(.3/tv.width,.2/tv.height)*inches,maximum=Math.min(4/tv.width,3/tv.height)*inches;
      input.min=String(minimum);input.max=String(maximum);
      const rounded=Math.round(inches*10)/10;
      input.value=String(rounded<minimum || rounded>maximum?inches:rounded);
    });
    root.getElementById("room-tv-controls").hidden=this._roomNode!=="tv";
    root.getElementById("ambient-phosphor").checked=r.phosphor || r.behavior==="atmospheric";
    root.getElementById("ambient-phosphor").disabled=r.behavior==="atmospheric";
    this._updateRoomHistory();
  }

  _drawRoom() {
    const r=this.currentPreset?.rendering;
    if(r?.mode!=="ambient") return;
    const root=this.shadowRoot, tv=r.room.tv, points=[{id:"tv",...tv},...Object.entries(r.room.lights).map(([id,p])=>({id,...p}))];
    root.querySelectorAll("[data-room-position]").forEach(label=>{const p=r.room.lights[label.dataset.roomPosition];if(p)label.textContent=`X ${p.x} · Y ${p.y} · Z ${p.z} m`;});
    const angle=Number(tv.yaw)*Math.PI/180, cs=Math.cos(angle), sn=Math.sin(angle);
    const colors=this._roomPreview?.colors || {};
    const source=this._tvPreview || {};
    const emitters=[];
    for(const side of ["left","top","right","bottom"]){const pixels=source[side] || [];pixels.forEach((rgb,i)=>{
      const t=(i+.5)/pixels.length;
      const x=side==="left"?-tv.width/2:side==="right"?tv.width/2:side==="top"?tv.width*(t-.5):tv.width*(.5-t);
      const y=side==="top"?tv.height/2:side==="bottom"?-tv.height/2:side==="left"?tv.height*(t-.5):tv.height*(.5-t);
      emitters.push({x:tv.x+x*cs,y:tv.y+y,z:tv.z-x*sn,rgb});
    });}
    root.querySelectorAll("[data-room-view]").forEach(svg=>{
      if(!svg.getClientRects().length)return;
      const view=svg.dataset.roomView, front=view==="front", axis=front?"y":"z";
      const displayWidth=svg.getBoundingClientRect().width || 600, zoom=600/displayWidth;
      const margin=Math.max(35,30*zoom),usableX=600-2*margin,usableY=360-2*margin;
      let meta=this._roomViews[view];
      if(!this._roomDrag || !meta){
        const xs=points.map(p=>Number(p.x)).concat(tv.x-1,tv.x+1), values=points.map(p=>Number(p[axis]));
        const xmin=Math.min(-3,...xs)-.5,xmax=Math.max(3,...xs)+.5;
        const low=front?0:Math.min(-1,...values)-.5,high=front?Math.max(3,tv.y+tv.height/2+.5,...values)+.3:Math.max(4,...values)+.5;
        const scale=Math.min(usableX/(xmax-xmin),usableY/(high-low));
        meta={xmin,xmax,low,high,scale,ox:(600-(xmax-xmin)*scale)/2,oy:(360-(high-low)*scale)/2,front,axis};this._roomViews[view]=meta;
      }
      const project=p=>[meta.ox+(p.x-meta.xmin)*meta.scale,meta.oy+(front?meta.high-p[axis]:p[axis]-meta.low)*meta.scale];
      const grid=[];for(let x=Math.ceil(meta.xmin);x<=meta.xmax;x++){const a=project({x,y:meta.low,z:meta.low}),b=project({x,y:meta.high,z:meta.high});grid.push(`<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}"/>`);}
      for(let y=Math.ceil(meta.low);y<=meta.high;y++){const a=project({x:meta.xmin,y,z:y}),b=project({x:meta.xmax,y,z:y});grid.push(`<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}"/>`);}
      const corners=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,y])=>project({x:tv.x+x*tv.width*cs,y:tv.y+y*tv.height,z:tv.z-x*tv.width*sn}));
      const center=project(tv),end=project({x:tv.x+sn*.7,y:tv.y,z:tv.z+cs*.7});
      const tvShape=front?`<polygon points="${corners.map(p=>p.join(",")).join(" ")}" class="room-tv"/>`:`<path d="M${corners[0].join(" ")}L${corners[1].join(" ")}" class="room-tv-edge"/><path d="M${center.join(" ")}L${end.join(" ")}" class="room-facing"/><circle cx="${end[0]}" cy="${end[1]}" r="3" class="room-facing-dot"/>`;
      const leds=emitters.map(p=>{const [x,y]=project(p);return `<circle cx="${x}" cy="${y}" r="2.5" fill="rgb(${p.rgb.join(",")})" pointer-events="none"/>`;}).join("");
      const lampMarkup=points.filter(p=>p.id!=="tv").map((p,index)=>{
        const [x,y]=project(p),preview=this.profile?.active_preset===this._editPresetId ? this._latestPreviews[p.id] : null;
        let liveColor=preview?.smoothed_rgb;
        if(preview?.state && !["active","holding"].includes(preview.state)){
          liveColor=(preview.output_rgb || [0,0,0]).map(c=>c*Math.max(0,Math.min(255,preview.brightness || 0))/255);
        }
        const color=colors[p.id] || liveColor || [80,80,80];
        const safe=color.map(c=>Math.max(0,Math.min(255,Number(c)||0)));
        const name=this._lightName(p.id),short=name.length>23?name.slice(0,22)+"…":name;
        const selected=this._roomNode===p.id;
        return `<g data-room-node="${esc(p.id)}" tabindex="0" role="button" aria-label="${esc(name)}" class="room-node ${selected?"selected":""}"><title>${esc(name)}</title><circle cx="${x}" cy="${y}" r="${24*zoom}" fill="rgb(${safe.join(",")})" opacity=".18"/><circle cx="${x}" cy="${y}" r="${11*zoom}" fill="rgb(${safe.join(",")})" class="room-marker"/><circle cx="${x}" cy="${y}" r="${22*zoom}" fill="transparent" class="room-hit"/><text x="${x}" y="${y+4*zoom}" text-anchor="middle" style="font-size:${10*zoom}px" class="room-number">${index+1}</text>${selected?`<text x="${x}" y="${y+37*zoom}" text-anchor="middle" style="font-size:${11*zoom}px">${esc(short)}</text>`:""}</g>`;
      }).join("");
      const focused=svg.contains(root.activeElement)?root.activeElement?.closest("[data-room-node]")?.dataset.roomNode:null;
      svg.innerHTML=`<g class="room-grid">${grid.join("")}</g><g data-room-node="tv" tabindex="0" role="button" aria-label="${esc(this.t.tv)}" class="room-node ${this._roomNode==="tv"?"selected":""}">${tvShape}<circle cx="${center[0]}" cy="${center[1]}" r="${22*zoom}" class="room-tv-hit"/><text x="${center[0]}" y="${center[1]+4*zoom}" text-anchor="middle" style="font-size:${11*zoom}px" class="room-tv-label">TV</text></g>${leds}${lampMarkup}<text x="${12*zoom}" y="${360-12*zoom}" class="room-axis" style="font-size:${10*zoom}px">${front?"X → · Y ↑":"X → · Z ↓"} · m</text>`;
      if(focused) svg.querySelector(`[data-room-node="${CSS.escape(focused)}"]`)?.focus({preventScroll:true});
    });
  }

  _cancelRoomPreview() {
    clearTimeout(this._roomPreviewTimer);this._roomPreviewTimer=null;this._roomRequest=null;
    this._roomPreviewQueued=false;this._roomPreviewVersion++;this._roomPreview=null;this._roomDrag=null;
  }

  _queueRoomPreview() {
    this._roomPreviewVersion++;clearTimeout(this._roomPreviewTimer);
    this._roomPreviewTimer=setTimeout(()=>this._requestRoomPreview(),200);
  }

  _setRoomPreviewMessage(message="") {
    const text=this.shadowRoot.getElementById("room-preview-state");
    if(text){text.textContent=message;text.hidden=!message;}
  }

  async _requestRoomPreview() {
    const r=this.currentPreset?.rendering;
    if(!this._hass || !this.isConnected || this._tab!=="atmosphere" || r?.mode!=="ambient")return;
    if(this._roomRequest){this._roomPreviewQueued=true;return;}
    const request={entry:this._entryId,epoch:this._entryEpoch,preset:this._editPresetId,version:this._roomPreviewVersion,connection:this._hass.connection};
    this._roomRequest=request;
    try{
      const result=await request.connection.sendMessagePromise({type:"ambilight_sync/preview_ambient",entry_id:request.entry,rendering:clone(r),lights:clone(this.currentPreset.lights)});
      if(this._roomRequest!==request || request.entry!==this._entryId || request.epoch!==this._entryEpoch || request.preset!==this._editPresetId || request.version!==this._roomPreviewVersion || request.connection!==this._hass?.connection || !this.isConnected)return;
      this._roomPreview=result;this._drawRoom();
      this._setRoomPreviewMessage(result.available?"":this.t.roomWaiting);
    }catch(err){
      if(this._roomRequest===request && request.epoch===this._entryEpoch && request.preset===this._editPresetId && request.version===this._roomPreviewVersion){
        this._setRoomPreviewMessage(`${this.t.roomPreviewError}: ${err?.message || err}`);
      }
    }finally{if(this._roomRequest===request){this._roomRequest=null;if(this._roomPreviewQueued){this._roomPreviewQueued=false;this._requestRoomPreview();}}}
  }

  _wireRoomEvents() {
    const root=this.shadowRoot, mode=root.getElementById("rendering-mode");if(!mode)return;
    const change=()=>{this._markDirty();this._drawRoom();this._queueRoomPreview();};
    mode.addEventListener("change",()=>{this._readCurrentPresetControls();this._clearRoomSelection();this._cancelRoomPreview();this.currentPreset.rendering.mode=mode.value;this._markDirty();this._render();this._queueRoomPreview();});
    root.getElementById("ambient-behavior").addEventListener("change",event=>{this.currentPreset.rendering.behavior=event.target.value;this._syncRoomFields();change();});
    root.getElementById("ambient-phosphor").addEventListener("change",event=>{this.currentPreset.rendering.phosphor=event.target.checked;change();});
    root.getElementById("room-node").addEventListener("change",event=>this._selectRoomNode(event.target.value));
    root.getElementById("room-undo").addEventListener("click",()=>this._roomUndo());
    root.getElementById("room-redo").addEventListener("click",()=>this._roomUndo(true));
    root.getElementById("rendering-card").addEventListener("keydown",event=>{
      if(!(event.ctrlKey || event.metaKey) || event.altKey)return;
      if(event.key.toLowerCase()==="z" || event.key.toLowerCase()==="y"){
        event.preventDefault();this._roomUndo(event.shiftKey || event.key.toLowerCase()==="y");
      }
    });
    root.getElementById("room-use-alternate")?.addEventListener("click",()=>{
      const before=this._roomSnapshot(),item=this._draft.room_alternates[Number(root.getElementById("room-alternate").value)];
      this._draft.room.tv=clone(item.room.tv);Object.assign(this._draft.room.lights,clone(item.room.lights));
      this._rendering();this._recordRoomAction(before);this._syncRoomFields();change();
    });
    root.querySelectorAll("[data-room-value], [data-room-tv]").forEach(input=>{
      input.addEventListener("focus",()=>{this._roomInputBefore=this._roomSnapshot();});
      input.addEventListener("change",()=>{this._recordRoomAction(this._roomInputBefore);this._roomInputBefore=null;});
      input.addEventListener("input",()=>{
      if(!input.checkValidity() || !Number.isFinite(input.valueAsNumber))return;
      if(!this._roomInputBefore)this._roomInputBefore=this._roomSnapshot();
      if(input.dataset.roomValue)this._roomPoint()[input.dataset.roomValue]=input.valueAsNumber;
      else if(input.dataset.roomTv==="diagonal"){
        const tv=this.currentPreset.rendering.room.tv,scale=input.valueAsNumber*.0254/Math.hypot(tv.width,tv.height);
        tv.width*=scale;tv.height*=scale;
      }else this.currentPreset.rendering.room.tv[input.dataset.roomTv]=input.valueAsNumber;
      change();
    });});
    const move=(svg,event)=>{const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;return point.matrixTransform(svg.getScreenCTM().inverse());};
    root.querySelectorAll("[data-room-view]").forEach(svg=>{
      svg.addEventListener("pointerdown",event=>{if(event.button!==0)return;const target=event.target.closest("[data-room-node]");this._roomClickOnNode=!!target;if(!target)return;
        this._selectRoomNode(target.dataset.roomNode);const p=move(svg,event),pos=this._roomPoint();
        this._roomDrag={view:svg.dataset.roomView,pointer:event.pointerId,start:p,point:{...pos},historyBefore:this._roomSnapshot()};svg.setPointerCapture(event.pointerId);this._drawRoom();event.preventDefault();
      });
      svg.addEventListener("pointermove",event=>{const drag=this._roomDrag;if(!drag || drag.pointer!==event.pointerId || drag.view!==svg.dataset.roomView)return;
        const p=move(svg,event),meta=this._roomViews[drag.view],pos=this._roomPoint();
        const round=v=>Math.round(v*100)/100;
        pos.x=Math.max(-15,Math.min(15,round(drag.point.x+(p.x-drag.start.x)/meta.scale)));
        pos[meta.axis]=Math.max(meta.front?0:-15,Math.min(meta.front?6:15,round(drag.point[meta.axis]+(p.y-drag.start.y)/meta.scale*(meta.front?-1:1))));
        this._syncRoomFields();this._markDirty();this._drawRoom();
      });
      const finish=event=>{if(!this._roomDrag)return;const drag=this._roomDrag;this._roomDrag=null;
        if(event.type==="pointercancel"){Object.assign(this._roomPoint(),drag.point);this._syncRoomFields();}
        else this._recordRoomAction(drag.historyBefore);
        this._drawRoom();this._queueRoomPreview();};
      svg.addEventListener("pointerup",finish);svg.addEventListener("pointercancel",finish);
      svg.addEventListener("keydown",event=>{
        const target=event.target.closest("[data-room-node]");if(!target)return;
        if(["Enter"," "].includes(event.key)){event.preventDefault();this._selectRoomNode(target.dataset.roomNode);return;}
        if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;
        event.preventDefault();if(this._roomNode!==target.dataset.roomNode)this._selectRoomNode(target.dataset.roomNode);
        const before=this._roomSnapshot(),p=this._roomPoint(),meta=this._roomViews[svg.dataset.roomView],step=event.shiftKey ? .5 : .1;
        if(event.key==="ArrowLeft" || event.key==="ArrowRight")p.x=Math.max(-15,Math.min(15,Math.round((p.x+(event.key==="ArrowLeft"?-step:step))*100)/100));
        else p[meta.axis]=Math.max(meta.front?0:-15,Math.min(meta.front?6:15,Math.round((p[meta.axis]+(event.key==="ArrowUp"?-step:step)*(meta.front?-1:1))*100)/100));
        this._recordRoomAction(before);this._syncRoomFields();change();
      });
    });
    const ambient=this.currentPreset.rendering.mode==="ambient";
    root.querySelectorAll("#color_mode").forEach(input=>input.closest(".control").hidden=ambient);
    this._syncRoomFields();this._drawRoom();
    if(this._tab==="atmosphere" && ambient)this._queueRoomPreview();
    this._roomResizeObserver?.disconnect();
    if(typeof ResizeObserver!=="undefined"){
      this._roomResizeObserver=new ResizeObserver(()=>{if(!this._roomDrag)this._drawRoom();});
      this._roomResizeObserver.observe(root.getElementById("ambient-room-settings"));
    }
  }
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

  _settingsMarkup(g, basicsOnly = false) {
    const t = this.t;
    const range = (key, label, help = "") => this._range(key, label, g[key] ?? NEW_DEFAULTS[key], help ? esc(help) : "");
    const section = (id, title, content) => `<div class="settings-section"><button type="button" class="settings-toggle" data-settings-toggle="${id}" aria-expanded="${this._openSettings === id}" aria-controls="settings-${id}"><span><strong>${esc(title)}</strong><small data-settings-summary="${id}">${esc(this._settingsSummary(id, g))}</small></span><span class="chevron" aria-hidden="true">›</span></button><div id="settings-${id}" class="section-controls" ${this._openSettings === id ? "" : "hidden"}>${content}</div></div>`;
    const source = `<div class="control"><div class="control-heading"><label for="source" class="control-title">${esc(t.source)}</label>${this._info("source_help", esc(g.source === "measured" ? t.measuredDesc : t.processedDesc))}</div><select id="source"><option value="processed" ${g.source !== "measured" ? "selected" : ""}>${esc(t.processed)}</option><option value="measured" ${g.source === "measured" ? "selected" : ""}>${esc(t.measured)}</option></select></div>`;
    const mode = g.color_mode || "average";
    const algorithm = `<div class="control"><div class="control-heading"><label for="color_mode" class="control-title">${esc(t.colorMode)}</label>${this._info("color_mode_help", esc(t[`${mode}Desc`]))}</div><select id="color_mode">${["average", "perceptual", "dominant"].map((key) => `<option value="${key}" ${mode === key ? "selected" : ""}>${esc(t[key])}</option>`).join("")}</select></div>`;
    if (basicsOnly) return `<section class="card atmosphere-settings"><h2>${esc(t.global)}</h2><p class="intro">${esc(t.globalHint)}</p><div class="section-controls">${source + algorithm + range("intensity", t.intensity, t.intensityDesc) + range("saturation", t.saturation) + range("minimum_brightness", t.minBrightness) + range("brightness", t.brightness)}</div></section>`;
    return `<section class="card settings-accordion">
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
    return `<div class="override-row"><label class="override-check"><input type="checkbox" data-override-check="color_mode" ${enabled ? "checked" : ""}><span>${esc(this.t.colorMode)}</span></label><select aria-label="${esc(this.t.colorMode)}" data-override-value="color_mode" ${enabled ? "" : "disabled"}><option value="average" ${value === "average" ? "selected" : ""}>${esc(this.t.average)}</option><option value="perceptual" ${value === "perceptual" ? "selected" : ""}>${esc(this.t.perceptual)}</option><option value="dominant" ${value === "dominant" ? "selected" : ""}>${esc(this.t.dominant)}</option></select></div>`;
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
    const refs = this._lightNodes.get(card.dataset.entity);
    const segments = refs?.segments || [...card.querySelectorAll("[data-spatial-segment]")];
    const summary = refs?.summary || card.querySelector("[data-spread-summary]");
    if (!segments.length) {
      if (summary) summary.textContent = this.t.spreadWaiting;
      return;
    }

    const x = Number(card.querySelector("[data-position-x]")?.value || 0);
    const y = Number(card.querySelector("[data-position-y]")?.value || 0);
    const falloff = Math.max(5, Math.min(100, Number(card.querySelector("[data-position-falloff]")?.value || 45)));
    const weightsKey = `${x}|${y}|${falloff}`;
    if (refs?.weightsKey === weightsKey) return;
    if (refs) refs.weightsKey = weightsKey;
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
    const refs = this._lightNodes.get(entityId);
    // Hidden maps catch up when opened. The color/status snapshot still updates.
    if (!refs || this._tab !== "lights" || !refs.position?.open || refs.spatial?.hidden ||
        this.profile?.active_preset !== this._editPresetId || !Array.isArray(preview?.spatial_map)) return;
    const spatialMap = preview.spatial_map;
    const topology = JSON.stringify(spatialMap.map((segment) => [Number(segment.x ?? 0), Number(segment.y ?? 0), segment.side || ""]));
    if (refs.topology !== topology) {
      const sameNodes = refs.segments.length === spatialMap.length && refs.segments.every((node, i) =>
        Number(node.dataset.x) === Number(spatialMap[i].x ?? 0) &&
        Number(node.dataset.y) === Number(spatialMap[i].y ?? 0) &&
        node.dataset.side === (spatialMap[i].side || ""));
      if (!sameNodes) {
        refs.container.innerHTML = this._spatialSegmentsMarkup(spatialMap);
        refs.segments = [...refs.container.querySelectorAll("[data-spatial-segment]")];
      }
      refs.topology = topology;
      refs.colors = [];
      refs.weightsKey = null;
    }
    spatialMap.forEach((segment, i) => {
      const rgb = Array.isArray(segment.rgb) ? segment.rgb : [90,90,90];
      const color = rgb.join(",");
      if (refs.colors[i] !== color) {
        refs.segments[i].style.backgroundColor = `rgb(${color})`;
        refs.colors[i] = color;
      }
    });
    this._refreshSpatialWeights(refs.card);
  }

  _lightCard(entityId) {
    const t = this.t;
    const cfg = this.currentPreset.lights[entityId];
    const ambient = this.currentPreset.rendering?.mode === "ambient";
    const roomPoint = this.currentPreset.rendering?.room?.lights?.[entityId];
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
    const sourceRows = sources.map((source, index) => `<div class="source-row" data-source-index="${index}"><select data-source-zone aria-label="${esc(t.sourceZone)}">${this._zoneOptions(source.zone)}</select><label class="weight"><input data-source-weight aria-label="${esc(t.weight)}" type="number" min="1" max="1000" step="1" value="${esc(source.weight ?? 100)}"><span>%</span></label><button class="icon-btn" data-remove-source="${index}" aria-label="${esc(t.removeSource)}: ${esc(t[source.zone] || source.zone)}" ${sources.length<=1?"disabled":""} title="${esc(t.removeSource)}">×</button></div>`).join("");
    const overrideCount = Object.keys(cfg.overrides || {}).length;
    const previewText = inputRgb ? `${t.input} rgb(${inputRgb.join(", ")}) · ${t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0) / 255 * 100)}%` : "—";
    const diagText = diag ? `${t.targetRate} ${diag.target_rate_hz} Hz · ${t.queuedRate} ${diag.queued_rate_hz} Hz · ${t.actualRate} ${diag.actual_rate_hz} Hz · cuts ${diag.scene_cuts ?? 0} (${diag.scene_cut_score ?? 0}%) · ${t.replaced} ${diag.replaced_frames} · ${t.latency} ${diag.avg_latency_ms} ms` : "—";
    const left = Math.max(0, Math.min(100, (posX + 100) / 2));
    const top = Math.max(0, Math.min(100, (posY + 100) / 2));

    return `<section class="light-card" data-light-card data-entity="${esc(entityId)}">
      <div class="light-head"><div class="preview-dot" data-preview="${esc(entityId)}" style="background:rgb(${rgb.join(",")})"></div><div class="light-name"><strong title="${esc(this._lightName(entityId))}">${esc(this._lightName(entityId))}</strong></div><div class="light-actions"><details class="light-menu"><summary aria-label="${esc(this._label("Действия со светильником","Light actions"))}">⋯</summary><button type="button" data-copy-settings="${esc(entityId)}">${esc(this._label("Копировать настройки","Copy Settings"))}</button></details><button class="remove-light" data-remove-light="${esc(entityId)}" title="${esc(t.removeLight)}" aria-label="${esc(t.removeLight)}: ${esc(this._lightName(entityId))}">×</button></div></div>
      <label class="check-row participation-row"><input type="checkbox" data-participating="${esc(entityId)}" ${this._lastStatus?.excluded?.includes(entityId)?"":"checked"}><span>${esc(this._label("Участвует в синхронизации","Participates in synchronization"))}</span></label>
      <details class="light-diagnostics disclosure"><summary>${esc(t.diagnostics)}</summary><small>${esc(entityId)}</small>
      <div class="preview-line"><span>${esc(t.preview)}</span><span data-preview-text="${esc(entityId)}">${esc(previewText)}</span></div>
      <div class="diagnostic-line"><span>${esc(t.diagnostics)}</span><span data-diagnostics-text="${esc(entityId)}">${esc(diagText)}</span></div>
      </details>

      ${ambient ? `<div class="ambient-light-position"><span data-room-position="${esc(entityId)}">${roomPoint ? `X ${esc(roomPoint.x)} · Y ${esc(roomPoint.y)} · Z ${esc(roomPoint.z)} m` : ""}</span><button type="button" class="secondary" data-room-open="${esc(entityId)}">${esc(t.roomOpen)}</button></div>` : ""}
      <details class="position-settings disclosure" ${ambient?"hidden":""}><summary>${esc(t.positioning)}</summary>
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
      <details class="override-box disclosure"><summary>${esc(t.overrides)}${overrideCount ? ` · ${overrideCount}` : ""}</summary><p>${esc(t.overridesHint)}</p><div class="override-grid">
        <div ${ambient?"hidden":""}>${this._overrideColorMode(entityId)}</div>
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
        <div ${ambient?"hidden":""}>${this._overrideRange(entityId, "corner_influence", t.cornerInfluence)}</div>
      </div></details>
    </section>`;
  }

  _readCurrentPresetControls() {
    const preset = this.currentPreset;
    if (!preset || !this.shadowRoot?.getElementById("update_rate")) return;
    const root = this.shadowRoot;
    const g = preset.global;
    for (const key of ["source", "color_mode"]) {
      const input = root.getElementById(key);
      if (input.dataset.edited) g[key] = input.value;
    }
    GLOBAL_RANGES.forEach((key) => {
      const input = root.getElementById(key);
      if (input.dataset.edited) g[key] = Number(input.value);
    });
    if (root.getElementById("restore_on_stop").dataset.edited) g.restore_on_stop = root.getElementById("restore_on_stop").checked;

    root.querySelectorAll("[data-light-card]").forEach((card) => {
      const entityId = card.dataset.entity;
      const light = preset.lights[entityId];
      if (!light) return;
      for (const [key,selector] of [["position_mode","[data-position-mode]"],["position_x","[data-position-x]"],["position_y","[data-position-y]"],["position_falloff","[data-position-falloff]"]]) {
        const input = card.querySelector(selector);
        if (input?.dataset.edited) light[key] = key === "position_mode" ? input.value : Number(input.value);
      }
      if (card.querySelector(".source-row [data-edited]")) {
        light.sources = [...card.querySelectorAll(".source-row")].map((row) => ({ zone: row.querySelector("[data-source-zone]").value, weight: Number(row.querySelector("[data-source-weight]").value) || 0 })).filter((source) => source.weight > 0);
      }
      const overrides = {};
      card.querySelectorAll("[data-override-check]").forEach((check) => {
        if (!check.checked) return;
        const key = check.dataset.overrideCheck;
        const input = card.querySelector(`[data-override-value="${CSS.escape(key)}"]`);
        if (input.dataset.edited) overrides[key] = key === "color_mode" ? input.value : Number(input.value);
        else overrides[key] = light.overrides?.[key] ?? g[key];
      });
      light.overrides = overrides;
    });
  }

  _switchEditPreset(id) {
    this._clearRoomSelection();
    this._readCurrentPresetControls();
    if (this.profile?.presets?.[id]) { this._cancelRoomPreview(); this._editPresetId = id; this._render(); this._queueRoomPreview(); }
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
    this._markDirty();
    this._render();
  }

  _renamePreset() {
    this._readCurrentPresetControls();
    if (!this.currentPreset) return;
    const name = window.prompt(this.t.presetName, this.currentPreset.name);
    if (!name?.trim()) return;
    this.currentPreset.name = name.trim();
    this._markDirty();
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
    this._markDirty();
    this._render();
  }

  _addLight(entityId) {
    this._readCurrentPresetControls();
    if (!entityId || !this.currentPreset || this.currentPreset.lights[entityId]) return;
    this.currentPreset.lights[entityId] = { position_mode: "spatial", position_x: 0, position_y: 0, position_falloff: 45, sources: [{ zone: "all", weight: 100 }], overrides: {} };
    this._markDirty();
    this._render();
  }
  _removeLight(entityId) { this._readCurrentPresetControls(); if (this.currentPreset?.lights?.[entityId]) { delete this.currentPreset.lights[entityId]; this._markDirty(); this._render(); } }
  _addSource(entityId) { this._readCurrentPresetControls(); const l=this.currentPreset?.lights?.[entityId]; if(l){ l.sources ||= []; l.sources.push({zone:"all",weight:100}); this._markDirty(); this._render(); } }
  _removeSource(entityId,index) { this._readCurrentPresetControls(); const l=this.currentPreset?.lights?.[entityId]; if(!l) return; if((l.sources||[]).length<=1) return; l.sources.splice(index,1); this._markDirty(); this._render(); }

  async _save(activate = false) {
    if (!this.currentEntry || !this.profile || this._saving) return;
    if(this.currentPreset?.rendering?.mode === "ambient") {
      const invalid=this.shadowRoot.querySelector("[data-room-value]:invalid, [data-room-tv]:invalid");
      if(invalid){invalid.reportValidity();return;}
    }
    this._readCurrentPresetControls();
    const entryId = this.currentEntry.entry_id;
    const entryEpoch = this._entryEpoch;
    const draftRevision = this._draftRevision;
    const payload = clone(this.profile);
    if (activate) payload.active_preset = this._editPresetId;
    const expectedRevision = this._draft.profile_revision;
    const room=this._draft.room ? clone(this._draft.room) : null,roomRevision=this._draft.room_revision;
    this._saving = true;
    this._requestError = null;
    this._setSaveState(this.t.saving, true);
    try {
      const updated = await this._hass.connection.sendMessagePromise({ type:"ambilight_sync/save_profile_config", entry_id:entryId, profile_config:payload, expected_revision:expectedRevision, ...(room?{room,room_revision:roomRevision}:{}) });
      const idx = this._entries.findIndex((e) => e.entry_id === updated.entry_id);
      if (idx >= 0) this._entries[idx] = updated;
      if (this._entryId !== entryId || this._draft?.entry_id !== entryId || this._entryEpoch !== entryEpoch) return;
      const unchanged = this._draftRevision === draftRevision;
      if (unchanged) {
        this._draft = clone(updated);
        this._dirty = false;
        // Preserve DOM identity/focus while showing the normalized saved values.
        const g = this.currentPreset?.global || {};
        for (const key of GLOBAL_RANGES) {
          const input = this.shadowRoot.getElementById(key);
          if (!input) continue;
          input.value = String(g[key] ?? NEW_DEFAULTS[key]);
          input.removeAttribute("data-edited");
          const output = this.shadowRoot.getElementById(`${key}_out`);
          const unit = RANGE_META[key][3] ? this.t[RANGE_META[key][3]] : "";
          if (output) output.textContent = `${g[key] ?? NEW_DEFAULTS[key]}${unit ? ` ${unit}` : ""}`;
          this._syncRangeFill(input);
        }
        this.shadowRoot.querySelectorAll("[data-edited]").forEach((input) => input.removeAttribute("data-edited"));
        this._syncDarkSceneUi();
        this._updateSettingsSummaries();
        this._roomPreviewVersion++;
        clearTimeout(this._roomPreviewTimer);
        this._roomPreviewQueued=false;
        this._roomPreview=null;
        this._syncRoomFields();
        this._drawRoom();
        this._queueRoomPreview();
      } else {
        this._draft.profile_revision = updated.profile_revision;
        this._draft.room_revision = updated.room_revision;
        if (this.profile.presets[updated.profile_config.active_preset]) this.profile.active_preset = updated.profile_config.active_preset;
      }
      this._conflict = false;
      this._lastStatus = updated.status;
      this._tvPreview = updated.status?.tv_preview || null;
      this._updateAmbientPreview(this._tvPreview);
      if (!this.profile.presets[this._editPresetId]) this._editPresetId = this.profile.active_preset;
      this._updateStatusDom(updated.status);
      this._updateDiagnosticsDom(updated.status?.diagnostics || {});
      this._setSaveState(activate ? this.t.activated : this.t.saved, false);
      this._updatePresetBadge();
      window.setTimeout(() => {
        if (this._entryId !== entryId || this._entryEpoch !== entryEpoch || this._saving) return;
        this._setSaveState(this.t.save, false);
        const footer = this.shadowRoot?.querySelector(".actions");
        if (footer && !this._dirty && !this._saving) footer.hidden = true;
      }, 1400);
    } catch (err) {
      if (this._entryId !== entryId || this._entryEpoch !== entryEpoch) return;
      if (err?.code === "conflict") this._conflict = true;
      this._requestError = this._conflict ? this._conflictText() : `${this.t.saveError}: ${err?.message || err}`;
      this._setSaveState(this._requestError, false, true);
      this._updateStatusDom(this._lastStatus);
    } finally { this._saving = false; }
  }

  async _refreshStatus() {
    if (!this._hass || !this._entryId || this._loading || this._statusRequest) return;
    const request = {entryId:this._entryId, connection:this._hass.connection};
    const {entryId,connection} = request;
    this._statusRequest = request;
    try {
      const status = await connection.sendMessagePromise({ type:"ambilight_sync/get_status", entry_id:entryId });
      if (this._statusRequest !== request || entryId !== this._entryId || connection !== this._hass?.connection || !this.isConnected) return;
      this._lastStatus = status;
      this._connectionError = null;
      this._tvPreview = status.tv_preview || null;
      this._updateAmbientPreview(this._tvPreview);
      if (status?.active_preset && this.profile?.presets?.[status.active_preset]) {
        this.profile.active_preset = status.active_preset;
        this._updatePresetBadge();
      }
      this._updateStatusDom(status);
      this._updatePreviewDom(status.previews || {});
      if(this._tab==="atmosphere" && this.currentPreset?.rendering?.mode==="ambient" &&
         (this._dirty || this.profile?.active_preset!==this._editPresetId) && !document.hidden)this._queueRoomPreview();
      this._updateDiagnosticsDom(status.diagnostics || {});
      if (((status.profile_revision && status.profile_revision !== this._draft?.profile_revision) || (status.room_revision && status.room_revision !== this._draft?.room_revision)) && !this._saving) {
        if (this._dirty) {
          this._conflict = true;
          this._requestError = this._conflictText();
          this._updateStatusDom(status);
        } else await this._refreshEntryConfig(request);
      }
    } catch (_) {
      if (this._statusRequest === request) {
        this._connectionError = this.t === TEXT.ru ? "Нет связи. Показаны последние полученные данные." : "Disconnected. Showing the last received data.";
        this._updateStatusDom(this._lastStatus);
      }
    } finally {
      if (this._statusRequest === request) this._statusRequest = null;
    }
  }

  _conflictText() {
    return this.t === TEXT.ru ? "Настройки изменены в другом окне. Обновите их перед сохранением." : "Settings changed in another window. Reload before saving.";
  }

  async _refreshEntryConfig(request) {
    if (this._configRequest) return;
    this._configRequest = request;
    const revision = this._draftRevision;
    try {
      const data = await request.connection.sendMessagePromise({type:"ambilight_sync/get_config"});
      if (this._configRequest !== request || this._entryId !== request.entryId || this._hass?.connection !== request.connection || this._dirty || this._draftRevision !== revision || !this.isConnected) return;
      const updated = data.entries?.find((entry) => entry.entry_id === request.entryId);
      if (!updated) return;
      this._entries = data.entries;
      this._draft = clone(updated);
      if (!this.profile.presets[this._editPresetId]) this._editPresetId = this.profile.active_preset;
      this._lastStatus = updated.status;
      this._requestError = null;
      this._conflict = false;
      this._render();
    } finally {
      if (this._configRequest === request) this._configRequest = null;
    }
  }

  async _refreshTVPreview() {
    if (!this._hass || !this._entryId || this._loading || this._previewRequest || !this.isConnected || this._tab !== "atmosphere" || document.hidden || !this.getClientRects().length) return;
    const request = {entryId: this._entryId, connection: this._hass.connection};
    this._previewRequest = request;
    try {
      const data = await request.connection.sendMessagePromise({type: "ambilight_sync/get_tv_preview", entry_id: request.entryId});
      if (this._previewRequest !== request || request.entryId !== this._entryId || request.connection !== this._hass?.connection || !this.isConnected) return;
      this._tvPreview = data.tv_preview || null;
      this._updateAmbientPreview(this._tvPreview);
    } catch (_) {
      // Keep the last frame during transient connection errors.
    } finally {
      if (this._previewRequest === request) this._previewRequest = null;
    }
  }

  _updateStatusDom(status) {
    this.shadowRoot?.querySelectorAll("[data-participating]").forEach(input=>{if(!input.disabled)input.checked=!status?.excluded?.includes(input.dataset.participating);});
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
    const message = this._requestError || this._connectionError || status?.last_error;
    if(!message)this._dismissedErrors.delete(this._entryId);
    if (error) {
      error.querySelector("[data-error-message]").textContent=message?`${this.t.error}: ${message}`:"";
      error.hidden=!message || this._dismissedErrors.get(this._entryId)===message;
    }
    this._updateAmbientPreview(this._tvPreview,running);
    const reload = this.shadowRoot?.getElementById("reload-config");
    if (reload) reload.hidden = !this._conflict;
  }

  async _toggleSync() {
    if (this._toggling || !this.currentEntry) return;
    this._clearRoomSelection();
    this._toggling = true;
    const entryId = this.currentEntry.entry_id, entryEpoch = this._entryEpoch;
    this._requestError = null;
    this._updateStatusDom(this._lastStatus || this.currentEntry.status || {});
    try {
      const running = !Boolean((this._lastStatus || this.currentEntry.status || {}).running);
      const status = await this._hass.connection.sendMessagePromise({
        type: "ambilight_sync/set_running",
        entry_id: entryId,
        running,
      });
      if (entryId !== this._entryId || entryEpoch !== this._entryEpoch) return;
      this._lastStatus = status;
      this._tvPreview = status.tv_preview || null;
      this._updateAmbientPreview(this._tvPreview);
      this._updateStatusDom(status);
      this._updatePreviewDom(status.previews || {});
      this._updateDiagnosticsDom(status.diagnostics || {});
    } catch (err) {
      if (entryId !== this._entryId || entryEpoch !== this._entryEpoch) return;
      this._requestError = String(err?.message || err);
    } finally {
      this._toggling = false;
      this._updateStatusDom(this._lastStatus || this.currentEntry.status || {});
    }
  }

  _updatePreviewDom(previews) {
    this._latestPreviews = previews;
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
      const refs = this._lightNodes.get(entityId);
      const dot = refs?.dot;
      const text = refs?.previewText;
      const rgb = preview.output_rgb || [0,0,0];
      if (dot) dot.style.background = `rgb(${rgb.join(",")})`;
      if (text) { const input = preview.input_rgb || [0,0,0]; text.textContent = `${this.t.input} rgb(${input.join(", ")}) · ${this.t.output} rgb(${rgb.join(", ")}) · ${Math.round((preview.brightness || 0)/255*100)}%`; }
      this._updateSpatialMapDom(entityId, preview);
    }
    if(this.currentPreset?.rendering?.mode === "ambient" && !this._dirty && !this._roomDrag){
      this._roomPreview=null;this._drawRoom();
      if(Object.keys(previews).length)this._setRoomPreviewMessage();
    }
  }

  _updateDiagnosticsDom(diagnostics) {
    const tv = diagnostics?.tv || {};
    const tvEl = this.shadowRoot?.getElementById("tv-diagnostics");
    if (tvEl) {
      const stuck = tv.processed_stuck_warning ? ` · ⚠ ${this.t.stuckProcessed}` : "";
      tvEl.textContent = `${this.t.targetRate} ${tv.target_poll_rate_hz ?? 0} Hz · ${this.t.actualRate} ${tv.actual_poll_rate_hz ?? 0} Hz${stuck}`;
    }
    const renderer=this.shadowRoot?.getElementById("renderer-diagnostics"),r=diagnostics?.rendering;
    if(renderer)renderer.textContent=r?`${r.active_mode} · ${r.behavior} · ${r.segments} segments · ${r.last_processing_ms} ms` : "—";
    for (const [entityId, diag] of Object.entries(diagnostics?.lights || {})) {
      const text = this._lightNodes.get(entityId)?.diagnosticsText;
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

  _markDirty() {
    this._draftRevision++;
    this._dirty = true;
    const footer = this.shadowRoot?.querySelector(".actions");
    if (footer) footer.hidden = false;
  }

  _setSaveState(text, disabled, error=false) {
    const btn = this.shadowRoot?.getElementById("save");
    if (!btn) return;
    const footer = btn.closest(".actions");
    if (footer) footer.hidden = false;
    btn.textContent = error?this.t.save:text; btn.disabled = disabled; btn.classList.toggle("save-error", error);
    const discard=this.shadowRoot.getElementById("discard"),feedback=this.shadowRoot.getElementById("save-feedback");
    if(discard)discard.disabled=disabled;
    if(feedback){feedback.textContent=error?text:"";feedback.hidden=!error;}
  }

  async _discardDraft() {
    if(!this._dirty || this._saving || this._discarding)return;
    const entry=this._entryId,epoch=this._entryEpoch,version=this._draftRevision,preset=this._editPresetId;
    this._discarding=true;this.shadowRoot.getElementById("discard").disabled=true;this.shadowRoot.getElementById("save").disabled=true;
    try{
      const data=await this._hass.connection.sendMessagePromise({type:"ambilight_sync/get_config"});
      if(entry!==this._entryId || epoch!==this._entryEpoch || version!==this._draftRevision || !this.isConnected)return;
      const updated=data.entries?.find(e=>e.entry_id===entry);if(!updated)throw Error(this.t.noEntries);
      this._clearRoomSelection();this._entries=data.entries;this._draft=clone(updated);this._draftRevision++;
      this._dirty=false;this._requestError=null;this._conflict=false;this._roomHistory=[];this._roomFuture=[];this._roomInputBefore=null;
      this._editPresetId=this.profile.presets[preset]?preset:this.profile.active_preset;
      this._lastStatus=updated.status;this._render();
    }catch(err){this._requestError=String(err?.message || err);this._setSaveState(this._requestError,false,true);}
    finally{this._discarding=false;const save=this.shadowRoot.getElementById("save"),discard=this.shadowRoot.getElementById("discard");if(save)save.disabled=this._saving;if(discard)discard.disabled=this._saving;}
  }

  _updateRangeOutput(input) {
    const key = input.id || input.dataset.overrideValue;
    const meta = RANGE_META[key];
    if (!meta) return;
    this._syncRangeFill(input);
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
    this._lightNodes = new Map([...root.querySelectorAll("[data-light-card]")].map((card) => {
      const container = card.querySelector("[data-position-segments]");
      return [card.dataset.entity, {card, container,
        position:card.querySelector(".position-settings"), spatial:card.querySelector("[data-spatial-config]"),
        summary:card.querySelector("[data-spread-summary]"), segments:[...container.querySelectorAll("[data-spatial-segment]")],
        dot:card.querySelector("[data-preview]"), previewText:card.querySelector("[data-preview-text]"),
        diagnosticsText:card.querySelector("[data-diagnostics-text]"), topology:null, colors:[], weightsKey:null}];
    }));
    this._lightNodes.forEach((refs, entityId) => {
      refs.position.addEventListener("toggle", () => {
        if (refs.position.open) this._updateSpatialMapDom(entityId, this._latestPreviews[entityId]);
      });
    });
    const markInput = (event) => {
      if (!event.target.matches("input, select") || event.target.closest("dialog") || event.target.matches("[data-participating]") || ["entry-select", "preset-select", "debug-light", "room-node", "backup-file", "room-alternate"].includes(event.target.id)) return;
      event.target.dataset.edited = "true";
      this._markDirty();
    };
    if (this._draftInputListener) {
      root.removeEventListener("input", this._draftInputListener);
      root.removeEventListener("change", this._draftInputListener);
    }
    this._draftInputListener = markInput;
    root.addEventListener("input", markInput);
    root.addEventListener("change", markInput);
    root.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => this._showTab(button.dataset.tab));
      button.addEventListener("keydown", (event) => {
        const tabs = [...root.querySelectorAll("[data-tab]")];
        const index = tabs.indexOf(button);
        const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;
        if (next < 0) return;
        event.preventDefault(); this._showTab(tabs[next].dataset.tab); tabs[next].focus();
      });
    });
    root.querySelectorAll('input[type="range"]').forEach((input) => {
      this._syncRangeFill(input);
      input.addEventListener("input", () => this._syncRangeFill(input));
      if (!input.hasAttribute("aria-label") && !input.labels?.length) {
        const label = input.closest(".override-row")?.querySelector(".override-check span") || input.closest(".position-range")?.querySelector("span");
        if (label) input.setAttribute("aria-label", label.textContent);
      }
    });
    this._updateAmbientPreview(this._tvPreview);
    this._updateStatusDom(this._lastStatus || this.currentEntry?.status || {});
    root.getElementById("dismiss-error")?.addEventListener("click",()=>{
      const message=this._requestError || this._connectionError || this._lastStatus?.last_error || this.currentEntry?.status?.last_error;
      if(message)this._dismissedErrors.set(this._entryId,message);
      root.getElementById("status-error").hidden=true;
    });
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
      this._markDirty();
      for (const key of ["neutral_strength", "neutral_noise_floor"]) {
        const input = root.getElementById(key);
        input.value = NEW_DEFAULTS[key];
        input.dataset.edited = "true";
        this._updateRangeOutput(input);
      }
    });
    root.getElementById("entry-select")?.addEventListener("change", (e) => {
      this._clearRoomSelection();this._roomHistory=[];this._roomFuture=[];this._roomInputBefore=null;
      this._readCurrentPresetControls();
      this._entryId = e.target.value;
      this._entryEpoch++;
      this._cancelRoomPreview();
      this._dirty = false;
      this._draftRevision++;
      this._requestError = null;
      this._conflict = false;
      this._statusRequest = null;
      this._configRequest = null;
      const entry = this.currentEntry;
      this._draft = entry ? clone(entry) : null;
      this._editPresetId = this.profile?.active_preset || Object.keys(this.profile?.presets || {})[0] || null;
      this._lastStatus = entry?.status || null;
      this._tvPreview = this._lastStatus?.tv_preview || null;
      this._previewRequest = null;
      this._render();
      this._refreshTVPreview();
      this._queueRoomPreview();
    });
    root.getElementById("preset-select")?.addEventListener("change", (e) => this._switchEditPreset(e.target.value));
    root.getElementById("create-preset")?.addEventListener("click", () => this._createPreset(false));
    root.getElementById("duplicate-preset")?.addEventListener("click", () => this._createPreset(true));
    root.getElementById("rename-preset")?.addEventListener("click", () => this._renamePreset());
    root.getElementById("delete-preset")?.addEventListener("click", () => this._deletePreset());
    root.getElementById("activate-preset")?.addEventListener("click", () => this._save(true));
    root.getElementById("sync-toggle")?.addEventListener("click", () => this._toggleSync());
    root.getElementById("save")?.addEventListener("click", () => this._save(false));
    root.getElementById("discard")?.addEventListener("click", () => this._discardDraft());
    root.getElementById("reload-config")?.addEventListener("click", () => {
      const message = this.t === TEXT.ru ? "Загрузить актуальные настройки? Несохранённые изменения этого телевизора будут потеряны." : "Reload saved settings? Unsaved changes for this TV will be discarded.";
      if (!this._dirty || window.confirm(message)) this._load();
    });
    root.querySelectorAll("[data-room-open]").forEach(button=>button.addEventListener("click",()=>{
      this._showTab("atmosphere");this._selectRoomNode(button.dataset.roomOpen);
      root.getElementById("rendering-card")?.scrollIntoView({block:"start",behavior:"smooth"});
    }));
    this._wireRoomEvents();
    this._wireRefinement();
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
      if (isSpatial) this._updateSpatialMapDom(card.dataset.entity, this._latestPreviews[card.dataset.entity]);
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

    this._lightNodes.forEach((refs, entityId) => this._updateSpatialMapDom(entityId, this._latestPreviews[entityId]));

    root.querySelectorAll("[data-remove-light]").forEach((b) => b.addEventListener("click", () => this._removeLight(b.dataset.removeLight)));
    root.querySelectorAll("[data-add-source]").forEach((b) => b.addEventListener("click", () => this._addSource(b.dataset.addSource)));
    root.querySelectorAll("[data-remove-source]").forEach((b) => b.addEventListener("click", () => this._removeSource(b.closest("[data-light-card]").dataset.entity, Number(b.dataset.removeSource))));

    root.querySelectorAll("[data-override-check]").forEach((check) => check.addEventListener("change", () => {
      const card=check.closest("[data-light-card]"); const key=check.dataset.overrideCheck; const input=card.querySelector(`[data-override-value="${CSS.escape(key)}"]`); if(input) input.disabled=!check.checked;
    }));
    root.querySelectorAll('input[type="range"][data-override-value]').forEach((input) => input.addEventListener("input", () => this._updateRangeOutput(input)));
  }

  _showTab(tab) {
    if (!["atmosphere", "lights", "settings"].includes(tab)) return;
    if(tab!=="atmosphere")this._clearRoomSelection();
    this._tab = tab;
    this.shadowRoot.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    this.shadowRoot.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== tab;
    });
    if (tab === "lights") this._lightNodes.forEach((refs, entityId) => this._updateSpatialMapDom(entityId, this._latestPreviews[entityId]));
    if (tab === "atmosphere") { this._refreshTVPreview(); this._drawRoom(); this._queueRoomPreview(); }
  }

  _syncRangeFill(input) {
    const min = Number(input.min || 0), max = Number(input.max || 100);
    const fill = max > min ? Math.max(0, Math.min(100, (Number(input.value) - min) / (max - min) * 100)) : 0;
    input.style.setProperty("--range-fill", `${fill}%`);
  }

  _updateAmbientPreview(preview,running=Boolean((this._lastStatus || this.currentEntry?.status)?.running)) {
    const stage = this.shadowRoot?.getElementById("ambient-stage");
    if (!stage) return;
    const valid = (rgb) => Array.isArray(rgb) && rgb.length === 3 && rgb.every(Number.isFinite);
    let count = 0;
    // The TV reports perimeter segments, not a video frame or lamp output.
    // Preserve their sides, index order, and RGB without normalization or gain.
    for (const edge of stage.querySelectorAll("[data-tv-edge]")) {
      const samples = running?preview?.[edge.dataset.tvEdge]:null;
      const colors = Array.isArray(samples) ? samples.filter(valid) : [];
      count += colors.length;
      if (edge.children.length !== colors.length) edge.replaceChildren(...colors.map(() => document.createElement("span")));
      colors.forEach((rgb, index) => {
        const channels = rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))));
        edge.children[index].style.backgroundColor = `rgb(${channels.join(",")})`;
        // Black emits no glow; keep dim samples subtle without boosting their RGB.
        edge.children[index].style.opacity = String(Math.max(...channels) / 255);
      });
    }
    stage.classList.toggle("has-colors", count > 0);
    const empty = this.shadowRoot.getElementById("ambient-waiting");
    if (empty) empty.hidden = count > 0;
    this._drawRoom();
  }

  _lightCountLabel(count) {
    if (this.t !== TEXT.ru) return `${count} ${count === 1 ? "light" : "lights"}`;
    const last = count % 10, two = count % 100;
    const word = two >= 11 && two <= 14 ? "светильников" : last === 1 ? "светильник" : last >= 2 && last <= 4 ? "светильника" : "светильников";
    return `${count} ${word}`;
  }

  _brandMarkup() {
    return `<header><div class="brand"><div class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M8 21h8m-4-4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div><div class="head-copy"><h1>${esc(this.t.title)}</h1></div></div><span class="version" aria-label="${esc(this.t.version)} 0.5.0">0.5.0</span></header>`;
  }

  _renderLoading() { this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="loading">Ambilight Sync…</div></main>`; }
  _renderError(message) { this.shadowRoot.innerHTML = `<style>${this._css()}</style><main><div class="error-card">${esc(message)}</div></main>`; }

  _render() {
    this._roomResizeObserver?.disconnect();
    this._cancelRoomPreview();
    this._lightNodes.clear();
    this._latestPreviews = this._lastStatus?.previews || {};
    const t = this.t;
    const entry = this.currentEntry;
    if (!entry || !this.profile || !this.currentPreset) {
      this.shadowRoot.innerHTML = `<style>${this._css()}</style><main>${this._brandMarkup()}<div class="empty-state">${esc(t.noEntries)}</div></main>`;
      return;
    }

    const status = this._lastStatus || entry.status || {};
    const preset = this.currentPreset;
    this._rendering();
    const g = preset.global;
    const entryOptions = this._entries.map((e) => `<option value="${esc(e.entry_id)}" ${e.entry_id === this._entryId ? "selected" : ""}>${esc(e.title)}</option>`).join("");
    const presetOptions = this._presetIds().map((id) => `<option value="${esc(id)}" ${id === this._editPresetId ? "selected" : ""}>${esc(this.profile.presets[id].name)}</option>`).join("");
    const isActive = this.profile.active_preset === this._editPresetId;
    const usedLights = new Set(Object.keys(preset.lights || {}));
    const availableLights = this._allLights().filter((id) => !usedLights.has(id)).map((id) => `<option value="${esc(id)}">${esc(this._lightName(id))}</option>`).join("");
    const lightCards = Object.keys(preset.lights || {}).sort((a,b) => this._lightName(a).localeCompare(this._lightName(b))).map((id) => this._lightCard(id)).join("");
    this.shadowRoot.innerHTML = `<style>${this._css()}</style><main>
      ${this._brandMarkup()}
      <nav class="primary-nav" role="tablist" aria-label="${esc(t.title)}">
        ${[["atmosphere",t.atmosphere],["lights",t.lights],["settings",t.settings]].map(([id,label]) => `<button id="nav-${id}" type="button" role="tab" data-tab="${id}" aria-selected="${this._tab === id}" aria-controls="panel-${id}" tabindex="${this._tab === id ? 0 : -1}">${esc(label)}</button>`).join("")}
      </nav>
      <div id="status-error" role="alert" class="status-error" hidden><span data-error-message></span><button type="button" id="dismiss-error" aria-label="${esc(this._label("Закрыть сообщение об ошибке","Dismiss error message"))}">×</button></div>
      <button id="reload-config" class="secondary" type="button" ${this._conflict ? "" : "hidden"}>${this.t === TEXT.ru ? "Обновить настройки" : "Reload settings"}</button>

      <div id="panel-atmosphere" role="tabpanel" aria-labelledby="nav-atmosphere" data-tab-panel="atmosphere" ${this._tab === "atmosphere" ? "" : "hidden"}>
        <section class="topbar card">
          <div class="ambient-stage" id="ambient-stage" role="img" aria-label="${esc(t.liveHint)}"><div class="ambient-visual" aria-hidden="true"><div class="ambient-glow">${["top","right","bottom","left"].map((side) => `<div class="tv-edge tv-edge-${side}" data-tv-edge="${side}"></div>`).join("")}</div><div class="ambient-screen"></div><div class="ambient-stand"></div></div><span class="ambient-label">${esc(t.liveColors)}</span></div>
          <div class="hero-info">
            <strong id="sync-status" class="sync-status ${status.running ? "on" : ""}">${esc(status.running ? t.running : t.stopped)}</strong>
            <label class="tv-control"><span>${esc(t.tv)}</span><select id="entry-select">${entryOptions}</select></label>
            <p id="ambient-waiting" class="preview-waiting">${esc(t.previewWaiting)}</p>
            <div class="hero-actions"><button id="sync-toggle" class="sync-toggle ${status.running ? "on" : ""}" aria-pressed="${status.running ? "true" : "false"}">${esc(status.running ? t.turnOff : t.turnOn)}</button><span class="light-count">${esc(this._lightCountLabel(usedLights.size))}</span></div>
          </div>
        </section>

        <section class="card preset-card"><div class="preset-heading"><h2>${esc(t.presets)}</h2><span id="active-preset-badge" class="active-badge" ${isActive ? "" : "hidden"}>${esc(t.active)}</span></div><label class="preset-select-wrap"><span>${esc(t.preset)}</span><select id="preset-select">${presetOptions}</select></label><div class="preset-actions"><button id="activate-preset" class="primary" ${isActive ? "disabled" : ""}>${esc(t.activate)}</button><button id="create-preset" class="secondary">${esc(t.create)}</button><button id="duplicate-preset" class="secondary">${esc(t.duplicate)}</button><button id="rename-preset" class="secondary">${esc(t.rename)}</button><button id="delete-preset" class="secondary danger">${esc(t.delete)}</button></div></section>
        ${this._roomMarkup()}
        ${this._settingsMarkup(g, true)}
      </div>

      <div id="panel-lights" role="tabpanel" aria-labelledby="nav-lights" data-tab-panel="lights" ${this._tab === "lights" ? "" : "hidden"}>
        <div class="section-title lights-title"><div><h2>${esc(t.lights)}</h2></div><select id="add-light" aria-label="${esc(t.addLight)}"><option value="">${esc(t.addLight)}</option>${availableLights}</select></div>
        <div class="lights-grid">${lightCards || `<div class="empty-state">${esc(t.noLights)}</div>`}</div>
      </div>

      <div id="panel-settings" role="tabpanel" aria-labelledby="nav-settings" data-tab-panel="settings" ${this._tab === "settings" ? "" : "hidden"}>
        <div class="section-title"><div><h2>${esc(t.settings)}</h2><p>${esc(t.globalHint)}</p></div></div>
        ${this._settingsMarkup(g)}
        <section class="card behavior-card"><label class="check-row restore-control"><input id="restore_on_stop" type="checkbox" ${g.restore_on_stop !== false ? "checked" : ""}><span>${esc(t.restore)}</span></label><p>${esc(this._label("При остановке вернётся исходное состояние ламп. Светильники под ручным управлением не изменяются.","Stopping restores the lights’ original states. Lights under manual control are left as they are."))}</p></section>
        <section class="card backup-card"><h2>${esc(this._label("Резервная копия","Backup & Restore"))}</h2><p class="help">${esc(this._label("Все пресеты, настройки, назначения ламп и общая комната. Пароли и данные подключения TV не входят в файл.","All presets, settings, light assignments and shared geometry. TV credentials and connection data are excluded."))}</p><div class="backup-actions"><button type="button" id="backup-export" class="secondary">${esc(this._label("Экспорт JSON","Export JSON"))}</button><button type="button" id="backup-import" class="secondary">${esc(this._label("Импорт JSON…","Import JSON…"))}</button><input id="backup-file" type="file" accept="application/json,.json" hidden></div><p id="backup-status" class="help" aria-live="polite"></p></section>
        <section class="card diagnostics-card"><div class="diagnostics-heading"><h2>${esc(t.diagnostics)}</h2><span class="eyebrow">${esc(t.tvDiagnostics)}</span></div><p id="tv-diagnostics">${esc(t.targetRate)} ${status?.diagnostics?.tv?.target_poll_rate_hz ?? g.poll_rate} Hz · ${esc(t.actualRate)} ${status?.diagnostics?.tv?.actual_poll_rate_hz ?? 0} Hz</p><p id="renderer-diagnostics">${esc(status?.diagnostics?.rendering?.active_mode || "classic")}</p><p>${esc(t.serviceHint)}</p></section>
      </div>

      <div class="actions" ${this._dirty ? "" : "hidden"}><p id="save-feedback" class="save-feedback" role="status" hidden></p><div class="save-bar"><span class="save-hint">${esc(this._label("Есть несохранённые изменения","Unsaved changes"))}</span><button id="discard" type="button" class="secondary">${esc(this._label("Отменить","Discard"))}</button><button id="save" class="primary" aria-live="polite">${esc(t.save)}</button></div></div>
    </main>`;
    this._wireEvents();
  }

  _css() { return `
    :host{
      --ui-bg:#f5f6f9;--ui-surface:#fff;--ui-subtle:#eff2f7;--ui-text:#20242e;--ui-muted:#6b7282;--ui-border:#e4e8ef;
      --ui-accent:#0088ff;--ui-action:#006edc;--ui-selected:#edf5ff;--ui-green:#2e8065;--ui-green-bg:#e7f3ed;--ui-track:#dee4ec;
      --ui-error:#c13f4b;--ui-error-bg:#fff1f3;--ui-on-accent:#fff;--ui-shadow:0 6px 28px #1f2b4009;--ui-float:0 4px 14px #1f2b4012;
      display:block;container-type:inline-size;min-height:100vh;background:var(--ui-bg);color:var(--ui-text);
      font-family:"SF Pro",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:15px;line-height:1.47;color-scheme:light;
    }
    :host([data-theme=dark]){
      --ui-bg:#000;--ui-surface:#1c1c1c;--ui-subtle:#2c2c2c;--ui-text:#f5f5f5;--ui-muted:#a1a1a1;--ui-border:#3a3a3a;
      --ui-accent:#f0f0f0;--ui-action:#f2f2f2;--ui-selected:#2b2b2b;--ui-green:#c7c7c7;--ui-green-bg:#2b2b2b;--ui-track:#484848;
      --ui-error:#dedede;--ui-error-bg:#343434;--ui-on-accent:#101010;--ui-shadow:none;color-scheme:dark;
    }
    *{box-sizing:border-box}[hidden]{display:none!important}button,input,select{font:inherit;color:inherit;max-width:100%}
    button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border:0;border-radius:999px;background:var(--ui-subtle);font-weight:500;line-height:20px;cursor:pointer;transition:background .16s,box-shadow .16s}
    button:hover{background:color-mix(in srgb,var(--ui-subtle),var(--ui-text) 5%)}button:disabled{opacity:.4;cursor:default}
    button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid var(--ui-accent);outline-offset:3px}
    .primary,.sync-toggle{background:var(--ui-action);color:var(--ui-on-accent)}.primary:hover,.sync-toggle:hover{background:color-mix(in srgb,var(--ui-action),var(--ui-text) 10%)}
    .sync-toggle.on{background:var(--ui-subtle);color:var(--ui-text)}.secondary.danger,.remove-light{color:var(--ui-error)}.save-error{background:var(--ui-error)!important;color:var(--ui-on-accent)}
    select,input[type=number]{width:100%;min-width:0;min-height:46px;padding:10px 14px;border:0;border-radius:14px;background:var(--ui-subtle);color:var(--ui-text);font-size:15px;font-weight:500;line-height:20px}
    select{appearance:none;padding-right:38px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='m3 4.5 3 3 3-3' fill='none' stroke='%236b7282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-position:right 14px center;background-repeat:no-repeat;cursor:pointer}
    :host([data-theme=dark]) select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='m3 4.5 3 3 3-3' fill='none' stroke='%23a1a1a1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
    option{background:var(--ui-surface);color:var(--ui-text)}input:disabled,select:disabled{opacity:.4;cursor:default}
    input[type=checkbox]{appearance:none;position:relative;flex:0 0 18px;width:18px;height:18px;margin:0;border:1px solid var(--ui-muted);border-radius:4px;background:var(--ui-surface);cursor:pointer}
    input[type=checkbox]:checked{background:var(--ui-accent);border-color:var(--ui-accent)}input[type=checkbox]:checked:after{content:"";position:absolute;left:5px;top:2px;width:4px;height:8px;border:solid var(--ui-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg)}
    main{max-width:1080px;margin:auto;padding:32px 28px max(40px,env(safe-area-inset-bottom))}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px}.brand{display:flex;align-items:center;gap:12px;min-width:0}
    .logo{display:grid;place-items:center;flex:0 0 38px;width:38px;height:38px;color:var(--ui-action);background:var(--ui-selected);border-radius:12px}.logo svg{width:26px;height:26px}
    h1{font-size:28px;font-weight:600;line-height:34px;letter-spacing:-.7px;margin:0}h2{font-size:20px;font-weight:600;line-height:26px;letter-spacing:-.3px;margin:0 0 16px}
    p{color:var(--ui-muted);line-height:1.47;margin:8px 0 16px}header p{font-size:13px;line-height:19px;margin:2px 0 0}.version{font-size:12px;color:var(--ui-muted);padding:5px 10px;background:var(--ui-subtle);border-radius:999px;font-variant-numeric:tabular-nums}
    .primary-nav{display:flex;gap:4px;width:468px;max-width:100%;padding:4px;margin:0 0 24px;border-radius:16px;background:var(--ui-subtle)}
    .primary-nav button{flex:1;min-width:0;min-height:44px;padding:10px 12px;border-radius:14px;font-size:14px;color:var(--ui-muted);background:none;white-space:nowrap}
    .primary-nav [aria-selected=true]{color:var(--ui-text);background:var(--ui-surface);box-shadow:var(--ui-float)}
    .card,.light-card{min-width:0;padding:24px;border:0;border-radius:24px;background:var(--ui-surface);box-shadow:var(--ui-shadow);margin-bottom:20px}
    .topbar{display:grid;grid-template-columns:240px minmax(0,1fr);gap:40px;align-items:center;padding:32px}.hero-info{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
    .sync-status,.active-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:var(--ui-subtle);color:var(--ui-muted);font-size:12px;line-height:18px;font-weight:500}
    .sync-status.on,.active-badge{background:var(--ui-green-bg);color:var(--ui-green)}.sync-status:before,.active-badge:before{content:"";width:5px;height:5px;background:currentColor;border-radius:50%;flex:none}
    .tv-control{display:flex;flex-direction:column;gap:6px;width:100%;max-width:420px;font-size:13px;color:var(--ui-muted)}.tv-control select{font-size:20px;font-weight:600;letter-spacing:-.3px;background-color:transparent;padding-left:0;padding-top:0;padding-bottom:0;min-height:36px;border-radius:6px;color:var(--ui-text)}
    .hero-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.light-count{font-size:13px;color:var(--ui-muted)}.preview-waiting{font-size:13px;margin:0;max-width:360px}
    .ambient-stage{position:relative;isolation:isolate;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:190px;width:100%}
    .ambient-visual{position:relative;isolation:isolate;width:208px;height:117px}
    .ambient-glow{position:absolute;inset:-10px;z-index:-1;filter:blur(18px);opacity:0;transition:opacity .4s}
    .has-colors .ambient-glow{opacity:.85}
    .ambient-screen{position:relative;width:100%;height:100%;border:1px solid #3b3b3b;border-radius:9px;background:linear-gradient(145deg,#121212,#070707 72%);box-shadow:0 8px 16px #0003,inset 0 0 0 1px #ffffff04}
    .ambient-stand{position:absolute;left:19%;right:19%;bottom:-8px;height:9px;z-index:-1}
    .ambient-stand:before,.ambient-stand:after{content:"";position:absolute;top:0;width:3px;height:9px;border-radius:0 0 2px 2px;background:#3b3b3b;transform-origin:top}
    .ambient-stand:before{left:0;transform:skewX(-24deg)}.ambient-stand:after{right:0;transform:skewX(24deg)}
    .tv-edge{position:absolute;display:flex;overflow:hidden;--edge-size:36px}
    .tv-edge>span{flex:1;min-width:0;min-height:0;background-color:#000;opacity:0;transition:background-color .35s ease-in-out,opacity .35s ease-in-out}
    .tv-edge-top{top:0;left:0;right:0;height:var(--edge-size)}.tv-edge-right{top:0;right:0;bottom:0;width:var(--edge-size);flex-direction:column}
    .tv-edge-bottom{bottom:0;left:0;right:0;height:var(--edge-size);flex-direction:row-reverse}.tv-edge-left{top:0;left:0;bottom:0;width:var(--edge-size);flex-direction:column-reverse}
    .ambient-label{font-size:12px;line-height:18px;margin-top:25px;color:var(--ui-muted);text-align:center}
    .preset-card{display:grid;grid-template-columns:minmax(220px,1fr) auto;gap:18px 24px;align-items:end}.preset-heading{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:12px}.preset-heading h2{margin:0}
    .preset-select-wrap{display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--ui-muted)}.preset-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end}.preset-actions button{font-size:13px;padding:10px 12px}
    .intro{font-size:13px;max-width:680px;margin:-6px 0 24px}.section-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 22px;padding:4px 0 24px}.atmosphere-settings .section-controls{padding-bottom:0}
    .control{display:flex;flex-direction:column;gap:8px;min-width:0}.control-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:28px}.control-title{font-size:14px;font-weight:500;line-height:20px;overflow-wrap:anywhere}
    .range-row{display:grid;grid-template-columns:minmax(0,1fr) 68px;gap:16px;align-items:center;min-height:32px}.range-row output{font-size:13px;color:var(--ui-muted);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
    input[type=range]{appearance:none;-webkit-appearance:none;display:block;min-width:0;width:100%;height:44px;margin:0;background:transparent;cursor:pointer;--range-fill:0%}
    input[type=range]::-webkit-slider-runnable-track{height:5px;border-radius:999px;background:linear-gradient(to right,var(--ui-accent) var(--range-fill),var(--ui-track) var(--range-fill))}
    input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:22px;height:22px;margin-top:-8.5px;background:var(--ui-surface);border:1px solid var(--ui-border);border-radius:50%;box-shadow:0 2px 6px #0002}
    input[type=range]::-moz-range-track{height:5px;border-radius:999px;background:var(--ui-track)}input[type=range]::-moz-range-progress{height:5px;border-radius:999px;background:var(--ui-accent)}input[type=range]::-moz-range-thumb{width:20px;height:20px;border:1px solid var(--ui-border);border-radius:50%;background:var(--ui-surface);box-shadow:0 2px 6px #0002}
    .inactive-control{opacity:.5}.inactive-control input:disabled{opacity:1}.help,small{color:var(--ui-muted);font-size:13px;line-height:19px}.section-note{grid-column:1/-1;font-size:13px;margin:0}
    .settings-section+.settings-section{border-top:1px solid var(--ui-border)}.settings-toggle{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;padding:20px 0;background:none;border-radius:12px;text-align:left}.settings-toggle:hover{background:transparent;color:var(--ui-action)}
    .settings-toggle strong{display:block;font-size:16px;font-weight:600}.settings-toggle small{display:block;font-size:12px;line-height:18px;margin-top:4px;overflow-wrap:anywhere}.chevron{font-size:26px;color:var(--ui-muted);transition:transform .16s}.settings-toggle[aria-expanded=true] .chevron{transform:rotate(90deg)}
    .settings-accordion{padding-top:4px;padding-bottom:4px}.section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin:0 0 24px}.section-title h2{margin:0 0 8px}.section-title p{font-size:13px;max-width:680px;margin:0}.lights-title select{width:260px;flex-shrink:0}
    .lights-grid{display:grid;align-items:start;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.light-card{margin:0}.light-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:start;margin-bottom:12px}.preview-dot{margin-top:4px;width:36px;height:36px;border:5px solid var(--ui-subtle);border-radius:50%;box-shadow:0 0 0 1px var(--ui-border)}
    .light-name{min-width:0;align-self:center}.light-name strong{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-size:16px;font-weight:600;line-height:22px;overflow-wrap:anywhere}.remove-light{width:44px;height:44px;padding:0;font-size:24px;background:transparent}.remove-light:hover{background:var(--ui-error-bg)}
    details.disclosure>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;font-size:14px;font-weight:500}details.disclosure>summary::-webkit-details-marker{display:none}details.disclosure>summary:after{content:"›";font-size:24px;line-height:24px;color:var(--ui-muted);transition:transform .16s}details.disclosure[open]>summary:after{transform:rotate(90deg)}
    .light-diagnostics{color:var(--ui-muted);font-size:12px;border-bottom:1px solid var(--ui-border);padding-bottom:8px;margin-bottom:8px}.light-diagnostics>small{display:block;margin:8px 0;overflow-wrap:anywhere;font-size:11px}
    .preview-line,.diagnostic-line{display:flex;flex-direction:column;gap:4px;padding:12px;border-radius:12px;background:var(--ui-subtle);margin-top:8px;font-size:12px;overflow-wrap:anywhere}.preview-line>span:first-child,.diagnostic-line>span:first-child{font-weight:600;color:var(--ui-text)}
    .position-settings[open]>summary{margin-bottom:14px}.position-mode-control{margin:0 0 16px}.spatial-box{padding:16px;background:var(--ui-subtle);border-radius:16px;margin-bottom:16px}.position-preview{height:180px;position:relative;border:1px solid var(--ui-border);border-radius:14px;margin-bottom:12px;overflow:hidden;background:var(--ui-surface)}
    .position-segments{position:absolute;inset:0;z-index:2;pointer-events:none}.ambilight-segment{position:absolute;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%) scale(.62);opacity:.07;transition:opacity .12s,transform .12s,filter .12s}.ambilight-segment.active{box-shadow:0 0 0 1px #ffffff40,0 0 8px currentColor}
    .tv-shape{position:absolute;z-index:1;left:25%;top:25%;width:50%;height:50%;border:2px solid var(--ui-border);border-radius:10px;display:grid;place-items:center;font-size:12px;font-weight:500;color:var(--ui-muted);background:var(--ui-subtle)}
    .position-point{position:absolute;z-index:4;width:14px;height:14px;border-radius:50%;background:var(--ui-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--ui-accent) 15%,transparent);transform:translate(-50%,-50%)}
    .spread-summary{font-size:12px;line-height:18px;color:var(--ui-muted);min-height:18px;margin-bottom:16px}.position-range{display:block;font-size:13px;margin-top:14px}.position-range>span{display:block;margin-bottom:6px}.position-range .help{margin-top:8px}.subhead{font-size:13px;font-weight:500;color:var(--ui-muted);margin:14px 0 10px}.source-list{display:flex;flex-direction:column;gap:8px}.source-row{display:grid;grid-template-columns:minmax(0,1fr) 96px 44px;gap:8px;align-items:center}.weight{display:flex;align-items:center;gap:3px}.weight input{padding:10px 8px;text-align:center}.weight span{font-size:12px;color:var(--ui-muted)}.icon-btn{width:44px;height:44px;padding:0;font-size:22px;background:transparent}.add-source{width:100%;margin-top:12px;font-size:13px}
    .override-box{border-top:1px solid var(--ui-border);margin-top:8px;padding-top:8px}.override-box>p{font-size:13px;margin:8px 0 20px}.override-grid{display:flex;flex-direction:column;gap:20px}.override-row{display:grid;grid-template-columns:1fr;gap:10px}.override-check{display:flex;align-items:center;gap:10px;min-height:24px;font-size:13px;cursor:pointer}.override-row select{font-size:13px}.check-row{display:flex;align-items:center;gap:12px;font-size:14px;cursor:pointer}.check-row input{flex:0 0 40px;width:40px;height:24px;border:0;border-radius:999px;background:var(--ui-track)}.check-row input:before{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:var(--ui-surface);transition:translate .16s}.check-row input:checked{background:var(--ui-accent)}.check-row input:checked:before{translate:16px 0;background:var(--ui-on-accent)}.check-row input:after{display:none}
    .behavior-card{margin-top:20px}.behavior-card p,.diagnostics-card p{font-size:13px;margin:14px 0 0}.diagnostics-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.diagnostics-heading h2{margin:0}.eyebrow{color:var(--ui-muted);font-size:12px}
    .info-tip{position:relative;flex:none;color:var(--ui-muted)}.info-tip>summary{width:28px;min-height:28px;border-radius:50%;display:grid;place-items:center;font-size:16px;font-weight:400}.info-tip>summary:after{display:none}.info-tip>summary:hover{background:var(--ui-subtle)}
    .info-content{display:none;position:absolute;right:0;top:32px;width:min(280px,72vw);padding:16px;border:1px solid var(--ui-border);border-radius:14px;background:var(--ui-surface);color:var(--ui-text);box-shadow:var(--ui-float);z-index:12;font-size:13px;line-height:19px}.info-tip[open]>.info-content{display:block}
    #debug-toggle{margin-top:0;font-size:13px}.debug-settings{margin-top:20px}.debug-settings>strong{font-weight:600}.debug-settings>p{font-size:13px}.debug-settings .section-controls{padding-bottom:0}.debug-pipeline{grid-column:1/-1;min-width:0;font-size:13px}.debug-pipeline>strong{font-weight:500}.debug-pipeline select{margin-top:12px}.debug-pipeline pre{font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;border-radius:14px;background:var(--ui-subtle)}
    .actions{position:sticky;bottom:max(20px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:12px;width:max-content;max-width:100%;margin:24px auto 0;padding:0;z-index:5;pointer-events:none}
    /* Chromatic 0.1.1 .footer: same surface, padding, capsule and shadow.
       Its position stays within the HA content area, including with the sidebar open. */
    .save-bar{display:flex;align-items:center;justify-content:center;gap:12px;max-width:100%;padding:8px 10px 8px 24px;border-radius:999px;background:var(--ui-surface);box-shadow:0 4px 14px #1f2b4026;pointer-events:auto}
    .save-hint{font-size:13px;margin-right:8px;white-space:nowrap}
    .actions button{min-height:44px;padding:10px 14px;white-space:nowrap;font-size:15px}.actions #save{min-width:0;max-width:none;padding:12px 20px}.actions .secondary{background:var(--ui-subtle)}
    .save-feedback{width:100%;max-width:560px;padding:12px 16px;margin:0;border-radius:14px;background:var(--ui-error-bg);color:var(--ui-error);font-size:13px;overflow-wrap:anywhere;pointer-events:auto}

    .status-error,.error-card{padding:16px 20px;border-radius:16px;background:var(--ui-error-bg);color:var(--ui-error);font-size:13px;overflow-wrap:anywhere;margin-bottom:20px}.loading,.empty-state{padding:32px;border-radius:24px;background:var(--ui-surface);color:var(--ui-muted);box-shadow:var(--ui-shadow);font-size:14px}.lights-grid>.empty-state{grid-column:1/-1}
    .status-error{display:flex;align-items:flex-start;gap:12px;padding:12px 12px 12px 20px}.status-error [data-error-message]{flex:1;min-width:0;align-self:center}.status-error button{flex:none;width:44px;min-height:44px;padding:0;background:transparent;color:inherit;font-size:24px;line-height:1}
    .rendering-card h2{margin:0 0 16px}.rendering-card>.control{max-width:540px}.rendering-card .control-title{display:block}.rendering-card p.help{font-size:12px;line-height:1.6;margin:12px 0 16px}
    .ambient-behavior-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:end}.ambient-behavior-row .check-row{min-height:46px;padding-bottom:10px;font-size:13px}.room-heading{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:24px}.room-heading h3{font-size:17px;font-weight:600;margin:0}.room-heading button{font-size:12px;min-height:44px;padding:8px 12px}
    .room-views{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}.room-view{min-width:0;padding:14px 8px 8px;border:1px solid var(--ui-border);border-radius:18px;background:var(--ui-subtle)}.room-view>strong{display:block;font-size:12px;font-weight:500;margin:0 10px 6px;color:var(--ui-muted)}.room-view svg{width:100%;height:auto;display:block;aspect-ratio:5/3;touch-action:none;overflow:hidden;border-radius:12px}.room-grid path{stroke:var(--ui-border);stroke-width:.7;fill:none;pointer-events:none}.room-node{cursor:grab;touch-action:none}.room-node:active{cursor:grabbing}.room-node text{fill:var(--ui-muted);font-size:11px;pointer-events:none;user-select:none}.room-node .room-marker{stroke:var(--ui-surface);stroke-width:3}.room-hit{stroke:transparent;stroke-width:2}.room-node.selected .room-hit{stroke:var(--ui-accent)}.room-tv{fill:#20242e;stroke:#8892a3;stroke-width:2}.room-tv-edge{stroke:var(--ui-text);stroke-width:12;stroke-linecap:round}.room-facing{fill:none;stroke:var(--ui-accent);stroke-width:2}.room-facing-dot{fill:var(--ui-accent)}.room-tv-hit{fill:transparent;stroke:transparent;stroke-width:2}.room-node.selected .room-tv-hit{stroke:var(--ui-accent)}.room-node text.room-tv-label{fill:var(--ui-text);paint-order:stroke;stroke:var(--ui-surface);stroke-width:3px;font-weight:600}.room-axis{font-size:10px;fill:var(--ui-muted);pointer-events:none}
    .room-coordinates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:18px 0}.room-coordinates label{display:flex;flex-direction:column;gap:8px;min-width:0;font-size:12px;color:var(--ui-muted)}.room-coordinates label>span{flex:1}.room-coordinates input{margin-top:0;width:100%;min-width:0;min-height:46px;padding:10px 12px;border:1px solid transparent;border-radius:14px;background:var(--ui-subtle);font-size:14px;color:var(--ui-text)}.room-coordinates input:invalid{border-color:var(--ui-error)}#room-tv-controls details{margin-top:10px}#room-tv-controls summary{font-size:13px;color:var(--ui-muted);min-height:44px;cursor:pointer}.ambient-light-position{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin:0;padding:12px 0}.ambient-light-position span{font-size:12px;color:var(--ui-muted)}.ambient-light-position button{font-size:12px}
    @container(max-width:700px){.room-views{grid-template-columns:minmax(0,1fr)}.ambient-behavior-row{grid-template-columns:minmax(0,1fr);gap:14px}.ambient-behavior-row .check-row{padding:0}.room-coordinates{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.room-coordinates label:has([data-room-value="z"]){grid-column:1/-1}.room-heading{align-items:flex-start;flex-direction:column;gap:12px}.room-view{padding:12px 6px 6px}}
    @container(max-width:900px){.preset-card{grid-template-columns:1fr}.preset-actions{justify-content:flex-start}.lights-grid{grid-template-columns:1fr}.topbar{grid-template-columns:200px minmax(0,1fr);gap:24px}.ambient-visual{width:184px;height:104px}}
    @container(max-width:600px){main{padding:24px 16px 32px}header{gap:8px;flex-wrap:wrap}h1{font-size:24px;line-height:30px;letter-spacing:-.5px}header p{font-size:12px}.brand{gap:10px}.logo{width:34px;height:34px;flex-basis:34px}.logo svg{width:24px;height:24px}.version{font-size:11px;padding:4px 7px}.primary-nav{width:100%;margin-bottom:20px}.primary-nav button{font-size:13px;padding:10px 6px}.card,.light-card{padding:20px}.topbar{display:flex;flex-direction:column;gap:20px;text-align:center;padding:28px 24px}.ambient-stage{min-height:166px;max-width:240px}.hero-info{align-items:center;width:100%;gap:12px}.tv-control{align-items:center}.tv-control select{text-align:center;padding-left:24px;font-size:20px}.hero-actions{justify-content:center;gap:12px}.section-controls{grid-template-columns:1fr;gap:22px}.preset-actions{gap:8px}.preset-actions button{font-size:12px;padding:10px 12px}.section-title{flex-direction:column;align-items:stretch;gap:16px}.lights-title select{width:100%}.settings-accordion{padding-top:4px;padding-bottom:4px}.settings-toggle{padding:20px 0}.settings-toggle small{font-size:11px}.settings-toggle strong{font-size:15px}.light-name strong{font-size:15px}.light-head{gap:10px}.spatial-box{padding:12px}.source-row{grid-template-columns:minmax(0,1fr) 44px;gap:8px}.source-row>select{grid-column:1/-1}.source-row .weight{width:104px}.source-row select{font-size:13px;padding-left:10px}.source-row .icon-btn{width:44px}.diagnostics-heading{align-items:flex-start;flex-direction:column;gap:4px}.range-row{grid-template-columns:minmax(0,1fr) 62px;gap:12px}}
    .room-tools,.backup-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:14px 0}.room-tools>div{display:flex;gap:8px}.room-tools .help{flex:1;min-width:180px}.room-tools button{font-size:12px;padding:10px 12px;gap:8px}.room-tool-icon{display:block;width:20px;height:20px;flex:none;fill:currentColor;pointer-events:none}.room-alternates{padding:12px 0}.room-alternates summary{cursor:pointer;min-height:44px}.room-alternates button{margin-top:12px}
    .light-actions{display:flex;align-items:center;gap:4px;flex:none}.light-menu{position:relative;flex:none;width:44px;height:44px}
    .light-menu>summary{display:grid;place-items:center;width:44px;height:44px;min-height:44px;padding:0;margin:0;list-style:none;cursor:pointer;font-size:24px;line-height:1;border-radius:50%;background:var(--ui-subtle)}.light-menu>summary::after{content:none;display:none}.light-menu>summary::-webkit-details-marker{display:none}
    .light-menu>button{position:absolute;right:0;top:52px;z-index:8;width:max-content;min-width:196px;max-width:calc(100vw - 48px);padding:12px 16px;font-size:13px;line-height:20px;text-align:left;justify-content:flex-start;box-shadow:var(--ui-float);background:var(--ui-subtle);border:1px solid var(--ui-border);border-radius:14px}
    .light-card .participation-row{font-size:13px;min-height:44px;margin:0}.backup-card h2{margin-top:0}.backup-actions button{font-size:13px}

    .refinement-dialog{width:min(560px,calc(100% - 24px));max-height:calc(100dvh - 32px);border:1px solid var(--ui-border);border-radius:24px;padding:24px;background:var(--ui-surface);color:var(--ui-text);box-shadow:var(--ui-float);overflow-y:auto}.refinement-dialog::backdrop{background:#0008}.dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:14px}.dialog-heading h2{font-size:20px;margin:0}.dialog-heading button{min-width:44px;padding:8px}.dialog-body{min-width:0}.dialog-body .check-row{min-height:48px;gap:12px}.copy-targets{max-height:40dvh;overflow:auto}.dialog-message{overflow-wrap:anywhere}.backup-mappings label{display:block;font-size:12px;overflow-wrap:anywhere;margin:16px 0}.backup-mappings select{display:block;margin-top:8px;font-size:13px}.backup-mappings summary{min-height:44px;cursor:pointer}.refinement-dialog #backup-plan p{overflow-wrap:anywhere}.refinement-dialog .backup-actions{position:sticky;bottom:-24px;background:var(--ui-surface);padding:14px 0;margin-bottom:0}
    #room-tv-controls>.room-coordinates,#room-tv-controls details>.room-coordinates{grid-template-columns:minmax(0,1fr);max-width:360px}
    .room-views{margin-bottom:24px}
    #reload-config{margin-bottom:20px}
    .visually-hidden{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip-path:inset(50%);white-space:nowrap}
    .rendering-card .room-tools .help{margin:0;font-size:12px;line-height:19px}.rendering-card .room-tools{margin:16px 0}.room-tools>div{flex:none}
    .override-grid>div:has(>.override-row[hidden]){display:none}
    .copy-targets .check-row input{flex:0 0 20px;width:20px;height:20px;border:1px solid var(--ui-muted);border-radius:5px;background:var(--ui-surface)}.copy-targets .check-row input:before{display:none}.copy-targets .check-row input:checked{background:var(--ui-accent);border-color:var(--ui-accent)}.copy-targets .check-row input:checked:after{display:block;content:"";left:6px;top:3px;width:4px;height:8px;border:solid var(--ui-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg)}

    @container(max-width:600px){.room-coordinates input,.refinement-dialog select,.source-row select,select,input[type=number]{font-size:16px}}
    @container(max-width:700px){.save-bar{gap:8px;padding:8px}.save-hint{display:none}.actions button{font-size:14px}}
    @container(max-width:360px){.actions button,.actions #save{font-size:12px;padding:12px 10px}}
    .room-node text.room-number{fill:var(--ui-text);paint-order:stroke;stroke:var(--ui-surface);stroke-width:2px}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{transition:none!important;animation:none!important}}

  `; }
}

// Match the content-hash-specific element name registered by frontend.py.
// This avoids the browser reusing an already-defined old custom element after
// Home Assistant restarts/reconnects without a full document reload.
const _moduleUrl = new URL(import.meta.url);
const _panelRev = (_moduleUrl.searchParams.get("rev") || "fallback").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
const _panelTag = `ambilight-sync-panel-${_panelRev}`;
if (!customElements.get(_panelTag)) customElements.define(_panelTag, AmbilightSyncPanel);
