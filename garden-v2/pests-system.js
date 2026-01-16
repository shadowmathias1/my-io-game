/* ============================================
   PESTS & DISEASES SYSTEM
   Système de nuisibles et maladies pour le jardin
   ============================================ */

// Types de nuisibles et maladies (RÉDUIT + SAISONNIER)
const PEST_TYPES = {
  APHIDS: {
    id: 'aphids',
    name: '🐛 Pucerons',
    emoji: '🐛',
    description: 'Des petits insectes qui ralentissent la croissance',
    effects: {
      growthSpeed: -0.3, // -30% vitesse de croissance
      yieldPenalty: -0.15 // -15% rendement
    },
    spreadChance: 0.12,
    naturalDecay: 0.08,
    severity: 'low',
    color: '#95a5a6',
    seasons: ['spring', 'summer'] // Plus fréquent au printemps/été
  },
  FUNGUS: {
    id: 'fungus',
    name: '🍄 Champignons',
    emoji: '🍄',
    description: 'Un champignon qui réduit le rendement',
    effects: {
      yieldPenalty: -0.35,
      growthSpeed: -0.10
    },
    spreadChance: 0.20,
    naturalDecay: 0.05,
    severity: 'medium',
    color: '#9b59b6',
    seasons: ['autumn', 'winter'] // Plus fréquent en automne/hiver (humidité)
  },
  LOCUSTS: {
    id: 'locusts',
    name: '🦗 Sauterelles',
    emoji: '🦗',
    description: 'Un essaim qui dévore les plantes',
    effects: {
      yieldPenalty: -0.45,
      deathChance: 0.03
    },
    spreadChance: 0.18,
    naturalDecay: 0.10, // Partent plus facilement
    severity: 'medium',
    color: '#f39c12',
    seasons: ['summer'] // Uniquement en été
  }
};

// Traitements contre les nuisibles - PRIX RÉDUITS car plus de maladies
const TREATMENTS = {
  INSECTICIDE: {
    id: 'insecticide',
    name: 'Insecticide',
    emoji: '',
    description: 'Elimine les insectes (Pucerons, Sauterelles)',
    cost: 50, // Réduit de 400 à 50
    effectiveAgainst: ['aphids', 'locusts'],
    successRate: 0.85,
    areaEffect: false
  },
  FUNGICIDE: {
    id: 'fungicide',
    name: 'Fongicide',
    emoji: '',
    description: 'Elimine les champignons',
    cost: 75, // Réduit de 600 à 75
    effectiveAgainst: ['fungus'],
    successRate: 0.80,
    areaEffect: false
  },
  MIRACLE_CURE: {
    id: 'miracle_cure',
    name: 'Remede Universel',
    emoji: '',
    description: 'Guerit toutes les maladies d\'une plante',
    cost: 150, // Réduit de 1200 à 150
    effectiveAgainst: Object.keys(PEST_TYPES),
    successRate: 0.90,
    areaEffect: false
  },
  PREVENTION_SPRAY: {
    id: 'prevention_spray',
    name: 'Protection',
    emoji: '',
    description: 'Protege tout le jardin pendant 3 minutes',
    cost: 400, // Réduit de 3000 à 400
    effectiveAgainst: Object.keys(PEST_TYPES),
    successRate: 1.0,
    areaEffect: true,
    duration: 180000 // 3 minutes
  }
};

// Initialiser le système de nuisibles
function initializePestsSystem() {
  if (!state.pests) {
    state.pests = {
      activePests: {}, // { plotIndex: { pestId, infectedAt, severity } }
      protection: null, // { until: timestamp } si protection active
      totalInfections: 0,
      totalCured: 0,
      treatmentsUsed: 0
    };
  }

  console.log('✅ Pests system initialized');
}

// Tick du système de nuisibles (appelé dans gameLoop)
function tickPests() {
  if (!state.pests) return;

  const now = Date.now();

  // Vérifier si protection active
  if (state.pests.protection && state.pests.protection.until > now) {
    return; // Pas d'infection pendant la protection
  } else if (state.pests.protection && state.pests.protection.until <= now) {
    state.pests.protection = null;
    showToast('Protection expiree', 'warning');
  }

  // Chance d'apparition AUGMENTÉE (3% par tick) - beaucoup plus de maladies!
  if (Math.random() < 0.03) {
    tryInfectRandomPlant();
  }

  // Propager les maladies existantes
  spreadPests();

  // Effet des maladies sur les plantes
  applyPestEffects();

  // Disparition naturelle
  naturalPestDecay();
}

