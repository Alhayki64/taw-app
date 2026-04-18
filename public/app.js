/* =============================================
   Tawwa (طوّع) — APP ROUTER & INTERACTIONS
   ============================================= */

// ── UI Helpers: Empty & Error States ──
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

// ── Validation Schemas (Zod) ──
const authSchema = window.Zod ? window.Zod.z.object({
  email: window.Zod.z.string().email("Invalid email address"),
  password: window.Zod.z.string().min(6, "Password must be at least 6 characters"),
  name: window.Zod.z.string().optional()
}) : null;

const profileSchema = window.Zod ? window.Zod.z.object({
  name: window.Zod.z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: window.Zod.z.string().max(20, "Phone is too long").optional().or(window.Zod.z.literal('')),
  bio: window.Zod.z.string().max(300, "Bio is too long").optional().or(window.Zod.z.literal(''))
}) : null;

const tawCodeSchema = window.Zod ? window.Zod.z.string().regex(/^TAW-\d{4}$/, "Invalid TAW-XXXX code") : null;

// ── Navigation State ──
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

// Pages that should hide the bottom nav
const subPages = new Set(['landing', 'auth', 'interests', 'notifications', 'notif-permission', 'edit-profile', 'event-details', 'checkin-success', 'volunteer-map', 'reward-details', 'reward-redeemed', 'partner-detail']);

// Pages that require authentication
const protectedPages = new Set(['checkin-success', 'profile', 'reward-redeemed', 'notifications', 'edit-profile']);

let currentPage = 'landing';
let pageHistory = ['landing'];

// ── Navigate To Page ──
function navigateTo(pageName) {
  if (pageName === currentPage) return;

  // Set transition direction (default forward, goBack sets 'back')
  if (!document.body.dataset.direction) document.body.dataset.direction = 'forward';

  // Route guard: redirect to auth if not signed in
  if (protectedPages.has(pageName)) {
    if (!authState.session) {
      navigateTo('auth');
      return;
    }
    const isVerified = authState.user && (authState.user.email_confirmed_at || authState.user.phone_confirmed_at);
    if (!isVerified) {
      // Optional: show a toast or message
      navigateTo('auth');
      return;
    }
  }

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
      delete document.body.dataset.direction;
    }, 400);
  }

  // Enter new page
  newPageEl.classList.add('active');

  // Handle bottom nav visibility
  if (subPages.has(pageName)) {
    bottomNav.classList.add('hidden');
  } else {
    bottomNav.classList.remove('hidden');
  }

  // Show/hide marketplace balance bar
  const balanceBar = document.getElementById('marketplace-balance-bar');
  if (balanceBar) balanceBar.style.display = pageName === 'marketplace' ? 'block' : 'none';

  // Update nav active states
  updateNavActive(pageName);

  // Push to history
  if (pageName !== currentPage) {
    pageHistory.push(pageName);
  }

  currentPage = pageName;

  // Page-specific init hooks
  if (pageName === 'notif-permission') initNotifPermStories();
  if (pageName === 'edit-profile') initEditProfile();

  // Accessibility: focus the new page heading after transition
  setTimeout(() => {
    const heading = newPageEl.querySelector('h1, h2, [autofocus]');
    if (heading) heading.focus({ preventScroll: true });
  }, 410);
}

// ── Go Back ──
function goBack() {
  document.body.dataset.direction = 'back';
  pageHistory.pop(); // Remove current
  const prev = pageHistory[pageHistory.length - 1] || 'home';
  navigateTo(prev);
}

// ── Update Nav Active State ──
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

// ── Filter Opportunities by Category ──
function filterOpportunitiesByCategory(category) {
  // Scroll to opportunities carousel
  const carousel = document.getElementById('opportunities-carousel')
  if (carousel) {
    carousel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  // Dim/highlight cards by category
  document.querySelectorAll('.opportunity-card').forEach(card => {
    const match = !category || card.dataset.category === category
    card.style.opacity = match ? '1' : '0.4'
    card.style.transform = match ? '' : 'scale(0.97)'
    card.style.transition = 'opacity 0.25s, transform 0.25s'
  })
  // Reset after 3 seconds
  setTimeout(() => {
    document.querySelectorAll('.opportunity-card').forEach(card => {
      card.style.opacity = ''
      card.style.transform = ''
    })
  }, 3000)
}

// ── Auth Prompt (for guests attempting protected actions) ──
function showAuthPrompt(actionLabel) {
  const label = document.getElementById('auth-prompt-label')
  if (label) {
    const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
    label.textContent = isAr ? 'سجّل دخولك للمتابعة' : 'Sign in to continue';
  }
  const modal = document.getElementById('modal-auth-prompt')
  if (!modal) return
  modal.style.display = 'flex'
  document.body.style.overflow = 'hidden'
  trapFocus(modal, {
    onEscape: () => hideAuthPrompt()
  })
}

function hideAuthPrompt() {
  const modal = document.getElementById('modal-auth-prompt')
  if (!modal) return
  modal.style.display = 'none'
  document.body.style.overflow = ''
  releaseFocus()
}

// ── Toggle Interest Selection ──
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
      // fallback
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

// ── Animate counters on profile page ──
// No-op: real values are set by loadProfilePoints() in points.js
function animateCounters() {}

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

// ── Smooth horizontal drag for carousel (pointer events — works for mouse + touch) ──
const carousel = document.getElementById('opportunities-carousel');
if (carousel) {
  let isDragging = false;
  let startX, scrollStart;
  let lastX, lastTime, velocity = 0;
  let momentumId = null;

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

// ── Update User Display ──
function updateUserDisplay() {
  const user = authState.user;
  const greetingEl = document.querySelector('.home-welcome-name');
  const isArabic = typeof currentLang !== 'undefined' && currentLang === 'ar';

  if (!user) {
    if (greetingEl) {
      greetingEl.textContent = isArabic ? 'أهلاً، ضيف!' : 'Hello, Guest!';
      greetingEl.removeAttribute('data-i18n');
    }
    return;
  }

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Volunteer';
  const firstName = name.split(' ')[0];

  if (greetingEl) {
    greetingEl.textContent = isArabic ? `أهلاً، ${firstName}!` : `Hello, ${firstName}!`;
    greetingEl.removeAttribute('data-i18n');
  }

  const profileNameEl = document.querySelector('.profile-name');
  if (profileNameEl) {
    profileNameEl.textContent = name;
    profileNameEl.removeAttribute('data-i18n');
  }

  // Update Avatar Images
  const avatarUrl = user.user_metadata?.avatar_url;
  if (avatarUrl) {
    // 1. Profile Avatar Large
    const profileAvatar = document.querySelector('.profile-avatar-large');
    if (profileAvatar) {
      let img = profileAvatar.querySelector('.avatar-custom-img');
      if (!img) {
        img = document.createElement('img');
        img.className = 'avatar-custom-img';
        profileAvatar.appendChild(img);
        const defIcon = profileAvatar.querySelector('.def-icon');
        if (defIcon) defIcon.style.display = 'none';
      } else {
        // Reuse existing img (placeholder) and ensure it's visible
        img.src = avatarUrl;
        img.style.display = 'block';
      }
    }

    // 2. Notif-permission + edit-profile page avatars
    const notifPermAvatar = document.getElementById('notif-perm-avatar-img');
    if (notifPermAvatar) notifPermAvatar.src = avatarUrl;
    const epAvatar = document.getElementById('ep-avatar-img');
    if (epAvatar) epAvatar.src = avatarUrl;

    // 3. Header and other small avatars
    const smallAvatars = ['home-avatar', 'market-avatar', 'onboarding-avatar-ui'];
    smallAvatars.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        let img = el.querySelector('.nav-custom-avatar');
        let mascotImg = el.querySelector('.notif-mascot-img');
        
        if (mascotImg) {
           mascotImg.src = avatarUrl;
        } else {
          if (!img) {
            img = document.createElement('img');
            img.className = 'nav-custom-avatar';
            el.appendChild(img);
            const icon = el.querySelector('.material-icons-round');
            if (icon && !icon.parentElement.classList.contains('avatar-edit-overlay')) {
               // Only hide the default icon, not the camera overlay
               icon.style.display = 'none';
            }
          }
          img.src = avatarUrl;
        }
      }
    });
  }
}

