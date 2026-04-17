/* =============================================
   TAW — ROUTER
   ============================================= */

const pageMap = {
  'landing':          'page-landing',
  'auth':             'page-auth',
  'interests':        'page-interests',
  'notifications':    'page-notifications',
  'notif-permission': 'page-notif-permission',
  'home':             'page-home',
  'volunteer-map':    'page-volunteer-map',
  'event-details':    'page-event-details',
  'checkin-success':  'page-checkin-success',
  'marketplace':      'page-marketplace',
  'profile':          'page-profile',
  'edit-profile':     'page-edit-profile',
  'reward-details':   'page-reward-details',
  'reward-redeemed':  'page-reward-redeemed',
  'partner-detail':   'page-partner-detail'
};

const navMap = {
  'home':        'nav-home',
  'marketplace': 'nav-marketplace',
  'profile':     'nav-profile'
};

const subPages = new Set([
  'landing', 'auth', 'interests', 'notifications', 'notif-permission',
  'edit-profile', 'event-details', 'checkin-success', 'volunteer-map',
  'reward-details', 'reward-redeemed', 'partner-detail'
]);

const protectedPages = new Set([
  'checkin-success', 'profile', 'reward-redeemed', 'notifications', 'edit-profile'
]);

let currentPage = 'landing';
let pageHistory = ['landing'];

function navigateTo(pageName) {
  if (pageName === currentPage) return;

  if (!document.body.dataset.direction) document.body.dataset.direction = 'forward';

  // Route guard
  if (protectedPages.has(pageName)) {
    if (!authState.session) { navigateTo('auth'); return; }
    const isVerified = authState.user && (authState.user.email_confirmed_at || authState.user.phone_confirmed_at);
    if (!isVerified) { navigateTo('auth'); return; }
  }

  const oldPageEl = document.getElementById(pageMap[currentPage]);
  const newPageEl = document.getElementById(pageMap[pageName]);
  const bottomNav = document.getElementById('bottom-nav');

  if (!newPageEl) return;

  if (oldPageEl) {
    oldPageEl.classList.remove('active');
    oldPageEl.classList.add('exiting');
    setTimeout(() => {
      oldPageEl.classList.remove('exiting');
      oldPageEl.scrollTop = 0;
      delete document.body.dataset.direction;
    }, 350);
  }

  newPageEl.classList.add('active');

  if (subPages.has(pageName)) {
    bottomNav.classList.add('hidden');
  } else {
    bottomNav.classList.remove('hidden');
  }

  const balanceBar = document.getElementById('marketplace-balance-bar');
  if (balanceBar) balanceBar.style.display = pageName === 'marketplace' ? 'block' : 'none';

  updateNavActive(pageName);

  if (pageName !== currentPage) pageHistory.push(pageName);
  currentPage = pageName;

  // Page-specific init hooks
  if (pageName === 'notif-permission') initNotifPermStories();
  if (pageName === 'edit-profile') initEditProfile();

  setTimeout(() => {
    const heading = newPageEl.querySelector('h1, h2, [autofocus]');
    if (heading) heading.focus({ preventScroll: true });
  }, 360);
}

function goBack() {
  document.body.dataset.direction = 'back';
  pageHistory.pop();
  const prev = pageHistory[pageHistory.length - 1] || 'home';
  navigateTo(prev);
}

function updateNavActive(pageName) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });
  const activeNavId = navMap[pageName];
  if (activeNavId) {
    const activeBtn = document.getElementById(activeNavId);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-current', 'page');
    }
  }
}