// Tenter d'infecter une plante aléatoire (AVEC SAISONS)
function tryInfectRandomPlant() {
  const plantedPlots = state.garden.plots
    .map((plot, idx) => ({ plot, idx }))
    .filter(({ plot }) => plot.plantId && !plot.isOccupied);

  if (plantedPlots.length === 0) return;

  // Plante aléatoire
  const { idx } = plantedPlots[Math.floor(Math.random() * plantedPlots.length)];

  // Si déjà infectée, skip
  if (state.pests.activePests[idx]) return;

  // Obtenir la saison actuelle
  const currentSeason = state.season ? state.season.current : 'spring';

  // Filtrer les maladies selon la saison
  const seasonalPests = Object.values(PEST_TYPES).filter(pest =>
    pest.seasons.includes(currentSeason)
  );

  // Si aucune maladie pour cette saison, moins de risque
  if (seasonalPests.length === 0) return;

  // Type de nuisible aléatoire selon saison (favorise les moins graves)
  const weights = seasonalPests.map(p => {
    switch (p.severity) {
      case 'low': return 50;
      case 'medium': return 30;
      case 'high': return 20;
      default: return 10;
    }
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let selectedPest = null;

  for (let i = 0; i < seasonalPests.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      selectedPest = seasonalPests[i];
      break;
    }
  }

  if (selectedPest) {
    infectPlot(idx, selectedPest.id);
  }
}

// Infecter une parcelle
function infectPlot(plotIndex, pestId) {
  if (state.pests.activePests[plotIndex]) return; // Déjà infectée

  const pest = PEST_TYPES[pestId.toUpperCase()];
  if (!pest) return;

  state.pests.activePests[plotIndex] = {
    pestId: pest.id,
    infectedAt: Date.now(),
    severity: 1
  };

  state.pests.totalInfections++;
  showToast(`${pest.emoji} ${pest.name} infecte votre jardin!`, 'warning');
  needsRender = true;
  saveGame();
}

// Propager les maladies
function spreadPests() {
  const infectedPlots = Object.entries(state.pests.activePests);
  if (infectedPlots.length === 0) return;

  infectedPlots.forEach(([plotIndexStr, infection]) => {
    const plotIndex = parseInt(plotIndexStr);
    const pest = PEST_TYPES[infection.pestId.toUpperCase()];
    if (!pest) return;

    // Chance de propagation
    if (Math.random() < pest.spreadChance * 0.1) { // Réduit pour ne pas être trop agressif
      // Trouver les plantes adjacentes
      const adjacentPlots = getAdjacentPlots(plotIndex);
      const vulnerablePlots = adjacentPlots.filter(idx => {
        const plot = state.garden.plots[idx];
        return plot && plot.plantId && !plot.isOccupied && !state.pests.activePests[idx];
      });

      if (vulnerablePlots.length > 0) {
        const targetIdx = vulnerablePlots[Math.floor(Math.random() * vulnerablePlots.length)];
        infectPlot(targetIdx, pest.id);
      }
    }
  });
}

// Obtenir les parcelles adjacentes
function getAdjacentPlots(plotIndex) {
  const size = state.garden.size;
  const row = Math.floor(plotIndex / size);
  const col = plotIndex % size;
  const adjacent = [];

  // Haut, Bas, Gauche, Droite
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      adjacent.push(newRow * size + newCol);
    }
  });

  return adjacent;
}

// Appliquer les effets des nuisibles
function applyPestEffects() {
  Object.entries(state.pests.activePests).forEach(([plotIndexStr, infection]) => {
    const plotIndex = parseInt(plotIndexStr);
    const plot = state.garden.plots[plotIndex];
    if (!plot || !plot.plantId) {
      // Nettoyer si la plante n'existe plus
      delete state.pests.activePests[plotIndex];
      return;
    }

    const pest = PEST_TYPES[infection.pestId.toUpperCase()];
    if (!pest) return;

    // Chance de mort
    if (pest.effects.deathChance && Math.random() < pest.effects.deathChance * 0.01) {
      // Plante meurt
      const plant = getPlantById(plot.plantId);
      showToast(`💀 ${plant?.name || 'Plante'} est morte à cause de ${pest.name}`, 'error');

      // Réinitialiser la parcelle
      plot.plantId = null;
      plot.plantedAt = null;
      plot.readyAt = null;
      plot.ready = false;
      delete state.pests.activePests[plotIndex];
      needsRender = true;
    }
  });
}