// ── Handle Avatar Upload ──
window.handleAvatarUpload = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      // Create canvas to resize and crop image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const MAX_SIZE = 150;
      
      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;
      
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      
      ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_SIZE, MAX_SIZE);
      
      // Get highly compressed base64 string
      const base64String = canvas.toDataURL('image/jpeg', 0.65);
      
      // Loading state on overlay
      const overlay = document.querySelector('.avatar-edit-overlay .material-icons-round');
      if (overlay) {
        overlay.classList.add('spinning');
        overlay.textContent = 'refresh';
      }
      
      try {
        if (typeof supabaseClient !== 'undefined') {
          const { data, error } = await supabaseClient.auth.updateUser({
            data: { avatar_url: base64String }
          });
          if (error) throw error;
          
          if (data && data.user) {
            authState.user = data.user;
            updateUserDisplay();
          }
        }
      } catch (err) {
        console.error('Failed to upload avatar:', err);
        if (typeof showToast === 'function') showToast('Failed to save profile image. Please try again.', 'error');
      } finally {
        if (overlay) {
          overlay.classList.remove('spinning');
          overlay.textContent = 'camera_alt';
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// ── Notif Permission Page — Photo Editor ──────────────────────────────────────

// ── Notif Permission — Story Carousel ──────────────────────────────────────

let _npCurrentStory = 1;
const NP_TOTAL_STORIES = 3;

function advanceNotifStory() {
  if (_npCurrentStory >= NP_TOTAL_STORIES) return;
  const prev = _npCurrentStory;
  _npCurrentStory++;

  // Swap story cards
  document.getElementById(`np-story-${prev}`)?.classList.remove('active');
  document.getElementById(`np-story-${_npCurrentStory}`)?.classList.add('active');

  // Update dots
  const prevDot = document.getElementById(`np-dot-${prev}`);
  const nextDot = document.getElementById(`np-dot-${_npCurrentStory}`);
  if (prevDot) prevDot.classList.remove('active');
  if (nextDot) nextDot.classList.add('active');

  // On last story: swap button for final CTAs
  if (_npCurrentStory === NP_TOTAL_STORIES) {
    const nextBtn = document.getElementById('np-btn-next');
    const finalActions = document.getElementById('np-final-actions');
    if (nextBtn) nextBtn.style.display = 'none';
    if (finalActions) finalActions.style.display = 'flex';
  }
}

function initNotifPermStories() {
  _npCurrentStory = 1;
  for (let i = 1; i <= NP_TOTAL_STORIES; i++) {
    const story = document.getElementById(`np-story-${i}`);
    const dot = document.getElementById(`np-dot-${i}`);
    if (story) story.classList.toggle('active', i === 1);
    if (dot) dot.classList.toggle('active', i === 1);
  }
  const nextBtn = document.getElementById('np-btn-next');
  const finalActions = document.getElementById('np-final-actions');
  if (nextBtn) nextBtn.style.display = '';
  if (finalActions) finalActions.style.display = 'none';
}

// ── Edit Profile Page ───────────────────────────────────────────────────────

function initEditProfile() {
  const user = authState.user;
  if (!user) return;

  const name = user.user_metadata?.full_name || '';
  const phone = user.user_metadata?.phone || '';
  const bio = user.user_metadata?.bio || '';
  const email = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url;

  const nameEl = document.getElementById('ep-name');
  const emailEl = document.getElementById('ep-email');
  const phoneEl = document.getElementById('ep-phone');
  const bioEl = document.getElementById('ep-bio');
  const avatarEl = document.getElementById('ep-avatar-img');

  if (nameEl) nameEl.value = name;
  if (emailEl) emailEl.value = email;
  if (phoneEl) phoneEl.value = phone;
  if (bioEl) bioEl.value = bio;
  if (avatarEl) avatarEl.src = avatarUrl || 'default_avatar.png';
}

async function saveProfileChanges(e) {
  if (e) e.preventDefault();
  if (!authState.user) { navigateTo('auth'); return; }

  const name = document.getElementById('ep-name')?.value.trim() || '';
  const phone = document.getElementById('ep-phone')?.value.trim() || '';
  const bio = document.getElementById('ep-bio')?.value.trim() || '';

  const saveBtn = document.getElementById('ep-save-btn');
  const saveText = document.getElementById('ep-save-text');
  const saveSpinner = document.getElementById('ep-save-spinner');
  if (saveBtn) saveBtn.disabled = true;
  if (saveText) saveText.style.display = 'none';
  if (saveSpinner) saveSpinner.style.display = '';

  try {
    if (profileSchema) {
      const parsed = profileSchema.safeParse({ name, phone, bio });
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0].message);
      }
    }

    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient.auth.updateUser({
        data: { full_name: name, phone, bio }
      });
      if (error) throw error;
      if (data?.user) {
        authState.user = data.user;
        updateUserDisplay();
      }
    }
    const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
    if (typeof showToast === 'function') showToast(isAr ? 'تم حفظ الملف الشخصي' : 'Profile saved', 'success');
    goBack();
  } catch (err) {
    console.error('Failed to save profile', err);
    if (typeof showToast === 'function') showToast('Failed to save. Please try again.', 'error');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
    if (saveText) saveText.style.display = '';
    if (saveSpinner) saveSpinner.style.display = 'none';
  }
}

// ── Notif Permission Page — Photo Editor ──────────────────────────────────────

function showNotifPermPhotoSheet() {
  const sheet = document.getElementById('notif-perm-photo-sheet');
  if (!sheet) return;
  sheet.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  trapFocus(sheet, {
    onEscape: () => hideNotifPermPhotoSheet()
  });
}

function hideNotifPermPhotoSheet() {
  const sheet = document.getElementById('notif-perm-photo-sheet');
  if (!sheet) return;
  sheet.style.display = 'none';
  document.body.style.overflow = '';
  releaseFocus();
}

function notifPermTakePhoto() {
  hideNotifPermPhotoSheet();
  document.getElementById('notif-perm-camera-input')?.click();
}

function notifPermChooseGallery() {
  hideNotifPermPhotoSheet();
  document.getElementById('notif-perm-gallery-input')?.click();
}

