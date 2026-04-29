import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import projectContent from './data/project-content.json'

const TEXT = {
  ru: {
    mapPreset: 'Пресет карты',
    generatorSettings: 'Настройки генератора',
    listSettings: 'Настройки списков',
    showInternalCodes: 'Отображать коды Регионов и биомов',
    canon: 'Канон',
    canonNone: 'Не выбрано',
    canonWestPostros: 'Западный Построс',
    rtgLabel: 'Real-time generator (RTG)',
    mapFormat: 'Формат карты',
    mapType: 'Тип суши',
    islandType: 'Остров',
    continentType: 'Материк',
    square: 'Квадрат',
    freeform: 'Произвольная',
    backHome: 'Главная',
    title: 'Dope world generator 2D',
    subtitle: 'Интерактивный прототип: меняй параметры и генерируй карту в реальном времени.',
    seed: 'Сид',
    mapSize: 'Размер карты',
    sizePreset: 'Пресет (км)',
    customPreset: 'Произвольный',
    manualSetup: 'Ручная настройка',
    width: 'Ширина',
    height: 'Высота',
    meters: 'метры',
    km: 'км',
    islandFalloff: 'Спад острова',
    terrain: 'Местность',
    biomes: 'Регионы и биомы',
    macroRegions: 'Макрорегионы',
    landMacroRegions: 'Макрорегионы суши',
    waterMacroRegions: 'Водные макрорегионы',
    microRegions: 'Микрорегионы',
    biomesNode: 'Биомы',
    mainBiomes: 'Основные биомы',
    shores: 'Берега',
    southShoreMicroBiomes: 'Микробиомы Южных берегов',
    subBiomes: 'Подбиомы',
    untouchedRegionsSubBiomes: 'Микробиомы нетронутых регионов',
    biomeSettings: 'Настройки биома',
    biomeCoveragePercent: 'Доля на острове (%)',
    biomeCoverageSquareMeters: 'Площадь на острове (м²)',
    microBiomeSettings: 'Настройки микробиома',
    microBiomeSpawnPercent: 'Доля в биоме (%)',
    microBiomeSpawnSquareMeters: 'Площадь в биоме (м²)',
    unallocatedPercent: 'Нераспределённый процент',
    infoMissing: 'Информация отсутствует.',
    seaSettings: 'Настройка морей',
    sideLeft: 'Слева',
    sideTop: 'Сверху',
    sideRight: 'Справа',
    sideBottom: 'Снизу',
    generate: 'Сгенерировать',
    randomSeed: 'Случайный сид',
    grid: 'Сетка',
    showMetricGrid: 'Включить отображение сетки',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
    zoomLevel: 'Масштаб',
    devHelp: 'Справка разработчика',
    devText:
      'Добро пожаловать в интерактивный 2д редактор карт, здесь вы можете протестировать идеи своих миров в реальном времени. Настройки по умолчанию: Сид: 1',
    goEditor: 'Перейти к редактору',
    poiCount: 'Точек',
    reportTitle: 'Отчёт генерации',
    mapShapeSquare: 'Квадрат',
    mapShapeFreeform: 'Произвольная',
    islandWord: 'остров',
    continentWord: 'материк',
    seasAllSides: 'омываемый с четырёх сторон морями',
    seasCustomSides: 'омываемый морями',
    reportGenerated:
      'Сид: {seed}\nРазмер карты: {size}\nТип карты: {shape}\nМоря: {seas}\nЛокации:\nВоенные локации: {military}\nГражданские локации {civil}',
    hints: {
      backHome: 'Вернуться на страницу со справкой разработчика.',
      language: 'Переключить язык интерфейса (Русский/English).',
      rtg: 'RTG: при включении изменения применяются сразу.',
      mapFormatSquare: 'Квадрат: ширина задает и ширину, и высоту.',
      mapFormatFreeform: 'Произвольная форма: ширина и высота меняются отдельно.',
      mapTypeContinent: 'Материк: в основном суша, вода локальная.',
      mapTypeIsland: 'Остров: вода по краям карты.',
      seaSettings: 'Включай моря по сторонам карты для островного типа суши.',
      sizePreset: 'Быстрый выбор типового размера карты в километрах.',
      manualSetup: 'Открыть ручную настройку размеров карты.',
      width: 'Ширина карты в метрах.',
      height: 'Высота карты в метрах.',
      seed: 'Сид генерации: одинаковый сид дает одинаковую карту.',
      terrain: 'Параметры рельефа и отображения биомов.',
      islandFalloff: 'Управляет спадом высоты к краям карты.',
      generate: 'Применить параметры и сгенерировать карту.',
      randomSeed: 'Случайное значение сида.',
      goEditor: 'Перейти на страницу редактора карты.',
      showMetricGrid: 'Показать сетку 100 м и 1 км по размеру карты в метрах.',
      zoomIn: 'Приблизить карту.',
      zoomOut: 'Отдалить карту.',
      zoomLevel: 'Изменить масштаб карты.',
    },
  },
  en: {
    mapPreset: 'Map Preset',
    generatorSettings: 'Generator Settings',
    listSettings: 'List Settings',
    showInternalCodes: 'Show region and biome codes',
    canon: 'Canon',
    canonNone: 'Not selected',
    canonWestPostros: 'West Postros',
    rtgLabel: 'Real-time generator (RTG)',
    mapFormat: 'Map Format',
    mapType: 'Land Type',
    islandType: 'Island',
    continentType: 'Continent',
    square: 'Square',
    freeform: 'Freeform',
    backHome: 'Home',
    title: 'Dope world generator 2D',
    subtitle: 'Interactive prototype: tweak parameters and generate maps in real time.',
    seed: 'Seed',
    mapSize: 'Map Size',
    sizePreset: 'Preset (km)',
    customPreset: 'Custom',
    manualSetup: 'Manual setup',
    width: 'Width',
    height: 'Height',
    meters: 'meters',
    km: 'km',
    islandFalloff: 'Island falloff',
    terrain: 'Terrain',
    biomes: 'Regions and Biomes',
    macroRegions: 'Macro Regions',
    landMacroRegions: 'Land Macro Regions',
    waterMacroRegions: 'Water Macro Regions',
    microRegions: 'Micro Regions',
    biomesNode: 'Biomes',
    mainBiomes: 'Main Biomes',
    shores: 'Shores',
    southShoreMicroBiomes: 'Southern Shore Micro-biomes',
    subBiomes: 'Sub-biomes',
    untouchedRegionsSubBiomes: 'Untouched regions sub-biomes',
    biomeSettings: 'Biome settings',
    biomeCoveragePercent: 'Island coverage (%)',
    biomeCoverageSquareMeters: 'Island area (m²)',
    microBiomeSettings: 'Micro-biome settings',
    microBiomeSpawnPercent: 'Coverage in biome (%)',
    microBiomeSpawnSquareMeters: 'Area in biome (m²)',
    unallocatedPercent: 'Unallocated percent',
    infoMissing: 'No information available.',
    seaSettings: 'Sea Settings',
    sideLeft: 'Left',
    sideTop: 'Top',
    sideRight: 'Right',
    sideBottom: 'Bottom',
    generate: 'Generate',
    randomSeed: 'Random seed',
    grid: 'Grid',
    showMetricGrid: 'Show metric grid',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomLevel: 'Zoom',
    devHelp: 'Developer Help',
    devText:
      'Welcome to the interactive 2D map editor. Here you can test your world ideas in real time. Default settings: Seed: 1',
    goEditor: 'Go to Editor',
    poiCount: 'Points',
    reportTitle: 'Generation report',
    mapShapeSquare: 'Square',
    mapShapeFreeform: 'Freeform',
    islandWord: 'island',
    continentWord: 'continent',
    seasAllSides: 'surrounded by seas on all four sides',
    seasCustomSides: 'washed by seas',
    reportGenerated:
      'Seed: {seed}\nMap size: {size}\nMap type: {shape}\nSeas: {seas}\nLocations:\nMilitary locations: {military}\nCivilian locations: {civil}',
    hints: {
      backHome: 'Return to the developer help page.',
      language: 'Switch interface language (Russian/English).',
      rtg: 'RTG: when enabled, changes are applied instantly.',
      mapFormatSquare: 'Square mode: width controls both width and height.',
      mapFormatFreeform: 'Freeform mode: width and height are independent.',
      mapTypeContinent: 'Continent: mostly land with local water areas.',
      mapTypeIsland: 'Island: water around map edges.',
      seaSettings: 'Enable seas by map side for island land type.',
      sizePreset: 'Quickly select standard map size in kilometers.',
      manualSetup: 'Open manual map size controls.',
      width: 'Map width in meters.',
      height: 'Map height in meters.',
      seed: 'Generation seed: same seed gives same map.',
      terrain: 'Terrain parameters and biome display.',
      islandFalloff: 'Controls terrain drop toward edges.',
      generate: 'Apply parameters and generate the map.',
      randomSeed: 'Generate a random seed value.',
      goEditor: 'Open the map editor page.',
      showMetricGrid: 'Draw 100 m and 1 km grid lines from map size in meters.',
      zoomIn: 'Zoom in map view.',
      zoomOut: 'Zoom out map view.',
      zoomLevel: 'Adjust map zoom level.',
    },
  },
}

const DEFAULT_WORLD_STRUCTURE = {
  macroRegions: [
    { id: 'black-coast', nameRu: 'Чёрное побережье', nameEn: 'Black Coast', min: 0.0, max: 0.16, allowedBiomes: ['ocean', 'beach', 'grassland'] },
    { id: 'european-coast', nameRu: 'Европейское побережье', nameEn: 'European Coast', min: 0.16, max: 0.32, allowedBiomes: ['ocean', 'beach', 'forest'] },
    { id: 'northern-coast', nameRu: 'Северное побережье', nameEn: 'Northern Coast', min: 0.32, max: 0.48, allowedBiomes: ['ocean', 'beach', 'mountain'] },
    { id: 'north-lands', nameRu: 'Северные земли', nameEn: 'Northern Lands', min: 0.48, max: 0.64, allowedBiomes: ['forest', 'mountain', 'grassland'] },
    { id: 'middle-lands', nameRu: 'Средние земли', nameEn: 'Middle Lands', min: 0.64, max: 0.82, allowedBiomes: ['grassland', 'forest', 'beach'] },
    { id: 'south-lands', nameRu: 'Южные земли', nameEn: 'Southern Lands', min: 0.82, max: 1.01, allowedBiomes: ['desert', 'grassland', 'beach'] },
  ],
  microRegions: [
    { id: 'wet-bands', min: 0.0, max: 0.5, preferredSubBiomes: ['shore', 'wetland', 'pine_forest'] },
    { id: 'dry-bands', min: 0.5, max: 1.01, preferredSubBiomes: ['dune', 'savanna', 'rocky_peak'] },
  ],
  biomes: [
    {
      name: 'ocean', minHeight: 0.0, maxHeight: 0.28, minMoisture: 0.0, maxMoisture: 1.01, color: '#18478c',
      subBiomes: [{ name: 'deep_ocean', minHeight: 0.0, maxHeight: 0.2, minMoisture: 0.0, maxMoisture: 1.01, color: '#0b3b7a' }],
    },
    {
      name: 'beach', minHeight: 0.28, maxHeight: 0.34, minMoisture: 0.0, maxMoisture: 1.01, color: '#decf8f',
      subBiomes: [{ name: 'shore', minHeight: 0.28, maxHeight: 0.34, minMoisture: 0.0, maxMoisture: 1.01, color: '#decf8f' }],
    },
    {
      name: 'desert', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.0, maxMoisture: 0.35, color: '#d5b25f',
      subBiomes: [{ name: 'dune', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.0, maxMoisture: 0.35, color: '#d5b25f' }],
    },
    {
      name: 'grassland', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.35, maxMoisture: 0.7, color: '#68a44a',
      subBiomes: [{ name: 'savanna', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.35, maxMoisture: 0.7, color: '#75b255' }],
    },
    {
      name: 'forest', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.7, maxMoisture: 1.01, color: '#36773e',
      subBiomes: [{ name: 'pine_forest', minHeight: 0.34, maxHeight: 0.72, minMoisture: 0.7, maxMoisture: 1.01, color: '#36773e' }],
    },
    {
      name: 'mountain', minHeight: 0.72, maxHeight: 1.01, minMoisture: 0.0, maxMoisture: 1.01, color: '#7d7e84',
      subBiomes: [{ name: 'rocky_peak', minHeight: 0.72, maxHeight: 1.01, minMoisture: 0.0, maxMoisture: 1.01, color: '#7d7e84' }],
    },
  ],
}