// Disparition naturelle des nuisibles
function naturalPestDecay() {
  Object.entries(state.pests.activePests).forEach(([plotIndexStr, infection]) => {
    const pest = PEST_TYPES[infection.pestId.toUpperCase()];
    if (!pest) return;

    // Chance de disparition naturelle
    if (Math.random() < pest.naturalDecay * 0.1) {
      const plotIndex = parseInt(plotIndexStr);
      delete state.pests.activePests[plotIndex];
      showToast(`${pest.emoji} ${pest.name} est parti naturellement`, 'success');
      needsRender = true;
    }
  });
}

// Traiter une parcelle
function treatPlot(plotIndex, treatmentId) {
  const treatment = TREATMENTS[treatmentId.toUpperCase()];
  if (!treatment) return false;

  // Vérifier le coût
  if (state.coins < treatment.cost) {
    showToast(`❌ Pas assez de coins (${treatment.cost} requis)`, 'error');
    return false;
  }

  state.coins -= treatment.cost;
  state.pests.treatmentsUsed++;

  if (treatment.areaEffect) {
    // Traiter tout le jardin
    let curedCount = 0;

    if (treatment.duration) {
      // Protection
      state.pests.protection = {
        until: Date.now() + treatment.duration
      };
      showToast(`🛡️ Jardin protégé pendant 5 minutes!`, 'success');
    } else {
      // Traitement de zone
      Object.entries(state.pests.activePests).forEach(([idx, infection]) => {
        const pest = PEST_TYPES[infection.pestId.toUpperCase()];
        if (treatment.effectiveAgainst.includes(pest.id)) {
          if (Math.random() < treatment.successRate) {
            delete state.pests.activePests[idx];
            curedCount++;
            state.pests.totalCured++;
          }
        }
      });

      if (curedCount > 0) {
        showToast(`${treatment.emoji} ${curedCount} plante(s) soignée(s)!`, 'success');
      } else {
        showToast(`${treatment.emoji} Aucune plante à traiter`, 'warning');
      }
    }
  } else {
    // Traiter une seule parcelle
    const infection = state.pests.activePests[plotIndex];
    if (!infection) {
      showToast(`❌ Cette plante n'est pas malade`, 'warning');
      state.coins += treatment.cost; // Rembourser
      return false;
    }

    const pest = PEST_TYPES[infection.pestId.toUpperCase()];
    if (!treatment.effectiveAgainst.includes(pest.id)) {
      showToast(`❌ ${treatment.name} n'est pas efficace contre ${pest.name}`, 'warning');
      state.coins += treatment.cost; // Rembourser
      return false;
    }

    // Tenter de guérir
    if (Math.random() < treatment.successRate) {
      delete state.pests.activePests[plotIndex];
      state.pests.totalCured++;
      showToast(`${treatment.emoji} Plante soignée avec succès!`, 'success');
    } else {
      showToast(`${treatment.emoji} Le traitement a échoué...`, 'error');
    }
  }

  needsRender = true;
  saveGame();
  return true;
}

// Obtenir les effets d'une infection sur une parcelle
function getPestEffectsForPlot(plotIndex) {
  const infection = state.pests.activePests[plotIndex];
  if (!infection) return null;

  const pest = PEST_TYPES[infection.pestId.toUpperCase()];
  return pest ? pest.effects : null;
}

// Vérifier si une parcelle est infectée
function isPlotInfected(plotIndex) {
  return !!state.pests.activePests[plotIndex];
}

// Obtenir l'infection d'une parcelle
function getPlotInfection(plotIndex) {
  const infection = state.pests.activePests[plotIndex];
  if (!infection) return null;

  const pest = PEST_TYPES[infection.pestId.toUpperCase()];
  return { infection, pest };
}

console.log('✅ Pests system loaded');
