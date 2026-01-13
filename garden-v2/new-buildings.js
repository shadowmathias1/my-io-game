/* ============================================
   NEW BUILDINGS SYSTEM
   Nouveaux types de bâtiments avancés
   ============================================ */

// Nouveaux buildings à ajouter au jeu
const NEW_BUILDINGS = [
  // DEFENSIVE BUILDINGS
  {
    id: 'pest_trap',
    name: '🪤 Piège à Nuisibles',
    cost: 3500,
    cps: 0,
    unlock: 2000,
    placeable: true,
    size: 1,
    special: 'defense',
    desc: 'Réduit de 50% les chances d\'infection dans un rayon de 2 cases'
  },
  {
    id: 'scarecrow',
    name: '🎃 Épouvantail',
    cost: 2000,
    cps: 2,
    unlock: 1500,
    placeable: true,
    size: 1,
    special: 'defense',
    desc: 'Protège contre les sauterelles et génère des coins passivement'
  },
  {
    id: 'bee_hive',
    name: '🐝 Ruche',
    cost: 5000,
    cps: 8,
    unlock: 3500,
    placeable: true,
    size: 2,
    orientation: 'vertical',
    special: 'pollination',
    desc: 'Augmente la vitesse de croissance de +25% dans un rayon de 3 cases'
  },

  // PRODUCTIVITY BUILDINGS
  {
    id: 'compost_bin',
    name: '♻️ Composteur',
    cost: 4000,
    cps: 5,
    unlock: 2500,
    placeable: true,
    size: 1,
    special: 'compost',
    desc: 'Chaque récolte a 20% de chance de générer une graine gratuite'
  },
  {
    id: 'water_tower',
    name: '🗼 Château d\'Eau',
    cost: 12000,
    cps: 20,
    unlock: 8000,
    placeable: true,
    size: 4,
    orientation: 'square',
    special: 'irrigation',
    desc: 'Réduit le temps de croissance de toutes les plantes de 20%'
  },
  {
    id: 'solar_panel',
    name: '☀️ Panneau Solaire',
    cost: 8000,
    cps: 15,
    unlock: 5000,
    placeable: true,
    size: 2,
    orientation: 'horizontal',
    special: 'solar',
    desc: 'Double la production de coins par seconde pendant la journée'
  },

  // SPECIAL BUILDINGS
  {
    id: 'weather_station',
    name: '🌡️ Station Météo',
    cost: 15000,
    cps: 10,
    unlock: 10000,
    placeable: true,
    size: 2,
    orientation: 'vertical',
    special: 'weather_control',
    desc: 'Réduit les effets négatifs de la météo de 50%'
  },
  {
    id: 'research_lab',
    name: '🔬 Laboratoire',
    cost: 25000,
    cps: 30,
    unlock: 18000,
    placeable: true,
    size: 4,
    orientation: 'square',
    special: 'research',
    desc: 'Augmente les chances de plantes rares de 10% et accélère le crafting'
  },
  {
    id: 'mystical_fountain',
    name: '⛲ Fontaine Mystique',
    cost: 50000,
    cps: 50,
    unlock: 35000,
    placeable: true,
    size: 4,
    orientation: 'square',
    special: 'mystical',
    desc: 'Donne un bonus aléatoire chaque minute: coins x2, croissance x2, ou protection'
  },

  // STORAGE BUILDINGS
  {
    id: 'seed_vault',
    name: '🏦 Coffre à Graines',
    cost: 6000,
    cps: 0,
    unlock: 4000,
    placeable: true,
    size: 2,
    orientation: 'horizontal',
    special: 'storage',
    desc: 'Augmente la capacité de stockage de graines de 50%'
  },
  {
    id: 'barn',
    name: '🏚️ Grange',
    cost: 10000,
    cps: 10,
    unlock: 7000,
    placeable: true,
    size: 4,
    orientation: 'square',
    special: 'storage',
    desc: 'Stocke automatiquement 10% de chaque récolte comme backup'
  },

  // AUTOMATION BUILDINGS
  {
    id: 'robot_arm',
    name: '🦾 Bras Robotique',
    cost: 20000,
    cps: 25,
    unlock: 15000,
    placeable: true,
    size: 2,
    orientation: 'vertical',
    special: 'auto_plant',
    desc: 'Plante automatiquement une graine aléatoire toutes les 30 secondes'
  },
  {
    id: 'drone',
    name: '🚁 Drone',
    cost: 30000,
    cps: 35,
    unlock: 22000,
    placeable: true,
    size: 1,
    special: 'auto_spray',
    desc: 'Traite automatiquement les plantes infectées toutes les 60 secondes'
  },

  // MAGICAL BUILDINGS
  {
    id: 'wishing_well',
    name: '🌟 Puits à Souhaits',
    cost: 40000,
    cps: 40,
    unlock: 28000,
    placeable: true,
    size: 2,
    orientation: 'horizontal',
    special: 'luck',
    desc: 'Augmente la chance d\'événements légendaires de 25%'
  },
  {
    id: 'time_crystal',
    name: '⏰ Cristal Temporel',
    cost: 60000,
    cps: 60,
    unlock: 45000,
    placeable: true,
    size: 1,
    special: 'time_warp',
    desc: 'Toutes les 2 minutes, accélère le temps x5 pendant 10 secondes'
  }
];

