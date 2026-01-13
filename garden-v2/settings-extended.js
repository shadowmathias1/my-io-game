/* ============================================
   EXTENDED SETTINGS SYSTEM
   Système de paramètres avancés
   ============================================ */

// État des paramètres
const settings = {
  notifications: true,
  animations: true,
  sound: false,
  autosaveInterval: 60000, // 1 minute par défaut
  graphicsQuality: 'high',
  language: 'fr',
  forceDarkModeAtNight: true // Forcer le mode sombre la nuit
};

// ============================================
// LOAD & SAVE SETTINGS
// ============================================

function loadSettings() {
  const saved = localStorage.getItem('gardenSettings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(settings, parsed);
    } catch (e) {
      console.error('Erreur chargement settings:', e);
    }
  }
  applySettings();
  updateSettingsUI();
}

function saveSettings() {
  localStorage.setItem('gardenSettings', JSON.stringify(settings));
}

function applySettings() {
  // Appliquer la qualité graphique
  document.body.setAttribute('data-graphics', settings.graphicsQuality);

  // Désactiver animations si nécessaire
  if (!settings.animations) {
    document.body.classList.add('no-animations');
  } else {
    document.body.classList.remove('no-animations');
  }

  // Configurer l'intervalle d'autosave
  setupAutosave();
}

// ============================================
// AUTOSAVE SYSTEM
// ============================================

let autosaveTimer = null;

function setupAutosave() {
  if (autosaveTimer) {
    clearInterval(autosaveTimer);
  }

  autosaveTimer = setInterval(() => {
    if (typeof saveGame === 'function') {
      saveGame();
      if (settings.notifications) {
        showToast('💾 Sauvegarde automatique', 'info');
      }
    }
  }, settings.autosaveInterval);
}

// ============================================
// NOTIFICATIONS SYSTEM
// ============================================

function checkHarvestNotifications() {
  if (!settings.notifications) return;

  const readyPlants = state.garden.plots.filter(p =>
    p.plantId && p.growthProgress >= 1 && !p.building
  );

  if (readyPlants.length > 0) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🌱 Jardin prêt!', {
        body: `${readyPlants.length} plante(s) prête(s) à récolter!`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🌱</text></svg>'
      });
    }
  }
}

// Demander la permission pour les notifications
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('✅ Notifications activées', 'success');
      }
    });
  }
}

// ============================================
// EXPORT / IMPORT SAVE
// ============================================

