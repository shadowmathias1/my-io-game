/* ============================================
   EMPLOYEES/ASSISTANTS SYSTEM
   Système d'employés automatiques pour automatiser le jardin
   ============================================ */

// Types d'employés disponibles
const EMPLOYEE_TYPES = {
  AUTO_PLANTER: {
    id: 'auto_planter',
    name: '👨‍🌾 Planteur Auto',
    description: 'Plante automatiquement des graines dans les parcelles vides',
    baseCost: 5000,
    costMultiplier: 1.5,
    unlockRequirement: { lifetimeCoins: 25000 },
    cooldown: 15000, // 15 secondes entre chaque action
    maxLevel: 10,
    stats: {
      plantsPerAction: 1, // Nombre de plantes par action
      speedBonus: 0 // Bonus de vitesse en %
    }
  },
  FAST_HARVESTER: {
    id: 'fast_harvester',
    name: '⚡ Récolteur Rapide',
    description: 'Récolte automatiquement les plantes prêtes',
    baseCost: 8000,
    costMultiplier: 1.6,
    unlockRequirement: { lifetimeCoins: 50000 },
    cooldown: 10000, // 10 secondes
    maxLevel: 10,
    stats: {
      harvestsPerAction: 2,
      bonusYield: 0.05 // 5% de bonus par niveau
    }
  },
  SEED_COLLECTOR: {
    id: 'seed_collector',
    name: '🌱 Collecteur de Graines',
    description: 'Génère automatiquement des graines aléatoires',
    baseCost: 12000,
    costMultiplier: 1.7,
    unlockRequirement: { lifetimeCoins: 100000 },
    cooldown: 30000, // 30 secondes
    maxLevel: 8,
    stats: {
      seedsPerAction: 1,
      rarityBonus: 0 // Chance d'avoir de meilleures graines
    }
  },
  GARDEN_MANAGER: {
    id: 'garden_manager',
    name: '🎯 Manager de Jardin',
    description: 'Optimise la production et donne des bonus globaux',
    baseCost: 20000,
    costMultiplier: 2.0,
    unlockRequirement: { lifetimeCoins: 250000 },
    cooldown: 60000, // 60 secondes
    maxLevel: 5,
    stats: {
      globalYieldBonus: 0.03, // 3% par niveau
      globalSpeedBonus: 0.02 // 2% par niveau
    }
  },
  COIN_GENERATOR: {
    id: 'coin_generator',
    name: '💰 Générateur de Coins',
    description: 'Génère passivement des coins supplémentaires',
    baseCost: 15000,
    costMultiplier: 1.8,
    unlockRequirement: { lifetimeCoins: 150000 },
    cooldown: 20000, // 20 secondes
    maxLevel: 10,
    stats: {
      coinsPerAction: 100,
      multiplier: 0.1 // +10% par niveau
    }
  }
};

// Initialiser le système d'employés
function initializeEmployeesSystem() {
  if (!state.employees) {
    state.employees = {
      hired: {}, // { employeeId: { level, lastAction, active } }
      unlocked: [] // IDs des types d'employés débloqués
    };
  }

  // Vérifier les débloquages
  checkEmployeeUnlocks();

  console.log('✅ Employees system initialized');
}

// Vérifier quels employés peuvent être débloqués
function checkEmployeeUnlocks() {
  Object.values(EMPLOYEE_TYPES).forEach(empType => {
    if (state.employees.unlocked.includes(empType.id)) return;

    const req = empType.unlockRequirement;
    if (req.lifetimeCoins && state.lifetimeCoins >= req.lifetimeCoins) {
      state.employees.unlocked.push(empType.id);
      if (typeof showToast === 'function') {
        showToast(`🎉 Nouveau type d'employé débloqué: ${empType.name}`);
      }
    }
  });
}

// Appeler cette fonction régulièrement pour vérifier les déblocages
window.checkEmployeeUnlocks = checkEmployeeUnlocks;

// Obtenir le coût d'embauche/amélioration d'un employé
function getEmployeeCost(employeeId) {
  const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
  if (!empType) return 0;

  const currentLevel = state.employees.hired[employeeId]?.level || 0;
  return Math.floor(empType.baseCost * Math.pow(empType.costMultiplier, currentLevel));
}