async function notifPermRemovePhoto() {
  const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
  const ok = typeof showConfirmDestructive === 'function'
    ? await showConfirmDestructive({
        title: isAr ? 'إزالة الصورة؟' : 'Remove profile photo?',
        message: isAr ? 'سيتم حذف صورة ملفك الشخصي من هذا الجهاز والحساب.' : 'Your profile photo will be cleared on this device and your account.',
        confirmText: isAr ? 'إزالة' : 'Remove',
        cancelText: isAr ? 'إلغاء' : 'Cancel',
        danger: true
      })
    : true;
  if (!ok) return;

  hideNotifPermPhotoSheet();
  const avatarImg = document.getElementById('notif-perm-avatar-img');
  if (avatarImg) avatarImg.src = 'default_avatar.png';
  // Also clear from user profile if logged in
  if (typeof supabaseClient !== 'undefined' && authState.user) {
    supabaseClient.auth.updateUser({ data: { avatar_url: null } }).then(() => {
      authState.user = { ...authState.user, user_metadata: { ...authState.user.user_metadata, avatar_url: null } };
      updateUserDisplay();
    });
  }
  if (typeof showToast === 'function') showToast(isAr ? 'تمت إزالة الصورة' : 'Photo removed', 'success');
}

window.handleNotifPermPhotoSelected = function(input) {
  const file = input.files?.[0];
  if (!file) return;
  input.value = '';

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      const canvas = document.createElement('canvas');
      const SIZE = 150;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
      const base64 = canvas.toDataURL('image/jpeg', 0.72);

      // Update preview immediately
      const avatarImg = document.getElementById('notif-perm-avatar-img');
      if (avatarImg) avatarImg.src = base64;

      // Persist to Supabase if signed in
      if (typeof supabaseClient !== 'undefined' && authState.user) {
        try {
          const { data, error } = await supabaseClient.auth.updateUser({ data: { avatar_url: base64 } });
          if (!error && data?.user) {
            authState.user = data.user;
            updateUserDisplay();
          }
        } catch (err) {
          console.error('Failed to save avatar', err);
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// ── Global Escape Key Handler ──
// ── Initialize ──
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof initGlobalErrorBoundary === 'function') initGlobalErrorBoundary();
  if (typeof onAuthStateChange === 'function') {
    onAuthStateChange((event, session) => {
      if (session && session.user) {
        updateUserDisplay();
      }
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        navigateTo('auth');
      }
    });
  }
  // Restore dark mode preference
  if (localStorage.getItem('taw-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcons(true);
  }

  // Hide bottom nav initially
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) bottomNav.classList.add('hidden');

  // Session restore: check if user is already signed in
  try {
    const session = await getSession();
    if (session) {
      authState.session = session;
      authState.user = session.user;
      authState.loading = false;
      updateUserDisplay();
      // Skip landing — go straight to home
      const landingPage = document.getElementById('page-landing');
      if (landingPage) landingPage.classList.remove('active');
      navigateTo('home');
      return;
    }
  } catch (e) {
    // Supabase not configured yet — fall through to landing
  }

  authState.loading = false;
  updateUserDisplay();
  // No session — show landing
  const landingPage = document.getElementById('page-landing');
  if (landingPage) landingPage.classList.add('active');
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

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.lang-dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
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

  // Sync landing toggle active states
  syncLandingLangToggle(lang);
}

function switchLandingLang(lang) {
  selectLanguage(lang);
  syncLandingLangToggle(lang);
}

