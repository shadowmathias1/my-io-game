// ============================================

// GROW A GARDEN - Idle/Clicker Game

// Syst\u00E8me de march\u00E9 dynamique

// ============================================



// === DATA ===

const PLANTS = [
  // Début rapide pour donner l'impression de progression, puis ça ralentit
  { id: 'grass', name: 'Herbe', cost: 5, growTime: 5, yield: 8, unlock: 0, rarity: 1, category: 'plante', size: 1 },

  { id: 'flower', name: 'Fleur', cost: 15, growTime: 12, yield: 20, unlock: 50, rarity: 0.8, category: 'plante', size: 1 },

  { id: 'carrot', name: 'Carotte', cost: 40, growTime: 25, yield: 50, unlock: 200, rarity: 0.6, category: 'legume', size: 1 },

  { id: 'strawberry', name: 'Fraise', cost: 100, growTime: 40, yield: 130, unlock: 600, rarity: 0.4, category: 'fruit', size: 1 },

  { id: 'corn', name: 'Mais', cost: 250, growTime: 60, yield: 320, unlock: 1500, rarity: 0.3, category: 'legume', size: 2, orientation: 'vertical' },

  { id: 'watermelon', name: 'Pasteque', cost: 600, growTime: 90, yield: 780, unlock: 4000, rarity: 0.2, category: 'fruit', size: 2, orientation: 'horizontal' },

  { id: 'pumpkin', name: 'Citrouille', cost: 1500, growTime: 120, yield: 2000, unlock: 8000, rarity: 0.15, category: 'legume', size: 4, orientation: 'square' },

  { id: 'herb', name: 'Herbes', cost: 60, growTime: 22, yield: 80, unlock: 300, rarity: 0.7, category: 'plante', size: 1 },

  { id: 'lavender', name: 'Lavande', cost: 100, growTime: 30, yield: 140, unlock: 500, rarity: 0.6, category: 'plante', size: 1 },

  { id: 'sunflower', name: 'Tournesol', cost: 180, growTime: 45, yield: 280, unlock: 1000, rarity: 0.45, category: 'plante', size: 2, orientation: 'vertical' },

  { id: 'blueberry', name: 'Myrtille', cost: 200, growTime: 45, yield: 300, unlock: 1200, rarity: 0.45, category: 'fruit', size: 1 },

  { id: 'orange', name: 'Orange', cost: 400, growTime: 65, yield: 580, unlock: 2000, rarity: 0.35, category: 'fruit', size: 1 },

  { id: 'peach', name: 'Peche', cost: 700, growTime: 90, yield: 1000, unlock: 3500, rarity: 0.28, category: 'fruit', size: 2, orientation: 'horizontal' },

  { id: 'tomato', name: 'Tomate', cost: 150, growTime: 35, yield: 200, unlock: 700, rarity: 0.55, category: 'legume', size: 1 },

  { id: 'onion', name: 'Oignon', cost: 240, growTime: 50, yield: 340, unlock: 1200, rarity: 0.5, category: 'legume', size: 1 },

  { id: 'eggplant', name: 'Aubergine', cost: 500, growTime: 75, yield: 720, unlock: 2500, rarity: 0.35, category: 'legume', size: 2, orientation: 'vertical' },

];



const BUILDINGS = [

  { id: 'sprinkler', name: '\uD83D\uDCA7 Arrosoir', cost: 400, cps: 1, unlock: 200 },

  { id: 'greenhouse', name: '\uD83C\uDFE0 Serre', cost: 2500, cps: 5, unlock: 1500 },

  { id: 'auto_harvester', name: '\uD83E\uDD16 Auto-R\u00E9colteur', cost: 8000, cps: 15, unlock: 6000, special: 'automation' },

  { id: 'gardener', name: '\uD83D\uDC68\u200D\uD83C\uDF3E Jardinier', cost: 18000, cps: 30, unlock: 12000 },

  { id: 'watering_can', name: 'Arrosoir actif', cost: 1200, cps: 0, unlock: 600, special: 'active', desc: 'Reduit de 50% le temps de croissance' },

  { id: 'fertilizer', name: 'Engrais', cost: 2500, cps: 0, unlock: 1400, special: 'active', desc: '+50% rendement sur la prochaine recolte' },

  { id: 'green_lamp', name: 'Lampe UV', cost: 6000, cps: 0, unlock: 4000, special: 'active', desc: 'Croissance x2 pendant 20s' },

];



const PLACEABLE_BUILDING_CONFIG = {

  sprinkler: { size: 1 },

  greenhouse: { size: 4, orientation: 'square' },

  auto_harvester: { size: 2 },

  gardener: { size: 1 }

};



BUILDINGS.forEach(building => {

  if (PLACEABLE_BUILDING_CONFIG[building.id]) {

    Object.assign(building, { placeable: true }, PLACEABLE_BUILDING_CONFIG[building.id]);

  }

});



const CATEGORY_UNLOCKS = {

  plante: { cost: 0, unlocked: true },

  fruit: { cost: 2200, unlocked: false },

  legume: { cost: 4200, unlocked: false },

  buildings: { cost: 6200, unlocked: false },

  employees: { cost: 0, unlocked: true },

  nocturnal: { cost: 0, unlocked: true }

};



const GARDEN_UPGRADES = [

  { size: 4, cost: 1000, unlock: 500 },

  { size: 5, cost: 5000, unlock: 3000 },

  { size: 6, cost: 15000, unlock: 9000 },

  { size: 7, cost: 35000, unlock: 20000 },

  { size: 8, cost: 80000, unlock: 50000 },

];



const ACHIEVEMENTS = [

  { id: 'first_harvest', name: '\uD83C\uDF31 Premi\u00E8re R\u00E9colte', desc: 'R\u00E9colter votre premi\u00E8re plante', check: (s) => s.totalHarvests >= 1, reward: 5 },

  { id: 'harvest_10', name: '\uD83C\uDF3E Jardinier Amateur', desc: 'R\u00E9colter 10 plantes', check: (s) => s.totalHarvests >= 10, reward: 15 },

  { id: 'harvest_50', name: '\uD83C\uDF3B Jardinier Confirm\u00E9', desc: 'R\u00E9colter 50 plantes', check: (s) => s.totalHarvests >= 50, reward: 40 },

  { id: 'harvest_100', name: '\uD83C\uDF33 Ma\u00EEtre Jardinier', desc: 'R\u00E9colter 100 plantes', check: (s) => s.totalHarvests >= 100, reward: 80 },

  { id: 'coins_100', name: '\uD83D\uDCB0 Premi\u00E8re Fortune', desc: 'Atteindre 100 coins', check: (s) => s.lifetimeCoins >= 100, reward: 5 },

  { id: 'coins_1000', name: '\uD83D\uDC8E Riche', desc: 'Atteindre 1000 coins lifetime', check: (s) => s.lifetimeCoins >= 1000, reward: 20 },

  { id: 'coins_10000', name: '\uD83D\uDC51 Millionaire', desc: 'Atteindre 10000 coins lifetime', check: (s) => s.lifetimeCoins >= 10000, reward: 100 },

  { id: 'first_building', name: '\uD83C\uDFD7\uFE0F Premier Building', desc: 'Acheter votre premier building', check: (s) => Object.values(s.owned.buildings).reduce((a,b) => a+b, 0) >= 1, reward: 10 },

  { id: 'expand_garden', name: '\uD83D\uDCD0 Expansion', desc: 'Agrandir le jardin \u00E0 4x4', check: (s) => s.garden.size >= 4, reward: 25 },

  { id: 'watermelon', name: '\uD83C\uDF49 Luxe', desc: 'D\u00E9bloquer les past\u00E8ques', check: (s) => s.lifetimeCoins >= 5000, reward: 50 },

];



// Special plants - NEVER appear in shop, only from harvests/events

const SPECIAL_PLANTS = [

  {

    id: 'booster',

    name: '\uD83C\uDF1F Plante Booster',

    growTime: 20,

    yield: 5,

    special: 'booster',

    desc: '+20% rendement sur plantes adjacentes',

    size: 1,

    rarity: 0.005 // 0.5% chance on harvest

  },

  {

    id: 'fast',

    name: '\u26A1 Plante Rapide',

    growTime: 4,

    yield: 15,

    special: 'fast',

    desc: 'Pousse tr\u00E8s vite, ignore malus saison',

    size: 1,

    rarity: 0.01 // 1% chance

  },

  {

    id: 'prestige',

    name: '\uD83D\uDC51 Plante Prestige',

    growTime: 300, // 5 minutes

    yield: 2000,

    special: 'prestige',

    desc: 'Boost offline +50%, auto-r\u00E9colte',

    size: 2, // Takes 2 plots

    orientation: 'vertical', // or 'horizontal'

    rarity: 0.002 // 0.2% chance - ultra rare

  },

  {

    id: 'line_blocker',

    name: 'Root Wall',

    growTime: 45,

    yield: 10,

    special: 'line_blocker',

    desc: 'Blocks its row, boosts its column +50%',

    size: 1,

    rarity: 0.003 // 0.3% chance

  }

];



// Legendary plants - Appear temporarily in shop during special events

const LEGENDARY_PLANTS = [

  {

    id: 'golden_rose',

    name: '\uD83C\uDF39 Rose Dor\u00E9e',

    cost: 5000,

    growTime: 60,

    yield: 5000,

    special: 'legendary',

    desc: 'Plante l\u00E9gendaire! +100% rendement adjacent',

    size: 9,

    orientation: 'square', // 3x3

    category: 'legendary',

    eventChance: 0.15, // 15% chance per event check

    boostAdjacent: 2.0, // x2 yield for adjacent plants

    maxStock: 1 // Only 1 available per event

  },

  {

    id: 'rainbow_tree',

    name: '\uD83C\uDF08 Arbre Arc-en-ciel',

    cost: 15000,

    growTime: 180,

    yield: 20000,

    special: 'legendary',

    desc: 'Arbre magique! Donne des graines de toutes les plantes',

    size: 16,

    orientation: 'square', // 4x4

    category: 'legendary',

    eventChance: 0.10, // 10% chance

    seedsOnHarvest: true,

    maxStock: 1

  },

  {

    id: 'phoenix_flower',

    name: '\uD83D\uDD25 Fleur Phoenix',

    cost: 8000,

    growTime: 90,

    yield: 10000,

    special: 'legendary',

    desc: 'Se r\u00E9g\u00E9n\u00E8re automatiquement apr\u00E8s r\u00E9colte!',

    size: 9,

    orientation: 'square', // 3x3

    category: 'legendary',

    eventChance: 0.12, // 12% chance

    autoRespawn: true, // Respawns after harvest

    maxStock: 2 // 2 available

  },

  {

    id: 'time_lotus',

    name: '\u23F0 Lotus Temporel',

    cost: 12000,

    growTime: 30,

    yield: 8000,

    special: 'legendary',

    desc: 'Acc\u00E9l\u00E8re la croissance de tout le jardin x2',

    size: 9,

    orientation: 'square', // 3x3

    category: 'legendary',

    eventChance: 0.08, // 8% chance

    globalGrowthBoost: 2.0,

    maxStock: 1

  },

  {

    id: 'cosmic_cactus',

    name: '\u2728 Cactus Cosmique',

    cost: 20000,

    growTime: 240,

    yield: 50000,

    special: 'legendary',

    desc: 'Ultra rare! Triple tous les gains passifs',

    size: 9,

    orientation: 'square', // 3x3

    category: 'legendary',

    eventChance: 0.05, // 5% chance - ultra rare

    cpsMultiplier: 3.0,

    maxStock: 1

  }

];

const PLANT_EMOJIS = {
  grass: '\uD83C\uDF31',
  flower: '\uD83C\uDF38',
  herb: '\uD83C\uDF3F',
  lavender: '\uD83D\uDC90',
  sunflower: '\uD83C\uDF3B',
  carrot: '\uD83E\uDD55',
  tomato: '\uD83C\uDF45',
  onion: '\uD83E\uDDC5',
  corn: '\uD83C\uDF3D',
  eggplant: '\uD83C\uDF46',
  pumpkin: '\uD83C\uDF83',
  strawberry: '\uD83C\uDF53',
  blueberry: '\uD83E\uDED0',
  orange: '\uD83C\uDF4A',
  peach: '\uD83C\uDF51',
  watermelon: '\uD83C\uDF49',
  booster: '\uD83C\uDF1F',
  fast: '\u26A1',
  prestige: '\uD83D\uDC51',
  line_blocker: '\uD83E\uDEA8',
  golden_rose: '\uD83C\uDF39',
  rainbow_tree: '\uD83C\uDF08',
  phoenix_flower: '\uD83D\uDD25',
  time_lotus: '\u23F0',
  cosmic_cactus: '\u2728'
};



// Seasons system

const SEASONS = [

  {

    id: 'spring',

    name: '\uD83C\uDF38 Printemps',

    duration: 30 * 60 * 1000, // 30 minutes

    effects: {

      growthSpeed: 1.05, // +5% growth speed (réduit de 20%)

      specialChance: 1.02, // +2% special plant chance (réduit de 10%)

      yieldBonus: 1.0

    }

  },

  {

    id: 'summer',

    name: '\u2600\uFE0F \u00C9t\u00E9',

    duration: 30 * 60 * 1000,

    effects: {

      growthSpeed: 1.0,

      specialChance: 1.0,

      yieldBonus: 1.05, // +5% yield (réduit de 15%)

      bonusPlants: ['watermelon', 'strawberry'],

      seasonalSeeds: [{ id: 'watermelon', chance: 0.001, amount: 1 }] // Réduit de 0.005
    }

  },

  {

    id: 'autumn',

    name: '\uD83C\uDF42 Automne',

    duration: 30 * 60 * 1000,

    effects: {

      growthSpeed: 0.85, // -15% speed (augmenté le malus)

      specialChance: 1.0,

      yieldBonus: 1.08, // +8% yield (réduit de 25%)

    }

  },

  {

    id: 'winter',

    name: '\u2744\uFE0F Hiver',

    duration: 30 * 60 * 1000,

    effects: {

      growthSpeed: 0.6, // -40% speed (augmenté le malus)

      specialChance: 1.0,

      yieldBonus: 0.4, // -60% yield for regular plants (augmenté le malus)

      categoryYield: { fruit: 0.4, legume: 0.4 },

      prestigeBoost: 1.3, // x1.3 for prestige plants (réduit de x2)

      fastPlantBoost: 1.15 // +15% for fast plants (réduit de +50%)

    }

  }

];



const WEATHER_TYPES = [

  { id: 'sun', name: 'Soleil', desc: 'Croissance +20%', growth: 0.8 },

  { id: 'rain', name: 'Pluie', desc: 'Croissance +35%', growth: 0.65 },

  { id: 'cloud', name: 'Nuages', desc: 'Rendement -10%', yield: 0.9 },

  { id: 'storm', name: 'Orage', desc: 'Rendement -15%', yield: 0.85 },

  { id: 'frost', name: 'Gel', desc: 'Croissance -25%', growth: 1.25, frost: true }

];





const SEASONAL_EVENTS = {

  spring: [

    { id: 'spring_bloom', name: 'Eclosion', type: 'growth_boost', duration: 60 * 1000, desc: 'Croissance acceleree' }

  ],

  summer: [

    { id: 'summer_festival', name: 'Festival', type: 'harvest_boost', duration: 60 * 1000, desc: 'Recoltes x2' }

  ],

  autumn: [

    { id: 'autumn_bounty', name: 'Abondance', type: 'harvest_boost', duration: 75 * 1000, desc: 'Recoltes x2' }

  ],

  winter: [

    { id: 'winter_spark', name: 'Eclaircie', type: 'growth_boost', duration: 60 * 1000, desc: 'Croissance acceleree' }

  ]

};



const MARKET_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const OFFLINE_MAX_SECONDS = 3600 * 24; // 24h max d'absence prise en compte
const ADMIN_CODE = '1234';
const ADMIN_UNLOCK_KEY = 'garden_admin_unlocked_v2';

const WEEKLY_REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000;

const SCORE_STORAGE_KEY = 'garden_scores_v2';

const SEED_CODE_PREFIX = 'GARDEN2';

const PRESTIGE = {

  baseCost: 50000,

  costMultiplier: 2,

  bonusPerLevel: 0.05

};

const MIN_STOCK = 2;

const MAX_STOCK = 8;

const THEME_STORAGE_KEY = 'garden_theme_v2';



// Daily Calendar Rewards (7 days streak)

const ACTIVE_BUILDINGS = [

  { id: 'watering_can', name: 'Arrosage', desc: 'Reduit de 50% le temps de croissance', duration: 0, cooldown: 180, effect: 'water' },

  { id: 'fertilizer', name: 'Engrais', desc: '+50% rendement sur la prochaine recolte', duration: 0, cooldown: 240, effect: 'fertilize' },

  { id: 'green_lamp', name: 'Lampe UV', desc: 'Croissance x2 pendant 20s', duration: 20, cooldown: 300, effect: 'boost' }

];



const DAILY_REWARDS = [

  {

    day: 1,

    coins: 15,

    seeds: 1,

    icon: '\uD83C\uDF81',

    desc: 'Bonus de bienvenue'

  },

  {

    day: 2,

    coins: 25,

    seeds: 2,

    icon: '\uD83C\uDF81',

    desc: 'Continue comme ca!'

  },

  {

    day: 3,

    coins: 40,

    seeds: 2,

    icon: '\uD83C\uDF81',

    desc: 'Bien joue!'

  },

  {

    day: 4,

    coins: 60,

    seeds: 3,

    icon: '\uD83D\uDC8E',

    desc: 'Tu es devoue!'

  },

  {

    day: 5,

    coins: 80,

    seeds: 3,

    icon: '\uD83D\uDC8E',

    desc: 'Presque la!'

  },

  {

    day: 6,

    coins: 100,

    seeds: 4,

    icon: '\uD83D\uDC8E',

    desc: 'Un jour de plus!'

  },

  {

    day: 7,

    coins: 200,

    seeds: 5,

    specialPlant: true,

    icon: '\uD83D\uDC51',

    desc: 'Plante speciale garantie!'

  }

];



// === STATE ===

let state = {

  coins: 30,

  lifetimeCoins: 0,

  totalHarvests: 0,

  cps: 0,

  garden: {

    size: 3,

    plots: []

  },

  owned: {

    plants: {},

    buildings: {}

  },

  buildingInventory: {},

  placedBuildings: [],

  selectedBuilding: null,

  pendingBuildingRemoval: null,
  pendingPlantRemoval: null,

  seeds: {

    grass: 3  // Start avec 3 graines d'herbe

  },

  market: {

    lastRefresh: Date.now(),

    nextRefresh: Date.now() + MARKET_REFRESH_INTERVAL,

    stock: {},

    buildingStock: {},

    priceModifiers: {},

    weekly: {

      itemId: null,

      type: null,

      discount: 1,

      stock: 0,

      nextRotation: Date.now() + WEEKLY_REFRESH_INTERVAL

    }

  },

  legendaryEvent: {

    active: false,

    plant: null, // Legendary plant currently in shop

    startTime: 0,

    endTime: 0,

    stock: 0, // Stock remaining for current event

    nextEventCheck: Date.now() + (10 * 60 * 1000) // Check every 10 minutes

  },

  selectedPlant: 'grass',

  selectedSpecialPlant: null, // null or special plant id when planting special plants

  unlockedPlants: {

    grass: true

  },

  categoryUnlocks: {

    plante: true,

    fruit: false,

    legume: false,

    buildings: false

  },

  combo: {

    count: 0,

    lastHarvest: 0,

    multiplier: 1

  },

  dailyBonus: {

    lastClaimed: 0,

    available: true

  },

  achievements: {

    unlocked: [],

    notified: []

  },

  achievementsFilter: 'all',

  collection: {

    plants: {},

    special: {},

    legendary: {},

    buildings: {}

  },

  usedSeedCodes: [],

  inventory: {
    harvests: {}, // { plantId: quantity }
    craftingMaterials: {}
  },

  unlockedRecipes: [],

  prestige: {

    level: 0,

    multiplier: 1

  },

  season: {

    current: 0, // Index in SEASONS array

    startTime: Date.now(),

    nextChange: Date.now() + SEASONS[0].duration

  },

  weather: {

    current: 'sun',

    startTime: Date.now(),

    nextChange: Date.now() + (5 * 60 * 1000)

  },

  activeEffects: {

    fertilize: 0,

    boostUntil: 0

  },

  activeBuildingCooldowns: {},

  activeBuildingPending: {},

  seasonalEvent: {

    active: false,

    type: null,

    name: '',

    desc: '',

    endTime: 0,

    nextCheck: Date.now() + (2 * 60 * 1000)

  },

  seasonHazard: {

    lastCheck: 0

  },

  specialPlants: {

    inventory: {} // Special plants in inventory (can't buy, only get from events)

  },

  autoHarvest: {

    lastRun: 0

  },

  dailyStreak: {

    current: 0, // Current day (0-7)

    lastClaim: 0, // Timestamp of last claim

    canClaim: true, // Can claim today?

    claimedDays: [] // Array of claimed days [1,2,3...]

  }

};



