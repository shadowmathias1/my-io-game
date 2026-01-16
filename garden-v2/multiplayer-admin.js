/* ============================================
   MULTIPLAYER ADMIN SYSTEM (CLIENT SIDE)
   Système d'administration multiplayer côté client
   ============================================ */

// Configuration - À MODIFIER avec ton serveur
const SERVER_CONFIG = {
  enabled: true, // Activer le multiplayer
  serverUrl: window.location.origin, // URL du serveur
  adminPassword: '1234' // Mot de passe admin (temporaire)
};

// État multiplayer
const multiplayerState = {
  connected: false,
  socket: null,
  isAdmin: false,
  playerId: null,
  players: [],
  adminMode: false,
  selectedTargetId: null,
  serverStats: null,
  actionHistory: [],
  maxHistorySize: 50
};

// ============================================
// CONNECTION AU SERVEUR
// ============================================

function initMultiplayer() {
  console.log('🔵 initMultiplayer() appelé', {
    hasSocket: !!multiplayerState.socket,
    enabled: SERVER_CONFIG.enabled,
    serverUrl: SERVER_CONFIG.serverUrl
  });

  if (multiplayerState.socket) {
    console.log('⚠️ Socket déjà existant');
    return;
  }
  if (!SERVER_CONFIG.enabled) {
    console.log('⚠️ Multiplayer désactivé');
    return;
  }

  // Vérifier si Socket.IO est disponible
  if (typeof io === 'undefined') {
    console.error('❌ Socket.IO non disponible. Incluez <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>');
    if (typeof showToast === 'function') {
      showToast('❌ Socket.IO non chargé', 'error');
    }
    return;
  }

  console.log('🔵 Connexion au serveur:', SERVER_CONFIG.serverUrl);
  // Se connecter au serveur
  multiplayerState.socket = io(SERVER_CONFIG.serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
  });

  multiplayerState.socket.on('connect', () => {
    console.log('✅ Connecté au serveur multiplayer');
    multiplayerState.connected = true;
    multiplayerState.playerId = multiplayerState.socket.id;

    // Envoyer l'état initial
    sendPlayerUpdate();

    if (typeof showToast === 'function') {
      showToast('🌐 Connecté au serveur', 'success');
    }
  });

  multiplayerState.socket.on('disconnect', () => {
    console.log('❌ Déconnecté du serveur');
    multiplayerState.connected = false;

    if (typeof showToast === 'function') {
      showToast('🌐 Déconnecté du serveur', 'warning');
    }
  });

  // Recevoir la liste des joueurs
  multiplayerState.socket.on('players-list', (players) => {
    multiplayerState.players = players;
    if (multiplayerState.isAdmin) {
      renderAdminPlayersList();
      updateServerStatsDisplay();
    }
  });

  // Recevoir les statistiques du serveur
  multiplayerState.socket.on('server-stats', (stats) => {
    multiplayerState.serverStats = stats;
    updateServerStatsDisplay();
  });

  // Recevoir des cadeaux d'admin
  multiplayerState.socket.on('admin-gift', (data) => {
    handleAdminGift(data);
  });

  // Confirmation d'admin
  multiplayerState.socket.on('admin-authenticated', () => {
    multiplayerState.isAdmin = true;
    if (typeof showToast === 'function') {
      showToast('👑 Mode Admin activé', 'success');
    }
    // Request initial stats
    requestServerStats();
    openAdminMultiplayerPanel();
  });

  // Erreur d'authentification
  multiplayerState.socket.on('admin-error', (message) => {
    console.log('❌ Erreur admin:', message);
    if (typeof showToast === 'function') {
      showToast(`❌ ${message}`, 'error');
    }
  });

  multiplayerState.socket.on('connect_error', (error) => {
    console.error('❌ Erreur de connexion:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Impossible de se connecter au serveur', 'error');
    }
  });

  multiplayerState.socket.on('reconnect', (attemptNumber) => {
    console.log('✅ Reconnecté après', attemptNumber, 'tentatives');
    if (typeof showToast === 'function') {
      showToast('✅ Reconnecté au serveur', 'success');
    }
    sendPlayerUpdate();
    if (multiplayerState.isAdmin) {
      requestPlayersList();
      requestServerStats();
    }
  });

  multiplayerState.socket.on('reconnect_attempt', () => {
    console.log('🔄 Tentative de reconnexion...');
  });

  multiplayerState.socket.on('reconnect_error', (error) => {
    console.error('❌ Erreur de reconnexion:', error);
  });

  multiplayerState.socket.on('reconnect_failed', () => {
    console.error('❌ Échec de reconnexion');
    if (typeof showToast === 'function') {
      showToast('❌ Impossible de se reconnecter. Rechargez la page.', 'error');
    }
  });

  multiplayerState.socket.on('error', (error) => {
    console.error('❌ Erreur socket:', error);
  });
}

// Envoyer une mise à jour du joueur
function getSeasonIdFromState() {
  if (typeof state === 'undefined' || !state.season) return 'spring';
  const current = state.season.current;
  if (typeof current === 'number' && typeof SEASONS !== 'undefined' && Array.isArray(SEASONS)) {
    const entry = SEASONS[current];
    if (entry && entry.id) return entry.id;
  }
  if (typeof current === 'string') return current;
  return 'spring';
}

function getWeatherIdFromState() {
  if (typeof state === 'undefined' || !state.weather) return 'sun';
  const current = state.weather.current;
  if (typeof current === 'string') return current;
  if (current && typeof current.id === 'string') return current.id;
  return 'sun';
}

function getSeasonLabel(id) {
  if (typeof SEASONS !== 'undefined' && Array.isArray(SEASONS)) {
    const entry = SEASONS.find((season) => season.id === id);
    if (entry && entry.name) return entry.name;
  }
  return id || 'spring';
}

function getWeatherLabel(id) {
  if (typeof WEATHER_TYPES !== 'undefined' && Array.isArray(WEATHER_TYPES)) {
    const entry = WEATHER_TYPES.find((weather) => weather.id === id);
    if (entry && entry.name) return entry.name;
  }
  return id || 'sun';
}