// Embaucher ou améliorer un employé
function hireEmployee(employeeId) {
  const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
  if (!empType) {
    showToast('❌ Type d\'employé invalide');
    return false;
  }

  // Vérifier si débloqué
  if (!state.employees.unlocked.includes(employeeId)) {
    showToast(`🔒 Débloquez d'abord cet employé (${empType.unlockRequirement.lifetimeCoins.toLocaleString()} lifetime coins)`);
    return false;
  }

  const cost = getEmployeeCost(employeeId);
  const currentLevel = state.employees.hired[employeeId]?.level || 0;

  // Vérifier niveau max
  if (currentLevel >= empType.maxLevel) {
    showToast('⚠️ Niveau maximum atteint');
    return false;
  }

  // Vérifier argent
  if (state.coins < cost) {
    showToast(`❌ Pas assez de coins (${cost.toLocaleString()} requis)`);
    return false;
  }

  // Embaucher/Améliorer
  state.coins -= cost;

  if (!state.employees.hired[employeeId]) {
    state.employees.hired[employeeId] = {
      level: 1,
      lastAction: Date.now(),
      active: true
    };
    showToast(`✅ ${empType.name} embauché (Niv. 1)`);
  } else {
    state.employees.hired[employeeId].level++;
    showToast(`⬆️ ${empType.name} amélioré (Niv. ${state.employees.hired[employeeId].level})`);
  }

  saveGame();
  needsRender = true;
  return true;
}

// Activer/désactiver un employé
function toggleEmployee(employeeId) {
  if (!state.employees.hired[employeeId]) return;

  state.employees.hired[employeeId].active = !state.employees.hired[employeeId].active;
  const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
  const status = state.employees.hired[employeeId].active ? '✅ Activé' : '⏸️ Désactivé';
  showToast(`${empType.name}: ${status}`);
  saveGame();
  needsRender = true;
}

// Virer un employé (remboursement 50%)
function fireEmployee(employeeId) {
  if (!state.employees.hired[employeeId]) return;

  const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
  const level = state.employees.hired[employeeId].level;

  // Calculer remboursement (50% du coût total investi)
  let totalRefund = 0;
  for (let i = 0; i < level; i++) {
    totalRefund += Math.floor(empType.baseCost * Math.pow(empType.costMultiplier, i));
  }
  totalRefund = Math.floor(totalRefund * 0.5);

  state.coins += totalRefund;
  delete state.employees.hired[employeeId];

  showToast(`👋 ${empType.name} viré (+${totalRefund.toLocaleString()} coins remboursés)`);
  saveGame();
  needsRender = true;
}

// ============================================
// ACTIONS DES EMPLOYÉS
// ============================================

// Auto Planter - Plante automatiquement des graines
function autoPlanter_action(employee, empType) {
  const now = Date.now();
  const level = employee.level;

  // Trouver une parcelle vide
  const emptyPlots = state.garden.plots
    .map((plot, idx) => ({ plot, idx }))
    .filter(({ plot }) =>
      !plot.plantId &&
      !plot.building &&
      !plot.isOccupied &&
      plot.unlocked
    );

  if (emptyPlots.length === 0) return; // Aucune parcelle vide

  // Obtenir les graines disponibles
  const availableSeeds = Object.entries(state.inventory).filter(([id, qty]) => qty > 0);
  if (availableSeeds.length === 0) return; // Aucune graine

  // Choisir une graine aléatoire
  const [plantId, qty] = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];

  // Trouver la plante (peut être dans PLANTS ou NIGHT_PLANTS)
  let plant = null;
  if (typeof getPlantById === 'function') {
    plant = getPlantById(plantId);
  }
  if (!plant && typeof PLANTS !== 'undefined') {
    plant = PLANTS.find(p => p.id === plantId);
  }
  if (!plant && typeof NIGHT_PLANTS !== 'undefined') {
    plant = Object.values(NIGHT_PLANTS).find(p => p.id === plantId);
  }
  if (!plant) return;

  // Planter dans une parcelle aléatoire
  const plantsToPlace = Math.min(empType.stats.plantsPerAction + Math.floor(level / 3), emptyPlots.length, qty);

  for (let i = 0; i < plantsToPlace; i++) {
    if (state.inventory[plantId] <= 0) break;

    const { idx } = emptyPlots[i];

    // Planter directement
    if (typeof plantSeed === 'function') {
      plantSeed(idx, plantId);
    }
  }
}

