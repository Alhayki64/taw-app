/* =============================================
   TAW — PROFILE, AVATAR & ONBOARDING
   ============================================= */

// ── Counter animation (values set by points.js) ──
function animateCounters() {}

function animateValue(el, start, end, duration, suffix) {
  const startTime = performance.now();
  const format = (v) => v.toLocaleString() + suffix;
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(Math.round(start + (end - start) * eased));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Trigger counter animation when profile page becomes active
const profilePage = document.getElementById('page-profile');
if (profilePage) {
  new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.target.classList.contains('active') && m.target.id === 'page-profile') {
        setTimeout(animateCounters, 300);
      }
    });
  }).observe(profilePage, { attributes: true, attributeFilter: ['class'] });
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

  const avatarUrl = user.user_metadata?.avatar_url;
  if (avatarUrl) {
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
        img.src = avatarUrl;
        img.style.display = 'block';
      }
    }

    const notifPermAvatar = document.getElementById('notif-perm-avatar-img');
    if (notifPermAvatar) notifPermAvatar.src = avatarUrl;
    const epAvatar = document.getElementById('ep-avatar-img');
    if (epAvatar) epAvatar.src = avatarUrl;

    ['home-avatar', 'market-avatar', 'onboarding-avatar-ui'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      let mascotImg = el.querySelector('.notif-mascot-img');
      if (mascotImg) {
        mascotImg.src = avatarUrl;
      } else {
        let img = el.querySelector('.nav-custom-avatar');
        if (!img) {
          img = document.createElement('img');
          img.className = 'nav-custom-avatar';
          el.appendChild(img);
          const icon = el.querySelector('.material-icons-round');
          if (icon && !icon.parentElement.classList.contains('avatar-edit-overlay')) {
            icon.style.display = 'none';
          }
        }
        img.src = avatarUrl;
      }
    });
  }
}

// ── Avatar Upload ──
window.handleAvatarUpload = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 150;
      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;
      const ctx = canvas.getContext('2d');
      const size = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, MAX_SIZE, MAX_SIZE);
      const base64String = canvas.toDataURL('image/jpeg', 0.65);

      const overlay = document.querySelector('.avatar-edit-overlay .material-icons-round');
      if (overlay) { overlay.classList.add('spinning'); overlay.textContent = 'refresh'; }

      try {
        if (typeof supabaseClient !== 'undefined') {
          const { data, error } = await supabaseClient.auth.updateUser({ data: { avatar_url: base64String } });
          if (error) throw error;
          if (data?.user) { authState.user = data.user; updateUserDisplay(); }
        }
      } catch (err) {
        if (typeof showToast === 'function') showToast('Failed to save profile image. Please try again.', 'error');
      } finally {
        if (overlay) { overlay.classList.remove('spinning'); overlay.textContent = 'camera_alt'; }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// ── Notif Permission — Story Carousel ──
let _npCurrentStory = 1;
const NP_TOTAL_STORIES = 3;

function advanceNotifStory() {
  if (_npCurrentStory >= NP_TOTAL_STORIES) return;
  const prev = _npCurrentStory++;
  document.getElementById(`np-story-${prev}`)?.classList.remove('active');
  document.getElementById(`np-story-${_npCurrentStory}`)?.classList.add('active');
  document.getElementById(`np-dot-${prev}`)?.classList.remove('active');
  document.getElementById(`np-dot-${_npCurrentStory}`)?.classList.add('active');
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
    document.getElementById(`np-story-${i}`)?.classList.toggle('active', i === 1);
    document.getElementById(`np-dot-${i}`)?.classList.toggle('active', i === 1);
  }
  const nextBtn = document.getElementById('np-btn-next');
  const finalActions = document.getElementById('np-final-actions');
  if (nextBtn) nextBtn.style.display = '';
  if (finalActions) finalActions.style.display = 'none';
}

// ── Notif Permission Photo Sheet ──
function showNotifPermPhotoSheet() {
  const sheet = document.getElementById('notif-perm-photo-sheet');
  if (!sheet) return;
  sheet.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideNotifPermPhotoSheet() {
  const sheet = document.getElementById('notif-perm-photo-sheet');
  if (!sheet) return;
  sheet.style.display = 'none';
  document.body.style.overflow = '';
}

function notifPermTakePhoto() {
  hideNotifPermPhotoSheet();
  document.getElementById('notif-perm-camera-input')?.click();
}

function notifPermChooseGallery() {
  hideNotifPermPhotoSheet();
  document.getElementById('notif-perm-gallery-input')?.click();
}

function notifPermRemovePhoto() {
  hideNotifPermPhotoSheet();
  const avatarImg = document.getElementById('notif-perm-avatar-img');
  if (avatarImg) avatarImg.src = 'default_avatar.png';
  if (typeof supabaseClient !== 'undefined' && authState.user) {
    supabaseClient.auth.updateUser({ data: { avatar_url: null } }).then(() => {
      authState.user = { ...authState.user, user_metadata: { ...authState.user.user_metadata, avatar_url: null } };
      updateUserDisplay();
    });
  }
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
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
      const base64 = canvas.toDataURL('image/jpeg', 0.72);

      const avatarImg = document.getElementById('notif-perm-avatar-img');
      if (avatarImg) avatarImg.src = base64;

      if (typeof supabaseClient !== 'undefined' && authState.user) {
        try {
          const { data, error } = await supabaseClient.auth.updateUser({ data: { avatar_url: base64 } });
          if (!error && data?.user) { authState.user = data.user; updateUserDisplay(); }
        } catch (err) { /* silent */ }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// ── Edit Profile ──
function initEditProfile() {
  const user = authState.user;
  if (!user) return;
  const name = user.user_metadata?.full_name || '';
  const phone = user.user_metadata?.phone || '';
  const bio = user.user_metadata?.bio || '';
  const avatarUrl = user.user_metadata?.avatar_url;

  const nameEl = document.getElementById('ep-name');
  const emailEl = document.getElementById('ep-email');
  const phoneEl = document.getElementById('ep-phone');
  const bioEl = document.getElementById('ep-bio');
  const avatarEl = document.getElementById('ep-avatar-img');

  if (nameEl) nameEl.value = name;
  if (emailEl) emailEl.value = user.email || '';
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
      if (!parsed.success) throw new Error(parsed.error.errors[0].message);
    }
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient.auth.updateUser({ data: { full_name: name, phone, bio } });
      if (error) throw error;
      if (data?.user) { authState.user = data.user; updateUserDisplay(); }
    }
    goBack();
  } catch (err) {
    if (typeof showToast === 'function') showToast('Failed to save. Please try again.', 'error');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
    if (saveText) saveText.style.display = '';
    if (saveSpinner) saveSpinner.style.display = 'none';
  }
}
