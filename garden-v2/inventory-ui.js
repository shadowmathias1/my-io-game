/* ============================================
   INVENTORY & CRAFTING UI
   Interface utilisateur pour l'inventaire et le crafting
   ============================================ */

// ============================================
// MODAL MANAGEMENT
// ============================================

function openInventoryModal() {
  document.getElementById('inventory-modal').classList.add('show');
  renderInventory();
}

function closeInventoryModal() {
  document.getElementById('inventory-modal').classList.remove('show');
}

function openCraftingModal() {
  document.getElementById('crafting-modal').classList.add('show');
  renderCrafting();
}

function closeCraftingModal() {
  document.getElementById('crafting-modal').classList.remove('show');
}

// ============================================
// INVENTORY RENDERING
// ============================================

function renderInventory() {
  renderHarvests();
  renderSeeds();
}

function renderHarvests() {
  const container = document.getElementById('harvests-list');
  if (!container) return;

  const harvests = state.inventory.harvests || {};
  const harvestEntries = Object.entries(harvests);

  if (harvestEntries.length === 0) {
    container.innerHTML = '<div class="inventory-empty">Aucune récolte stockée. Récoltez des plantes pour commencer!</div>';
    return;
  }

  container.innerHTML = harvestEntries
    .sort((a, b) => b[1] - a[1]) // Trier par quantité décroissante
    .map(([plantId, quantity]) => {
      const plant = getPlantById(plantId);
      if (!plant) return '';

      const rarity = getPlantRarity(plant);
      const plantName = plant.name.split(' ').slice(1).join(' '); // Enlever l'emoji du nom

      return `
        <div class="inventory-item">
          <div class="inventory-item-rarity">${rarity.emoji}</div>
          <div class="inventory-item-icon">${plant.name.split(' ')[0]}</div>
          <div class="inventory-item-name">${plantName}</div>
          <div class="inventory-item-quantity">${quantity}</div>
        </div>
      `;
    })
    .join('');
}

function renderSeeds() {
  const container = document.getElementById('seeds-list');
  if (!container) return;

  const seeds = state.seeds || {};
  const seedEntries = Object.entries(seeds);

  if (seedEntries.length === 0) {
    container.innerHTML = '<div class="inventory-empty">Aucune graine disponible. Achetez-en au shop!</div>';
    return;
  }

  container.innerHTML = seedEntries
    .sort((a, b) => b[1] - a[1]) // Trier par quantité décroissante
    .map(([plantId, quantity]) => {
      const plant = getPlantById(plantId);
      if (!plant) return '';

      const rarity = getPlantRarity(plant);
      const plantName = plant.name.split(' ').slice(1).join(' '); // Enlever l'emoji du nom

      return `
        <div class="inventory-item">
          <div class="inventory-item-rarity">${rarity.emoji}</div>
          <div class="inventory-item-icon">${plant.name.split(' ')[0]}</div>
          <div class="inventory-item-name">${plantName}</div>
          <div class="inventory-item-quantity">${quantity}🌱</div>
        </div>
      `;
    })
    .join('');
}

// ============================================
// CRAFTING RENDERING
// ============================================

let currentRarityFilter = 'all';

function renderCrafting() {
  const container = document.getElementById('recipes-list');
  if (!container) return;

  const availableRecipes = getAvailableRecipes();
  let filteredRecipes = availableRecipes;

  if (currentRarityFilter !== 'all') {
    filteredRecipes = availableRecipes.filter(recipe => recipe.category === currentRarityFilter);
  }

  if (filteredRecipes.length === 0) {
    container.innerHTML = '<div class="inventory-empty">Aucune recette disponible dans cette catégorie.</div>';
    return;
  }

  container.innerHTML = filteredRecipes.map(recipe => renderRecipeCard(recipe)).join('');
}