// Fast Harvester - Récolte automatiquement
function fastHarvester_action(employee, empType) {
  const level = employee.level;
  const bonusYield = 1 + (empType.stats.bonusYield * level);

  // Trouver les plantes prêtes à récolter
  const readyPlots = state.garden.plots
    .map((plot, idx) => ({ plot, idx }))
    .filter(({ plot }) =>
      plot.plantId &&
      !plot.isOccupied &&
      plot.readyAt &&
      plot.readyAt <= Date.now()
    );

  if (readyPlots.length === 0) return;

  // Récolter les X premières plantes
  const harvestCount = Math.min(empType.stats.harvestsPerAction + Math.floor(level / 2), readyPlots.length);

  for (let i = 0; i < harvestCount; i++) {
    const { idx, plot } = readyPlots[i];

    // Trouver la plante
    let plant = null;
    if (typeof getPlantById === 'function') {
      plant = getPlantById(plot.plantId);
    }
    if (!plant && typeof PLANTS !== 'undefined') {
      plant = PLANTS.find(p => p.id === plot.plantId);
    }
    if (!plant && typeof NIGHT_PLANTS !== 'undefined') {
      plant = Object.values(NIGHT_PLANTS).find(p => p.id === plot.plantId);
    }
    if (!plant) continue;

    // Récolter avec bonus
    const baseYield = plant.yield || plant.sellPrice || 0;
    const totalYield = Math.floor(baseYield * bonusYield);

    state.coins += totalYield;
    state.stats.totalHarvests++;

    // Ajouter à l'inventaire
    if (typeof addHarvestToInventory === 'function') {
      addHarvestToInventory(plot.plantId, 1);
    }

    // Réinitialiser la parcelle
    plot.plantId = null;
    plot.plantedAt = null;
    plot.readyAt = null;
  }

  if (harvestCount > 0) {
    showToast(`⚡ Récolteur: ${harvestCount} plante(s) récoltée(s)`);
    needsRender = true;
  }
}

// Seed Collector - Génère des graines aléatoires
function seedCollector_action(employee, empType) {
  const level = employee.level;

  // Liste des plantes disponibles (PLANTS de game.js)
  const availablePlants = typeof PLANTS !== 'undefined' ? PLANTS.filter(p => {
    // Seulement les plantes normales (pas légendaires)
    if (!p.id) return false;
    const owned = state.inventory[p.id] || 0;
    return owned > 0 || state.lifetimeCoins >= (p.unlock || 0);
  }) : [];

  if (availablePlants.length === 0) return;

  // Générer des graines
  const seedsCount = empType.stats.seedsPerAction + Math.floor(level / 2);

  for (let i = 0; i < seedsCount; i++) {
    const randomPlant = availablePlants[Math.floor(Math.random() * availablePlants.length)];
    if (!state.inventory[randomPlant.id]) state.inventory[randomPlant.id] = 0;
    state.inventory[randomPlant.id]++;
  }

  showToast(`🌱 Collecteur: +${seedsCount} graine(s) générée(s)`);
  needsRender = true;
}

// Garden Manager - Bonus globaux (pas d'action directe, bonus passif)
function gardenManager_action(employee, empType) {
  // Les bonus sont appliqués dans les calculs de rendement
  // Pas d'action directe nécessaire
}

// Coin Generator - Génère des coins
function coinGenerator_action(employee, empType) {
  const level = employee.level;
  const multiplier = 1 + (empType.stats.multiplier * level);
  const coinsGenerated = Math.floor(empType.stats.coinsPerAction * multiplier * level);

  state.coins += coinsGenerated;
  showToast(`💰 Générateur: +${coinsGenerated} coins`);
  needsRender = true;
}

// Mapping des actions
const EMPLOYEE_ACTIONS = {
  auto_planter: autoPlanter_action,
  fast_harvester: fastHarvester_action,
  seed_collector: seedCollector_action,
  garden_manager: gardenManager_action,
  coin_generator: coinGenerator_action
};

// Tick des employés (appelé dans la boucle principale)
function tickEmployees() {
  if (!state.employees || !state.employees.hired) return;

  const now = Date.now();

  Object.entries(state.employees.hired).forEach(([employeeId, employee]) => {
    if (!employee.active) return;

    const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
    if (!empType) return;

    // Vérifier le cooldown
    const timeSinceLastAction = now - (employee.lastAction || 0);
    if (timeSinceLastAction < empType.cooldown) return;

    // Exécuter l'action
    const action = EMPLOYEE_ACTIONS[employeeId];
    if (action) {
      action(employee, empType);
      employee.lastAction = now;
    }
  });
}

// Obtenir les bonus globaux des employés
function getEmployeeBonuses() {
  const bonuses = {
    yieldMultiplier: 1.0,
    speedMultiplier: 1.0,
    harvestBonus: 1.0
  };

  if (!state.employees || !state.employees.hired) return bonuses;

  // Garden Manager bonus
  const manager = state.employees.hired.garden_manager;
  if (manager && manager.active) {
    const empType = EMPLOYEE_TYPES.GARDEN_MANAGER;
    bonuses.yieldMultiplier += empType.stats.globalYieldBonus * manager.level;
    bonuses.speedMultiplier += empType.stats.globalSpeedBonus * manager.level;
  }

  // Fast Harvester bonus
  const harvester = state.employees.hired.fast_harvester;
  if (harvester && harvester.active) {
    const empType = EMPLOYEE_TYPES.FAST_HARVESTER;
    bonuses.harvestBonus += empType.stats.bonusYield * harvester.level;
  }

  return bonuses;
}

console.log('✅ Employees system loaded');