const EMPTY_WORLD_STRUCTURE = {
  macroRegions: [],
  microRegions: [],
  biomes: [],
}

const WEST_POSTROS_STRUCTURE = {
  ...DEFAULT_WORLD_STRUCTURE,
  ...(projectContent.canonPresets?.westPostros?.worldStructure ?? {}),
}

const WEST_POSTROS_MACROREGIONS_RU = [
  { id: 'black-coast', name: 'Чёрное побережье' },
  { id: 'european-coast', name: 'Европейское побережье' },
  { id: 'northern-coast', name: 'Северное побережье' },
  { id: 'north-lands', name: 'Северные земли' },
  { id: 'middle-lands', name: 'Средние земли' },
  { id: 'east-postros', name: 'Восточный Построс' },
  { id: 'south-lands', name: 'Южные земли' },
]

const WEST_POSTROS_WATER_MACROREGIONS_RU = [
  { id: 'black-sea', name: 'Чёрное море', color: '#0f3a6b' },
  { id: 'new-sea', name: 'Новое море', color: '#1d5f9a' },
  { id: 'warm-sea', name: 'Тёплое море', color: '#2f9f8f' },
  { id: 'deep-sea', name: 'Глубокое море', color: '#0b2748' },
  { id: 'northern-ocean', name: 'Северный океан', color: '#4f8fb8' },
]

const WEST_POSTROS_SHORE_BIOMES = [
  { id: 'north-sandy-shores', nameRu: 'Северные песчаные берега', nameEn: 'Northern sandy shores', color: '#d9c58a' },
  { id: 'new-shores', nameRu: 'Новые берега', nameEn: 'New shores', color: '#b7d4de' },
  {
    id: 'south-shores',
    nameRu: 'Южные берега',
    nameEn: 'Southern shores',
    color: '#c9ad85',
    microBiomes: [
      { id: 'south-stone-shores', nameRu: 'Южные каменные берега', nameEn: 'Southern rocky shores', color: '#8f8578' },
      { id: 'deep-south-shores', nameRu: 'Глубокие берега юга', nameEn: 'Deep southern shores', color: '#4c6f8f' },
    ],
  },
]

const WEST_POSTROS_CONTENT_BIOMES = [
  { id: 'b1', nameRu: 'Октинские курумы', nameEn: 'Oktinsk kurums', color: '#8D8D8D', info: 'Октинские каменные россыпи' },
  {
    id: 'b2',
    nameRu: 'Нетронутые регионы',
    nameEn: 'Untouched regions',
    color: '#5FAF5F',
    info: 'Биом расположен в основном на территории Северного Построса. Биом красивый и приятный, высокая густая трава, лиственные леса и поляны. Обилие животной фауны, но всё ещё высокое радиационное заражение.',
    microBiomes: [
      { id: 'mb2.1', nameRu: 'Лиственный лес', nameEn: 'Deciduous forest', color: '#5f9f5f', info: null },
      { id: 'mb2.2', nameRu: 'Джунгли', nameEn: 'Jungle', color: '#2f7f3f', info: null },
      { id: 'mb2.3', nameRu: 'Сосновый лес', nameEn: 'Pine forest', color: '#2e5f3f', info: null },
      { id: 'mb2.4', nameRu: 'Нетронутые болота', nameEn: 'Untouched swamps', color: '#4b6b44', info: 'Болота и топи' },
    ],
  },
  { id: 'b3', nameRu: 'Сажевые дюны', nameEn: 'Soot dunes', color: '#7A5A48', info: null },
  { id: 'b4', nameRu: 'Ксерические кустарники', nameEn: 'Xeric shrublands', color: '#8FA25A', info: null },
  { id: 'b5', nameRu: 'Кислотные земли', nameEn: 'Acid lands', color: '#A6C431', info: null },
  { id: 'b6', nameRu: 'Кислотные болота', nameEn: 'Acid swamps', color: '#6D8F2A', info: null },
  { id: 'b7', nameRu: 'Кислотный лес', nameEn: 'Acid forest', color: '#4E8A3E', info: null },
  { id: 'b8', nameRu: 'Мёртвый лес', nameEn: 'Dead forest', color: '#5C5A52', info: null },
  { id: 'b9', nameRu: 'Лес туманов', nameEn: 'Misty forest', color: '#6E8F8A', info: null },
  { id: 'b10', nameRu: 'Сажевый лес', nameEn: 'Soot forest', color: '#4B4B4B', info: null },
  { id: 'b11', nameRu: 'Кобальтовый лес', nameEn: 'Cobalt forest', color: '#2E5F8A', info: null },
  { id: 'b12', nameRu: 'Пустоши', nameEn: 'Wastelands', color: '#8A7D6A', info: null },
  { id: 'b13', nameRu: 'Снежные пустоши', nameEn: 'Winter Wastelands', color: '#C7D4E3', info: null },
  { id: 'b14', nameRu: 'Каменистые пустоши', nameEn: 'Rocky Wastelands', color: '#6F6A63', info: null },
  { id: 'b15', nameRu: 'Песчаные барханы', nameEn: 'Sand dunes', color: '#D8BC72', info: null },
  { id: 'b16', nameRu: 'Сухое море', nameEn: 'Dried sea', color: '#A79B87', info: null },
  {
    id: 'b17',
    nameRu: 'Стекляные луга',
    nameEn: 'Glass Meadows',
    color: '#7FCFC8',
    info: 'Поля поросшие когда-то густой травой превратились в опасную для ног любой живности скатерть острых шипов. Трава превратилась во что-то хрупкое и острое напоминающее стекло. На транспорте здесь не проедешь. Ноги нужны стальные. Может здесь получится быть незарейженым? Рейдерам придётся в силовой броне прилетать на вертолёте…',
  },
  { id: 'b18', nameRu: 'Мусорные навалы', nameEn: 'Garbage Piles', color: '#7B6D58', info: null },
  { id: 'b19', nameRu: 'Мёртвые регионы', nameEn: 'Dead Regions', color: '#625E58', info: null },
  { id: 'b20', nameRu: 'Большая пустыня', nameEn: 'Great Desert', color: '#CFA85A', info: null },
  { id: 'b21', nameRu: 'Вулканы', nameEn: 'Volcanoes', color: '#9A3B2E', info: null },
  { id: 'b22', nameRu: 'Базальтовые разливы', nameEn: 'Basalt Floodplains', color: '#3F434A', info: null },
  { id: 'b23', nameRu: 'Чёрные дюны', nameEn: 'Black dunes', color: '#2F2C2E', info: null },
  { id: 'b24', nameRu: 'Бурелом', nameEn: 'Windbreak', color: '#4E5A3A', info: null },
]

const DEFAULT_BIOME_COVERAGE_PERCENT = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  acc[biome.id] = 0
  return acc
}, {})

const DEFAULT_MICRO_BIOME_COVERAGE_PERCENT = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  for (const micro of biome.microBiomes ?? []) {
    acc[`${biome.id}:${micro.id}`] = 0
  }
  return acc
}, {})

const DEFAULT_BIOME_ENABLED = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  acc[biome.id] = false
  return acc
}, {})

const DEFAULT_BIOME_LOCKED = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  acc[biome.id] = false
  return acc
}, {})

const DEFAULT_MICRO_BIOME_ENABLED = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  for (const micro of biome.microBiomes ?? []) {
    acc[`${biome.id}:${micro.id}`] = false
  }
  return acc
}, {})

const DEFAULT_MICRO_BIOME_LOCKED = WEST_POSTROS_CONTENT_BIOMES.reduce((acc, biome) => {
  for (const micro of biome.microBiomes ?? []) {
    acc[`${biome.id}:${micro.id}`] = false
  }
  return acc
}, {})

const DEFAULT_SHORE_COVERAGE_PERCENT = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  acc[shore.id] = 0
  return acc
}, {})

const DEFAULT_SHORE_ENABLED = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  acc[shore.id] = false
  return acc
}, {})

const DEFAULT_SHORE_LOCKED = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  acc[shore.id] = false
  return acc
}, {})

const DEFAULT_SHORE_MICRO_COVERAGE_PERCENT = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  for (const micro of shore.microBiomes ?? []) {
    acc[`${shore.id}:${micro.id}`] = 0
  }
  return acc
}, {})

const DEFAULT_SHORE_MICRO_ENABLED = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  for (const micro of shore.microBiomes ?? []) {
    acc[`${shore.id}:${micro.id}`] = false
  }
  return acc
}, {})

const DEFAULT_SHORE_MICRO_LOCKED = WEST_POSTROS_SHORE_BIOMES.reduce((acc, shore) => {
  for (const micro of shore.microBiomes ?? []) {
    acc[`${shore.id}:${micro.id}`] = false
  }
  return acc
}, {})

const DEFAULT_POI_RULES = [
  { id: 'military_base', allowedBiomes: ['grassland', 'desert'], count: 2, minDistance: 35, color: '#ef4444' },
  { id: 'village', allowedBiomes: ['grassland', 'forest', 'beach'], count: 6, minDistance: 20, color: '#f59e0b' },
  { id: 'radar_station', allowedBiomes: ['mountain'], count: 3, minDistance: 25, color: '#a855f7' },
]

const CANON_PRESETS = {
  'west-postros': {
    mapFormat: 'square',
    sizePresetKm: 4,
    mapType: 'island',
    seaSides: { left: true, top: true, right: false, bottom: true },
    worldStructure: WEST_POSTROS_STRUCTURE,
    poiRules: DEFAULT_POI_RULES,
  },
}

const SIZE_PRESETS_KM = [1, 2, 4, 8, 10, 40]

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

function smoothstep(t) {
  return t * t * (3 - 2 * t)
}

function hash2d(x, y, seed) {
  let n = x * 374761393 + y * 668265263 + seed * 1274126177
  n = (n ^ (n >> 13)) * 1274126177
  n = n ^ (n >> 16)
  return (n >>> 0) / 4294967296
}