// Performance

let needsRender = true;

let lastRenderTime = 0;

let lastSeasonUpdate = 0;

let needsShopRender = true;

let lastCoinsForShop = null;

let nextShopUnlock = null;

let lastSeasonId = null;

let needsCalendarRender = true;

let lastWeeklyTimer = null;

let lastPrestigeUpdate = 0;

let uiCache = {

  coinsText: null,

  cpsText: null,

  seedsText: null,

  marketTimerText: null,

  gardenSizeText: null

};

let uiRefs = {};



function createEmptyPlot(newUntil = 0) {

  return {

    plantId: null,
    plantOrientation: null,

    buildingId: null,

    buildingMainPlotIndex: null,

    buildingIsMainPlot: false,

    buildingOrientation: null,

    plantedAt: null,

    growTime: null,

    ready: false,

    newUntil,

    lastTimer: null

  };

}



// === INIT ===

function init() {

  // Game initialization



  // Initialize dailyStreak if not exists

  if (!state.dailyStreak || !state.dailyStreak.claimedDays) {

    state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

  }



  // Check if we missed a day (reset streak if more than 24h since last claim)

  const now = Date.now();

  const oneDayMs = 24 * 60 * 60 * 1000;

  const twoDaysMs = 48 * 60 * 60 * 1000;



  if (state.dailyStreak.lastClaim > 0) {

    const timeSinceLastClaim = now - state.dailyStreak.lastClaim;



    // If more than 48 hours, reset completely

    if (timeSinceLastClaim > twoDaysMs) {

      state.dailyStreak.current = 0;

      state.dailyStreak.claimedDays = [];

      state.dailyStreak.canClaim = true;

    }

    // If more than 24 hours, can claim again

    else if (timeSinceLastClaim > oneDayMs) {

      state.dailyStreak.canClaim = true;

    }

  } else {

    // First time ever or corrupted save - force reset to allow claiming

    if (state.dailyStreak.current === 0 && !state.dailyStreak.canClaim) {

      state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

    }

    state.dailyStreak.canClaim = true;

  }



  // Create garden plots

  const plotCount = state.garden.size * state.garden.size;

  for (let i = 0; i < plotCount; i++) {

    state.garden.plots[i] = createEmptyPlot();

  }



  // Load save

  loadGame();

  // Initialize inventory system for new games
  if (typeof initializeInventorySystem === 'function') {
    initializeInventorySystem();
  }

  // Initialize employees system
  if (typeof initializeEmployeesSystem === 'function') {
    initializeEmployeesSystem();
  }

  // Initialize pests system
  if (typeof initializePestsSystem === 'function') {
    initializePestsSystem();
  }

  // Initialize new buildings system
  if (typeof initializeNewBuildings === 'function') {
    initializeNewBuildings();
  }

  // Merge new buildings
  if (typeof mergeBuildings === 'function') {
    mergeBuildings();
  }

  // Initialize customization system
  if (typeof initializeCustomizationSystem === 'function') {
    initializeCustomizationSystem();
  }

  // Initialize day/night system
  if (typeof initializeDayNightSystem === 'function') {
    initializeDayNightSystem();
  }

  normalizePlantPlots();

  loadTheme();

  // Apply customization
  if (typeof applyCustomization === 'function') {
    applyCustomization();
  }

  cacheUIRefs();



  initAdminPanel();



  // Generate initial market stock

  if (Object.keys(state.market.stock).length === 0) {

    refreshMarket();

  }

  ensureWeeklyOffer();



  // Setup event listeners

  document.getElementById('harvest-all').addEventListener('click', () => {

    harvestAll();

  });



  document.getElementById('save').addEventListener('click', () => {

    saveGame();

    showToast('\uD83D\uDCBE Sauvegard\u00E9 !');

  });



  document.getElementById('reset').addEventListener('click', resetGame);



  // Ancien bonus quotidien d\u00E9sactiv\u00E9 - voir calendrier en bas

  /*

  const dailyBonusBtn = document.getElementById('daily-bonus');

  if (dailyBonusBtn) {

    dailyBonusBtn.addEventListener('click', () => {

      claimDailyBonus();

    });

  } else {

  }

  */



  // Setup tabs

  document.querySelectorAll('.tab').forEach(tab => {

    tab.addEventListener('click', () => {

      const tabName = tab.dataset.tab;

      if (!state.categoryUnlocks[tabName]) {

        openCategoryUnlockModal(tabName);

        return;

      }

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

      document.querySelectorAll('.shop-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');

      document.getElementById(`shop-${tabName}`).classList.add('active');

    });

  });



  const unlockCancel = document.getElementById('category-unlock-cancel');

  if (unlockCancel) {

    unlockCancel.addEventListener('click', closeCategoryUnlockModal);

  }



  // Event delegation for shop plant buttons (for each category)

  ['plante', 'fruit', 'legume'].forEach(category => {

    const container = document.getElementById(`shop-${category}`);

    if (container) {

      container.addEventListener('click', (e) => {

        const btn = e.target.closest('.buy-plant-btn');

        if (btn) {

          const plantId = btn.dataset.plantId;

          if (plantId) {

            buyPlant(plantId);

          }

        }

      });

    }

  });



  // Event delegation for shop building buttons

  document.getElementById('shop-buildings').addEventListener('click', (e) => {

    const btn = e.target.closest('.buy-building-btn');

    if (btn) {

      const buildingId = btn.dataset.buildingId;

      if (buildingId) {

        buyBuilding(buildingId);

      }

    }

  });



  // Offline modal claim button

  document.getElementById('claim-offline').addEventListener('click', claimOfflineReward);



  // Achievements modal

  const achievementsBtn = document.getElementById('achievements-btn');

  if (achievementsBtn) {

    achievementsBtn.addEventListener('click', showAchievementsModal);

  }

  const closeAchievementsBtn = document.getElementById('close-achievements');

  if (closeAchievementsBtn) {

    closeAchievementsBtn.addEventListener('click', closeAchievementsModal);

  }



  // Daily Calendar modal

  const dailyCalendarBtn = document.getElementById('daily-calendar-btn');

  if (dailyCalendarBtn) {

    dailyCalendarBtn.addEventListener('click', openDailyCalendarModal);

  }

  const closeDailyCalendarBtn = document.getElementById('close-daily-calendar');

  if (closeDailyCalendarBtn) {

    closeDailyCalendarBtn.addEventListener('click', closeDailyCalendarModal);

  }



  // Settings modal

  const settingsBtn = document.getElementById('settings-btn');

  if (settingsBtn) {

    settingsBtn.addEventListener('click', openSettingsModal);

  }

  const closeSettingsBtn = document.getElementById('close-settings');

  if (closeSettingsBtn) {

    closeSettingsBtn.addEventListener('click', closeSettingsModal);

  }

  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {

    themeToggleBtn.addEventListener('click', toggleTheme);

  }

  const prestigeBtn = document.getElementById('prestige-btn');

  if (prestigeBtn) {

    prestigeBtn.addEventListener('click', openPrestigeModal);

  }

  const confirmPrestigeBtn = document.getElementById('confirm-prestige');

  if (confirmPrestigeBtn) {

    confirmPrestigeBtn.addEventListener('click', () => {

      applyPrestigeReset();

      closePrestigeModal();

    });

  }

  const cancelPrestigeBtn = document.getElementById('cancel-prestige');

  if (cancelPrestigeBtn) {

    cancelPrestigeBtn.addEventListener('click', closePrestigeModal);

  }



  const collectionBtn = document.getElementById('collection-btn');

  if (collectionBtn) {

    collectionBtn.addEventListener('click', openCollectionModal);

  }

  const closeCollectionBtn = document.getElementById('close-collection');

  if (closeCollectionBtn) {

    closeCollectionBtn.addEventListener('click', closeCollectionModal);

  }



  const socialBtn = document.getElementById('social-btn');

  if (socialBtn) {

    socialBtn.addEventListener('click', openSocialModal);

  }

  const closeSocialBtn = document.getElementById('close-social');

  if (closeSocialBtn) {

    closeSocialBtn.addEventListener('click', closeSocialModal);

  }



  const exportSaveBtn = document.getElementById('export-save');

  if (exportSaveBtn) {

    exportSaveBtn.addEventListener('click', exportSave);

  }

  const importSaveBtn = document.getElementById('import-save');

  if (importSaveBtn) {

    importSaveBtn.addEventListener('click', importSave);

  }

  const generateSeedBtn = document.getElementById('generate-seed-code');

  if (generateSeedBtn) {

    generateSeedBtn.addEventListener('click', generateSeedCode);

  }

  const redeemSeedBtn = document.getElementById('redeem-seed-code');

  if (redeemSeedBtn) {

    redeemSeedBtn.addEventListener('click', redeemSeedCode);

  }



  const confirmRemoveBuildingBtn = document.getElementById('confirm-remove-building');

  if (confirmRemoveBuildingBtn) {

    confirmRemoveBuildingBtn.addEventListener('click', () => {

      if (state.pendingBuildingRemoval !== null) {

        removeBuilding(state.pendingBuildingRemoval);

      }

      closeRemoveBuildingModal();

    });

  }

  const cancelRemoveBuildingBtn = document.getElementById('cancel-remove-building');

  if (cancelRemoveBuildingBtn) {

    cancelRemoveBuildingBtn.addEventListener('click', closeRemoveBuildingModal);

  }

  const confirmRemovePlantBtn = document.getElementById('confirm-remove-plant');
  if (confirmRemovePlantBtn) {
    confirmRemovePlantBtn.addEventListener('click', () => {
      if (state.pendingPlantRemoval !== null) {
        removePlant(state.pendingPlantRemoval);
      }
      closeRemovePlantModal();
    });
  }

  const cancelRemovePlantBtn = document.getElementById('cancel-remove-plant');
  if (cancelRemovePlantBtn) {
    cancelRemovePlantBtn.addEventListener('click', closeRemovePlantModal);
  }



  const weeklyOffer = document.getElementById('weekly-offer');

  if (weeklyOffer) {

    weeklyOffer.addEventListener('click', (e) => {

      const btn = e.target.closest('#buy-weekly');

      if (btn) buyWeeklyOffer();

    });

  }



  // Event delegation for view achievements button (dynamically created in stats)

  document.getElementById('stats').addEventListener('click', (e) => {

    if (e.target.id === 'view-achievements' || e.target.closest('#view-achievements')) {

      showAchievementsModal();

    }

  });



  // Start game loop

  setInterval(gameLoop, 100); // 10 FPS logic

  setInterval(saveGame, 15000); // Auto-save every 15s

  requestAnimationFrame(renderLoop);



  // Market refresh check

  setInterval(checkMarketRefresh, 1000);



  // Check daily bonus availability

  checkDailyBonus(); // Initial check

  setInterval(checkDailyBonus, 10000); // Check every 10s



  // Initial render

  fullRender();



  // Expose functions to global scope for onclick handlers

  window.claimDailyReward = claimDailyReward;

  window.closeAchievementsModal = closeAchievementsModal;

  window.openDailyCalendarModal = openDailyCalendarModal;

  window.closeDailyCalendarModal = closeDailyCalendarModal;



}



// === MARKET SYSTEM ===

function refreshMarket() {

  state.market.lastRefresh = Date.now();

  state.market.nextRefresh = Date.now() + MARKET_REFRESH_INTERVAL;

  state.market.stock = {};

  state.market.buildingStock = {};

  state.market.priceModifiers = { plants: {}, buildings: {} };



  PLANTS.forEach(plant => {

    // Rarity affects stock quantity

    const baseStock = Math.floor(MIN_STOCK + (MAX_STOCK - MIN_STOCK) * plant.rarity);

    const variance = Math.floor(Math.random() * 5) - 2; // -2 \u00E0 +2

    const stock = Math.max(1, baseStock + variance);



    state.market.stock[plant.id] = stock;

    state.market.priceModifiers.plants[plant.id] = 0.85 + Math.random() * 0.4;

  });



  BUILDINGS.forEach(building => {

    state.market.priceModifiers.buildings[building.id] = 0.9 + Math.random() * 0.35;

    if (building.special === 'active') {

      const stock = 1 + Math.floor(Math.random() * 2);

      state.market.buildingStock[building.id] = stock;

    }

  });



  showToast('\uD83D\uDED2 March\u00E9 rafra\u00EEchi !');

  needsRender = true;

  needsShopRender = true;

}



function checkMarketRefresh() {

  if (Date.now() >= state.market.nextRefresh) {

    refreshMarket();

  }

}



function getTimeUntilRefresh() {

  const remaining = Math.max(0, state.market.nextRefresh - Date.now());

  const minutes = Math.floor(remaining / 60000);

  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;

}



function getPriceModifier(type, id) {

  if (!state.market.priceModifiers) return 1;

  const group = state.market.priceModifiers[type] || {};

  return group[id] || 1;

}



function getPlantCost(plantId) {

  const plant = PLANTS.find(p => p.id === plantId);

  if (!plant) return 0;

  const owned = state.owned.plants[plantId] || 0;

  const modifier = getPriceModifier('plants', plantId);

  return Math.max(1, Math.floor(plant.cost * Math.pow(1.1, owned) * modifier));

}



function getBuildingCost(buildingId) {

  const building = BUILDINGS.find(b => b.id === buildingId);

  if (!building) return 0;

  const owned = state.owned.buildings[buildingId] || 0;

  const modifier = getPriceModifier('buildings', buildingId);

  return Math.max(1, Math.floor(building.cost * Math.pow(1.15, owned) * modifier));

}



function getModifierLabel(modifier) {

  if (modifier === 1) return '';

  const pct = Math.round((modifier - 1) * 100);

  if (modifier < 1) return `PROMO ${pct}%`;

  return `HAUSSE +${pct}%`;

}



function getPrestigeMultiplier(level) {

  return 1 + (level * PRESTIGE.bonusPerLevel);

}



function getPrestigeCost() {

  return Math.floor(PRESTIGE.baseCost * Math.pow(PRESTIGE.costMultiplier, state.prestige.level));

}



function canPrestige() {

  return state.lifetimeCoins >= getPrestigeCost();

}



function ensureWeeklyOffer() {

  if (!state.market.weekly) return;

  if (!state.market.weekly.itemId || Date.now() >= state.market.weekly.nextRotation) {

    refreshWeeklyOffer();

  }

}



function refreshWeeklyOffer() {

  const weeklyPool = [

    ...BUILDINGS.filter(b => b.special === 'active').map(b => ({ type: 'active', item: b })),

    ...SPECIAL_PLANTS.map(p => ({ type: 'special', item: p }))

  ];

  const pick = weeklyPool[Math.floor(Math.random() * weeklyPool.length)];

  const discount = 0.6 + Math.random() * 0.25;

  const stock = pick.type === 'special' ? 1 : 2;



  state.market.weekly = {

    itemId: pick.item.id,

    type: pick.type,

    discount,

    stock,

    nextRotation: Date.now() + WEEKLY_REFRESH_INTERVAL

  };

}



function getWeeklyPrice() {

  if (!state.market.weekly || !state.market.weekly.itemId) return 0;

  const weekly = state.market.weekly;

  let base = 0;

  if (weekly.type === 'special') {

    base = 3000;

  } else {

    const building = getBuildingById(weekly.itemId);

    base = building ? building.cost : 0;

  }

  return Math.max(1, Math.floor(base * weekly.discount));

}



function buyWeeklyOffer() {

  const weekly = state.market.weekly;

  if (!weekly || !weekly.itemId) return;

  if (weekly.stock <= 0) {

    showToast('Offre hebdo epuisee');

    return;

  }



  const price = getWeeklyPrice();

  if (state.coins < price) {

    showToast(`Requis: ${price} coins`);

    return;

  }



  if (weekly.type === 'special') {

    const special = SPECIAL_PLANTS.find(p => p.id === weekly.itemId);

    if (!special) return;

    state.specialPlants.inventory[special.id] =

      (state.specialPlants.inventory[special.id] || 0) + 1;

    markCollected('special', special.id);

    showToast(`Offre hebdo: ${special.name}`);

  } else {

    const building = getBuildingById(weekly.itemId);

    if (!building) return;

    state.owned.buildings[building.id] = (state.owned.buildings[building.id] || 0) + 1;

    markCollected('buildings', building.id);

    if (isPlaceableBuilding(building)) {

      state.selectedBuilding = building.id;

    }

    showToast(`Offre hebdo: ${building.name}`);

  }



  state.coins -= price;

  weekly.stock -= 1;

  needsShopRender = true;

  needsRender = true;

}



// === GAME LOOP ===

function gameLoop() {

  const now = Date.now();



  // Update CPS coins (plus lent)

  if (state.cps > 0) {

    state.coins += state.cps / 10;

    state.lifetimeCoins += state.cps / 10;

  }



  // Update garden growth

  let plotsChanged = false;

  state.garden.plots.forEach(plot => {

    if (plot.plantId && plot.plantedAt && !plot.ready) {

      const elapsed = (now - plot.plantedAt) / 1000;

      if (elapsed >= plot.growTime) {

        plot.ready = true;

        plotsChanged = true;

      }

    }

  });



  if (plotsChanged) {

    needsRender = true;

  }



  // Tick employees system
  if (typeof tickEmployees === 'function') {
    tickEmployees();
  }

  // Tick pests system
  if (typeof tickPests === 'function') {
    tickPests();
  }

  // Tick new buildings
  if (typeof tickNewBuildings === 'function') {
    tickNewBuildings();
  }

  // Tick day/night system
  if (typeof tickDayNight === 'function') {
    tickDayNight();
  }

  // Check achievements

  checkAchievements();



  // Check season change

  checkSeasonChange();



  // Seasonal events and hazards

  checkSeasonalEvent(now);

  checkWinterFrost(now);

  checkWeather(now);



  // Check daily streak

  checkDailyStreak();



  // Check legendary event

  checkLegendaryEvent();

}



// === SEASONS ===

function getCurrentSeason() {

  return SEASONS[state.season.current];

}



function checkWeather(now) {

  if (now >= state.weather.nextChange) {

    const next = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];

    state.weather.current = next.id;

    state.weather.startTime = now;

    state.weather.nextChange = now + (5 * 60 * 1000);

    showToast('Meteo: ' + next.name);

    needsRender = true;

  }

}



function checkSeasonChange() {

  const now = Date.now();

  if (now >= state.season.nextChange) {

    // Change to next season

    const oldSeason = SEASONS[state.season.current];

    state.season.current = (state.season.current + 1) % SEASONS.length;

    const newSeason = SEASONS[state.season.current];



    state.season.startTime = now;

    state.season.nextChange = now + newSeason.duration;



    // Show season change notification

    showSeasonChangeEvent(oldSeason, newSeason);

    needsRender = true;

  }

}



function showSeasonChangeEvent(oldSeason, newSeason) {

  // Create epic season change modal

  const body = document.body;

  const overlay = document.createElement('div');

  overlay.className = 'season-change-overlay';

  overlay.innerHTML = `

    <div class="season-change-content">

      <div class="season-change-icon">${newSeason.name.split(' ')[0]}</div>

      <h2>${newSeason.name}</h2>

      <p>La saison a chang\u00E9!</p>

      <div class="season-effects">

        ${newSeason.effects.growthSpeed !== 1.0 ?

          `<div>\u23F1\uFE0F Vitesse: ${(newSeason.effects.growthSpeed * 100 - 100).toFixed(0)}%</div>` : ''}

        ${newSeason.effects.yieldBonus !== 1.0 ?

          `<div>\uD83D\uDCB0 Rendement: ${(newSeason.effects.yieldBonus * 100 - 100).toFixed(0)}%</div>` : ''}

      </div>

      <button class="btn accent" onclick="this.parentElement.parentElement.remove()">Continuer</button>

    </div>

  `;

  body.appendChild(overlay);



  // Auto-remove after 5 seconds

  setTimeout(() => {

    if (overlay.parentElement) {

      overlay.remove();

    }

  }, 5000);

}



