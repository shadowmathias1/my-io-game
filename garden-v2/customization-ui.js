/* ============================================
   CUSTOMIZATION UI
   Interface pour la personnalisation
   ============================================ */

// ============================================
// MODAL MANAGEMENT
// ============================================

function openCustomizationModal() {
  document.getElementById('customization-modal').classList.add('show');
  renderCustomization();
}

function closeCustomizationModal() {
  document.getElementById('customization-modal').classList.remove('show');
}

// ============================================
// RENDERING
// ============================================

function renderCustomization() {
  renderThemes();
  renderBorders();
  renderBackgrounds();
  renderDecorations();
}

function renderThemes() {
  const container = document.getElementById('themes-list');
  if (!container) return;

  container.innerHTML = Object.values(VISUAL_THEMES).map(theme => {
    const unlocked = state.customization.unlockedThemes.includes(theme.id);
    const active = state.customization.theme === theme.id;
    const canAfford = state.coins >= theme.cost;

    return `
      <div class="custom-item ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}">
        <div class="custom-item-preview" style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})">
          ${theme.name.split(' ')[0]}
        </div>
        <div class="custom-item-info">
          <div class="custom-item-name">${theme.name}</div>
          <div class="custom-item-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${theme.cost > 0 ? `${theme.cost.toLocaleString()} 💰` : 'Gratuit'}
          </div>
        </div>
        ${!unlocked ? `
          <button
            class="custom-buy-btn ${canAfford ? '' : 'disabled'}"
            data-type="theme"
            data-id="${theme.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            🔓 Débloquer
          </button>
        ` : `
          <button
            class="custom-apply-btn ${active ? 'active' : ''}"
            data-type="theme"
            data-id="${theme.id}"
          >
            ${active ? '✓ Actif' : '✨ Appliquer'}
          </button>
        `}
      </div>
    `;
  }).join('');
}

function renderBorders() {
  const container = document.getElementById('borders-list');
  if (!container) return;

  container.innerHTML = Object.values(BORDERS).map(border => {
    const unlocked = state.customization.unlockedBorders.includes(border.id);
    const active = state.customization.border === border.id;
    const canAfford = state.coins >= border.cost;

    return `
      <div class="custom-item ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}">
        <div class="custom-item-preview border-preview" style="border: ${border.style}">

        </div>
        <div class="custom-item-info">
          <div class="custom-item-name">${border.name}</div>
          <div class="custom-item-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${border.cost > 0 ? `${border.cost.toLocaleString()} 💰` : 'Gratuit'}
          </div>
        </div>
        ${!unlocked ? `
          <button
            class="custom-buy-btn ${canAfford ? '' : 'disabled'}"
            data-type="border"
            data-id="${border.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            🔓 Débloquer
          </button>
        ` : `
          <button
            class="custom-apply-btn ${active ? 'active' : ''}"
            data-type="border"
            data-id="${border.id}"
          >
            ${active ? '✓ Actif' : '✨ Appliquer'}
          </button>
        `}
      </div>
    `;
  }).join('');
}

function renderBackgrounds() {
  const container = document.getElementById('backgrounds-list');
  if (!container) return;

  container.innerHTML = Object.values(BACKGROUNDS).map(background => {
    const unlocked = state.customization.unlockedBackgrounds.includes(background.id);
    const active = state.customization.background === background.id;
    const canAfford = state.coins >= background.cost;

    return `
      <div class="custom-item ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}">
        <div class="custom-item-preview" style="background: ${background.gradient}">

        </div>
        <div class="custom-item-info">
          <div class="custom-item-name">${background.name}</div>
          <div class="custom-item-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${background.cost > 0 ? `${background.cost.toLocaleString()} 💰` : 'Gratuit'}
          </div>
        </div>
        ${!unlocked ? `
          <button
            class="custom-buy-btn ${canAfford ? '' : 'disabled'}"
            data-type="background"
            data-id="${background.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            🔓 Débloquer
          </button>
        ` : `
          <button
            class="custom-apply-btn ${active ? 'active' : ''}"
            data-type="background"
            data-id="${background.id}"
          >
            ${active ? '✓ Actif' : '✨ Appliquer'}
          </button>
        `}
      </div>
    `;
  }).join('');
}

