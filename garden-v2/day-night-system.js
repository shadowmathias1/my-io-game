if (window.__dayNightSystemLoaded) {
  console.warn('Day/Night system already loaded');
} else {
  window.__dayNightSystemLoaded = true;

/* ============================================
   DAY/NIGHT CYCLE SYSTEM
   Système de cycle jour/nuit avec mécaniques spéciales
   ============================================ */

// Configuration du cycle jour/nuit
const DAY_NIGHT_CONFIG = {
  dayDuration: 720000, // 12 minutes (12h en jeu = 12 min réel)
  nightDuration: 720000, // 12 minutes
  nightGrowthPenalty: 0.5, // -50% vitesse la nuit
  nightCoinBonus: 2.0, // x2 pièces la nuit
  transitionDuration: 30000 // 30 secondes de transition
};

// État du cycle
const dayNightState = {
  current: 'day', // 'day', 'night', 'dawn', 'dusk'
  cycleStart: Date.now(),
  nextTransition: Date.now() + DAY_NIGHT_CONFIG.dayDuration
};

// Plantes nocturnes spéciales (débloquées par prestige)
window.NIGHT_PLANTS = {
  MOON_FLOWER: {
    id: 'moon_flower',
    name: '🌙 Fleur de Lune',
    emoji: '🌙',
    category: 'nocturnal',
    basePrice: 150,
    sellPrice: 450,
    growTime: 180, // 3 minutes
    rarityTier: 'rare',
    prestigeRequired: 1, // Requiert 1 prestige
    nightOnly: true,
    description: 'Une fleur magique qui ne pousse que la nuit'
  },
  GLOW_MUSHROOM: {
    id: 'glow_mushroom',
    name: '🍄 Champignon Lumineux',
    emoji: '🍄',
    category: 'nocturnal',
    basePrice: 200,
    sellPrice: 700,
    growTime: 240, // 4 minutes
    rarityTier: 'epic',
    prestigeRequired: 2,
    nightOnly: true,
    description: 'Champignon bioluminescent très précieux'
  },
  NIGHT_CACTUS: {
    id: 'night_cactus',
    name: '🌵 Cactus de Nuit',
    emoji: '🌵',
    category: 'nocturnal',
    basePrice: 300,
    sellPrice: 1000,
    growTime: 300, // 5 minutes
    rarityTier: 'epic',
    prestigeRequired: 3,
    nightOnly: true,
    description: 'Cactus rare qui fleurit sous les étoiles'
  },
  SHADOW_ROSE: {
    id: 'shadow_rose',
    name: '🥀 Rose d\'Ombre',
    emoji: '🥀',
    category: 'nocturnal',
    basePrice: 500,
    sellPrice: 1800,
    growTime: 360, // 6 minutes
    rarityTier: 'legendary',
    prestigeRequired: 5,
    nightOnly: true,
    description: 'Rose légendaire baignée de mystère nocturne'
  },
  STAR_FRUIT: {
    id: 'star_fruit',
    name: '⭐ Fruit d\'Étoile',
    emoji: '⭐',
    category: 'nocturnal',
    basePrice: 800,
    sellPrice: 3000,
    growTime: 480, // 8 minutes
    rarityTier: 'legendary',
    prestigeRequired: 10,
    nightOnly: true,
    description: 'Fruit mythique qui capture la lumière des étoiles'
  }
};

// Lumières pour le jardin (annulent le malus de nuit)
window.GARDEN_LIGHTS = {
  BASIC_LAMP: {
    id: 'basic_lamp',
    name: '💡 Lampe Simple',
    emoji: '💡',
    cost: 5000,
    radius: 2, // Éclaire 2 cases autour
    description: 'Éclaire quelques parcelles'
  },
  STREET_LIGHT: {
    id: 'street_light',
    name: '🔦 Lampadaire',
    emoji: '🔦',
    cost: 15000,
    radius: 4,
    description: 'Éclaire une grande zone'
  },
  MOON_LAMP: {
    id: 'moon_lamp',
    name: '🔮 Lampe Lunaire',
    emoji: '🔮',
    cost: 50000,
    radius: 10,
    bonus: 0.2, // +20% croissance en plus de l'éclairage
    description: 'Éclairage magique avec bonus de croissance'
  }
};

// ============================================
// CYCLE MANAGEMENT
// ============================================

function updateDayNightCycle() {
  const now = Date.now();
  const elapsed = now - dayNightState.cycleStart;

  // Vérifier transition
  if (now >= dayNightState.nextTransition) {
    transitionCycle();
  }

  // Appliquer les effets
  applyDayNightEffects();
}

function transitionCycle() {
  const now = Date.now();

  if (dayNightState.current === 'day') {
    dayNightState.current = 'dusk';
    setTimeout(() => {
      dayNightState.current = 'night';
      dayNightState.cycleStart = Date.now();
      dayNightState.nextTransition = Date.now() + DAY_NIGHT_CONFIG.nightDuration;
      showToast('🌙 La nuit tombe... Les plantes nocturnes s\'éveillent!', 'info');
      needsRender = true;
    }, DAY_NIGHT_CONFIG.transitionDuration);

    showToast('🌆 Le crépuscule approche...', 'info');
  } else if (dayNightState.current === 'night') {
    dayNightState.current = 'dawn';
    setTimeout(() => {
      dayNightState.current = 'day';
      dayNightState.cycleStart = Date.now();
      dayNightState.nextTransition = Date.now() + DAY_NIGHT_CONFIG.dayDuration;
      showToast('☀️ Le jour se lève! Les plantes nocturnes se reposent.', 'info');
      needsRender = true;
    }, DAY_NIGHT_CONFIG.transitionDuration);

    showToast('🌅 L\'aube se lève...', 'info');
  }

  needsRender = true;
}

function applyDayNightEffects() {
  if (!state.garden || !state.garden.plots) return;

  const isNight = dayNightState.current === 'night';

  state.garden.plots.forEach((plot, idx) => {
    if (!plot.plantId || !plot.unlocked) return;

    const plant = getPlantById(plot.plantId);
    if (!plant) return;

    // Plantes nocturnes: bonus la nuit
    if (plant.nightOnly) {
      if (!isNight) {
        // Arrêter la croissance le jour
        plot.dayPaused = true;
      } else {
        plot.dayPaused = false;
      }
    } else {
      // Plantes normales: malus la nuit (sauf si éclairées)
      if (isNight && !isPlotLit(idx)) {
        plot.nightPenalty = DAY_NIGHT_CONFIG.nightGrowthPenalty;
      } else {
        plot.nightPenalty = 0;
      }
    }
  });
}

// Vérifier si une parcelle est éclairée
function isPlotLit(plotIndex) {
  if (!state.dayNight || !state.dayNight.lights) return false;

  return state.dayNight.lights.some(light => {
    const lightData = GARDEN_LIGHTS[light.type.toUpperCase()];
    if (!lightData) return false;

    const distance = getPlotDistance(plotIndex, light.plotIndex);
    return distance <= lightData.radius;
  });
}

// Calculer distance entre 2 parcelles
function getPlotDistance(plot1, plot2) {
  const size = state.garden.size;
  const row1 = Math.floor(plot1 / size);
  const col1 = plot1 % size;
  const row2 = Math.floor(plot2 / size);
  const col2 = plot2 % size;

  return Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));
}

