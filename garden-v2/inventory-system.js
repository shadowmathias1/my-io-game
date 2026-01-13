/* ============================================
   INVENTORY & CRAFTING SYSTEM
   Système d'inventaire et de crafting avancé
   ============================================ */

// ============================================
// RARITY SYSTEM - Système de rareté étendu
// ============================================

const RARITY_LEVELS = {
  COMMON: {
    id: 'common',
    name: 'Commun',
    color: '#95a5a6',
    emoji: '⚪',
    dropChance: 1.0,
    sellMultiplier: 1.0
  },
  UNCOMMON: {
    id: 'uncommon',
    name: 'Peu Commun',
    color: '#27ae60',
    emoji: '🟢',
    dropChance: 0.4,
    sellMultiplier: 1.5
  },
  RARE: {
    id: 'rare',
    name: 'Rare',
    color: '#3498db',
    emoji: '🔵',
    dropChance: 0.15,
    sellMultiplier: 2.5
  },
  EPIC: {
    id: 'epic',
    name: 'Épique',
    color: '#9b59b6',
    emoji: '🟣',
    dropChance: 0.05,
    sellMultiplier: 5.0
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Légendaire',
    color: '#f39c12',
    emoji: '🟡',
    dropChance: 0.01,
    sellMultiplier: 10.0
  },
  MYTHIC: {
    id: 'mythic',
    name: 'Mythique',
    color: '#e74c3c',
    emoji: '🔴',
    dropChance: 0.002,
    sellMultiplier: 25.0
  },
  DIVINE: {
    id: 'divine',
    name: 'Divin',
    color: '#ff00ff',
    emoji: '⭐',
    dropChance: 0.0005,
    sellMultiplier: 100.0
  }
};

// ============================================
// EXTENDED PLANTS - Nouvelles plantes avec rareté
// ============================================

const RARE_PLANTS = [
  // RARE
  {
    id: 'golden_wheat',
    name: '🌾 Blé Doré',
    cost: 1200,
    growTime: 40,
    yield: 1800,
    rarityTier: 'rare',
    category: 'plante',
    size: 1,
    description: 'Un blé rare qui brille comme l\'or'
  },
  {
    id: 'crystal_berry',
    name: '💎 Baie Cristal',
    cost: 2500,
    growTime: 60,
    yield: 4000,
    rarityTier: 'rare',
    category: 'fruit',
    size: 1,
    description: 'Des baies transparentes comme du cristal'
  },
  {
    id: 'moon_carrot',
    name: '🌙 Carotte Lunaire',
    cost: 1800,
    growTime: 50,
    yield: 2800,
    rarityTier: 'rare',
    category: 'legume',
    size: 1,
    description: 'Pousse uniquement sous la lumière de la lune'
  },

  // EPIC
  {
    id: 'rainbow_rose',
    name: '🌈 Rose Arc-en-Ciel',
    cost: 5000,
    growTime: 80,
    yield: 9000,
    rarityTier: 'epic',
    category: 'plante',
    size: 1,
    special: 'rainbow',
    description: 'Une rose aux pétales multicolores qui change de couleur'
  },
  {
    id: 'dragon_fruit_supreme',
    name: '🐉 Fruit du Dragon Suprême',
    cost: 8000,
    growTime: 100,
    yield: 15000,
    rarityTier: 'epic',
    category: 'fruit',
    size: 2,
    orientation: 'vertical',
    description: 'Un fruit légendaire gardé par les dragons'
  },
  {
    id: 'thunder_pepper',
    name: '⚡ Poivron Foudre',
    cost: 6500,
    growTime: 90,
    yield: 12000,
    rarityTier: 'epic',
    category: 'legume',
    size: 1,
    special: 'shock',
    description: 'Électrifie les plantes adjacentes pour +20% de vitesse'
  },

  // LEGENDARY
  {
    id: 'star_blossom',
    name: '⭐ Fleur d\'Étoile',
    cost: 15000,
    growTime: 120,
    yield: 30000,
    rarityTier: 'legendary',
    category: 'plante',
    size: 1,
    special: 'cosmic',
    description: 'Née des étoiles, donne +50% de coins à toutes les récoltes pendant 5 min'
  },
  {
    id: 'eternal_tree',
    name: '🌳 Arbre Éternel',
    cost: 25000,
    growTime: 180,
    yield: 60000,
    rarityTier: 'legendary',
    category: 'plante',
    size: 4,
    orientation: 'square',
    special: 'eternal',
    autoRespawn: true,
    description: 'Un arbre immortel qui se régénère après chaque récolte'
  },
  {
    id: 'void_melon',
    name: '🌑 Melon du Vide',
    cost: 20000,
    growTime: 150,
    yield: 45000,
    rarityTier: 'legendary',
    category: 'fruit',
    size: 2,
    orientation: 'horizontal',
    special: 'void',
    description: 'Un melon mystérieux du royaume des ombres'
  },

  // MYTHIC
  {
    id: 'galaxy_orchid',
    name: '🌌 Orchidée Galactique',
    cost: 50000,
    growTime: 200,
    yield: 120000,
    rarityTier: 'mythic',
    category: 'plante',
    size: 2,
    orientation: 'vertical',
    special: 'galaxy',
    description: 'Contient une galaxie miniature dans chaque pétale'
  },
  {
    id: 'phoenix_apple',
    name: '🔥 Pomme Phoenix',
    cost: 75000,
    growTime: 240,
    yield: 200000,
    rarityTier: 'mythic',
    category: 'fruit',
    size: 1,
    special: 'rebirth',
    autoRespawn: true,
    description: 'Renaît de ses cendres, donne 2x coins et se replante automatiquement'
  },

  // DIVINE
  {
    id: 'genesis_seed',
    name: '✨ Graine de Genèse',
    cost: 150000,
    growTime: 300,
    yield: 500000,
    rarityTier: 'divine',
    category: 'plante',
    size: 4,
    orientation: 'square',
    special: 'genesis',
    description: 'La première graine de l\'univers. Multiplie tous les gains par 3 pendant 10 min'
  }
];

