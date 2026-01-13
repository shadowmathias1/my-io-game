/* ============================================
   GARDEN VISUAL ENHANCEMENTS
   Améliorations visuelles et interactions pour le jardin
   ============================================ */

// ============================================
// ENHANCED RENDER FUNCTIONS
// ============================================

// Fonction améliorée pour ajouter des attributs data aux parcelles
function enhancePlotVisuals(plotEl, plotIndex) {
  const plot = state.garden.plots[plotIndex];
  if (!plot) return;

  // Ajouter data-season
  const gardenEl = document.getElementById('garden');
  if (gardenEl && state.season) {
    gardenEl.setAttribute('data-season', state.season.current);
  }

  // Ajouter data-weather
  if (gardenEl && state.weather) {
    gardenEl.setAttribute('data-weather', state.weather.current);
  }

  // Ajouter data-rarity si une plante est présente
  if (plot.plantId) {
    const plant = getPlantById(plot.plantId);
    if (plant && plant.rarityTier) {
      plotEl.setAttribute('data-rarity', plant.rarityTier);
    }
  }

  // Ajouter data-building-type pour les buildings
  if (plot.building) {
    const building = getBuildingById(plot.building);
    if (building) {
      plotEl.classList.add('has-building');

      // Déterminer le type de building
      let buildingType = 'productivity';
      if (building.special) {
        if (['pest_trap', 'scarecrow', 'fence'].includes(building.id)) {
          buildingType = 'defensive';
        } else if (['crystal', 'wishing_well', 'magic_tree'].includes(building.id)) {
          buildingType = 'magical';
        }
      }
      plotEl.setAttribute('data-building-type', buildingType);
    }
  }
}

// ============================================
// PROGRESS BAR SYSTEM
// ============================================

function addProgressBar(plotEl, progress) {
  // Supprimer l'ancienne barre si elle existe
  const oldBar = plotEl.querySelector('.progress-bar');
  if (oldBar) oldBar.remove();

  // Créer la nouvelle barre
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'progress-fill';
  progressFill.style.width = `${progress * 100}%`;

  progressBar.appendChild(progressFill);
  plotEl.appendChild(progressBar);
}

// ============================================
// PARTICLE EFFECTS
// ============================================

function createSparkleEffect(plotEl) {
  const sparkles = ['✨', '⭐', '💫', '🌟'];
  const count = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'harvest-particle';
      sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.left = `${20 + Math.random() * 60}%`;

      plotEl.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 1000);
    }, i * 100);
  }
}

function createLevelUpEffect(plotEl) {
  const effect = document.createElement('div');
  effect.className = 'level-up-effect';
  effect.innerHTML = '⬆️ LEVEL UP!';
  effect.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.7em;
    font-weight: 700;
    color: var(--gold);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    animation: level-up-anim 1.5s ease-out;
    pointer-events: none;
    z-index: 100;
  `;

  plotEl.appendChild(effect);
  setTimeout(() => effect.remove(), 1500);
}

// Animation CSS pour level up
const levelUpStyle = document.createElement('style');
levelUpStyle.textContent = `
  @keyframes level-up-anim {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5) rotate(-180deg);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -80%) scale(1.2) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -120%) scale(0.8) rotate(180deg);
    }
  }
