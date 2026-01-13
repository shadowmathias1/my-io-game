/* ============================================
   PESTS UI
   Interface pour gérer les nuisibles et maladies
   ============================================ */

// ============================================
// MODAL MANAGEMENT
// ============================================

function openPestsModal() {
  document.getElementById('pests-modal').classList.add('show');
  renderPestsModal();
}

function closePestsModal() {
  document.getElementById('pests-modal').classList.remove('show');
}

// ============================================
// PESTS RENDERING
// ============================================

function renderPestsModal() {
  renderPestsOverview();
  renderTreatments();
}

function renderPestsOverview() {
  const container = document.getElementById('pests-overview');
  if (!container) return;

  const infectedCount = Object.keys(state.pests.activePests).length;
  const totalPlants = state.garden.plots.filter(p => p.plantId && !p.isOccupied).length;
  const protectionActive = state.pests.protection && state.pests.protection.until > Date.now();

  let protectionHtml = '';
  if (protectionActive) {
    const remaining = Math.ceil((state.pests.protection.until - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    protectionHtml = `
      <div class="protection-active">
        🛡️ Protection active: ${minutes}:${seconds.toString().padStart(2, '0')}
      </div>
    `;
  }

  container.innerHTML = `
    ${protectionHtml}
    <div class="pests-stats">
      <div class="pest-stat">
        <div class="pest-stat-label">Plantes infectées</div>
        <div class="pest-stat-value ${infectedCount > 0 ? 'infected' : ''}">${infectedCount}/${totalPlants}</div>
      </div>
      <div class="pest-stat">
        <div class="pest-stat-label">Total infections</div>
        <div class="pest-stat-value">${state.pests.totalInfections}</div>
      </div>
      <div class="pest-stat">
        <div class="pest-stat-label">Plantes soignées</div>
        <div class="pest-stat-value">${state.pests.totalCured}</div>
      </div>
      <div class="pest-stat">
        <div class="pest-stat-label">Traitements utilisés</div>
        <div class="pest-stat-value">${state.pests.treatmentsUsed}</div>
      </div>
    </div>

    <div class="infected-plants-list">
      ${renderInfectedPlantsList()}
    </div>
  `;
}

function renderInfectedPlantsList() {
  const infected = Object.entries(state.pests.activePests);

  if (infected.length === 0) {
    return '<div class="pests-empty">✅ Aucune plante infectée pour le moment!</div>';
  }

  return `
    <h4>Plantes infectées:</h4>
    <div class="infected-plants-grid">
      ${infected.map(([plotIndexStr, infection]) => {
        const plotIndex = parseInt(plotIndexStr);
        const plot = state.garden.plots[plotIndex];
        if (!plot || !plot.plantId) return '';

        const plant = getPlantById(plot.plantId);
        const pest = PEST_TYPES[infection.pestId.toUpperCase()];
        if (!pest || !plant) return '';

        const timeSinceInfection = Math.floor((Date.now() - infection.infectedAt) / 1000);

        return `
          <div class="infected-plant-card" style="border-color: ${pest.color}">
            <div class="infected-plant-header">
              <div class="infected-plant-icon">${plant.name.split(' ')[0]}</div>
              <div class="infected-pest">${pest.emoji}</div>
            </div>
            <div class="infected-plant-name">${plant.name.split(' ').slice(1).join(' ')}</div>
            <div class="infected-pest-name">${pest.name}</div>
            <div class="infected-time">Depuis ${timeSinceInfection}s</div>
            <div class="infected-effects">
              ${pest.effects.growthSpeed ? `<div>⏱️ ${(pest.effects.growthSpeed * 100).toFixed(0)}% vitesse</div>` : ''}
              ${pest.effects.yieldPenalty ? `<div>💰 ${(pest.effects.yieldPenalty * 100).toFixed(0)}% rendement</div>` : ''}
              ${pest.effects.deathChance ? `<div>💀 ${(pest.effects.deathChance * 100).toFixed(0)}% mort/tick</div>` : ''}
            </div>
            <button
              class="treat-plant-btn"
              data-plot-index="${plotIndex}"
              title="Traiter cette plante"
            >
              💊 Traiter
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderTreatments() {
  const container = document.getElementById('treatments-list');
  if (!container) return;

  container.innerHTML = Object.values(TREATMENTS).map(treatment => {
    const canAfford = state.coins >= treatment.cost;

    return `
      <div class="treatment-card">
        <div class="treatment-header">
          <div class="treatment-icon">${treatment.emoji}</div>
          <div class="treatment-info">
            <h4>${treatment.name}</h4>
            <div class="treatment-cost ${canAfford ? 'affordable' : 'expensive'}">
              ${treatment.cost.toLocaleString()} 💰
            </div>
          </div>
        </div>

        <div class="treatment-description">${treatment.description}</div>

        <div class="treatment-stats">
          <div class="treatment-stat">
            <span>Type:</span>
            <strong>${treatment.areaEffect ? '🌍 Zone' : '🎯 Cible'}</strong>
          </div>
          <div class="treatment-stat">
            <span>Efficacité:</span>
            <strong>${(treatment.successRate * 100).toFixed(0)}%</strong>
          </div>
          ${treatment.duration ? `
            <div class="treatment-stat">
              <span>Durée:</span>
              <strong>${(treatment.duration / 60000).toFixed(0)} min</strong>
            </div>
          ` : ''}
        </div>

        <div class="treatment-effective">
          Efficace contre: ${treatment.effectiveAgainst.map(id => {
            const pest = PEST_TYPES[id.toUpperCase()];
            return pest ? pest.emoji : '';
          }).join(' ')}
        </div>

        <button
          class="treatment-use-btn ${canAfford ? '' : 'disabled'}"
          data-treatment-id="${treatment.id}"
          ${!canAfford ? 'disabled' : ''}
        >
          ${treatment.areaEffect ? '🌍 Utiliser sur tout le jardin' : '🎯 Sélectionner une plante'}
        </button>
      </div>
    `;
  }).join('');
}

// Afficher les indicateurs de maladies sur les parcelles
function renderPestIndicators() {
  const gardenEl = document.getElementById('garden');
  if (!gardenEl) return;

  // Nettoyer les anciens indicateurs
  document.querySelectorAll('.pest-indicator').forEach(el => el.remove());

  Object.entries(state.pests.activePests).forEach(([plotIndexStr, infection]) => {
    const plotIndex = parseInt(plotIndexStr);
    const plotEl = document.querySelector(`.plot[data-plot="${plotIndex}"]`);
    if (!plotEl) return;

    const pest = PEST_TYPES[infection.pestId.toUpperCase()];
    if (!pest) return;

    // Créer l'indicateur
    const indicator = document.createElement('div');
    indicator.className = 'pest-indicator';
    indicator.innerHTML = pest.emoji;
    indicator.title = pest.name;
    indicator.style.backgroundColor = pest.color;

    plotEl.appendChild(indicator);
  });
}

// Afficher le statut des nuisibles dans le header
function renderPestsStatus() {
  const container = document.getElementById('pests-status');
  if (!container) return;

  const infectedCount = Object.keys(state.pests.activePests).length;
  const protectionActive = state.pests.protection && state.pests.protection.until > Date.now();

  if (infectedCount === 0 && !protectionActive) {
    container.innerHTML = '';
    return;
  }

  let statusHtml = '';

  if (protectionActive) {
    statusHtml = `
      <div class="pests-status-display protected">
        <span class="pests-status-icon">🛡️</span>
        <span class="pests-status-text">Protégé</span>
      </div>
    `;
  } else if (infectedCount > 0) {
    statusHtml = `
      <div class="pests-status-display infected">
        <span class="pests-status-icon">🐛</span>
        <span class="pests-status-text">${infectedCount} infectée(s)</span>
      </div>
    `;
  }

  container.innerHTML = statusHtml;
}

// ============================================
// EVENT HANDLERS
// ============================================

// Pests tabs
document.addEventListener('click', (e) => {
  const pestTab = e.target.closest('.pests-tab');
  if (pestTab) {
    const tab = pestTab.dataset.pestTab;

    // Update active tab
    document.querySelectorAll('.pests-tab').forEach(t => t.classList.remove('active'));
    pestTab.classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.pests-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`pests-${tab}-tab`).classList.add('active');
  }
});

// Mode de traitement (sélection de plante)
let treatmentMode = null;

// Utiliser un traitement
document.addEventListener('click', (e) => {
  const useBtn = e.target.closest('.treatment-use-btn');
  if (useBtn && !useBtn.disabled) {
    const treatmentId = useBtn.dataset.treatmentId;
    const treatment = TREATMENTS[treatmentId.toUpperCase()];

    if (treatment.areaEffect) {
      // Traiter directement tout le jardin
      if (treatPlot(null, treatmentId)) {
        renderPestsModal();
        renderPestsStatus();
        renderPestIndicators();
      }
    } else {
      // Activer le mode sélection
      treatmentMode = treatmentId;
      closePestsModal();
      showToast(`🎯 Cliquez sur une plante infectée pour la traiter`, 'info');

      // Highlight les plantes infectées
      document.querySelectorAll('.plot').forEach(plotEl => {
        const plotIndex = parseInt(plotEl.dataset.plot);
        if (state.pests.activePests[plotIndex]) {
          plotEl.classList.add('treatable');
        }
      });
    }
  }
});

// Traiter une plante spécifique depuis le modal
document.addEventListener('click', (e) => {
  const treatBtn = e.target.closest('.treat-plant-btn');
  if (treatBtn) {
    const plotIndex = parseInt(treatBtn.dataset.plotIndex);

    // Ouvrir un mini-menu de sélection de traitement
    showTreatmentSelection(plotIndex);
  }
});

// Afficher la sélection de traitement pour une plante
function showTreatmentSelection(plotIndex) {
  const infection = state.pests.activePests[plotIndex];
  if (!infection) return;

  const pest = PEST_TYPES[infection.pestId.toUpperCase()];
  if (!pest) return;

  // Filtrer les traitements efficaces
  const effectiveTreatments = Object.values(TREATMENTS).filter(t =>
    !t.areaEffect && t.effectiveAgainst.includes(pest.id)
  );

  const plot = state.garden.plots[plotIndex];
  const plant = getPlantById(plot.plantId);

  // Créer un mini-modal de sélection
  const modal = document.createElement('div');
  modal.className = 'treatment-selection-modal';
  modal.innerHTML = `
    <div class="treatment-selection-content">
      <h3>Traiter ${plant?.name || 'cette plante'}</h3>
      <p>Infectée par ${pest.emoji} ${pest.name}</p>

      <div class="treatment-options">
        ${effectiveTreatments.map(t => `
          <button
            class="treatment-option ${state.coins >= t.cost ? '' : 'disabled'}"
            data-treatment-id="${t.id}"
            data-plot-index="${plotIndex}"
            ${state.coins < t.cost ? 'disabled' : ''}
          >
            <div class="treatment-option-icon">${t.emoji}</div>
            <div class="treatment-option-info">
              <div class="treatment-option-name">${t.name}</div>
              <div class="treatment-option-cost">${t.cost} 💰 (${(t.successRate * 100).toFixed(0)}%)</div>
            </div>
          </button>
        `).join('')}
      </div>

      <button class="treatment-cancel-btn">Annuler</button>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);

  // Event handlers
  modal.querySelector('.treatment-cancel-btn').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  });

  modal.querySelectorAll('.treatment-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;

      const treatmentId = btn.dataset.treatmentId;
      const plotIdx = parseInt(btn.dataset.plotIndex);

      if (treatPlot(plotIdx, treatmentId)) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        renderPestsModal();
        renderPestsStatus();
        renderPestIndicators();
      }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// Modal open/close buttons
document.getElementById('pests-btn')?.addEventListener('click', openPestsModal);
document.getElementById('close-pests')?.addEventListener('click', closePestsModal);

// Close modal on background click
document.getElementById('pests-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'pests-modal') closePestsModal();
});

// Mettre à jour l'UI toutes les 2 secondes
setInterval(() => {
  if (document.getElementById('pests-modal').classList.contains('show')) {
    renderPestsModal();
  }
  renderPestsStatus();
  renderPestIndicators();
}, 2000);

console.log('✅ Pests UI loaded');
