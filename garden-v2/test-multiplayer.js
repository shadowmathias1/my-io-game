/* ============================================
   TEST MULTIPLAYER ADMIN
   Script de test pour le système multiplayer
   ============================================ */

// Instructions pour l'utilisateur:
console.log(`
╔════════════════════════════════════════════════════════════╗
║  TEST MULTIPLAYER ADMIN - Instructions                    ║
╚════════════════════════════════════════════════════════════╝

📋 Copie-colle ces commandes dans la console:

1️⃣ Vérifier l'état:
   testMultiplayerStatus()

2️⃣ S'authentifier comme admin:
   testAdminLogin()

3️⃣ Voir la liste des joueurs:
   testPlayersList()

4️⃣ Envoyer 500 coins à un joueur (remplace PLAYER_ID):
   testSendCoins('PLAYER_ID', 500)

5️⃣ Changer la météo d'un joueur (remplace PLAYER_ID):
   testChangeWeather('PLAYER_ID', 'rain')

════════════════════════════════════════════════════════════
`);

// Fonction 1: Vérifier l'état
window.testMultiplayerStatus = function() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ÉTAT DU SYSTÈME MULTIPLAYER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('🌐 Socket.IO disponible:', typeof io !== 'undefined' ? '✅ OUI' : '❌ NON');
  console.log('🔌 Connecté au serveur:', multiplayerState.connected ? '✅ OUI' : '❌ NON');
  console.log('👑 Admin authentifié:', multiplayerState.isAdmin ? '✅ OUI' : '❌ NON');
  console.log('🆔 Player ID:', multiplayerState.playerId || 'Non connecté');
  console.log('👥 Nombre de joueurs:', multiplayerState.players.length);
  console.log('🔧 Configuration serveur:', SERVER_CONFIG.serverUrl);

  console.log('\n📝 État complet:');
  console.table({
    'Socket.IO': typeof io !== 'undefined',
    'Connecté': multiplayerState.connected,
    'Admin': multiplayerState.isAdmin,
    'Player ID': multiplayerState.playerId,
    'Joueurs': multiplayerState.players.length
  });

  if (!multiplayerState.connected) {
    console.log('\n⚠️ PAS CONNECTÉ - Essaie:');
    console.log('   initMultiplayer()');
  } else if (!multiplayerState.isAdmin) {
    console.log('\n⚠️ PAS AUTHENTIFIÉ - Essaie:');
    console.log('   testAdminLogin()');
  } else {
    console.log('\n✅ TOUT EST BON! Tu peux utiliser les commandes admin.');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction 2: S'authentifier comme admin
window.testAdminLogin = function() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 AUTHENTIFICATION ADMIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!multiplayerState.connected) {
    console.log('❌ ERREUR: Pas connecté au serveur');
    console.log('💡 Essaie: initMultiplayer()');
    return;
  }

  console.log('📤 Envoi du mot de passe: 1234');
  authenticateAdmin('1234');

  setTimeout(() => {
    if (multiplayerState.isAdmin) {
      console.log('✅ AUTHENTIFICATION RÉUSSIE!');
      console.log('👑 Tu es maintenant admin');
    } else {
      console.log('❌ Authentification échouée');
      console.log('⚠️ Vérifie que le serveur accepte le mot de passe');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }, 1000);
};

// Fonction 3: Voir la liste des joueurs
window.testPlayersList = function() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👥 LISTE DES JOUEURS CONNECTÉS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!multiplayerState.isAdmin) {
    console.log('❌ ERREUR: Tu dois être admin');
    console.log('💡 Essaie: testAdminLogin()');
    return;
  }

  if (multiplayerState.players.length === 0) {
    console.log('⚠️ Aucun joueur connecté pour le moment');
    console.log('💡 Demande au serveur:');
    console.log('   multiplayerState.socket.emit("admin-request-players")');
  } else {
    console.log(`📊 ${multiplayerState.players.length} joueur(s) connecté(s):\n`);

    multiplayerState.players.forEach((player, index) => {
      console.log(`${index + 1}. 🆔 ${player.id}`);
      console.log(`   💰 Coins: ${player.coins || 0}`);
      console.log(`   🌱 Graines: ${Object.keys(player.inventory || {}).length} types`);
      console.log(`   ⏰ Dernière update: ${new Date(player.lastUpdate || Date.now()).toLocaleTimeString()}`);
      console.log('');
    });

    console.log('💡 Pour envoyer des coins à un joueur:');
    console.log(`   testSendCoins('${multiplayerState.players[0].id}', 500)`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction 4: Envoyer des coins
window.testSendCoins = function(playerId, amount) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💰 ENVOI DE COINS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!multiplayerState.isAdmin) {
    console.log('❌ ERREUR: Tu dois être admin');
    return;
  }

  console.log(`📤 Envoi de ${amount} coins à ${playerId}`);
  adminAdjustCoins(playerId, amount);
  console.log('✅ Commande envoyée au serveur');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction 5: Changer la météo
window.testChangeWeather = function(playerId, weather) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌤️ CHANGEMENT DE MÉTÉO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!multiplayerState.isAdmin) {
    console.log('❌ ERREUR: Tu dois être admin');
    return;
  }

  const validWeathers = ['sunny', 'rainy', 'cloudy', 'stormy'];
  if (!validWeathers.includes(weather)) {
    console.log('❌ ERREUR: Météo invalide');
    console.log('✅ Météos valides:', validWeathers.join(', '));
    return;
  }

  console.log(`📤 Changement de météo vers "${weather}" pour ${playerId}`);
  adminChangeWeather(playerId, weather);
  console.log('✅ Commande envoyée au serveur');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Fonction bonus: Tout tester d'un coup
window.testMultiplayerAll = function() {
  console.log('\n🧪 TEST COMPLET DU SYSTÈME MULTIPLAYER\n');

  testMultiplayerStatus();

  if (!multiplayerState.connected) {
    console.log('⚠️ Pas connecté, connexion en cours...');
    initMultiplayer();
    setTimeout(() => {
      console.log('⏳ Attente de la connexion...');
      setTimeout(() => {
        testMultiplayerStatus();
        if (multiplayerState.connected && !multiplayerState.isAdmin) {
          testAdminLogin();
        }
      }, 2000);
    }, 1000);
  } else if (!multiplayerState.isAdmin) {
    testAdminLogin();
    setTimeout(() => {
      if (multiplayerState.isAdmin) {
        testPlayersList();
      }
    }, 1500);
  } else {
    testPlayersList();
  }
};

// Afficher un résumé des commandes
console.log('✅ Script de test chargé!');
console.log('\n📋 Commandes disponibles:');
console.log('   • testMultiplayerStatus() - Vérifier l\'état');
console.log('   • testAdminLogin() - S\'authentifier');
console.log('   • testPlayersList() - Liste des joueurs');
console.log('   • testSendCoins(playerId, amount) - Envoyer des coins');
console.log('   • testChangeWeather(playerId, weather) - Changer météo');
console.log('   • testMultiplayerAll() - Tout tester d\'un coup');
console.log('\n💡 Pour commencer: testMultiplayerAll()\n');