function buildSeasonOptions(selectedId) {
  if (typeof SEASONS !== 'undefined' && Array.isArray(SEASONS)) {
    return SEASONS.map((season) => {
      const id = season.id || 'spring';
      const label = season.name || id;
      const selected = id === selectedId ? 'selected' : '';
      return `<option value="${id}" ${selected}>${label}</option>`;
    }).join('');
  }
  const fallback = [
    { id: 'spring', label: 'Printemps' },
    { id: 'summer', label: 'Ete' },
    { id: 'autumn', label: 'Automne' },
    { id: 'winter', label: 'Hiver' }
  ];
  return fallback.map((season) => {
    const selected = season.id === selectedId ? 'selected' : '';
    return `<option value="${season.id}" ${selected}>${season.label}</option>`;
  }).join('');
}

function buildWeatherOptions(selectedId) {
  if (typeof WEATHER_TYPES !== 'undefined' && Array.isArray(WEATHER_TYPES)) {
    return WEATHER_TYPES.map((weather) => {
      const id = weather.id || 'sun';
      const label = weather.name || id;
      const selected = id === selectedId ? 'selected' : '';
      return `<option value="${id}" ${selected}>${label}</option>`;
    }).join('');
  }
  const fallback = [
    { id: 'sun', label: 'Soleil' },
    { id: 'rain', label: 'Pluie' },
    { id: 'cloud', label: 'Nuages' },
    { id: 'storm', label: 'Orage' },
    { id: 'frost', label: 'Gel' }
  ];
  return fallback.map((weather) => {
    const selected = weather.id === selectedId ? 'selected' : '';
    return `<option value="${weather.id}" ${selected}>${weather.label}</option>`;
  }).join('');
}

function buildPlantOptions(selectedId) {
  if (typeof PLANTS !== 'undefined' && Array.isArray(PLANTS)) {
    return PLANTS.map((plant) => {
      const id = plant.id || '';
      const label = plant.name || id;
      const selected = id === selectedId ? 'selected' : '';
      return `<option value="${id}" ${selected}>${label}</option>`;
    }).join('');
  }
  return '<option value="grass">Herbe</option>';
}

function buildBuildingOptions(selectedId) {
  if (typeof BUILDINGS !== 'undefined' && Array.isArray(BUILDINGS)) {
    return BUILDINGS.map((building) => {
      const id = building.id || '';
      const label = building.name || id;
      const selected = id === selectedId ? 'selected' : '';
      return `<option value="${id}" ${selected}>${label}</option>`;
    }).join('');
  }
  return '<option value="sprinkler">Arrosoir</option>';
}

function buildPestOptions(selectedId) {
  if (typeof PEST_TYPES !== 'undefined') {
    const pests = Object.values(PEST_TYPES);
    return pests.map((pest) => {
      const id = pest.id || '';
      const label = pest.name || id;
      const selected = id == selectedId ? 'selected' : '';
      return `<option value="${id}" ${selected}>${label}</option>`;
    }).join('');
  }
  return '<option value="">Aucun</option>';
}

function buildPlayerSelectOptions(selectedId) {
  return multiplayerState.players.map((player) => {
    const suffix = player.id === multiplayerState.playerId ? ' (vous)' : '';
    const label = `${player.name}${suffix}`;
    const selected = player.id === selectedId ? 'selected' : '';
    return `<option value="${player.id}" ${selected}>${label}</option>`;
  }).join('');
}

function getDefaultTargetId() {
  const other = multiplayerState.players.find((player) => player.id !== multiplayerState.playerId);
  if (other) return other.id;
  return multiplayerState.players.length ? multiplayerState.players[0].id : null;
}

function getActiveTargetId() {
  const current = multiplayerState.selectedTargetId;
  if (current && multiplayerState.players.some((player) => player.id === current)) {
    return current;
  }
  const fallback = getDefaultTargetId();
  multiplayerState.selectedTargetId = fallback;
  return fallback;
}

function setAdminTarget(targetId) {
  multiplayerState.selectedTargetId = targetId;
  renderAdminPlayersList();
}

function getNumberInputValue(id, fallback = 0) {
  const input = document.getElementById(id);
  if (!input) return fallback;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function getSelectValue(id, fallback = '') {
  const select = document.getElementById(id);
  if (!select) return fallback;
  return select.value || fallback;
}

function sendPlayerUpdate() {
  if (!multiplayerState.connected || !multiplayerState.socket) return;

  const playerData = {
    id: multiplayerState.playerId,
    name: state.playerName || 'Joueur',
    coins: state.coins,
    level: state.level || 1,
    prestigeLevel: state.prestige?.level || 0,
    totalPlants: state.stats?.totalPlants || 0,
    season: getSeasonIdFromState(),
    weather: getWeatherIdFromState()
  };

  multiplayerState.socket.emit('player-update', playerData);
}

// ============================================
// AUTHENTIFICATION ADMIN
// ============================================

function authenticateAdmin(password) {
  if (!multiplayerState.connected) {
    if (typeof showToast === 'function') {
      showToast('❌ Non connecté au serveur', 'error');
    }
    return;
  }

  multiplayerState.socket.emit('admin-authenticate', password);
}

function requestPlayersList() {
  if (!multiplayerState.connected || !multiplayerState.socket) return;
  multiplayerState.socket.emit('admin-request-players');
}

function requestServerStats() {
  if (!multiplayerState.connected || !multiplayerState.socket) return;
  multiplayerState.socket.emit('admin-request-stats');
}

function logAdminAction(action, details = '') {
  const log = {
    timestamp: Date.now(),
    action,
    details,
    time: new Date().toLocaleTimeString()
  };
  multiplayerState.actionHistory.unshift(log);
  if (multiplayerState.actionHistory.length > multiplayerState.maxHistorySize) {
    multiplayerState.actionHistory.pop();
  }
  updateActionHistoryDisplay();
}

function getPlayerName(playerId) {
  const player = multiplayerState.players.find(p => p.id === playerId);
  return player ? player.name : 'Unknown';
}

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}j ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// ============================================
// ACTIONS ADMIN
// ============================================

function adminSendCoins(targetPlayerId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Accès admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'send-coins',
    targetId: targetPlayerId,
    amount: amount
  });

  const playerName = getPlayerName(targetPlayerId);
  logAdminAction('💰 Send Coins', `${amount} → ${playerName}`);
  showToast(`💰 ${amount} coins envoyés`, 'success');
}

function adminChangeWeather(targetPlayerId, weather) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Accès admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'change-weather',
    targetId: targetPlayerId,
    weather: weather
  });

  const playerName = getPlayerName(targetPlayerId);
  logAdminAction('🌤️ Change Weather', `${weather} → ${playerName}`);
  showToast(`🌤️ Météo changée: ${weather}`, 'success');
}