// Effets des buildings spéciaux
const BUILDING_EFFECTS = {
  // Defense
  pest_trap: {
    radius: 2,
    infectionReduction: 0.5
  },
  scarecrow: {
    protectsAgainst: ['locusts']
  },
  bee_hive: {
    radius: 3,
    growthBonus: 0.25
  },

  // Productivity
  compost_bin: {
    seedChance: 0.20
  },
  water_tower: {
    globalGrowthBonus: 0.20
  },
  solar_panel: {
    dayCPSMultiplier: 2.0
  },

  // Special
  weather_station: {
    weatherNegationPercent: 0.50
  },
  research_lab: {
    rareChanceBonus: 0.10,
    craftingSpeedBonus: 0.30
  },
  mystical_fountain: {
    interval: 60000, // 1 minute
    effects: ['coins_x2', 'growth_x2', 'protection']
  },

  // Storage
  seed_vault: {
    storageMultiplier: 1.5
  },
  barn: {
    autoSavePercent: 0.10
  },

  // Automation
  robot_arm: {
    plantInterval: 30000 // 30 secondes
  },
  drone: {
    healInterval: 60000 // 60 secondes
  },

  // Magical
  wishing_well: {
    legendaryChanceBonus: 0.25
  },
  time_crystal: {
    warpInterval: 120000, // 2 minutes
    warpMultiplier: 5,
    warpDuration: 10000 // 10 secondes
  }
};

// Initialiser les nouveaux buildings
function initializeNewBuildings() {
  if (!state.newBuildings) {
    state.newBuildings = {
      active: {}, // { buildingId: { lastTrigger, data } }
      effects: {}
    };
  }

  console.log('✅ New buildings system initialized');
}

// Fusionner les nouveaux buildings avec les anciens
function mergeBuildings() {
  // Ajouter les nouveaux buildings au tableau BUILDINGS existant
  NEW_BUILDINGS.forEach(newBuilding => {
    const exists = BUILDINGS.find(b => b.id === newBuilding.id);
    if (!exists) {
      BUILDINGS.push(newBuilding);
    }
  });

  console.log(`✅ ${NEW_BUILDINGS.length} nouveaux buildings ajoutés`);
}

