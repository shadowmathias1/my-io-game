# 🌐 Guide d'Utilisation du Système Multiplayer Admin

## 📋 Vue d'ensemble

Le système multiplayer admin te permet de contrôler les jeux des autres joueurs connectés à ton serveur. Tu peux envoyer des coins, changer la météo, forcer la nuit/jour, et bien plus.

---

## 🚀 Démarrage Rapide

### 1️⃣ Ouvrir la Console

- **Windows/Linux**: Appuie sur `F12` ou `Ctrl + Shift + J`
- **Mac**: Appuie sur `Cmd + Option + J`

### 2️⃣ Vérifier l'État du Système

Dans la console, tape:

```javascript
testMultiplayerStatus()
```

Tu verras quelque chose comme:
```
📊 ÉTAT DU SYSTÈME MULTIPLAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Socket.IO disponible: ✅ OUI
🔌 Connecté au serveur: ✅ OUI
👑 Admin authentifié: ❌ NON
🆔 Player ID: xyz123...
```

### 3️⃣ S'Authentifier comme Admin

Si tu n'es pas encore authentifié, tape:

```javascript
testAdminLogin()
```

Le mot de passe par défaut est: **1234**

### 4️⃣ Voir les Joueurs Connectés

Une fois authentifié, tape:

```javascript
testPlayersList()
```

Tu verras la liste de tous les joueurs connectés avec leur ID.

---

## 🎮 Commandes Admin Disponibles

### 💰 Envoyer des Coins

```javascript
// Envoyer 500 coins à un joueur
testSendCoins('PLAYER_ID', 500)

// Ou utiliser directement:
adminAdjustCoins('PLAYER_ID', 1000)    // Ajouter 1000 coins
adminSetCoins('PLAYER_ID', 5000)       // Définir à exactement 5000 coins
```

### 🌤️ Changer la Météo

```javascript
// Utiliser le test
testChangeWeather('PLAYER_ID', 'rain')

// Ou directement:
adminChangeWeather('PLAYER_ID', 'sunny')   // ☀️ Ensoleillé
adminChangeWeather('PLAYER_ID', 'rainy')   // 🌧️ Pluvieux
adminChangeWeather('PLAYER_ID', 'cloudy')  // ☁️ Nuageux
adminChangeWeather('PLAYER_ID', 'stormy')  // ⛈️ Orageux
```

### 🍂 Changer la Saison

```javascript
adminChangeSeason('PLAYER_ID', 'spring')  // 🌸 Printemps
adminChangeSeason('PLAYER_ID', 'summer')  // ☀️ Été
adminChangeSeason('PLAYER_ID', 'autumn')  // 🍂 Automne
adminChangeSeason('PLAYER_ID', 'winter')  // ❄️ Hiver
```

### 🌙 Forcer le Cycle Jour/Nuit

```javascript
adminForceNight('PLAYER_ID')  // Forcer la nuit
adminForceDay('PLAYER_ID')    // Forcer le jour
```

### 🌱 Envoyer des Graines

```javascript
// Envoyer 50 graines de carotte
adminSendSeeds('PLAYER_ID', 'carrot', 50)

// Envoyer 50 graines de TOUTES les plantes
adminSendSeedsAll('PLAYER_ID', 50)

// Effacer toutes les graines
adminClearSeeds('PLAYER_ID')

// Ajouter 1 de chaque plante spéciale
adminAddSpecials('PLAYER_ID')
```

### 🌾 Forcer la Récolte

```javascript
// Récolter toutes les plantes prêtes
adminForceHarvest('PLAYER_ID')
```

### 🐛 Parasites

```javascript
// Infecter avec un parasite
adminPestInfect('PLAYER_ID', 'aphid')      // Pucerons
adminPestInfect('PLAYER_ID', 'mildew')     // Mildiou
adminPestInfect('PLAYER_ID', 'caterpillar') // Chenilles

// Retirer tous les parasites
adminPestClear('PLAYER_ID')
```

### ✨ Événements Légendaires

```javascript
// Forcer un événement légendaire
adminForceLegendaryEvent('PLAYER_ID')
```

### 👑 Prestige

```javascript
// Définir le niveau de prestige à 5
adminSetPrestigeLevel('PLAYER_ID', 5)
```

### 🏗️ Bâtiments

```javascript
// Ajouter un bâtiment
adminAddBuilding('PLAYER_ID', 'greenhouse', 1)
adminAddBuilding('PLAYER_ID', 'warehouse', 2)
```

### 📅 Récompenses Quotidiennes

```javascript
// Réinitialiser le streak quotidien
adminResetStreak('PLAYER_ID')
```

### 📢 Message de Diffusion

```javascript
// Envoyer un message à tous les joueurs
adminBroadcast('Bienvenue sur le serveur!')
```

### 🔨 Actions Admin Sévères

```javascript
// Kicker un joueur (déconnexion)
adminKickPlayer('PLAYER_ID')

// Bannir un joueur (IP ban)
adminBanPlayer('PLAYER_ID')

// Débannir tous les joueurs
adminUnbanAll()

// Réinitialiser complètement la sauvegarde d'un joueur
adminResetSave('PLAYER_ID')
```

---

## 🖥️ Interface Graphique

### Utiliser le Panneau Admin

Au lieu de taper dans la console, tu peux utiliser l'interface:

1. **Ouvre le panneau admin** dans le jeu (bouton en bas à droite)
2. **Clique sur "🌐 Panel Multiplayer"**
3. **Entre le mot de passe**: 1234
4. **Sélectionne un joueur** dans la liste
5. **Utilise les boutons** pour envoyer des actions

---

## 🔧 Configuration

### Changer le Mot de Passe Admin

Édite [multiplayer-admin.js:10](garden-v2/multiplayer-admin.js#L10):

```javascript
const SERVER_CONFIG = {
  enabled: true,
  serverUrl: window.location.origin,
  adminPassword: '1234' // ← Change ici
};
```

### Changer l'URL du Serveur

Si ton serveur est sur une URL différente:

```javascript
const SERVER_CONFIG = {
  enabled: true,
  serverUrl: 'https://ton-serveur.com', // ← Change ici
  adminPassword: '1234'
};
```

---

## 🐛 Résolution de Problèmes

### ❌ "Socket.IO non disponible"

**Problème**: Le script Socket.IO n'est pas chargé.

**Solution**: Vérifie que dans [index.html:1010](garden-v2/index.html#L1010), tu as:
```html
<script src="/socket.io/socket.io.js"></script>
```

### ❌ "Pas connecté au serveur"

**Problème**: Le serveur n'est pas accessible ou ne répond pas.

**Solution**:
1. Vérifie que ton serveur sur Render est en ligne
2. Tape `initMultiplayer()` pour réessayer la connexion
3. Vérifie l'URL du serveur dans `SERVER_CONFIG`

### ❌ "Authentification échouée"

**Problème**: Le mot de passe est incorrect ou le serveur ne le reconnaît pas.

**Solution**:
1. Vérifie que le serveur accepte le mot de passe "1234"
2. Regarde les logs du serveur pour voir si l'événement `admin-authenticate` est reçu
3. Vérifie la configuration côté serveur

### ❌ "Aucun joueur connecté"

**Problème**: Il n'y a vraiment aucun autre joueur, ou le serveur n'envoie pas la liste.

**Solution**:
1. Demande manuellement la liste:
   ```javascript
   multiplayerState.socket.emit('admin-request-players')
   ```
2. Attends quelques secondes puis tape `testPlayersList()` à nouveau
3. Vérifie que le serveur envoie bien l'événement `players-list`

---

## 📊 Commandes de Debug

### Voir l'État Complet

```javascript
console.table(multiplayerState)
```

### Voir tous les Joueurs

```javascript
console.table(multiplayerState.players)
```

### Tester la Connexion

```javascript
multiplayerState.socket.emit('ping')
```

### Forcer une Reconnexion

```javascript
multiplayerState.socket.disconnect()
multiplayerState.socket.connect()
```

---

## 🎯 Scénarios d'Usage

### Accueillir un Nouveau Joueur

```javascript
// 1. Voir qui vient de se connecter
testPlayersList()

// 2. Lui donner des coins de bienvenue
adminAdjustCoins('PLAYER_ID', 1000)

// 3. Lui envoyer des graines de départ
adminSendSeedsAll('PLAYER_ID', 20)

// 4. Lui souhaiter la bienvenue
adminBroadcast('Bienvenue PLAYER_NAME!')
```

### Organiser un Événement

```javascript
// Changer la météo pour tous
multiplayerState.players.forEach(p => {
  adminChangeWeather(p.id, 'stormy')
})

// Annoncer l'événement
adminBroadcast('🌩️ ÉVÉNEMENT ORAGE! Survivez 5 minutes!')

// Dans 5 minutes, donner des récompenses
setTimeout(() => {
  multiplayerState.players.forEach(p => {
    adminAdjustCoins(p.id, 5000)
    adminForceLegendaryEvent(p.id)
  })
  adminBroadcast('✨ Événement terminé! Voici vos récompenses!')
}, 5 * 60 * 1000)
```

### Modérer un Joueur Problématique

```javascript
// 1. Identifier le joueur
testPlayersList()

// 2. L'avertir
// (envoie un message privé si implémenté, sinon broadcast)

// 3. Si nécessaire, le kicker
adminKickPlayer('PLAYER_ID')

// 4. Si vraiment problématique, le bannir
adminBanPlayer('PLAYER_ID')
```

---

## 📝 Notes Importantes

- ⚠️ **Utilise ces commandes avec précaution!** Certaines actions sont irréversibles.
- 💾 **Les actions ne modifient pas la sauvegarde locale** du joueur, seulement son état en ligne.
- 🔄 **Les joueurs peuvent se reconnecter** après un kick (sauf s'ils sont bannis).
- 📡 **Le serveur doit être en ligne** pour que le système fonctionne.
- 🔒 **Garde le mot de passe admin secret!**

---

## 🆘 Besoin d'Aide?

Si tu rencontres des problèmes:

1. **Vérifie les logs de la console** (F12)
2. **Utilise les commandes de debug** ci-dessus
3. **Vérifie que le serveur est en ligne** sur Render
4. **Regarde les logs du serveur** pour voir les erreurs côté backend

---

## 🎉 C'est Tout!

Tu es maintenant prêt à administrer ton serveur multiplayer comme un pro! 🚀

**Commande rapide pour tout tester:**
```javascript
testMultiplayerAll()
```

Cette commande va:
1. ✅ Vérifier l'état
2. 🔌 Se connecter si nécessaire
3. 🔑 S'authentifier automatiquement
4. 👥 Afficher la liste des joueurs

Bon jeu! 🌱