function renderDecorations() {
  const container = document.getElementById('decorations-list');
  if (!container) return;

  container.innerHTML = Object.values(DECORATIONS).map(decoration => {
    const unlocked = state.customization.unlockedDecorations.includes(decoration.id);
    const canAfford = state.coins >= decoration.cost;

    return `
      <div class="custom-item ${!unlocked ? 'locked' : ''}">
        <div class="custom-item-preview decoration-preview">
          <span style="font-size: 2em;">${decoration.emoji}</span>
        </div>
        <div class="custom-item-info">
          <div class="custom-item-name">${decoration.name}</div>
          <div class="custom-item-size">${decoration.size}x${decoration.size === 1 ? '1' : decoration.size === 2 ? (decoration.orientation === 'horizontal' ? '1' : '2') : '2'}</div>
          <div class="custom-item-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${decoration.cost.toLocaleString()} 💰
          </div>
        </div>
        ${!unlocked ? `
          <button
            class="custom-buy-btn ${canAfford ? '' : 'disabled'}"
            data-type="decoration"
            data-id="${decoration.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            🔓 Débloquer
          </button>
        ` : `
          <button
            class="custom-place-btn"
            data-decoration-id="${decoration.id}"
          >
            📍 Placer
          </button>
        `}
      </div>
    `;
  }).join('');
}

// ============================================
// EVENT HANDLERS
// ============================================

// Customization tabs
document.addEventListener('click', (e) => {
  const customTab = e.target.closest('.customization-tab');
  if (customTab) {
    const tab = customTab.dataset.customTab;

    // Update active tab
    document.querySelectorAll('.customization-tab').forEach(t => t.classList.remove('active'));
    customTab.classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.customization-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`customization-${tab}-tab`).classList.add('active');
  }
});

// Buy customization item
document.addEventListener('click', (e) => {
  const buyBtn = e.target.closest('.custom-buy-btn');
  if (buyBtn && !buyBtn.disabled) {
    const type = buyBtn.dataset.type;
    const id = buyBtn.dataset.id;

    let success = false;

    switch (type) {
      case 'theme':
        success = buyTheme(id);
        break;
      case 'border':
        success = buyBorder(id);
        break;
      case 'background':
        success = buyBackground(id);
        break;
      case 'decoration':
        success = buyDecoration(id);
        break;
    }

    if (success) {
      renderCustomization();
      renderStats();
    }
  }
});

// Apply customization item
document.addEventListener('click', (e) => {
  const applyBtn = e.target.closest('.custom-apply-btn');
  if (applyBtn) {
    const type = applyBtn.dataset.type;
    const id = applyBtn.dataset.id;

    switch (type) {
      case 'theme':
        applyTheme(id);
        break;
      case 'border':
        applyBorder(id);
        break;
      case 'background':
        applyBackground(id);
        break;
    }

    renderCustomization();
  }
});

// Place decoration mode
let decorationPlacementMode = null;

document.addEventListener('click', (e) => {
  const placeBtn = e.target.closest('.custom-place-btn');
  if (placeBtn) {
    const decorationId = placeBtn.dataset.decorationId;
    decorationPlacementMode = decorationId;

    closeCustomizationModal();
    showToast('📍 Cliquez sur une parcelle pour placer la décoration', 'info');

    // Highlight available plots
    document.querySelectorAll('.plot').forEach(plotEl => {
      const plotIndex = parseInt(plotEl.dataset.plot);
      const plot = state.garden.plots[plotIndex];

      if (plot && plot.unlocked && !plot.plantId && !plot.building && !state.customization.decorations[plotIndex]) {
        plotEl.classList.add('decoration-placeable');
      }
    });
  }
});

// Handle plot click for decoration placement
function handleDecorationPlacement(plotIndex) {
  if (!decorationPlacementMode) return false;

  const success = placeDecoration(plotIndex, decorationPlacementMode);

  if (success) {
    decorationPlacementMode = null;
    document.querySelectorAll('.plot').forEach(p => p.classList.remove('decoration-placeable'));
    renderGarden();
    return true;
  }

  return false;
}

// Render decorations on garden
function renderGardenDecorations() {
  if (!state.customization || !state.customization.decorations) return;

  Object.entries(state.customization.decorations).forEach(([plotIndexStr, decorationId]) => {
    if (decorationId.includes('_occupied')) return; // Skip occupied plots

    const plotIndex = parseInt(plotIndexStr);
    const plotEl = document.querySelector(`.plot[data-plot="${plotIndex}"]`);
    if (!plotEl) return;

    const decoration = DECORATIONS[decorationId];
    if (!decoration) return;

    // Add decoration indicator
    const decorIndicator = document.createElement('div');
    decorIndicator.className = 'decoration-indicator';
    decorIndicator.innerHTML = decoration.emoji;
    decorIndicator.title = decoration.name;

    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'decoration-remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Retirer';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeDecoration(plotIndex);
      renderGarden();
    };

    decorIndicator.appendChild(removeBtn);
    plotEl.appendChild(decorIndicator);
  });
}

// Modal open/close buttons
document.getElementById('customization-btn')?.addEventListener('click', openCustomizationModal);
document.getElementById('close-customization')?.addEventListener('click', closeCustomizationModal);

// Close modal on background click
document.getElementById('customization-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'customization-modal') closeCustomizationModal();
});

console.log('✅ Customization UI loaded');