// Tick des effets des nouveaux buildings
function tickNewBuildings() {
  if (!state.newBuildings || !state.placedBuildings) return;

  const now = Date.now();

  // Parcourir les buildings placés
  state.placedBuildings.forEach(placement => {
    const building = BUILDINGS.find(b => b.id === placement.buildingId);
    if (!building || !building.special) return;

    const effect = BUILDING_EFFECTS[building.id];
    if (!effect) return;

    // Initialiser l'état du building si nécessaire
    if (!state.newBuildings.active[placement.buildingId]) {
      state.newBuildings.active[placement.buildingId] = {
        lastTrigger: 0,
        data: {}
      };
    }

    const buildingState = state.newBuildings.active[placement.buildingId];

    // Effets spécifiques
    switch (building.id) {
      case 'robot_arm':
        // Auto plant
        if (now - buildingState.lastTrigger >= effect.plantInterval) {
          autoPlantFromRobotArm();
          buildingState.lastTrigger = now;
        }
        break;

      case 'drone':
        // Auto heal pests
        if (now - buildingState.lastTrigger >= effect.healInterval) {
          autoHealFromDrone();
          buildingState.lastTrigger = now;
        }
        break;

      case 'mystical_fountain':
        // Random bonus
        if (now - buildingState.lastTrigger >= effect.interval) {
          triggerMysticalFountain();
          buildingState.lastTrigger = now;
        }
        break;

      case 'time_crystal':
        // Time warp
        if (now - buildingState.lastTrigger >= effect.warpInterval) {
          triggerTimeWarp();
          buildingState.lastTrigger = now;
        }
        break;

      case 'compost_bin':
        // Passif - géré lors des récoltes
        break;
    }
  });
}

// Auto-planter depuis le bras robotique
function autoPlantFromRobotArm() {
  const availableSeeds = Object.entries(state.seeds).filter(([id, qty]) => qty > 0);
  if (availableSeeds.length === 0) return;

  const emptyPlots = state.garden.plots
    .map((plot, idx) => ({ plot, idx }))
    .filter(({ plot }) => !plot.plantId && !plot.building && !plot.isOccupied && plot.unlocked);

  if (emptyPlots.length === 0) return;

  // Choisir une graine et une parcelle aléatoires
  const [plantId] = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
  const { idx } = emptyPlots[Math.floor(Math.random() * emptyPlots.length)];

  // Simuler un clic de plantation
  const plotEl = document.querySelector(`.plot[data-plot="${idx}"]`);
  if (plotEl) {
    plotEl.click();
    showToast('🦾 Bras robotique: plante plantée', 'success');
  }
}

// Auto-soigner depuis le drone
function autoHealFromDrone() {
  if (!state.pests || !state.pests.activePests) return;

  const infected = Object.keys(state.pests.activePests);
  if (infected.length === 0) return;

  // Soigner une plante aléatoire
  const plotIndex = parseInt(infected[Math.floor(Math.random() * infected.length)]);

  // Utiliser un traitement basique
  if (typeof treatPlot === 'function') {
    const infection = state.pests.activePests[plotIndex];
    const pest = PEST_TYPES[infection.pestId.toUpperCase()];

    // Choisir le bon traitement
    let treatmentId = 'miracle_cure';
    if (pest.id === 'aphids' || pest.id === 'locusts') {
      treatmentId = 'insecticide';
    } else if (pest.id === 'fungus' || pest.id === 'root_rot') {
      treatmentId = 'fungicide';
    }

    // Appliquer gratuitement
    const savedCoins = state.coins;
    if (treatPlot(plotIndex, treatmentId)) {
      state.coins = savedCoins; // Rembourser car c'est gratuit avec le drone
      showToast('🚁 Drone: plante soignée gratuitement', 'success');
    }
  }
}

// Déclencher l'effet de la fontaine mystique
function triggerMysticalFountain() {
  const effects = BUILDING_EFFECTS.mystical_fountain.effects;
  const effect = effects[Math.floor(Math.random() * effects.length)];

  switch (effect) {
    case 'coins_x2':
      state.newBuildings.effects.coinsMultiplier = 2.0;
      setTimeout(() => {
        state.newBuildings.effects.coinsMultiplier = 1.0;
      }, 60000);
      showToast('⛲ Fontaine: Coins x2 pendant 1 minute!', 'legendary');
      break;

    case 'growth_x2':
      state.newBuildings.effects.growthMultiplier = 2.0;
      setTimeout(() => {
        state.newBuildings.effects.growthMultiplier = 1.0;
      }, 60000);
      showToast('⛲ Fontaine: Croissance x2 pendant 1 minute!', 'legendary');
      break;

    case 'protection':
      if (state.pests) {
        state.pests.protection = {
          until: Date.now() + 180000 // 3 minutes
        };
        showToast('⛲ Fontaine: Protection pendant 3 minutes!', 'legendary');
      }
      break;
  }
}