function adminChangeSeason(targetPlayerId, season) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Accès admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'change-season',
    targetId: targetPlayerId,
    season: season
  });

  showToast(`🍂 Saison changée: ${season}`, 'success');
}

function adminBroadcast(message) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Accès admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'broadcast',
    message: message
  });

  logAdminAction('📢 Broadcast', message.slice(0, 30) + (message.length > 30 ? '...' : ''));
  showToast('📢 Message diffusé', 'success');
}

function adminKickPlayer(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Accès admin requis', 'error');
    return;
  }

  if (!confirm('Êtes-vous sûr de vouloir expulser ce joueur?')) return;

  multiplayerState.socket.emit('admin-action', {
    type: 'kick-player',
    targetId: targetPlayerId
  });

  const playerName = getPlayerName(targetPlayerId);
  logAdminAction('🚫 Kick Player', playerName);
  showToast('🚫 Joueur expulsé', 'warning');
}

function adminAdjustCoins(targetPlayerId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'adjust-coins',
    targetId: targetPlayerId,
    amount: amount
  });

  showToast(`💰 ${amount} coins ajustes`, 'success');
}

function adminSetCoins(targetPlayerId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'set-coins',
    targetId: targetPlayerId,
    amount: amount
  });

  showToast(`💰 Solde fixe: ${amount}`, 'success');
}

function adminSendSeeds(targetPlayerId, plantId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'add-seeds',
    targetId: targetPlayerId,
    plantId: plantId,
    amount: amount
  });

  showToast(`🌱 +${amount} graines`, 'success');
}

function adminSendSeedsAll(targetPlayerId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'add-seeds-all',
    targetId: targetPlayerId,
    amount: amount
  });

  showToast(`🌱 +${amount} graines (toutes)`, 'success');
}

function adminClearSeeds(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'clear-seeds',
    targetId: targetPlayerId
  });

  showToast('🧹 Graines effacees', 'warning');
}

function adminAddSpecials(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'add-specials',
    targetId: targetPlayerId
  });

  showToast('✨ Plantes speciales ajoutees', 'success');
}

function adminForceLegendaryEvent(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'force-legendary-event',
    targetId: targetPlayerId
  });

  showToast('✨ Event legendaire force', 'success');
}

function adminResetStreak(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'reset-streak',
    targetId: targetPlayerId
  });

  showToast('🔄 Streak reinitialisee', 'warning');
}

function adminForceHarvest(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'force-harvest',
    targetId: targetPlayerId
  });

  showToast('🧺 Recolte forcee', 'success');
}

function adminAddBuilding(targetPlayerId, buildingId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'add-building',
    targetId: targetPlayerId,
    buildingId: buildingId,
    amount: amount
  });

  showToast('🏗️ Batiment ajoute', 'success');
}

function adminAddHarvest(targetPlayerId, plantId, amount) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'add-harvest',
    targetId: targetPlayerId,
    plantId: plantId,
    amount: amount
  });

  showToast('📦 Recolte ajoutee', 'success');
}

function adminSetPrestigeLevel(targetPlayerId, level) {
  if (!multiplayerState.isAdmin) {
    showToast('❌ Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'set-prestige-level',
    targetId: targetPlayerId,
    level: level
  });

  showToast('👑 Prestige modifie', 'success');
}

function adminResetSave(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'reset-save',
    targetId: targetPlayerId
  });

  showToast('?? Reset envoye', 'warning');
}

function adminForceNight(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'force-night',
    targetId: targetPlayerId
  });

  showToast('?? Nuit forcee', 'success');
}

function adminForceDay(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'force-day',
    targetId: targetPlayerId
  });

  showToast('?? Jour force', 'success');
}

function adminPestInfect(targetPlayerId, pestId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'pest-infect',
    targetId: targetPlayerId,
    pestId: pestId
  });

  showToast('?? Infection envoyee', 'success');
}

function adminPestClear(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'pest-clear',
    targetId: targetPlayerId
  });

  showToast('?? Maladies nettoyees', 'success');
}

function adminBanPlayer(targetPlayerId) {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  if (!confirm('Bannir ce joueur ?')) return;

  multiplayerState.socket.emit('admin-action', {
    type: 'ban-player',
    targetId: targetPlayerId
  });

  showToast('? Joueur banni', 'warning');
}

function adminUnbanAll() {
  if (!multiplayerState.isAdmin) {
    showToast('? Acces admin requis', 'error');
    return;
  }

  multiplayerState.socket.emit('admin-action', {
    type: 'unban-all'
  });

  showToast('? Bans reinitialises', 'success');
}

// ============================================
// RECEVOIR DES CADEAUX ADMIN
// ============================================

