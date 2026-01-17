/* ============================================
   CUSTOMIZATION SYSTEM
   Système de personnalisation (thèmes, décorations, cosmétiques)
   ============================================ */

// Thèmes visuels disponibles
const VISUAL_THEMES = {
  default: {
    id: 'default',
    name: '?? Classique',
    cost: 0,
    unlocked: true,
    colors: {
      light: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        background: '#f8f9fa',
        surface: '#ffffff',
        surfaceMuted: '#f2f6f8'
      },
      dark: {
        primary: '#49d88d',
        secondary: '#1f7a53',
        background: '#121826',
        surface: '#151b2c',
        surfaceMuted: '#1b2336'
      }
    }
  },
  sunset: {
    id: 'sunset',
    name: '?? Coucher de Soleil',
    cost: 5000,
    unlocked: false,
    colors: {
      light: {
        primary: '#ff6b6b',
        secondary: '#ee5a6f',
        background: '#ffe5e5',
        surface: '#fff5f2',
        surfaceMuted: '#ffe1dc'
      },
      dark: {
        primary: '#ff8b8b',
        secondary: '#d65066',
        background: '#2b1720',
        surface: '#2f1b24',
        surfaceMuted: '#3a2230'
      }
    }
  },
  ocean: {
    id: 'ocean',
    name: '?? Oc?an',
    cost: 5000,
    unlocked: false,
    colors: {
      light: {
        primary: '#3498db',
        secondary: '#2a7bb8',
        background: '#e7f4ff',
        surface: '#f2f9ff',
        surfaceMuted: '#d9ecfb'
      },
      dark: {
        primary: '#4aa8ff',
        secondary: '#1f6bb5',
        background: '#0b1b2b',
        surface: '#0f2234',
        surfaceMuted: '#132a3f'
      }
    }
  },
  forest: {
    id: 'forest',
    name: '?? For?t',
    cost: 10000,
    unlocked: false,
    colors: {
      light: {
        primary: '#16a085',
        secondary: '#138d75',
        background: '#d5f4e6',
        surface: '#eefaf4',
        surfaceMuted: '#c9ead8'
      },
      dark: {
        primary: '#2dd6b5',
        secondary: '#1aa689',
        background: '#10231e',
        surface: '#142b24',
        surfaceMuted: '#1b372e'
      }
    }
  },
  lavender: {
    id: 'lavender',
    name: '?? Lavande',
    cost: 12000,
    unlocked: false,
    colors: {
      light: {
        primary: '#9b59b6',
        secondary: '#8e44ad',
        background: '#f4ecf7',
        surface: '#faf4ff',
        surfaceMuted: '#eadcf3'
      },
      dark: {
        primary: '#b981dd',
        secondary: '#8f50b6',
        background: '#24182b',
        surface: '#2b1f33',
        surfaceMuted: '#382544'
      }
    }
  },
  golden: {
    id: 'golden',
    name: '? Dor?',
    cost: 20000,
    unlocked: false,
    colors: {
      light: {
        primary: '#f39c12',
        secondary: '#e67e22',
        background: '#fff5e6',
        surface: '#fff9f0',
        surfaceMuted: '#ffe4bf'
      },
      dark: {
        primary: '#f7b545',
        secondary: '#d9781f',
        background: '#2b1e0f',
        surface: '#312312',
        surfaceMuted: '#3b2b16'
      }
    }
  },
  sakura: {
    id: 'sakura',
    name: '?? Sakura',
    cost: 15000,
    unlocked: false,
    colors: {
      light: {
        primary: '#ff69b4',
        secondary: '#ff1493',
        background: '#fff0f5',
        surface: '#fff6fa',
        surfaceMuted: '#ffd7e7'
      },
      dark: {
        primary: '#ff8fc9',
        secondary: '#e01686',
        background: '#2b1521',
        surface: '#321a27',
        surfaceMuted: '#3c2030'
      }
    }
  },
  midnight: {
    id: 'midnight',
    name: '?? Minuit',
    cost: 25000,
    unlocked: false,
    colors: {
      light: {
        primary: '#34495e',
        secondary: '#2c3e50',
        background: '#ecf0f1',
        surface: '#f4f6f7',
        surfaceMuted: '#e1e6ea'
      },
      dark: {
        primary: '#5f778f',
        secondary: '#2c3e50',
        background: '#0f141a',
        surface: '#141b23',
        surfaceMuted: '#1b2430'
      }
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

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function mixHex(hexA, hexB, weightB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = Math.min(Math.max(weightB, 0), 1);
  const r = Math.round(a.r * (1 - w) + b.r * w);
  const g = Math.round(a.g * (1 - w) + b.g * w);
  const bch = Math.round(a.b * (1 - w) + b.b * w);
  return '#' + [r, g, bch].map(v => v.toString(16).padStart(2, '0')).join('');
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function pickTextColor(bgHex) {
  return getLuminance(bgHex) > 0.6 ? '#111827' : '#f5f7fb';
}

function resolveThemePalette(themeId, mode) {
  const theme = VISUAL_THEMES[themeId] || VISUAL_THEMES.default;
  const palette = theme.colors && theme.colors[mode] ? theme.colors[mode] : theme.colors;
  const background = palette.background || '#f8f9fa';
  const surface = palette.surface || background;
  const surfaceMuted = palette.surfaceMuted || surface;
  const primary = palette.primary || '#2ecc71';
  const secondary = palette.secondary || '#27ae60';
  const text = palette.text || (mode === 'dark' ? '#f5f7fb' : pickTextColor(surface));
  const textMuted = palette.textMuted || (mode === 'dark' ? mixHex(text, background, 0.35) : mixHex(text, background, 0.55));

  return {
    primary,
    secondary,
    background,
    surface,
    surfaceMuted,
    text,
    textMuted
  };
}

function applyThemeColorsForMode(mode) {
  if (!state || !state.customization) return;
  const resolvedMode = mode === 'dark' ? 'dark' : 'light';
  const palette = resolveThemePalette(state.customization.theme, resolvedMode);
  const root = document.documentElement.style;
  const target = document.body ? document.body.style : root;
  const borderMix = resolvedMode === 'dark' ? 0.7 : 0.45;
  const plotMix = resolvedMode === 'dark' ? 0.25 : 0.6;

  root.setProperty('--page-bg', palette.background);
  target.setProperty('--primary-green', palette.primary);
  target.setProperty('--dark-green', palette.secondary);
  target.setProperty('--bg-color', palette.background);
  target.setProperty('--surface-bg', palette.surface);
  target.setProperty('--surface-muted-bg', palette.surfaceMuted);
  target.setProperty('--surface-border', mixHex(palette.primary, palette.background, borderMix));
  target.setProperty('--plot-bg', mixHex(palette.surface, palette.background, plotMix));
  target.setProperty('--plot-border', mixHex(palette.primary, palette.surface, 0.5));
  target.setProperty('--tabs-bg', mixHex(palette.surfaceMuted, palette.background, resolvedMode === 'dark' ? 0.3 : 0.2));
  target.setProperty('--tab-active-bg', palette.surface);
  target.setProperty('--tab-active-text', palette.primary);
  target.setProperty('--icon-btn-bg', palette.surface);
  target.setProperty('--icon-btn-border', mixHex(palette.primary, palette.background, 0.65));
  target.setProperty('--modal-header-bg', `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`);
  target.setProperty('--toast-accent', palette.primary);
  target.setProperty('--text-dark', palette.text);
  target.setProperty('--text-light', palette.textMuted);
}

window.applyThemeColorsForMode = applyThemeColorsForMode;

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
function applyVisualTheme(themeId) {
  const theme = VISUAL_THEMES[themeId];
  if (!theme) return false;

  if (!state.customization.unlockedThemes.includes(themeId)) {
    showToast('?? Thème non débloqué', 'error');
    return false;
  }

  state.customization.theme = themeId;

  const mode = document.body && document.body.dataset.theme === 'dark' ? 'dark' : 'light';
  applyThemeColorsForMode(mode);

  showToast(`?? Thème "${theme.name}" appliqué`, 'success');
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
  const mode = document.body && document.body.dataset.theme === 'dark' ? 'dark' : 'light';
  applyThemeColorsForMode(mode);

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