// Déclencher le time warp
function triggerTimeWarp() {
  state.newBuildings.effects.timeWarp = true;
  state.newBuildings.effects.timeWarpUntil = Date.now() + BUILDING_EFFECTS.time_crystal.warpDuration;

  showToast('⏰ Cristal: Temps accéléré x5 pendant 10s!', 'legendary');

  setTimeout(() => {
    state.newBuildings.effects.timeWarp = false;
    delete state.newBuildings.effects.timeWarpUntil;
  }, BUILDING_EFFECTS.time_crystal.warpDuration);
}

// Obtenir les bonus globaux des buildings
function getNewBuildingsGlobalBonuses() {
  const bonuses = {
    growthSpeedMultiplier: 1.0,
    yieldMultiplier: 1.0,
    cpsMultiplier: 1.0,
    infectionResistance: 0,
    rareChanceBonus: 0
  };

  if (!state.placedBuildings) return bonuses;

  state.placedBuildings.forEach(placement => {
    const building = BUILDINGS.find(b => b.id === placement.buildingId);
    if (!building) return;

    const effect = BUILDING_EFFECTS[building.id];
    if (!effect) return;

    // Appliquer les bonus globaux
    switch (building.id) {
      case 'water_tower':
        bonuses.growthSpeedMultiplier *= (1 - effect.globalGrowthBonus);
        break;

      case 'research_lab':
        bonuses.rareChanceBonus += effect.rareChanceBonus;
        break;

      case 'solar_panel':
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 18) {
          bonuses.cpsMultiplier *= effect.dayCPSMultiplier;
        }
        break;
    }
  });

  // Effets temporaires
  if (state.newBuildings && state.newBuildings.effects) {
    if (state.newBuildings.effects.coinsMultiplier) {
      bonuses.yieldMultiplier *= state.newBuildings.effects.coinsMultiplier;
    }
    if (state.newBuildings.effects.growthMultiplier) {
      bonuses.growthSpeedMultiplier /= state.newBuildings.effects.growthMultiplier;
    }
    if (state.newBuildings.effects.timeWarp) {
      bonuses.growthSpeedMultiplier /= BUILDING_EFFECTS.time_crystal.warpMultiplier;
    }
  }

  return bonuses;
}

// Vérifier si une parcelle est protégée par un piège
function isPlotProtectedByTrap(plotIndex) {
  if (!state.placedBuildings) return false;

  const traps = state.placedBuildings.filter(p => p.buildingId === 'pest_trap');
  if (traps.length === 0) return false;

  const size = state.garden.size;
  const plotRow = Math.floor(plotIndex / size);
  const plotCol = plotIndex % size;

  return traps.some(trap => {
    const trapRow = Math.floor(trap.mainPlotIndex / size);
    const trapCol = trap.mainPlotIndex % size;
    const distance = Math.abs(trapRow - plotRow) + Math.abs(trapCol - plotCol);
    return distance <= BUILDING_EFFECTS.pest_trap.radius;
  });
}

// Vérifier si une parcelle bénéficie du bonus de la ruche
function getBeehiveBonus(plotIndex) {
  if (!state.placedBuildings) return 1.0;

  const hives = state.placedBuildings.filter(p => p.buildingId === 'bee_hive');
  if (hives.length === 0) return 1.0;

  const size = state.garden.size;
  const plotRow = Math.floor(plotIndex / size);
  const plotCol = plotIndex % size;

  let maxBonus = 0;

  hives.forEach(hive => {
    const hiveRow = Math.floor(hive.mainPlotIndex / size);
    const hiveCol = hive.mainPlotIndex % size;
    const distance = Math.abs(hiveRow - plotRow) + Math.abs(hiveCol - plotCol);

    if (distance <= BUILDING_EFFECTS.bee_hive.radius) {
      maxBonus = Math.max(maxBonus, BUILDING_EFFECTS.bee_hive.growthBonus);
    }
  });

  return 1 - maxBonus;
}

console.log('✅ New buildings system loaded');