function handleAdminGift(data) {
  const applyRender = () => {
    if (typeof needsRender !== 'undefined') needsRender = true;
    if (typeof saveGame === 'function') saveGame();
  };

  const forceHarvestReady = () => {
    if (!state?.garden?.plots || typeof harvestPlot !== 'function') return;
    let harvested = 0;
    state.garden.plots.forEach((plot, index) => {
      if (plot.ready && plot.plantId) {
        const mainIndex = plot.mainPlotIndex != null ? plot.mainPlotIndex : index;
        harvestPlot(mainIndex);
        harvested++;
      }
    });
    if (harvested == 0) {
      showToast('Aucune plante prete', 'info');
    }
  };

  const forceDayNight = (mode) => {
    if (typeof dayNightState === 'undefined') return;
    dayNightState.current = mode;
    dayNightState.cycleStart = Date.now();
    if (mode == 'night') {
      const duration = typeof DAY_NIGHT_CONFIG !== 'undefined' ? DAY_NIGHT_CONFIG.nightDuration : 720000;
      dayNightState.nextTransition = Date.now() + duration;
    } else {
      const duration = typeof DAY_NIGHT_CONFIG !== 'undefined' ? DAY_NIGHT_CONFIG.dayDuration : 720000;
      dayNightState.nextTransition = Date.now() + duration;
    }
    if (typeof applyDayNightTheme === 'function') {
      applyDayNightTheme();
    }
  };

  const infectRandomPlot = (pestId) => {
    if (typeof infectPlot !== 'function' || !state?.garden?.plots) return;
    if (!state.pests) state.pests = { activePests: {}, totalInfections: 0, totalCured: 0, treatmentsUsed: 0, protection: null };
    if (!state.pests.activePests) state.pests.activePests = {};

    const candidates = [];
    state.garden.plots.forEach((plot, index) => {
      if (!plot || !plot.plantId) return;
      if (state.pests.activePests[index]) return;
      candidates.push(index);
    });

    if (!candidates.length) {
      showToast('Aucune plante a infecter', 'warning');
      return;
    }

    const index = candidates[Math.floor(Math.random() * candidates.length)];
    infectPlot(index, pestId);
  };

  switch (data.type) {
    case 'send-coins':
    case 'adjust-coins': {
      const amount = Number(data.amount) || 0;
      state.coins = Math.max(0, state.coins + amount);
      if (amount > 0) {
        state.lifetimeCoins = Math.max(0, state.lifetimeCoins + amount);
      }
      showToast(`?? Admin a ajuste ${amount} coins`, 'success');
      applyRender();
      break;
    }

    case 'set-coins': {
      const amount = Math.max(0, Number(data.amount) || 0);
      state.coins = amount;
      state.lifetimeCoins = Math.max(state.lifetimeCoins || 0, amount);
      showToast(`?? Solde fixe: ${amount}`, 'success');
      applyRender();
      break;
    }

    case 'change-weather': {
      if (state.weather) {
        state.weather.current = data.weather;
        state.weather.startTime = Date.now();
        state.weather.nextChange = Date.now() + (5 * 60 * 1000);
        showToast(`??? Meteo: ${getWeatherLabel(data.weather)}`, 'info');
        applyRender();
      }
      break;
    }

    case 'change-season': {
      if (state.season) {
        if (typeof SEASONS !== 'undefined' && Array.isArray(SEASONS)) {
          const idx = SEASONS.findIndex((season) => season.id === data.season);
          state.season.current = idx >= 0 ? idx : 0;
          state.season.startTime = Date.now();
          state.season.nextChange = Date.now() + SEASONS[state.season.current].duration;
        } else {
          state.season.current = data.season;
        }
        showToast(`?? Saison: ${getSeasonLabel(data.season)}`, 'info');
        applyRender();
      }
      break;
    }

    case 'force-night': {
      forceDayNight('night');
      showToast('?? Nuit forcee', 'info');
      applyRender();
      break;
    }

    case 'force-day': {
      forceDayNight('day');
      showToast('?? Jour force', 'info');
      applyRender();
      break;
    }

    case 'pest-infect': {
      if (data.pestId) {
        infectRandomPlot(data.pestId);
        applyRender();
      }
      break;
    }

    case 'pest-clear': {
      if (!state.pests) state.pests = { activePests: {} };
      state.pests.activePests = {};
      showToast('?? Maladies nettoyees', 'success');
      applyRender();
      break;
    }

    case 'add-seeds': {
      if (!state.seeds) state.seeds = {};
      const amount = Math.max(0, Number(data.amount) || 0);
      const plantId = data.plantId;
      if (plantId) {
        state.seeds[plantId] = (state.seeds[plantId] || 0) + amount;
        showToast(`?? +${amount} graines`, 'success');
        applyRender();
      }
      break;
    }

    case 'add-seeds-all': {
      if (!state.seeds) state.seeds = {};
      const amount = Math.max(0, Number(data.amount) || 0);
      if (typeof PLANTS !== 'undefined' && Array.isArray(PLANTS)) {
        PLANTS.forEach((plant) => {
          state.seeds[plant.id] = (state.seeds[plant.id] || 0) + amount;
        });
      }
      showToast(`?? +${amount} graines (toutes)`, 'success');
      applyRender();
      break;
    }

    case 'clear-seeds': {
      if (state.seeds) {
        Object.keys(state.seeds).forEach((key) => {
          state.seeds[key] = 0;
        });
        showToast('?? Graines effacees', 'warning');
        applyRender();
      }
      break;
    }

    case 'add-specials': {
      if (!state.specialPlants) state.specialPlants = { inventory: {} };
      if (!state.specialPlants.inventory) state.specialPlants.inventory = {};
      if (typeof SPECIAL_PLANTS !== 'undefined' && Array.isArray(SPECIAL_PLANTS)) {
        SPECIAL_PLANTS.forEach((plant) => {
          state.specialPlants.inventory[plant.id] = (state.specialPlants.inventory[plant.id] || 0) + 1;
        });
        showToast('? Plantes speciales ajoutees', 'success');
        applyRender();
      }
      break;
    }

    case 'force-legendary-event': {
      if (typeof forceLegendaryEvent === 'function') {
        forceLegendaryEvent();
        showToast('? Event legendaire force', 'success');
        applyRender();
      }
      break;
    }

    case 'reset-streak': {
      state.dailyStreak = { current: 0, lastClaim: 0, canClaim: true, claimedDays: [] };
      showToast('?? Streak reinitialisee', 'warning');
      applyRender();
      break;
    }

    case 'force-harvest': {
      forceHarvestReady();
      applyRender();
      break;
    }

    case 'add-building': {
      const amount = Math.max(0, Number(data.amount) || 0);
      const buildingId = data.buildingId;
      if (!buildingId) break;
      if (!state.buildingInventory) state.buildingInventory = {};
      if (!state.owned) state.owned = { plants: {}, buildings: {} };
      if (!state.owned.buildings) state.owned.buildings = {};
      state.buildingInventory[buildingId] = (state.buildingInventory[buildingId] || 0) + amount;
      state.owned.buildings[buildingId] = (state.owned.buildings[buildingId] || 0) + amount;
      showToast('??? Batiment ajoute', 'success');
      applyRender();
      break;
    }

    case 'add-harvest': {
      const amount = Math.max(0, Number(data.amount) || 0);
      const plantId = data.plantId;
      if (!plantId) break;
      if (!state.inventory) state.inventory = { harvests: {}, craftingMaterials: {} };
      if (!state.inventory.harvests) state.inventory.harvests = {};
      state.inventory.harvests[plantId] = (state.inventory.harvests[plantId] || 0) + amount;
      showToast('?? Recolte ajoutee', 'success');
      applyRender();
      break;
    }

    case 'set-prestige-level': {
      const level = Math.max(0, Math.floor(Number(data.level) || 0));
      if (!state.prestige) state.prestige = { level: 0, multiplier: 1 };
      state.prestige.level = level;
      if (typeof getPrestigeMultiplier === 'function') {
        state.prestige.multiplier = getPrestigeMultiplier(level);
      } else if (typeof PRESTIGE !== 'undefined' && PRESTIGE.bonusPerLevel) {
        state.prestige.multiplier = 1 + (level * PRESTIGE.bonusPerLevel);
      }
      showToast('?? Prestige modifie', 'success');
      applyRender();
      break;
    }

    case 'reset-save': {
      showToast('?? Reset en cours...', 'warning');
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
      }, 800);
      break;
    }

    case 'broadcast': {
      showToast(`?? Admin: ${data.message}`, 'info');
      break;
    }
  }
}