function renderRecipeCard(recipe) {
  const result = recipe.result;
  const plant = getPlantById(result.item);
  if (!plant) return '';

  const rarity = getPlantRarity(plant);
  const canCraft = canCraftRecipe(recipe);
  const locked = !canCraft.canCraft;

  const plantEmoji = plant.name.split(' ')[0];
  const plantName = plant.name.split(' ').slice(1).join(' ');

  let lockedMessage = '';
  if (recipe.unlockRequirement && recipe.unlockRequirement.lifetimeCoins) {
    if (state.lifetimeCoins < recipe.unlockRequirement.lifetimeCoins) {
      lockedMessage = `
        <div class="recipe-locked-message">
          🔒 Débloquer à ${recipe.unlockRequirement.lifetimeCoins.toLocaleString()} lifetime coins
        </div>
      `;
    }
  }

  const ingredientsHtml = recipe.ingredients.map(ingredient => {
    let ingredientIcon = '';
    let ingredientName = '';
    let currentAmount = 0;
    let hasEnough = false;

    if (ingredient.item === 'coins') {
      ingredientIcon = '💰';
      ingredientName = 'Coins';
      currentAmount = state.coins;
      hasEnough = currentAmount >= ingredient.quantity;
    } else if (ingredient.type === 'harvest') {
      const ingredientPlant = getPlantById(ingredient.item);
      if (!ingredientPlant) return '';
      ingredientIcon = ingredientPlant.name.split(' ')[0];
      ingredientName = ingredientPlant.name.split(' ').slice(1).join(' ');
      currentAmount = getHarvestCount(ingredient.item);
      hasEnough = currentAmount >= ingredient.quantity;
    } else if (ingredient.type === 'seed') {
      const ingredientPlant = getPlantById(ingredient.item);
      if (!ingredientPlant) return '';
      ingredientIcon = ingredientPlant.name.split(' ')[0];
      ingredientName = ingredientPlant.name.split(' ').slice(1).join(' ') + ' 🌱';
      currentAmount = state.seeds[ingredient.item] || 0;
      hasEnough = currentAmount >= ingredient.quantity;
    }

    return `
      <div class="recipe-ingredient ${hasEnough ? '' : 'insufficient'}">
        <div class="recipe-ingredient-icon">${ingredientIcon}</div>
        <div class="recipe-ingredient-text">
          <div class="recipe-ingredient-name">${ingredientName}</div>
          <div class="recipe-ingredient-amount ${hasEnough ? 'has-enough' : ''}">
            ${currentAmount}/${ingredient.quantity}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="recipe-card rarity-${recipe.category} ${locked ? 'locked' : ''}">
      ${lockedMessage}
      <div class="recipe-header">
        <div class="recipe-result">
          <div class="recipe-result-icon">${plantEmoji}</div>
          <div class="recipe-result-info">
            <h3>${plantName}</h3>
            <span class="recipe-result-rarity ${recipe.category}">${rarity.emoji} ${rarity.name}</span>
          </div>
        </div>
      </div>

      <div class="recipe-description">${recipe.description}</div>

      <div class="recipe-ingredients">
        <div class="recipe-ingredients-title">Ingrédients requis:</div>
        <div class="recipe-ingredients-list">
          ${ingredientsHtml}
        </div>
      </div>

      <div class="recipe-footer">
        <div class="recipe-unlock-requirement">
          ${result.quantity > 1 ? `✨ Produit ${result.quantity}x graines` : '✨ Produit 1x graine'}
        </div>
        <button
          class="recipe-craft-btn"
          data-recipe-id="${recipe.id}"
          ${locked ? 'disabled' : ''}
        >
          ${locked ? '🔒 Verrouillé' : '🧪 Craft'}
        </button>
      </div>
    </div>
  `;
}

// ============================================
// EVENT HANDLERS
// ============================================

// Inventory tabs
document.addEventListener('click', (e) => {
  const invTab = e.target.closest('.inventory-tab');
  if (invTab) {
    const tab = invTab.dataset.invTab;

    // Update active tab
    document.querySelectorAll('.inventory-tab').forEach(t => t.classList.remove('active'));
    invTab.classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.inventory-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`inventory-${tab}`).classList.add('active');
  }
});

// Crafting filters
document.addEventListener('click', (e) => {
  const filter = e.target.closest('.crafting-filter');
  if (filter) {
    const rarity = filter.dataset.rarity;
    currentRarityFilter = rarity;

    // Update active filter
    document.querySelectorAll('.crafting-filter').forEach(f => f.classList.remove('active'));
    filter.classList.add('active');

    // Re-render recipes
    renderCrafting();
  }
});

// Craft button
document.addEventListener('click', (e) => {
  const craftBtn = e.target.closest('.recipe-craft-btn');
  if (craftBtn && !craftBtn.disabled) {
    const recipeId = craftBtn.dataset.recipeId;
    if (craftRecipe(recipeId)) {
      // Re-render everything
      renderCrafting();
      renderInventory();
      renderShop(); // Update shop if needed
      renderStats(); // Update stats
    }
  }
});

// Modal open/close buttons
document.getElementById('inventory-btn')?.addEventListener('click', openInventoryModal);
document.getElementById('close-inventory')?.addEventListener('click', closeInventoryModal);
document.getElementById('crafting-btn')?.addEventListener('click', openCraftingModal);
document.getElementById('close-crafting')?.addEventListener('click', closeCraftingModal);

// Close modals on background click
document.getElementById('inventory-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'inventory-modal') closeInventoryModal();
});

document.getElementById('crafting-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'crafting-modal') closeCraftingModal();
});

console.log('✅ Inventory & Crafting UI loaded');
