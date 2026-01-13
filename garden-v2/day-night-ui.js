/* ============================================
   DAY/NIGHT UI
   Interface pour le système jour/nuit
   ============================================ */

// Afficher l'indicateur jour/nuit dans le header
function renderDayNightIndicator() {
  const container = document.getElementById('day-night-indicator');
  if (!container) return;

  const icon = getDayNightIcon();
  const text = getDayNightText();

  container.innerHTML = `
    <div class="day-night-display">
      <span class="day-night-icon">${icon}</span>
      <div class="day-night-name">${text}</div>
    </div>
  `;
}

// Afficher les plantes nocturnes disponibles dans le shop
function renderNocturnalPlantsInShop() {
  const container = document.getElementById('shop-nocturnal');
  if (!container) return;

  // Vérifier que NIGHT_PLANTS existe
  if (typeof NIGHT_PLANTS === 'undefined') {
    container.innerHTML = `
      <div class="nocturnal-locked">
        <div class="nocturnal-locked-icon">⚠️</div>
        <div class="nocturnal-locked-text">
          Système de plantes nocturnes en chargement...
        </div>
      </div>
    `;
    return;
  }

  const availablePlants = Object.values(NIGHT_PLANTS).filter(plant =>
    state.prestigeLevel >= plant.prestigeRequired
  );

  if (availablePlants.length === 0) {
    // Afficher toutes les plantes avec leur niveau de prestige requis
    container.innerHTML = `
      <div class="nocturnal-info">
        <h3 style="text-align: center; color: #9b59b6; margin-bottom: 20px;">
          🌙 Plantes Nocturnes Mystérieuses
        </h3>
        <p style="text-align: center; margin-bottom: 30px; color: var(--text-light);">
          Ces plantes spéciales ne poussent que la nuit et nécessitent un certain niveau de Prestige pour être débloquées.
        </p>
      </div>
      ${Object.values(NIGHT_PLANTS).map(plant => `
        <div class="shop-item nocturnal-plant locked" style="opacity: 0.6; border: 2px solid #9b59b6;">
          <div class="plant-icon" style="font-size: 2.5em; filter: grayscale(0.5);">${plant.emoji}</div>
          <div class="plant-info">
            <div class="plant-name" style="color: #9b59b6;">${plant.name}</div>
            <div class="plant-description" style="font-size: 0.85em; color: var(--text-light); margin: 5px 0;">
              ${plant.description}
            </div>
            <div class="plant-details">
              <span class="plant-time">⏱️ ${Math.floor(plant.growTime / 60)}m</span>
              <span class="plant-yield">💰 ${plant.sellPrice}</span>
            </div>
            <div class="plant-rarity rarity-${plant.rarityTier}" style="margin-top: 5px; font-weight: 700; text-transform: uppercase;">
              ${plant.rarityTier}
            </div>
            <div class="plant-prestige" style="font-size: 0.9em; color: var(--gold); font-weight: 700; margin-top: 8px; padding: 5px 10px; background: rgba(243, 156, 18, 0.1); border-radius: 8px; display: inline-block;">
              🏆 Prestige ${plant.prestigeRequired} Requis
            </div>
            <div class="plant-night-only" style="margin-top: 5px; color: #9b59b6;">🌙 Achat nocturne uniquement</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
            <div style="font-size: 1.2em; font-weight: 700; color: var(--text-dark);">${plant.basePrice} 💰</div>
            <button class="buy-seed" disabled style="opacity: 0.5; cursor: not-allowed;">
              🔒 Verrouillé
            </button>
          </div>
        </div>
      `).join('')}
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.05)); border-radius: 15px; border: 2px dashed #9b59b6;">
        <div style="font-size: 1.5em; margin-bottom: 10px;">🏆</div>
        <div style="font-weight: 700; color: var(--text-dark); margin-bottom: 5px;">Comment débloquer?</div>
        <div style="color: var(--text-light);">
          Utilisez le système de Prestige pour débloquer ces plantes mystérieuses.<br>
          Prestige actuel: <strong>${state.prestigeLevel || 0}</strong>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = availablePlants.map(plant => {
    const canAfford = state.coins >= plant.basePrice;
    const isNight = dayNightState.current === 'night' || dayNightState.current === 'dusk';

    return `
      <div class="shop-item nocturnal-plant ${!canAfford ? 'too-expensive' : ''} ${!isNight ? 'day-time' : ''}">
        <div class="plant-icon">${plant.emoji}</div>
        <div class="plant-info">
          <div class="plant-name">${plant.name}</div>
          <div class="plant-details">
            <span class="plant-time">⏱️ ${Math.floor(plant.growTime / 60)}m</span>
            <span class="plant-yield">💰 ${plant.sellPrice}</span>
          </div>
          <div class="plant-rarity rarity-${plant.rarityTier}">${plant.rarityTier}</div>
          <div class="plant-prestige">🏆 Prestige ${plant.prestigeRequired}</div>
          ${!isNight ? '<div class="plant-night-only">🌙 Plantation nocturne uniquement</div>' : ''}
        </div>
        <button
          class="buy-seed"
          data-plant-id="${plant.id}"
          ${!canAfford || !isNight ? 'disabled' : ''}
        >
          ${canAfford ? `${plant.basePrice} 💰` : '🔒 Trop cher'}
        </button>
      </div>
    `;
  }).join('');
}

// Modal pour les lumières
function openLightsModal() {
  const modal = document.getElementById('lights-modal');
  if (!modal) return;

  modal.classList.add('show');
  renderLightsModal();
}

function closeLightsModal() {
  const modal = document.getElementById('lights-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function renderLightsModal() {
  const container = document.getElementById('lights-list');
  if (!container) return;

  container.innerHTML = Object.values(GARDEN_LIGHTS).map(light => {
    const canAfford = state.coins >= light.cost;
    const owned = state.dayNight.lights.filter(l => l.type === light.id).length;

    return `
      <div class="light-card">
        <div class="light-icon">${light.emoji}</div>
        <div class="light-info">
          <div class="light-name">${light.name}</div>
          <div class="light-description">${light.description}</div>
          <div class="light-stats">
            <div class="light-stat">
              <span class="light-stat-label">Rayon:</span>
              <strong>${light.radius} cases</strong>
            </div>
            ${light.bonus ? `
              <div class="light-stat">
                <span class="light-stat-label">Bonus:</span>
                <strong>+${(light.bonus * 100).toFixed(0)}% croissance</strong>
              </div>
            ` : ''}
            <div class="light-stat">
              <span class="light-stat-label">Possédé:</span>
              <strong>${owned}</strong>
            </div>
          </div>
        </div>
        <div class="light-actions">
          <div class="light-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${light.cost.toLocaleString()} 💰
          </div>
          <button
            class="light-place-btn ${canAfford ? '' : 'disabled'}"
            data-light-type="${light.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            💡 Placer
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Mode placement de lumière
let lightPlacementMode = null;

document.addEventListener('click', (e) => {
  const placeBtn = e.target.closest('.light-place-btn');
  if (placeBtn && !placeBtn.disabled) {
    const lightType = placeBtn.dataset.lightType;
    lightPlacementMode = lightType;

    closeLightsModal();
    showToast('💡 Cliquez sur une parcelle vide pour placer la lumière', 'info');

    // Highlight les parcelles disponibles
    document.querySelectorAll('.plot').forEach(plotEl => {
      const plotIndex = parseInt(plotEl.dataset.plot);
      const plot = state.garden.plots[plotIndex];

      if (plot && plot.unlocked && !plot.plantId && !plot.building) {
        const hasLight = state.dayNight.lights.some(l => l.plotIndex === plotIndex);
        if (!hasLight) {
          plotEl.classList.add('light-placeable');
        }
      }
    });
  }
});

// Gérer le placement de lumière
function handleLightPlacement(plotIndex) {
  if (!lightPlacementMode) return false;

  const success = buyLight(lightPlacementMode, plotIndex);

  if (success) {
    lightPlacementMode = null;
    document.querySelectorAll('.plot').forEach(p => p.classList.remove('light-placeable'));
    renderGarden();
    return true;
  }

  return false;
}

// Afficher les lumières sur le jardin
function renderGardenLights() {
  if (!state.dayNight || !state.dayNight.lights) return;

  state.dayNight.lights.forEach(light => {
    const plotEl = document.querySelector(`.plot[data-plot="${light.plotIndex}"]`);
    if (!plotEl) return;

    const lightData = GARDEN_LIGHTS[light.type.toUpperCase()];
    if (!lightData) return;

    // Ajouter l'indicateur de lumière
    const lightIndicator = document.createElement('div');
    lightIndicator.className = 'light-indicator';
    lightIndicator.innerHTML = lightData.emoji;
    lightIndicator.title = lightData.name;

    // Ajouter bouton de suppression
    const removeBtn = document.createElement('button');
    removeBtn.className = 'light-remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Retirer';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeLight(light.plotIndex);
      renderGarden();
    };

    lightIndicator.appendChild(removeBtn);
    plotEl.appendChild(lightIndicator);

    // Ajouter effet de zone éclairée
    if (dayNightState.current === 'night') {
      highlightLitArea(light.plotIndex, lightData.radius);
    }
  });
}

// Mettre en évidence la zone éclairée
function highlightLitArea(centerPlot, radius) {
  const size = state.garden.size;
  const centerRow = Math.floor(centerPlot / size);
  const centerCol = centerPlot % size;

  for (let row = Math.max(0, centerRow - radius); row <= Math.min(size - 1, centerRow + radius); row++) {
    for (let col = Math.max(0, centerCol - radius); col <= Math.min(size - 1, centerCol + radius); col++) {
      const plotIndex = row * size + col;
      const plotEl = document.querySelector(`.plot[data-plot="${plotIndex}"]`);

      if (plotEl) {
        const distance = Math.max(Math.abs(row - centerRow), Math.abs(col - centerCol));
        if (distance <= radius) {
          plotEl.classList.add('lit-area');
        }
      }
    }
  }
}

// Mettre à jour l'interface toutes les secondes
setInterval(() => {
  renderDayNightIndicator();
}, 1000);

// Hook dans le render du jardin
const originalRenderGarden = window.renderGarden;
if (originalRenderGarden) {
  window.renderGarden = function(...args) {
    originalRenderGarden.apply(this, args);
    renderGardenLights();
  };
}

console.log('✅ Day/Night UI loaded');

// Event listeners
document.getElementById('lights-btn')?.addEventListener('click', openLightsModal);
document.getElementById('close-lights')?.addEventListener('click', closeLightsModal);

// Close modal on background click
document.getElementById('lights-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'lights-modal') closeLightsModal();
});