// ============================================
// HARVEST WITH NIGHT BONUS
// ============================================

const originalHarvestPlot = window.harvestPlot;
if (originalHarvestPlot) {
  window.harvestPlot = function(plotIndex) {
    const plot = state.garden.plots[plotIndex];
    if (!plot || !plot.plantId) return false;

    const plant = getPlantById(plot.plantId);
    if (!plant) return false;

    // Calculer le rendement
    let baseYield = plant.sellPrice || 10;

    // Bonus de nuit pour toutes les plantes
    if (dayNightState.current === 'night') {
      baseYield *= DAY_NIGHT_CONFIG.nightCoinBonus;
    }

    // Bonus supplémentaire pour plantes nocturnes récoltées la nuit
    if (plant.nightOnly && dayNightState.current === 'night') {
      baseYield *= 1.5; // x1.5 supplémentaire
    }

    // Appeler la fonction originale mais intercepter le gain
    const result = originalHarvestPlot.call(this, plotIndex);

    return result;
  };
}

// ============================================
// LIGHTS MANAGEMENT
// ============================================

function buyLight(lightType, plotIndex) {
  const light = GARDEN_LIGHTS[lightType.toUpperCase()];
  if (!light) {
    showToast('❌ Type de lumière invalide', 'error');
    return false;
  }

  const plot = state.garden.plots[plotIndex];
  if (!plot || !plot.unlocked) {
    showToast('❌ Parcelle invalide', 'error');
    return false;
  }

  if (plot.plantId || plot.building) {
    showToast('❌ Cette parcelle est occupée', 'error');
    return false;
  }

  if (state.coins < light.cost) {
    showToast('❌ Pas assez de pièces', 'error');
    return false;
  }

  // Vérifier si déjà une lumière ici
  const existingLight = state.dayNight.lights.find(l => l.plotIndex === plotIndex);
  if (existingLight) {
    showToast('❌ Il y a déjà une lumière ici', 'error');
    return false;
  }

  state.coins -= light.cost;
  state.dayNight.lights.push({
    type: light.id,
    plotIndex: plotIndex,
    installedAt: Date.now()
  });

  showToast(`${light.emoji} ${light.name} installée!`, 'success');
  needsRender = true;
  saveGame();
  return true;
}

