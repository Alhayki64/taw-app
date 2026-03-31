/* =============================================
   TAW (طوع) — APP ROUTER & INTERACTIONS
   ============================================= */

// ── Navigation State ──
const pageMap = {
  'landing':          'page-landing',
  'interests':        'page-interests',
  'notifications':    'page-notifications',
  'home':             'page-home',
  'discover':         'page-discover',
  'volunteer-map':    'page-volunteer-map',
  'event-details':    'page-event-details',
  'checkin-success':  'page-checkin-success',
  'marketplace':      'page-marketplace',
  'profile':          'page-profile',
  'reward-details':   'page-reward-details',
  'reward-redeemed':  'page-reward-redeemed'
};

const navMap = {
  'home':        'nav-home',
  'discover':    'nav-discover',
  'marketplace': 'nav-marketplace',
  'profile':     'nav-profile',
};

// Pages that should hide the bottom nav
const subPages = new Set(['landing', 'interests', 'notifications', 'event-details', 'checkin-success', 'volunteer-map', 'reward-details', 'reward-redeemed']);

let currentPage = 'landing';
let pageHistory = ['landing'];

// ── Navigate To Page ──
function navigateTo(pageName) {
  if (pageName === currentPage) return;

  const oldPageEl = document.getElementById(pageMap[currentPage]);
  const newPageEl = document.getElementById(pageMap[pageName]);
  const bottomNav = document.getElementById('bottom-nav');

  if (!newPageEl) return;

  // Exit old page
  if (oldPageEl) {
    oldPageEl.classList.remove('active');
    oldPageEl.classList.add('exiting');
    setTimeout(() => {
      oldPageEl.classList.remove('exiting');
      oldPageEl.scrollTop = 0;
    }, 350);
  }

  // Enter new page
  newPageEl.classList.add('active');

  // Handle bottom nav visibility
  if (subPages.has(pageName)) {
    bottomNav.classList.add('hidden');
  } else {
    bottomNav.classList.remove('hidden');
  }

  // Update nav active states
  updateNavActive(pageName);

  // Push to history
  if (pageName !== currentPage) {
    pageHistory.push(pageName);
  }

  currentPage = pageName;
}

// ── Go Back ──
function goBack() {
  pageHistory.pop(); // Remove current
  const prev = pageHistory[pageHistory.length - 1] || 'home';
  navigateTo(prev);
}

// ── Update Nav Active State ──
function updateNavActive(pageName) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeNavId = navMap[pageName];
  if (activeNavId) {
    document.getElementById(activeNavId)?.classList.add('active');
  }
}

// ── Category Filter (Marketplace) ──
function filterCategory(chipEl, category) {
  // Update chips
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');

  // Filter cards
  const cards = document.querySelectorAll('.reward-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeInUp 0.35s var(--ease-out) both';
    } else {
      card.classList.add('hidden');
    }
  });
}

// ── Toggle Interest Selection ──
function toggleInterest(chipEl) {
  chipEl.classList.toggle('active');
}

// ── Animate counters on profile page ──
function animateCounters() {
  const hoursEl = document.querySelector('#stat-hours .stat-card-value');
  const pointsEl = document.querySelector('#stat-points .stat-card-value');
  if (!hoursEl || !pointsEl) return;

  animateValue(hoursEl, 0, 125, 1200, ' hrs');
  animateValue(pointsEl, 0, 2500, 1200, '');
}

function animateValue(el, start, end, duration, suffix) {
  const startTime = performance.now();
  const format = (v) => v.toLocaleString() + suffix;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (end - start) * eased);
    el.textContent = format(current);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ── Observe page transitions for counter animation ──
const profilePage = document.getElementById('page-profile');
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    if (m.target.classList.contains('active') && m.target.id === 'page-profile') {
      setTimeout(animateCounters, 300);
    }
  });
});
if (profilePage) {
  observer.observe(profilePage, { attributes: true, attributeFilter: ['class'] });
}

