/* ============================================
   EMPLOYEES UI
   Interface utilisateur pour gérer les employés
   ============================================ */

// ============================================
// MODAL MANAGEMENT
// ============================================

function openEmployeesModal() {
  document.getElementById('employees-modal').classList.add('show');
  renderEmployees();
}

function closeEmployeesModal() {
  document.getElementById('employees-modal').classList.remove('show');
}

// ============================================
// EMPLOYEES RENDERING
// ============================================

function renderEmployees() {
  renderAvailableEmployees();
  renderHiredEmployees();
}

function renderAvailableEmployees() {
  const container = document.getElementById('available-employees');
  if (!container) return;

  const availableTypes = Object.values(EMPLOYEE_TYPES)
    .filter(empType => {
      // Vérifier si débloqué
      if (!state.employees.unlocked.includes(empType.id)) {
        // Afficher si proche du déblocage
        const req = empType.unlockRequirement;
        if (req.lifetimeCoins && state.lifetimeCoins >= req.lifetimeCoins * 0.8) {
          return true;
        }
        return false;
      }
      return true;
    });

  if (availableTypes.length === 0) {
    container.innerHTML = '<div class="employees-empty">Aucun employé disponible pour le moment. Continuez à jouer pour débloquer!</div>';
    return;
  }

  container.innerHTML = availableTypes.map(empType => {
    const isUnlocked = state.employees.unlocked.includes(empType.id);
    const isHired = !!state.employees.hired[empType.id];
    const currentLevel = state.employees.hired[empType.id]?.level || 0;
    const cost = getEmployeeCost(empType.id);
    const canAfford = state.coins >= cost;
    const maxLevel = currentLevel >= empType.maxLevel;

    let buttonText = '🔒 Verrouillé';
    let buttonClass = 'employee-hire-btn disabled';
    let buttonDisabled = true;

    if (isUnlocked) {
      if (isHired) {
        if (maxLevel) {
          buttonText = '✨ Niveau MAX';
          buttonClass = 'employee-hire-btn max-level';
        } else {
          buttonText = `⬆️ Améliorer (${cost.toLocaleString()} 💰)`;
          buttonClass = `employee-hire-btn upgrade ${canAfford ? '' : 'disabled'}`;
          buttonDisabled = !canAfford;
        }
      } else {
        buttonText = `👷 Embaucher (${cost.toLocaleString()} 💰)`;
        buttonClass = `employee-hire-btn ${canAfford ? '' : 'disabled'}`;
        buttonDisabled = !canAfford;
      }
    } else {
      const req = empType.unlockRequirement;
      buttonText = `🔒 ${req.lifetimeCoins.toLocaleString()} lifetime coins requis`;
    }

    // Stats display
    const statsHtml = Object.entries(empType.stats)
      .map(([key, value]) => {
        let statName = key;
        let statValue = value;
        let suffix = '';

        switch (key) {
          case 'plantsPerAction':
            statName = 'Plantes/action';
            if (isHired) statValue = value + Math.floor(currentLevel / 3);
            break;
          case 'harvestsPerAction':
            statName = 'Récoltes/action';
            if (isHired) statValue = value + Math.floor(currentLevel / 2);
            break;
          case 'seedsPerAction':
            statName = 'Graines/action';
            if (isHired) statValue = value + Math.floor(currentLevel / 2);
            break;
          case 'coinsPerAction':
            statName = 'Coins/action';
            if (isHired) statValue = Math.floor(value * (1 + empType.stats.multiplier * currentLevel) * currentLevel);
            break;
          case 'bonusYield':
            statName = 'Bonus rendement';
            if (isHired) statValue = value * currentLevel;
            statValue = `+${(statValue * 100).toFixed(0)}`;
            suffix = '%';
            break;
          case 'globalYieldBonus':
            statName = 'Bonus rendement global';
            if (isHired) statValue = value * currentLevel;
            statValue = `+${(statValue * 100).toFixed(0)}`;
            suffix = '%';
            break;
          case 'globalSpeedBonus':
            statName = 'Bonus vitesse globale';
            if (isHired) statValue = value * currentLevel;
            statValue = `+${(statValue * 100).toFixed(0)}`;
            suffix = '%';
            break;
          case 'rarityBonus':
            statName = 'Bonus rareté';
            if (isHired) statValue = currentLevel * 0.05;
            statValue = `+${(statValue * 100).toFixed(0)}`;
            suffix = '%';
            break;
          case 'speedBonus':
            statName = 'Bonus vitesse';
            if (isHired) statValue = value * currentLevel;
            statValue = `+${(statValue * 100).toFixed(0)}`;
            suffix = '%';
            break;
          case 'multiplier':
            return '';
          default:
            statName = key;
        }

        return `<div class="employee-stat"><span>${statName}:</span> <strong>${statValue}${suffix}</strong></div>`;
      })
      .filter(s => s)
      .join('');

    const cooldownSeconds = (empType.cooldown / 1000).toFixed(0);

    return `
      <div class="employee-card ${isUnlocked ? '' : 'locked'}">
        <div class="employee-header">
          <div class="employee-icon">${empType.name.split(' ')[0]}</div>
          <div class="employee-info">
            <h3>${empType.name.split(' ').slice(1).join(' ')}</h3>
            ${isHired ? `<div class="employee-level">Niveau ${currentLevel}/${empType.maxLevel}</div>` : ''}
          </div>
        </div>

        <div class="employee-description">${empType.description}</div>

        <div class="employee-stats">
          ${statsHtml}
          <div class="employee-stat"><span>Cooldown:</span> <strong>${cooldownSeconds}s</strong></div>
        </div>

        <button
          class="${buttonClass}"
          data-employee-id="${empType.id}"
          ${buttonDisabled ? 'disabled' : ''}
        >
          ${buttonText}
        </button>
      </div>
    `;
  }).join('');
}

