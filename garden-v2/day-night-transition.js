/* ============================================
   DAY/NIGHT TRANSITION ANIMATIONS
   Animations visuelles pour les transitions
   ============================================ */

// Améliorer la fonction transitionCycle
if (typeof window.transitionCycle === 'function') {
  const originalTransitionCycle = window.transitionCycle;
  window.transitionCycle = function() {
    const now = Date.now();

    if (dayNightState.current === 'day') {
      dayNightState.current = 'dusk';

      // Animation de transition vers la nuit
      showTransitionAnimation('🌙', 'La Nuit Tombe', '#34495e');

      setTimeout(() => {
        dayNightState.current = 'night';
        dayNightState.cycleStart = Date.now();
        dayNightState.nextTransition = Date.now() + DAY_NIGHT_CONFIG.nightDuration;
        if (typeof showToast === 'function') {
          showToast('🌙 La nuit tombe... Les plantes nocturnes s\'éveillent!', 'info');
        }
        if (typeof needsRender !== 'undefined') needsRender = true;
      }, DAY_NIGHT_CONFIG.transitionDuration);

      if (typeof showToast === 'function') {
        showToast('🌆 Le crépuscule approche...', 'info');
      }
    } else if (dayNightState.current === 'night') {
      dayNightState.current = 'dawn';

      // Animation de transition vers le jour
      showTransitionAnimation('☀️', 'Le Jour Se Lève', '#f39c12');

      setTimeout(() => {
        dayNightState.current = 'day';
        dayNightState.cycleStart = Date.now();
        dayNightState.nextTransition = Date.now() + DAY_NIGHT_CONFIG.dayDuration;
        if (typeof showToast === 'function') {
          showToast('☀️ Le jour se lève! Les plantes nocturnes se reposent.', 'info');
        }
        if (typeof needsRender !== 'undefined') needsRender = true;
      }, DAY_NIGHT_CONFIG.transitionDuration);

      if (typeof showToast === 'function') {
        showToast('🌅 L\'aube se lève...', 'info');
      }
    }

    if (typeof needsRender !== 'undefined') needsRender = true;
  };
}

// Animation de transition jour/nuit avec overlay
function showTransitionAnimation(icon, text, color) {
  const overlay = document.createElement('div');
  overlay.className = 'day-night-transition-overlay';
  overlay.innerHTML = `
    <div class="transition-content">
      <div class="transition-icon" style="color: ${color}">${icon}</div>
      <div class="transition-text" style="color: ${color}">${text}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Fade in
  setTimeout(() => overlay.classList.add('show'), 10);

  // Fade out après 3 secondes (transition courte)
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 1000);
  }, 3000);
}

console.log('✅ Day/Night Transitions loaded');
console.log('transitionCycle function:', typeof window.transitionCycle);

// Fonction de test pour forcer une transition (pour debug)
window.testTransition = function() {
  showTransitionAnimation('🌙', 'Test Transition', '#34495e');
};

// Désactiver le test automatique
// setTimeout(() => {
//   console.log('Testing transition animation...');
//   showTransitionAnimation('☀️', 'Test de Transition', '#f39c12');
// }, 2000);
