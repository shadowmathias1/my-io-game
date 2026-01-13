# 🌱 Grow a Garden

Jeu idle/clicker simple en Vanilla JavaScript.

## 🚀 Lancer le jeu

```bash
cd garden-game
python -m http.server 8000
```

Puis ouvrir **http://localhost:8000**

## 🎮 Comment jouer

1. **Cliquez sur une parcelle vide** pour planter
2. **Attendez** que la plante pousse
3. **Cliquez sur la plante verte** pour récolter
4. **Achetez** de meilleures plantes et des buildings dans le Shop

## ✨ Features

- 🌾 6 plantes (Herbe → Pastèque)
- 🏗️ 3 buildings (coins/sec passif)
- 💾 Auto-save toutes les 10s
- ⏰ Offline progress (cap 8h)
- 📊 Stats en temps réel

## 📝 Notes

- **Tout en un seul fichier** : `game.js` (390 lignes)
- **Aucune dépendance** : 100% Vanilla JS
- **LocalStorage** : sauvegarde automatique

---

**C'est tout ! Amusez-vous bien 🌱**

## Multiplayer admin server
1) cd garden-v2/server
2) npm install
3) set ADMIN_PASSWORD (see .env.example)
4) npm start
5) open the game at http://localhost:8000
6) admin panel -> multiplayer button, enter ADMIN_PASSWORD
Note: if your server host is not localhost:3000, update the Socket.IO script tag in index.html.