function renderHiredEmployees() {
  const container = document.getElementById('hired-employees');
  if (!container) return;

  const hiredEmployees = Object.entries(state.employees.hired);

  if (hiredEmployees.length === 0) {
    container.innerHTML = '<div class="employees-empty">Vous n\'avez embauché aucun employé pour le moment.</div>';
    return;
  }

  container.innerHTML = hiredEmployees.map(([employeeId, employee]) => {
    const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];
    if (!empType) return '';

    const now = Date.now();
    const timeSinceLastAction = now - (employee.lastAction || 0);
    const cooldownProgress = Math.min((timeSinceLastAction / empType.cooldown) * 100, 100);
    const timeUntilNext = Math.max(0, empType.cooldown - timeSinceLastAction);
    const secondsUntilNext = Math.ceil(timeUntilNext / 1000);

    const isActive = employee.active;
    const statusText = isActive ? (cooldownProgress >= 100 ? '✅ Prêt' : `⏳ ${secondsUntilNext}s`) : '⏸️ Pause';
    const statusClass = isActive ? (cooldownProgress >= 100 ? 'ready' : 'working') : 'paused';

    return `
      <div class="hired-employee-card ${statusClass}">
        <div class="hired-employee-header">
          <div class="hired-employee-icon">${empType.name.split(' ')[0]}</div>
          <div class="hired-employee-info">
            <h4>${empType.name.split(' ').slice(1).join(' ')}</h4>
            <div class="hired-employee-level">Niveau ${employee.level}</div>
          </div>
          <div class="hired-employee-status ${statusClass}">${statusText}</div>
        </div>

        <div class="hired-employee-progress">
          <div class="hired-employee-progress-bar" style="width: ${cooldownProgress}%"></div>
        </div>

        <div class="hired-employee-actions">
          <button
            class="employee-toggle-btn ${isActive ? 'active' : ''}"
            data-employee-id="${employeeId}"
            title="${isActive ? 'Mettre en pause' : 'Activer'}"
          >
            ${isActive ? '⏸️ Pause' : '▶️ Activer'}
          </button>
          <button
            class="employee-fire-btn"
            data-employee-id="${employeeId}"
            title="Virer (remboursement 50%)"
          >
            👋 Virer
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// EMPLOYEES STATUS DISPLAY (Header)
// ============================================

function renderEmployeesStatus() {
  const container = document.getElementById('employees-status');
  if (!container) return;

  const hiredCount = Object.keys(state.employees.hired).length;

  if (hiredCount === 0) {
    container.innerHTML = '';
    return;
  }

  const activeCount = Object.values(state.employees.hired).filter(e => e.active).length;

  container.innerHTML = `
    <div class="employees-status-display">
      <span class="employees-status-icon">👷</span>
      <span class="employees-status-text">${activeCount}/${hiredCount} actifs</span>
    </div>
  `;
}

// ============================================
// EVENT HANDLERS
// ============================================

// Employees tabs
document.addEventListener('click', (e) => {
  const empTab = e.target.closest('.employees-tab');
  if (empTab) {
    const tab = empTab.dataset.empTab;

    // Update active tab
    document.querySelectorAll('.employees-tab').forEach(t => t.classList.remove('active'));
    empTab.classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.employees-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`employees-${tab}`).classList.add('active');
  }
});

// Embaucher/Améliorer employé
document.addEventListener('click', (e) => {
  const hireBtn = e.target.closest('.employee-hire-btn');
  if (hireBtn && !hireBtn.disabled && !hireBtn.classList.contains('max-level')) {
    const employeeId = hireBtn.dataset.employeeId;
    if (hireEmployee(employeeId)) {
      renderEmployees();
      renderEmployeesStatus();
      renderStats();
    }
  }
});

// Activer/désactiver employé
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('.employee-toggle-btn');
  if (toggleBtn) {
    const employeeId = toggleBtn.dataset.employeeId;
    toggleEmployee(employeeId);
    renderEmployees();
    renderEmployeesStatus();
  }
});

// Virer employé
document.addEventListener('click', (e) => {
  const fireBtn = e.target.closest('.employee-fire-btn');
  if (fireBtn) {
    const employeeId = fireBtn.dataset.employeeId;
    const empType = EMPLOYEE_TYPES[employeeId.toUpperCase()];

    if (confirm(`Êtes-vous sûr de vouloir virer ${empType.name} ? Vous récupérerez 50% du coût investi.`)) {
      fireEmployee(employeeId);
      renderEmployees();
      renderEmployeesStatus();
      renderStats();
    }
  }
});

// Modal open/close buttons
document.getElementById('employees-btn')?.addEventListener('click', openEmployeesModal);
document.getElementById('close-employees')?.addEventListener('click', closeEmployeesModal);

// Close modal on background click
document.getElementById('employees-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'employees-modal') closeEmployeesModal();
});

// Mettre à jour l'UI des employés actifs toutes les secondes
setInterval(() => {
  if (document.getElementById('employees-modal').classList.contains('show')) {
    renderHiredEmployees();
  }
  renderEmployeesStatus();
}, 1000);

console.log('✅ Employees UI loaded');