// ============================================
// UI ADMIN MULTIPLAYER
// ============================================

function openAdminMultiplayerPanel() {
  const modal = document.getElementById('admin-multiplayer-modal');
  if (!modal) {
    createAdminMultiplayerModal();
  }

  const modalElement = document.getElementById('admin-multiplayer-modal');
  if (modalElement) {
    modalElement.classList.add('show');
    sendPlayerUpdate();
    requestPlayersList();
    requestServerStats();
    renderAdminPlayersList();
    updateServerStatsDisplay();
    updateActionHistoryDisplay();
  }
}

function closeAdminMultiplayerPanel() {
  const modal = document.getElementById('admin-multiplayer-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function createAdminMultiplayerModal() {
  const modal = document.createElement('div');
  modal.id = 'admin-multiplayer-modal';
  modal.className = 'modal admin-multiplayer-modal';
  modal.innerHTML = `
    <div class="modal-content admin-panel-content" style="max-width: 1400px; width: 95%;">
      <div class="modal-header">
        <h2>Admin Panel Multiplayer</h2>
        <button class="modal-close" onclick="closeAdminMultiplayerPanel()">&times;</button>
      </div>
      <div class="modal-body" style="max-height: 85vh; overflow-y: auto; padding: 25px;">
        <!-- Server Statistics -->
        <div id="admin-server-stats" style="margin-bottom: 25px;"></div>

        <!-- Quick Actions -->
        <div class="admin-section" style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.05)); border-radius: 16px; border: 2px solid rgba(155, 89, 182, 0.3);">
          <h3 style="margin: 0 0 15px 0; color: #9b59b6; font-size: 1.2em;">Actions Rapides</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
            <button class="btn" onclick="quickActionWelcomeAll()" style="background: #1abc9c; font-size: 0.95em; padding: 12px 16px; white-space: nowrap;">
              Bienvenue a Tous
            </button>
            <button class="btn" onclick="quickActionSunnyAll()" style="background: #f39c12; font-size: 0.95em; padding: 12px 16px; white-space: nowrap;">
              Soleil pour Tous
            </button>
            <button class="btn" onclick="quickActionNightAll()" style="background: #34495e; color: white; font-size: 0.95em; padding: 12px 16px; white-space: nowrap;">
              Nuit pour Tous
            </button>
            <button class="btn" onclick="requestServerStats()" style="background: #3498db; font-size: 0.95em; padding: 12px 16px; white-space: nowrap;">
              Rafraichir Stats
            </button>
          </div>
        </div>

        <!-- Players List -->
        <div id="admin-players-list"></div>

        <!-- Action History -->
        <div class="admin-section" style="margin-top: 25px; padding: 20px; background: rgba(52, 152, 219, 0.05); border-radius: 16px; border: 2px solid rgba(52, 152, 219, 0.2);">
          <h3 style="margin: 0 0 15px 0; color: #3498db; font-size: 1.2em;">Historique des Actions</h3>
          <div id="admin-action-history" style="max-height: 250px; overflow-y: auto; font-size: 0.9em;"></div>
        </div>

        <!-- Broadcast Message -->
        <div class="admin-section" style="margin-top: 25px; padding: 25px; background: rgba(52, 152, 219, 0.1); border-radius: 16px; border: 2px solid #3498db;">
          <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.2em;">Message Global</h3>
          <div style="display: flex; gap: 15px;">
            <input
              type="text"
              id="admin-broadcast-input"
              placeholder="Message a tous les joueurs..."
              style="flex: 1; padding: 14px; border-radius: 10px; border: 2px solid #3498db; font-size: 1em;"
            />
            <button class="btn" onclick="sendBroadcast()" style="background: #3498db; padding: 14px 24px; font-size: 1em;">
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// Stockage des valeurs des inputs admin pour éviter le reset
const adminInputValues = {
  coinsAmount: 1000,
  weather: 'sun',
  season: 'spring',
  pest: 'aphids',
  seedPlant: 'grass',
  seedAmount: 5,
  seedAllAmount: 3,
  harvestPlant: 'grass',
  harvestAmount: 3,
  building: 'sprinkler',
  buildingAmount: 1,
  prestige: 0
};

// Sauvegarder les valeurs actuelles des inputs
function saveAdminInputValues() {
  const inputs = {
    'admin-coins-amount': 'coinsAmount',
    'admin-weather': 'weather',
    'admin-season': 'season',
    'admin-pest': 'pest',
    'admin-seed-plant': 'seedPlant',
    'admin-seed-amount': 'seedAmount',
    'admin-seed-all': 'seedAllAmount',
    'admin-harvest-plant': 'harvestPlant',
    'admin-harvest-amount': 'harvestAmount',
    'admin-building': 'building',
    'admin-building-amount': 'buildingAmount',
    'admin-prestige': 'prestige'
  };

  Object.entries(inputs).forEach(([inputId, stateKey]) => {
    const el = document.getElementById(inputId);
    if (el) {
      adminInputValues[stateKey] = el.value;
    }
  });
}

function renderAdminPlayersList() {
  const container = document.getElementById('admin-players-list');
  if (!container) return;

  // Sauvegarder les valeurs actuelles avant de re-render
  saveAdminInputValues();

  if (multiplayerState.players.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-light);">
        Aucun joueur connecte
      </div>
    `;
    return;
  }

  const targetId = getActiveTargetId();
  const target = multiplayerState.players.find((player) => player.id === targetId) || multiplayerState.players[0];
  const playerOptions = buildPlayerSelectOptions(target?.id);
  const seasonOptions = buildSeasonOptions(adminInputValues.season);
  const weatherOptions = buildWeatherOptions(adminInputValues.weather);
  const plantOptions = buildPlantOptions(adminInputValues.seedPlant);
  const harvestPlantOptions = buildPlantOptions(adminInputValues.harvestPlant);
  const buildingOptions = buildBuildingOptions(adminInputValues.building);
  const pestOptions = buildPestOptions(adminInputValues.pest);
  const isSelf = target && target.id === multiplayerState.playerId;

  container.innerHTML = `
    <div class="admin-player-card" style="
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9));
      border: 2px solid rgba(46, 204, 113, 0.35);
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 20px;
    ">
      <!-- Header: Player Selection -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid rgba(46, 204, 113, 0.2);">
        <div>
          <h3 style="margin: 0 0 10px 0; color: #2ecc71; font-size: 1.3em;">Joueur Cible</h3>
          <select
            id="admin-target-select"
            onchange="setAdminTarget(this.value)"
            style="min-width: 280px; padding: 12px; border-radius: 10px; border: 2px solid #2ecc71; font-size: 1em;"
          >
            ${playerOptions}
          </select>
        </div>
        <div style="text-align: right; color: var(--text-light); background: rgba(46,204,113,0.1); padding: 12px 18px; border-radius: 12px;">
          <div style="font-size: 1.1em; font-weight: 600;">Connectes: ${multiplayerState.players.length}</div>
          <div style="font-size: 0.9em; margin-top: 4px;">ID: ${(target && target.id) ? target.id.slice(0, 8) + '...' : '--'}</div>
        </div>
      </div>

      <!-- Player Info -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 25px; padding: 15px; background: rgba(0,0,0,0.03); border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2em;">$</span>
          <span style="font-weight: 600;">${target?.coins?.toLocaleString?.() || 0} coins</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2em;">Niv.</span>
          <span style="font-weight: 600;">${target?.level || 1}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2em;">P</span>
          <span style="font-weight: 600;">Prestige ${target?.prestigeLevel || 0}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600;">${getSeasonLabel(target?.season)} - ${getWeatherLabel(target?.weather)}</span>
        </div>
      </div>

      <!-- Actions Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">

        <!-- Coins Section -->
        <div class="admin-action-group" style="background: rgba(46, 204, 113, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(46, 204, 113, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #2ecc71; font-size: 1em;">Gestion Coins</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input
              type="number"
              id="admin-coins-amount"
              placeholder="Montant"
              value="${adminInputValues.coinsAmount}"
              style="flex: 1; padding: 10px; border-radius: 8px; border: 2px solid #2ecc71; font-size: 1em;"
            />
            <button class="btn" onclick="adminAdjustCoins('${target?.id}', getNumberInputValue('admin-coins-amount', 0))" style="background:#2ecc71; padding: 10px 16px;">+/-</button>
            <button class="btn" onclick="adminSetCoins('${target?.id}', getNumberInputValue('admin-coins-amount', 0))" style="background:#27ae60; padding: 10px 16px;">=</button>
          </div>
        </div>

        <!-- Weather Section -->
        <div class="admin-action-group" style="background: rgba(52, 152, 219, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(52, 152, 219, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #3498db; font-size: 1em;">Meteo</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="admin-weather" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #3498db; font-size: 1em;">
              ${weatherOptions}
            </select>
            <button class="btn" onclick="adminChangeWeather('${target?.id}', getSelectValue('admin-weather', 'sun'))" style="background:#3498db; padding: 10px 20px;">Appliquer</button>
          </div>
        </div>

        <!-- Season Section -->
        <div class="admin-action-group" style="background: rgba(155, 89, 182, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(155, 89, 182, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #9b59b6; font-size: 1em;">Saison</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="admin-season" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #9b59b6; font-size: 1em;">
              ${seasonOptions}
            </select>
            <button class="btn" onclick="adminChangeSeason('${target?.id}', getSelectValue('admin-season', 'spring'))" style="background:#9b59b6; padding: 10px 20px;">Appliquer</button>
          </div>
        </div>

        <!-- Day/Night Section -->
        <div class="admin-action-group" style="background: rgba(44, 62, 80, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(44, 62, 80, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 1em;">Jour / Nuit</h4>
          <div style="display: flex; gap: 8px;">
            <button class="btn" onclick="adminForceNight('${target?.id}')" style="background:#2c3e50; color:#fff; flex: 1; padding: 10px;">Forcer Nuit</button>
            <button class="btn" onclick="adminForceDay('${target?.id}')" style="background:#f39c12; flex: 1; padding: 10px;">Forcer Jour</button>
          </div>
        </div>

        <!-- Pest Section -->
        <div class="admin-action-group" style="background: rgba(231, 76, 60, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(231, 76, 60, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #e74c3c; font-size: 1em;">Maladies</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="admin-pest" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #e74c3c; font-size: 1em;">
              ${pestOptions}
            </select>
            <button class="btn" onclick="adminPestInfect('${target?.id}', getSelectValue('admin-pest'))" style="background:#e74c3c; padding: 10px 14px;">Infecter</button>
            <button class="btn" onclick="adminPestClear('${target?.id}')" style="background:#c0392b; padding: 10px 14px;">Clean</button>
          </div>
        </div>

        <!-- Seeds Section -->
        <div class="admin-action-group" style="background: rgba(22, 160, 133, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(22, 160, 133, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #16a085; font-size: 1em;">Graines</h4>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
            <select id="admin-seed-plant" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #16a085; font-size: 1em;">
              ${plantOptions}
            </select>
            <input type="number" id="admin-seed-amount" value="${adminInputValues.seedAmount}" style="width:70px; padding:10px; border-radius:8px; border:2px solid #16a085; font-size: 1em;" />
            <button class="btn" onclick="adminSendSeeds('${target?.id}', getSelectValue('admin-seed-plant'), getNumberInputValue('admin-seed-amount', 1))" style="background:#16a085; padding: 10px 14px;">+</button>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="admin-seed-all" value="${adminInputValues.seedAllAmount}" placeholder="Toutes" style="flex:1; padding:10px; border-radius:8px; border:2px solid #1abc9c; font-size: 1em;" />
            <button class="btn" onclick="adminSendSeedsAll('${target?.id}', getNumberInputValue('admin-seed-all', 1))" style="background:#1abc9c; padding: 10px 14px;">+ Toutes</button>
            <button class="btn danger" onclick="adminClearSeeds('${target?.id}')" style="padding: 10px 14px;">Clear</button>
          </div>
        </div>

        <!-- Harvest Section -->
        <div class="admin-action-group" style="background: rgba(243, 156, 18, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(243, 156, 18, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #f39c12; font-size: 1em;">Recoltes</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="admin-harvest-plant" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #f39c12; font-size: 1em;">
              ${harvestPlantOptions}
            </select>
            <input type="number" id="admin-harvest-amount" value="${adminInputValues.harvestAmount}" style="width:70px; padding:10px; border-radius:8px; border:2px solid #f39c12; font-size: 1em;" />
            <button class="btn" onclick="adminAddHarvest('${target?.id}', getSelectValue('admin-harvest-plant'), getNumberInputValue('admin-harvest-amount', 1))" style="background:#f39c12; padding: 10px 14px;">+</button>
          </div>
        </div>

        <!-- Building Section -->
        <div class="admin-action-group" style="background: rgba(142, 68, 173, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(142, 68, 173, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #8e44ad; font-size: 1em;">Batiments</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="admin-building" style="flex:1; padding: 10px; border-radius: 8px; border: 2px solid #8e44ad; font-size: 1em;">
              ${buildingOptions}
            </select>
            <input type="number" id="admin-building-amount" value="${adminInputValues.buildingAmount}" style="width:70px; padding:10px; border-radius:8px; border:2px solid #8e44ad; font-size: 1em;" />
            <button class="btn" onclick="adminAddBuilding('${target?.id}', getSelectValue('admin-building'), getNumberInputValue('admin-building-amount', 1))" style="background:#8e44ad; padding: 10px 14px;">+</button>
          </div>
        </div>

        <!-- Prestige Section -->
        <div class="admin-action-group" style="background: rgba(192, 57, 43, 0.08); padding: 15px; border-radius: 12px; border: 1px solid rgba(192, 57, 43, 0.2);">
          <h4 style="margin: 0 0 12px 0; color: #c0392b; font-size: 1em;">Prestige</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="admin-prestige" value="${adminInputValues.prestige}" placeholder="Niveau" style="flex:1; padding:10px; border-radius:8px; border:2px solid #c0392b; font-size: 1em;" />
            <button class="btn" onclick="adminSetPrestigeLevel('${target?.id}', getNumberInputValue('admin-prestige', 0))" style="background:#c0392b; padding: 10px 20px;">Definir</button>
          </div>
        </div>

      </div>

      <!-- Special Actions -->
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(0,0,0,0.1);">
        <h4 style="margin: 0 0 15px 0; color: #7f8c8d; font-size: 1em;">Actions Speciales</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <button class="btn" onclick="adminAddSpecials('${target?.id}')" style="background:#9b59b6; padding: 12px;">+ Specials</button>
          <button class="btn" onclick="adminForceLegendaryEvent('${target?.id}')" style="background:#f1c40f; color: #333; padding: 12px;">Legendary</button>
          <button class="btn" onclick="adminResetStreak('${target?.id}')" style="background:#d35400; padding: 12px;">Reset Streak</button>
          <button class="btn" onclick="adminForceHarvest('${target?.id}')" style="background:#2ecc71; padding: 12px;">Force Harvest</button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div style="margin-top: 20px; padding: 20px; background: rgba(231, 76, 60, 0.08); border-radius: 12px; border: 2px solid rgba(231, 76, 60, 0.3);">
        <h4 style="margin: 0 0 15px 0; color: #e74c3c; font-size: 1em;">Zone Danger</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <button class="btn danger" onclick="adminKickPlayer('${target?.id}')" ${isSelf ? 'disabled' : ''} style="padding: 12px;">Kick</button>
          <button class="btn danger" onclick="adminBanPlayer('${target?.id}')" ${isSelf ? 'disabled' : ''} style="padding: 12px;">Ban</button>
          <button class="btn" onclick="adminUnbanAll()" style="background:#16a085; padding: 12px;">Unban All</button>
          <button class="btn danger" onclick="if (confirm('Reset complet du joueur?')) adminResetSave('${target?.id}')" style="padding: 12px;">Reset Save</button>
        </div>
      </div>
    </div>
  `;
}