`;
document.head.appendChild(levelUpStyle);

// ============================================
// UNLOCK ANIMATION
// ============================================

function playUnlockAnimation(plotIndex) {
  const plotEl = document.querySelector(`.plot[data-plot="${plotIndex}"]`);
  if (!plotEl) return;

  plotEl.classList.add('unlocking');

  // Effet sonore visuel
  createSparkleEffect(plotEl);

  setTimeout(() => {
    plotEl.classList.remove('unlocking');
  }, 600);
}

// ============================================
// HOVER TOOLTIPS
// ============================================

let currentTooltip = null;

function showEnhancedTooltip(plotEl, plotIndex) {
  const plot = state.garden.plots[plotIndex];
  if (!plot || !plot.unlocked) return;

  // Supprimer le tooltip existant
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'enhanced-tooltip';

  let content = '';

  // Info sur la plante
  if (plot.plantId) {
    const plant = getPlantById(plot.plantId);
    if (plant) {
      const progress = plot.growthProgress || 0;
      const boostedYield = calculateBoostedYield(plotIndex);

      content += `
        <div class="tooltip-header">${plant.name}</div>
        <div class="tooltip-body">
          <div class="tooltip-row">
            <span>Progression:</span>
            <strong>${(progress * 100).toFixed(0)}%</strong>
          </div>
          <div class="tooltip-row">
            <span>Rendement:</span>
            <strong>${boostedYield} 💰</strong>
          </div>
          ${plant.rarityTier ? `
            <div class="tooltip-row">
              <span>Rareté:</span>
              <strong class="rarity-${plant.rarityTier}">${plant.rarityTier}</strong>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  // Info sur le building
  if (plot.building) {
    const building = getBuildingById(plot.building);
    if (building) {
      content += `
        <div class="tooltip-header">${building.name}</div>
        <div class="tooltip-body">
          <div class="tooltip-row">
            <span>Type:</span>
            <strong>Bâtiment</strong>
          </div>
          ${building.radius ? `
            <div class="tooltip-row">
              <span>Rayon:</span>
              <strong>${building.radius} cases</strong>
            </div>
          ` : ''}
          ${building.growthBoost ? `
            <div class="tooltip-row">
              <span>Bonus croissance:</span>
              <strong>+${(building.growthBoost * 100).toFixed(0)}%</strong>
            </div>
          ` : ''}
          ${building.yieldBoost ? `
            <div class="tooltip-row">
              <span>Bonus rendement:</span>
              <strong>+${(building.yieldBoost * 100).toFixed(0)}%</strong>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  // Info sur décoration
  if (state.customization && state.customization.decorations[plotIndex]) {
    const decorId = state.customization.decorations[plotIndex];
    if (decorId && !decorId.includes('_occupied')) {
      const decoration = DECORATIONS[decorId];
      if (decoration) {
        content += `
          <div class="tooltip-header">${decoration.name}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span>Type:</span>
              <strong>Décoration</strong>
            </div>
          </div>
        `;
      }
    }
  }

  // Info sur parcelle vide
  if (!plot.plantId && !plot.building && content === '') {
    content = `
      <div class="tooltip-header">Parcelle vide</div>
      <div class="tooltip-body">
        <div class="tooltip-row">
          <span>Cliquez pour planter</span>
        </div>
      </div>
    `;
  }

  tooltip.innerHTML = content;

  // Style du tooltip
  tooltip.style.cssText = `
    position: absolute;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 249, 250, 0.95));
    border: 2px solid var(--primary-green);
    border-radius: 12px;
    padding: 12px;
    font-size: 0.85em;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    pointer-events: none;
    min-width: 200px;
    animation: tooltip-appear 0.2s ease;
  `;

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;

  // Positionner le tooltip
  const rect = plotEl.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

  // Ajuster si hors écran
  if (parseFloat(tooltip.style.top) < 10) {
    tooltip.style.top = `${rect.bottom + 10}px`;
  }
}

function hideEnhancedTooltip() {
  if (currentTooltip) {
    currentTooltip.style.animation = 'tooltip-disappear 0.2s ease';
    setTimeout(() => {
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }
    }, 200);
  }
}

// Ajouter les animations de tooltip
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
  @keyframes tooltip-appear {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tooltip-disappear {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  .enhanced-tooltip .tooltip-header {
    font-size: 1.1em;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 8px;
    text-align: center;
  }

  .enhanced-tooltip .tooltip-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .enhanced-tooltip .tooltip-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 0.95em;
  }

  .enhanced-tooltip .tooltip-row span {
    color: var(--text-light);
  }

  .enhanced-tooltip .tooltip-row strong {
    color: var(--text-dark);
  }

  .enhanced-tooltip .rarity-rare {
    color: #3498db;
  }

  .enhanced-tooltip .rarity-epic {
    color: #9b59b6;
  }

  .enhanced-tooltip .rarity-legendary {
    color: #f39c12;
    text-shadow: 0 0 5px rgba(243, 156, 18, 0.5);
  }

  body[data-theme="dark"] .enhanced-tooltip {
    background: linear-gradient(135deg, rgba(25, 32, 48, 0.98), rgba(19, 25, 38, 0.95));
    border-color: #2ecc71;
  }
`;
document.head.appendChild(tooltipStyle);

// ============================================
// INTEGRATION WITH EXISTING RENDER
// ============================================

// Hook dans le système de rendu existant
const originalRenderGarden = window.renderGarden;
if (originalRenderGarden) {
  window.renderGarden = function(...args) {
    originalRenderGarden.apply(this, args);

    // Améliorer chaque parcelle après le rendu
    document.querySelectorAll('.plot').forEach((plotEl, index) => {
      const plotIndex = parseInt(plotEl.dataset.plot);
      enhancePlotVisuals(plotEl, plotIndex);

      const plot = state.garden.plots[plotIndex];
      if (plot && plot.plantId && plot.growthProgress) {
        addProgressBar(plotEl, plot.growthProgress);
      }

      // Ajouter les tooltips au hover
      plotEl.addEventListener('mouseenter', () => showEnhancedTooltip(plotEl, plotIndex));
      plotEl.addEventListener('mouseleave', hideEnhancedTooltip);
    });
  };
}

// Hook dans le système de harvest
const originalHarvestPlot = window.harvestPlot;
if (originalHarvestPlot) {
  window.harvestPlot = function(plotIndex) {
    const result = originalHarvestPlot.call(this, plotIndex);

    if (result) {
      const plotEl = document.querySelector(`.plot[data-plot="${plotIndex}"]`);
      if (plotEl) {
        createSparkleEffect(plotEl);
      }
    }

    return result;
  };
}

// Hook dans le système d'unlock
const originalUnlockPlot = window.unlockPlot;
if (originalUnlockPlot) {
  window.unlockPlot = function(plotIndex) {
    const result = originalUnlockPlot.call(this, plotIndex);

    if (result) {
      setTimeout(() => playUnlockAnimation(plotIndex), 50);
    }

    return result;
  };
}

console.log('✅ Garden Enhancements loaded');
