/* ============================================
   CUSTOMIZATION SYSTEM
   Système de personnalisation (thèmes, décorations, cosmétiques)
   ============================================ */

// Thèmes visuels disponibles
const VISUAL_THEMES = {
  default: {
    id: 'default',
    name: '🌿 Classique',
    cost: 0,
    unlocked: true,
    colors: {
      primary: '#2ecc71',
      secondary: '#27ae60',
      background: '#f8f9fa',
      text: '#2c3e50'
    }
  },
  sunset: {
    id: 'sunset',
    name: '🌅 Coucher de Soleil',
    cost: 5000,
    unlocked: false,
    colors: {
      primary: '#ff6b6b',
      secondary: '#ee5a6f',
      background: '#ffe5e5',
      text: '#2c3e50'
    }
  },
  ocean: {
    id: 'ocean',
    name: '🌊 Océan',
    cost: 8000,
    unlocked: false,
    colors: {
      primary: '#3498db',
      secondary: '#2980b9',
      background: '#e3f2fd',
      text: '#2c3e50'
    }
  },
  forest: {
    id: 'forest',
    name: '🌲 Forêt',
    cost: 10000,
    unlocked: false,
    colors: {
      primary: '#16a085',
      secondary: '#138d75',
      background: '#d5f4e6',
      text: '#1e4620'
    }
  },
  lavender: {
    id: 'lavender',
    name: '💜 Lavande',
    cost: 12000,
    unlocked: false,
    colors: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      background: '#f4ecf7',
      text: '#2c3e50'
    }
  },
  golden: {
    id: 'golden',
    name: '✨ Doré',
    cost: 20000,
    unlocked: false,
    colors: {
      primary: '#f39c12',
      secondary: '#e67e22',
      background: '#fff5e6',
      text: '#7d4e00'
    }
  },
  sakura: {
    id: 'sakura',
    name: '🌸 Sakura',
    cost: 15000,
    unlocked: false,
    colors: {
      primary: '#ff69b4',
      secondary: '#ff1493',
      background: '#fff0f5',
      text: '#8b008b'
    }
  },
  midnight: {
    id: 'midnight',
    name: '🌙 Minuit',
    cost: 25000,
    unlocked: false,
    colors: {
      primary: '#34495e',
      secondary: '#2c3e50',
      background: '#ecf0f1',
      text: '#2c3e50'
    }
  }
};

// Décorations disponibles
const DECORATIONS = {
  // Chemins
  stone_path: {
    id: 'stone_path',
    name: '🪨 Chemin de Pierre',
    type: 'path',
    cost: 500,
    unlocked: false,
    emoji: '⬜',
    size: 1
  },
  wooden_path: {
    id: 'wooden_path',
    name: '🪵 Chemin de Bois',
    type: 'path',
    cost: 800,
    unlocked: false,
    emoji: '🟫',
    size: 1
  },

  // Décorations petites
  flower_pot: {
    id: 'flower_pot',
    name: '🏺 Pot de Fleurs',
    type: 'decoration',
    cost: 300,
    unlocked: false,
    emoji: '🏺',
    size: 1
  },
  lantern: {
    id: 'lantern',
    name: '🏮 Lanterne',
    type: 'decoration',
    cost: 600,
    unlocked: false,
    emoji: '🏮',
    size: 1
  },
  gnome: {
    id: 'gnome',
    name: '🧙 Nain de Jardin',
    type: 'decoration',
    cost: 1000,
    unlocked: false,
    emoji: '🧙',
    size: 1
  },
  bench: {
    id: 'bench',
    name: '🪑 Banc',
    type: 'decoration',
    cost: 1500,
    unlocked: false,
    emoji: '🪑',
    size: 2,
    orientation: 'horizontal'
  },

  // Décorations moyennes
  small_pond: {
    id: 'small_pond',
    name: '💧 Petit Étang',
    type: 'decoration',
    cost: 3000,
    unlocked: false,
    emoji: '💧',
    size: 2,
    orientation: 'horizontal'
  },
  statue: {
    id: 'statue',
    name: '🗿 Statue',
    type: 'decoration',
    cost: 5000,
    unlocked: false,
    emoji: '🗿',
    size: 2,
    orientation: 'vertical'
  },

  // Décorations grandes
  pond: {
    id: 'pond',
    name: '🌊 Étang',
    type: 'decoration',
    cost: 10000,
    unlocked: false,
    emoji: '🌊',
    size: 4,
    orientation: 'square'
  },
  garden_arch: {
    id: 'garden_arch',
    name: '⛩️ Arche de Jardin',
    type: 'decoration',
    cost: 8000,
    unlocked: false,
    emoji: '⛩️',
    size: 2,
    orientation: 'vertical'
  }
};