// ============================================
// CRAFTING RECIPES - Recettes de crafting
// ============================================

const CRAFTING_RECIPES = [
  // Recettes RARE
  {
    id: 'golden_wheat_recipe',
    result: { item: 'golden_wheat', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'grass', quantity: 50, type: 'harvest' },
      { item: 'flower', quantity: 30, type: 'harvest' },
      { item: 'coins', quantity: 5000 }
    ],
    unlockRequirement: { lifetimeCoins: 50000 },
    category: 'rare',
    description: 'Mélange d\'herbe et de fleurs pour créer du blé doré'
  },
  {
    id: 'crystal_berry_recipe',
    result: { item: 'crystal_berry', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'strawberry', quantity: 100, type: 'harvest' },
      { item: 'flower', quantity: 50, type: 'harvest' },
      { item: 'coins', quantity: 10000 }
    ],
    unlockRequirement: { lifetimeCoins: 100000 },
    category: 'rare',
    description: 'Cristallise des fraises pour créer des baies cristal'
  },
  {
    id: 'moon_carrot_recipe',
    result: { item: 'moon_carrot', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'carrot', quantity: 80, type: 'harvest' },
      { item: 'corn', quantity: 40, type: 'harvest' },
      { item: 'coins', quantity: 8000 }
    ],
    unlockRequirement: { lifetimeCoins: 80000 },
    category: 'rare',
    description: 'Infuse des carottes avec la lumière lunaire'
  },

  // Recettes EPIC
  {
    id: 'rainbow_rose_recipe',
    result: { item: 'rainbow_rose', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'flower', quantity: 200, type: 'harvest' },
      { item: 'golden_wheat', quantity: 50, type: 'harvest' },
      { item: 'crystal_berry', quantity: 50, type: 'harvest' },
      { item: 'coins', quantity: 25000 }
    ],
    unlockRequirement: { lifetimeCoins: 300000 },
    category: 'epic',
    description: 'Fusionne des fleurs avec des ingrédients rares'
  },
  {
    id: 'dragon_fruit_supreme_recipe',
    result: { item: 'dragon_fruit_supreme', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'strawberry', quantity: 300, type: 'harvest' },
      { item: 'watermelon', quantity: 100, type: 'harvest' },
      { item: 'crystal_berry', quantity: 80, type: 'harvest' },
      { item: 'coins', quantity: 40000 }
    ],
    unlockRequirement: { lifetimeCoins: 500000 },
    category: 'epic',
    description: 'Invoque le pouvoir des dragons dans un fruit'
  },
  {
    id: 'thunder_pepper_recipe',
    result: { item: 'thunder_pepper', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'carrot', quantity: 250, type: 'harvest' },
      { item: 'corn', quantity: 150, type: 'harvest' },
      { item: 'moon_carrot', quantity: 60, type: 'harvest' },
      { item: 'coins', quantity: 35000 }
    ],
    unlockRequirement: { lifetimeCoins: 400000 },
    category: 'epic',
    description: 'Charge un poivron avec l\'électricité de l\'orage'
  },

  // Recettes LEGENDARY
  {
    id: 'star_blossom_recipe',
    result: { item: 'star_blossom', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'rainbow_rose', quantity: 50, type: 'harvest' },
      { item: 'golden_wheat', quantity: 200, type: 'harvest' },
      { item: 'crystal_berry', quantity: 150, type: 'harvest' },
      { item: 'coins', quantity: 100000 }
    ],
    unlockRequirement: { lifetimeCoins: 1000000 },
    category: 'legendary',
    description: 'Capture l\'essence des étoiles dans une fleur'
  },
  {
    id: 'eternal_tree_recipe',
    result: { item: 'eternal_tree', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'pumpkin', quantity: 500, type: 'harvest' },
      { item: 'dragon_fruit_supreme', quantity: 100, type: 'harvest' },
      { item: 'rainbow_rose', quantity: 100, type: 'harvest' },
      { item: 'thunder_pepper', quantity: 80, type: 'harvest' },
      { item: 'coins', quantity: 150000 }
    ],
    unlockRequirement: { lifetimeCoins: 2000000 },
    category: 'legendary',
    description: 'Plante un arbre qui vivra pour l\'éternité'
  },
  {
    id: 'void_melon_recipe',
    result: { item: 'void_melon', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'watermelon', quantity: 400, type: 'harvest' },
      { item: 'dragon_fruit_supreme', quantity: 80, type: 'harvest' },
      { item: 'thunder_pepper', quantity: 60, type: 'harvest' },
      { item: 'coins', quantity: 120000 }
    ],
    unlockRequirement: { lifetimeCoins: 1500000 },
    category: 'legendary',
    description: 'Infuse un melon avec le pouvoir du vide'
  },

  // Recettes MYTHIC
  {
    id: 'galaxy_orchid_recipe',
    result: { item: 'galaxy_orchid', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'star_blossom', quantity: 100, type: 'harvest' },
      { item: 'rainbow_rose', quantity: 200, type: 'harvest' },
      { item: 'eternal_tree', quantity: 50, type: 'harvest' },
      { item: 'coins', quantity: 300000 }
    ],
    unlockRequirement: { lifetimeCoins: 5000000 },
    category: 'mythic',
    description: 'Crée une orchidée contenant une galaxie miniature'
  },
  {
    id: 'phoenix_apple_recipe',
    result: { item: 'phoenix_apple', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'void_melon', quantity: 150, type: 'harvest' },
      { item: 'dragon_fruit_supreme', quantity: 200, type: 'harvest' },
      { item: 'star_blossom', quantity: 120, type: 'harvest' },
      { item: 'coins', quantity: 400000 }
    ],
    unlockRequirement: { lifetimeCoins: 7000000 },
    category: 'mythic',
    description: 'Forge une pomme avec l\'essence du phoenix'
  },

  // Recette DIVINE
  {
    id: 'genesis_seed_recipe',
    result: { item: 'genesis_seed', quantity: 1, type: 'seed' },
    ingredients: [
      { item: 'galaxy_orchid', quantity: 100, type: 'harvest' },
      { item: 'phoenix_apple', quantity: 100, type: 'harvest' },
      { item: 'eternal_tree', quantity: 200, type: 'harvest' },
      { item: 'star_blossom', quantity: 300, type: 'harvest' },
      { item: 'coins', quantity: 1000000 }
    ],
    unlockRequirement: { lifetimeCoins: 15000000 },
    category: 'divine',
    description: 'La création ultime : la graine qui a tout commencé'
  }
];