// Event listener pour acheter les plantes nocturnes
document.addEventListener('DOMContentLoaded', () => {
  const shopNocturnal = document.getElementById('shop-nocturnal');
  if (shopNocturnal) {
    shopNocturnal.addEventListener('click', (e) => {
      const btn = e.target.closest('.buy-seed');
      if (btn && !btn.disabled) {
        const plantId = btn.dataset.plantId;
        const plant = NIGHT_PLANTS && Object.values(NIGHT_PLANTS).find(p => p.id === plantId);

        if (!plant) return;

        // Vérifier si c'est la nuit
        const isNight = dayNightState.current === 'night' || dayNightState.current === 'dusk';
        if (!isNight) {
          if (typeof showToast === 'function') {
            showToast('❌ Les plantes nocturnes ne peuvent être achetées que la nuit!', 'error');
          }
          return;
        }

        // Vérifier le prestige
        if (state.prestigeLevel < plant.prestigeRequired) {
          if (typeof showToast === 'function') {
            showToast(`❌ Prestige ${plant.prestigeRequired} requis`, 'error');
          }
          return;
        }

        // Vérifier les pièces
        if (state.coins < plant.basePrice) {
          if (typeof showToast === 'function') {
            showToast('❌ Pas assez de pièces', 'error');
          }
          return;
        }

        // Acheter la plante (ajouter 3 graines)
        state.coins -= plant.basePrice;
        state.inventory[plantId] = (state.inventory[plantId] || 0) + 3;

        if (typeof showToast === 'function') {
          showToast(`✨ ${plant.name} acheté! +3 graines`, 'success');
        }

        if (typeof needsShopRender !== 'undefined') needsShopRender = true;
        if (typeof needsRender !== 'undefined') needsRender = true;
        if (typeof saveGame === 'function') saveGame();
      }
    });
  }
});