function applySeasonEffects(plantId, baseGrowTime, baseYield) {

  const season = getCurrentSeason();

  let growTime = baseGrowTime / (season.effects.growthSpeed || 1.0);

  let yieldAmount = baseYield * (season.effects.yieldBonus || 1.0);



  // Check for Time Lotus in garden (global growth speed boost)

  const hasTimeLotus = state.garden.plots.some(p => p.plantId === 'time_lotus' && p.ready);

  if (hasTimeLotus) {

    growTime /= 2.0; // x2 growth speed

  }



  // Check if this plant gets bonus in current season

  if (season.effects.bonusPlants && season.effects.bonusPlants.includes(plantId)) {

    yieldAmount *= 1.2; // +20% for seasonal bonus plants

  }



  const basePlant = PLANTS.find(p => p.id === plantId);

  if (basePlant && season.effects.categoryYield && season.effects.categoryYield[basePlant.category]) {

    yieldAmount *= season.effects.categoryYield[basePlant.category];

  }



  // Special plant effects

  const specialPlant = SPECIAL_PLANTS.find(p => p.id === plantId);

  if (specialPlant) {

    if (specialPlant.special === 'fast') {

      // Fast plants ignore growth penalties

      if (season.effects.fastPlantBoost) {

        yieldAmount *= season.effects.fastPlantBoost;

      }

      growTime = baseGrowTime; // Ignore season penalties

    } else if (specialPlant.special === 'prestige' && season.effects.prestigeBoost) {

      yieldAmount *= season.effects.prestigeBoost;

    }

  }



  if (state.seasonalEvent.active && state.seasonalEvent.type === 'growth_boost') {

    growTime *= 0.7;

  }



  const weather = WEATHER_TYPES.find(w => w.id === state.weather.current);

  if (weather && weather.growth) {

    growTime *= weather.growth;

  }



  return { growTime, yieldAmount };

}



function updateSeasonIndicator() {

  const indicator = document.getElementById('season-indicator');

  if (!indicator) return;



  const season = getCurrentSeason();

  const seasonLabels = {

    spring: { icon: 'PRINTEMPS', name: 'Printemps' },

    summer: { icon: 'ETE', name: 'Ete' },

    autumn: { icon: 'AUTOMNE', name: 'Automne' },

    winter: { icon: 'HIVER', name: 'Hiver' }

  };

  const label = seasonLabels[season.id] || { icon: season.id.toUpperCase(), name: season.id };

  const timeRemaining = state.season.nextChange - Date.now();

  const hoursLeft = Math.floor(timeRemaining / (60 * 60 * 1000));

  const minutesLeft = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));



  // Build bonus text

  let bonusParts = [];

  if (season.effects.growthSpeed !== 1.0) {

    const speedBonus = (season.effects.growthSpeed * 100 - 100).toFixed(0);

    const sign = speedBonus > 0 ? '+' : '';

    const cls = speedBonus > 0 ? 'bonus-positive' : 'bonus-negative';

    bonusParts.push(`<span class="${cls}">&#9889;${sign}${speedBonus}%</span>`);

  }

  if (season.effects.yieldBonus !== 1.0) {

    const yieldBonus = (season.effects.yieldBonus * 100 - 100).toFixed(0);

    const sign = yieldBonus > 0 ? '+' : '';

    const cls = yieldBonus > 0 ? 'bonus-positive' : 'bonus-negative';

    bonusParts.push(`<span class="${cls}">&#128176;${sign}${yieldBonus}%</span>`);

  }

  if (season.effects.specialChance && season.effects.specialChance !== 1.0) {

    const specialBonus = (season.effects.specialChance * 100 - 100).toFixed(0);

    const sign = specialBonus > 0 ? '+' : '';

    const cls = specialBonus > 0 ? 'bonus-positive' : 'bonus-negative';

    bonusParts.push(`<span class="${cls}">&#127793;${sign}${specialBonus}%</span>`);

  }



  document.body.dataset.season = season.id;

  indicator.dataset.season = season.id;



  if (season.id !== lastSeasonId) {

    lastSeasonId = season.id;

    buildSeasonParticles(season.id);

  }



  const timeText = `${hoursLeft}h ${minutesLeft}m`;

  const bonusText = bonusParts.length ? ` ${bonusParts.join(' ')}` : '';

  indicator.innerHTML = `

    <div class="season-single">

      ${label.name}${bonusText} - ${timeText}

    </div>

  `;



  renderSeasonPanels();

  renderWeather();

}









function renderWeather() {

  const panel = document.getElementById('weather-panel');

  if (!panel) return;

  const weather = WEATHER_TYPES.find(w => w.id === state.weather.current) || WEATHER_TYPES[0];

  const weatherIcons = {

    sun: '\u2600',

    rain: '\uD83C\uDF27',

    cloud: '\u2601',

    storm: '\u26A1',

    frost: '\u2744'

  };

  const timeLeft = Math.max(0, state.weather.nextChange - Date.now());

  const minutes = Math.floor(timeLeft / 60000);

  const seconds = Math.floor((timeLeft % 60000) / 1000);

  panel.dataset.weather = weather.id;

  const desc = formatWeatherDesc(weather.desc);

  panel.innerHTML = `${weatherIcons[weather.id] || ''} Meteo ${weather.name} (${minutes}:${seconds.toString().padStart(2,'0')}) - ${desc}`;

}



function formatWeatherDesc(desc) {

  return desc.replace(/([+-]\\d+%)/g, (match) => {

    const cls = match.startsWith('+') ? 'bonus-positive' : 'bonus-negative';

    return `<span class="${cls}">${match}</span>`;

  });

}



function renderSeasonPanels() {

  const eventEl = document.getElementById('season-event');

  const season = getCurrentSeason();



  if (eventEl) {

    eventEl.dataset.season = season.id;

    if (state.seasonalEvent.active) {

      const timeLeft = Math.max(0, state.seasonalEvent.endTime - Date.now());

      const seconds = Math.floor(timeLeft / 1000);

      eventEl.textContent = `Event: ${state.seasonalEvent.name} (${seconds}s)`;

      eventEl.classList.add('active');

    } else {

      eventEl.textContent = '';

      eventEl.classList.remove('active');

    }

  }

}



function checkSeasonalEvent(now) {

  if (state.seasonalEvent.active) {

    if (now >= state.seasonalEvent.endTime) {

      endSeasonalEvent();

    }

    return;

  }



  if (now >= state.seasonalEvent.nextCheck) {

    const season = getCurrentSeason();

    const pool = SEASONAL_EVENTS[season.id] || [];

    if (pool.length > 0 && Math.random() < 0.25) {

      const pick = pool[Math.floor(Math.random() * pool.length)];

      startSeasonalEvent(pick);

    }

    state.seasonalEvent.nextCheck = now + (2 * 60 * 1000);

  }

}



function startSeasonalEvent(event) {

  state.seasonalEvent.active = true;

  state.seasonalEvent.type = event.type;

  state.seasonalEvent.name = event.name;

  state.seasonalEvent.desc = event.desc;

  state.seasonalEvent.endTime = Date.now() + event.duration;

  showToast(`Event: ${event.name} - ${event.desc}`);

  needsRender = true;

}



function endSeasonalEvent() {

  state.seasonalEvent.active = false;

  state.seasonalEvent.type = null;

  state.seasonalEvent.name = '';

  state.seasonalEvent.desc = '';

  state.seasonalEvent.endTime = 0;

  needsRender = true;

}



function buildSeasonParticles(seasonId) {

  const container = document.getElementById('season-effects');

  if (!container) return;



  container.innerHTML = '';

  const count = seasonId === 'winter' ? 40 : 30;

  for (let i = 0; i < count; i++) {

    const particle = document.createElement('span');

    particle.className = `season-particle season-${seasonId}`;



    const size = 6 + Math.random() * 14;

    const duration = 10 + Math.random() * 14;

    const delay = -Math.random() * 10;

    const drift = (Math.random() * 80 - 40).toFixed(0);

    const rot = Math.floor(Math.random() * 360);



    particle.style.setProperty('--size', `${size}px`);

    particle.style.setProperty('--x', `${Math.random() * 100}vw`);

    particle.style.setProperty('--duration', `${duration}s`);

    particle.style.setProperty('--delay', `${delay}s`);

    particle.style.setProperty('--opacity', (0.25 + Math.random() * 0.55).toFixed(2));

    particle.style.setProperty('--drift', `${drift}px`);

    particle.style.setProperty('--rot', `${rot}deg`);



    container.appendChild(particle);

  }

}



function checkWinterFrost(now) {

  if (getCurrentSeason().id !== 'winter') return;

  if (now - state.seasonHazard.lastCheck < 8000) return;

  state.seasonHazard.lastCheck = now;



  if (Math.random() > 0.25) return;



  const candidates = [];

  state.garden.plots.forEach((plot, index) => {

    if (plot.plantId && !plot.ready && plot.isMainPlot !== false) {

      candidates.push(index);

    }

  });



  if (candidates.length === 0) return;



  const targetIndex = candidates[Math.floor(Math.random() * candidates.length)];

  const targetPlot = state.garden.plots[targetIndex];

  const plant = PLANTS.find(p => p.id === targetPlot.plantId) ||

                SPECIAL_PLANTS.find(p => p.id === targetPlot.plantId) ||

                getLegendaryPlantById(targetPlot.plantId);

  if (!plant) return;



  const occupiedPlots = getOccupiedPlots(targetIndex, plant);



  if (Math.random() < 0.2) {

    occupiedPlots.forEach((pIndex) => {

      const p = state.garden.plots[pIndex];

      p.plantId = null;

      p.plantedAt = null;

      p.growTime = null;

      p.ready = false;

      p.baseYield = null;

      p.isMainPlot = true;
      p.mainPlotIndex = null;

    });

    showToast('Gel: une plante a ete detruite!');

  } else {

    const extra = 15 + Math.floor(Math.random() * 20);

    occupiedPlots.forEach((pIndex) => {

      const p = state.garden.plots[pIndex];

      if (p.growTime) p.growTime += extra;

    });

    showToast(`Gel: +${extra}s de croissance`);

  }



}



// === LEGENDARY EVENTS ===

function checkLegendaryEvent() {

  const now = Date.now();



  // If event is active, check if it expired

  if (state.legendaryEvent.active && now >= state.legendaryEvent.endTime) {

    needsShopRender = true;

    needsRender = true;

    endLegendaryEvent();

    return;

  }



  // Check if it's time for a new event check

  if (!state.legendaryEvent.active && now >= state.legendaryEvent.nextEventCheck) {

    // Try to trigger an event

    const eligiblePlants = LEGENDARY_PLANTS.filter(plant => {

      return Math.random() < plant.eventChance;

    });



    if (eligiblePlants.length > 0) {

      // Pick a random eligible plant

      const plant = eligiblePlants[Math.floor(Math.random() * eligiblePlants.length)];

      startLegendaryEvent(plant);

    }



    // Schedule next check in 10 minutes

    state.legendaryEvent.nextEventCheck = now + (10 * 60 * 1000);

  }

}



function startLegendaryEvent(plant) {

  const now = Date.now();

  state.legendaryEvent.active = true;

  state.legendaryEvent.plant = plant.id;

  state.legendaryEvent.startTime = now;

  state.legendaryEvent.endTime = now + (60 * 1000); // 60 seconds

  state.legendaryEvent.stock = plant.maxStock || 1; // Initialize stock



  showLegendaryEventNotification(plant);

  needsRender = true;

  needsShopRender = true;

}



function endLegendaryEvent() {

  state.legendaryEvent.active = false;

  state.legendaryEvent.plant = null;

  state.legendaryEvent.startTime = 0;

  state.legendaryEvent.endTime = 0;

  state.legendaryEvent.stock = 0;



  showToast('\u23F0 \u00C9v\u00E9nement l\u00E9gendaire termin\u00E9!', 'warning');

  needsRender = true;

}



function showLegendaryEventNotification(plant) {

  const body = document.body;

  const overlay = document.createElement('div');

  overlay.className = 'legendary-event-overlay';



  const timeLeft = Math.floor((state.legendaryEvent.endTime - Date.now()) / 1000);

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;



  overlay.innerHTML = `

    <div class="legendary-event-content">

      <div class="legendary-event-icon">\u2728</div>

      <h2>\uD83C\uDF89 \u00C9v\u00E9nement L\u00E9gendaire!</h2>

      <div class="legendary-plant-showcase">

        <div style="font-size: 3em; margin: 10px 0;">${getPlantEmoji(plant)}</div>

        <h3>${plant.name}</h3>

        <p class="legendary-desc">${plant.desc}</p>

        <div class="legendary-stats">

          <div>\uD83D\uDCB0 ${plant.cost} coins</div>

          <div>\u23F1\uFE0F ${plant.growTime}s</div>

          <div>\uD83C\uDF1F ${plant.yield} rendement</div>

        </div>

      </div>

      <p class="legendary-timer">\u23F0 Disponible pendant ${minutes}m ${seconds}s</p>

      <button class="btn accent" onclick="this.parentElement.parentElement.remove()">Aller au Shop!</button>

    </div>

  `;

  body.appendChild(overlay);



  // Play sound notification (if available)

  showToast(`\u2728 ${plant.name} disponible pour 5 minutes!`, 'legendary');



  // Auto-remove after 10 seconds

  setTimeout(() => {

    if (overlay.parentElement) {

      overlay.remove();

    }

  }, 10000);

}



function getLegendaryPlantById(id) {

  return LEGENDARY_PLANTS.find(p => p.id === id);

}



function getBuildingById(id) {

  return BUILDINGS.find(b => b.id === id);

}



function isPlaceableBuilding(building) {

  return !!(building && building.placeable);

}



function getBuildingPlacedCount(buildingId) {

  return state.placedBuildings.filter(b => b.id === buildingId).length;

}



function getBuildingAvailableCount(buildingId) {

  const owned = state.owned.buildings[buildingId] || 0;

  return Math.max(0, owned - getBuildingPlacedCount(buildingId));

}



function rebuildPlacedBuildingsFromPlots() {

  const placed = [];

  state.garden.plots.forEach((plot, index) => {

    if (plot.buildingId && plot.buildingIsMainPlot) {

      const building = getBuildingById(plot.buildingId);

      if (building) {

        placed.push({

          id: plot.buildingId,

          plotIndex: index,

          size: building.size || 1,

          orientation: plot.buildingOrientation || building.orientation || null

        });

      }

    }

  });

  state.placedBuildings = placed;

}



function forceLegendaryEvent() {

  // Admin function to force a random legendary event

  const plant = LEGENDARY_PLANTS[Math.floor(Math.random() * LEGENDARY_PLANTS.length)];

  startLegendaryEvent(plant);

}



function handleLegendaryHarvest(plantId) {

  const plant = getLegendaryPlantById(plantId);

  if (!plant) return;



  // Rainbow Tree: Give seeds of all plants

  if (plant.seedsOnHarvest) {

    PLANTS.forEach(p => {

      const amount = Math.floor(Math.random() * 3) + 1; // 1-3 seeds

      state.seeds[p.id] = (state.seeds[p.id] || 0) + amount;

      markCollected('plants', p.id);

    });

    showToast('\uD83C\uDF08 Seeds de toutes les plantes!', 'legendary');

  }



  // Note: Other legendary effects (Golden Rose boost, Time Lotus speed, Cosmic Cactus CPS)

  // are handled in their respective systems (calculateBoosterBonus, applySeasonEffects, updateCPS)

}



function runAutoHarvest(now) {

  const owned = getBuildingPlacedCount('auto_harvester');

  if (!owned) return;



  if (!state.autoHarvest) {

    state.autoHarvest = { lastRun: 0 };

  }



  const interval = Math.max(500, 3000 / owned);

  if (now - state.autoHarvest.lastRun < interval) return;

  state.autoHarvest.lastRun = now;



  let harvested = 0;

  for (let i = 0; i < state.garden.plots.length; i++) {

    const plot = state.garden.plots[i];

    if (!plot.ready || !plot.plantId) continue;

    if (plot.mainPlotIndex !== null && plot.mainPlotIndex !== i) continue;

    harvestPlot(i);

    harvested++;

    if (harvested >= owned) break;

  }

}



// === ACHIEVEMENTS ===

function checkAchievements() {

  ACHIEVEMENTS.forEach(achievement => {

    // Skip if already unlocked

    if (state.achievements.unlocked.includes(achievement.id)) return;



    // Check if condition met

    if (achievement.check(state)) {

      // Unlock achievement

      state.achievements.unlocked.push(achievement.id);



      // Show notification if not already notified

      if (!state.achievements.notified.includes(achievement.id)) {

        state.achievements.notified.push(achievement.id);

        showAchievementNotification(achievement);



        // Give reward

        addCoins(achievement.reward);

        showToast(`\uD83C\uDF89 +${achievement.reward}\uD83D\uDCB0 bonus !`);

      }



    }

  });

}



function showAchievementNotification(achievement) {

  const container = document.getElementById('toasts');

  const notification = document.createElement('div');

  notification.className = 'toast achievement-toast';

  notification.innerHTML = `

    <div style="font-weight: bold; font-size: 1.1em;">\uD83C\uDFC6 Achievement D\u00E9bloqu\u00E9 !</div>

    <div style="margin-top: 5px;">${achievement.name}</div>

    <div style="font-size: 0.9em; opacity: 0.9;">${achievement.desc}</div>

  `;

  container.appendChild(notification);



  setTimeout(() => {

    notification.style.opacity = '0';

    setTimeout(() => notification.remove(), 300);

  }, 4000); // Show longer for achievements

}



function cacheUIRefs() {

  uiRefs = {

    coins: document.getElementById('coins'),

    cps: document.getElementById('cps'),

    seeds: document.getElementById('seeds-count'),

    marketTimer: document.getElementById('market-timer'),

    gardenSize: document.getElementById('garden-size')

  };

}



function setTextIfChanged(el, value, cacheKey) {

  if (!el) return;

  if (uiCache[cacheKey] !== value) {

    uiCache[cacheKey] = value;

    el.textContent = value;

  }

}



// === RENDER LOOP (OPTIMIZED) ===

function renderLoop(timestamp) {

  // Update timers and counters every frame

  const now = Date.now();



  // Update coins and CPS display

  setTextIfChanged(uiRefs.coins, Math.floor(state.coins).toString(), 'coinsText');

  setTextIfChanged(uiRefs.cps, state.cps.toFixed(1), 'cpsText');



  // Update seeds count

  const selectedPlant = state.selectedPlant;

  const seedCount = state.seeds[selectedPlant] || 0;

  setTextIfChanged(uiRefs.seeds, seedCount.toString(), 'seedsText');



  // Update market timer

  const marketTimerText = getTimeUntilRefresh();

  setTextIfChanged(uiRefs.marketTimer, marketTimerText, 'marketTimerText');

  updateLegendaryShopTimer();



  const coinsFloor = Math.floor(state.coins);

  if (coinsFloor !== lastCoinsForShop) {

    updateShopAffordability();

    lastCoinsForShop = coinsFloor;

  }



  if (nextShopUnlock !== null && Math.floor(state.lifetimeCoins) >= nextShopUnlock) {

    needsShopRender = true;

    needsRender = true;

  }



  if (!needsRender) {

    ACTIVE_BUILDINGS.forEach(building => {

      const pending = state.activeBuildingPending[building.id] || 0;

      const cooldownUntil = state.activeBuildingCooldowns[building.id] || 0;

      if (pending > 0 && cooldownUntil > 0 && Date.now() >= cooldownUntil) {

        needsRender = true;

      }

    });

  }



  // Update season indicator (throttled to 1 FPS instead of 60 FPS)

  if (timestamp - lastSeasonUpdate > 1000) {

    updateSeasonIndicator();

    lastSeasonUpdate = timestamp;

  }



  if (timestamp - lastPrestigeUpdate > 1000) {

    renderPrestigePanel();

    lastPrestigeUpdate = timestamp;

  }



  if (state.market.weekly && state.market.weekly.itemId) {

    const minutesLeft = Math.floor(Math.max(0, state.market.weekly.nextRotation - now) / 60000);

    if (minutesLeft !== lastWeeklyTimer) {

      lastWeeklyTimer = minutesLeft;

      needsRender = true;

    }

  }



  // Auto-harvest from automation buildings

  runAutoHarvest(now);



  // Update plot timers for growing plants

  const garden = document.getElementById('garden');



  if (state.activeEffects.boostUntil > now) {

    state.garden.plots.forEach(plot => {

      if (plot.plantId && !plot.ready && plot.plantedAt && plot.growTime) {

        plot.plantedAt -= 200;

      }

    });

  }

  if (garden && garden.children.length) {

    state.garden.plots.forEach((plot, index) => {

      if (plot.plantId && !plot.ready && plot.growTime) {

        const plotEl = garden.children[index];

        if (plotEl) {

          const elapsed = (now - plot.plantedAt) / 1000;

          const remaining = Math.max(0, plot.growTime - elapsed);

          const rounded = Math.ceil(remaining);

          if (plot.lastTimer !== rounded && rounded > 0) {

            const timerEl = plotEl.querySelector('.plot-timer');

            if (timerEl) {

              timerEl.textContent = `${rounded}s`;

              plot.lastTimer = rounded;

            }

          }

        }

      }

    });

  }



  // Full render when needed (throttled to 20 FPS max)

  if (needsRender && timestamp - lastRenderTime > 50) {

    render();

    needsRender = false;

    lastRenderTime = timestamp;

  }



  requestAnimationFrame(renderLoop);

}



