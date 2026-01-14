/* ============================================
   DEBUG MULTIPLAYER ADMIN
   Script pour débugger le système multiplayer
   ============================================ */

console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔧 MODE DEBUG MULTIPLAYER ACTIVÉ                          ║
╚════════════════════════════════════════════════════════════╝

Ce script va surveiller tous les événements multiplayer.
`);

// Intercepter tous les événements socket
if (multiplayerState && multiplayerState.socket) {
  const originalOn = multiplayerState.socket.on.bind(multiplayerState.socket);
  const originalEmit = multiplayerState.socket.emit.bind(multiplayerState.socket);

  // Log tous les événements reçus
  multiplayerState.socket.on = function(event, callback) {
    console.log(`📥 [SOCKET ON] Écoute de l'événement: ${event}`);
    return originalOn(event, (...args) => {
      console.log(`📨 [SOCKET RECEIVED] ${event}`, args);
      return callback(...args);
    });
  };

  // Log tous les événements envoyés
  multiplayerState.socket.emit = function(event, ...args) {
    console.log(`📤 [SOCKET EMIT] ${event}`, args);
    return originalEmit(event, ...args);
  };

  console.log('✅ Interception des événements socket activée');
}

// Fonction de debug pour l'authentification
window.debugAuth = function() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 DEBUG AUTHENTIFICATION ADMIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('État actuel:');
  console.table({
    'Connecté': multiplayerState.connected,
    'Admin': multiplayerState.isAdmin,
    'Socket': !!multiplayerState.socket,
    'Socket ID': multiplayerState.playerId || 'N/A'
  });

  if (!multiplayerState.connected) {
    console.log('❌ Pas connecté au serveur');
    console.log('💡 Essaie: initMultiplayer()');
    return;
  }

  console.log('\n🔑 Test d\'authentification avec mot de passe "1234"...');

  // Ajouter un listener temporaire pour voir la réponse
  const timeout = setTimeout(() => {
    if (!multiplayerState.isAdmin) {
      console.log('❌ Aucune réponse du serveur après 3 secondes');
      console.log('⚠️ Le serveur ne répond pas à l\'événement "admin-authenticate"');
      console.log('\n💡 Solutions possibles:');
      console.log('1. Vérifie que le serveur écoute l\'événement "admin-authenticate"');
      console.log('2. Vérifie les logs du serveur sur Render');
      console.log('3. Le serveur doit émettre "admin-authenticated" en cas de succès');
    }
  }, 3000);

  multiplayerState.socket.once('admin-authenticated', () => {
    clearTimeout(timeout);
    console.log('✅ Authentification réussie!');
    console.log('👑 Tu es maintenant admin');
    console.log('🎉 Le panneau devrait s\'ouvrir automatiquement');
  });

  multiplayerState.socket.once('admin-error', (message) => {
    clearTimeout(timeout);
    console.log('❌ Erreur d\'authentification:', message);
  });

  authenticateAdmin('1234');

  console.log('⏳ Envoi de la demande d\'authentification...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction pour forcer l'ouverture du panneau
window.forceOpenPanel = function() {
  console.log('🔓 Forçage de l\'ouverture du panneau admin...');

  if (!multiplayerState.connected) {
    console.log('❌ Pas connecté au serveur');
    return;
  }

  // Forcer le statut admin
  multiplayerState.isAdmin = true;
  console.log('✅ Statut admin forcé');

  // Ouvrir le panneau
  openAdminMultiplayerPanel();
  console.log('✅ Panneau ouvert');
};

// Fonction pour voir tous les listeners socket
window.debugSocketListeners = function() {
  if (!multiplayerState.socket) {
    console.log('❌ Pas de socket disponible');
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ÉVÉNEMENTS SOCKET ÉCOUTÉS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Socket.IO stocke les listeners dans _callbacks
  const listeners = multiplayerState.socket._callbacks || {};

  Object.keys(listeners).forEach(event => {
    const count = Array.isArray(listeners[event]) ? listeners[event].length : 1;
    console.log(`• ${event} (${count} listener${count > 1 ? 's' : ''})`);
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction pour tester la connexion serveur
window.testServerConnection = function() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔌 TEST DE CONNEXION SERVEUR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!multiplayerState.socket) {
    console.log('❌ Pas de socket');
    return;
  }

  console.log('URL du serveur:', SERVER_CONFIG.serverUrl);
  console.log('Socket connecté:', multiplayerState.socket.connected);
  console.log('Socket ID:', multiplayerState.socket.id);

  // Envoyer un ping
  console.log('\n📤 Envoi d\'un ping au serveur...');

  const startTime = Date.now();
  multiplayerState.socket.emit('ping', { timestamp: startTime });

  multiplayerState.socket.once('pong', (data) => {
    const latency = Date.now() - startTime;
    console.log('✅ Pong reçu!');
    console.log(`⏱️ Latence: ${latency}ms`);
    console.log('📦 Données:', data);
  });

  setTimeout(() => {
    console.log('⚠️ Aucune réponse pong après 2 secondes');
  }, 2000);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Auto-test au chargement
setTimeout(() => {
  console.log('\n💡 Commandes de debug disponibles:');
  console.log('   • debugAuth() - Tester l\'authentification');
  console.log('   • forceOpenPanel() - Forcer l\'ouverture du panneau');
  console.log('   • debugSocketListeners() - Voir les événements écoutés');
  console.log('   • testServerConnection() - Tester la connexion au serveur');
  console.log('\n📝 Pour commencer: debugAuth()\n');
}, 1000);
