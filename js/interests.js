/* =============================================
   TAW — INTERESTS ONBOARDING
   ============================================= */

function toggleInterest(chipEl) {
  chipEl.classList.toggle('active');
}

window.submitInterests = async function() {
  const nextBtn = document.querySelector('.btn-onboarding-next');
  let originalHtml = '';
  if (nextBtn) {
    originalHtml = nextBtn.innerHTML;
    nextBtn.innerHTML = '<span class="material-icons-round spinning">refresh</span>';
    nextBtn.disabled = true;
  }

  try {
    const activeChips = document.querySelectorAll('.interest-chip.active');
    const interests = Array.from(activeChips).map(chip => {
      const textSpan = chip.querySelector('span[data-i18n]');
      if (textSpan) return textSpan.textContent.trim();
      return chip.textContent.replace('check_circle', '').trim();
    });

    if (typeof saveUserInterests === 'function') {
      await saveUserInterests(interests);
    }
  } catch (err) {
    console.error('Failed to save interests:', err);
  } finally {
    if (nextBtn) {
      nextBtn.innerHTML = originalHtml;
      nextBtn.disabled = false;
    }
  }

  navigateTo('notif-permission');
};