// === ACTIONS ===

// Get plots occupied by a multi-size plant

function getOccupiedPlots(plotIndex, plant) {

  const size = plant.size || 1;

  if (size === 1) return [plotIndex];



  const gardenSize = state.garden.size;

  const row = Math.floor(plotIndex / gardenSize);

  const col = plotIndex % gardenSize;

  const plots = [plotIndex];



  if (plant.orientation === 'vertical' && size === 2) {

    // Vertical 2x1 (goes down)

    if (row + 1 < gardenSize) {

      plots.push(plotIndex + gardenSize);

    }

  } else if (plant.orientation === 'horizontal' && size === 2) {

    // Horizontal 1x2 (goes right)

    if (col + 1 < gardenSize) {

      plots.push(plotIndex + 1);

    }

  } else if (plant.orientation === 'square' && size === 4) {

    // Square 2x2

    if (row + 1 < gardenSize && col + 1 < gardenSize) {

      plots.push(plotIndex + 1); // right

      plots.push(plotIndex + gardenSize); // down

      plots.push(plotIndex + gardenSize + 1); // down-right

    }

  } else if (plant.orientation === 'square' && size === 9) {

    // Square 3x3

    if (row + 2 < gardenSize && col + 2 < gardenSize) {

      // First row

      plots.push(plotIndex + 1); // right

      plots.push(plotIndex + 2); // right 2

      // Second row

      plots.push(plotIndex + gardenSize); // down

      plots.push(plotIndex + gardenSize + 1); // down-right

      plots.push(plotIndex + gardenSize + 2); // down-right 2

      // Third row

      plots.push(plotIndex + gardenSize * 2); // down 2

      plots.push(plotIndex + gardenSize * 2 + 1); // down 2-right

      plots.push(plotIndex + gardenSize * 2 + 2); // down 2-right 2

    }

  } else if (plant.orientation === 'square' && size === 16) {

    // Square 4x4

    if (row + 3 < gardenSize && col + 3 < gardenSize) {

      // First row

      plots.push(plotIndex + 1);

      plots.push(plotIndex + 2);

      plots.push(plotIndex + 3);

      // Second row

      plots.push(plotIndex + gardenSize);

      plots.push(plotIndex + gardenSize + 1);

      plots.push(plotIndex + gardenSize + 2);

      plots.push(plotIndex + gardenSize + 3);

      // Third row

      plots.push(plotIndex + gardenSize * 2);

      plots.push(plotIndex + gardenSize * 2 + 1);

      plots.push(plotIndex + gardenSize * 2 + 2);

      plots.push(plotIndex + gardenSize * 2 + 3);

      // Fourth row

      plots.push(plotIndex + gardenSize * 3);

      plots.push(plotIndex + gardenSize * 3 + 1);

      plots.push(plotIndex + gardenSize * 3 + 2);

      plots.push(plotIndex + gardenSize * 3 + 3);

    }

  }



  return plots;

}

function resolveMainPlotIndex(plotIndex, plant) {
  const plot = state.garden.plots[plotIndex];
  if (!plot || !plant) return plotIndex;
  if (plot.mainPlotIndex !== null && plot.mainPlotIndex !== undefined) return plot.mainPlotIndex;
  if (plot.isMainPlot === true) return plotIndex;
  const total = state.garden.size * state.garden.size;
  for (let i = 0; i < total; i++) {
    const candidate = state.garden.plots[i];
    if (!candidate || candidate.plantId !== plant.id) continue;
    const candidatePlant = getPlotPlant(i) || plant;
    const occupied = getOccupiedPlots(i, candidatePlant);
    if (!occupied.includes(plotIndex)) continue;
    const allMatch = occupied.every((pIndex) => {
      const p = state.garden.plots[pIndex];
      return p && p.plantId === plant.id;
    });
    if (allMatch) return i;
  }
  return plotIndex;
}

function normalizePlantPlots() {
  const total = state.garden.size * state.garden.size;
  for (let index = 0; index < total; index++) {
    const plot = state.garden.plots[index];
    if (!plot) continue;
    if (!plot.plantId) {
      plot.isMainPlot = true;
      plot.mainPlotIndex = null;
      continue;
    }
    const plant = getPlantById(plot.plantId);
    if (!plant) {
      state.garden.plots[index] = createEmptyPlot();
      continue;
    }
    if (!plant.size || plant.size === 1) {
      plot.isMainPlot = true;
      plot.mainPlotIndex = null;
      continue;
    }
    let resolvedOrientation = plot.plantOrientation || plant.orientation || null;
    if (!resolvedOrientation && plant.size === 2) {
      const row = Math.floor(index / state.garden.size);
      const col = index % state.garden.size;
      const rightIndex = col + 1 < state.garden.size ? index + 1 : null;
      const downIndex = row + 1 < state.garden.size ? index + state.garden.size : null;
      const rightPlot = rightIndex !== null ? state.garden.plots[rightIndex] : null;
      const downPlot = downIndex !== null ? state.garden.plots[downIndex] : null;
      if (rightPlot && rightPlot.plantId === plant.id) {
        resolvedOrientation = 'horizontal';
      } else if (downPlot && downPlot.plantId === plant.id) {
        resolvedOrientation = 'vertical';
      }
    }
    const orientedPlant = resolvedOrientation ? { ...plant, orientation: resolvedOrientation } : plant;
    const mainIndex = resolveMainPlotIndex(index, orientedPlant);
    const occupied = getOccupiedPlots(mainIndex, orientedPlant);
    occupied.forEach((pIndex) => {
      const p = state.garden.plots[pIndex];
      if (!p || p.plantId !== plant.id) return;
      p.mainPlotIndex = mainIndex;
      p.isMainPlot = pIndex === mainIndex;
      p.plantOrientation = orientedPlant.orientation || null;
    });
  }
}



// Check if all plots are available for planting

function canPlantAt(plotIndex, plant) {

  const occupiedPlots = getOccupiedPlots(plotIndex, plant);



  // Check if we have enough plots

  if (occupiedPlots.length !== (plant.size || 1)) {

    return false;

  }



  const gardenSize = state.garden.size;

  const lineBlocks = getLineBlockerLines();



  // Check if all plots are empty and not blocked by a line blocker

  for (const pIndex of occupiedPlots) {

    if (state.garden.plots[pIndex].plantId || state.garden.plots[pIndex].buildingId) {

      return false;

    }



    const row = Math.floor(pIndex / gardenSize);

    const col = pIndex % gardenSize;



    if (plant.special === 'line_blocker') {

      if (lineBlocks.rows.has(row) || lineBlocks.cols.has(col)) {

        return false;

      }

    } else if (lineBlocks.rows.has(row) || lineBlocks.cols.has(col)) {

      return false;

    }

  }



  return true;

}



function canPlaceBuildingAt(plotIndex, building) {

  const occupiedPlots = getOccupiedPlots(plotIndex, building);

  if (occupiedPlots.length !== (building.size || 1)) {

    return false;

  }



  const gardenSize = state.garden.size;

  const lineBlocks = getLineBlockerLines();



  for (const pIndex of occupiedPlots) {

    const plot = state.garden.plots[pIndex];

    if (plot.plantId || plot.buildingId) {

      return false;

    }



    const row = Math.floor(pIndex / gardenSize);

    const col = pIndex % gardenSize;

    if (lineBlocks.rows.has(row) || lineBlocks.cols.has(col)) {

      return false;

    }

  }



  return true;

}



function placeBuilding(plotIndex) {

  const building = getBuildingById(state.selectedBuilding);

  if (!building || !isPlaceableBuilding(building)) return;



  const available = getBuildingAvailableCount(building.id);

  if (available <= 0) {

    showToast('Aucun batiment disponible');

    state.selectedBuilding = null;

    needsRender = true;

    return;

  }



  let buildingToPlace = { ...building };

  if (building.size === 2) {

    const horizontal = { ...building, orientation: 'horizontal' };

    const vertical = { ...building, orientation: 'vertical' };

    const canH = canPlaceBuildingAt(plotIndex, horizontal);

    const canV = canPlaceBuildingAt(plotIndex, vertical);



    if (canH && !canV) {

      buildingToPlace = horizontal;

    } else if (canV && !canH) {

      buildingToPlace = vertical;

    } else if (canH && canV) {

      buildingToPlace = horizontal;

    }

  }



  if (!canPlaceBuildingAt(plotIndex, buildingToPlace)) {

    showToast('Pas assez de place pour ce batiment');

    return;

  }



  const occupiedPlots = getOccupiedPlots(plotIndex, buildingToPlace);

  occupiedPlots.forEach((pIndex) => {

    const p = state.garden.plots[pIndex];

    p.buildingId = buildingToPlace.id;

    p.buildingMainPlotIndex = plotIndex;

    p.buildingIsMainPlot = pIndex === plotIndex;

    p.buildingOrientation = buildingToPlace.orientation || null;

  });



  state.placedBuildings.push({

    id: buildingToPlace.id,

    plotIndex,

    size: buildingToPlace.size || 1,

    orientation: buildingToPlace.orientation || null

  });



  updateCPS();

  showToast(`Batiment place: ${building.name}`);

  if (getBuildingAvailableCount(building.id) <= 0) {

    state.selectedBuilding = null;

  }

  ensureWeeklyOffer();

  needsRender = true;

}



function getPlacedBuildingByMainPlot(plotIndex) {

  return state.placedBuildings.find(b => b.plotIndex === plotIndex);

}



function openRemoveBuildingModal(plotIndex) {

  const modal = document.getElementById('building-remove-modal');

  if (!modal) return;

  state.pendingBuildingRemoval = plotIndex;

  modal.classList.add('show');

}



function closeRemoveBuildingModal() {

  const modal = document.getElementById('building-remove-modal');

  if (modal) modal.classList.remove('show');

  state.pendingBuildingRemoval = null;

}



function removeBuilding(plotIndex) {

  const placed = getPlacedBuildingByMainPlot(plotIndex);

  if (!placed) return;

  const building = getBuildingById(placed.id);

  if (!building) return;



  const buildingToRemove = {

    ...building,

    orientation: placed.orientation || building.orientation || null

  };

  const occupiedPlots = getOccupiedPlots(plotIndex, buildingToRemove);

  occupiedPlots.forEach((pIndex) => {

    const p = state.garden.plots[pIndex];

    p.buildingId = null;

    p.buildingMainPlotIndex = null;

    p.buildingIsMainPlot = false;

    p.buildingOrientation = null;

  });



  state.placedBuildings = state.placedBuildings.filter(b => b.plotIndex !== plotIndex);

  updateCPS();

  showToast('Batiment retire');

  needsRender = true;

}

function openRemovePlantModal(plotIndex) {
  const modal = document.getElementById('plant-remove-modal');
  const nameEl = document.getElementById('plant-remove-name');
  if (!modal) return;
  const plot = state.garden.plots[plotIndex];
  const plant = plot && plot.plantId ? getPlotPlant(plotIndex) : null;
  const mainIndex = plant ? resolveMainPlotIndex(plotIndex, plant) : plotIndex;
  state.pendingPlantRemoval = mainIndex;
  if (nameEl) {
    nameEl.textContent = plant ? plant.name : 'plante';
  }
  modal.classList.add('show');
}

function closeRemovePlantModal() {
  const modal = document.getElementById('plant-remove-modal');
  if (modal) modal.classList.remove('show');
  state.pendingPlantRemoval = null;
}

function removePlant(plotIndex) {
  const plot = state.garden.plots[plotIndex];
  if (!plot || !plot.plantId) return;
  const plant = getPlotPlant(plotIndex);
  if (!plant) {
    state.garden.plots[plotIndex] = createEmptyPlot();
    needsRender = true;
    return;
  }

  const mainIndex = resolveMainPlotIndex(plotIndex, plant);
  const occupiedPlots = getOccupiedPlots(mainIndex, plant);
  occupiedPlots.forEach((pIndex) => {
    const p = state.garden.plots[pIndex];
    if (!p) return;
    p.plantId = null;
    p.plantedAt = null;
    p.growTime = null;
    p.ready = false;
    p.baseYield = null;
    p.plantOrientation = null;
    p.isMainPlot = true;
    p.mainPlotIndex = null;
  });

  showToast('Plante retiree');
  needsRender = true;
}



function plantSeed(plotIndex) {

  const plot = state.garden.plots[plotIndex];

  if (plot.buildingId) {

    return;

  }

  if (plot.plantId) {

    if (plot.ready) {

      const mainIndex = plot.mainPlotIndex !== null && plot.mainPlotIndex !== undefined

        ? plot.mainPlotIndex

        : plotIndex;

      harvestPlot(mainIndex);

    }

    return;

  }



  // Check if planting a special plant

  if (state.selectedSpecialPlant) {

    const specialPlant = SPECIAL_PLANTS.find(p => p.id === state.selectedSpecialPlant);

    if (!specialPlant) return;



    const count = state.specialPlants.inventory[specialPlant.id] || 0;

    if (count <= 0) {

      showToast(`\u274C Aucune ${specialPlant.name} disponible`);

      state.selectedSpecialPlant = null;

      needsRender = true;

      return;

    }



    if (!canPlantAt(plotIndex, specialPlant)) {

      showToast('Impossible de planter ici');

      return;

    }



    // Apply season effects to growth time

    const { growTime } = applySeasonEffects(specialPlant.id, specialPlant.growTime, specialPlant.yield);



    // Plant the special plant

    state.specialPlants.inventory[specialPlant.id]--;

    plot.plantId = specialPlant.id;

    plot.plantedAt = Date.now();

    plot.growTime = growTime;

    plot.ready = false;

    plot.baseYield = specialPlant.yield;
    plot.plantOrientation = specialPlant.orientation || null;



    showToast(`\u2728 ${specialPlant.name} plant\u00E9e (${state.specialPlants.inventory[specialPlant.id]} restantes)`);



    // Auto-deselect if no more left

    if (state.specialPlants.inventory[specialPlant.id] <= 0) {

      state.selectedSpecialPlant = null;

    }



    needsRender = true;

    return;

  }



  // Check if it's a legendary plant

  let plant = PLANTS.find(p => p.id === state.selectedPlant);

  let isLegendary = false;



  if (!plant) {

    // Try legendary plants

    plant = getLegendaryPlantById(state.selectedPlant);

    if (plant) {

      isLegendary = true;

    } else {

      return;

    }

  }



  let plantToPlace = { ...plant };

  if (plant.size === 2) {

    const horizontal = { ...plant, orientation: 'horizontal' };

    const vertical = { ...plant, orientation: 'vertical' };

    const canH = canPlantAt(plotIndex, horizontal);

    const canV = canPlantAt(plotIndex, vertical);



    if (canH && !canV) {

      plantToPlace = horizontal;

    } else if (canV && !canH) {

      plantToPlace = vertical;

    } else if (canH && canV) {

      plantToPlace = horizontal;

    }

  }



  if (state.lifetimeCoins < plant.unlock) {

    showToast(`\uD83D\uDD12 ${plant.unlock} lifetime coins requis`);

    return;

  }



  const seedCount = state.seeds[plant.id] || 0;

  if (seedCount <= 0) {

    showToast(`\u274C Plus de graines ! March\u00E9: ${getTimeUntilRefresh()}`);

    return;

  }



  // Check if we can plant here (multi-plot plants)

  if (!canPlantAt(plotIndex, plantToPlace)) {

    const sizeText = plant.size === 2 ? '2 cases' :

                     plant.size === 4 ? '4 cases (2x2)' :

                     plant.size === 9 ? '9 cases (3x3)' :

                     plant.size === 16 ? '16 cases (4x4)' :

                     plant.size + ' cases';

    showToast(`\u274C Pas assez d'espace! Cette plante prend ${sizeText}`);

    return;

  }



  // Apply season effects to growth time

  const { growTime } = applySeasonEffects(plant.id, plant.growTime, plant.yield);



  // Get all plots to occupy

  const occupiedPlots = getOccupiedPlots(plotIndex, plantToPlace);



  // Plant on all occupied plots

  state.seeds[plant.id]--;

  occupiedPlots.forEach((pIndex) => {

    const p = state.garden.plots[pIndex];

    p.plantId = plantToPlace.id;

    p.plantedAt = Date.now();

    p.growTime = growTime;

    p.ready = false;

    p.baseYield = plantToPlace.yield;
    p.plantOrientation = plantToPlace.orientation || plant.orientation || null;

    p.isMainPlot = pIndex === plotIndex; // Mark main plot for rendering

    p.mainPlotIndex = plotIndex; // Reference to main plot

  });



  const sizeInfo = plant.size > 1 ? ` [${plant.size} cases]` : '';

  showToast(`${plant.name}${sizeInfo} plant\u00E9 (${state.seeds[plant.id]} restantes)`);

  needsRender = true;

}



// Get adjacent plot indices (up, down, left, right)

function getAdjacentPlots(plotIndex) {

  const size = state.garden.size;

  const row = Math.floor(plotIndex / size);

  const col = plotIndex % size;

  const adjacent = [];



  // Up

  if (row > 0) adjacent.push(plotIndex - size);

  // Down

  if (row < size - 1) adjacent.push(plotIndex + size);

  // Left

  if (col > 0) adjacent.push(plotIndex - 1);

  // Right

  if (col < size - 1) adjacent.push(plotIndex + 1);



  return adjacent;

}



// Calculate booster plant bonus for a specific plot

function calculateBoosterBonus(plotIndex) {

  const adjacentIndices = getAdjacentPlots(plotIndex);

  let boosterCount = 0;

  let goldenRoseCount = 0;



  for (const adjIndex of adjacentIndices) {

    const adjPlot = state.garden.plots[adjIndex];

    if (adjPlot && adjPlot.ready) {

      if (adjPlot.plantId === 'booster') {

        boosterCount++;

      } else if (adjPlot.plantId === 'golden_rose') {

        goldenRoseCount++;

      }

    }

  }



  // Each booster gives +20% yield, cap at +60%

  const cappedCount = Math.min(boosterCount, 3);

  let multiplier = 1 + (cappedCount * 0.20);



  // Each Golden Rose gives +100% (x2) yield

  if (goldenRoseCount > 0) {

    multiplier *= (1 + goldenRoseCount); // +100% per golden rose

  }



  return multiplier;

}



function getLineBlockerLines() {

  const size = state.garden.size;

  const rows = new Set();

  const cols = new Set();



  state.garden.plots.forEach((plot, index) => {

    if (plot.plantId === 'line_blocker') {

      const row = Math.floor(index / size);

      const col = index % size;

      rows.add(row);

      cols.add(col);

    }

  });



  return { rows, cols };

}



function calculateLineBlockerBonus(plotIndex) {

  const size = state.garden.size;

  const col = plotIndex % size;

  const lines = getLineBlockerLines();



  return lines.cols.has(col) ? 1.5 : 1.0;

}