function exportSave() {
  try {
    const saveData = {
      state: state,
      settings: settings,
      timestamp: Date.now(),
      version: '2.0'
    };

    const json = JSON.stringify(saveData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `garden-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('✅ Sauvegarde exportée', 'success');
  } catch (e) {
    console.error('Erreur export:', e);
    showToast('❌ Erreur lors de l\'export', 'error');
  }
}

function importSave() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (!data.state || !data.version) {
          throw new Error('Format de sauvegarde invalide');
        }

        // Charger l'état
        Object.assign(state, data.state);
        if (data.settings) {
          Object.assign(settings, data.settings);
        }

        // Sauvegarder et recharger
        saveGame();
        saveSettings();
        location.reload();

        showToast('✅ Sauvegarde importée', 'success');
      } catch (error) {
        console.error('Erreur import:', error);
        showToast('❌ Fichier de sauvegarde invalide', 'error');
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

function resetSave() {
  const confirm = window.confirm(
    '⚠️ ATTENTION!\n\n' +
    'Voulez-vous vraiment réinitialiser toutes vos données?\n' +
    'Cette action est IRRÉVERSIBLE!\n\n' +
    'Astuce: Exportez votre sauvegarde avant de réinitialiser.'
  );

  if (!confirm) return;

  const doubleConfirm = window.confirm(
    'Êtes-vous ABSOLUMENT SÛR?\n\n' +
    'Dernière chance de sauvegarder!'
  );

  if (!doubleConfirm) return;

  // Effacer tout
  localStorage.clear();
  sessionStorage.clear();

  showToast('🗑️ Données effacées. Rechargement...', 'info');

  setTimeout(() => {
    location.reload();
  }, 1500);
}

// ============================================
// SOUND SYSTEM
// ============================================

const sounds = {
  harvest: () => playTone(523.25, 0.1), // Do
  plant: () => playTone(659.25, 0.1), // Mi
  coin: () => playTone(783.99, 0.1), // Sol
  levelUp: () => {
    playTone(523.25, 0.1);
    setTimeout(() => playTone(659.25, 0.1), 100);
    setTimeout(() => playTone(783.99, 0.15), 200);
  },
  error: () => playTone(220, 0.2) // La grave
};

function playTone(frequency, duration) {
  if (!settings.sound) return;

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Audio context pas disponible
  }
}

// Hook les sons dans le jeu
function setupSoundHooks() {
  const originalHarvest = window.harvestPlot;
  if (originalHarvest) {
    window.harvestPlot = function(...args) {
      const result = originalHarvest.apply(this, args);
      if (result) sounds.harvest();
      return result;
    };
  }

  const originalPlant = window.plantSeed;
  if (originalPlant) {
    window.plantSeed = function(...args) {
      const result = originalPlant.apply(this, args);
      if (result) sounds.plant();
      return result;
    };
  }
}

// ============================================
// GRAPHICS QUALITY
// ============================================

// Styles CSS pour les différentes qualités
const qualityStyles = document.createElement('style');
qualityStyles.textContent = `
  /* Basse qualité - désactiver les effets avancés */
  body[data-graphics="low"] .plot.ready::after,
  body[data-graphics="low"] .plot.has-building::after,
  body[data-graphics="low"] .progress-fill::after,
  body[data-graphics="low"] .decoration-indicator,
  body[data-graphics="low"] .pest-indicator {
    display: none !important;
  }

  body[data-graphics="low"] * {
    animation-duration: 0.5s !important;
  }

  /* Moyenne qualité - réduire les effets */
  body[data-graphics="medium"] .plot.ready::after {
    animation-duration: 5s !important;
  }

  body[data-graphics="medium"] .progress-fill::after {
    display: none;
  }

  /* Désactiver toutes les animations */
  body.no-animations * {
    animation: none !important;
    transition: none !important;
  }
`;
document.head.appendChild(qualityStyles);

// ============================================
// UI UPDATES
// ============================================

function updateSettingsUI() {
  // Notifications
  const notifBtn = document.getElementById('notifications-toggle');
  if (notifBtn) {
    notifBtn.textContent = settings.notifications ? 'Activées' : 'Désactivées';
    notifBtn.className = `btn ${settings.notifications ? '' : 'inactive'}`;
  }

  // Animations
  const animBtn = document.getElementById('animations-toggle');
  if (animBtn) {
    animBtn.textContent = settings.animations ? 'Activées' : 'Désactivées';
    animBtn.className = `btn ${settings.animations ? '' : 'inactive'}`;
  }

  // Son
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.textContent = settings.sound ? 'Activé' : 'Désactivé';
    soundBtn.className = `btn ${settings.sound ? '' : 'inactive'}`;
  }

  // Mode sombre automatique
  const darkModeBtn = document.getElementById('force-dark-mode-toggle');
  if (darkModeBtn) {
    darkModeBtn.textContent = settings.forceDarkModeAtNight ? 'Activé' : 'Désactivé';
    darkModeBtn.className = `btn ${settings.forceDarkModeAtNight ? '' : 'inactive'}`;
  }

  // Autosave interval
  const autosaveSelect = document.getElementById('autosave-interval');
  if (autosaveSelect) {
    autosaveSelect.value = settings.autosaveInterval / 1000;
  }

  // Graphics quality
  const graphicsSelect = document.getElementById('graphics-quality');
  if (graphicsSelect) {
    graphicsSelect.value = settings.graphicsQuality;
  }

  // Language
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = settings.language;
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

// Toggle notifications
document.getElementById('notifications-toggle')?.addEventListener('click', () => {
  settings.notifications = !settings.notifications;
  saveSettings();
  updateSettingsUI();

  if (settings.notifications) {
    requestNotificationPermission();
  }

  showToast(`Notifications ${settings.notifications ? 'activées' : 'désactivées'}`, 'info');
});

// Toggle animations
document.getElementById('animations-toggle')?.addEventListener('click', () => {
  settings.animations = !settings.animations;
  saveSettings();
  applySettings();
  updateSettingsUI();
  showToast(`Animations ${settings.animations ? 'activées' : 'désactivées'}`, 'info');
});

// Toggle sound
document.getElementById('sound-toggle')?.addEventListener('click', () => {
  settings.sound = !settings.sound;
  saveSettings();
  updateSettingsUI();

  if (settings.sound) {
    sounds.coin();
  }

  showToast(`Son ${settings.sound ? 'activé' : 'désactivé'}`, 'info');
});

// Toggle force dark mode at night
document.getElementById('force-dark-mode-toggle')?.addEventListener('click', () => {
  settings.forceDarkModeAtNight = !settings.forceDarkModeAtNight;
  saveSettings();
  updateSettingsUI();

  // Appliquer immédiatement le changement
  if (typeof applyDayNightTheme === 'function') {
    applyDayNightTheme();
  }

  showToast(`Mode sombre auto ${settings.forceDarkModeAtNight ? 'activé' : 'désactivé'}`, 'info');
});

// Autosave interval
document.getElementById('autosave-interval')?.addEventListener('change', (e) => {
  settings.autosaveInterval = parseInt(e.target.value) * 1000;
  saveSettings();
  setupAutosave();
  showToast(`Intervalle de sauvegarde: ${e.target.selectedOptions[0].text}`, 'info');
});

// Graphics quality
document.getElementById('graphics-quality')?.addEventListener('change', (e) => {
  settings.graphicsQuality = e.target.value;
  saveSettings();
  applySettings();
  showToast(`Qualité graphique: ${e.target.selectedOptions[0].text}`, 'info');
});

// Language (placeholder - pas implémenté)
document.getElementById('language-select')?.addEventListener('change', (e) => {
  settings.language = e.target.value;
  saveSettings();
  showToast(`Langue: ${e.target.selectedOptions[0].text} (à venir)`, 'info');
});

// Export save
document.getElementById('export-save-btn')?.addEventListener('click', exportSave);

// Import save
document.getElementById('import-save-btn')?.addEventListener('click', importSave);

// Reset save
document.getElementById('reset-save-btn')?.addEventListener('click', resetSave);

// ============================================
// INITIALIZATION
// ============================================

// Charger les paramètres au démarrage
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupSoundHooks();

  // Vérifier les plantes prêtes toutes les 5 minutes
  setInterval(checkHarvestNotifications, 5 * 60 * 1000);
});

console.log('✅ Extended Settings loaded');