function syncLandingLangToggle(lang) {
  const buttons = document.querySelectorAll('.landing-lang-option');
  buttons.forEach(btn => {
    const isEn = btn.textContent.trim() === 'EN';
    const isActive = (lang === 'en' && isEn) || (lang === 'ar' && !isEn);
    btn.classList.toggle('active', isActive);
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
    logoHtml: '<div style="background-color: #630D16; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">COSTA</div>',
    howToUse: 'Present this screen to the barista before ordering. The discount applies to any single beverage on the menu.'
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
    logoHtml: '<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWPP07ryMiii7qOE_trAEcai39fESiIR-i5shbsivT4nj755_JaMnOB4BwNtAJzqvW0XEqo1j58fC37gORiSJR0NHR2QfMHJihNG4rdhqnZ8QKRzynh7s78DkUBDq7Ea7AZAOE1YrfAhOD_a-wLN7gX966gBbJjajVbsaaDKF1em8pMf2XnLzFbipRm75iHICBo6HOJ6jNOXqRG8_JXk4cXU7bB9hSWcEmezorEyit3loVpBKG-cA-y3rYIcJ_CCB6wvc8e6ZDpyT" alt="Jasmis" />',
    howToUse: "Show this screen to your server before ordering. The free appetizer will be applied with any main meal purchase."
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
    logoHtml: '<div style="background-color: var(--primary); color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><span class="material-icons-round" style="font-size:20px;">restaurant</span></div>',
    howToUse: 'Show this screen to your server before asking for the bill. The QR code will be scanned to apply the 25% discount.'
  }
};

// ── Events Data ──
const eventsData = {
  'marine-cleanup': {
    title: 'Marine Cleanup: Malkiya Beach',
    orgName: 'Bahrain Ocean Society',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'April 5, 2026',
    time: '9:00 AM — 12:00 PM',
    location: 'Malkiya Beach, Bahrain',
    volunteers: '32 / 40 spots filled',
    points: '+50 Points',
    desc: 'Join us at Malkiya beach to clear plastic waste and marine debris from the coastline. Gloves and garbage bags will be provided.',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoXGK4NJKVaXa3tyxKQHvjTJAmN7mOlBKMZJ4mrBd8PmdcmF3BMiUZLkZ3Z5VFfEH_51H4WUQHz60BdasN5V5HmRfUq-PLZ_K9lnoh9qu1_3CITzJyP0syWtGylLMdKehMyDOW2aXdi5mrvjiIYfs8DIlAyYHB2maQpnz7fy699uA-E-Qz37qMuR82wvtQta2GZTsei-M55c8_Y-kWJSmaefRIW3ssSwbjbkDLK7TeVfcJRUCI_qqlxtwHklppN3djBq1NU4r70Lk-',
    mapLabel: 'Malkiya Beach'
  },
  'evening-tea': {
    title: 'Evening Tea at Muharraq Care Home',
    orgName: 'Social Care Society',
    orgType: 'Elderly Support',
    orgLogo: '🫖',
    date: 'Today, April 1',
    time: '6:00 PM — 8:00 PM',
    location: 'Muharraq, Bahrain',
    volunteers: '5 / 10 spots filled',
    points: '+100 Points',
    desc: 'Spend two hours serving tea, talking with the elderly, and bringing a smile to their day. Board games are welcome!',
    heroImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Muharraq Care Home'
  },
  'math-help': {
    title: 'Math Help for Secondary Students',
    orgName: 'Bahrain Tutors Association',
    orgType: 'Education',
    orgLogo: '📚',
    date: 'Wednesday, April 3',
    time: '4:00 PM — 6:00 PM',
    location: 'Online Workshop',
    volunteers: '12 / 20 spots filled',
    points: '+150 Points',
    desc: 'Help secondary school students study for their upcoming math exams. We will review algebra, geometry, and calculus basics.',
    heroImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Online Link Provided'
  },
  'beach-cleanup': {
    title: 'Coastal Beach Cleanup',
    orgName: 'Bahrain Ocean Society',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'Tomorrow, April 2',
    time: '8:00 AM — 11:00 AM',
    location: 'Manama, Bahrain',
    volunteers: '8 / 12 spots filled',
    points: '+200 Points',
    desc: 'Help restore the Manama coastline by participating in our early morning beach cleanup.',
    heroImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Manama Coastline'
  },
  'food-drive': {
    title: 'Ramadan Food Drive',
    orgName: 'Bahrain Red Crescent',
    orgType: 'Humanitarian Organization',
    orgLogo: '🌙',
    date: 'April 5, 2026',
    time: '4:00 PM — 7:00 PM',
    location: 'Riffa, Bahrain',
    volunteers: '5 / 12 spots left',
    points: '+150 Points',
    desc: 'Prepare and pack food boxes for families in need during the holy month of Ramadan.',
    heroImg: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Riffa Distribution Center'
  },
  'tree-planting': {
    title: 'Tree Planting at Al Areen Wildlife Reserve',
    orgName: 'Bahrain Red Crescent',
    orgType: 'Humanitarian Organization',
    orgLogo: '🌙',
    date: 'April 10, 2026',
    time: '5:00 PM — 8:00 PM',
    location: 'Al Areen, Bahrain',
    volunteers: '24 / 40 spots filled',
    points: '+300 Points',
    desc: "Join us for a meaningful morning of planting native trees at the beautiful Al Areen Wildlife Reserve. Help restore Bahrain's natural greenery and contribute to a sustainable future.",
    heroImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Al Areen Wildlife Reserve'
  },
  'amwaj-cleanup': {
    title: 'Beach Cleanup — Amwaj',
    orgName: 'Amwaj Communities',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'April 18, 2026',
    time: '7:00 AM — 10:00 AM',
    location: 'Amwaj Islands, Bahrain',
    volunteers: '12 / 20 spots filled',
    points: '+150 Points',
    desc: "Help keep our island beautiful. We will be cleaning the main public beach at Amwaj to protect marine life. Garbage bags and breakfast provided.",
    heroImg: 'https://images.unsplash.com/photo-1618477461853-cf6ed80f4886?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Amwaj Public Beach'
  },
  'elderly-visit': {
    title: 'Elderly Care Visit',
    orgName: 'Social Care Society',
    orgType: 'Elderly Support',
    orgLogo: '🫖',
    date: 'April 20, 2026',
    time: '10:00 AM — 12:00 PM',
    location: 'Muharraq, Bahrain',
    volunteers: '5 / 10 spots filled',
    points: '+100 Points',
    desc: "Spend your morning visiting the elderly at the Muharraq Care Home. A little conversation goes a long way to brighten their day.",
    heroImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Muharraq Care Home'
  },
  'literacy-workshop': {
    title: 'Literacy Workshop',
    orgName: 'Bahrain Education Initiative',
    orgType: 'Education',
    orgLogo: '📚',
    date: 'April 25, 2026',
    time: '4:00 PM — 6:00 PM',
    location: 'Isa Town Community Center',
    volunteers: '8 / 20 spots filled',
    points: '+120 Points',
    desc: "Assist teachers in running reading exercises for young learners. No prior teaching experience required, just patience and enthusiasm.",
    heroImg: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Isa Town Center'
  },
  'blood-donation': {
    title: 'Blood Donation Drive',
    orgName: 'Salmaniya Medical Complex',
    orgType: 'Health Services',
    orgLogo: '🩸',
    date: 'April 28, 2026',
    time: '9:00 AM — 2:00 PM',
    location: 'Salmaniya Hospital, Bahrain',
    volunteers: '10 / 30 spots filled',
    points: '+180 Points',
    desc: "Your blood can save a life. Join our weekend massive blood donation drive in coordination with the Ministry of Health. Refreshments provided after donation.",
    heroImg: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Salmaniya Hospital'
  },
  'meal-prep': {
    title: 'Community Meal Prep',
    orgName: 'Conserving Bounties Society',
    orgType: 'Community',
    orgLogo: '🍲',
    date: 'Tonight',
    time: '6:00 PM — 9:00 PM',
    location: 'Manama Central Kitchen',
    volunteers: '16 / 20 spots filled',
    points: '+250 Points',
    desc: "Help us prep, cook, and pack meals for families in need. We are recovering excess food from hotels and turning it into nutritious meals.",
    heroImg: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Manama Central Kitchen'
  }
};

let _currentEventId = null;

window.openEventDetails = function(eventId) {
  _currentEventId = eventId || 'tree-planting';
  const event = eventsData[eventId] || eventsData['tree-planting'];

  const heroImg = document.querySelector('#event-hero img');
  if (heroImg) heroImg.src = event.heroImg;

  document.querySelector('.event-org-logo').textContent = event.orgLogo;
  document.querySelector('.event-org-name').textContent = event.orgName;
  document.querySelector('.event-org-type').textContent = event.orgType;
  document.querySelector('.event-title').textContent = event.title;
  document.querySelector('.event-desc').textContent = event.desc;
  
  document.querySelector('#event-detail-date .detail-value').textContent = event.date;
  document.querySelector('#event-detail-time .detail-value').textContent = event.time;
  document.querySelector('#event-detail-location .detail-value').textContent = event.location;
  document.querySelector('#event-detail-volunteers .detail-value').textContent = event.volunteers;
  
  const mapLabel = document.querySelector('#event-mini-map .map-label');
  if(mapLabel) mapLabel.textContent = event.mapLabel;
  
  const pointsVal = document.querySelector('#event-reward-callout .reward-value');
  if(pointsVal) pointsVal.textContent = event.points;
  
  navigateTo('event-details');
};

// ── Partner Data ──
const partnersData = {
  mcdonalds: {
    name: "McDonald's",
    category: 'Quick Service Restaurant',
    rating: '4.8',
    offers: '12',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfVFcH9tHoyKH_yxW7XySvetBsODgGCpYCGGpIFytknG5kAumwBVWeqDP9AiFNjlYCToceemSzc_91WfuFnx86Qg9T_UZ34cnwt7lDoo6QrP4kMv5kzudKkuXJ5PW3qevDlCkIHNoxwiHgoNt8_0vYuW0gfq1ihdj0n8OHbA_2xMLxe0bLxpTGZibY3OQb6yWL05X5chU5F9n96ZYVolMKRedMGo3MZm6r0tcpAEwUGlOnhuwLfluDvtMqKJbqrlx4xmMKudAxF5AW',
    logoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi7lyUus2XH1sdEuX1hNeQnVeaN52Y-NrXzWeCQaVp-oN41FdETNtW49RXJkpxLbS8F8HexN_PWxAGGFWBnNLPF86vqZhMXmxxpKfumSdK9gKSGHBwepSSAlMi34DE-2FO7bJLslsgLu-5-GlVjZvHAJUBq3eGRjff2-jkGvoqSn9-JEoYV-kv1o1IEF4Ci7rX8UXAe13wV-ZPT3WkeI_O2QhY9_4C3351kYgcj3Hpgb3B_YWHcYpQO03DFXinW1iqNsYNY0ucv52Y',
    civicText: "McDonald's Bahrain has been a pillar of our civic tapestry since 2024. For every meal claimed through Taw, they contribute to local community gardens across the Kingdom, fueling the spirit of giving back.",
    rewards: [
      { title: 'Free Appetizer', taw: '350', desc: 'With any meal purchase. Valid at all branches.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-2DF20X_XvZK38m3zxANqiDY5wCN0t6_jNZmKJrVegE1XXClu7T_OkaxfVJAlOTelk1h_gwyNLS2Ef_nzun2tMZOnjFvbEdBDytsFrjhWCrP2afqkc9AKwcPNuJzwibUm4jKhM5adg_Br8nC42D30n04FfcMh_LXcOd5SKEMuk4sbmApJSBIsjBjfvnZR4qN55SSxAv-QOmnoz7X9RvHco1zXUqcO57ZSaYEnrYYby5-abPELPuae9bW4SSpLcuExCQouhdue81F' },
      { title: '20% off Family Meal', taw: '850', desc: 'Valid on Share Box items. Perfect for weekend gatherings.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA70PGT329JdoGjNHR4R-mdsTP_NLI0piNox_QuSx1VMbpe-lOsijPnLG0WkCcJiALZnMumfFefvpUcK3oYHuNWLTo4wWpKP4kRc-iYeSHWZjpWU9TGx-ol28cE1FxAoyCgKqxURslvaMJOTTR0oIS8mVYKERuEsVOaaY3QT6Awfvs9HaWCvI4Kzz13qSV0Ul14aJBkAgNsQLJlHKkq4lY81Vhr8f7n6UqWfBcAMpPJAKY-Wt-YTQCvYn_waQiTJT53Qh2IuOHKtHM-' },
      { title: 'Free McFlurry', taw: '500', desc: 'Any flavor available. Limited time offer.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBaeKnvXWax3ZcGLKi76HdMXqYbnqM10JdB3aqat48yE9t1hVKBlq4vMaXVQs4HaVGOGyuRLdT8IFrA89xFEYBnVBS6FsGhLegn2NciafjI4AGjfzHCCELRWFC3uGKISMt25g_bUmFvLEnHHHHqmM1QFHR5x36uwzlozVEjFu10I08yEYOE6ZJYFJHVxPlg0pAyXYMamUcL51ZGATeIuN_35HieqvUunfsdzWCExaj_uMUAF7SLk1EbuKEZ3Eo_PEcJQQSU_5Jd' },
    ],
    branches: '4 locations within 5km of you'
  },
  barns: {
    name: "Barn's",
    category: 'Specialty Coffee',
    rating: '4.9',
    offers: '8',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTptBM-8aBu7BS0QfocOMNoq4PzXBzxMn3duWzS91Y6gLAP9-VprawMdQpPRyNkAN8C0BkeQi14pN6qaldwUOIJJuOJscU-ulAWyYViQWvdTNuGCavnlIVeJ_44yghFWoHKpgc3iEKCwd7w7FF3mOz8GP0hhm7P9hF4vS1gTt2Im7FXGdpFHBAYz93f3VfWPuGciTsZbQYRLabgVcy9YjSSCBezBL4TBpCJQvpa9JNA85-6DxJROx_89RTLAFqb_wVdIKvAlsSXX4K',
    logoImg: '',
    logoIcon: 'local_cafe',
    civicText: "Barn's Café supports local youth barista programs through Taw. Every beverage you claim helps fund coffee craft training for young Bahrainis, building community one cup at a time.",
    rewards: [
      { title: 'Free Special Latte', taw: '250', desc: 'Rich espresso with creamy textured milk. Any size.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTptBM-8aBu7BS0QfocOMNoq4PzXBzxMn3duWzS91Y6gLAP9-VprawMdQpPRyNkAN8C0BkeQi14pN6qaldwUOIJJuOJscU-ulAWyYViQWvdTNuGCavnlIVeJ_44yghFWoHKpgc3iEKCwd7w7FF3mOz8GP0hhm7P9hF4vS1gTt2Im7FXGdpFHBAYz93f3VfWPuGciTsZbQYRLabgVcy9YjSSCBezBL4TBpCJQvpa9JNA85-6DxJROx_89RTLAFqb_wVdIKvAlsSXX4K' },
      { title: '50% Off Any Cold Brew', taw: '150', desc: 'Valid Monday–Thursday. Dine-in only.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPU-C1XtloCXOdralqFDiUc3ibXu1fIj-btClXRIrv4oOUeU6TvOBFPG4APE_g_bZ7RoTLxUyryzHxRplWAkaz4zHXhYE1QewsrXDipnD1OU-pBNDFeGgAZjSesEyhKNAuHKnzcKTBHE65OOe0Q-KzraqG2J2nd3s393kVgD7ZCzWNukiuvbvQ4atJ0kUQpnhJ22qzk8exCgKTni0KvYsMvyjHegZ_pu9ooR7IZhobzOhuxyYdQlNzDehAYwlCXTtfeqGa55iPBmBt' },
    ],
    branches: '6 locations across Bahrain'
  },
  odaburger: {
    name: 'Oda Burger',
    category: 'Burger Restaurant · Jid-Ali',
    rating: '4.9',
    offers: '3',
    heroImg: 'Oda Burger.jpg',
    logoImg: 'Oda Burger.jpg',
    civicText: 'Oda Burger is a proud local brand from Jid-Ali, Bahrain. As a Tawwa partner, they support community events and local youth initiatives, proving that great burgers and a great community go hand in hand.',
    rewards: [
      { title: 'Free Drink', taw: '150', desc: 'Get a free cold drink with any burger order. Valid on delivery and pickup.', img: 'Oda Burger.jpg' },
      { title: 'Double Smash Deal', taw: '400', desc: '2 Double Smash Beef Burgers at a special Tawwa price.', img: 'Oda Burger.jpg' },
      { title: 'Free Size Upgrade', taw: '200', desc: 'Upgrade any meal to large for free. One per order.', img: 'Oda Burger.jpg' },
    ],
    branches: '1 location in Jid-Ali, Bahrain · Orders via Instagram @oda_burger.s'
  },
  reelcinemas: {
    name: 'Reel Cinemas',
    category: 'Entertainment',
    rating: '4.6',
    offers: '5',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-DRDJjbzGxE3oJGXPFFoqdXJM54Qvb6cMcaRy_Qr16nNJF-gqXE1Y7751xTMbBSXT6JpWMCWXXekzqf58rUXI9UmSo25lD2DQzDqtxQd2eYukneyE0Ygi-QMSM2T_gDO5OuOFQQbTcUPu-bU4xkl1ftAcoqMch7NLjpdcUSZNXEfS74wrdXVQyM-o3eZGjJ58rN9KCVBWvZYvi4m2XcH_UU8nQlUStAtZ5hdXfau6MlwRnDM4lLy_29VrnxtIkIkdfpJRaeGnod-5',
    logoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-1T77y33s7qzZhtJ3WnRb42e_tBbozBNAJg9Zl3aY7_7r4XeyPNkPOfM6jrOHOgI2sIzCvSGGxeyLmqZpm_8Em5bfPiCPV4ordcze9zXP0TSmoWbjXupxbtG_dNP5lVFNmcDel2SWK9gbtIrqsFJkmGM1kTn76C0vY1bQscF37FpJiR46v9-z8CtCalY9x9pCeGWUFbFuN2wz7AmCnlaAY8pARVQk5CLS-zR5V8o8lT4CMX4_W110mgfbih5albqBz7nHJ6NK5fsH',
    civicText: 'Reel Cinemas partners with Tawwa to make culture accessible. A portion of every redeemed ticket goes toward free cinema screenings for underprivileged children in Bahrain.',
    rewards: [
      { title: 'Buy 1 Get 1 Free', taw: '450', desc: 'Standard 2D movie tickets. Valid weekdays.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-DRDJjbzGxE3oJGXPFFoqdXJM54Qvb6cMcaRy_Qr16nNJF-gqXE1Y7751xTMbBSXT6JpWMCWXXekzqf58rUXI9UmSo25lD2DQzDqtxQd2eYukneyE0Ygi-QMSM2T_gDO5OuOFQQbTcUPu-bU4xkl1ftAcoqMch7NLjpdcUSZNXEfS74wrdXVQyM-o3eZGjJ58rN9KCVBWvZYvi4m2XcH_UU8nQlUStAtZ5hdXfau6MlwRnDM4lLy_29VrnxtIkIkdfpJRaeGnod-5' },
      { title: 'Popcorn + Drink Combo', taw: '200', desc: 'Large popcorn and any cold drink. Valid with any ticket.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8kmQSxtw07XupuUof5PPGW3AcZQTR58cbsamB-GH4EXmHiSHHmh76Y7OVj3oMHA3TYQk5R2buaovmT3gRfmj4CexYQPmTllFElaiCy4f1YRPAz3Bf53HK8Oyyr52NeQ4twauRXqHoav_wkdIjEeSKpPvPAbjF2WmJ2C6Ae2z0AiZUbAnWA3vBptZYF_pi2Z100ajCDy1P-OqrLViscZv2b29uaqfFRUfXRDPHBjCUsVKOsJG0Gr9TKQnozrebhYVHs54bwckLqGo' },
    ],
    branches: '2 locations in Bahrain City Centre & Avenues'
  }
};

// ── Open Partner Detail ──
window.openPartnerDetail = function(partnerId) {
  const p = partnersData[partnerId];
  if (!p) return;

  // Hero image
  const hero = document.getElementById('pd-hero-img');
  if (hero) hero.src = p.heroImg;

  // Logo
  const logoWrap = document.getElementById('pd-logo-wrap');
  if (logoWrap) {
    if (p.logoImg) {
      logoWrap.innerHTML = `<img style="width:100%;height:100%;object-fit:contain;" alt="${p.name} logo" src="${p.logoImg}"/>`;
    } else {
      logoWrap.innerHTML = `<span class="material-symbols-outlined" style="color:#005440;font-size:32px;">${p.logoIcon || 'store'}</span>`;
    }
  }

  // Name, category, stats
  const nameEl = document.getElementById('pd-name');
  if (nameEl) nameEl.textContent = p.name;
  const catEl = document.getElementById('pd-category');
  if (catEl) catEl.textContent = p.category;
  const ratingEl = document.getElementById('pd-rating');
  if (ratingEl) ratingEl.textContent = p.rating;
  const offersEl = document.getElementById('pd-offers');
  if (offersEl) offersEl.textContent = p.offers;

  // Civic text
  const civicEl = document.getElementById('pd-civic-text');
  if (civicEl) civicEl.textContent = p.civicText;

  // Rewards grid
  const grid = document.getElementById('pd-rewards-grid');
  if (grid) {
    grid.innerHTML = p.rewards.map((r, i) => `
      <div style="background:#ffffff;border-radius:14px;overflow:hidden;display:flex;flex-direction:${i === p.rewards.length - 1 && p.rewards.length % 2 !== 0 ? 'row' : 'column'};${i === p.rewards.length - 1 && p.rewards.length % 2 !== 0 ? 'grid-column:1/-1;' : ''}box-shadow:0 2px 10px rgba(29,28,23,0.07);">
        <div style="${i === p.rewards.length - 1 && p.rewards.length % 2 !== 0 ? 'width:130px;flex-shrink:0;' : 'height:130px;width:100%;'}overflow:hidden;">
          <img style="width:100%;height:100%;object-fit:cover;display:block;" alt="${r.title}" src="${r.img}"/>
        </div>
        <div style="padding:14px;display:flex;flex-direction:column;gap:8px;flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px;">
            <h4 style="font-family:'Manrope',sans-serif;font-weight:700;font-size:13px;color:#1d1c17;margin:0;line-height:1.3;">${r.title}</h4>
            <span style="background:rgba(254,216,138,0.5);color:#765a18;padding:2px 8px;border-radius:9999px;font-weight:700;font-size:10px;white-space:nowrap;">${r.taw} Taw</span>
          </div>
          <p style="font-size:11px;color:#3f4944;margin:0;line-height:1.5;flex:1;">${r.desc}</p>
          <button onclick="openPartnerReward('${partnerId}', ${i})" style="width:100%;background:#005440;color:#fff;padding:9px;border-radius:9999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;border:none;cursor:pointer;">Claim Deal</button>
        </div>
      </div>
    `).join('');
  }

  // Branches
  const branchEl = document.getElementById('pd-branches');
  if (branchEl) branchEl.textContent = p.branches;

  navigateTo('partner-detail');
};

// ── Open a reward from a partner detail page ──
window.openPartnerReward = function(partnerId, rewardIndex) {
  const p = partnersData[partnerId];
  if (!p) return;
  const r = p.rewards[rewardIndex];
  if (!r) return;

  const tempKey = '_pd_' + partnerId + '_' + rewardIndex;
  rewardsData[tempKey] = {
    heroImg: r.img,
    logoHtml: p.logoImg
      ? `<img style="width:100%;height:100%;object-fit:contain;" alt="${p.name}" src="${p.logoImg}"/>`
      : `<span class="material-symbols-outlined" style="color:#005440;font-size:32px;">${p.logoIcon || 'store'}</span>`,
    category: p.category,
    title: r.title,
    points: r.taw,
    brandName: p.name,
    description: r.desc,
    expires: 'Dec 31, 2026',
    usage: 'One-time Use',
    terms: [
      'Valid at participating locations only.',
      'Cannot be combined with other offers.',
      'Subject to availability.',
      'Taw points will be deducted upon confirmation.'
    ]
  };
  openRewardDetails(tempKey);
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
  if (typeof applyLanguage === 'function') {
    applyLanguage(typeof currentLang !== 'undefined' ? currentLang : 'en');
  }
};

/** Opens email draft so the user can suggest a partner / location (reward details page). */
window.requestRewardPartnerSuggestion = function () {
  const brand = document.getElementById('rd-brand-name')?.textContent?.trim() || '';
  const title = document.getElementById('rd-title')?.textContent?.trim() || '';
  const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
  const subject = isAr
    ? encodeURIComponent(`اقتراح شريك — ${brand || 'طوع'}`)
    : encodeURIComponent(`Partner suggestion — ${brand || 'Taw'}`);
  const body = isAr
    ? encodeURIComponent(
        `أود اقتراح شريك أو مكافأة غير مدرجة.\n\nالعرض الحالي: ${title}\nالعلامة: ${brand}\n\n`
      )
    : encodeURIComponent(
        `I would like to suggest a partner or reward that is missing.\n\nCurrent deal: ${title}\nBrand: ${brand}\n\n`
      );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

// ── Focus Trap Utility ──
let _focusTrapCleanup = null;
let _focusReturnEl = null;

function trapFocus(modalEl, opts = {}) {
  if (_focusTrapCleanup) _focusTrapCleanup();
  _focusReturnEl = document.activeElement;
  const focusable = modalEl.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  function handleKey(e) {
    if (e.key === 'Escape' && typeof opts.onEscape === 'function') {
      e.preventDefault();
      opts.onEscape(e);
      return;
    }
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  modalEl.addEventListener('keydown', handleKey);
  _focusTrapCleanup = () => modalEl.removeEventListener('keydown', handleKey);
}

function releaseFocus() {
  if (_focusTrapCleanup) { _focusTrapCleanup(); _focusTrapCleanup = null; }
  if (_focusReturnEl) { _focusReturnEl.focus({ preventScroll: true }); _focusReturnEl = null; }
}

// ── Confirm Application Modal ──
window.showConfirmApplication = function() {
  if (!authState.session) { showAuthPrompt('apply for this event'); return; }
  const modal = document.getElementById('modal-confirm-application');
  if (modal) {
    // Show which event was applied for
    const event = _currentEventId ? eventsData[_currentEventId] : null;
    const subtitleEl = document.getElementById('confirm-app-subtitle');
    if (subtitleEl && event) {
      const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
      const prefix = isAr ? 'لقد سجّلت بنجاح في' : 'You have successfully applied for';
      subtitleEl.textContent = `${prefix} "${event.title}".`;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    trapFocus(modal, {
      onEscape: () => hideConfirmApplication()
    });
  }
};

window.hideConfirmApplication = function(event) {
  if (event && event.target !== document.getElementById('modal-confirm-application')) return;
  const modal = document.getElementById('modal-confirm-application');
  modal.classList.add('modal-exiting');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('modal-exiting');
    document.body.style.overflow = '';
  }, 250);
  releaseFocus();
};

// ── Confirm Redemption Modal ──
let _currentRewardForRedemption = null;

window.showConfirmRedemption = function() {
  if (!authState.session) { showAuthPrompt('redeem this reward'); return; }
  const rewardId = _currentRewardForRedemption;
  const reward = rewardId ? rewardsData[rewardId] : null;
  if (!reward) return;

  // Populate modal
  const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
  document.getElementById('cr-brand-logo').innerHTML = reward.logoHtml;
  document.getElementById('cr-title').textContent = reward.title;
  document.getElementById('cr-sub').textContent = `${isAr ? 'صالح في' : 'Valid at'} ${reward.brandName}.`;
  document.getElementById('cr-cost').textContent = `${reward.points} ${isAr ? 'طوع' : 'Taw'}`;

  const modal = document.getElementById('modal-confirm-redemption');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  trapFocus(modal, {
    onEscape: () => hideConfirmRedemption()
  });
};

window.hideConfirmRedemption = function(event) {
  if (event && event.target !== document.getElementById('modal-confirm-redemption')) return;
  const modal = document.getElementById('modal-confirm-redemption');
  modal.classList.add('modal-exiting');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('modal-exiting');
    document.body.style.overflow = '';
  }, 250);
  releaseFocus();
};

