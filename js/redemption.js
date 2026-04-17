/* =============================================
   TAW — REWARD DETAILS & REDEMPTION
   ============================================= */

let _currentRewardForRedemption = null;

// ── Show Reward Details ──
window.openRewardDetails = function(rewardId) {
  const reward = rewardsData[rewardId];
  if (!reward) return;

  _currentRewardForRedemption = rewardId;

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

  const termsList = document.getElementById('rd-terms');
  termsList.innerHTML = '';
  reward.terms.forEach(term => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="bullet">•</span><span>${term}</span>`;
    termsList.appendChild(li);
  });

  navigateTo('reward-details');
};

// ── Confirm Application Modal ──
window.showConfirmApplication = function() {
  if (!authState.session) { showAuthPrompt('apply for this event'); return; }
  const modal = document.getElementById('modal-confirm-application');
  if (modal) {
    const event = _currentEventId ? eventsData[_currentEventId] : null;
    const subtitleEl = document.getElementById('confirm-app-subtitle');
    if (subtitleEl && event) {
      const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
      const prefix = isAr ? 'لقد سجّلت بنجاح في' : 'You have successfully applied for';
      subtitleEl.textContent = `${prefix} "${event.title}".`;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    trapFocus(modal);
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
window.showConfirmRedemption = function() {
  if (!authState.session) { showAuthPrompt('redeem this reward'); return; }
  const rewardId = _currentRewardForRedemption;
  const reward = rewardId ? rewardsData[rewardId] : null;
  if (!reward) return;

  const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
  document.getElementById('cr-brand-logo').innerHTML = reward.logoHtml;
  document.getElementById('cr-title').textContent = reward.title;
  document.getElementById('cr-sub').textContent = `${isAr ? 'صالح في' : 'Valid at'} ${reward.brandName}.`;
  document.getElementById('cr-cost').textContent = `${reward.points} ${isAr ? 'طوع' : 'Taw'}`;

  const modal = document.getElementById('modal-confirm-redemption');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  trapFocus(modal);
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

  document.getElementById('modal-confirm-redemption').style.display = 'none';
  document.body.style.overflow = '';

  const code = `TAW-${reward.brandName.split(' ')[0].toUpperCase()}-${new Date().getFullYear()}`;

  const isArRedeemed = typeof currentLang !== 'undefined' && currentLang === 'ar';
  document.getElementById('rr-logo').innerHTML = reward.logoHtml;
  document.getElementById('rr-title').textContent = reward.title;
  document.getElementById('rr-subtitle').textContent = isArRedeemed
    ? 'تم تحويل نقاط طوع الخاصة بك إلى مكافأة رائعة.'
    : 'Your Taw Points have been converted into a great reward.';
  document.getElementById('rr-code').textContent = code;

  const qrEl = document.getElementById('rr-qr');
  qrEl.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="8" fill="white"/>
      <rect x="10" y="10" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="16" y="16" width="24" height="24" rx="2" fill="white"/>
      <rect x="20" y="20" width="16" height="16" rx="1" fill="#1d1c17"/>
      <rect x="94" y="10" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="100" y="16" width="24" height="24" rx="2" fill="white"/>
      <rect x="104" y="20" width="16" height="16" rx="1" fill="#1d1c17"/>
      <rect x="10" y="94" width="36" height="36" rx="4" fill="#1d1c17"/>
      <rect x="16" y="100" width="24" height="24" rx="2" fill="white"/>
      <rect x="20" y="104" width="16" height="16" rx="1" fill="#1d1c17"/>
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

  const howToUseEl = document.getElementById('rr-how-to-use-text');
  if (howToUseEl && reward.howToUse) howToUseEl.textContent = reward.howToUse;

  const heroEl = document.getElementById('rr-hero-img');
  if (heroEl) heroEl.src = reward.heroImg || '';

  navigateTo('reward-redeemed');
  if (typeof startRedemptionCountdown === 'function') startRedemptionCountdown();

  const now = new Date();
  const expiry = new Date(now.getTime() + (48 * 60 * 60 * 1000));
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const locale = (typeof currentLang !== 'undefined' && currentLang === 'ar') ? 'ar-BH' : 'en-US';
  document.getElementById('rr-expires-time').textContent = expiry.toLocaleDateString(locale, options);
};

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