function harvestPlot(plotIndex) {

  const plot = state.garden.plots[plotIndex];

  if (!plot || !plot.plantId || !plot.ready) return;

  const plant = getPlotPlant(plotIndex);
  if (!plant) return;

  const mainIndex = plant.size > 1 ? resolveMainPlotIndex(plotIndex, plant) : plotIndex;
  const mainPlot = state.garden.plots[mainIndex];
  if (!mainPlot || !mainPlot.plantId) return;
  const mainPlant = getPlotPlant(mainIndex) || plant;



  // Apply season effects to yield

  const baseYield = mainPlot.baseYield || mainPlant.yield;

  let { yieldAmount } = applySeasonEffects(mainPlot.plantId, mainPlant.growTime, baseYield);



  // Apply booster plant adjacency bonus (only for non-booster plants)

  if (mainPlot.plantId !== 'booster') {

    const boosterMultiplier = calculateBoosterBonus(mainIndex);

    if (boosterMultiplier > 1) {

      yieldAmount *= boosterMultiplier;

      // Show visual indicator for boosted harvest

      showToast(`\uD83C\uDF1F Bonus Booster: +${Math.round((boosterMultiplier - 1) * 100)}%`);

    }

  }





  // Apply line blocker column bonus (only for non-blocker plants)

  if (mainPlot.plantId !== 'line_blocker') {

    const lineMultiplier = calculateLineBlockerBonus(mainIndex);

    if (lineMultiplier > 1) {

      yieldAmount *= lineMultiplier;

      showToast(`Bonus Colonne: +${Math.round((lineMultiplier - 1) * 100)}%`);

    }

  }



  if (state.seasonalEvent.active && state.seasonalEvent.type === 'harvest_boost') {

    yieldAmount *= 2;

  }



  const weather = WEATHER_TYPES.find(w => w.id === state.weather.current);

  if (weather && weather.yield) {

    yieldAmount *= weather.yield;

  }



  // Animation de r\u00E9colte

  const garden = document.getElementById('garden');

  const plotEl = garden.children[mainIndex];

  if (plotEl) {

    plotEl.classList.add('harvesting');



    // Popup de coins

    const coinPopup = document.createElement('div');

    coinPopup.className = 'coin-popup';

    coinPopup.textContent = `+${Math.floor(yieldAmount)}\uD83D\uDCB0`;

    plotEl.style.position = 'relative';

    plotEl.appendChild(coinPopup);



    // Create particle effects

    for (let i = 0; i < 5; i++) {

      const particle = document.createElement('div');

      particle.className = 'harvest-particle';

      particle.textContent = '\u2728';

      particle.style.left = `${Math.random() * 100}%`;

      particle.style.animationDelay = `${Math.random() * 0.3}s`;

      plotEl.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);

    }



    // Nettoyer apr\u00E8s l'animation

    setTimeout(() => {

      coinPopup.remove();

      plotEl.classList.remove('harvesting');

      plotEl.style.position = '';

    }, 1000);

  }



  // Combo system - reward fast consecutive harvests

  const now = Date.now();

  if (now - state.combo.lastHarvest < 2000) {

    state.combo.count++;

    state.combo.multiplier = 1 + (state.combo.count * 0.1); // +10% per combo

    if (state.combo.count >= 3) {

      const bonus = Math.floor(yieldAmount * (state.combo.multiplier - 1));

      if (bonus > 0) {

        showToast(`\uD83D\uDD25 COMBO x${state.combo.count}! +${bonus}\uD83D\uDCB0 bonus`);

      }

    }

  } else {

    state.combo.count = 0;

    state.combo.multiplier = 1;

  }

  state.combo.lastHarvest = now;



  const prestigeMultiplier = state.prestige ? (state.prestige.multiplier || 1) : 1;

  const finalYield = Math.floor(yieldAmount * state.combo.multiplier * prestigeMultiplier);

  addCoins(finalYield);

  state.totalHarvests++;

  // Add harvest to inventory (for crafting system)
  if (typeof addHarvestToInventory === 'function') {
    addHarvestToInventory(mainPlot.plantId, 1);
  }



  // Check for special plant drop

  checkSpecialPlantDrop();

  checkSeasonalSeedDrop();



  // Handle legendary plant special effects

  const isLegendary = mainPlant.special === 'legendary';

  if (isLegendary) {

    markCollected('legendary', plot.plantId);

    handleLegendaryHarvest(plot.plantId);

  }



  // Check if this is a Phoenix Flower (auto-respawn)

  const shouldRespawn = isLegendary && mainPlant.autoRespawn;



  // Clear all occupied plots for multi-size plants

  const occupiedPlots = getOccupiedPlots(mainIndex, mainPlant);

  occupiedPlots.forEach((pIndex) => {

    const p = state.garden.plots[pIndex];

    if (!p) return; // Sécurité: vérifier que le plot existe



    // Phoenix Flower respawns automatically

    if (shouldRespawn && pIndex === mainIndex) {

      p.plantedAt = Date.now();

      p.ready = false;

      showToast('\uD83D\uDD25 Phoenix Flower respawn!', 'legendary');

    } else {

      // Nettoyer complètement le plot
      p.plantId = null;

      p.plantedAt = null;

      p.growTime = null;

      p.ready = false;

      p.baseYield = null;

      p.plantOrientation = null;

      p.isMainPlot = false;

      p.mainPlotIndex = null;

    }

  });



  // Forcer le re-render du jardin pour mettre à jour les onclick
  renderGarden();



}



function checkSpecialPlantDrop() {

  const season = getCurrentSeason();



  SPECIAL_PLANTS.forEach(specialPlant => {

    // Apply season chance multiplier

    const adjustedRarity = specialPlant.rarity * (season.effects.specialChance || 1.0);



    if (Math.random() < adjustedRarity) {

      // Drop special plant!

      state.specialPlants.inventory[specialPlant.id] =

        (state.specialPlants.inventory[specialPlant.id] || 0) + 1;

      markCollected('special', specialPlant.id);



      // Show epic event

      showSpecialPlantEvent(specialPlant);

    }

  });

}



function checkSeasonalSeedDrop() {

  const season = getCurrentSeason();

  if (!season.effects.seasonalSeeds) return;



  season.effects.seasonalSeeds.forEach(entry => {

    const plant = PLANTS.find(p => p.id === entry.id);

    if (!plant) return;



    if (Math.random() < entry.chance) {

      state.seeds[entry.id] = (state.seeds[entry.id] || 0) + entry.amount;

      markCollected('plants', entry.id);

      showToast(`Rare: +${entry.amount} ${plant.name}`);

    }

  });

}



function showSpecialPlantEvent(specialPlant) {

  const body = document.body;

  const overlay = document.createElement('div');

  overlay.className = 'special-plant-event wow';



  const content = document.createElement('div');

  content.className = 'special-plant-content';

  content.innerHTML = `

    <div class="special-plant-glow">RARE</div>

    <div class="special-plant-title">Special Plant Found!</div>

    <div class="special-plant-desc">

      ${specialPlant.name}<br>

      ${specialPlant.desc}

    </div>

  `;



  const button = document.createElement('button');

  button.className = 'btn accent';

  button.textContent = 'Awesome!';



  const particles = document.createElement('div');

  particles.className = 'special-particles';



  for (let i = 0; i < 18; i++) {

    const dot = document.createElement('span');

    dot.style.left = `${Math.random() * 100}%`;

    dot.style.top = `${Math.random() * 100}%`;

    dot.style.animationDelay = `${Math.random() * 0.6}s`;

    particles.appendChild(dot);

  }



  const dismiss = () => {

    body.classList.remove('special-event');

    overlay.remove();

  };



  button.addEventListener('click', dismiss);

  content.appendChild(button);

  overlay.appendChild(particles);

  overlay.appendChild(content);



  body.classList.add('special-event');

  body.appendChild(overlay);



  setTimeout(() => {

    if (overlay.parentElement) {

      dismiss();

    }

  }, 8000);



  showToast(`Rare plant added: ${specialPlant.name}`);

}



function harvestAll() {

  let harvested = 0;

  const harvestedPlots = [];



  // Collect all ready plants (resolve main plot for multi-size)
  const uniqueMainPlots = new Set();
  state.garden.plots.forEach((plot, index) => {
    if (!plot.ready || !plot.plantId) return;
    const plant = getPlotPlant(index);
    if (!plant) return;
    if (plant.id === 'booster') return;
    const mainIndex = plant.size > 1 ? resolveMainPlotIndex(index, plant) : index;
    uniqueMainPlots.add(mainIndex);
  });

  uniqueMainPlots.forEach((index) => harvestedPlots.push(index));



  // Harvest all collected plots (harvestPlot handles coins and counters)

  harvestedPlots.forEach(index => {

    harvestPlot(index);

    harvested++;

  });



  if (harvested > 0) {

    showToast(`\u2705 ${harvested} plante${harvested > 1 ? 's' : ''} r\u00E9colt\u00E9e${harvested > 1 ? 's' : ''}!`);

    needsRender = true;

  } else {

    showToast('\u274C Aucune plante pr\u00EAte');

  }

}



function buyPlant(plantId) {

  // Check if it's a legendary plant

  let plant = PLANTS.find(p => p.id === plantId);

  let isLegendary = false;



  if (!plant) {

    plant = getLegendaryPlantById(plantId);

    if (plant) {

      isLegendary = true;

    } else {

      return;

    }

  }



  if (isLegendary) {

    if (state.legendaryEvent.stock <= 0) {

      showToast('Rupture de stock legendaire');

      return;

    }

    if (state.coins < plant.cost) {

      showToast(`Requis: ${plant.cost} coins`);

      return;

    }



    state.coins -= plant.cost;

    state.seeds[plantId] = (state.seeds[plantId] || 0) + 1;

    state.selectedPlant = plantId;

    needsShopRender = true;

    state.legendaryEvent.stock--;

    markCollected('legendary', plantId);



    if (state.legendaryEvent.stock <= 0) {

      showToast(`${plant.name} achete! Stock epuise!`, 'legendary');

      setTimeout(() => {

        endLegendaryEvent();

        needsShopRender = true;

        needsRender = true;

      }, 1000);

    } else {

      showToast(`${plant.name} achete! ${state.legendaryEvent.stock} restant`, 'legendary');

    }



    needsRender = true;

    return;

  }



  const stock = state.market.stock[plantId] || 0;

  if (!state.unlockedPlants[plantId]) {

    showToast('Plante verrouillee');

    return;

  }

  if (stock <= 0) {

    showToast(`Rupture de stock! ${getTimeUntilRefresh()}`);

    return;

  }



  const cost = getPlantCost(plantId);

  if (state.coins < cost) {

    showToast(`Requis: ${cost} coins`);

    return;

  }



  state.coins -= cost;

  state.owned.plants[plantId] = (state.owned.plants[plantId] || 0) + 1;

  state.seeds[plantId] = (state.seeds[plantId] || 0) + 3;

  state.market.stock[plantId]--;

  state.selectedPlant = plantId;

  needsShopRender = true;

  markCollected('plants', plantId);



  showToast(`+3 ${plant.name} (stock: ${state.market.stock[plantId]})`);

  needsRender = true;

}



function buyBuilding(buildingId) {

  const building = BUILDINGS.find(b => b.id === buildingId);

  if (!building) return;



  const cost = getBuildingCost(buildingId);

  if (state.coins < cost) {

    showToast(`Requis: ${cost} coins`);

    return;

  }



  if (building.special === 'active') {

    const stock = state.market.buildingStock[buildingId] || 0;

    if (stock <= 0) {

      showToast('Rupture de stock');

      return;

    }

    state.market.buildingStock[buildingId] = stock - 1;

  }



  state.coins -= cost;

  state.owned.buildings[buildingId] = (state.owned.buildings[buildingId] || 0) + 1;

  markCollected('buildings', buildingId);



  if (isPlaceableBuilding(building)) {

    state.selectedBuilding = buildingId;

    showToast('Batiment achete, placez-le sur le terrain');

  } else {

    showToast(`Achat: ${building.name}`);

  }



  updateCPS();

  needsShopRender = true;

  needsRender = true;

}



function addCoins(amount) {

  state.coins += amount;

  state.lifetimeCoins += amount;

}



function markCollected(type, id) {

  if (!state.collection || !state.collection[type]) return;

  if (!state.collection[type][id]) {

    state.collection[type][id] = true;

  }

}



function updateCPS() {

  state.cps = 0;

  BUILDINGS.forEach(building => {

    if (!building.cps) return;

    const count = isPlaceableBuilding(building)

      ? getBuildingPlacedCount(building.id)

      : (state.owned.buildings[building.id] || 0);

    state.cps += building.cps * count;

  });



  if (state.prestige) {

    state.cps *= state.prestige.multiplier || 1;

  }



  // Check for Cosmic Cactus in garden (triples all passive gains)

  const hasCosmicCactus = state.garden.plots.some(p => p.plantId === 'cosmic_cactus' && p.ready);

  if (hasCosmicCactus) {

    state.cps *= 3.0;

  }

}



function expandGarden(newSize) {

  const upgrade = GARDEN_UPGRADES.find(u => u.size === newSize);

  if (!upgrade) return;



  if (state.coins < upgrade.cost) {

    showToast(`\u274C ${upgrade.cost}\uD83D\uDCB0 requis`);

    return;

  }



  if (state.lifetimeCoins < upgrade.unlock) {

    showToast(`\u274C D\u00E9bloquer \u00E0 ${upgrade.unlock}\uD83D\uDCB0 lifetime`);

    return;

  }



  state.coins -= upgrade.cost;

  const oldSize = state.garden.size;

  const newSize2 = newSize;



  const gardenEl = document.getElementById('garden');

  if (gardenEl) {

    gardenEl.classList.add('garden-expanding');

    setTimeout(() => gardenEl.classList.remove('garden-expanding'), 450);

  }



  // IMPORTANT: Repositionner les plantes existantes dans la nouvelle grille
  // Créer un nouveau tableau de plots vide
  const oldPlots = [...state.garden.plots];
  const newPlotCount = newSize2 * newSize2;
  const newPlots = [];

  const now = Date.now();

  // Initialiser tous les nouveaux plots comme vides
  for (let i = 0; i < newPlotCount; i++) {
    newPlots[i] = createEmptyPlot(now + 1200);
  }

  // Repositionner les anciennes plantes dans la nouvelle grille
  for (let oldIndex = 0; oldIndex < oldPlots.length; oldIndex++) {
    const oldPlot = oldPlots[oldIndex];

    // Calculer la position (row, col) dans l'ancienne grille
    const oldRow = Math.floor(oldIndex / oldSize);
    const oldCol = oldIndex % oldSize;

    // Calculer le nouvel index dans la nouvelle grille (même position row/col)
    const newIndex = oldRow * newSize2 + oldCol;

    // Copier le plot à sa nouvelle position
    if (newIndex < newPlotCount) {
      newPlots[newIndex] = { ...oldPlot };

      // Si c'est une plante multi-cases, mettre à jour les références
      if (oldPlot.mainPlotIndex !== null && oldPlot.mainPlotIndex !== undefined) {
        const mainOldRow = Math.floor(oldPlot.mainPlotIndex / oldSize);
        const mainOldCol = oldPlot.mainPlotIndex % oldSize;
        const mainNewIndex = mainOldRow * newSize2 + mainOldCol;
        newPlots[newIndex].mainPlotIndex = mainNewIndex;
      }

      // Si c'est un building multi-cases
      if (oldPlot.buildingMainPlotIndex !== null && oldPlot.buildingMainPlotIndex !== undefined) {
        const buildingMainOldRow = Math.floor(oldPlot.buildingMainPlotIndex / oldSize);
        const buildingMainOldCol = oldPlot.buildingMainPlotIndex % oldSize;
        const buildingMainNewIndex = buildingMainOldRow * newSize2 + buildingMainOldCol;
        newPlots[newIndex].buildingMainPlotIndex = buildingMainNewIndex;
      }
    }
  }

  // Remplacer l'ancien tableau par le nouveau
  state.garden.plots = newPlots;
  state.garden.size = newSize2;



  showToast(`\u2705 Jardin agrandi \u00E0 ${newSize2}x${newSize2} !`);

  needsRender = true;

}



function claimDailyBonus() {

  const now = Date.now();

  const dayInMs = 24 * 60 * 60 * 1000; // 24 heures



  if (!state.dailyBonus) {

    state.dailyBonus = { lastClaimed: 0, available: true };

  }



  const timeSinceLastClaim = now - state.dailyBonus.lastClaimed;



  if (timeSinceLastClaim >= dayInMs || state.dailyBonus.lastClaimed === 0) {

    addCoins(50);

    state.dailyBonus.lastClaimed = now;

    state.dailyBonus.available = false;

    showToast('\uD83C\uDF81 +50\uD83D\uDCB0 Bonus quotidien r\u00E9clam\u00E9 !');

    needsRender = true;

  } else {

    const timeRemaining = dayInMs - timeSinceLastClaim;

    const hoursLeft = Math.floor(timeRemaining / (60 * 60 * 1000));

    const minutesLeft = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    showToast(`\u23F0 Prochain bonus dans ${hoursLeft}h ${minutesLeft}m`);

  }

}



function checkDailyBonus() {

  if (!state.dailyBonus) {

    state.dailyBonus = { lastClaimed: 0, available: true };

  }



  const now = Date.now();

  const dayInMs = 24 * 60 * 60 * 1000;

  const timeSinceLastClaim = now - state.dailyBonus.lastClaimed;



  state.dailyBonus.available = (timeSinceLastClaim >= dayInMs || state.dailyBonus.lastClaimed === 0);

}



function checkDailyStreak() {

  if (!state.dailyStreak) {

    state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

  }



  const prevCanClaim = state.dailyStreak.canClaim;

  const now = Date.now();

  const dayInMs = 24 * 60 * 60 * 1000;

  const timeSinceLast = now - state.dailyStreak.lastClaim;



  // First time or can claim (more than 24h)

  if (state.dailyStreak.lastClaim === 0) {

    state.dailyStreak.canClaim = true;

    return;

  }



  // More than 48h = streak broken, reset to day 1

  if (timeSinceLast > dayInMs * 2) {

    state.dailyStreak.current = 0;

    state.dailyStreak.claimedDays = [];

    state.dailyStreak.canClaim = true;

    return;

  }



  // Can claim if more than 24h since last claim

  state.dailyStreak.canClaim = timeSinceLast >= dayInMs;

  if (prevCanClaim !== state.dailyStreak.canClaim) {

    needsCalendarRender = true;

  }

}



function claimDailyReward() {

  if (!state.dailyStreak.canClaim) {

    showToast('\u274C D\u00E9j\u00E0 r\u00E9clam\u00E9 aujourd\'hui!');

    return;

  }



  // Increment day

  state.dailyStreak.current++;



  // Reset to day 1 if completed 7 days

  if (state.dailyStreak.current > 7) {

    state.dailyStreak.current = 1;

    state.dailyStreak.claimedDays = [];

  }



  const reward = DAILY_REWARDS[state.dailyStreak.current - 1];



  // Give rewards

  addCoins(reward.coins);



  // Give random seeds

  const randomPlant = PLANTS[Math.floor(Math.random() * PLANTS.length)];

  state.seeds[randomPlant.id] = (state.seeds[randomPlant.id] || 0) + reward.seeds;

  markCollected('plants', randomPlant.id);



  // Special day 7 reward - guaranteed special plant

  if (reward.specialPlant) {

    // Give a random special plant

    const specialPlant = SPECIAL_PLANTS[Math.floor(Math.random() * SPECIAL_PLANTS.length)];

    state.specialPlants.inventory[specialPlant.id] =

      (state.specialPlants.inventory[specialPlant.id] || 0) + 1;

    markCollected('special', specialPlant.id);



    showDailyRewardModal(reward, specialPlant);

  } else {

    showDailyRewardModal(reward, null);

  }



  // Mark as claimed

  state.dailyStreak.claimedDays.push(state.dailyStreak.current);

  state.dailyStreak.lastClaim = Date.now();

  state.dailyStreak.canClaim = false;



  // Close the calendar modal

  closeDailyCalendarModal();

  needsCalendarRender = true;



}



function showDailyRewardModal(reward, specialPlant) {

  const overlay = document.createElement('div');

  overlay.className = 'daily-reward-modal';



  const specialContent = specialPlant ? `

    <div class="special-reward">

      <div class="special-reward-glow">\u2728</div>

      <div class="special-reward-plant">${specialPlant.name}</div>

      <div class="special-reward-desc">${specialPlant.desc}</div>

    </div>

  ` : '';



  overlay.innerHTML = `

    <div class="daily-reward-content">

      <div class="daily-reward-icon">${reward.icon}</div>

      <div class="daily-reward-title">Jour ${reward.day} - ${reward.desc}</div>

      <div class="daily-reward-items">

        <div class="reward-item">\uD83D\uDCB0 +${reward.coins} coins</div>

        <div class="reward-item">\uD83C\uDF31 +${reward.seeds} graines al\u00E9atoires</div>

      </div>

      ${specialContent}

      <button class="btn accent" onclick="this.parentElement.parentElement.remove()">

        Merci! \uD83C\uDF89

      </button>

    </div>

  `;



  document.body.appendChild(overlay);



  setTimeout(() => {

    if (overlay.parentElement) overlay.remove();

  }, 10000);

}



// === RENDER ===