window.confirmRedemption = function() {
  const rewardId = _currentRewardForRedemption;
  const reward = rewardId ? rewardsData[rewardId] : null;
  if (!reward) return;

  // Hide modal
  document.getElementById('modal-confirm-redemption').style.display = 'none';
  document.body.style.overflow = '';
  releaseFocus();

  // Generate redemption code
  const code = `TAW-${reward.brandName.split(' ')[0].toUpperCase()}-${new Date().getFullYear()}`;

  // Populate Reward Redeemed page
  const isArRedeemed = typeof currentLang !== 'undefined' && currentLang === 'ar';
  document.getElementById('rr-logo').innerHTML = reward.logoHtml;
  document.getElementById('rr-title').textContent = reward.title;
  document.getElementById('rr-subtitle').textContent = isArRedeemed
    ? 'تم تحويل نقاط طوع الخاصة بك إلى مكافأة رائعة.'
    : 'Your Tawwa Points have been converted into a great reward.';
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

  // Populate dynamic "how to use" text
  const howToUseEl = document.getElementById('rr-how-to-use-text');
  if (howToUseEl && reward.howToUse) howToUseEl.textContent = reward.howToUse;

  // Populate hero image if available
  const heroEl = document.getElementById('rr-hero-img');
  if (heroEl) heroEl.src = reward.heroImg || '';

  // Navigate to redeemed page
  navigateTo('reward-redeemed');
  startRedemptionCountdown();

  // Calculate and display 48-hour expiry
  const now = new Date();
  const expiry = new Date(now.getTime() + (48 * 60 * 60 * 1000));
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const locale = (typeof currentLang !== 'undefined' && currentLang === 'ar') ? 'ar-BH' : 'en-US';
  document.getElementById('rr-expires-time').textContent = expiry.toLocaleDateString(locale, options);
};

