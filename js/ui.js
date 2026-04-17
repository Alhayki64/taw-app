/* =============================================
   TAW — UI HELPERS
   ============================================= */

// ── Empty & Error States ──
function renderEmptyState(container, { icon, title, text, ctaLabel, ctaAction } = {}) {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon"><span class="material-icons-round">${icon || 'info'}</span></div>
      ${title ? `<div class="empty-state-title">${title}</div>` : ''}
      ${text ? `<div class="empty-state-text">${text}</div>` : ''}
      ${ctaLabel ? `<button class="empty-state-cta" onclick="${ctaAction || ''}">${ctaLabel}</button>` : ''}
    </div>`;
}

function renderErrorState(container, { retryFn, text } = {}) {
  if (!container) return;
  container.innerHTML = `
    <div class="error-state">
      <span class="material-icons-round error-state-icon">cloud_off</span>
      <div class="error-state-text">${text || 'Something went wrong'}</div>
      ${retryFn ? `<button class="error-state-retry" onclick="${retryFn}">Retry</button>` : ''}
    </div>`;
}

// ── Focus Trap (for accessible modals) ──
let _focusTrapCleanup = null;
let _focusReturnEl = null;

function trapFocus(modalEl) {
  _focusReturnEl = document.activeElement;
  const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  modalEl.addEventListener('keydown', handleTab);
  _focusTrapCleanup = () => modalEl.removeEventListener('keydown', handleTab);
}

function releaseFocus() {
  if (_focusTrapCleanup) { _focusTrapCleanup(); _focusTrapCleanup = null; }
  if (_focusReturnEl) { _focusReturnEl.focus({ preventScroll: true }); _focusReturnEl = null; }
}

// ── Dark Mode ──
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('taw-dark-mode', isDark);
  updateDarkModeIcons(isDark);
}

function updateDarkModeIcons(isDark) {
  document.querySelectorAll('.dark-mode-toggle .material-icons-round').forEach(icon => {
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  });
  document.querySelectorAll('.switch-checkbox').forEach(sw => {
    sw.checked = isDark;
  });
}

// ── Language Dropdown ──
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  dropdown.querySelector('.lang-dropdown-menu').classList.toggle('show');
}

document.addEventListener('click', (e) => {
  document.querySelectorAll('.lang-selector-container').forEach(container => {
    if (!container.contains(e.target)) {
      const menu = container.querySelector('.lang-dropdown-menu');
      if (menu) menu.classList.remove('show');
    }
  });
});

function selectLanguage(lang) {
  if (window.applyLanguage) {
    window.applyLanguage(lang);
    localStorage.setItem('taw-lang', lang);
  }
  document.querySelectorAll('.lang-dropdown-menu').forEach(menu => menu.classList.remove('show'));
  syncLandingLangToggle(lang);
}

function switchLandingLang(lang) {
  selectLanguage(lang);
}

function syncLandingLangToggle(lang) {
  document.querySelectorAll('.landing-lang-option').forEach(btn => {
    const isEn = btn.textContent.trim() === 'EN';
    btn.classList.toggle('active', (lang === 'en' && isEn) || (lang === 'ar' && !isEn));
  });
}

// ── Opportunity Carousel — drag-to-scroll with momentum ──
const carousel = document.getElementById('opportunities-carousel');
if (carousel) {
  let isDragging = false, startX, scrollStart, lastX, lastTime, velocity = 0, momentumId = null;

  carousel.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    scrollStart = carousel.scrollLeft;
    lastX = e.clientX;
    lastTime = Date.now();
    velocity = 0;
    if (momentumId) { cancelAnimationFrame(momentumId); momentumId = null; }
    carousel.setPointerCapture(e.pointerId);
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) velocity = (lastX - e.clientX) / dt;
    lastX = e.clientX;
    lastTime = now;
    carousel.scrollLeft = scrollStart - (e.clientX - startX);
  });

  function applyMomentum() {
    if (Math.abs(velocity) < 0.05) { velocity = 0; return; }
    carousel.scrollLeft += velocity * 16;
    velocity *= 0.93;
    momentumId = requestAnimationFrame(applyMomentum);
  }

  carousel.addEventListener('pointerup', () => {
    isDragging = false;
    carousel.style.cursor = '';
    momentumId = requestAnimationFrame(applyMomentum);
  });

  carousel.addEventListener('pointercancel', () => {
    isDragging = false;
    velocity = 0;
    carousel.style.cursor = '';
  });
}

// ── Points Card hover shimmer ──
const pointsCard = document.querySelector('.points-card');
if (pointsCard) {
  pointsCard.addEventListener('mouseenter', () => {
    pointsCard.style.background = 'linear-gradient(135deg, #004a38 0%, #0f7a5e 50%, #005440 100%)';
  });
  pointsCard.addEventListener('mouseleave', () => {
    pointsCard.style.background = '';
  });
}