function valueNoise2d(x, y, seed) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = x0 + 1
  const y1 = y0 + 1

  const sx = smoothstep(x - x0)
  const sy = smoothstep(y - y0)

  const v00 = hash2d(x0, y0, seed)
  const v10 = hash2d(x1, y0, seed)
  const v01 = hash2d(x0, y1, seed)
  const v11 = hash2d(x1, y1, seed)

  const ix0 = v00 + (v10 - v00) * sx
  const ix1 = v01 + (v11 - v01) * sx
  return ix0 + (ix1 - ix0) * sy
}

function fbm2d(x, y, seed, octaves = 5, lacunarity = 2.0, gain = 0.5) {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let amplitudeSum = 0

  for (let i = 0; i < octaves; i += 1) {
    const n = valueNoise2d(x * frequency, y * frequency, seed + i * 9973)
    value += n * amplitude
    amplitudeSum += amplitude
    amplitude *= gain
    frequency *= lacunarity
  }

  return amplitudeSum > 0 ? value / amplitudeSum : 0
}

function islandMask(x, y, width, height, strength, seaSides) {
  const nx = (x / Math.max(1, width - 1)) * 2 - 1
  const ny = (y / Math.max(1, height - 1)) * 2 - 1
  const sidePenalties = []
  if (seaSides.left) sidePenalties.push(Math.abs(nx + 1))
  if (seaSides.right) sidePenalties.push(Math.abs(nx - 1))
  if (seaSides.top) sidePenalties.push(Math.abs(ny + 1))
  if (seaSides.bottom) sidePenalties.push(Math.abs(ny - 1))

  const edgeFactor = sidePenalties.length > 0 ? Math.min(...sidePenalties) / 2 : 1
  const radial = 1 - clamp01(Math.sqrt(nx * nx + ny * ny))
  const mask = clamp01(Math.min(radial, edgeFactor))
  return Math.pow(mask, strength)
}

function pickByNoise(regions, value) {
  return regions.find((r) => value >= r.min && value < r.max) ?? regions[regions.length - 1]
}

function pickBiome(height, moisture, biomes, macroRegion) {
  const allowed = macroRegion?.allowedBiomes?.length ? biomes.filter((b) => macroRegion.allowedBiomes.includes(b.name)) : biomes
  const source = allowed.length ? allowed : biomes
  if (!source.length) return null
  return source.find(
    (biome) =>
      height >= biome.minHeight &&
      height < biome.maxHeight &&
      moisture >= biome.minMoisture &&
      moisture < biome.maxMoisture,
  ) ?? source[source.length - 1]
}

function pickSubBiome(height, moisture, biome, microRegion) {
  if (!biome) return null
  const subs = biome.subBiomes?.length ? biome.subBiomes : [biome]
  let source = subs
  if (microRegion?.preferredSubBiomes?.length) {
    const preferred = subs.filter((s) => microRegion.preferredSubBiomes.includes(s.name))
    if (preferred.length) source = preferred
  }
  return source.find(
    (sub) =>
      height >= sub.minHeight &&
      height < sub.maxHeight &&
      moisture >= sub.minMoisture &&
      moisture < sub.maxMoisture,
  ) ?? source[0]
}

function samplePois(biomeMap, seed, poiRules) {
  const height = biomeMap.length
  const width = biomeMap[0]?.length ?? 0
  const pois = {}

  const random = (() => {
    let state = (seed ^ 0x9e3779b9) >>> 0
    return () => {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return (state >>> 0) / 4294967296
    }
  })()

  for (const rule of poiRules) {
    const candidates = []
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (rule.allowedBiomes.includes(biomeMap[y][x])) {
          candidates.push({ x, y })
        }
      }
    }

    for (let i = candidates.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }

    const selected = []
    for (const c of candidates) {
      if (selected.length >= rule.count) break
      const ok = selected.every((s) => (c.x - s.x) ** 2 + (c.y - s.y) ** 2 >= rule.minDistance ** 2)
      if (ok) selected.push(c)
    }
    pois[rule.id] = selected
  }

  return pois
}

function generateWorld({ width, height, seed, islandFalloff, mapType, seaSides, worldStructure, poiRules }) {
  const biomes = worldStructure.biomes ?? []
  const macroRegions = worldStructure.macroRegions ?? []
  const microRegions = worldStructure.microRegions ?? []
  const biomeMap = []
  const colorMap = []

  for (let y = 0; y < height; y += 1) {
    const biomeRow = []
    const colorRow = []
    for (let x = 0; x < width; x += 1) {
      const hNoise = fbm2d(x / 92, y / 92, seed)
      const mNoise = fbm2d(x / 68, y / 68, seed + 17389)
      const macroNoise = fbm2d(x / 150, y / 150, seed + 4444)
      const microNoise = fbm2d(x / 36, y / 36, seed + 8888)

      const mask = islandMask(x, y, width, height, islandFalloff, seaSides)
      const lakeNoise = fbm2d(x / 38, y / 38, seed + 99173, 4, 2.1, 0.55)
      let hValue = clamp01(hNoise * mask * 1.2)

      if (mapType === 'continent') {
        // Mostly landmass with occasional local water bodies.
        hValue = clamp01(0.18 + hNoise * 0.9)
        if (lakeNoise > 0.45 && lakeNoise < 0.52 && hValue < 0.65) {
          hValue = clamp01(hValue - 0.42)
        }
      }

      const mValue = clamp01(mNoise)
      const macroRegion = macroRegions.length ? pickByNoise(macroRegions, macroNoise) : null
      const microRegion = microRegions.length ? pickByNoise(microRegions, microNoise) : null
      const biome = pickBiome(hValue, mValue, biomes, macroRegion)
      const subBiome = pickSubBiome(hValue, mValue, biome, microRegion)
      biomeRow.push(biome && subBiome ? `${biome.name}:${subBiome.name}` : 'void:void')
      colorRow.push(subBiome?.color ?? biome?.color ?? '#1f2937')
    }
    biomeMap.push(biomeRow)
    colorMap.push(colorRow)
  }

  return { colorMap, pois: samplePois(biomeMap, seed + 404, poiRules) }
}

function LanguageToggle({ language, onToggle, tooltip }) {
  return (
    <button className="lang-toggle" onClick={onToggle} title={tooltip}>
      <span aria-hidden="true">🌍</span>
      <span>{language === 'ru' ? 'RU' : 'EN'}</span>
    </button>
  )
}

function CollapsibleSection({
  title,
  children,
  isOpen = true,
  onToggleOpen,
  isLocked = false,
  onToggleLock,
}) {
  return (
    <details
      className={`size-section ${isLocked ? 'locked' : ''}`}
      open={isOpen}
      onToggle={(event) => {
        if (isLocked) {
          event.currentTarget.open = false
          onToggleOpen?.(false)
          return
        }
        onToggleOpen?.(event.currentTarget.open)
      }}
    >
      <summary>
        <span>{title}</span>
        {onToggleLock ? (
          <button
            type="button"
            className="section-lock-btn"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onToggleLock()
            }}
            aria-label={isLocked ? 'unlock section' : 'lock section'}
            title={isLocked ? 'Разблокировать' : 'Заблокировать'}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
        ) : null}
      </summary>
      <div className="section-body">{children}</div>
    </details>
  )
}

function InfoButton({ onClick }) {
  return (
    <button type="button" className="info-btn" onClick={onClick} aria-label="info">
      i
    </button>
  )
}

function SettingsButton({ onClick }) {
  return (
    <button type="button" className="settings-btn" onClick={onClick} aria-label="settings">
      ⚙
    </button>
  )
}

function InfoModal({ open, title, content, fallbackText, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="close">×</button>
        <h3>{title}</h3>
        <p>{content?.trim() ? content : fallbackText}</p>
      </div>
    </div>
  )
}

function BiomeSettingsModal({
  open,
  title,
  coveragePercent,
  coverageSquareMeters,
  percentLabel,
  squareMetersLabel,
  onChangePercent,
  onClose,
}) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="close">×</button>
        <h3>{title}</h3>
        <div className="nested-body">
          <label>
            {percentLabel}
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={coveragePercent}
              onChange={(e) => onChangePercent(Number(e.target.value) || 0)}
            />
          </label>
          <label>
            {squareMetersLabel}
            <input type="text" readOnly value={coverageSquareMeters} />
          </label>
        </div>
      </div>
    </div>
  )
}

function MicroBiomeSettingsModal({
  open,
  title,
  coveragePercent,
  coverageSquareMeters,
  percentLabel,
  squareMetersLabel,
  onChangePercent,
  onClose,
}) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="close">×</button>
        <h3>{title}</h3>
        <div className="nested-body">
          <label>
            {percentLabel}
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={coveragePercent}
              onChange={(e) => onChangePercent(Number(e.target.value) || 0)}
            />
          </label>
          <label>
            {squareMetersLabel}
            <input type="text" readOnly value={coverageSquareMeters} />
          </label>
        </div>
      </div>
    </div>
  )
}

function formatTemplate(template, values) {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template,
  )
}

function normalizeLegacyMacroRegionName(region, language) {
  const legacyMapRu = {
    north: 'Северные земли',
    center: 'Средние земли',
    south: 'Южные земли',
  }
  const legacyMapEn = {
    north: 'Northern Lands',
    center: 'Middle Lands',
    south: 'Southern Lands',
  }
  if (language === 'ru') {
    return region.nameRu ?? legacyMapRu[region.id] ?? region.id
  }
  return region.nameEn ?? legacyMapEn[region.id] ?? region.id
}

function localizeName(entity, language) {
  return language === 'ru' ? entity.nameRu ?? entity.nameEn ?? '' : entity.nameEn ?? entity.nameRu ?? ''
}

function formatLabelWithCode(name, code, showCode) {
  if (!showCode || !code) return name
  return `${code} ${name}`
}

