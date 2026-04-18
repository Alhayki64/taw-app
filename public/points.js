<<<<<<< HEAD
/* =============================================
   TAW (طوع) — POINTS SYSTEM
   Extends the existing app without modifying it.
   ============================================= */

// ── Fetch points data ─────────────────────────────────────────────────────────

async function getUserPoints(userId) {
  const token = await getAccessToken();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-user-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId })
  })
  return res.json()
}

// ── Redeem a deal ─────────────────────────────────────────────────────────────

async function redeemDeal(userId, dealId) {
  const token = await getAccessToken();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/redeem-deal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId, deal_id: dealId })
  })
  return res.json()
}

// ── Load and render points on the profile page ────────────────────────────────

async function loadProfilePoints(userId) {
  let data
  try {
    data = await getUserPoints(userId)
  } catch (e) {
    console.error('Failed to load profile points', e)
    showToast('Could not load points data', 'error')
    return
  }
  if (data.error) {
    showToast('Could not load points data', 'error')
    return
  }

  const { current_balance, lifetime_points, tier, next_tier, transactions } = data

  // 1. Update stat-points card with real balance
  const pointsValueEl = document.getElementById('stat-points-value')
  if (pointsValueEl) {
    pointsValueEl.textContent = current_balance.toLocaleString()
  }

  // 2. Fetch confirmed sessions to calculate real total hours
  if (typeof fetchUserSessions === 'function') {
    try {
      const sessions = await fetchUserSessions(userId)
      const totalHours = sessions.reduce((sum, s) => sum + (s.hours_confirmed || 0), 0)
      const hoursValueEl = document.getElementById('stat-hours-value')
      if (hoursValueEl) {
        hoursValueEl.textContent = `${totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)} hrs`
      }
    } catch (e) {
      console.error('Failed to fetch session hours', e)
    }
  }

  // 2. Inject tier badge + progress bar after the stats grid
  const statsGrid = document.getElementById('profile-stats')
  if (statsGrid) {
    const existing = document.getElementById('profile-tier-section')
    if (existing) existing.remove()

    const progress = next_tier
      ? Math.round(
          ((lifetime_points - (tier?.min_lifetime_points ?? 0)) /
           (next_tier.min_lifetime_points - (tier?.min_lifetime_points ?? 0))) * 100
        )
      : 100

    const tierSection = document.createElement('div')
    tierSection.id = 'profile-tier-section'
    tierSection.className = 'profile-tier-section'
    tierSection.innerHTML = `
      <div class="tier-badge-pill" style="background:#${tier?.badge_color ?? '6B8A94'}">
        <span class="material-icons-round">military_tech</span>
        <span>${tier?.name_ar ?? 'مبتدئ'} · ${tier?.name_en ?? 'Beginner'}</span>
      </div>
      ${next_tier ? `
        <div class="tier-progress-wrap">
          <div class="tier-progress-track">
            <div class="tier-progress-fill" style="width:${progress}%"></div>
          </div>
          <p class="tier-progress-label">
            ${(next_tier.min_lifetime_points - lifetime_points).toLocaleString()} pts to
            ${next_tier.name_ar} · ${next_tier.name_en}
          </p>
        </div>
      ` : '<p class="tier-max-label">Maximum tier reached ✦</p>'}
    `
    statsGrid.insertAdjacentElement('afterend', tierSection)
  }

  // 3. Inject points activity list before the volunteer history section
  if (!transactions || transactions.length === 0) {
    const historySection = document.querySelector('.history-list')?.closest('section.section')
    if (historySection) {
      const existing = document.getElementById('points-activity-section')
      if (existing) existing.remove()
      const emptySection = document.createElement('section')
      emptySection.className = 'section'
      emptySection.id = 'points-activity-section'
      if (typeof renderEmptyState === 'function') {
        emptySection.innerHTML = '<div class="section-header"><h2 class="section-title">Points Activity</h2></div>'
        const emptyWrap = document.createElement('div')
        renderEmptyState(emptyWrap, { icon: 'history', title: 'No activity yet', text: 'Start volunteering to earn your first points!' })
        emptySection.appendChild(emptyWrap)
        historySection.insertAdjacentElement('beforebegin', emptySection)
      }
    }
    return
  }
  if (transactions && transactions.length > 0) {
    const historySection = document.querySelector('.history-list')?.closest('section.section')
    if (historySection) {
      const existing = document.getElementById('points-activity-section')
      if (existing) existing.remove()

      const activitySection = document.createElement('section')
      activitySection.className = 'section'
      activitySection.id = 'points-activity-section'
      activitySection.innerHTML = `
        <div class="section-header">
          <h2 class="section-title">Points Activity</h2>
        </div>
        <div class="points-activity-list">
          ${transactions.slice(0, 5).map(tx => `
            <div class="points-activity-row">
              <div class="activity-icon-wrap ${tx.amount > 0 ? 'activity-icon-earn' : 'activity-icon-spend'}">
                <span class="material-icons-round">${tx.amount > 0 ? 'add_circle_outline' : 'remove_circle_outline'}</span>
              </div>
              <div class="activity-info">
                <span class="activity-type-label">${formatTxType(tx.type)}</span>
                <span class="activity-date-label">${formatDate(tx.created_at)}</span>
              </div>
              <span class="activity-amount-label ${tx.amount > 0 ? 'amount-earn' : 'amount-spend'}">
                ${tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString()}
              </span>
            </div>
          `).join('')}
        </div>
      `
      historySection.insertAdjacentElement('beforebegin', activitySection)
    }
  }
}