// ============================================
// INVENTORY STATE EXTENSION
// ============================================

// Fonction d'initialisation à appeler après le chargement de state
function initializeInventorySystem() {
  // Inventaire des récoltes (harvests stockées)
  if (!state.inventory) {
    state.inventory = {
      harvests: {}, // { plantId: quantity }
      craftingMaterials: {}
    };
  }

  // S'assurer que harvests existe
  if (!state.inventory.harvests) {
    state.inventory.harvests = {};
  }

  // Débloquer recettes de base
  if (!state.unlockedRecipes) {
    state.unlockedRecipes = [];
  }

  console.log('✅ Inventory system initialized', state.inventory);
}

// ============================================
// INVENTORY FUNCTIONS
// ============================================

function addHarvestToInventory(plantId, quantity = 1) {
  if (!state.inventory.harvests[plantId]) {
    state.inventory.harvests[plantId] = 0;
  }
  state.inventory.harvests[plantId] += quantity;
  saveGame();
}

function getHarvestCount(plantId) {
  return state.inventory.harvests[plantId] || 0;
}

function hasEnoughHarvests(plantId, quantity) {
  return getHarvestCount(plantId) >= quantity;
}

function removeHarvests(plantId, quantity) {
  if (!hasEnoughHarvests(plantId, quantity)) return false;
  state.inventory.harvests[plantId] -= quantity;
  if (state.inventory.harvests[plantId] <= 0) {
    delete state.inventory.harvests[plantId];
  }
  saveGame();
  return true;
}