function formatPercent(value) {
  const rounded = Math.round((value ?? 0) * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

function rebalanceBiomeCoverage(enabledMap, lockedMap, coverageMap, biomeIds) {
  const next = { ...coverageMap }
  const enabledIds = biomeIds.filter((id) => Boolean(enabledMap[id]))
  const lockedEnabledIds = enabledIds.filter((id) => Boolean(lockedMap[id]))
  const unlockedEnabledIds = enabledIds.filter((id) => !lockedMap[id])
  const lockedSum = lockedEnabledIds.reduce((sum, id) => sum + (next[id] ?? 0), 0)
  const remaining = Math.max(0, 100 - lockedSum)
  const perUnlocked = unlockedEnabledIds.length > 0
    ? Math.round((remaining / unlockedEnabledIds.length) * 10) / 10
    : 0

  for (const id of biomeIds) {
    if (!enabledMap[id]) {
      next[id] = 0
    } else if (!lockedMap[id]) {
      next[id] = perUnlocked
    }
  }
  return next
}

function rebalanceMicroBiomeCoverage(enabledMap, lockedMap, coverageMap, siblingKeys) {
  const next = { ...coverageMap }
  const enabledKeys = siblingKeys.filter((key) => Boolean(enabledMap[key]))
  const lockedEnabledKeys = enabledKeys.filter((key) => Boolean(lockedMap[key]))
  const unlockedEnabledKeys = enabledKeys.filter((key) => !lockedMap[key])
  const lockedSum = lockedEnabledKeys.reduce((sum, key) => sum + (next[key] ?? 0), 0)
  const remaining = Math.max(0, 100 - lockedSum)
  const perUnlocked = unlockedEnabledKeys.length > 0
    ? Math.round((remaining / unlockedEnabledKeys.length) * 10) / 10
    : 0

  for (const key of siblingKeys) {
    if (!enabledMap[key]) {
      next[key] = 0
    } else if (!lockedMap[key]) {
      next[key] = perUnlocked
    }
  }
  return next
}

/** World-space metric grid: minor every 100 m, major every 1 km (CSS overlay, % of map extent). */
function metricGridLayerStyle(mapWidthMeters, mapHeightMeters, zoom = 1) {
  const w = Math.max(1, mapWidthMeters)
  const h = Math.max(1, mapHeightMeters)
  const safeZoom = Math.max(0.5, zoom)
  const pct100x = Math.min(100, (100 / w) * 100)
  const pct1000x = Math.min(100, (1000 / w) * 100)
  const pct100y = Math.min(100, (100 / h) * 100)
  const pct1000y = Math.min(100, (1000 / h) * 100)
  const minorLinePx = Math.max(0.5, Math.min(1, 0.5 / safeZoom))
  const majorLinePx = Math.max(0.6, Math.min(1.4, (1.2 - (Math.max(1, zoom) - 1) * 0.11) / safeZoom))
  const minorAlpha = zoom < 1 ? 0.14 : 0.08
  return {
    backgroundImage: [
      `repeating-linear-gradient(to right, rgba(255,255,255,${minorAlpha}) 0, rgba(255,255,255,${minorAlpha}) ${minorLinePx}px, transparent ${minorLinePx}px, transparent ${pct100x}%)`,
      `repeating-linear-gradient(to bottom, rgba(255,255,255,${minorAlpha}) 0, rgba(255,255,255,${minorAlpha}) ${minorLinePx}px, transparent ${minorLinePx}px, transparent ${pct100y}%)`,
      `repeating-linear-gradient(to right, rgba(255,255,255,0.32) 0, rgba(255,255,255,0.32) ${majorLinePx}px, transparent ${majorLinePx}px, transparent ${pct1000x}%)`,
      `repeating-linear-gradient(to bottom, rgba(255,255,255,0.32) 0, rgba(255,255,255,0.32) ${majorLinePx}px, transparent ${majorLinePx}px, transparent ${pct1000y}%)`,
    ].join(', '),
  }
}

function EditorPage({ language, onToggleLanguage }) {
  const MAX_MAP_METERS = 100_000
  const MIN_MAP_METERS = 0
  const METERS_PER_TILE = 500
  const MIN_TILES = 16
  const MAX_TILES = 220
  const MIN_VISIBLE_MAP_RATIO = 0.15

  const t = TEXT[language]
  const [isRtgEnabled, setIsRtgEnabled] = useState(true)
  const [showInternalCodes, setShowInternalCodes] = useState(false)
  const [selectedCanon, setSelectedCanon] = useState('west-postros')
  const [mapType, setMapType] = useState('island')
  const [isMapTypeLocked, setIsMapTypeLocked] = useState(true)
  const [isMapTypeOpen, setIsMapTypeOpen] = useState(false)
  const [isMapFormatLocked, setIsMapFormatLocked] = useState(true)
  const [isMapSizeLocked, setIsMapSizeLocked] = useState(true)
  const [isMapFormatOpen, setIsMapFormatOpen] = useState(false)
  const [isMapSizeOpen, setIsMapSizeOpen] = useState(false)
  const [seaSides, setSeaSides] = useState({
    left: true,
    top: true,
    right: true,
    bottom: true,
  })
  const [waterMacroLocked, setWaterMacroLocked] = useState(() =>
    Object.fromEntries(WEST_POSTROS_WATER_MACROREGIONS_RU.map((r) => [r.id, false])),
  )
  const [landMacroLocked, setLandMacroLocked] = useState(() =>
    Object.fromEntries(WEST_POSTROS_MACROREGIONS_RU.map((r) => [r.id, false])),
  )
  const toggleWaterMacroLock = (macroRegionId, checked) => {
    setWaterMacroLocked((prev) => ({ ...prev, [macroRegionId]: checked }))
  }
  const toggleLandMacroLock = (macroRegionId, checked) => {
    setLandMacroLocked((prev) => ({ ...prev, [macroRegionId]: checked }))
  }
  const [mapFormat, setMapFormat] = useState('square')
  const [seed, setSeed] = useState(1)
  const [mapWidthMeters, setMapWidthMeters] = useState(20_000)
  const [mapHeightMeters, setMapHeightMeters] = useState(20_000)
  const [sizePresetKm, setSizePresetKm] = useState(10)
  const [islandFalloff, setIslandFalloff] = useState(1.7)
  const [appliedSettings, setAppliedSettings] = useState({ seed: 1, islandFalloff: 1.7 })
  const [worldStructure, setWorldStructure] = useState(DEFAULT_WORLD_STRUCTURE)
  const [poiRules, setPoiRules] = useState(DEFAULT_POI_RULES)
  const [biomeCoveragePercent, setBiomeCoveragePercent] = useState(DEFAULT_BIOME_COVERAGE_PERCENT)
  const [microBiomeCoveragePercent, setMicroBiomeCoveragePercent] = useState(DEFAULT_MICRO_BIOME_COVERAGE_PERCENT)
  const [biomeEnabled, setBiomeEnabled] = useState(DEFAULT_BIOME_ENABLED)
  const [biomeLocked, setBiomeLocked] = useState(DEFAULT_BIOME_LOCKED)
  const [microBiomeEnabled, setMicroBiomeEnabled] = useState(DEFAULT_MICRO_BIOME_ENABLED)
  const [microBiomeLocked, setMicroBiomeLocked] = useState(DEFAULT_MICRO_BIOME_LOCKED)
  const [shoreCoveragePercent, setShoreCoveragePercent] = useState(DEFAULT_SHORE_COVERAGE_PERCENT)
  const [shoreEnabled, setShoreEnabled] = useState(DEFAULT_SHORE_ENABLED)
  const [shoreLocked, setShoreLocked] = useState(DEFAULT_SHORE_LOCKED)
  const [shoreMicroCoveragePercent, setShoreMicroCoveragePercent] = useState(DEFAULT_SHORE_MICRO_COVERAGE_PERCENT)
  const [shoreMicroEnabled, setShoreMicroEnabled] = useState(DEFAULT_SHORE_MICRO_ENABLED)
  const [shoreMicroLocked, setShoreMicroLocked] = useState(DEFAULT_SHORE_MICRO_LOCKED)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', content: '' })
  const [settingsBiomeId, setSettingsBiomeId] = useState(null)
  const [settingsMicroBiomeKey, setSettingsMicroBiomeKey] = useState(null)
  const [settingsShoreId, setSettingsShoreId] = useState(null)
  const [settingsShoreMicroKey, setSettingsShoreMicroKey] = useState(null)
  const [showMetricGrid, setShowMetricGrid] = useState(true)
  const [viewportZoom, setViewportZoom] = useState(1)
  const [isViewportPanning, setIsViewportPanning] = useState(false)
  const viewportRef = useRef(null)
  const mapCanvasRef = useRef(null)
  const viewportPanRef = useRef({ x: 0, y: 0 })
  const viewportDragRef = useRef(null)
  const activePointerIdRef = useRef(null)

  const width = Math.max(
    MIN_TILES,
    Math.min(MAX_TILES, Math.round(mapWidthMeters / METERS_PER_TILE)),
  )
  const height = Math.max(
    MIN_TILES,
    Math.min(MAX_TILES, Math.round(mapHeightMeters / METERS_PER_TILE)),
  )

  const activeSeed = isRtgEnabled ? seed : appliedSettings.seed
  const activeIslandFalloff = isRtgEnabled ? islandFalloff : appliedSettings.islandFalloff

  const world = useMemo(
    () => generateWorld({ width, height, seed: activeSeed, islandFalloff: activeIslandFalloff, mapType, seaSides, worldStructure, poiRules }),
    [activeSeed, activeIslandFalloff, width, height, mapType, seaSides, worldStructure, poiRules],
  )

  const militaryCount = Object.entries(world.pois)
    .filter(([key]) => key.includes('military') || key.includes('radar'))
    .reduce((sum, [, arr]) => sum + arr.length, 0)
  const totalLocations = Object.values(world.pois).reduce((sum, arr) => sum + arr.length, 0)
  const civilianCount = Math.max(0, totalLocations - militaryCount)
  const widthKm = mapWidthMeters / 1000
  const heightKm = mapHeightMeters / 1000
  const formatKmValue = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1))
  const sizeText = `${formatKmValue(widthKm)}x${formatKmValue(heightKm)}${t.km}`
  const totalIslandAreaSquareMeters = mapWidthMeters * mapHeightMeters
  const mapShapeText = mapFormat === 'square' ? t.mapShapeSquare : t.mapShapeFreeform
  const seaCode = `${seaSides.left ? 'Л' : ''}${seaSides.top ? 'В' : ''}${seaSides.right ? 'П' : ''}${seaSides.bottom ? 'Н' : ''}`
  const seaPartsRu = [
    seaSides.left ? 'Лево' : null,
    seaSides.top ? 'Верх' : null,
    seaSides.right ? 'Право' : null,
    seaSides.bottom ? 'Низ' : null,
  ].filter(Boolean).join(' ')
  const seasText = mapType === 'island'
    ? (seaCode ? `${seaCode} (${seaPartsRu})` : '-')
    : (language === 'ru' ? '—' : 'n/a')
  const reportText = formatTemplate(t.reportGenerated, {
    seed: activeSeed,
    shape: mapShapeText,
    size: sizeText,
    seas: seasText,
    military: militaryCount,
    civil: civilianCount,
  })


  const regenerate = () => {
    setAppliedSettings({ seed, islandFalloff })
  }
  const clampZoom = useCallback((nextZoom) => Math.max(0.5, Math.min(8, nextZoom)), [])
  const zoomIn = () => setViewportZoom((prev) => clampZoom(prev * 1.15))
  const zoomOut = () => setViewportZoom((prev) => clampZoom(prev / 1.15))
  const clampViewportPan = useCallback((pan, zoom) => {
    const viewportEl = viewportRef.current
    if (!viewportEl) return pan
    const rect = viewportEl.getBoundingClientRect()
    const viewportWidth = rect.width
    const viewportHeight = rect.height
    const scaledMapWidth = viewportWidth * zoom
    const scaledMapHeight = viewportHeight * zoom
    const minVisibleWidth = viewportWidth * MIN_VISIBLE_MAP_RATIO
    const minVisibleHeight = viewportHeight * MIN_VISIBLE_MAP_RATIO
    const maxPanX = Math.max(0, (scaledMapWidth + viewportWidth) / 2 - minVisibleWidth)
    const maxPanY = Math.max(0, (scaledMapHeight + viewportHeight) / 2 - minVisibleHeight)
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, pan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, pan.y)),
    }
  }, [])
  const applyViewportTransform = useCallback((pan, zoom) => {
    if (!mapCanvasRef.current) return
    const clampedPan = clampViewportPan(pan, zoom)
    viewportPanRef.current = clampedPan
    mapCanvasRef.current.style.transform = `translate(${clampedPan.x}px, ${clampedPan.y}px) scale(${zoom})`
  }, [clampViewportPan])
  const stopViewportPan = () => {
    if (!viewportDragRef.current) return
    viewportDragRef.current = null
    activePointerIdRef.current = null
    setIsViewportPanning(false)
  }
  const startViewportPan = (event) => {
    if (event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('.map-zoom-controls')) return
    event.preventDefault()
    activePointerIdRef.current = event.pointerId
    viewportDragRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsViewportPanning(true)
  }
  const moveViewportPan = (event) => {
    if (!viewportDragRef.current) return
    if (activePointerIdRef.current !== event.pointerId) return
    event.preventDefault()
    const deltaX = event.clientX - viewportDragRef.current.x
    const deltaY = event.clientY - viewportDragRef.current.y
    viewportDragRef.current = { x: event.clientX, y: event.clientY }
    const nextPan = {
      x: viewportPanRef.current.x + deltaX,
      y: viewportPanRef.current.y + deltaY,
    }
    applyViewportTransform(nextPan, viewportZoom)
  }
  const endViewportPan = (event) => {
    if (activePointerIdRef.current !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    stopViewportPan()
  }
  const randomizeSeed = () => setSeed(Math.floor(Math.random() * 1000000))
  const setHeightMeters = (value) => {
    const clamped = Math.max(MIN_MAP_METERS, Math.min(MAX_MAP_METERS, value))
    setMapHeightMeters(clamped)
    setSizePresetKm(null)
  }

  const setWidthMeters = (value) => {
    const clamped = Math.max(MIN_MAP_METERS, Math.min(MAX_MAP_METERS, value))
    setMapWidthMeters(clamped)
    setSizePresetKm(null)
    if (mapFormat === 'square') {
      setMapHeightMeters(clamped)
    }
  }

  const applyPreset = (kmValue) => {
    const meters = kmValue * 1000
    setSizePresetKm(kmValue)
    setMapWidthMeters(meters)
    setMapHeightMeters(meters)
  }

  const openInfo = (title, content) => setInfoModal({ open: true, title, content: content ?? '' })
  const openBiomeSettings = (biomeId) => setSettingsBiomeId(biomeId)
  const openMicroBiomeSettings = (biomeId, microBiomeId) => setSettingsMicroBiomeKey(`${biomeId}:${microBiomeId}`)
  const openShoreSettings = (shoreId) => setSettingsShoreId(shoreId)
  const openShoreMicroSettings = (shoreId, microId) => setSettingsShoreMicroKey(`${shoreId}:${microId}`)
  const setBiomeCoverage = (biomeId, value) => {
    const clamped = Math.max(0, Math.min(100, value))
    const nextEnabled = { ...biomeEnabled, [biomeId]: clamped > 0 }
    const rawCoverage = { ...biomeCoveragePercent, [biomeId]: clamped }
    const biomeIds = WEST_POSTROS_CONTENT_BIOMES.map((biome) => biome.id)
    const nextLocked = clamped > 0 ? { ...biomeLocked, [biomeId]: true } : { ...biomeLocked, [biomeId]: false }
    const nextCoverage = rebalanceBiomeCoverage(nextEnabled, nextLocked, rawCoverage, biomeIds)
    setBiomeEnabled(nextEnabled)
    setBiomeLocked(nextLocked)
    setBiomeCoveragePercent(nextCoverage)
  }
  const toggleBiomeLock = (biomeId, checked) => {
    if (!biomeEnabled[biomeId]) return
    const nextLocked = { ...biomeLocked, [biomeId]: checked }
    const biomeIds = WEST_POSTROS_CONTENT_BIOMES.map((biome) => biome.id)
    const nextCoverage = rebalanceBiomeCoverage(biomeEnabled, nextLocked, biomeCoveragePercent, biomeIds)
    setBiomeLocked(nextLocked)
    setBiomeCoveragePercent(nextCoverage)
  }
  const toggleBiomeEnabled = (biomeId, checked) => {
    const nextEnabled = { ...biomeEnabled, [biomeId]: checked }
    const nextLocked = checked ? biomeLocked : { ...biomeLocked, [biomeId]: false }
    const biomeIds = WEST_POSTROS_CONTENT_BIOMES.map((biome) => biome.id)
    const nextCoverage = rebalanceBiomeCoverage(nextEnabled, nextLocked, biomeCoveragePercent, biomeIds)
    setBiomeEnabled(nextEnabled)
    setBiomeLocked(nextLocked)
    setBiomeCoveragePercent(nextCoverage)
  }
  const setMicroBiomeCoverage = (key, value) => {
    const clamped = Math.max(0, Math.min(100, value))
    const biomeId = key.split(':')[0]
    const parentBiome = WEST_POSTROS_CONTENT_BIOMES.find((biome) => biome.id === biomeId)
    const siblingKeys = (parentBiome?.microBiomes ?? []).map((micro) => `${biomeId}:${micro.id}`)
    const nextEnabled = { ...microBiomeEnabled, [key]: clamped > 0 }
    const rawCoverage = { ...microBiomeCoveragePercent, [key]: clamped }
    const nextLocked = clamped > 0 ? { ...microBiomeLocked, [key]: true } : { ...microBiomeLocked, [key]: false }
    const nextCoverage = rebalanceMicroBiomeCoverage(nextEnabled, nextLocked, rawCoverage, siblingKeys)
    setMicroBiomeEnabled(nextEnabled)
    setMicroBiomeLocked(nextLocked)
    setMicroBiomeCoveragePercent(nextCoverage)
  }
  const toggleMicroBiomeLock = (key, checked) => {
    if (!microBiomeEnabled[key]) return
    const biomeId = key.split(':')[0]
    const parentBiome = WEST_POSTROS_CONTENT_BIOMES.find((biome) => biome.id === biomeId)
    const siblingKeys = (parentBiome?.microBiomes ?? []).map((micro) => `${biomeId}:${micro.id}`)
    const nextLocked = { ...microBiomeLocked, [key]: checked }
    const nextCoverage = rebalanceMicroBiomeCoverage(microBiomeEnabled, nextLocked, microBiomeCoveragePercent, siblingKeys)
    setMicroBiomeLocked(nextLocked)
    setMicroBiomeCoveragePercent(nextCoverage)
  }
  const toggleMicroBiomeEnabled = (key, checked) => {
    const biomeId = key.split(':')[0]
    const parentBiome = WEST_POSTROS_CONTENT_BIOMES.find((biome) => biome.id === biomeId)
    const siblingKeys = (parentBiome?.microBiomes ?? []).map((micro) => `${biomeId}:${micro.id}`)
    const nextEnabled = { ...microBiomeEnabled, [key]: checked }
    const nextLocked = checked ? microBiomeLocked : { ...microBiomeLocked, [key]: false }
    const nextCoverage = rebalanceMicroBiomeCoverage(nextEnabled, nextLocked, microBiomeCoveragePercent, siblingKeys)
    setMicroBiomeEnabled(nextEnabled)
    setMicroBiomeLocked(nextLocked)
    setMicroBiomeCoveragePercent(nextCoverage)
  }
  const activeSettingsBiome = WEST_POSTROS_CONTENT_BIOMES.find((biome) => biome.id === settingsBiomeId) ?? null
  const activeSettingsShore = WEST_POSTROS_SHORE_BIOMES.find((shore) => shore.id === settingsShoreId) ?? null
  const unallocatedBiomePercent = Math.max(
    0,
    100 - WEST_POSTROS_CONTENT_BIOMES.reduce((sum, biome) => sum + (biomeCoveragePercent[biome.id] ?? 0), 0),
  )
  const activeMicroBiomeSettings =
    settingsMicroBiomeKey
      ? WEST_POSTROS_CONTENT_BIOMES.flatMap((biome) =>
          (biome.microBiomes ?? []).map((micro) => ({
            key: `${biome.id}:${micro.id}`,
            biomeId: biome.id,
            biomeName: localizeName(biome, language),
            micro,
          })),
        ).find((entry) => entry.key === settingsMicroBiomeKey) ?? null
      : null
  const activeShoreMicroSettings =
    settingsShoreMicroKey
      ? WEST_POSTROS_SHORE_BIOMES.flatMap((shore) =>
          (shore.microBiomes ?? []).map((micro) => ({
            key: `${shore.id}:${micro.id}`,
            shoreId: shore.id,
            shoreName: localizeName(shore, language),
            micro,
          })),
        ).find((entry) => entry.key === settingsShoreMicroKey) ?? null
      : null
  const setShoreCoverage = (shoreId, value) => {
    const clamped = Math.max(0, Math.min(100, value))
    const nextEnabled = { ...shoreEnabled, [shoreId]: clamped > 0 }
    const rawCoverage = { ...shoreCoveragePercent, [shoreId]: clamped }
    const shoreIds = WEST_POSTROS_SHORE_BIOMES.map((shore) => shore.id)
    const nextLocked = clamped > 0 ? { ...shoreLocked, [shoreId]: true } : { ...shoreLocked, [shoreId]: false }
    const nextCoverage = rebalanceBiomeCoverage(nextEnabled, nextLocked, rawCoverage, shoreIds)
    setShoreEnabled(nextEnabled)
    setShoreLocked(nextLocked)
    setShoreCoveragePercent(nextCoverage)
  }
  const toggleShoreLock = (shoreId, checked) => {
    if (!shoreEnabled[shoreId]) return
    const nextLocked = { ...shoreLocked, [shoreId]: checked }
    const shoreIds = WEST_POSTROS_SHORE_BIOMES.map((shore) => shore.id)
    const nextCoverage = rebalanceBiomeCoverage(shoreEnabled, nextLocked, shoreCoveragePercent, shoreIds)
    setShoreLocked(nextLocked)
    setShoreCoveragePercent(nextCoverage)
  }
  const toggleShoreEnabled = (shoreId, checked) => {
    const nextEnabled = { ...shoreEnabled, [shoreId]: checked }
    const nextLocked = checked ? shoreLocked : { ...shoreLocked, [shoreId]: false }
    const shoreIds = WEST_POSTROS_SHORE_BIOMES.map((shore) => shore.id)
    const nextCoverage = rebalanceBiomeCoverage(nextEnabled, nextLocked, shoreCoveragePercent, shoreIds)
    setShoreEnabled(nextEnabled)
    setShoreLocked(nextLocked)
    setShoreCoveragePercent(nextCoverage)
  }
  const setShoreMicroCoverage = (key, value) => {
    const clamped = Math.max(0, Math.min(100, value))
    const shoreId = key.split(':')[0]
    const parentShore = WEST_POSTROS_SHORE_BIOMES.find((shore) => shore.id === shoreId)
    const siblingKeys = (parentShore?.microBiomes ?? []).map((micro) => `${shoreId}:${micro.id}`)
    const nextEnabled = { ...shoreMicroEnabled, [key]: clamped > 0 }
    const rawCoverage = { ...shoreMicroCoveragePercent, [key]: clamped }
    const nextLocked = clamped > 0 ? { ...shoreMicroLocked, [key]: true } : { ...shoreMicroLocked, [key]: false }
    const nextCoverage = rebalanceMicroBiomeCoverage(nextEnabled, nextLocked, rawCoverage, siblingKeys)
    setShoreMicroEnabled(nextEnabled)
    setShoreMicroLocked(nextLocked)
    setShoreMicroCoveragePercent(nextCoverage)
  }
  const toggleShoreMicroLock = (key, checked) => {
    if (!shoreMicroEnabled[key]) return
    const shoreId = key.split(':')[0]
    const parentShore = WEST_POSTROS_SHORE_BIOMES.find((shore) => shore.id === shoreId)
    const siblingKeys = (parentShore?.microBiomes ?? []).map((micro) => `${shoreId}:${micro.id}`)
    const nextLocked = { ...shoreMicroLocked, [key]: checked }
    const nextCoverage = rebalanceMicroBiomeCoverage(shoreMicroEnabled, nextLocked, shoreMicroCoveragePercent, siblingKeys)
    setShoreMicroLocked(nextLocked)
    setShoreMicroCoveragePercent(nextCoverage)
  }
  const toggleShoreMicroEnabled = (key, checked) => {
    const shoreId = key.split(':')[0]
    const parentShore = WEST_POSTROS_SHORE_BIOMES.find((shore) => shore.id === shoreId)
    const siblingKeys = (parentShore?.microBiomes ?? []).map((micro) => `${shoreId}:${micro.id}`)
    const nextEnabled = { ...shoreMicroEnabled, [key]: checked }
    const nextLocked = checked ? shoreMicroLocked : { ...shoreMicroLocked, [key]: false }
    const nextCoverage = rebalanceMicroBiomeCoverage(nextEnabled, nextLocked, shoreMicroCoveragePercent, siblingKeys)
    setShoreMicroEnabled(nextEnabled)
    setShoreMicroLocked(nextLocked)
    setShoreMicroCoveragePercent(nextCoverage)
  }

  useEffect(() => {
    if (selectedCanon === 'west-postros') {
      const preset = CANON_PRESETS['west-postros']
      const meters = preset.sizePresetKm * 1000
      setMapFormat(preset.mapFormat)
      setSizePresetKm(preset.sizePresetKm)
      setMapWidthMeters(meters)
      setMapHeightMeters(meters)
      setMapType(preset.mapType)
      setSeaSides(preset.seaSides)
      setWorldStructure(preset.worldStructure)
      setPoiRules(preset.poiRules)
      setIsMapTypeLocked(true)
      setIsMapTypeOpen(false)
      setIsMapFormatLocked(true)
      setIsMapSizeLocked(true)
      setIsMapFormatOpen(false)
      setIsMapSizeOpen(false)
    } else {
      setWorldStructure(EMPTY_WORLD_STRUCTURE)
      setPoiRules([])
      setIsMapTypeLocked(false)
      setIsMapTypeOpen(true)
      setIsMapFormatLocked(false)
      setIsMapSizeLocked(false)
      setIsMapFormatOpen(true)
      setIsMapSizeOpen(true)
    }
  }, [selectedCanon])

  useEffect(() => {
    const viewportEl = viewportRef.current
    if (!viewportEl) return undefined
    const onWheel = (event) => {
      event.preventDefault()
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15
      setViewportZoom((prev) => clampZoom(prev * factor))
    }
    viewportEl.addEventListener('wheel', onWheel, { passive: false })
    return () => viewportEl.removeEventListener('wheel', onWheel)
  }, [clampZoom])

  useEffect(() => {
    applyViewportTransform(viewportPanRef.current, viewportZoom)
  }, [viewportZoom, applyViewportTransform])

  useEffect(() => {
    const stopOnWindowBlur = () => stopViewportPan()
    window.addEventListener('blur', stopOnWindowBlur)
    return () => window.removeEventListener('blur', stopOnWindowBlur)
  }, [])

  return (
    <main className="app">
      <section className="panel">
        <div className="buttons">
          <Link className="link-button" to="/" title={t.hints.backHome}>{t.backHome}</Link>
          <LanguageToggle language={language} onToggle={onToggleLanguage} tooltip={t.hints.language} />
        </div>
        <h1>{t.title}</h1>
        <p className="hint-text">
          {language === 'ru' ? projectContent.project.nameRu : projectContent.project.nameEn}
        </p>
        <p>{t.subtitle}</p>
        <p className="hint-text">Наведите на функцию или кнопку чтобы прочитать её описание.</p>
        <div className="controls">
          <CollapsibleSection title={t.mapPreset}>
            <label>
              <select value={selectedCanon} onChange={(e) => setSelectedCanon(e.target.value)}>
                <option value="none">{t.canonNone}</option>
                <option value="west-postros">{t.canonWestPostros}</option>
              </select>
            </label>
          </CollapsibleSection>
          <CollapsibleSection title={t.generatorSettings}>
            <label className="inline-option">
              <input
                type="checkbox"
                checked={isRtgEnabled}
                onChange={(e) => setIsRtgEnabled(e.target.checked)}
                title={t.hints.rtg}
              />
              {t.rtgLabel}
            </label>
          </CollapsibleSection>
          <CollapsibleSection title={t.listSettings}>
            <label className="inline-option">
              <input
                type="checkbox"
                checked={showInternalCodes}
                onChange={(e) => setShowInternalCodes(e.target.checked)}
              />
              {t.showInternalCodes}
            </label>
          </CollapsibleSection>
          <CollapsibleSection
            title={(
              <>
                {t.mapFormat} <span className="section-selected">({mapFormat === 'square' ? t.square : t.freeform})</span>
              </>
            )}
            isOpen={isMapFormatOpen}
            onToggleOpen={setIsMapFormatOpen}
            isLocked={isMapFormatLocked}
            onToggleLock={() => setIsMapFormatLocked((prev) => !prev)}
          >
            <label className="inline-option">
              <input
                type="radio"
                name="mapFormat"
                checked={mapFormat === 'square'}
                onChange={() => {
                  setMapFormat('square')
                  setMapHeightMeters(mapWidthMeters)
                }}
                title={t.hints.mapFormatSquare}
              />
              {t.square}
            </label>
            <label className="inline-option">
              <input
                type="radio"
                name="mapFormat"
                checked={mapFormat === 'freeform'}
                onChange={() => setMapFormat('freeform')}
                title={t.hints.mapFormatFreeform}
              />
              {t.freeform}
            </label>
          </CollapsibleSection>
          <CollapsibleSection
            title={(
              <>
                {t.mapSize} <span className="section-selected">({sizePresetKm ? `${sizePresetKm}x${sizePresetKm} ${t.km}` : t.customPreset})</span>
              </>
            )}
            isOpen={isMapSizeOpen}
            onToggleOpen={setIsMapSizeOpen}
            isLocked={isMapSizeLocked}
            onToggleLock={() => setIsMapSizeLocked((prev) => !prev)}
          >
            <label>
              {t.sizePreset}
              <div className="preset-row">
                {SIZE_PRESETS_KM.map((km) => (
        <button
                    key={km}
          type="button"
                    className={`preset-btn ${sizePresetKm === km ? 'active' : ''}`}
                    onClick={() => applyPreset(km)}
                    title={t.hints.sizePreset}
        >
                    {km}x{km}
        </button>
                ))}
              </div>
            </label>
            <details className="manual-size">
              <summary title={t.hints.manualSetup}>{t.manualSetup}</summary>
              <div className="manual-size-content">
                <label>
                  {t.width}: {mapWidthMeters.toLocaleString()} {t.meters} ({(mapWidthMeters / 1000).toFixed(1)} {t.km})
                  <input
                    type="range"
                    min={MIN_MAP_METERS}
                    max={MAX_MAP_METERS}
                    step="100"
                    value={mapWidthMeters}
                    onChange={(e) => setWidthMeters(Number(e.target.value))}
                    title={t.hints.width}
                  />
                  <input
                    type="number"
                    min={MIN_MAP_METERS}
                    max={MAX_MAP_METERS}
                    step="100"
                    value={mapWidthMeters}
                    onChange={(e) => setWidthMeters(Number(e.target.value) || 0)}
                    title={t.hints.width}
                  />
                </label>
                <label>
                  {t.height}: {mapHeightMeters.toLocaleString()} {t.meters} ({(mapHeightMeters / 1000).toFixed(1)} {t.km})
                  <input
                    type="range"
                    min={MIN_MAP_METERS}
                    max={MAX_MAP_METERS}
                    step="100"
                    value={mapHeightMeters}
                    onChange={(e) => setHeightMeters(Number(e.target.value))}
                    disabled={mapFormat === 'square'}
                    title={t.hints.height}
                  />
                  <input
                    type="number"
                    min={MIN_MAP_METERS}
                    max={MAX_MAP_METERS}
                    step="100"
                    value={mapHeightMeters}
                    onChange={(e) => setHeightMeters(Number(e.target.value) || 0)}
                    disabled={mapFormat === 'square'}
                    title={t.hints.height}
                  />
                </label>
              </div>
            </details>
          </CollapsibleSection>
          <CollapsibleSection title={t.seed}>
            <label>
              {t.seed}
              <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) || 0)} title={t.hints.seed} />
            </label>
          </CollapsibleSection>
          <CollapsibleSection title={t.grid}>
            <label className="inline-option">
              <input
                type="checkbox"
                checked={showMetricGrid}
                onChange={(e) => setShowMetricGrid(e.target.checked)}
                title={t.hints.showMetricGrid}
              />
              {t.showMetricGrid}
            </label>
          </CollapsibleSection>
          <CollapsibleSection
            title={(
              <>
                {t.terrain} <span className="section-selected">({mapType === 'island' ? t.islandType : t.continentType})</span>
              </>
            )}
          >
            <details
              className={`nested-section ${isMapTypeLocked ? 'locked' : ''}`}
              open={isMapTypeOpen}
              onToggle={(event) => {
                if (isMapTypeLocked) {
                  event.currentTarget.open = false
                  setIsMapTypeOpen(false)
                  return
                }
                setIsMapTypeOpen(event.currentTarget.open)
              }}
            >
              <summary>
                <span>{t.mapType}</span>
                <button
                  type="button"
                  className="section-lock-btn"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsMapTypeLocked((prev) => !prev)
                  }}
                  aria-label={isMapTypeLocked ? 'unlock section' : 'lock section'}
                  title={isMapTypeLocked ? 'Разблокировать' : 'Заблокировать'}
                >
                  {isMapTypeLocked ? '🔒' : '🔓'}
                </button>
              </summary>
              <div className="nested-body">
                <div className="radio-row">
                  <label className="inline-option">
                    <input
                      type="radio"
                      name="mapType"
                      checked={mapType === 'continent'}
                      onChange={() => setMapType('continent')}
                      disabled={isMapTypeLocked}
                      title={t.hints.mapTypeContinent}
                    />
                    {t.continentType}
                  </label>
                  <label className="inline-option">
                    <input
                      type="radio"
                      name="mapType"
                      checked={mapType === 'island'}
                      onChange={() => setMapType('island')}
                      disabled={isMapTypeLocked}
                      title={t.hints.mapTypeIsland}
                    />
                    {t.islandType}
                  </label>
                </div>
                {mapType === 'island' && (
                  <label>
                    {t.seaSettings}
                    <div className="sea-grid" title={t.hints.seaSettings}>
                      <label className="inline-option">
                        <input
                          type="checkbox"
                          checked={seaSides.left}
                          onChange={(e) => setSeaSides((prev) => ({ ...prev, left: e.target.checked }))}
                          disabled={isMapTypeLocked}
                        />
                        {t.sideLeft}
                      </label>
                      <label className="inline-option">
                        <input
                          type="checkbox"
                          checked={seaSides.top}
                          onChange={(e) => setSeaSides((prev) => ({ ...prev, top: e.target.checked }))}
                          disabled={isMapTypeLocked}
                        />
                        {t.sideTop}
                      </label>
                      <label className="inline-option">
                        <input
                          type="checkbox"
                          checked={seaSides.right}
                          onChange={(e) => setSeaSides((prev) => ({ ...prev, right: e.target.checked }))}
                          disabled={selectedCanon === 'west-postros' || isMapTypeLocked}
                        />
                        {t.sideRight}
                      </label>
                      <label className="inline-option">
                        <input
                          type="checkbox"
                          checked={seaSides.bottom}
                          onChange={(e) => setSeaSides((prev) => ({ ...prev, bottom: e.target.checked }))}
                          disabled={isMapTypeLocked}
                        />
                        {t.sideBottom}
                      </label>
                    </div>
                  </label>
                )}
              </div>
            </details>
            <details className="nested-section" open>
              <summary>{t.islandFalloff}</summary>
              <div className="nested-body">
                <label>
                  {t.islandFalloff}: {islandFalloff.toFixed(2)}
                  <input
                    type="range"
                    min="0.8"
                    max="3.2"
                    step="0.1"
                    value={islandFalloff}
                    onChange={(e) => setIslandFalloff(Number(e.target.value))}
                    title={t.hints.islandFalloff}
                  />
                </label>
              </div>
            </details>
            <details className="nested-section" open>
              <summary>{t.biomes}</summary>
              <div className="nested-body biomes-tree">
                <details className="nested-section" open>
                  <summary>{t.macroRegions}</summary>
                  <div className="nested-body">
                    {selectedCanon === 'west-postros' && language === 'ru' ? (
                      <>
                        <details className="nested-section macro-subsection" open>
                          <summary>{t.landMacroRegions}</summary>
                          <div className="nested-body">
                            <ul className="plain-list">
                              {WEST_POSTROS_MACROREGIONS_RU.map((region) => (
                                <li key={region.id}>
                                  <span className="biome-item biome-inline-info">
                                    <span className="biome-name">{formatLabelWithCode(region.name, '-', showInternalCodes)}</span>
                                    <InfoButton onClick={() => openInfo(formatLabelWithCode(region.name, '-', showInternalCodes), '')} />
                                  </span>
                                  <div className="list-row spawn-row-controls macro-region-controls">
                                    <SettingsButton onClick={() => openInfo(formatLabelWithCode(region.name, '-', showInternalCodes), '')} />
                                    <button
                                      type="button"
                                      className="biome-lock-btn"
                                      onClick={() => toggleLandMacroLock(region.id, !landMacroLocked[region.id])}
                                      title={landMacroLocked[region.id] ? 'Снять фиксацию' : 'Зафиксировать'}
                                      aria-label={landMacroLocked[region.id] ? 'unlock land macro region' : 'lock land macro region'}
                                    >
                                      {landMacroLocked[region.id] ? '🔒' : '🔓'}
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                        <details className="nested-section macro-subsection" open>
                          <summary>{t.waterMacroRegions}</summary>
                          <div className="nested-body">
                            <ul className="plain-list">
                              {WEST_POSTROS_WATER_MACROREGIONS_RU.map((region) => (
                                <li key={region.id}>
                                  <span className="biome-item biome-inline-info">
                                    <i style={{ background: region.color }} />
                                    <span className="biome-name">{formatLabelWithCode(region.name, '-', showInternalCodes)}</span>
                                    <InfoButton onClick={() => openInfo(formatLabelWithCode(region.name, '-', showInternalCodes), '')} />
                                  </span>
                                  <div className="list-row spawn-row-controls macro-region-controls">
                                    <SettingsButton onClick={() => openInfo(formatLabelWithCode(region.name, '-', showInternalCodes), '')} />
                                    <button
                                      type="button"
                                      className="biome-lock-btn"
                                      onClick={() => toggleWaterMacroLock(region.id, !waterMacroLocked[region.id])}
                                      title={waterMacroLocked[region.id] ? 'Снять фиксацию' : 'Зафиксировать'}
                                      aria-label={waterMacroLocked[region.id] ? 'unlock water macro region' : 'lock water macro region'}
                                    >
                                      {waterMacroLocked[region.id] ? '🔒' : '🔓'}
                                    </button>
                                  </div>
            </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </>
                    ) : (
                      <details className="nested-section macro-subsection" open>
                        <summary>{t.landMacroRegions}</summary>
                        <div className="nested-body">
                          <ul className="plain-list">
                            {(worldStructure.macroRegions ?? []).map((region) => (
                              <li key={region.id}>
                                {formatLabelWithCode(normalizeLegacyMacroRegionName(region, language), '-', showInternalCodes)}
            </li>
                            ))}
          </ul>
        </div>
                      </details>
                    )}
                    <details className="nested-section" open>
                      <summary>{t.microRegions}</summary>
                      <div className="nested-body">
                        <details className="nested-section" open>
                          <summary>{t.biomesNode}</summary>
                          <div className="nested-body">
                            <details className="nested-section" open>
                              <summary>{t.mainBiomes}</summary>
                              <div className="nested-body">
                                <ul className="plain-list">
                                      <li>
                                        <div className="list-row biome-spawn-row">
                                              <input
                                                type="checkbox"
                                                aria-hidden="true"
                                                checked={false}
                                                disabled
                                                style={{ visibility: 'hidden' }}
                                              />
                                          <span className="biome-item no-color-indicator">{t.unallocatedPercent}</span>
                                          <div className="list-row spawn-row-controls">
                                            <span className="spawn-percent">{formatPercent(unallocatedBiomePercent)}</span>
                                          </div>
                                        </div>
                                      </li>
                                      {selectedCanon === 'west-postros' ? WEST_POSTROS_CONTENT_BIOMES.map((biome) => (
                                        <li key={biome.id}>
                                          <div className="list-row biome-spawn-row">
                                            <input
                                              type="checkbox"
                                              checked={Boolean(biomeEnabled[biome.id])}
                                              onChange={(e) => toggleBiomeEnabled(biome.id, e.target.checked)}
                                              aria-label={`spawn ${biome.id}`}
                                            />
                                              <span
                                                className={`biome-item biome-inline-info ${(biomeCoveragePercent[biome.id] ?? 0) === 0 ? 'zero-spawn' : ''}`}
                                              >
                                              <i style={{ background: biome.color }} />
                                                <span className="biome-name">{formatLabelWithCode(localizeName(biome, language), biome.id, showInternalCodes)}</span>
                                                <InfoButton onClick={() => openInfo(formatLabelWithCode(localizeName(biome, language), biome.id, showInternalCodes), biome.info)} />
                                            </span>
                                            <div className="list-row spawn-row-controls">
                                              <SettingsButton onClick={() => openBiomeSettings(biome.id)} />
                                              <span className="spawn-percent">{formatPercent(biomeCoveragePercent[biome.id] ?? 0)}</span>
                                              <button
                                                type="button"
                                                className="biome-lock-btn"
                                                onClick={() => toggleBiomeLock(biome.id, !biomeLocked[biome.id])}
                                                title={biomeLocked[biome.id] ? 'Снять фиксацию' : 'Зафиксировать процент'}
                                                aria-label={biomeLocked[biome.id] ? 'unlock biome percent' : 'lock biome percent'}
                                              >
                                                {biomeLocked[biome.id] ? '🔒' : '🔓'}
                                              </button>
                                            </div>
                                          </div>
                                          {biome.microBiomes?.length ? (
                                            <details className="nested-section" open>
                                              <summary>{biome.id === 'b2' ? t.untouchedRegionsSubBiomes : t.subBiomes}</summary>
                                              <div className="nested-body">
                                                <ul className="plain-list">
                                                  {biome.microBiomes.map((micro) => (
                                                    <li key={micro.id} className="micro-biome-row">
                                                      <input
                                                        type="checkbox"
                                                        checked={Boolean(microBiomeEnabled[`${biome.id}:${micro.id}`])}
                                                        onChange={(e) => toggleMicroBiomeEnabled(`${biome.id}:${micro.id}`, e.target.checked)}
                                                        aria-label={`spawn ${micro.id}`}
                                                      />
                                                      <span
                                                        className={`biome-item micro-biome-item ${
                                                          biome.id === 'b2' ? 'biome-inline-info' : ''
                                                        } ${(microBiomeCoveragePercent[`${biome.id}:${micro.id}`] ?? 0) === 0 ? 'zero-spawn' : ''}`}
                                                      >
                                                        <i style={{ background: micro.color ?? biome.color }} />
                                                        {biome.id === 'b2' ? (
                                                          <>
                                                            <span className="biome-name">
                                                              {formatLabelWithCode(
                                                                localizeName(micro, language),
                                                                micro.id,
                                                                showInternalCodes,
                                                              )}
                                                            </span>
                                                            <InfoButton
                                                              onClick={() =>
                                                                openInfo(
                                                                  formatLabelWithCode(localizeName(micro, language), micro.id, showInternalCodes),
                                                                  micro.info,
                                                                )
                                                              }
                                                            />
                                                          </>
                                                        ) : (
                                                          formatLabelWithCode(localizeName(micro, language), micro.id, showInternalCodes)
                                                        )}
                                                      </span>
                                                      <div className="list-row spawn-row-controls">
                                                        <SettingsButton onClick={() => openMicroBiomeSettings(biome.id, micro.id)} />
                                                        {biome.id === 'b2' ? null : (
                                                          <InfoButton
                                                            onClick={() =>
                                                              openInfo(
                                                                formatLabelWithCode(localizeName(micro, language), micro.id, showInternalCodes),
                                                                micro.info,
                                                              )
                                                            }
                                                          />
                                                        )}
                                                        <span className="spawn-percent">{formatPercent(microBiomeCoveragePercent[`${biome.id}:${micro.id}`] ?? 0)}</span>
                                                        <button
                                                          type="button"
                                                          className="biome-lock-btn"
                                                          onClick={() => toggleMicroBiomeLock(`${biome.id}:${micro.id}`, !microBiomeLocked[`${biome.id}:${micro.id}`])}
                                                          title={microBiomeLocked[`${biome.id}:${micro.id}`] ? 'Снять фиксацию' : 'Зафиксировать процент'}
                                                          aria-label={microBiomeLocked[`${biome.id}:${micro.id}`] ? 'unlock micro biome percent' : 'lock micro biome percent'}
                                                        >
                                                          {microBiomeLocked[`${biome.id}:${micro.id}`] ? '🔒' : '🔓'}
                                                        </button>
                                                      </div>
            </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </details>
                                          ) : null}
            </li>
                                      )) : null}
          </ul>
                              </div>
                            </details>
                            <details className="nested-section shores-section" open>
                              <summary>{t.shores}</summary>
                              <div className="nested-body">
                                <ul className="plain-list">
                                  {selectedCanon === 'west-postros'
                                    ? WEST_POSTROS_SHORE_BIOMES.map((shore) => {
                                        const shoreName = localizeName(shore, language)
                                        return (
                                        <li key={shoreName}>
                                          <div className="list-row biome-spawn-row">
                                            <input
                                              type="checkbox"
                                              checked={Boolean(shoreEnabled[shore.id])}
                                              onChange={(e) => toggleShoreEnabled(shore.id, e.target.checked)}
                                              aria-label={`spawn ${shore.id}`}
                                            />
                                            <span
                                              className={`biome-item biome-inline-info ${
                                                (shoreCoveragePercent[shore.id] ?? 0) === 0 ? 'zero-spawn' : ''
                                              }`}
                                            >
                                              <i style={{ background: shore.color }} />
                                              <span className="biome-name">{formatLabelWithCode(shoreName, '-', showInternalCodes)}</span>
                                              <InfoButton onClick={() => openInfo(formatLabelWithCode(shoreName, '-', showInternalCodes), '')} />
                                            </span>
                                            <div className="list-row spawn-row-controls">
                                              <SettingsButton onClick={() => openShoreSettings(shore.id)} />
                                              <span className="spawn-percent">{formatPercent(shoreCoveragePercent[shore.id] ?? 0)}</span>
                                              <button
                                                type="button"
                                                className="biome-lock-btn"
                                                onClick={() => toggleShoreLock(shore.id, !shoreLocked[shore.id])}
                                                title={shoreLocked[shore.id] ? 'Снять фиксацию' : 'Зафиксировать процент'}
                                                aria-label={shoreLocked[shore.id] ? 'unlock shore percent' : 'lock shore percent'}
                                              >
                                                {shoreLocked[shore.id] ? '🔒' : '🔓'}
                                              </button>
                                            </div>
                                          </div>
                                          {shore.microBiomes?.length ? (
                                            <details className="nested-section" open>
                                              <summary>{t.southShoreMicroBiomes}</summary>
                                              <div className="nested-body">
                                                <ul className="plain-list">
                                                  {shore.microBiomes.map((micro) => (
                                                    <li key={localizeName(micro, language)} className="micro-biome-row">
                                                      <input
                                                        type="checkbox"
                                                        checked={Boolean(shoreMicroEnabled[`${shore.id}:${micro.id}`])}
                                                        onChange={(e) => toggleShoreMicroEnabled(`${shore.id}:${micro.id}`, e.target.checked)}
                                                        aria-label={`spawn ${micro.id}`}
                                                      />
                                                      <span
                                                        className={`biome-item biome-inline-info micro-biome-item ${
                                                          (shoreMicroCoveragePercent[`${shore.id}:${micro.id}`] ?? 0) === 0 ? 'zero-spawn' : ''
                                                        }`}
                                                      >
                                                        <i style={{ background: micro.color ?? shore.color }} />
                                                        <span className="biome-name">
                                                          {formatLabelWithCode(
                                                            localizeName(micro, language),
                                                            showInternalCodes ? '' : micro.id,
                                                            showInternalCodes,
                                                          )}
                                                        </span>
                                                        <InfoButton
                                                          onClick={() =>
                                                            openInfo(
                                                              formatLabelWithCode(
                                                                localizeName(micro, language),
                                                                showInternalCodes ? '' : micro.id,
                                                                showInternalCodes,
                                                              ),
                                                              '',
                                                            )
                                                          }
                                                        />
                                                      </span>
                                                      <div className="list-row spawn-row-controls">
                                                        <SettingsButton onClick={() => openShoreMicroSettings(shore.id, micro.id)} />
                                                        <span className="spawn-percent">{formatPercent(shoreMicroCoveragePercent[`${shore.id}:${micro.id}`] ?? 0)}</span>
                                                        <button
                                                          type="button"
                                                          className="biome-lock-btn"
                                                          onClick={() => toggleShoreMicroLock(`${shore.id}:${micro.id}`, !shoreMicroLocked[`${shore.id}:${micro.id}`])}
                                                          title={shoreMicroLocked[`${shore.id}:${micro.id}`] ? 'Снять фиксацию' : 'Зафиксировать процент'}
                                                          aria-label={shoreMicroLocked[`${shore.id}:${micro.id}`] ? 'unlock shore micro percent' : 'lock shore micro percent'}
                                                        >
                                                          {shoreMicroLocked[`${shore.id}:${micro.id}`] ? '🔒' : '🔓'}
                                                        </button>
                                                      </div>
            </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </details>
                                          ) : null}
            </li>
                                      )})
                                    : null}
                                </ul>
                              </div>
                            </details>
                          </div>
                        </details>
                      </div>
                    </details>
                  </div>
                </details>
              </div>
            </details>
          </CollapsibleSection>
        </div>
        <div className="buttons">
          <button onClick={regenerate} title={t.hints.generate}>{t.generate}</button>
          <button onClick={randomizeSeed} title={t.hints.randomSeed}>{t.randomSeed}</button>
        </div>
      </section>
      <section className="map-wrap">
        <div
          ref={viewportRef}
          className={`map-viewport ${isViewportPanning ? 'panning' : ''}`}
          onPointerDown={startViewportPan}
          onPointerMove={moveViewportPan}
          onPointerUp={endViewportPan}
          onPointerCancel={stopViewportPan}
          onLostPointerCapture={stopViewportPan}
          style={{
            aspectRatio: `${Math.max(1, width)} / ${Math.max(1, height)}`,
          }}
        >
          <div
            ref={mapCanvasRef}
            className="map-canvas"
          >
            <div
              className="map"
              style={{
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
              }}
            >
              {world.colorMap.flat().map((color, idx) => (
                <div key={idx} style={{ background: color }} />
              ))}
            </div>
            {showMetricGrid ? (
              <div
                className="map-metric-grid-layer"
                style={metricGridLayerStyle(mapWidthMeters, mapHeightMeters, viewportZoom)}
                aria-hidden
              />
            ) : null}
          </div>
          <div className="map-zoom-controls">
            <button type="button" className="map-zoom-btn" onClick={zoomIn} title={t.hints.zoomIn}>+</button>
            <button type="button" className="map-zoom-btn" onClick={zoomOut} title={t.hints.zoomOut}>-</button>
            <label className="map-zoom-slider" title={t.hints.zoomLevel}>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.01"
                value={viewportZoom}
                onChange={(event) => setViewportZoom(clampZoom(Number(event.target.value)))}
              />
              <span className="map-zoom-value">{Math.round(viewportZoom * 100)}%</span>
            </label>
          </div>
        </div>
        <div className="poi-list">
          <details className="report-block">
            <summary>{t.reportTitle}</summary>
            <p>{reportText}</p>
          </details>
        </div>
      </section>
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        content={infoModal.content}
        fallbackText={t.infoMissing}
        onClose={() => setInfoModal({ open: false, title: '', content: '' })}
      />
      <BiomeSettingsModal
        open={Boolean(activeSettingsBiome)}
        title={activeSettingsBiome ? `${t.biomeSettings}: ${formatLabelWithCode(localizeName(activeSettingsBiome, language), activeSettingsBiome.id, showInternalCodes)}` : ''}
        coveragePercent={activeSettingsBiome ? biomeCoveragePercent[activeSettingsBiome.id] ?? 0 : 0}
        coverageSquareMeters={Math.round(
          totalIslandAreaSquareMeters * (((activeSettingsBiome ? biomeCoveragePercent[activeSettingsBiome.id] : 0) ?? 0) / 100),
        ).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
        percentLabel={t.biomeCoveragePercent}
        squareMetersLabel={t.biomeCoverageSquareMeters}
        onChangePercent={(value) => {
          if (!activeSettingsBiome) return
          setBiomeCoverage(activeSettingsBiome.id, value)
        }}
        onClose={() => setSettingsBiomeId(null)}
      />
      <BiomeSettingsModal
        open={Boolean(activeSettingsShore)}
        title={activeSettingsShore ? `${t.biomeSettings}: ${formatLabelWithCode(localizeName(activeSettingsShore, language), '-', showInternalCodes)}` : ''}
        coveragePercent={activeSettingsShore ? shoreCoveragePercent[activeSettingsShore.id] ?? 0 : 0}
        coverageSquareMeters={Math.round(
          totalIslandAreaSquareMeters * (((activeSettingsShore ? shoreCoveragePercent[activeSettingsShore.id] : 0) ?? 0) / 100),
        ).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
        percentLabel={t.biomeCoveragePercent}
        squareMetersLabel={t.biomeCoverageSquareMeters}
        onChangePercent={(value) => {
          if (!activeSettingsShore) return
          setShoreCoverage(activeSettingsShore.id, value)
        }}
        onClose={() => setSettingsShoreId(null)}
      />
      <MicroBiomeSettingsModal
        open={Boolean(activeMicroBiomeSettings)}
        title={
          activeMicroBiomeSettings
            ? `${t.microBiomeSettings}: ${formatLabelWithCode(localizeName(activeMicroBiomeSettings.micro, language), activeMicroBiomeSettings.micro.id, showInternalCodes)}`
            : ''
        }
        coveragePercent={
          activeMicroBiomeSettings ? microBiomeCoveragePercent[activeMicroBiomeSettings.key] ?? 0 : 0
        }
        coverageSquareMeters={Math.round(
          totalIslandAreaSquareMeters *
            (((activeMicroBiomeSettings ? biomeCoveragePercent[activeMicroBiomeSettings.biomeId] : 0) ?? 0) / 100) *
            (((activeMicroBiomeSettings ? microBiomeCoveragePercent[activeMicroBiomeSettings.key] : 0) ?? 0) / 100),
        ).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
        percentLabel={t.microBiomeSpawnPercent}
        squareMetersLabel={t.microBiomeSpawnSquareMeters}
        onChangePercent={(value) => {
          if (!activeMicroBiomeSettings) return
          setMicroBiomeCoverage(activeMicroBiomeSettings.key, value)
        }}
        onClose={() => setSettingsMicroBiomeKey(null)}
      />
      <MicroBiomeSettingsModal
        open={Boolean(activeShoreMicroSettings)}
        title={
          activeShoreMicroSettings
            ? `${t.microBiomeSettings}: ${formatLabelWithCode(localizeName(activeShoreMicroSettings.micro, language), activeShoreMicroSettings.micro.id, showInternalCodes)}`
            : ''
        }
        coveragePercent={
          activeShoreMicroSettings ? shoreMicroCoveragePercent[activeShoreMicroSettings.key] ?? 0 : 0
        }
        coverageSquareMeters={Math.round(
          totalIslandAreaSquareMeters *
            (((activeShoreMicroSettings ? shoreCoveragePercent[activeShoreMicroSettings.shoreId] : 0) ?? 0) / 100) *
            (((activeShoreMicroSettings ? shoreMicroCoveragePercent[activeShoreMicroSettings.key] : 0) ?? 0) / 100),
        ).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
        percentLabel={t.microBiomeSpawnPercent}
        squareMetersLabel={t.microBiomeSpawnSquareMeters}
        onChangePercent={(value) => {
          if (!activeShoreMicroSettings) return
          setShoreMicroCoverage(activeShoreMicroSettings.key, value)
        }}
        onClose={() => setSettingsShoreMicroKey(null)}
      />
    </main>
  )
}

function HomePage({ language }) {
  const t = TEXT[language]
  return (
    <main className="home-page">
      <section className="home-card">
        <h1>{t.devHelp}</h1>
        <p>{t.devText}</p>
        <Link className="link-button primary" to="/editor" title={t.hints.goEditor}>
          {t.goEditor}
        </Link>
      </section>
    </main>
  )
}

function App() {
  const [language, setLanguage] = useState('ru')
  const toggleLanguage = () => setLanguage((v) => (v === 'ru' ? 'en' : 'ru'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage language={language} />} />
        <Route path="/editor" element={<EditorPage language={language} onToggleLanguage={toggleLanguage} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