function render() {

  setTextIfChanged(uiRefs.coins, Math.floor(state.coins).toString(), 'coinsText');

  setTextIfChanged(uiRefs.cps, state.cps.toFixed(1), 'cpsText');



  const selectedPlant = state.selectedPlant;

  const seedCount = state.seeds[selectedPlant] || 0;

  setTextIfChanged(uiRefs.seeds, seedCount.toString(), 'seedsText');



  // Market timer

  const marketTimerText = getTimeUntilRefresh();

  setTextIfChanged(uiRefs.marketTimer, marketTimerText, 'marketTimerText');



  // Update Harvest All button

  const readyCount = state.garden.plots.filter(p => p.ready && p.plantId).length;

  const harvestBtn = document.getElementById('harvest-all');

  if (readyCount > 0) {

    harvestBtn.textContent = `\uD83C\uDF3E R\u00E9colter Tout (${readyCount})`;

    harvestBtn.disabled = false;

    harvestBtn.style.opacity = '1';

  } else {

    harvestBtn.textContent = '\uD83C\uDF3E R\u00E9colter Tout';

    harvestBtn.disabled = true;

    harvestBtn.style.opacity = '0.5';

  }



  // Ancien bonus quotidien d\u00E9sactiv\u00E9 - voir calendrier en bas

  /*

  const bonusBtn = document.getElementById('daily-bonus');

  if (bonusBtn) {

    if (state.dailyBonus && state.dailyBonus.available) {

      bonusBtn.disabled = false;

      bonusBtn.style.background = '#FFD700';

      bonusBtn.style.color = '#333';

    } else {

      bonusBtn.disabled = true;

      bonusBtn.style.background = '';

      bonusBtn.style.color = '';

    }

  }

  */



  // Update garden size display

  const gardenSizeText = `${state.garden.size}x${state.garden.size}`;

  setTextIfChanged(uiRefs.gardenSize, gardenSizeText, 'gardenSizeText');



  renderAutomationStatus();

  renderActiveBuildings();

  renderSpecialPlantsInventory();

  renderBuildingInventory();

  renderGarden();

  renderGardenExpansion();

  renderWeeklyOffer();

  if (needsShopRender) {

    renderShopPlants();

    renderShopBuildings();

    // Render nocturnal plants
    if (typeof renderNocturnalPlantsInShop === 'function') {
      renderNocturnalPlantsInShop();
    }

    // Render employees in shop
    if (typeof renderEmployeesInShop === 'function') {
      renderEmployeesInShop();
    }

    needsShopRender = false;

    nextShopUnlock = getNextShopUnlock();

  }

  updateCategoryTabs();

  renderStats();

  renderPrestigePanel();

  if (needsCalendarRender) {

    renderDailyCalendar();

    needsCalendarRender = false;

  }

}



function fullRender() {

  render();

}



function renderAutomationStatus() {

  const container = document.getElementById('automation-status');

  container.innerHTML = '';



  // Check for automation buildings

  BUILDINGS.forEach(building => {

    const infoLine = building.special === 'active' ? building.desc : `Passif ${building.cps}/s`;



    if (building.special === 'automation') {

      const count = isPlaceableBuilding(building)

        ? getBuildingPlacedCount(building.id)

        : (state.owned.buildings[building.id] || 0);

      if (count > 0) {

        const totalCps = building.cps * count;

        const indicator = document.createElement('div');

        indicator.className = 'automation-indicator';

        indicator.innerHTML = `

          <div class="automation-icon">\u2699\uFE0F</div>

          <div class="automation-info">

            <div class="automation-name">${building.name} actif (x${count})</div>

            <div class="automation-desc">+${totalCps.toFixed(1)}/s automatique</div>

          </div>

        `;

        container.appendChild(indicator);

      }

    }

  });

}



function renderActiveBuildings() {

  const container = document.getElementById('active-buildings');

  if (!container) return;

  container.innerHTML = '';



  ACTIVE_BUILDINGS.forEach(building => {

    let owned = state.owned.buildings[building.id] || 0;

    const cooldownUntil = state.activeBuildingCooldowns[building.id] || 0;

    const remaining = Math.max(0, cooldownUntil - Date.now());

    const pending = state.activeBuildingPending[building.id] || 0;



    if (pending > 0 && remaining <= 0) {

      const newOwned = Math.max(0, owned - 1);

      state.owned.buildings[building.id] = newOwned;

      state.activeBuildingPending[building.id] = pending - 1;

      delete state.activeBuildingCooldowns[building.id];

      owned = newOwned;

    }



    if (owned <= 0) return;



    const row = document.createElement('div');

    row.className = 'active-building';

    const updatedCooldown = state.activeBuildingCooldowns[building.id] || 0;

    const updatedRemaining = Math.max(0, updatedCooldown - Date.now());

    const ready = updatedRemaining <= 0;



    row.innerHTML = `

      <div>

        <strong>${building.name}</strong> - ${building.desc}

        <div class="cooldown">x${owned} - ${ready ? 'Pret' : 'Cooldown ' + Math.ceil(updatedRemaining/1000) + 's'}</div>

      </div>

      <button class="btn" ${ready ? '' : 'disabled'} data-active-building="${building.id}">Activer</button>

    `;



    row.querySelector('button').addEventListener('click', () => activateBuilding(building.id));

    container.appendChild(row);

  });

}



function renderSpecialPlantsInventory() {

  const container = document.getElementById('special-plants-inventory');

  container.innerHTML = '';



  // Check if player has any special plants

  const hasSpecialPlants = Object.values(state.specialPlants.inventory).some(count => count > 0);



  if (!hasSpecialPlants) return;



  const inventoryDiv = document.createElement('div');

  inventoryDiv.className = 'special-plants-panel';

  inventoryDiv.innerHTML = '<div class="special-plants-title">\uD83C\uDF1F Plantes Sp\u00E9ciales</div>';



  const plantsContainer = document.createElement('div');

  plantsContainer.className = 'special-plants-list';



  SPECIAL_PLANTS.forEach(specialPlant => {

    const count = state.specialPlants.inventory[specialPlant.id] || 0;

    if (count > 0) {

      const plantItem = document.createElement('div');

      plantItem.className = state.selectedSpecialPlant === specialPlant.id

        ? 'special-plant-item selected'

        : 'special-plant-item';



      plantItem.innerHTML = `

        <div class="special-plant-icon">${specialPlant.name.split(' ')[0]}</div>

        <div class="special-plant-info">

          <div class="special-plant-name">${specialPlant.name}</div>

          <div class="special-plant-desc">${specialPlant.desc}</div>

          <div class="special-plant-count">\u00D7${count}</div>

        </div>

      `;



      plantItem.onclick = () => {

        // Toggle selection

        if (state.selectedSpecialPlant === specialPlant.id) {

          state.selectedSpecialPlant = null;

          showToast('Mode normal activ\u00E9');

        } else {

          state.selectedSpecialPlant = specialPlant.id;

          state.selectedBuilding = null;

          showToast(`${specialPlant.name} s\u00E9lectionn\u00E9e - Cliquez sur une parcelle vide`);

        }

        needsRender = true;

      };



      plantsContainer.appendChild(plantItem);

    }

  });



  inventoryDiv.appendChild(plantsContainer);

  container.appendChild(inventoryDiv);

}



function renderBuildingInventory() {

  const container = document.getElementById('building-inventory');

  if (!container) return;

  container.innerHTML = '';



  const placeableBuildings = BUILDINGS.filter(isPlaceableBuilding);

  const hasAvailable = placeableBuildings.some(b => getBuildingAvailableCount(b.id) > 0);

  if (!hasAvailable) return;



  const panel = document.createElement('div');

  panel.className = 'building-panel';

  panel.innerHTML = '<div class="building-panel-title">Batiments a placer</div>';



  const list = document.createElement('div');

  list.className = 'building-list';



  placeableBuildings.forEach(building => {

    const available = getBuildingAvailableCount(building.id);

    const placed = getBuildingPlacedCount(building.id);

    if (available <= 0) return;



    const item = document.createElement('div');

    item.className = 'building-item' + (state.selectedBuilding === building.id ? ' selected' : '');

    item.innerHTML = `

      <strong>${building.name}</strong><br>

      Dispo: ${available} | Place: ${placed}

    `;



    item.onclick = () => {

      if (state.selectedBuilding === building.id) {

        state.selectedBuilding = null;

        showToast('Mode plantation normal');

      } else {

        state.selectedBuilding = building.id;

        state.selectedSpecialPlant = null;

        showToast('Cliquez sur une parcelle vide pour placer');

      }

      needsRender = true;

    };



    list.appendChild(item);

  });



  panel.appendChild(list);

  panel.innerHTML += '<div class="building-hint">Les batiments occupent la place jusqu a suppression.</div>';

  container.appendChild(panel);

}



function renderGarden() {

  const garden = document.getElementById('garden');

  const now = Date.now();

  const lineBlocks = getLineBlockerLines();



  state.garden.plots.forEach((plot, index) => {

    let plotEl = garden.children[index];



    if (!plotEl) {

      plotEl = document.createElement('div');

      plotEl.className = 'plot';

    if (plot.newUntil && now < plot.newUntil) {

      plotEl.classList.add('plot-new');

    }

      garden.appendChild(plotEl);

    }



    plotEl.className = 'plot';



    if (plot.buildingId) {

      const building = getBuildingById(plot.buildingId);

      if (!building) {

        plot.buildingId = null;

        plot.buildingMainPlotIndex = null;

        plot.buildingIsMainPlot = false;

        plot.buildingOrientation = null;

        plotEl.innerHTML = '<div class="plot-name">Vide</div>';

        plotEl.onclick = () => plantSeed(index);

        return;

      }



      const isSecondaryPlot = plot.buildingMainPlotIndex !== null && plot.buildingMainPlotIndex !== index;

      plotEl.classList.add('building');



      if (isSecondaryPlot) {

        plotEl.innerHTML = `

          <div class="plot-icon-large">${building.name.split(' ')[0]}</div>

        `;

      } else {

        plotEl.innerHTML = `

          <div class="plot-icon">${building.name.split(' ')[0]}</div>

          <div class="plot-name">${building.name}</div>

          <div class="plot-timer">Cliquer pour retirer</div>

        `;

      }



      plotEl.onclick = () => {

        const mainIndex = plot.buildingMainPlotIndex !== null ? plot.buildingMainPlotIndex : index;

        openRemoveBuildingModal(mainIndex);

      };

    } else if (plot.plantId) {

      const plant = getPlotPlant(index);



      if (!plant) {

        // Plant not found, clear the plot

        plot.plantId = null;

        plot.plantedAt = null;

        plot.ready = false;
        plot.plantOrientation = null;

        plotEl.innerHTML = '<div class="plot-name">Vide</div>';

        plotEl.onclick = () => plantSeed(index);

        return;

      }



      // Check if this is a secondary plot (part of multi-size plant)
      const resolvedMainIndex = plant.size > 1 ? resolveMainPlotIndex(index, plant) : index;
      if (plant.size > 1) {
        plot.mainPlotIndex = resolvedMainIndex;
        plot.isMainPlot = resolvedMainIndex === index;
      } else {
        plot.mainPlotIndex = null;
        plot.isMainPlot = true;
      }
      const isSecondaryPlot = resolvedMainIndex !== index;



      // Check if this plot is boosted by adjacent booster plants

      const boosterMultiplier = calculateBoosterBonus(index);

      const isBoosted = boosterMultiplier > 1 && plot.plantId !== 'booster';



      // Add multi-plot class

      if (plant && plant.size > 1) {

        plotEl.classList.add('multi-plot');

      }



      if (plot.ready) {

        plotEl.classList.add('ready');

        if (isBoosted) plotEl.classList.add('boosted');



        let boosterIndicator = '';

        if (isBoosted && !isSecondaryPlot) {

          boosterIndicator = `<div class="booster-indicator">\uD83C\uDF1F +${Math.round((boosterMultiplier - 1) * 100)}%</div>`;

        }



        // Secondary plots show only icon

        if (isSecondaryPlot) {

          plotEl.innerHTML = `

            <div class="plot-icon-large">${getPlantEmoji(plant)}</div>

          `;

        } else {

          const plantEmoji = getPlantEmoji(plant);

          plotEl.innerHTML = `

            <div class="plot-icon">${plantEmoji}</div>

            <div class="plot-timer">\u2705 PR\u00CAT</div>

            ${boosterIndicator}

          `;

        }

      } else {

        plotEl.classList.add('growing');

        if (isBoosted) plotEl.classList.add('boosted');



        const elapsed = (now - plot.plantedAt) / 1000;

        const remaining = Math.max(0, plot.growTime - elapsed);



        let boosterIndicator = '';

        if (isBoosted && !isSecondaryPlot) {

          boosterIndicator = `<div class="booster-indicator">\uD83C\uDF1F</div>`;

        }



        // Secondary plots show only icon

        if (isSecondaryPlot) {

          plotEl.innerHTML = `

            <div class="plot-icon-large">${getPlantEmoji(plant)}</div>

          `;

        } else {

          const plantEmoji = getPlantEmoji(plant);

          plotEl.innerHTML = `

            <div class="plot-icon">${plantEmoji}</div>

            <div class="plot-timer">${Math.ceil(remaining)}s</div>

            ${boosterIndicator}

          `;

        }

      }



      plotEl.onclick = () => {
        if (plot.ready) {
          // Always harvest from main plot
          const harvestIndex = plot.mainPlotIndex !== null ? plot.mainPlotIndex : index;
          harvestPlot(harvestIndex);
        } else {
          const mainIndex = plot.mainPlotIndex !== null ? plot.mainPlotIndex : index;
          openRemovePlantModal(mainIndex);
        }
      };

    } else {

      const row = Math.floor(index / state.garden.size);

      const col = index % state.garden.size;

      const isBlocked = lineBlocks.rows.has(row) || lineBlocks.cols.has(col);



      if (isBlocked) {

        plotEl.classList.add('plot-blocked');

        plotEl.innerHTML = `

          <div class="plot-name">Bloque</div>

          <div class="plot-timer">Ligne active</div>

        `;

        plotEl.onclick = null;

      } else {

        plotEl.innerHTML = `

          <div class="plot-name">Vide</div>

          <div class="plot-timer">Cliquer</div>

        `;

        if (state.selectedBuilding) {

          plotEl.classList.add('placeable');

          plotEl.onclick = () => placeBuilding(index);

        } else {

          plotEl.onclick = () => plantSeed(index);

        }

      }

    }

  });



  // Utiliser la variable CSS pour la taille fixe des cases (85px)
  garden.style.setProperty('--garden-size', state.garden.size);
  garden.style.gridTemplateColumns = `repeat(${state.garden.size}, 85px)`;

}



function renderGardenExpansion() {

  const container = document.getElementById('garden-expand');

  const currentSize = state.garden.size;



  // Trouver la prochaine expansion disponible

  const nextUpgrade = GARDEN_UPGRADES.find(u => u.size > currentSize);



  if (!nextUpgrade) {

    container.innerHTML = '';

    return;

  }



  const canAfford = state.coins >= nextUpgrade.cost;

  const unlocked = state.lifetimeCoins >= nextUpgrade.unlock;



  if (!unlocked) {

    container.innerHTML = `

      <div style="padding: 10px; background: #f5f5f5; border-radius: 8px; text-align: center; font-size: 0.9em;">

        \uD83D\uDD12 Agrandir \u00E0 ${nextUpgrade.size}x${nextUpgrade.size}: D\u00E9bloquer \u00E0 ${nextUpgrade.unlock}\uD83D\uDCB0 lifetime

      </div>

    `;

    return;

  }



  container.innerHTML = `

    <button id="expand-garden-btn" class="btn" style="width: 100%; opacity: ${canAfford ? '1' : '0.5'}">

      \uD83D\uDCD0 Agrandir \u00E0 ${nextUpgrade.size}x${nextUpgrade.size} (${nextUpgrade.cost}\uD83D\uDCB0)

    </button>

  `;



  const btn = document.getElementById('expand-garden-btn');

  if (btn) {

    btn.onclick = () => expandGarden(nextUpgrade.size);

  }

}



function unlockCategory(category) {

  const unlock = CATEGORY_UNLOCKS[category];

  if (!unlock || state.categoryUnlocks[category]) return;

  if (state.coins < unlock.cost) {

    showToast(`Requis: ${unlock.cost} coins`);

    return;

  }

  state.coins -= unlock.cost;

  state.categoryUnlocks[category] = true;

  showToast(`Categorie debloquee: ${category}`);

  needsRender = true;

  needsShopRender = true;

}



function unlockPlant(plantId) {

  const plant = PLANTS.find(p => p.id === plantId);

  if (!plant || state.unlockedPlants[plantId]) return;

  const unlockCost = Math.floor(plant.cost * 5);

  if (state.coins < unlockCost) {

    showToast(`Requis: ${unlockCost} coins`);

    return;

  }

  state.coins -= unlockCost;

  state.unlockedPlants[plantId] = true;

  showToast(`Plante debloquee: ${plant.name}`);

  needsRender = true;

  needsShopRender = true;

}



function openCategoryUnlockModal(category) {

  const unlock = CATEGORY_UNLOCKS[category];

  if (!unlock) return;

  const modal = document.getElementById('category-unlock-modal');

  const title = document.getElementById('category-unlock-title');

  const desc = document.getElementById('category-unlock-desc');

  const confirm = document.getElementById('category-unlock-confirm');

  if (!modal || !title || !desc || !confirm) return;



  title.textContent = `Debloquer ${category}`;

  desc.textContent = `Cout: ${unlock.cost} coins`;

  confirm.onclick = () => {

    unlockCategory(category);

    closeCategoryUnlockModal();

  };

  modal.classList.add('show');

}



function closeCategoryUnlockModal() {

  const modal = document.getElementById('category-unlock-modal');

  if (modal) modal.classList.remove('show');

}



function updateCategoryTabs() {

  document.querySelectorAll('.tab').forEach(tab => {

    const tabName = tab.dataset.tab;

    if (!tabName) return;

    if (!state.categoryUnlocks[tabName]) {

      tab.classList.add('locked');

    } else {

      tab.classList.remove('locked');

    }

  });

}



function renderShopCategoryLocks() {

  ['fruit', 'legume', 'buildings'].forEach(category => {

    const container = document.getElementById(`shop-${category}`);

    if (!container) return;

    if (!state.categoryUnlocks[category]) {

      const unlock = CATEGORY_UNLOCKS[category];

      container.innerHTML = `

        <div class="shop-item">

          <div class="shop-item-info">

            <h3>&#128274; Categorie verrouillee</h3>

            <p>Debloquer ${category} pour ${unlock.cost} coins</p>

          </div>

          <div class="shop-item-buy">

            <button class="btn" onclick="unlockCategory('${category}')">&#128275; Debloquer</button>

          </div>

        </div>

      `;

    }

  });

}



function renderWeeklyOffer() {

  const container = document.getElementById('weekly-offer');

  if (!container) return;

  if (!state.market.weekly || !state.market.weekly.itemId) {

    container.innerHTML = '';

    return;

  }



  const weekly = state.market.weekly;

  const price = getWeeklyPrice();

  const timeLeft = Math.max(0, weekly.nextRotation - Date.now());

  const hours = Math.floor(timeLeft / 3600000);

  const minutes = Math.floor((timeLeft % 3600000) / 60000);

  const tag = `HEBDO -${Math.round((1 - weekly.discount) * 100)}%`;

  let name = weekly.itemId;

  let desc = '';



  if (weekly.type === 'special') {

    const special = SPECIAL_PLANTS.find(p => p.id === weekly.itemId);

    if (special) {

      name = special.name;

      desc = special.desc;

    }

  } else {

    const building = getBuildingById(weekly.itemId);

    if (building) {

      name = building.name;

      desc = building.desc || `Passif ${building.cps}/s`;

    }

  }



  const canBuy = state.coins >= price && weekly.stock > 0;

  container.innerHTML = `

    <div class="weekly-card">

      <div>

        <div class="weekly-title">Offre hebdo</div>

        <div><strong>${name}</strong></div>

        <div class="weekly-desc">${desc}</div>

        <div class="weekly-desc">Stock: ${weekly.stock} | Reset: ${hours}h ${minutes}m</div>

      </div>

      <div>

        <div class="weekly-tag">${tag}</div>

        <div style="margin:8px 0; font-weight:700;">${price} coins</div>

        <button id="buy-weekly" class="btn" ${canBuy ? '' : 'disabled'}>Acheter</button>

      </div>

    </div>

  `;

}

function getPlantEmoji(plant) {
  if (!plant) return '';
  if (PLANT_EMOJIS[plant.id]) return PLANT_EMOJIS[plant.id];
  const firstToken = (plant.name || '').split(' ')[0];
  return firstToken;
}

function getPlantById(plantId) {
  return PLANTS.find(p => p.id === plantId) ||
         SPECIAL_PLANTS.find(p => p.id === plantId) ||
         getLegendaryPlantById(plantId);
}

function getPlotPlant(plotIndex) {
  const plot = state.garden.plots[plotIndex];
  if (!plot || !plot.plantId) return null;
  const base = getPlantById(plot.plantId);
  if (!base) return null;
  const orientation = plot.plantOrientation || base.orientation;
  if (!orientation || orientation === base.orientation) return base;
  return { ...base, orientation };
}