// Bordures/Clôtures
const BORDERS = {
  none: {
    id: 'none',
    name: 'Aucune',
    cost: 0,
    unlocked: true,
    style: 'none'
  },
  wooden_fence: {
    id: 'wooden_fence',
    name: '🪵 Clôture en Bois',
    cost: 2000,
    unlocked: false,
    style: '4px solid #8b4513'
  },
  stone_wall: {
    id: 'stone_wall',
    name: '🧱 Mur de Pierre',
    cost: 4000,
    unlocked: false,
    style: '6px solid #696969'
  },
  hedge: {
    id: 'hedge',
    name: '🌿 Haie',
    cost: 3000,
    unlocked: false,
    style: '5px solid #228b22'
  },
  iron_fence: {
    id: 'iron_fence',
    name: '⚫ Grille en Fer',
    cost: 5000,
    unlocked: false,
    style: '4px double #2c3e50'
  },
  golden_fence: {
    id: 'golden_fence',
    name: '✨ Clôture Dorée',
    cost: 15000,
    unlocked: false,
    style: '5px solid #ffd700'
  }
};

// Fonds d'écran/Arrière-plans
const BACKGROUNDS = {
  default: {
    id: 'default',
    name: 'Par défaut',
    cost: 0,
    unlocked: true,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  sunny_day: {
    id: 'sunny_day',
    name: '☀️ Journée Ensoleillée',
    cost: 3000,
    unlocked: false,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  starry_night: {
    id: 'starry_night',
    name: '⭐ Nuit Étoilée',
    cost: 5000,
    unlocked: false,
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
  },
  rainbow: {
    id: 'rainbow',
    name: '🌈 Arc-en-ciel',
    cost: 8000,
    unlocked: false,
    gradient: 'linear-gradient(135deg, #ff0000 0%, #ff7f00 20%, #ffff00 40%, #00ff00 60%, #0000ff 80%, #4b0082 100%)'
  },
  aurora: {
    id: 'aurora',
    name: '🌌 Aurore Boréale',
    cost: 12000,
    unlocked: false,
    gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 50%, #7f00ff 100%)'
  }
};

// Initialiser le système de personnalisation
function initializeCustomizationSystem() {
  if (!state.customization) {
    state.customization = {
      theme: 'default',
      border: 'none',
      background: 'default',
      decorations: {}, // { plotIndex: decorationId }
      unlockedThemes: ['default'],
      unlockedBorders: ['none'],
      unlockedBackgrounds: ['default'],
      unlockedDecorations: []
    };
  }

  console.log('✅ Customization system initialized');
}

// Acheter un thème
function buyTheme(themeId) {
  const theme = VISUAL_THEMES[themeId];
  if (!theme) return false;

  if (state.customization.unlockedThemes.includes(themeId)) {
    showToast('✅ Thème déjà débloqué', 'info');
    return false;
  }

  if (state.coins < theme.cost) {
    showToast(`❌ Pas assez de coins (${theme.cost} requis)`, 'error');
    return false;
  }

  state.coins -= theme.cost;
  state.customization.unlockedThemes.push(themeId);
  showToast(`✨ Thème "${theme.name}" débloqué!`, 'success');
  saveGame();
  return true;
}

// Appliquer un thème
function applyTheme(themeId) {
  const theme = VISUAL_THEMES[themeId];
  if (!theme) return false;

  if (!state.customization.unlockedThemes.includes(themeId)) {
    showToast('🔒 Thème non débloqué', 'error');
    return false;
  }

  state.customization.theme = themeId;

  // Appliquer les couleurs CSS
  document.documentElement.style.setProperty('--primary-green', theme.colors.primary);
  document.documentElement.style.setProperty('--dark-green', theme.colors.secondary);
  document.documentElement.style.setProperty('--bg-color', theme.colors.background);
  document.documentElement.style.setProperty('--text-dark', theme.colors.text);

  showToast(`🎨 Thème "${theme.name}" appliqué`, 'success');
  saveGame();
  needsRender = true;
  return true;
}

// Acheter une bordure
function buyBorder(borderId) {
  const border = BORDERS[borderId];
  if (!border) return false;

  if (state.customization.unlockedBorders.includes(borderId)) {
    showToast('✅ Bordure déjà débloquée', 'info');
    return false;
  }

  if (state.coins < border.cost) {
    showToast(`❌ Pas assez de coins (${border.cost} requis)`, 'error');
    return false;
  }

  state.coins -= border.cost;
  state.customization.unlockedBorders.push(borderId);
  showToast(`✨ Bordure "${border.name}" débloquée!`, 'success');
  saveGame();
  return true;
}

// Appliquer une bordure
function applyBorder(borderId) {
  const border = BORDERS[borderId];
  if (!border) return false;

  if (!state.customization.unlockedBorders.includes(borderId)) {
    showToast('🔒 Bordure non débloquée', 'error');
    return false;
  }

  state.customization.border = borderId;

  // Appliquer la bordure au jardin
  const gardenEl = document.getElementById('garden');
  if (gardenEl) {
    if (border.style === 'none') {
      gardenEl.style.border = 'none';
    } else {
      gardenEl.style.border = border.style;
    }
  }

  showToast(`🏗️ Bordure "${border.name}" appliquée`, 'success');
  saveGame();
  needsRender = true;
  return true;
}

// Acheter un arrière-plan
function buyBackground(backgroundId) {
  const background = BACKGROUNDS[backgroundId];
  if (!background) return false;

  if (state.customization.unlockedBackgrounds.includes(backgroundId)) {
    showToast('✅ Arrière-plan déjà débloqué', 'info');
    return false;
  }

  if (state.coins < background.cost) {
    showToast(`❌ Pas assez de coins (${background.cost} requis)`, 'error');
    return false;
  }

  state.coins -= background.cost;
  state.customization.unlockedBackgrounds.push(backgroundId);
  showToast(`✨ Arrière-plan "${background.name}" débloqué!`, 'success');
  saveGame();
  return true;
}

// Appliquer un arrière-plan
function applyBackground(backgroundId) {
  const background = BACKGROUNDS[backgroundId];
  if (!background) return false;

  if (!state.customization.unlockedBackgrounds.includes(backgroundId)) {
    showToast('🔒 Arrière-plan non débloqué', 'error');
    return false;
  }

  state.customization.background = backgroundId;

  // Appliquer le gradient
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.style.background = background.gradient;
  }

  showToast(`🎨 Arrière-plan "${background.name}" appliqué`, 'success');
  saveGame();
  needsRender = true;
  return true;
}

// Acheter une décoration
function buyDecoration(decorationId) {
  const decoration = DECORATIONS[decorationId];
  if (!decoration) return false;

  if (state.customization.unlockedDecorations.includes(decorationId)) {
    showToast('✅ Décoration déjà débloquée', 'info');
    return false;
  }

  if (state.coins < decoration.cost) {
    showToast(`❌ Pas assez de coins (${decoration.cost} requis)`, 'error');
    return false;
  }

  state.coins -= decoration.cost;
  state.customization.unlockedDecorations.push(decorationId);
  showToast(`✨ Décoration "${decoration.name}" débloquée!`, 'success');
  saveGame();
  return true;
}

// Placer une décoration
function placeDecoration(plotIndex, decorationId) {
  const decoration = DECORATIONS[decorationId];
  if (!decoration) return false;

  if (!state.customization.unlockedDecorations.includes(decorationId)) {
    showToast('🔒 Décoration non débloquée', 'error');
    return false;
  }

  // Vérifier si la parcelle est disponible
  const plot = state.garden.plots[plotIndex];
  if (!plot || plot.plantId || plot.building || !plot.unlocked) {
    showToast('❌ Cette parcelle n\'est pas disponible', 'error');
    return false;
  }

  // Vérifier l'espace pour les décorations multi-cases
  if (decoration.size > 1) {
    const canPlace = canPlaceMultiSizeItem(plotIndex, decoration.size, decoration.orientation);
    if (!canPlace) {
      showToast('❌ Pas assez d\'espace pour cette décoration', 'error');
      return false;
    }
  }

  // Placer la décoration
  state.customization.decorations[plotIndex] = decorationId;

  // Marquer les cases occupées
  if (decoration.size > 1) {
    const occupiedPlots = getOccupiedPlots(plotIndex, decoration.size, decoration.orientation);
    occupiedPlots.forEach(idx => {
      if (idx !== plotIndex) {
        state.customization.decorations[idx] = `${decorationId}_occupied`;
      }
    });
  }

  showToast(`🎨 Décoration "${decoration.name}" placée`, 'success');
  saveGame();
  needsRender = true;
  return true;
}

// Retirer une décoration
function removeDecoration(plotIndex) {
  const decorationId = state.customization.decorations[plotIndex];
  if (!decorationId) return false;

  // Si c'est une case occupée, trouver la case principale
  if (decorationId.includes('_occupied')) {
    const mainDecoId = decorationId.replace('_occupied', '');
    const decoration = DECORATIONS[mainDecoId];

    // Trouver la case principale
    for (let idx in state.customization.decorations) {
      if (state.customization.decorations[idx] === mainDecoId) {
        plotIndex = parseInt(idx);
        break;
      }
    }
  }

  const mainDecorationId = state.customization.decorations[plotIndex];
  const decoration = DECORATIONS[mainDecorationId];

  if (decoration && decoration.size > 1) {
    const occupiedPlots = getOccupiedPlots(plotIndex, decoration.size, decoration.orientation);
    occupiedPlots.forEach(idx => {
      delete state.customization.decorations[idx];
    });
  }

  delete state.customization.decorations[plotIndex];

  showToast(`🗑️ Décoration retirée`, 'info');
  saveGame();
  needsRender = true;
  return true;
}

// Appliquer la personnalisation au chargement
function applyCustomization() {
  if (!state.customization) return;

  // Appliquer le thème
  const theme = VISUAL_THEMES[state.customization.theme];
  if (theme) {
    document.documentElement.style.setProperty('--primary-green', theme.colors.primary);
    document.documentElement.style.setProperty('--dark-green', theme.colors.secondary);
    document.documentElement.style.setProperty('--bg-color', theme.colors.background);
    document.documentElement.style.setProperty('--text-dark', theme.colors.text);
  }

  // Appliquer la bordure
  const border = BORDERS[state.customization.border];
  if (border) {
    const gardenEl = document.getElementById('garden');
    if (gardenEl) {
      if (border.style === 'none') {
        gardenEl.style.border = 'none';
      } else {
        gardenEl.style.border = border.style;
      }
    }
  }

  // Appliquer l'arrière-plan
  const background = BACKGROUNDS[state.customization.background];
  if (background) {
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.style.background = background.gradient;
    }
  }
}

