/* ============================================
   ADMIN PANEL CONTROLS
   Contrôles du panneau d'administration
   ============================================ */

// Toggle admin panel visibility
document.getElementById('admin-toggle')?.addEventListener('click', () => {
  const panel = document.getElementById('admin-panel');
  const btn = document.getElementById('admin-toggle');

  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    btn.textContent = 'Hide';
  } else {
    panel.classList.add('hidden');
    btn.textContent = 'Show';
  }
});

// Add 1000 coins
document.getElementById('admin-add-1k')?.addEventListener('click', () => {
  if (typeof state !== 'undefined' && typeof addCoins === 'function') {
    addCoins(1000);
    if (typeof showToast === 'function') {
      showToast('💰 +1000 coins', 'success');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Remove 1000 coins
document.getElementById('admin-sub-1k')?.addEventListener('click', () => {
  if (typeof state !== 'undefined') {
    state.coins = Math.max(0, state.coins - 1000);
    if (typeof showToast === 'function') {
      showToast('💰 -1000 coins', 'info');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Add 50 seeds to all plants
document.getElementById('admin-add-seeds')?.addEventListener('click', () => {
  if (typeof state !== 'undefined' && typeof PLANTS !== 'undefined') {
    PLANTS.forEach(plant => {
      state.inventory[plant.id] = (state.inventory[plant.id] || 0) + 50;
    });
    if (typeof showToast === 'function') {
      showToast('🌱 +50 graines pour chaque plante', 'success');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Clear all seeds
document.getElementById('admin-clear-seeds')?.addEventListener('click', () => {
  if (typeof state !== 'undefined') {
    state.inventory = {};
    if (typeof showToast === 'function') {
      showToast('🗑️ Graines effacées', 'info');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Add 1 of each special plant
document.getElementById('admin-all-specials')?.addEventListener('click', () => {
  if (typeof state !== 'undefined' && typeof SPECIAL_PLANTS !== 'undefined') {
    SPECIAL_PLANTS.forEach(plant => {
      state.inventory[plant.id] = (state.inventory[plant.id] || 0) + 1;
    });
    if (typeof showToast === 'function') {
      showToast('✨ +1 de chaque plante spéciale', 'success');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Reset daily streak
document.getElementById('admin-reset-streak')?.addEventListener('click', () => {
  if (typeof state !== 'undefined' && state.dailyCalendar) {
    state.dailyCalendar.streak = 0;
    state.dailyCalendar.lastClaimDate = null;
    if (typeof showToast === 'function') {
      showToast('🔄 Streak réinitialisée', 'info');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
    if (typeof needsCalendarRender !== 'undefined') needsCalendarRender = true;
  }
});

// Next season
document.getElementById('admin-next-season')?.addEventListener('click', () => {
  if (typeof nextSeason === 'function') {
    nextSeason();
    if (typeof showToast === 'function') {
      showToast('🍂 Saison suivante', 'info');
    }
  }
});

// Next weather
document.getElementById('admin-next-weather')?.addEventListener('click', () => {
  if (typeof nextWeather === 'function') {
    nextWeather();
    if (typeof showToast === 'function') {
      showToast('🌤️ Météo suivante', 'info');
    }
  }
});

// Harvest all ready plants
document.getElementById('admin-force-harvest')?.addEventListener('click', () => {
  if (typeof state !== 'undefined' && state.garden && state.garden.plots) {
    let harvested = 0;
    state.garden.plots.forEach((plot, idx) => {
      if (plot.plantId && plot.growthProgress >= 1 && typeof harvestPlot === 'function') {
        if (harvestPlot(idx)) {
          harvested++;
        }
      }
    });
    if (typeof showToast === 'function') {
      showToast(`🌾 ${harvested} plantes récoltées`, 'success');
    }
    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Force legendary event
document.getElementById('admin-force-legendary')?.addEventListener('click', () => {
  if (typeof forceLegendaryEvent === 'function') {
    forceLegendaryEvent();
    if (typeof showToast === 'function') {
      showToast('✨ Événement légendaire forcé!', 'legendary');
    }
  }
});

// Force Night
document.getElementById('admin-force-night')?.addEventListener('click', () => {
  if (typeof dayNightState !== 'undefined') {
    dayNightState.current = 'night';
    dayNightState.cycleStart = Date.now();
    dayNightState.nextTransition = Date.now() + (typeof DAY_NIGHT_CONFIG !== 'undefined' ? DAY_NIGHT_CONFIG.nightDuration : 720000);

    if (typeof applyDayNightTheme === 'function') {
      applyDayNightTheme();
    }

    if (typeof showToast === 'function') {
      showToast('🌙 Nuit forcée', 'info');
    }

    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

// Force Day
document.getElementById('admin-force-day')?.addEventListener('click', () => {
  if (typeof dayNightState !== 'undefined') {
    dayNightState.current = 'day';
    dayNightState.cycleStart = Date.now();
    dayNightState.nextTransition = Date.now() + (typeof DAY_NIGHT_CONFIG !== 'undefined' ? DAY_NIGHT_CONFIG.dayDuration : 720000);

    if (typeof applyDayNightTheme === 'function') {
      applyDayNightTheme();
    }

    if (typeof showToast === 'function') {
      showToast('☀️ Jour forcé', 'info');
    }

    if (typeof needsRender !== 'undefined') needsRender = true;
  }
});

console.log('✅ Admin controls loaded');