function renderShopPlants() {
  const plantEmojis = PLANT_EMOJIS;
  // Render plants for each category

  ['plante', 'fruit', 'legume'].forEach(category => {

    const container = document.getElementById(`shop-${category}`);

    if (!container) return;



    container.innerHTML = '';



    // Add legendary plant if active and matches this category

    if (state.legendaryEvent.active && state.legendaryEvent.plant) {

      const legendaryPlant = getLegendaryPlantById(state.legendaryEvent.plant);



      // Show legendary plant in plante category (or all categories)

      if (category === 'plante') {

        const timeLeft = Math.max(0, state.legendaryEvent.endTime - Date.now());

        const minutes = Math.floor(timeLeft / 60000);

        const seconds = Math.floor((timeLeft % 60000) / 1000);



        const legendaryItem = document.createElement('div');

        legendaryItem.className = 'shop-item legendary-shop-item';

        legendaryItem.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        legendaryItem.style.border = '3px solid gold';

        legendaryItem.style.animation = 'pulse 2s infinite';



        const canAfford = state.coins >= legendaryPlant.cost;

        const stockRemaining = state.legendaryEvent.stock || 0;

        const canBuy = canAfford && stockRemaining > 0;



        legendaryItem.innerHTML = `

          <div class="legendary-banner">

            EVENT LEGENDAIRE ${minutes}:${seconds.toString().padStart(2, '0')}

          </div>

          <div class="shop-item-info">

            <h3 style="color: gold; font-size: 1.3em;">${legendaryPlant.name}</h3>

            <p style="color: white; font-weight: bold;">${legendaryPlant.desc}</p>

            <p style="color: #ffd700;">Temps ${legendaryPlant.growTime}s - Rendement ${legendaryPlant.yield}</p>

            <p style="color: ${stockRemaining > 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;">Stock: ${stockRemaining}</p>

          </div>

          <div class="shop-item-buy">

            <span class="price" style="color: gold; font-size: 1.2em;">${legendaryPlant.cost} coins</span>

            <button class="btn buy-plant-btn" data-plant-id="${legendaryPlant.id}" ${canBuy ? '' : 'disabled'} style="background: gold; color: #333; opacity: ${canBuy ? '1' : '0.5'}; cursor: pointer; font-weight: bold;">

              &#128722; +1 graine

            </button>

          </div>

        `;



        container.appendChild(legendaryItem);

      }

    }



    PLANTS.filter(p => p.category === category).forEach(plant => {

      const owned = state.owned.plants[plant.id] || 0;

      const cost = getPlantCost(plant.id);

      const modifier = getPriceModifier('plants', plant.id);

      const modifierLabel = getModifierLabel(modifier);

      const unlocked = !!state.unlockedPlants[plant.id];

      const canAfford = state.coins >= cost;

      const stock = state.market.stock[plant.id] || 0;



      const item = document.createElement('div');

      item.className = 'shop-item';



      if (!unlocked) {

        const unlockCost = Math.floor(plant.cost * 5);

        item.style.opacity = '0.8';

        item.innerHTML = `

          <div class="shop-item-info">

            <h3>&#128274; ${plant.name}</h3>

            <p style="font-size:0.85em;">Debloquer: ${unlockCost} coins</p>

          </div>

          <div class="shop-item-buy">

            <button class="btn" onclick="unlockPlant('${plant.id}')">&#128275; Debloquer</button>

          </div>

        `;

        container.appendChild(item);

        return;

      }



      const isSelected = state.selectedPlant === plant.id;

      const seedCount = state.seeds[plant.id] || 0;



      // Stock indicator color

      let stockColor = '#4CAF50';

      if (stock <= 3) stockColor = '#f44336';

      else if (stock <= 7) stockColor = '#FF9800';



      const emoji = getPlantEmoji(plant) ? `${getPlantEmoji(plant)} ` : '';

      item.innerHTML = `

        <div class="shop-item-info">

          <h3>${emoji}${plant.name} ${isSelected ? '\u2705' : ''}</h3>

          <p>\u23F1\uFE0F ${plant.growTime}s \u2192 \uD83D\uDCB0 ${plant.yield}</p>

          <p><strong>\uD83C\uDF31 Mes graines: ${seedCount}</strong></p>

          <p style="color:${stockColor}; font-weight:bold; font-size:0.9em;">\uD83D\uDCE6 Stock: ${stock}</p>

        </div>

        <div class="shop-item-buy">

          <span class="price">${cost} \uD83D\uDCB0</span>

          <button class="btn buy-plant-btn" data-plant-id="${plant.id}" ${canAfford && stock > 0 ? '' : 'disabled'} style="opacity: ${canAfford && stock > 0 ? '1' : '0.5'}; cursor: pointer;">

            &#128722; +3 graines

          </button>

        </div>

      `;



      if (modifierLabel) {

        const priceEl = item.querySelector('.price');

        if (priceEl) {

          priceEl.title = modifierLabel;

        }

        const buy = item.querySelector('.shop-item-buy');

        if (buy) {

          const badge = document.createElement('div');

          badge.className = `price-badge ${modifier < 1 ? 'promo' : 'hike'}`;

          badge.textContent = modifierLabel;

          buy.insertBefore(badge, buy.firstChild);

        }

      }

      container.appendChild(item);

    });

  });

}



function renderShopBuildings() {

  const container = document.getElementById('shop-buildings');

  container.innerHTML = '';



  BUILDINGS.forEach(building => {

    const infoLine = building.special === 'active' ? building.desc : `Passif ${building.cps}/s`;

    const activeStock = building.special === 'active' ? (state.market.buildingStock[building.id] || 0) : null;



    const owned = state.owned.buildings[building.id] || 0;

    const cost = getBuildingCost(building.id);

    const modifier = getPriceModifier('buildings', building.id);

    const modifierLabel = getModifierLabel(modifier);

    const unlocked = state.lifetimeCoins >= building.unlock;

    let canAfford = state.coins >= cost;

    if (building.special === 'active') {

      canAfford = canAfford && activeStock > 0;

    }



    const item = document.createElement('div');

    item.className = 'shop-item';



    if (!unlocked) {

      item.style.opacity = '0.5';

      item.innerHTML = `

        <div class="shop-item-info">

          <h3>\uD83D\uDD12 ${building.name}</h3>

          <p style="font-size:0.85em;">D\u00E9bloquer: ${building.unlock} coins</p>

        </div>

      `;

      container.appendChild(item);

      return;

    }



    item.innerHTML = `

      <div class="shop-item-info">

        <h3>${building.name}</h3>

        <p>${infoLine}</p>

        ${building.special === 'active' ? `<p>Stock: ${activeStock}</p>` : ''}

        <p><strong>Poss\u00E9d\u00E9: ${owned}</strong></p>

      </div>

      <div class="shop-item-buy">

        <span class="price">${cost} \uD83D\uDCB0</span>

        <button class="btn buy-building-btn" data-building-id="${building.id}" ${canAfford ? '' : 'disabled'} style="opacity: ${canAfford ? '1' : '0.5'}; cursor: pointer;">

          &#128722; Acheter

        </button>

      </div>

    `;



    if (modifierLabel) {

      const priceEl = item.querySelector('.price');

      if (priceEl) {

        priceEl.title = modifierLabel;

      }

      const buy = item.querySelector('.shop-item-buy');

      if (buy) {

        const badge = document.createElement('div');

        badge.className = `price-badge ${modifier < 1 ? 'promo' : 'hike'}`;

        badge.textContent = modifierLabel;

        buy.insertBefore(badge, buy.firstChild);

      }

    }

    container.appendChild(item);

  });

}



function updateShopAffordability() {

  document.querySelectorAll('.buy-plant-btn').forEach(btn => {

    const plantId = btn.dataset.plantId;

    if (!plantId) return;



    const legendaryPlant = getLegendaryPlantById(plantId);

    let canBuy = false;



    if (legendaryPlant && state.legendaryEvent.active && state.legendaryEvent.plant === plantId) {

      canBuy = state.coins >= legendaryPlant.cost && (state.legendaryEvent.stock || 0) > 0;

    } else {

      const plant = PLANTS.find(p => p.id === plantId);

      if (plant) {

        const cost = getPlantCost(plantId);

        const stock = state.market.stock[plantId] || 0;

        canBuy = state.coins >= cost && stock > 0;

      }

    }



    btn.disabled = !canBuy;

    btn.style.opacity = canBuy ? '1' : '0.5';

  });



  document.querySelectorAll('.buy-building-btn').forEach(btn => {

    const buildingId = btn.dataset.buildingId;

    const building = BUILDINGS.find(b => b.id === buildingId);

    if (!building) return;



    const cost = getBuildingCost(buildingId);

    let canBuy = state.coins >= cost;

    if (building.special === 'active') {

      const stock = state.market.buildingStock[buildingId] || 0;

      canBuy = canBuy && stock > 0;

    }



    btn.disabled = !canBuy;

    btn.style.opacity = canBuy ? '1' : '0.5';

  });

}



function updateLegendaryShopTimer() {

  if (!state.legendaryEvent.active) return;

  const banner = document.querySelector('.legendary-banner');

  if (!banner) return;



  const timeLeft = Math.max(0, state.legendaryEvent.endTime - Date.now());

  const minutes = Math.floor(timeLeft / 60000);

  const seconds = Math.floor((timeLeft % 60000) / 1000);

  banner.textContent = `EVENT LEGENDAIRE ${minutes}:${seconds.toString().padStart(2, '0')}`;

}



function getNextShopUnlock() {

  let next = null;



  PLANTS.forEach(plant => {

    if (state.lifetimeCoins < plant.unlock) {

      next = next === null ? plant.unlock : Math.min(next, plant.unlock);

    }

  });



  BUILDINGS.forEach(building => {

    const infoLine = building.special === 'active' ? building.desc : `Passif ${building.cps}/s`;



    if (state.lifetimeCoins < building.unlock) {

      next = next === null ? building.unlock : Math.min(next, building.unlock);

    }

  });



  return next;

}



function activateBuilding(buildingId) {

  const building = ACTIVE_BUILDINGS.find(b => b.id === buildingId);

  if (!building) return;

  const owned = state.owned.buildings[building.id] || 0;

  if (owned <= 0) return;

  const pending = state.activeBuildingPending[building.id] || 0;

  if (owned - pending <= 0) return;



  const cooldownUntil = state.activeBuildingCooldowns[building.id] || 0;

  if (Date.now() < cooldownUntil) return;



  if (building.effect === 'water') {

    state.garden.plots.forEach(plot => {

      if (plot.plantId && !plot.ready && plot.plantedAt && plot.growTime) {

        const elapsed = (Date.now() - plot.plantedAt) / 1000;

        const remaining = Math.max(0, plot.growTime - elapsed);

        plot.plantedAt = Date.now() - (plot.growTime - remaining * 0.5) * 1000;

      }

    });

    showToast('Arrosage: croissance acceleree');

  } else if (building.effect === 'fertilize') {

    state.activeEffects.fertilize = 1;

    showToast('Engrais: prochain rendement x1.5');

  } else if (building.effect === 'boost') {

    state.activeEffects.boostUntil = Date.now() + (building.duration * 1000);

    showToast('Lampe UV: croissance x2');

  }



  state.activeBuildingPending[building.id] = (state.activeBuildingPending[building.id] || 0) + 1;

  state.activeBuildingCooldowns[building.id] = Date.now() + (building.cooldown * 1000);

  needsShopRender = true;

  needsRender = true;

}



function renderStats() {

  const container = document.getElementById('stats');



  // Achievements progress

  const unlockedCount = state.achievements.unlocked.length;

  const totalCount = ACHIEVEMENTS.length;

  const achievementProgress = (unlockedCount / totalCount * 100).toFixed(0);



  // Calculate hourly rate

  const coinsPerHour = (state.cps * 3600).toFixed(0);

  const prestigeLevel = state.prestige ? state.prestige.level : 0;

  const prestigeMult = state.prestige ? state.prestige.multiplier : 1;



  container.innerHTML = `

    <div><span>\uD83D\uDCB0 Coins</span><span>${Math.floor(state.coins)}</span></div>

    <div><span>\uD83D\uDC8E Lifetime</span><span>${Math.floor(state.lifetimeCoins)}</span></div>

    <div><span>\uD83C\uDF3E R\u00E9coltes</span><span>${state.totalHarvests}</span></div>

    <div><span>Prestige</span><span>Niv ${prestigeLevel} (x${prestigeMult.toFixed(2)})</span></div>

    <div><span>\u26A1 Coins/s</span><span style="font-weight: bold; color: #4CAF50;">${state.cps.toFixed(1)}</span></div>

    <div><span>\uD83D\uDCC8 Coins/h</span><span style="color: #2196F3;">${coinsPerHour}</span></div>

    <div><span>\uD83C\uDFC6 Achievements</span><span>${unlockedCount}/${totalCount}</span></div>

    <div style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #eee;">

      <button id="view-achievements" class="btn" style="width: 100%; padding: 8px; font-size: 0.9em;">

        \uD83C\uDFC6 Voir Achievements

      </button>

    </div>

  `;

}



function renderDailyCalendar() {

  const container = document.getElementById('daily-calendar');

  if (!container) return;



  // Force init streak

  if (!state.dailyStreak || typeof state.dailyStreak.current === 'undefined') {

    state.dailyStreak = {

      current: 0,

      lastClaim: 0,

      canClaim: true,

      claimedDays: []

    };

  }



  // Ensure claimedDays array exists

  if (!state.dailyStreak.claimedDays || !Array.isArray(state.dailyStreak.claimedDays)) {

    state.dailyStreak.claimedDays = [];

  }



  // Fix corrupted state: if current is 0 and canClaim is false, reset

  if (state.dailyStreak.current === 0 && state.dailyStreak.lastClaim === 0 && !state.dailyStreak.canClaim) {

    state.dailyStreak.canClaim = true;

  }



  // Clear container

  container.innerHTML = '';



  // Force horizontal layout on container

  container.style.display = 'grid';

  container.style.gridTemplateColumns = 'repeat(7, 1fr)';

  container.style.gap = '10px';



  // Add 7 days

  for (let i = 0; i < 7; i++) {

    const reward = DAILY_REWARDS[i];

    const day = i + 1;



    const dayDiv = document.createElement('div');

    dayDiv.className = 'calendar-day';



    // Check status

    const claimed = state.dailyStreak.claimedDays.includes(day);

    const available = (state.dailyStreak.current + 1 === day) && state.dailyStreak.canClaim;



    if (claimed) {

      dayDiv.classList.add('claimed');

    } else if (available) {

      dayDiv.classList.add('available');

      dayDiv.dataset.available = 'true';

      // Add direct click handler for available days

      dayDiv.onclick = () => claimDailyReward();

      dayDiv.style.cursor = 'pointer';

    } else {

      dayDiv.classList.add('locked');

    }



    dayDiv.dataset.day = day;



    // Content

    dayDiv.innerHTML =

      '<div class="day-number">Jour ' + day + '</div>' +

      '<div class="day-icon">' + reward.icon + '</div>' +

      '<div class="reward-preview">' +

        '<div class="reward-line">\uD83D\uDCB0 ' + reward.coins + '</div>' +

        '<div class="reward-line">\uD83C\uDF31 ' + reward.seeds + '</div>' +

        (reward.specialPlant ? '<div class="special-tag">\uD83C\uDF1F</div>' : '') +

      '</div>' +

      (claimed ? '<div class="claimed-check">\u2705</div>' : '') +

      (available ? '<div class="click-hint">\uD83D\uDC46 CLIQUER</div>' : '');



    container.appendChild(dayDiv);

  }



  // Create info below calendar

  const info = document.createElement('div');

  info.className = 'calendar-info';

  info.style.gridColumn = '1 / -1';

  info.style.marginTop = '15px';

  info.innerHTML =

    '<div class="streak-info">\uD83D\uDD25 Streak: ' + state.dailyStreak.current + ' jour' + (state.dailyStreak.current > 1 ? 's' : '') + '</div>' +

    (state.dailyStreak.canClaim ?

      '<div class="can-claim-text">\u2728 Bonus disponible!</div>' :

      '<div class="next-claim-text">\u23F0 Reviens demain</div>');



  container.appendChild(info);

}

function showToast(message) {

  const container = document.getElementById('toasts');

  const toast = document.createElement('div');

  toast.className = 'toast';

  toast.textContent = message;

  container.appendChild(toast);



  setTimeout(() => {

    toast.style.opacity = '0';

    setTimeout(() => toast.remove(), 300);

  }, 2500);

}