function sendBroadcast() {
  const input = document.getElementById('admin-broadcast-input');
  if (!input || !input.value.trim()) return;

  adminBroadcast(input.value.trim());
  input.value = '';
}

function updateServerStatsDisplay() {
  const container = document.getElementById('admin-server-stats');
  if (!container) return;

  const stats = multiplayerState.serverStats;
  if (!stats) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-light);">
        <p>Chargement des statistiques...</p>
      </div>
    `;
    return;
  }

  const uptime = formatUptime(stats.uptime || 0);
  const activePlayers = stats.activePlayers || 0;
  const peakPlayers = stats.peakPlayers || 0;
  const totalConns = stats.totalConnections || 0;
  const totalDisconns = stats.totalDisconnections || 0;
  const adminActions = stats.adminActions || 0;

  container.innerHTML = `
    <div style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(39, 174, 96, 0.05)); border-radius: 12px; padding: 15px; border: 2px solid rgba(46, 204, 113, 0.3);">
      <h3 style="margin: 0 0 12px 0; color: #2ecc71;">📊 Statistiques du Serveur</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; font-size: 0.9em;">
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #27ae60; font-weight: bold; font-size: 1.4em;">${activePlayers}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">👥 Joueurs Actifs</div>
        </div>
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #e74c3c; font-weight: bold; font-size: 1.4em;">${peakPlayers}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">📈 Pic Joueurs</div>
        </div>
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #3498db; font-weight: bold; font-size: 1.4em;">${uptime}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">⏱️ Uptime</div>
        </div>
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #9b59b6; font-weight: bold; font-size: 1.4em;">${totalConns}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">🔌 Connexions</div>
        </div>
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #f39c12; font-weight: bold; font-size: 1.4em;">${totalDisconns}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">💤 Déconnexions</div>
        </div>
        <div style="background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; text-align: center;">
          <div style="color: #e67e22; font-weight: bold; font-size: 1.4em;">${adminActions}</div>
          <div style="color: var(--text-light); font-size: 0.85em;">⚡ Actions Admin</div>
        </div>
      </div>
    </div>
  `;
}

function updateActionHistoryDisplay() {
  const container = document.getElementById('admin-action-history');
  if (!container) return;

  if (multiplayerState.actionHistory.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-light);">
        Aucune action pour le moment
      </div>
    `;
    return;
  }

  const logs = multiplayerState.actionHistory.slice(0, 10).map(log => `
    <div style="padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-weight: bold;">${log.action}</span>
        ${log.details ? `<span style="color: var(--text-light); margin-left: 8px;">${log.details}</span>` : ''}
      </div>
      <div style="color: var(--text-light); font-size: 0.85em; white-space: nowrap;">${log.time}</div>
    </div>
  `).join('');

  container.innerHTML = logs;
}