// ── Redemption Countdown Timer ──
let _countdownInterval = null;
function startRedemptionCountdown() {
  if (_countdownInterval) clearInterval(_countdownInterval);
  let seconds = 15 * 60;
  const el = document.getElementById('rr-countdown');
  function tick() {
    if (!el) return;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    el.textContent = m + ':' + s;
    if (seconds <= 0) { clearInterval(_countdownInterval); return; }
    seconds--;
  }
  tick();
  _countdownInterval = setInterval(tick, 1000);
}

// ── Copy Redemption Code ──
window.copyRedemptionCode = function() {
  const code = document.getElementById('rr-code')?.textContent;
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    const icon = document.getElementById('rr-copy-icon');
    if (icon) {
      icon.textContent = 'check';
      setTimeout(() => { icon.textContent = 'content_copy'; }, 2000);
    }
    if (typeof showToast === 'function') showToast('Code copied to clipboard', 'success');
  }).catch(() => {
    if (typeof showToast === 'function') showToast('Could not copy — try selecting the code manually', 'error');
  });
};

// ── Auth Page Logic ──
let authMode = 'signin'; // 'signin' or 'signup'

// Auth text mapped by language
const authText = {
  en: {
    signInTitle: 'Welcome Back',
    signUpTitle: 'Create Account',
    signInSubtitle: 'Sign in to continue your volunteer journey.',
    signUpSubtitle: 'Sign up to start your volunteer journey.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    hasAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    nameLabel: 'Full Name',
    namePlaceholder: 'Your Name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Your password',
  },
  ar: {
    signInTitle: 'أهلاً بعودتك',
    signUpTitle: 'إنشاء حساب',
    signInSubtitle: 'سجّل دخولك لمتابعة رحلتك التطوعية.',
    signUpSubtitle: 'أنشئ حساباً لتبدأ رحلتك التطوعية.',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    hasAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'اسمك',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'كلمة المرور',
  }
};