// ── Points card shimmer animation ──
const pointsCard = document.querySelector('.points-card');
if (pointsCard) {
  pointsCard.addEventListener('mouseenter', () => {
    pointsCard.style.background = 'linear-gradient(135deg, #004a38 0%, #0f7a5e 50%, #005440 100%)';
  });
  pointsCard.addEventListener('mouseleave', () => {
    pointsCard.style.background = '';
  });
}

// ── Smooth horizontal scroll for carousel ──
const carousel = document.getElementById('opportunities-carousel');
if (carousel) {
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = '';
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = '';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  // Ensure landing page is active on first load
  const landingPage = document.getElementById('page-landing');
  if (landingPage) {
    landingPage.classList.add('active');
  }
  // Hide bottom nav on landing
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) bottomNav.classList.add('hidden');

  // Restore dark mode preference
  if (localStorage.getItem('taw-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcons(true);
  }
});

// ── Dark Mode Toggle ──
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('taw-dark-mode', isDark);
  updateDarkModeIcons(isDark);
}

function updateDarkModeIcons(isDark) {
  document.querySelectorAll('.dark-mode-toggle .material-icons-round').forEach(icon => {
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  });
  
  // Sync all dark mode switches
  document.querySelectorAll('.switch-checkbox').forEach(sw => {
    sw.checked = isDark;
  });
}

// ── Show map card on pin click ──
function showMapCard(index) {
  const scroll = document.getElementById('volmap-cards-scroll');
  const cards = scroll?.querySelectorAll('.volmap-event-card');
  if (!scroll || !cards || !cards[index]) return;

  // Highlight selected pin
  document.querySelectorAll('.volmap-pin').forEach((pin, i) => {
    pin.classList.toggle('active', i === index);
  });

  // Highlight selected card
  cards.forEach((card, i) => {
    card.classList.toggle('selected', i === index);
  });

  // Scroll the card into view
  cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// ── Language Dropdown Interactions ──
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  const menu = dropdown.querySelector('.lang-dropdown-menu');
  menu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  document.querySelectorAll('.lang-selector-container').forEach(container => {
    if (!container.contains(e.target)) {
      const menu = container.querySelector('.lang-dropdown-menu');
      if (menu) menu.classList.remove('show');
    }
  });
});