// ── Watch profile page activation and load real data ─────────────────────────

;(function () {
  const profilePage = document.getElementById('page-profile')
  if (!profilePage) return

  const pointsObserver = new MutationObserver(async (mutations) => {
    for (const m of mutations) {
      if (m.target.classList.contains('active') && m.target.id === 'page-profile') {
        const session = await getSession()
        if (session?.user?.id) loadProfilePoints(session.user.id)
        break
      }
    }
  })
  pointsObserver.observe(profilePage, { attributes: true, attributeFilter: ['class'] })
})()

// ── Override showConfirmRedemption to show real balance ───────────────────────

const _origShowConfirmRedemption = window.showConfirmRedemption

window.showConfirmRedemption = async function () {
  _origShowConfirmRedemption()

  const session = await getSession()
  if (!session?.user?.id) return

  try {
    const data = await getUserPoints(session.user.id)
    if (data.current_balance == null) return
    const balanceEl = document.getElementById('cr-balance')
    if (balanceEl) balanceEl.textContent = `${data.current_balance.toLocaleString()} Taw`
  } catch (e) {
    console.error('Failed to load balance for redemption modal', e)
  }
}

// ── Override confirmRedemption to call the backend when a deal_id is set ──────
// Static rewards in rewardsData without deal_id fall back to the original flow.

let _activeRedemption = null
let _countdownTimer   = null

const _origConfirmRedemption = window.confirmRedemption

window.confirmRedemption = async function () {
  const rewardId = _currentRewardForRedemption
  const reward   = rewardId ? rewardsData[rewardId] : null
  if (!reward) return

  // No Supabase deal ID → keep original static behaviour
  if (!reward.deal_id) {
    _origConfirmRedemption()
    return
  }

  const confirmBtn = document.querySelector('.confirm-btn-primary')
  if (confirmBtn) {
    confirmBtn.disabled    = true
    confirmBtn.textContent = 'Processing…'
  }

  try {
    const session = await getSession()
    if (!session) {
      showToast('Please sign in to redeem deals', 'error')
      return
    }

    const data = await redeemDeal(session.user.id, reward.deal_id)

    if (data.error) {
      showToast(data.error, 'error')
      return
    }

    _activeRedemption = data

    // Hide modal
    document.getElementById('modal-confirm-redemption').style.display = 'none'
    document.body.style.overflow = ''

    // Populate the reward-redeemed page
    const code = data.redemption_id.slice(0, 8).toUpperCase()
    document.getElementById('rr-logo').innerHTML  = reward.logoHtml
    document.getElementById('rr-title').textContent    = reward.title
    document.getElementById('rr-subtitle').textContent = `${data.points_spent.toLocaleString()} points redeemed.`
    document.getElementById('rr-code').textContent     = code

    // Live countdown on the redeemed page
    startRedemptionCountdown(data.expires_at)

    navigateTo('reward-redeemed')

    // Refresh balance on profile
    loadProfilePoints(session.user.id)
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false
      confirmBtn.innerHTML = '<span class="material-icons-round">verified_user</span> Confirm Purchase'
    }
  }
}