// Helper: vérifier si on peut placer un item multi-case
function canPlaceMultiSizeItem(mainPlotIndex, size, orientation) {
  const gridSize = state.garden.size;
  const row = Math.floor(mainPlotIndex / gridSize);
  const col = mainPlotIndex % gridSize;

  const occupiedPlots = getOccupiedPlots(mainPlotIndex, size, orientation);

  return occupiedPlots.every(idx => {
    if (idx < 0 || idx >= state.garden.plots.length) return false;
    const plot = state.garden.plots[idx];
    if (!plot || !plot.unlocked || plot.plantId || plot.building) return false;
    if (state.customization.decorations[idx]) return false;
    return true;
  });
}

// Helper: obtenir les indices des parcelles occupées
function getOccupiedPlots(mainPlotIndex, size, orientation) {
  const gridSize = state.garden.size;
  const row = Math.floor(mainPlotIndex / gridSize);
  const col = mainPlotIndex % gridSize;
  const plots = [mainPlotIndex];

  if (size === 2) {
    if (orientation === 'horizontal') {
      plots.push(mainPlotIndex + 1);
    } else {
      plots.push(mainPlotIndex + gridSize);
    }
  } else if (size === 4) {
    plots.push(mainPlotIndex + 1);
    plots.push(mainPlotIndex + gridSize);
    plots.push(mainPlotIndex + gridSize + 1);
  }

  return plots;
}

console.log('✅ Customization system loaded');
