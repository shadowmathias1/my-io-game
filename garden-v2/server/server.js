const http = require("http");
require("dotenv").config();

const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

const app = express();
const clientRoot = path.join(__dirname, "..");
app.use(express.static(clientRoot));
app.get("/", (_req, res) => {
  res.sendFile(path.join(clientRoot, "index.html"));
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = new Map();
const admins = new Set();

const allowedWeather = new Set(["sun", "rain", "cloud", "storm", "frost"]);
const allowedSeason = new Set(["spring", "summer", "autumn", "winter"]);

function sanitizeNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizePlayer(socketId, data) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  return {
    id: socketId,
    name: name ? name.slice(0, 32) : "Player",
    coins: clamp(sanitizeNumber(data.coins), 0, 1e12),
    level: clamp(sanitizeNumber(data.level, 1), 1, 1e6),
    prestigeLevel: clamp(sanitizeNumber(data.prestigeLevel, 0), 0, 1e6),
    totalPlants: clamp(sanitizeNumber(data.totalPlants, 0), 0, 1e9),
    season: allowedSeason.has(data.season) ? data.season : "spring",
    weather: allowedWeather.has(data.weather) ? data.weather : "sun"
  };
}

function emitPlayersList() {
  const list = Array.from(players.values());
  for (const adminId of admins) {
    io.to(adminId).emit("players-list", list);
  }
}

io.on("connection", (socket) => {
  socket.on("player-update", (data = {}) => {
    const player = normalizePlayer(socket.id, data);
    players.set(socket.id, player);
    emitPlayersList();
  });

  socket.on("admin-authenticate", (password) => {
    if (password !== ADMIN_PASSWORD) {
      socket.emit("admin-error", "Invalid admin password");
      return;
    }
    admins.add(socket.id);
    socket.emit("admin-authenticated");
    emitPlayersList();
  });

  socket.on("admin-action", (payload = {}) => {
    if (!admins.has(socket.id)) {
      socket.emit("admin-error", "Admin access required");
      return;
    }

    const type = payload.type;
    const targetId = payload.targetId;

    const ensurePlayer = () => {
      if (!players.has(targetId)) {
        socket.emit("admin-error", "Player not found");
        return false;
      }
      return true;
    };

    if (type === "adjust-coins") {
      const amount = sanitizeNumber(payload.amount);
      if (!Number.isFinite(amount) || Math.abs(amount) > 1e9) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "adjust-coins", amount });
      return;
    }

    if (type === "set-coins") {
      const amount = sanitizeNumber(payload.amount);
      if (!Number.isFinite(amount) || amount < 0 || amount > 1e12) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "set-coins", amount });
      return;
    }

    if (type === "send-coins") {
      const amount = sanitizeNumber(payload.amount);
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "send-coins", amount });
      return;
    }

    if (type === "change-weather") {
      if (!allowedWeather.has(payload.weather)) {
        socket.emit("admin-error", "Invalid weather");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "change-weather",
        weather: payload.weather
      });
      return;
    }

    if (type === "change-season") {
      if (!allowedSeason.has(payload.season)) {
        socket.emit("admin-error", "Invalid season");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "change-season",
        season: payload.season
      });
      return;
    }

    if (type === "add-seeds") {
      const amount = sanitizeNumber(payload.amount);
      const plantId = payload.plantId;
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1e6) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (typeof plantId !== "string" || !plantId) {
        socket.emit("admin-error", "Invalid plant");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "add-seeds",
        plantId,
        amount
      });
      return;
    }

    if (type === "add-seeds-all") {
      const amount = sanitizeNumber(payload.amount);
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1e6) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "add-seeds-all",
        amount
      });
      return;
    }

    if (type === "clear-seeds") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "clear-seeds" });
      return;
    }

    if (type === "add-specials") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "add-specials" });
      return;
    }

    if (type === "force-legendary-event") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "force-legendary-event" });
      return;
    }

    if (type === "reset-streak") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "reset-streak" });
      return;
    }

    if (type === "force-harvest") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "force-harvest" });
      return;
    }

    if (type === "add-building") {
      const amount = sanitizeNumber(payload.amount);
      const buildingId = payload.buildingId;
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1e6) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (typeof buildingId !== "string" || !buildingId) {
        socket.emit("admin-error", "Invalid building");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "add-building",
        buildingId,
        amount
      });
      return;
    }

    if (type === "add-harvest") {
      const amount = sanitizeNumber(payload.amount);
      const plantId = payload.plantId;
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1e6) {
        socket.emit("admin-error", "Invalid amount");
        return;
      }
      if (typeof plantId !== "string" || !plantId) {
        socket.emit("admin-error", "Invalid plant");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "add-harvest",
        plantId,
        amount
      });
      return;
    }

    if (type === "set-prestige-level") {
      const level = sanitizeNumber(payload.level);
      if (!Number.isFinite(level) || level < 0 || level > 1e6) {
        socket.emit("admin-error", "Invalid prestige level");
        return;
      }
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", {
        type: "set-prestige-level",
        level
      });
      return;
    }

    if (type === "reset-save") {
      if (!ensurePlayer()) return;
      io.to(targetId).emit("admin-gift", { type: "reset-save" });
      return;
    }

    if (type === "broadcast") {
      if (typeof payload.message !== "string") {
        socket.emit("admin-error", "Invalid message");
        return;
      }
      const message = payload.message.trim().slice(0, 200);
      if (!message) {
        socket.emit("admin-error", "Empty message");
        return;
      }
      io.emit("admin-gift", { type: "broadcast", message });
      return;
    }

    if (type === "kick-player") {
      if (!ensurePlayer()) return;
      const targetSocket = io.sockets.sockets.get(targetId);
      if (targetSocket) {
        targetSocket.disconnect(true);
      }
      return;
    }

    socket.emit("admin-error", "Unknown admin action");
  });


  socket.on("disconnect", () => {
    players.delete(socket.id);
    admins.delete(socket.id);
    emitPlayersList();
  });
});

server.listen(PORT, () => {
  console.log(`Multiplayer admin server listening on http://localhost:${PORT}`);
});