// ── 15-minute countdown on the reward-redeemed page ──────────────────────────

function startRedemptionCountdown(expiresAt) {
  const expiryTime = new Date(expiresAt)

  if (_countdownTimer) clearInterval(_countdownTimer)

  const expiresEl = document.getElementById('rr-expires-time')
  if (expiresEl) {
    expiresEl.textContent = expiryTime.toLocaleTimeString('en-BH', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  const mainEl = document.querySelector('.countdown-main')

  _countdownTimer = setInterval(() => {
    const remaining = Math.max(0, expiryTime - Date.now())
    const mins = Math.floor(remaining / 60000)
    const secs = Math.floor((remaining % 60000) / 1000)

    if (mainEl) {
      mainEl.textContent = remaining > 0
        ? `Valid for ${mins}:${secs.toString().padStart(2, '0')}`
        : 'Expired'
      if (remaining === 0) mainEl.style.color = 'red'
    }

    if (remaining === 0) clearInterval(_countdownTimer)
  }, 1000)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTxType(type) {
  const labels = {
    earn_base:             'Volunteering',
    earn_bonus_firsttime:  'First-time bonus',
    earn_bonus_skills:     'Skills bonus',
    earn_bonus_repeat_org: 'Loyalty bonus',
    earn_bonus_urgent:     'Urgent session bonus',
    earn_bonus_group:      'Group referral bonus',
    redeem:                'Deal redeemed',
    expire:                'Points expired',
    admin_adjust:          'Adjustment'
  }
  return labels[type] || type
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-BH', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function showToast(message, type = 'info', duration = 4000) {
  const icons = { success: 'check_circle', error: 'error_outline', info: 'info' }
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.setAttribute('role', 'status')
  toast.setAttribute('aria-live', 'polite')
  toast.innerHTML = `<span class="material-icons-round toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('toast-exit')
    toast.addEventListener('animationend', () => toast.remove())
  }, duration)
}
=======
/* =============================================
   Tawwa (طوّع) — POINTS SYSTEM
   Extends the existing app without modifying it.
   ============================================= */

// ── Fetch points data ─────────────────────────────────────────────────────────

async function getUserPoints(userId) {
  const token = await getAccessToken();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-user-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId })
  })
  return res.json()
}

// ── Redeem a deal ─────────────────────────────────────────────────────────────

async function redeemDeal(userId, dealId) {
  const token = await getAccessToken();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/redeem-deal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId, deal_id: dealId })
  })
  return res.json()
}

// ── Load and render points on the profile page ────────────────────────────────

async function loadProfilePoints(userId) {
  let data
  try {
    data = await getUserPoints(userId)
  } catch (e) {
    console.error('Failed to load profile points', e)
    showToast('Could not load points data', 'error')
    return
  }
  if (data.error) {
    showToast('Could not load points data', 'error')
    return
  }

  const { current_balance, lifetime_points, tier, next_tier, transactions } = data

  // 1. Update stat-points card with real balance
  const pointsValueEl = document.getElementById('stat-points-value')
  if (pointsValueEl) {
    pointsValueEl.textContent = current_balance.toLocaleString()
  }

  // 2. Fetch confirmed sessions to calculate real total hours
  if (typeof fetchUserSessions === 'function') {
    try {
      const sessions = await fetchUserSessions(userId)
      const totalHours = sessions.reduce((sum, s) => sum + (s.hours_confirmed || 0), 0)
      const hoursValueEl = document.getElementById('stat-hours-value')
      if (hoursValueEl) {
        hoursValueEl.textContent = `${totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)} hrs`
      }
    } catch (e) {
      console.error('Failed to fetch session hours', e)
    }
  }

  // 2. Inject tier badge + progress bar after the stats grid
  const statsGrid = document.getElementById('profile-stats')
  if (statsGrid) {
    const existing = document.getElementById('profile-tier-section')
    if (existing) existing.remove()

    const progress = next_tier
      ? Math.round(
          ((lifetime_points - (tier?.min_lifetime_points ?? 0)) /
           (next_tier.min_lifetime_points - (tier?.min_lifetime_points ?? 0))) * 100
        )
      : 100

    const tierSection = document.createElement('div')
    tierSection.id = 'profile-tier-section'
    tierSection.className = 'profile-tier-section'
    tierSection.innerHTML = `
      <div class="tier-badge-pill" style="background:#${tier?.badge_color ?? '6B8A94'}">
        <span class="material-icons-round">military_tech</span>
        <span>${tier?.name_ar ?? 'مبتدئ'} · ${tier?.name_en ?? 'Beginner'}</span>
      </div>
      ${next_tier ? `
        <div class="tier-progress-wrap">
          <div class="tier-progress-track">
            <div class="tier-progress-fill" style="width:${progress}%"></div>
          </div>
          <p class="tier-progress-label">
            ${(next_tier.min_lifetime_points - lifetime_points).toLocaleString()} pts to
            ${next_tier.name_ar} · ${next_tier.name_en}
          </p>
        </div>
      ` : '<p class="tier-max-label">Maximum tier reached ✦</p>'}
    `
    statsGrid.insertAdjacentElement('afterend', tierSection)
  }

  // 3. Inject points activity list before the volunteer history section
  if (!transactions || transactions.length === 0) {
    const historySection = document.querySelector('.history-list')?.closest('section.section')
    if (historySection) {
      const existing = document.getElementById('points-activity-section')
      if (existing) existing.remove()
      const emptySection = document.createElement('section')
      emptySection.className = 'section'
      emptySection.id = 'points-activity-section'
      if (typeof renderEmptyState === 'function') {
        emptySection.innerHTML = '<div class="section-header"><h2 class="section-title">Points Activity</h2></div>'
        const emptyWrap = document.createElement('div')
        renderEmptyState(emptyWrap, { icon: 'history', title: 'No activity yet', text: 'Start volunteering to earn your first points!' })
        emptySection.appendChild(emptyWrap)
        historySection.insertAdjacentElement('beforebegin', emptySection)
      }
    }
    return
  }
  if (transactions && transactions.length > 0) {
    const historySection = document.querySelector('.history-list')?.closest('section.section')
    if (historySection) {
      const existing = document.getElementById('points-activity-section')
      if (existing) existing.remove()

      const activitySection = document.createElement('section')
      activitySection.className = 'section'
      activitySection.id = 'points-activity-section'
      activitySection.innerHTML = `
        <div class="section-header">
          <h2 class="section-title">Points Activity</h2>
        </div>
        <div class="points-activity-list">
          ${transactions.slice(0, 5).map(tx => `
            <div class="points-activity-row">
              <div class="activity-icon-wrap ${tx.amount > 0 ? 'activity-icon-earn' : 'activity-icon-spend'}">
                <span class="material-icons-round">${tx.amount > 0 ? 'add_circle_outline' : 'remove_circle_outline'}</span>
              </div>
              <div class="activity-info">
                <span class="activity-type-label">${formatTxType(tx.type)}</span>
                <span class="activity-date-label">${formatDate(tx.created_at)}</span>
              </div>
              <span class="activity-amount-label ${tx.amount > 0 ? 'amount-earn' : 'amount-spend'}">
                ${tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString()}
              </span>
            </div>
          `).join('')}
        </div>
      `
      historySection.insertAdjacentElement('beforebegin', activitySection)
    }
  }
}

// ── Watch profile page activation and load real data ─────────────────────────

;(function () {
  const profilePage = document.getElementById('page-profile')
  if (!profilePage) return

  const pointsObserver = new MutationObserver(async (mutations) => {
    for (const m of mutations) {
      if (m.target.classList.contains('active') && m.target.id === 'page-profile') {
        const session = await getSession()
        if (session?.user?.id) loadProfilePoints(session.user.id)
        break
      }
    }
  })
  pointsObserver.observe(profilePage, { attributes: true, attributeFilter: ['class'] })
})()

// ── Override showConfirmRedemption to show real balance ───────────────────────

const _origShowConfirmRedemption = window.showConfirmRedemption

window.showConfirmRedemption = async function () {
  _origShowConfirmRedemption()

  const session = await getSession()
  if (!session?.user?.id) return

  try {
    const data = await getUserPoints(session.user.id)
    if (data.current_balance == null) return
    const balanceEl = document.getElementById('cr-balance')
    if (balanceEl) balanceEl.textContent = `${data.current_balance.toLocaleString()} Taw`
  } catch (e) {
    console.error('Failed to load balance for redemption modal', e)
  }
}

// ── Override confirmRedemption to call the backend when a deal_id is set ──────
// Static rewards in rewardsData without deal_id fall back to the original flow.

let _activeRedemption = null
let _countdownTimer   = null

const _origConfirmRedemption = window.confirmRedemption

window.confirmRedemption = async function () {
  const rewardId = _currentRewardForRedemption
  const reward   = rewardId ? rewardsData[rewardId] : null
  if (!reward) return

  // No Supabase deal ID → keep original static behaviour
  if (!reward.deal_id) {
    _origConfirmRedemption()
    return
  }

  const confirmBtn = document.querySelector('.confirm-btn-primary')
  if (confirmBtn) {
    confirmBtn.disabled    = true
    confirmBtn.textContent = 'Processing…'
  }

  try {
    const session = await getSession()
    if (!session) {
      showToast('Please sign in to redeem deals', 'error')
      if (typeof releaseFocus === 'function') releaseFocus()
      return
    }

    const data = await redeemDeal(session.user.id, reward.deal_id)

    if (data.error) {
      showToast(data.error, 'error')
      if (typeof releaseFocus === 'function') releaseFocus()
      return
    }

    _activeRedemption = data

    // Hide modal
    document.getElementById('modal-confirm-redemption').style.display = 'none'
    document.body.style.overflow = ''
    if (typeof releaseFocus === 'function') releaseFocus()

    // Populate the reward-redeemed page
    const code = data.redemption_id.slice(0, 8).toUpperCase()
    document.getElementById('rr-logo').innerHTML  = reward.logoHtml
    document.getElementById('rr-title').textContent    = reward.title
    document.getElementById('rr-subtitle').textContent = `${data.points_spent.toLocaleString()} points redeemed.`
    document.getElementById('rr-code').textContent     = code

    // Live countdown on the redeemed page
    startRedemptionCountdown(data.expires_at)

    navigateTo('reward-redeemed')
    if (typeof showToast === 'function') {
      const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar'
      showToast(isAr ? 'تم استبدال المكافأة بنجاح' : 'Reward redeemed successfully', 'success')
    }

    // Refresh balance on profile
    loadProfilePoints(session.user.id)
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false
      confirmBtn.innerHTML = '<span class="material-icons-round">verified_user</span> Confirm Purchase'
    }
  }
}

// ── 15-minute countdown on the reward-redeemed page ──────────────────────────

function startRedemptionCountdown(expiresAt) {
  const expiryTime = new Date(expiresAt)

  if (_countdownTimer) clearInterval(_countdownTimer)

  const expiresEl = document.getElementById('rr-expires-time')
  if (expiresEl) {
    expiresEl.textContent = expiryTime.toLocaleTimeString('en-BH', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  const mainEl = document.querySelector('.countdown-main')

  _countdownTimer = setInterval(() => {
    const remaining = Math.max(0, expiryTime - Date.now())
    const mins = Math.floor(remaining / 60000)
    const secs = Math.floor((remaining % 60000) / 1000)

    if (mainEl) {
      mainEl.textContent = remaining > 0
        ? `Valid for ${mins}:${secs.toString().padStart(2, '0')}`
        : 'Expired'
      if (remaining === 0) mainEl.style.color = 'red'
    }

    if (remaining === 0) clearInterval(_countdownTimer)
  }, 1000)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTxType(type) {
  const labels = {
    earn_base:             'Volunteering',
    earn_bonus_firsttime:  'First-time bonus',
    earn_bonus_skills:     'Skills bonus',
    earn_bonus_repeat_org: 'Loyalty bonus',
    earn_bonus_urgent:     'Urgent session bonus',
    earn_bonus_group:      'Group referral bonus',
    redeem:                'Deal redeemed',
    expire:                'Points expired',
    admin_adjust:          'Adjustment'
  }
  return labels[type] || type
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-BH', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
>>>>>>> 0491e48748a4e8a561a915951c263da89295a035