// Quick Actions
function quickActionWelcomeAll() {
  multiplayerState.players.forEach(player => {
    if (player.id !== multiplayerState.playerId) {
      adminAdjustCoins(player.id, 1000);
      adminSendSeedsAll(player.id, 5);
    }
  });
  adminBroadcast('🎁 Bienvenue! Voici 1000 coins et des graines pour commencer!');
  logAdminAction('🎁 Welcome All', `${multiplayerState.players.length} joueurs`);
}

function quickActionSunnyAll() {
  multiplayerState.players.forEach(player => {
    adminChangeWeather(player.id, 'sun');
  });
  logAdminAction('☀️ Sunny All', `${multiplayerState.players.length} joueurs`);
  showToast('☀️ Soleil pour tous les joueurs', 'success');
}

function quickActionNightAll() {
  multiplayerState.players.forEach(player => {
    adminForceNight(player.id);
  });
  logAdminAction('🌙 Night All', `${multiplayerState.players.length} joueurs`);
  showToast('🌙 Nuit pour tous les joueurs', 'success');
}

// ============================================
// BOUTON ADMIN DANS LE PANEL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Ajouter bouton multiplayer dans admin panel
  const adminPanel = document.getElementById('admin-panel');
  if (adminPanel) {
    const adminBody = adminPanel.querySelector('.admin-body');
    if (adminBody) {
      const multiplayerRow = document.createElement('div');
      multiplayerRow.className = 'admin-row';
      multiplayerRow.innerHTML = `
        <button id="admin-multiplayer-connect" class="btn accent">
          🌐 ${SERVER_CONFIG.enabled ? 'Panel Multiplayer' : 'Activer Multiplayer'}
        </button>
      `;
      adminBody.appendChild(multiplayerRow);

      document.getElementById('admin-multiplayer-connect')?.addEventListener('click', () => {
        console.log('🔵 Bouton multiplayer cliqué', {
          enabled: SERVER_CONFIG.enabled,
          connected: multiplayerState.connected,
          isAdmin: multiplayerState.isAdmin
        });

        if (!SERVER_CONFIG.enabled) {
          const enable = confirm('Activer le mode multiplayer?\n\nVous devez avoir un serveur configuré.');
          if (enable) {
            SERVER_CONFIG.enabled = true;
            initMultiplayer();
          }
          return;
        }

        if (!multiplayerState.connected) {
          console.log('❌ Tentative de connexion...');
          if (typeof showToast === 'function') {
            showToast('❌ Non connecté au serveur. Tentative de connexion...', 'error');
          }
          // Essayer de se connecter
          initMultiplayer();
          // Attendre un peu et réessayer
          setTimeout(() => {
            if (multiplayerState.connected) {
              if (typeof showToast === 'function') {
                showToast('✅ Connecté! Cliquez à nouveau.', 'success');
              }
            } else {
              if (typeof showToast === 'function') {
                showToast('❌ Impossible de se connecter au serveur.', 'error');
              }
            }
          }, 2000);
          return;
        }

        if (!multiplayerState.isAdmin) {
          const password = prompt('Mot de passe admin:');
          console.log('🔑 Authentification admin...');
          if (password) {
            authenticateAdmin(password);
          }
        } else {
          console.log('✅ Ouverture du panel admin');
          openAdminMultiplayerPanel();
        }
      });
    }
  }
});