function removeLight(plotIndex) {
  const lightIndex = state.dayNight.lights.findIndex(l => l.plotIndex === plotIndex);
  if (lightIndex === -1) {
    showToast('❌ Pas de lumière ici', 'error');
    return false;
  }

  state.dayNight.lights.splice(lightIndex, 1);
  showToast('💡 Lumière retirée', 'info');
  needsRender = true;
  saveGame();
  return true;
}

// ============================================
// UI HELPERS
// ============================================

function getDayNightIcon() {
  switch (dayNightState.current) {
    case 'day': return '☀️';
    case 'dusk': return '🌆';
    case 'night': return '🌙';
    case 'dawn': return '🌅';
    default: return '☀️';
  }
}

function getDayNightText() {
  switch (dayNightState.current) {
    case 'day': return 'Jour';
    case 'dusk': return 'Crépuscule';
    case 'night': return 'Nuit';
    case 'dawn': return 'Aube';
    default: return 'Jour';
  }
}

function getTimeUntilTransition() {
  const remaining = dayNightState.nextTransition - Date.now();
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================
// INTEGRATION
// ============================================

function initializeDayNightSystem() {
  if (!state.dayNight) {
    state.dayNight = {
      lights: [], // { type, plotIndex, installedAt }
      totalNightHarvests: 0,
      totalLightsPlaced: 0
    };
  }

  // Fusionner les plantes nocturnes avec les plantes existantes
  Object.values(NIGHT_PLANTS).forEach(plant => {
    // Vérifier le prestige requis
    if (state.prestigeLevel >= plant.prestigeRequired) {
      // Ajouter aux plantes disponibles si pas déjà présente
      if (!window.PLANTS) window.PLANTS = {};
      if (!PLANTS[plant.id.toUpperCase()]) {
        PLANTS[plant.id.toUpperCase()] = plant;
      }
    }
  });

  console.log('✅ Day/Night system initialized');
}

// Tick du cycle (appelé dans gameLoop)
function tickDayNight() {
  updateDayNightCycle();
}

// Appliquer le thème visuel
function applyDayNightTheme() {
  const body = document.body;
  if (!body) return;

  body.setAttribute('data-time', dayNightState.current);

  const isNight = dayNightState.current === 'night';
  const isDusk = dayNightState.current === 'dusk';
  const isDawn = dayNightState.current === 'dawn';

  // Appliquer le mode sombre la nuit
  if (isNight) {
    body.setAttribute('data-theme', 'dark');
    body.classList.add('night-mode');
    body.classList.remove('day-mode');
  } else {
    // Restaurer le thème clair le jour
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    body.classList.remove('night-mode');
    body.classList.add('day-mode');
  }

  if (typeof applyThemeColorsForMode === 'function') {
    const mode = body.dataset.theme === 'dark' ? 'dark' : 'light';
    applyThemeColorsForMode(mode);
  }

  // Appliquer les filtres visuels
  switch (dayNightState.current) {
    case 'day':
      body.style.filter = 'none';
      body.style.transition = 'filter 2s ease';
      break;
    case 'dusk':
      body.style.filter = 'brightness(0.85) sepia(0.25)';
      body.style.transition = 'filter 2s ease';
      break;
    case 'night':
      body.style.filter = 'brightness(0.7) saturate(0.85)';
      body.style.transition = 'filter 2s ease';
      break;
    case 'dawn':
      body.style.filter = 'brightness(0.9) sepia(0.15)';
      body.style.transition = 'filter 2s ease';
      break;
  }

  // Mettre à jour l'indicateur de temps si présent
  const timeIndicator = document.getElementById('day-night-indicator');
  if (timeIndicator) {
    timeIndicator.textContent = `${getDayNightIcon()} ${getDayNightText()} - ${getTimeUntilTransition()}`;
  }
}

// Mettre à jour l'affichage du cycle régulièrement
setInterval(() => {
  applyDayNightTheme();
}, 1000);

// Exposer les fonctions globalement
window.dayNightState = dayNightState;
window.getDayNightIcon = getDayNightIcon;
window.getDayNightText = getDayNightText;
window.getTimeUntilTransition = getTimeUntilTransition;
window.applyDayNightTheme = applyDayNightTheme;
window.tickDayNight = tickDayNight;

console.log('✅ Day/Night Cycle System loaded');

}