function showOfflineModal(offlineTimeSeconds, coinsEarned, cpsRate) {

  const modal = document.getElementById('offline-modal');



  // Format time display

  let timeText;

  if (offlineTimeSeconds < 3600) {

    const minutes = Math.floor(offlineTimeSeconds / 60);

    timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`;

  } else {

    const hours = Math.floor(offlineTimeSeconds / 3600);

    const minutes = Math.floor((offlineTimeSeconds % 3600) / 60);

    timeText = `${hours}h ${minutes}min`;

  }



  // Update modal content

  document.getElementById('offline-time').textContent = timeText;

  document.getElementById('offline-rate').textContent = `${cpsRate.toFixed(1)}/s`;

  document.getElementById('offline-coins').textContent = `+${Math.floor(coinsEarned)} \uD83D\uDCB0`;



  // Show modal

  modal.classList.add('show');



  // Store coins to be claimed

  modal.dataset.coins = coinsEarned;

}



function claimOfflineReward() {

  const modal = document.getElementById('offline-modal');

  const coinsEarned = parseFloat(modal.dataset.coins || 0);



  if (coinsEarned > 0) {

    state.coins += coinsEarned;

    state.lifetimeCoins += coinsEarned;

    needsRender = true;

  }



  // Hide modal

  modal.classList.remove('show');



  showToast(`\u2728 ${Math.floor(coinsEarned)} coins r\u00E9clam\u00E9s !`);

}



function showAchievementsModal() {

  const modal = document.getElementById('achievements-modal');

  const list = document.getElementById('achievements-list');



  list.innerHTML = `

    <div class="achievement-filters">

      <button class="achievement-filter-btn" data-filter="all">Tous</button>

      <button class="achievement-filter-btn" data-filter="unlocked">Debloques</button>

      <button class="achievement-filter-btn" data-filter="locked">Verrouilles</button>

    </div>

    <div id="achievements-items"></div>

  `;



  const items = document.getElementById('achievements-items');

  renderAchievementsList(items);



  list.querySelectorAll('.achievement-filter-btn').forEach(btn => {

    if (btn.dataset.filter === state.achievementsFilter) {

      btn.classList.add('active');

    }

    btn.addEventListener('click', () => {

      state.achievementsFilter = btn.dataset.filter || 'all';

      renderAchievementsList(items);

      list.querySelectorAll('.achievement-filter-btn').forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

    });

  });



  modal.classList.add('show');

}



function renderAchievementsList(container) {

  if (!container) return;

  container.innerHTML = '';



  ACHIEVEMENTS.forEach(achievement => {

    const isUnlocked = state.achievements.unlocked.includes(achievement.id);

    if (state.achievementsFilter === 'unlocked' && !isUnlocked) return;

    if (state.achievementsFilter === 'locked' && isUnlocked) return;



    const icon = isUnlocked ? '\uD83C\uDFC6' : '\uD83D\uDD12';

    const item = document.createElement('div');

    item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;

    item.innerHTML = `

      <div class="achievement-icon">${icon}</div>

      <div class="achievement-info">

        <div class="achievement-name">${achievement.name}</div>

        <div class="achievement-desc">${achievement.desc}</div>

      </div>

      <div class="achievement-reward">+${achievement.reward} coins</div>

    `;

    container.appendChild(item);

  });

}



function closeAchievementsModal() {

  document.getElementById('achievements-modal').classList.remove('show');

}



function openDailyCalendarModal() {

  needsCalendarRender = true;

  renderDailyCalendar();

  document.getElementById('daily-calendar-modal').classList.add('show');

}



function closeDailyCalendarModal() {

  document.getElementById('daily-calendar-modal').classList.remove('show');

}



function applyTheme(theme) {

  const resolved = theme === 'dark' ? 'dark' : 'light';

  document.body.dataset.theme = resolved;



  const toggle = document.getElementById('theme-toggle');

  if (toggle) {

    toggle.textContent = resolved === 'dark' ? 'Sombre' : 'Clair';

    toggle.classList.toggle('is-dark', resolved === 'dark');

  }

}



function loadTheme() {

  const saved = localStorage.getItem(THEME_STORAGE_KEY);

  applyTheme(saved || 'light');

}



function toggleTheme() {

  const current = document.body.dataset.theme === 'dark' ? 'dark' : 'light';

  const next = current === 'dark' ? 'light' : 'dark';

  localStorage.setItem(THEME_STORAGE_KEY, next);

  applyTheme(next);

}



function openSettingsModal() {

  const modal = document.getElementById('settings-modal');

  if (modal) modal.classList.add('show');

}



function closeSettingsModal() {

  const modal = document.getElementById('settings-modal');

  if (modal) modal.classList.remove('show');

}



function openPrestigeModal() {

  const modal = document.getElementById('prestige-modal');

  if (!modal) return;

  modal.classList.add('show');

}



function closePrestigeModal() {

  const modal = document.getElementById('prestige-modal');

  if (modal) modal.classList.remove('show');

}



function renderPrestigePanel() {

  const info = document.getElementById('prestige-info');

  const btn = document.getElementById('prestige-btn');

  if (!info || !btn) return;



  const cost = getPrestigeCost();

  const nextLevel = state.prestige.level + 1;

  const nextMult = getPrestigeMultiplier(nextLevel);

  const can = canPrestige();

  info.textContent = `Niv ${state.prestige.level} - Bonus actuel x${state.prestige.multiplier.toFixed(2)} | Prochain: x${nextMult.toFixed(2)} (${cost} coins lifetime)`;

  btn.disabled = !can;

  btn.style.opacity = can ? '1' : '0.5';

}



function applyPrestigeReset() {

  if (!canPrestige()) {

    showToast('Prestige indisponible');

    return;

  }



  const newLevel = state.prestige.level + 1;

  const newMultiplier = getPrestigeMultiplier(newLevel);



  const preservedCollection = state.collection;

  const preservedAchievements = state.achievements;

  const preservedAchievementFilter = state.achievementsFilter;

  const preservedUsedCodes = state.usedSeedCodes;



  state.coins = 30;

  state.lifetimeCoins = 0;

  state.totalHarvests = 0;

  state.cps = 0;

  state.garden.size = 3;

  state.garden.plots = [];

  for (let i = 0; i < state.garden.size * state.garden.size; i++) {

    state.garden.plots[i] = createEmptyPlot();

  }

  state.owned = { plants: {}, buildings: {} };

  state.buildingInventory = {};

  state.placedBuildings = [];

  state.selectedBuilding = null;

  state.pendingBuildingRemoval = null;
  state.pendingPlantRemoval = null;

  state.seeds = { grass: 3 };

  state.market = {

    lastRefresh: Date.now(),

    nextRefresh: Date.now() + MARKET_REFRESH_INTERVAL,

    stock: {},

    buildingStock: {},

    priceModifiers: {},

    weekly: {

      itemId: null,

      type: null,

      discount: 1,

      stock: 0,

      nextRotation: Date.now() + WEEKLY_REFRESH_INTERVAL

    }

  };

  state.legendaryEvent = {

    active: false,

    plant: null,

    startTime: 0,

    endTime: 0,

    stock: 0,

    nextEventCheck: Date.now() + (10 * 60 * 1000)

  };

  state.selectedPlant = 'grass';

  state.selectedSpecialPlant = null;

  state.unlockedPlants = { grass: true };

  state.categoryUnlocks = { plante: true, fruit: false, legume: false, buildings: false, employees: true, nocturnal: true };

  state.combo = { count: 0, lastHarvest: 0, multiplier: 1 };

  state.dailyBonus = { lastClaimed: 0, available: true };

  state.season = {

    current: 0,

    startTime: Date.now(),

    nextChange: Date.now() + SEASONS[0].duration

  };

  state.weather = {

    current: 'sun',

    startTime: Date.now(),

    nextChange: Date.now() + (5 * 60 * 1000)

  };

  state.activeEffects = { fertilize: 0, boostUntil: 0 };

  state.activeBuildingCooldowns = {};

  state.activeBuildingPending = {};

  state.seasonalEvent = {

    active: false,

    type: null,

    name: '',

    desc: '',

    endTime: 0,

    nextCheck: Date.now() + (2 * 60 * 1000)

  };

  state.seasonHazard = { lastCheck: 0 };

  state.specialPlants = { inventory: {} };

  state.autoHarvest = { lastRun: 0 };

  state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

  state.prestige = { level: newLevel, multiplier: newMultiplier };

  state.collection = preservedCollection;

  state.achievements = preservedAchievements;

  state.achievementsFilter = preservedAchievementFilter;

  state.usedSeedCodes = preservedUsedCodes;



  refreshMarket();

  updateCPS();

  needsShopRender = true;

  needsRender = true;

  needsCalendarRender = true;



  showToast(`Prestige niveau ${newLevel} obtenu !`);

}



function openCollectionModal() {

  renderCollection();

  const modal = document.getElementById('collection-modal');

  if (modal) modal.classList.add('show');

}



function closeCollectionModal() {

  const modal = document.getElementById('collection-modal');

  if (modal) modal.classList.remove('show');

}



function renderCollection() {

  const summary = document.getElementById('collection-summary');

  const list = document.getElementById('collection-list');

  if (!summary || !list) return;



  const groups = [

    { key: 'plants', label: 'Plantes', items: PLANTS },

    { key: 'special', label: 'Speciales', items: SPECIAL_PLANTS },

    { key: 'legendary', label: 'Legendaires', items: LEGENDARY_PLANTS },

    { key: 'buildings', label: 'Batiments', items: BUILDINGS }

  ];



  summary.innerHTML = '';

  list.innerHTML = '';



  groups.forEach(group => {

    const collected = group.items.filter(item => state.collection[group.key] && state.collection[group.key][item.id]).length;

    const total = group.items.length;

    const pill = document.createElement('div');

    pill.className = 'pill';

    pill.textContent = `${group.label}: ${collected}/${total}`;

    summary.appendChild(pill);



    const groupEl = document.createElement('div');

    groupEl.className = 'collection-group';

    groupEl.innerHTML = `<h4>${group.label}</h4>`;

    const itemsEl = document.createElement('div');

    itemsEl.className = 'collection-items';



    group.items.forEach(item => {

      const isCollected = state.collection[group.key] && state.collection[group.key][item.id];

      const entry = document.createElement('div');

      entry.className = 'collection-item' + (isCollected ? '' : ' locked');

      entry.textContent = isCollected ? item.name : '???';

      itemsEl.appendChild(entry);

    });



    groupEl.appendChild(itemsEl);

    list.appendChild(groupEl);

  });

}



function openSocialModal() {

  renderLeaderboard();

  populateSeedCodeOptions();

  const modal = document.getElementById('social-modal');

  if (modal) modal.classList.add('show');

}



function closeSocialModal() {

  const modal = document.getElementById('social-modal');

  if (modal) modal.classList.remove('show');

}



function updateLeaderboard() {

  const data = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY) || '{}');

  data.bestCoins = Math.max(data.bestCoins || 0, Math.floor(state.coins));

  data.bestLifetime = Math.max(data.bestLifetime || 0, Math.floor(state.lifetimeCoins));

  data.bestHarvests = Math.max(data.bestHarvests || 0, state.totalHarvests);

  data.lastUpdate = Date.now();

  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));

}



function renderLeaderboard() {

  const container = document.getElementById('leaderboard');

  if (!container) return;

  const data = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY) || '{}');

  container.innerHTML = `

    <div>Meilleur solde: ${data.bestCoins || 0}</div>

    <div>Meilleur lifetime: ${data.bestLifetime || 0}</div>

    <div>Meilleures recoltes: ${data.bestHarvests || 0}</div>

  `;

}



function exportSave() {

  const area = document.getElementById('save-json');

  if (!area) return;

  const payload = { ...state, savedAt: Date.now(), version: 2 };

  area.value = JSON.stringify(payload);

  area.focus();

  area.select();

  showToast('Sauvegarde exportee');

}



function importSave() {

  const area = document.getElementById('save-json');

  if (!area) return;

  const raw = area.value.trim();

  if (!raw) {

    showToast('JSON manquant');

    return;

  }

  if (!confirm('Importer cette sauvegarde ?')) return;

  try {

    JSON.parse(raw);

    localStorage.setItem('garden_game_save_v2', raw);

    location.reload();

  } catch (e) {

    showToast('JSON invalide');

  }

}



function populateSeedCodeOptions() {

  const select = document.getElementById('seed-code-plant');

  if (!select) return;

  if (select.options.length > 0) return;

  PLANTS.forEach(plant => {

    const opt = document.createElement('option');

    opt.value = plant.id;

    opt.textContent = plant.name;

    select.appendChild(opt);

  });

}



function generateSeedCode() {

  const select = document.getElementById('seed-code-plant');

  const amountInput = document.getElementById('seed-code-amount');

  const output = document.getElementById('seed-code-output');

  if (!select || !amountInput || !output) return;

  const plantId = select.value;

  const amount = Math.max(1, Math.min(99, parseInt(amountInput.value, 10) || 1));

  const payload = { p: plantId, a: amount, t: Date.now() };

  const code = `${SEED_CODE_PREFIX}:${btoa(JSON.stringify(payload))}`;

  output.value = code;

}



function redeemSeedCode() {

  const input = document.getElementById('seed-code-input');

  if (!input) return;

  const raw = input.value.trim();

  if (!raw.startsWith(`${SEED_CODE_PREFIX}:`)) {

    showToast('Code invalide');

    return;

  }

  if (state.usedSeedCodes.includes(raw)) {

    showToast('Code deja utilise');

    return;

  }

  try {

    const payload = JSON.parse(atob(raw.split(':')[1]));

    const plant = PLANTS.find(p => p.id === payload.p);

    if (!plant) throw new Error('bad');

    const amount = Math.max(1, Math.min(99, payload.a || 1));

    state.seeds[plant.id] = (state.seeds[plant.id] || 0) + amount;

    state.usedSeedCodes.push(raw);

    markCollected('plants', plant.id);

    showToast(`+${amount} graines ${plant.name}`);

    needsRender = true;

  } catch (e) {

    showToast('Code invalide');

  }

}





function initAdminPanel() {

  const panel = document.getElementById('admin-panel');

  if (!panel) return;


  const unlockBtn = document.getElementById('admin-unlock-btn');
  const codeModal = document.getElementById('admin-code-modal');
  const codeInput = document.getElementById('admin-code-input');
  const codeConfirm = document.getElementById('admin-code-confirm');
  const codeCancel = document.getElementById('admin-code-cancel');
  const codeClose = document.getElementById('close-admin-code');
  let adminUnlocked = sessionStorage.getItem(ADMIN_UNLOCK_KEY) === '1';

  const setAdminUnlocked = (enabled) => {
    adminUnlocked = enabled;
    if (enabled) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, '1');
    } else {
      sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    }
    panel.classList.toggle('hidden', !enabled);
    if (unlockBtn) {
      unlockBtn.textContent = enabled ? 'Desactiver' : 'Activer';
      unlockBtn.classList.toggle('danger', enabled);
    }
  };

  setAdminUnlocked(adminUnlocked);

  const openAdminCodeModal = () => {
    if (!codeModal) return;
    codeModal.classList.add('show');
    if (codeInput) {
      codeInput.value = '';
      codeInput.focus();
    }
  };

  const closeAdminCodeModal = () => {
    if (codeModal) codeModal.classList.remove('show');
  };

  const submitAdminCode = () => {
    if (!codeInput) return;
    const code = codeInput.value.trim();
    if (!code) return;
    if (code === String(ADMIN_CODE)) {
      setAdminUnlocked(true);
      showToast('Admin active');
      closeAdminCodeModal();
    } else {
      showToast('Code invalide');
      codeInput.select();
    }
  };

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      if (adminUnlocked) {
        setAdminUnlocked(false);
        showToast('Admin desactive');
        return;
      }
      openAdminCodeModal();
    });
  }

  if (codeConfirm) {
    codeConfirm.addEventListener('click', submitAdminCode);
  }

  if (codeCancel) {
    codeCancel.addEventListener('click', closeAdminCodeModal);
  }

  if (codeClose) {
    codeClose.addEventListener('click', closeAdminCodeModal);
  }

  if (codeInput) {
    codeInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') submitAdminCode();
    });
  }


  const toggle = document.getElementById('admin-toggle');

  if (toggle) {

    toggle.addEventListener('click', () => {

      panel.classList.toggle('hidden');

      toggle.textContent = panel.classList.contains('hidden') ? 'Show' : 'Hide';

    });

  }



  const addCoins = (amount) => {

    state.coins = Math.max(0, state.coins + amount);

    state.lifetimeCoins = Math.max(0, state.lifetimeCoins + Math.max(amount, 0));

    needsRender = true;

  };



  const addSeedsAll = (amount) => {

    PLANTS.forEach(plant => {

      state.seeds[plant.id] = (state.seeds[plant.id] || 0) + amount;

    });

    needsRender = true;

  };



  const clearSeeds = () => {

    Object.keys(state.seeds).forEach(key => {

      state.seeds[key] = 0;

    });

    needsRender = true;

  };



  const addAllSpecials = () => {

    SPECIAL_PLANTS.forEach(plant => {

      state.specialPlants.inventory[plant.id] = (state.specialPlants.inventory[plant.id] || 0) + 1;

    });

    needsRender = true;

  };



  const resetStreak = () => {

    state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

    needsRender = true;

  };



  const nextSeason = () => {

    const oldSeason = state.season.current;

    state.season.current = (state.season.current + 1) % SEASONS.length;

    const now = Date.now();

    state.season.startTime = now;

    state.season.nextChange = now + SEASONS[state.season.current].duration;

    showSeasonChangeEvent(SEASONS[oldSeason], SEASONS[state.season.current]);

    needsRender = true;

  };



  const nextWeather = () => {

    const next = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];

    state.weather.current = next.id;

    state.weather.startTime = Date.now();

    state.weather.nextChange = Date.now() + (5 * 60 * 1000);

    showToast('Meteo: ' + next.name);

    needsRender = true;

  };



  const harvestReady = () => {

    let harvested = 0;

    state.garden.plots.forEach((plot, index) => {

      if (plot.ready && plot.plantId) {

        harvestPlot(plot.mainPlotIndex !== null ? plot.mainPlotIndex : index);

        harvested++;

      }

    });

    if (harvested === 0) {

      showToast('No ready plants');

    }

  };



  const bind = (id, handler) => {

    const el = document.getElementById(id);

    if (el) el.addEventListener('click', handler);

  };



  bind('admin-add-1k', () => addCoins(1000));

  bind('admin-sub-1k', () => addCoins(-1000));

  bind('admin-add-seeds', () => addSeedsAll(50));

  bind('admin-clear-seeds', clearSeeds);

  bind('admin-all-specials', addAllSpecials);

  bind('admin-reset-streak', resetStreak);

  bind('admin-next-season', nextSeason);

  bind('admin-next-weather', nextWeather);

  bind('admin-force-harvest', harvestReady);

  bind('admin-force-legendary', forceLegendaryEvent);

}



// === SAVE/LOAD ===

function saveGame() {

  try {

    const saveData = {

      ...state,

      savedAt: Date.now()

    };

    localStorage.setItem('garden_game_save_v2', JSON.stringify(saveData));

    updateLeaderboard();

  } catch (e) {

  }

}



function loadGame() {

  const saved = localStorage.getItem('garden_game_save_v2');

  if (!saved) return;



  try {

    const saveData = JSON.parse(saved);



    state.coins = saveData.coins || 30;

    state.lifetimeCoins = saveData.lifetimeCoins || 0;

    state.totalHarvests = saveData.totalHarvests || 0;

    state.owned = saveData.owned || { plants: {}, buildings: {} };

    state.buildingInventory = saveData.buildingInventory || {};

    state.placedBuildings = saveData.placedBuildings || [];

    state.selectedBuilding = null;

    state.pendingBuildingRemoval = null;
    state.pendingPlantRemoval = null;

    state.seeds = saveData.seeds || { grass: 3 };

    state.selectedPlant = saveData.selectedPlant || 'grass';

    state.selectedSpecialPlant = saveData.selectedSpecialPlant || null;

    state.unlockedPlants = saveData.unlockedPlants || { grass: true };

    state.categoryUnlocks = saveData.categoryUnlocks || { plante: true, fruit: false, legume: false, buildings: false, employees: true, nocturnal: true };

    state.market = saveData.market || { lastRefresh: Date.now(), nextRefresh: Date.now() + MARKET_REFRESH_INTERVAL, stock: {} };

    if (!state.market.buildingStock) {

      state.market.buildingStock = {};

    }

    if (!state.market.priceModifiers) {

      state.market.priceModifiers = {};

    }

    if (!state.market.weekly) {

      state.market.weekly = {

        itemId: null,

        type: null,

        discount: 1,

        stock: 0,

        nextRotation: Date.now() + WEEKLY_REFRESH_INTERVAL

      };

    }

    state.dailyBonus = saveData.dailyBonus || { lastClaimed: 0, available: true };

    state.achievements = saveData.achievements || { unlocked: [], notified: [] };

    state.achievementsFilter = saveData.achievementsFilter || 'all';

    state.collection = saveData.collection || { plants: {}, special: {}, legendary: {}, buildings: {} };

    state.usedSeedCodes = saveData.usedSeedCodes || [];

    state.prestige = saveData.prestige || { level: 0, multiplier: 1 };

    state.prestige.multiplier = getPrestigeMultiplier(state.prestige.level);

    state.season = saveData.season || { current: 0, startTime: Date.now(), nextChange: Date.now() + SEASONS[0].duration };

    state.specialPlants = saveData.specialPlants || { inventory: {} };

    state.autoHarvest = saveData.autoHarvest || { lastRun: 0 };

    state.dailyStreak = saveData.dailyStreak || { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };

    state.weather = saveData.weather || { current: 'sun', startTime: Date.now(), nextChange: Date.now() + (5 * 60 * 1000) };

    state.activeEffects = saveData.activeEffects || { fertilize: 0, boostUntil: 0 };

    state.activeBuildingCooldowns = saveData.activeBuildingCooldowns || {};

    state.activeBuildingPending = saveData.activeBuildingPending || {};

    state.seasonalEvent = saveData.seasonalEvent || { active: false, type: null, name: '', desc: '', endTime: 0, nextCheck: Date.now() + (2 * 60 * 1000) };

    state.seasonHazard = saveData.seasonHazard || { lastCheck: 0 };



    if (saveData.garden && saveData.garden.plots) {

      const size = saveData.garden.size || 3;

      // Validate plot count matches grid size

      if (saveData.garden.plots.length === size * size) {

        state.garden.plots = saveData.garden.plots;

        state.garden.size = size;

        state.garden.plots.forEach(plot => {

          if (plot.newUntil === undefined) {

            plot.newUntil = 0;

          }

          if (plot.buildingId === undefined) {

            plot.buildingId = null;

          }

          if (plot.buildingMainPlotIndex === undefined) {

            plot.buildingMainPlotIndex = null;

          }

          if (plot.buildingIsMainPlot === undefined) {

            plot.buildingIsMainPlot = false;

          }

          if (plot.buildingOrientation === undefined) {

            plot.buildingOrientation = null;

          }

          if (plot.lastTimer === undefined) {

            plot.lastTimer = null;

          }
          if (plot.plantOrientation === undefined) {
            plot.plantOrientation = null;
          }
          if (plot.isMainPlot === undefined) {
            plot.isMainPlot = true;
          }
          if (plot.mainPlotIndex === undefined) {
            plot.mainPlotIndex = null;
          }

          // Validate timestamps

          if (plot.plantedAt && plot.plantedAt > Date.now()) {

            plot.plantedAt = Date.now();

          }

        });

        rebuildPlacedBuildingsFromPlots();
        normalizePlantPlots();

      } else {

        // Corrupted save - reinitialize garden

        state.garden.size = size;

        state.garden.plots = [];

        for (let i = 0; i < size * size; i++) {

          state.garden.plots.push(createEmptyPlot());

        }

        state.placedBuildings = [];

      }

    }



    // Initialize inventory system
    if (typeof initializeInventorySystem === 'function') {
      initializeInventorySystem();
    }

    // Initialize employees system
    if (typeof initializeEmployeesSystem === 'function') {
      initializeEmployeesSystem();
    }

    // Initialize pests system
    if (typeof initializePestsSystem === 'function') {
      initializePestsSystem();
    }

    // Initialize new buildings system
    if (typeof initializeNewBuildings === 'function') {
      initializeNewBuildings();
    }

    // Merge new buildings
    if (typeof mergeBuildings === 'function') {
      mergeBuildings();
    }

    // Initialize customization system
    if (typeof initializeCustomizationSystem === 'function') {
      initializeCustomizationSystem();
    }

    // Initialize day/night system
    if (typeof initializeDayNightSystem === 'function') {
      initializeDayNightSystem();
    }

    // Calculate CPS BEFORE offline progress calculation

    updateCPS();



    // Offline progress

    if (saveData.savedAt) {

      const offlineTime = (Date.now() - saveData.savedAt) / 1000;

      const cappedTime = Math.min(offlineTime, OFFLINE_MAX_SECONDS);

      const offlineCoins = state.cps * cappedTime;



      // Only show modal if offline for more than 2 minutes and earned coins

      if (offlineTime > 120 && offlineCoins > 1) {

        showOfflineModal(offlineTime, offlineCoins, state.cps);

      }

    }

  } catch (e) {

  }

}



function resetGame() {

  if (!confirm('\u26A0\uFE0F RESET complet ?')) return;

  localStorage.removeItem('garden_game_save_v2');

  location.reload();

}



// === START ===

if (document.readyState === 'loading') {

  document.addEventListener('DOMContentLoaded', init);

} else {

  init();

}