// Envoyer des updates périodiques
setInterval(() => {
  if (multiplayerState.connected) {
    sendPlayerUpdate();
    // Refresh stats if admin panel is open
    const modal = document.getElementById('admin-multiplayer-modal');
    if (modal && modal.classList.contains('show') && multiplayerState.isAdmin) {
      requestServerStats();
    }
  }
}, 5000); // Toutes les 5 secondes

// Rafraichir quand l'onglet redevient actif
window.addEventListener('focus', () => {
  if (multiplayerState.connected) {
    sendPlayerUpdate();
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && multiplayerState.connected) {
    sendPlayerUpdate();
  }
});

// Exposer les fonctions globalement
window.initMultiplayer = initMultiplayer;
window.authenticateAdmin = authenticateAdmin;
window.adminAdjustCoins = adminAdjustCoins;
window.adminSetCoins = adminSetCoins;
window.adminSendSeeds = adminSendSeeds;
window.adminSendSeedsAll = adminSendSeedsAll;
window.adminClearSeeds = adminClearSeeds;
window.adminAddSpecials = adminAddSpecials;
window.adminForceLegendaryEvent = adminForceLegendaryEvent;
window.adminResetStreak = adminResetStreak;
window.adminForceHarvest = adminForceHarvest;
window.adminAddBuilding = adminAddBuilding;
window.adminAddHarvest = adminAddHarvest;
window.adminSetPrestigeLevel = adminSetPrestigeLevel;
window.adminResetSave = adminResetSave;
window.adminChangeWeather = adminChangeWeather;
window.adminChangeSeason = adminChangeSeason;
window.adminBroadcast = adminBroadcast;
window.adminKickPlayer = adminKickPlayer;
window.adminForceNight = adminForceNight;
window.adminForceDay = adminForceDay;
window.adminPestInfect = adminPestInfect;
window.adminPestClear = adminPestClear;
window.adminBanPlayer = adminBanPlayer;
window.adminUnbanAll = adminUnbanAll;
window.setAdminTarget = setAdminTarget;
window.closeAdminMultiplayerPanel = closeAdminMultiplayerPanel;
window.sendBroadcast = sendBroadcast;
window.getNumberInputValue = getNumberInputValue;
window.getSelectValue = getSelectValue;
window.requestServerStats = requestServerStats;
window.updateServerStatsDisplay = updateServerStatsDisplay;
window.updateActionHistoryDisplay = updateActionHistoryDisplay;
window.quickActionWelcomeAll = quickActionWelcomeAll;
window.quickActionSunnyAll = quickActionSunnyAll;
window.quickActionNightAll = quickActionNightAll;

console.log('✅ Multiplayer Admin system loaded (client)');

// Auto-connect si activé
if (SERVER_CONFIG.enabled) {
  // Attendre que la page soit chargée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => initMultiplayer(), 500);
    });
  } else {
    setTimeout(() => initMultiplayer(), 500);
  }
}
