/* ============================================
   EMPLOYEES IN SHOP
   Afficher les employés dans le shop
   ============================================ */

function renderEmployeesInShop() {
  const container = document.getElementById('shop-employees');
  if (!container) return;

  if (!state.employees || !state.employees.hired) {
    state.employees = {
      hired: {},
      totalHired: 0,
      totalActions: 0
    };
  }

  container.innerHTML = Object.values(EMPLOYEE_TYPES).map(empType => {
    const employee = state.employees.hired[empType.id];
    const level = employee ? employee.level : 0;
    const isHired = level > 0;
    // Calculer le coût: baseCost * (costMultiplier ^ level)
    const cost = Math.floor(empType.baseCost * Math.pow(empType.costMultiplier, level));
    const canAfford = state.coins >= cost;
    const isMaxLevel = level >= empType.maxLevel;

    // Vérifier si débloqué
    const isUnlocked = !empType.unlockRequirement ||
                       (empType.unlockRequirement.lifetimeCoins &&
                        state.lifetimeCoins >= empType.unlockRequirement.lifetimeCoins);

    if (!isUnlocked) {
      return `
        <div class="shop-item employee-shop-item" style="opacity: 0.5;">
          <div class="employee-shop-icon">🔒</div>
          <div class="employee-shop-info">
            <div class="employee-shop-name">${empType.name}</div>
            <div class="employee-shop-description">Débloquer: ${empType.unlockRequirement.lifetimeCoins.toLocaleString()} coins au total</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="shop-item employee-shop-item ${!canAfford ? 'too-expensive' : ''}">
        <div class="employee-shop-icon">${empType.name.split(' ')[0]}</div>
        <div class="employee-shop-info">
          <div class="employee-shop-name">${empType.name.split(' ').slice(1).join(' ')}</div>
          <div class="employee-shop-description">${empType.description}</div>
          ${isHired ? `
            <div class="employee-shop-level">Niveau ${level}/${empType.maxLevel}</div>
            <div class="employee-shop-cooldown">⏱️ ${(empType.cooldown / 1000).toFixed(0)}s</div>
          ` : `
            <div class="employee-shop-stats">
              ${empType.stats.plantsPerAction ? `<span>🌱 ${empType.stats.plantsPerAction} plantes</span>` : ''}
              ${empType.stats.harvestsPerAction ? `<span>✂️ ${empType.stats.harvestsPerAction} récoltes</span>` : ''}
              ${empType.stats.waterAmount ? `<span>💧 ${empType.stats.waterAmount} parcelles</span>` : ''}
            </div>
          `}
        </div>
        <button
          class="buy-employee-btn ${!canAfford || isMaxLevel ? 'disabled' : ''}"
          data-employee-id="${empType.id}"
          ${!canAfford || isMaxLevel ? 'disabled' : ''}
        >
          ${isMaxLevel ? '⭐ Max' : (isHired ? `⬆️ ${cost} 💰` : `🔓 ${cost} 💰`)}
        </button>
      </div>
    `;
  }).join('');
}

// Event listener pour acheter/améliorer employés
document.addEventListener('DOMContentLoaded', () => {
  const shopEmployees = document.getElementById('shop-employees');
  if (shopEmployees) {
    shopEmployees.addEventListener('click', (e) => {
      const btn = e.target.closest('.buy-employee-btn');
      if (btn && !btn.disabled) {
        const employeeId = btn.dataset.employeeId;

        if (hireEmployee(employeeId)) {
          needsShopRender = true;
          renderEmployees();
          renderStats();
        }
      }
    });
  }
});

console.log('✅ Employees shop loaded');