function setAuthMode(mode) {
  authMode = mode;
  const isSignUp = mode === 'signup';
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  const t = authText[lang] || authText.en;

  document.getElementById('auth-title').textContent = isSignUp ? t.signUpTitle : t.signInTitle;
  document.getElementById('auth-subtitle').textContent = isSignUp ? t.signUpSubtitle : t.signInSubtitle;
  document.getElementById('auth-submit-text').textContent = isSignUp ? t.signUp : t.signIn;
  document.getElementById('auth-toggle-text').textContent = isSignUp ? t.hasAccount : t.noAccount;
  document.getElementById('auth-toggle-btn').textContent = isSignUp ? t.signIn : t.signUp;

  // Update labels and placeholders
  const nameLabel = document.querySelector('label[for="auth-name"]');
  const emailLabel = document.querySelector('label[for="auth-email"]');
  const passLabel = document.querySelector('label[for="auth-password"]');
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  if (nameLabel) nameLabel.textContent = t.nameLabel;
  if (emailLabel) emailLabel.textContent = t.emailLabel;
  if (passLabel) passLabel.textContent = t.passwordLabel;
  if (nameInput) nameInput.placeholder = t.namePlaceholder;
  if (emailInput) emailInput.placeholder = t.emailPlaceholder;
  if (passInput) passInput.placeholder = t.passwordPlaceholder;

  // Toggle Name Field visibility and requirement
  const nameContainer = document.getElementById('auth-name-container');
  if (nameContainer && nameInput) {
    nameContainer.style.display = isSignUp ? 'block' : 'none';
    nameInput.required = isSignUp;
  }

  // Clear errors
  document.getElementById('auth-error').style.display = 'none';

  // Show/hide onboarding progress indicator
  const progressBar = document.getElementById('onboarding-progress-auth');
  if (progressBar) progressBar.style.display = isSignUp ? 'flex' : 'none';
}