function selectLanguage(lang) {
  // Call existing translation logic
  if (window.applyLanguage) {
    window.applyLanguage(lang);
    localStorage.setItem('taw-lang', lang);
  }
  
  // Close all dropdowns
  document.querySelectorAll('.lang-dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
}

// ── Rewards Data ──
const rewardsData = {
  'costa': {
    category: 'Food & Drink',
    title: '50% off any beverage',
    points: 600,
    brandName: 'Costa Coffee Bahrain',
    description: 'Enjoy any beverage at 50% off when you redeem your hard-earned points. Valid for all hot and cold drinks across all Costa Coffee locations in Bahrain.',
    expires: '31/12/2026',
    usage: 'One-time Use',
    terms: [
      'One-time use only. Cannot be combined with other offers or loyalty cards.',
      'Valid until Dec 31, 2026, across all participating Costa Coffee outlets in Bahrain.',
      'Redemption is subject to availability and store operating hours.'
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFtjGjJBz4rKkpBZxWX4R69lDkfogiml87c2Vl_SzCsHeGqpDS-6b8GfbvIumqJ5PREXi5Hr6vkAbDB0n02QpHp7YAMG1wWUrrD6yrcS1FLPAnRGKvE9VMZnVpOMi6YLyk6rW0dkIdcPXvf8owJIS6BdhGXs24zYgLxHI8GanMJNervJXF9Ap-qyDWPgfwbgOEXpvvZ7LEpLkkek68fg0znlvZehGZt8QTYuPxbjDYGtzkDOPIm_NhsPMxgv45ET9kxJbWF11xK5qB',
    logoHtml: '<div style="background-color: #630D16; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">COSTA</div>'
  },
  'jasmis': {
    category: 'Dining',
    title: 'Free appetizer',
    points: 600,
    brandName: 'Jasmi\'s',
    description: 'Get a free appetizer of your choice with any main meal purchase. A perfect way to start your dining experience at local favorite Jasmi\'s.',
    expires: '15/05/2026',
    usage: 'One-time Use',
    terms: [
      'Valid with purchase of any main meal.',
      'Only one redemption per day per user.',
      'Available at selected Jasmi\'s branches in Bahrain.'
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr5rg6vflFvo-fB0JVX2vXLcH8L8scDJ3yOhvnSuL5pg3fy8SPF-DjSZZZiO7S0yCN009FAgDfgeOwzgb_L_QPJTKe9l6mWO2g5FffHugypjMPUAKCNWWMvr9hbVNwzKeXvxFrU0jI3ALemhcUMELASjAEU2qyQR3yNnsX-RQxQyKPIrlgOuliNf5e2-3pAqoricmilnsM8n6iN3R-xHU99X9lLftGSyJ63-9bC8nb8ce4GCyRiOqjdylbfMXYlArWl45_bJZBhA-r',
    logoHtml: '<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWPP07ryMiii7qOE_trAEcai39fESiIR-i5shbsivT4nj755_JaMnOB4BwNtAJzqvW0XEqo1j58fC37gORiSJR0NHR2QfMHJihNG4rdhqnZ8QKRzynh7s78DkUBDq7Ea7AZAOE1YrfAhOD_a-wLN7gX966gBbJjajVbsaaDKF1em8pMf2XnLzFbipRm75iHICBo6HOJ6jNOXqRG8_JXk4cXU7bB9hSWcEmezorEyit3loVpBKG-cA-y3rYIcJ_CCB6wvc8e6ZDpyT" alt="Jasmis" />'
  },
  'dining': {
    category: 'Dining',
    title: '25% off Total Bill',
    points: 800,
    brandName: 'Premium Dining Partner',
    description: 'Enjoy a 25% discount on your entire bill at our premium dining partners across the kingdom. Treat yourself after making a difference in the community!',
    expires: '01/01/2027',
    usage: 'Multi-Use (up to 3x)',
    terms: [
      'Discount applies to food and beverages, excluding taxes.',
      'Maximum discount value is 25 BHD per visit.',
      'Present the QR redemption code before asking for the bill.'
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZrnDP-9nWUguc_yRbGaxTBrpzfxRqM_9QD32M5QACeaq5aJXFd2MuEfqK0dV4pLLAYleNVrKq8vNQkVy14glDGEKshTEqaxUbHtHOa5HRT_KyhmlJVAElum-aDlrehBMTwjCPhS5q5bL6RFIxQoUK-1G_dw2ZbjqH5dAQMEYGSp_wYYMLcXblV3sq9ahJZGsURYi_NEGAGzDG-qgs5k4pcVyYo2y9x0EtfQLMopjw3WE8pEQBuCmisi52RuJBQAHlHQY9nHVbnCj_',
    logoHtml: '<div style="background-color: var(--primary); color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><span class="material-icons-round" style="font-size:20px;">restaurant</span></div>'
  }
};

// ── Show Reward Details ──
window.openRewardDetails = function(rewardId) {
  const reward = rewardsData[rewardId];
  if (!reward) return;

  // Track which reward is currently open (for confirm modal)
  _currentRewardForRedemption = rewardId;

  // Clear any fallback illustration that was applied to the empty hero img
  const heroImg = document.getElementById('rd-hero-img');
  const heroParent = heroImg.parentElement;
  const existingFallback = heroParent.querySelector('.fallback-illustration');
  if (existingFallback) existingFallback.remove();
  heroImg.style.display = '';
  heroImg.src = reward.heroImg;
  document.getElementById('rd-brand-logo').innerHTML = reward.logoHtml;
  document.getElementById('rd-category').textContent = reward.category;
  document.getElementById('rd-title').textContent = reward.title;
  document.getElementById('rd-points').textContent = reward.points + ' Pts';
  document.getElementById('rd-brand-name').textContent = reward.brandName;
  document.getElementById('rd-desc').textContent = reward.description;
  document.getElementById('rd-expires').textContent = reward.expires;
  document.getElementById('rd-usage').textContent = reward.usage;

  // Populate terms list
  const termsList = document.getElementById('rd-terms');
  termsList.innerHTML = '';
  reward.terms.forEach(term => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="bullet">•</span><span>${term}</span>`;
    termsList.appendChild(li);
  });

  // Navigate to the view
  navigateTo('reward-details');
};

// ── Confirm Redemption Modal ──
let _currentRewardForRedemption = null;

window.showConfirmRedemption = function() {
  const rewardId = _currentRewardForRedemption;
  const reward = rewardId ? rewardsData[rewardId] : null;
  if (!reward) return;

  // Populate modal
  document.getElementById('cr-brand-logo').innerHTML = reward.logoHtml;
  document.getElementById('cr-title').textContent = reward.title;
  document.getElementById('cr-sub').textContent = `Valid at ${reward.brandName}.`;
  document.getElementById('cr-cost').textContent = `${reward.points} Taw`;

  const modal = document.getElementById('modal-confirm-redemption');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.hideConfirmRedemption = function(event) {
  // If called from overlay click, only close if the overlay itself was clicked
  if (event && event.target !== document.getElementById('modal-confirm-redemption')) return;
  document.getElementById('modal-confirm-redemption').style.display = 'none';
  document.body.style.overflow = '';
};

window.confirmRedemption = function() {
  const rewardId = _currentRewardForRedemption;
  const reward = rewardId ? rewardsData[rewardId] : null;
  if (!reward) return;

  // Hide modal
  document.getElementById('modal-confirm-redemption').style.display = 'none';
  document.body.style.overflow = '';

  // Generate redemption code
  const code = `TAW-${reward.brandName.split(' ')[0].toUpperCase()}-${new Date().getFullYear()}`;

  // Populate Reward Redeemed page
  document.getElementById('rr-logo').innerHTML = reward.logoHtml;
  document.getElementById('rr-title').textContent = reward.title;
  document.getElementById('rr-subtitle').textContent = `Your taw points have been converted into a great reward.`;
  document.getElementById('rr-code').textContent = code;

  // Generate simple QR-like visual using a text pattern
  const qrEl = document.getElementById('rr-qr');
  qrEl.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="8" fill="white"/>
      <!-- Corner squares -->
      <rect x="10" y="10" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="16" y="16" width="24" height="24" rx="2" fill="white"/>
      <rect x="20" y="20" width="16" height="16" rx="1" fill="#1d1c17"/>
      <rect x="94" y="10" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="100" y="16" width="24" height="24" rx="2" fill="white"/>
      <rect x="104" y="20" width="16" height="16" rx="1" fill="#1d1c17"/>
      <rect x="10" y="94" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="16" y="100" width="24" height="24" rx="2" fill="white"/>
      <rect x="20" y="104" width="16" height="16" rx="1" fill="#1d1c17"/>
      <!-- Data dots -->
      <rect x="56" y="10" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="68" y="10" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="80" y="10" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="56" y="20" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="68" y="30" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="56" y="40" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="80" y="40" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="10" y="56" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="20" y="56" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="30" y="68" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="56" y="56" width="30" height="30" rx="4" fill="#1d1c17"/>
      <rect x="60" y="60" width="22" height="22" rx="2" fill="white"/>
      <rect x="64" y="64" width="14" height="14" rx="1" fill="#1d1c17"/>
      <rect x="10" y="80" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="96" y="56" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="108" y="56" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="120" y="68" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="96" y="80" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="120" y="96" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="96" y="108" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="108" y="120" width="8" height="8" rx="1" fill="#1d1c17"/>
      <rect x="120" y="120" width="8" height="8" rx="1" fill="#1d1c17"/>
    </svg>`;

  // Navigate to redeemed page
  navigateTo('reward-redeemed');

  // Calculate and display 48-hour expiry
  const now = new Date();
  const expiry = new Date(now.getTime() + (48 * 60 * 60 * 1000));
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('rr-expires-time').textContent = expiry.toLocaleDateString('en-US', options);
};