// ============================================
// CRAFTING FUNCTIONS
// ============================================

function canCraftRecipe(recipe) {
  // Vérifier les requirements
  if (recipe.unlockRequirement) {
    if (recipe.unlockRequirement.lifetimeCoins && state.lifetimeCoins < recipe.unlockRequirement.lifetimeCoins) {
      return { canCraft: false, reason: `Nécessite ${recipe.unlockRequirement.lifetimeCoins} lifetime coins` };
    }
  }

  // Vérifier les ingrédients
  for (const ingredient of recipe.ingredients) {
    if (ingredient.item === 'coins') {
      if (state.coins < ingredient.quantity) {
        return { canCraft: false, reason: `Pas assez de coins (${ingredient.quantity} requis)` };
      }
    } else if (ingredient.type === 'harvest') {
      if (!hasEnoughHarvests(ingredient.item, ingredient.quantity)) {
        const plantName = getPlantById(ingredient.item)?.name || ingredient.item;
        return { canCraft: false, reason: `Pas assez de ${plantName} (${ingredient.quantity} requis)` };
      }
    } else if (ingredient.type === 'seed') {
      const seedCount = state.seeds[ingredient.item] || 0;
      if (seedCount < ingredient.quantity) {
        const plantName = getPlantById(ingredient.item)?.name || ingredient.item;
        return { canCraft: false, reason: `Pas assez de graines de ${plantName} (${ingredient.quantity} requis)` };
      }
    }
  }

  return { canCraft: true };
}

function craftRecipe(recipeId) {
  const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
  if (!recipe) {
    showToast('❌ Recette introuvable');
    return false;
  }

  const canCraft = canCraftRecipe(recipe);
  if (!canCraft.canCraft) {
    showToast(`❌ ${canCraft.reason}`);
    return false;
  }

  // Consommer les ingrédients
  for (const ingredient of recipe.ingredients) {
    if (ingredient.item === 'coins') {
      state.coins -= ingredient.quantity;
    } else if (ingredient.type === 'harvest') {
      removeHarvests(ingredient.item, ingredient.quantity);
    } else if (ingredient.type === 'seed') {
      state.seeds[ingredient.item] = (state.seeds[ingredient.item] || 0) - ingredient.quantity;
      if (state.seeds[ingredient.item] <= 0) {
        delete state.seeds[ingredient.item];
      }
    }
  }

  // Donner le résultat
  const result = recipe.result;
  if (result.type === 'seed') {
    state.seeds[result.item] = (state.seeds[result.item] || 0) + result.quantity;
  } else if (result.type === 'harvest') {
    addHarvestToInventory(result.item, result.quantity);
  }

  // Débloquer la recette si pas déjà fait
  if (!state.unlockedRecipes.includes(recipeId)) {
    state.unlockedRecipes.push(recipeId);
  }

  const plant = getAllPlants().find(p => p.id === result.item);
  const rarityTier = RARITY_LEVELS[plant?.rarityTier?.toUpperCase()] || RARITY_LEVELS.COMMON;

  showToast(`✨ Crafté: ${result.quantity}x ${plant?.name || result.item} ${rarityTier.emoji}`, 'legendary');
  saveGame();
  needsRender = true;
  return true;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllPlants() {
  return [...PLANTS, ...RARE_PLANTS];
}

function getPlantById(plantId) {
  return getAllPlants().find(p => p.id === plantId);
}

function getPlantRarity(plant) {
  if (!plant) return RARITY_LEVELS.COMMON;
  if (!plant.rarityTier) return RARITY_LEVELS.COMMON;
  if (typeof plant.rarityTier !== 'string') return RARITY_LEVELS.COMMON;

  const rarityTierKey = plant.rarityTier.toUpperCase();
  return RARITY_LEVELS[rarityTierKey] || RARITY_LEVELS.COMMON;
}

function getAvailableRecipes() {
  return CRAFTING_RECIPES.filter(recipe => {
    if (!recipe.unlockRequirement) return true;
    if (recipe.unlockRequirement.lifetimeCoins) {
      return state.lifetimeCoins >= recipe.unlockRequirement.lifetimeCoins;
    }
    return true;
  });
}

console.log('✅ Inventory & Crafting System loaded');