function toggleAuthMode() {
  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
}

window.goToSignUp = function() {
  navigateTo('auth');
  setAuthMode('signup');
};

// ── Real-time Form Validation ──
;(function initFormValidation() {
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const emailWrap = document.getElementById('email-input-wrap');
  const passWrap = document.getElementById('password-input-wrap');
  const emailError = document.getElementById('email-error');
  const passError = document.getElementById('password-error');
  const strengthEl = document.getElementById('password-strength');
  if (!emailInput || !passInput) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailTimer = null;

  emailInput.addEventListener('input', () => {
    clearTimeout(emailTimer);
    emailTimer = setTimeout(() => {
      const val = emailInput.value.trim();
      if (!val) {
        emailWrap.classList.remove('invalid', 'valid');
        emailError.textContent = '';
      } else if (!emailRegex.test(val)) {
        emailWrap.classList.add('invalid');
        emailWrap.classList.remove('valid');
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        emailError.textContent = isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
      } else {
        emailWrap.classList.add('valid');
        emailWrap.classList.remove('invalid');
        emailError.textContent = '';
      }
    }, 300);
  });

  passInput.addEventListener('input', () => {
    const val = passInput.value;
    // Show strength indicator during signup
    if (authMode === 'signup' && strengthEl) strengthEl.style.display = val ? 'flex' : 'none';

    if (!val) {
      passWrap.classList.remove('invalid', 'valid');
      passError.textContent = '';
      return;
    }
    if (val.length < 6) {
      passWrap.classList.add('invalid');
      passWrap.classList.remove('valid');
      const isArPass = typeof currentLang !== 'undefined' && currentLang === 'ar';
      passError.textContent = isArPass ? 'يجب أن تكون كلمة المرور ٦ أحرف على الأقل' : 'Password must be at least 6 characters';
    } else {
      passWrap.classList.add('valid');
      passWrap.classList.remove('invalid');
      passError.textContent = '';
    }

    // Password strength meter
    if (strengthEl) {
      const bars = strengthEl.querySelectorAll('.strength-bar');
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;

      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < score) {
          bar.classList.add(score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong');
        }
      });
    }
  });

  // Clear validation states on mode change
  const origSetAuthMode = setAuthMode;
  setAuthMode = function(mode) {
    origSetAuthMode(mode);
    emailWrap.classList.remove('invalid', 'valid');
    passWrap.classList.remove('invalid', 'valid');
    emailError.textContent = '';
    passError.textContent = '';
    if (strengthEl) strengthEl.style.display = 'none';
  };
})();

async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const nameInput = document.getElementById('auth-name');
  const name = nameInput ? nameInput.value.trim() : '';
  const submitBtn = document.getElementById('auth-submit-btn');
  const spinner = document.getElementById('auth-spinner');
  const submitText = document.getElementById('auth-submit-text');
  const errorEl = document.getElementById('auth-error');
  const errorText = document.getElementById('auth-error-text');

  // Show loading
  submitBtn.disabled = true;
  spinner.style.display = 'inline-flex';
  submitText.style.opacity = '0.5';
  errorEl.style.display = 'none';

  try {
    if (authSchema) {
      const parsed = authSchema.safeParse({ email, password, name: authMode === 'signup' ? name : undefined });
      if (!parsed.success) {
         throw new Error(parsed.error.errors[0].message);
      }
    }

    if (authMode === 'signup') {
      if (authSchema && name.trim().length < 2) throw new Error("Name must be at least 2 characters");
      await signUp(email, password, name);
      if (typeof showToast === 'function') {
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        showToast(isAr ? 'تم إنشاء الحساب' : 'Account created', 'success');
      }
      // After sign-up, go to interests onboarding
      navigateTo('interests');
    } else {
      const authData = await signIn(email, password);
      
      // Fetch profile and check role
      const { data: profile, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
        
      if (!profileErr && profile && profile.role) {
        // Cross-app routing based on role
        // In this non-module script, we use the known dev ports or rely on the prod domains
        const origin = window.location.origin;
        // In local development, the apps are on 3000, 5173, 5174. In prod, they would be subdomains or separate domains.
        // For MVP, we route localports. If we are in production, change to correct prod URLs.
        let adminUrl = origin.includes('localhost') ? 'http://localhost:5173' : 'https://admin.tawwa.io'; // Example prod URL
        let partnerUrl = origin.includes('localhost') ? 'http://localhost:5174' : 'https://partner.tawwa.io';
        let mainUrl = origin.includes('localhost') ? 'http://localhost:3000' : origin;

        const dest = {
          super_admin:    adminUrl,
          business_owner: partnerUrl,
          organisation:   partnerUrl,
          volunteer:      mainUrl,
        }[profile.role];

        if (dest && dest !== origin && dest !== mainUrl) {
          window.location.href = dest;
          return;
        }
      }

      if (typeof showToast === 'function') {
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        showToast(isAr ? 'تم تسجيل الدخول' : 'Signed in successfully', 'success');
      }
      navigateTo('home');
    }
    // Clear form
    document.getElementById('auth-form').reset();
  } catch (err) {
    errorText.textContent = err.message || 'Authentication failed. Please try again.';
    errorEl.style.display = 'flex';
  } finally {
    submitBtn.disabled = false;
    spinner.style.display = 'none';
    submitText.style.opacity = '1';
  }
}

async function handleSignOut() {
  const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
  const ok = typeof showConfirmDestructive === 'function'
    ? await showConfirmDestructive({
        title: isAr ? 'تسجيل الخروج؟' : 'Sign out?',
        message: isAr ? 'ستحتاج لتسجيل الدخول مرة أخرى للوصول إلى حسابك.' : 'You will need to sign in again to access your account.',
        confirmText: isAr ? 'تسجيل الخروج' : 'Sign out',
        cancelText: isAr ? 'إلغاء' : 'Cancel',
        danger: false
      })
    : true;
  if (!ok) return;

  try {
    await signOut();
  } catch (e) {
    // Ignore sign-out errors
  }
  authState.session = null;
  authState.user = null;
  if (typeof showToast === 'function') showToast(isAr ? 'تم تسجيل الخروج' : 'Signed out', 'success');
  navigateTo('landing');
  pageHistory = ['landing'];
}
