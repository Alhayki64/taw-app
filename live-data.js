// ====== TAW: LIVE DATA HYDRATION ======

// Global store for opportunities (used by map wiring + category filter)
let _dbOpportunities = [];
// Prevent hydrateDashboard running multiple times for the same session
let _hydratedUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof onAuthStateChange === 'function') {
        onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                if (_hydratedUserId === session.user.id) return; // already hydrated
                _hydratedUserId = session.user.id;
                hydrateDashboard(session.user.id);
            } else {
                _hydratedUserId = null;
                hydratePublicData();
                clearNotificationsForGuest();
            }
        });
    }
});

function clearNotificationsForGuest() {
    const todayList = document.getElementById('notif-today-list');
    const earlierList = document.getElementById('notif-earlier-list');
    const guestHTML = `
        <div style="text-align:center;padding:32px 16px;color:var(--on-surface-variant);">
            <span class="material-icons-round" style="font-size:40px;margin-bottom:12px;display:block;color:var(--primary);">notifications_none</span>
            <p style="font-weight:600;margin-bottom:6px;">Sign in to see your notifications</p>
            <p style="font-size:0.85rem;margin-bottom:20px;">Get updates on opportunities, points, and more.</p>
            <button class="btn-primary" style="width:auto;padding:10px 24px;" onclick="setAuthMode('signin'); navigateTo('auth')">Sign In</button>
        </div>`
    if (todayList) todayList.innerHTML = guestHTML;
    if (earlierList) earlierList.innerHTML = '';
}

async function hydrateDashboard(userId) {
    hydratePublicData();

    // Points banner
    if (typeof getUserPoints === 'function') {
        try {
            const data = await getUserPoints(userId);
            if (!data.error) {
                updatePointsBanner(data);
                populateNotifications(userId, data.transactions || []);
            }
        } catch (e) {
            console.error('Failed to fetch user points for banner', e);
            showToast('Could not load your points', 'error');
        }
    }

    // Weekly Goal from confirmed sessions this week
    if (typeof fetchUserSessions === 'function') {
        try {
            const sessions = await fetchUserSessions(userId);
            updateWeeklyGoal(sessions);
        } catch (e) {
            console.error('Failed to fetch sessions for weekly goal', e);
        }
    }
}

async function hydratePublicData() {
    injectSkeletons();

    // Fetch deals
    try {
        if (typeof fetchDeals === 'function') {
            const deals = await fetchDeals();
            populateRewards(deals);
        }
    } catch (e) {
        console.error('Failed to fetch deals', e);
        showToast('Could not load rewards', 'error');
        const grid = document.getElementById('rewards-grid');
        if (typeof renderErrorState === 'function') {
            renderErrorState(grid, { retryFn: 'hydratePublicData()', text: 'Could not load rewards' });
        }
    }

    // Fetch opportunities
    try {
        if (typeof fetchOpportunities === 'function') {
            const opps = await fetchOpportunities();
            populateOpportunities(opps);
        }
    } catch (e) {
        console.error('Failed to fetch opportunities', e);
        showToast('Could not load opportunities', 'error');
        const bento = document.getElementById('urgent-bento-grid');
        const carousel = document.getElementById('opportunities-carousel');
        if (typeof renderErrorState === 'function') {
            renderErrorState(bento, { retryFn: 'hydratePublicData()', text: 'Could not load events' });
            if (carousel) renderErrorState(carousel, { retryFn: 'hydratePublicData()', text: 'Could not load events' });
        }
    }
}

// ── Skeleton placeholders ────────────────────────────────────────────────────
function injectSkeletons() {
    const bento = document.getElementById('urgent-bento-grid');
    if (bento && !bento.querySelector('.skeleton')) {
        bento.innerHTML = `
            <div class="skeleton skeleton-bento-large"></div>
            <div class="bento-row">
                <div class="skeleton skeleton-bento-small"></div>
                <div class="skeleton skeleton-bento-small"></div>
            </div>`;
    }
    const carousel = document.getElementById('opportunities-carousel');
    if (carousel && !carousel.querySelector('.skeleton')) {
        carousel.innerHTML = `
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>`;
    }
    const rewards = document.getElementById('rewards-grid');
    if (rewards && !rewards.querySelector('.skeleton')) {
        rewards.innerHTML = `
            <div class="skeleton skeleton-reward"></div>
            <div class="skeleton skeleton-reward"></div>
            <div class="skeleton skeleton-reward"></div>
            <div class="skeleton skeleton-reward"></div>`;
    }
}

// ── Points banner ────────────────────────────────────────────────────────────
function updatePointsBanner(data) {
    const { current_balance, lifetime_points, tier, next_tier } = data;

    const pointsVal = document.getElementById('home-points-value');
    if (pointsVal) {
        pointsVal.innerHTML = `${current_balance.toLocaleString()} <span class="points-banner-unit" data-i18n="points-label">Taw Points</span>`;
    }

    const tierName = document.getElementById('home-tier-name');
    const tierBadge = document.getElementById('home-tier-badge');
    if (tierName && tier) {
        tierName.textContent = typeof currentLang !== 'undefined' && currentLang === 'ar'
            ? (tier.name_ar || tier.name) : (tier.name_en || tier.name);
        if (tierBadge && tier.badge_color) tierBadge.style.color = `#${tier.badge_color}`;
    }

    const progressRemaining = document.getElementById('home-progress-remaining');
    const progressFill = document.getElementById('home-progress-fill');
    if (next_tier) {
        const remaining = next_tier.min_lifetime_points - lifetime_points;
        const totalGap = next_tier.min_lifetime_points - (tier?.min_lifetime_points || 0);
        const progress = Math.max(0, Math.min(100, ((totalGap - remaining) / totalGap) * 100));
        if (progressRemaining) progressRemaining.textContent = `${remaining.toLocaleString()} pts to next level`;
        if (progressFill) progressFill.style.width = `${progress}%`;
    } else {
        if (progressRemaining) progressRemaining.textContent = 'Maximum tier reached';
        if (progressFill) progressFill.style.width = '100%';
    }
}

// ── Weekly Goal ──────────────────────────────────────────────────────────────
function updateWeeklyGoal(sessions) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekHours = sessions
        .filter(s => s.status === 'confirmed' && s.confirmed_at && new Date(s.confirmed_at) >= weekStart)
        .reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);

    const GOAL = 15;
    const displayHours = weekHours % 1 === 0 ? weekHours : weekHours.toFixed(1);
    const pct = Math.min(100, (weekHours / GOAL) * 100);

    const numEl = document.getElementById('impact-hl-number');
    const barEl = document.getElementById('impact-hl-bar-fill');
    if (numEl) numEl.textContent = displayHours;
    if (barEl) barEl.style.width = `${pct}%`;
}

// ── Rewards (deals) ──────────────────────────────────────────────────────────
function populateRewards(deals) {
    if (typeof rewardsData !== 'undefined') {
        Object.keys(rewardsData).forEach(k => delete rewardsData[k]);
    }

    const grid = document.getElementById('rewards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (deals.length === 0) {
        if (typeof renderEmptyState === 'function') {
            renderEmptyState(grid, {
                icon: 'redeem',
                title: 'No rewards yet',
                text: 'Keep volunteering to unlock exclusive deals and discounts!'
            });
        }
        return;
    }

    deals.forEach(deal => {
        rewardsData[deal.id] = {
            deal_id: deal.id,
            category: deal.category || 'Special',
            title: deal.title,
            points: deal.points_cost,
            brandName: deal.brand_name || 'Partner',
            description: deal.description || '',
            expires: deal.expires_at ? new Date(deal.expires_at).toLocaleDateString() : 'Never',
            usage: deal.usage_limit ? `Limit: ${deal.usage_limit}` : 'One-time Use',
            terms: deal.terms ? deal.terms.split('\n') : ['Terms and conditions apply.'],
            heroImg: deal.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
            logoHtml: `<div style="background-color:var(--primary);color:white;width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><span class="material-icons-round" style="font-size:20px;">local_offer</span></div>`
        };

        const card = document.createElement('div');
        card.className = 'reward-card';
        card.setAttribute('data-category', (deal.category || 'all').toLowerCase());
        card.onclick = () => openRewardDetails(deal.id);

        const fallbackImg = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80';
        card.innerHTML = `
            <div class="reward-image-wrap">
              <img src="${deal.image_url || fallbackImg}" alt="${deal.title}" class="reward-photo"
                   onerror="this.src='${fallbackImg}'" />
              <div class="reward-brand-logo brand-logo-icon">
                <span class="material-icons-round">local_offer</span>
                <span class="brand-label">${deal.brand_name || deal.category || 'Reward'}</span>
              </div>
            </div>
            <div class="reward-card-body">
              <h3 class="reward-card-title">${deal.title}</h3>
            </div>
            <div class="reward-price-badge">
              <div class="price-coin"><span class="material-icons-round">toll</span></div>
              <span class="price-amount">${deal.points_cost}</span>
              <span class="price-unit">Points</span>
            </div>
        `;
        grid.appendChild(card);
    });

    applyConversions();
}

// ── Opportunities ─────────────────────────────────────────────────────────────
function populateOpportunities(opps) {
    _dbOpportunities = opps; // store globally for map wiring + filter

    if (typeof eventsData !== 'undefined') {
        Object.keys(eventsData).forEach(k => delete eventsData[k]);
    }

    const bento = document.getElementById('urgent-bento-grid');
    const carousel = document.getElementById('opportunities-carousel');

    // Update active spots count on map page
    const spotsEl = document.getElementById('volmap-active-count');
    if (spotsEl) spotsEl.textContent = `${opps.length} Active Spots`;

    if (opps.length === 0) {
        if (typeof renderEmptyState === 'function') {
            renderEmptyState(bento, {
                icon: 'volunteer_activism',
                title: 'No upcoming events',
                text: 'Check back soon for new volunteer opportunities!',
                ctaLabel: 'Explore Map',
                ctaAction: "navigateTo('volunteer-map')"
            });
            if (carousel) carousel.innerHTML = '';
        }
        return;
    }

    const sorted = [...opps].sort((a, b) => new Date(a.date) - new Date(b.date));
    const urgent = sorted.slice(0, 3);
    const regular = sorted.slice(3);

    // Populate eventsData with correct field names
    opps.forEach(opp => {
        const d = new Date(opp.date);
        eventsData[opp.id] = {
            id: opp.id,
            title: opp.title,
            orgName: opp.org_name || 'Partner',
            orgType: opp.category || 'Community',
            orgLogo: getCategoryEmoji(opp.category),
            date: d.toLocaleDateString(),
            time: opp.time_range || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: opp.location || 'Bahrain',
            volunteers: `${opp.volunteers_filled || 0} / ${opp.max_volunteers || 10} spots filled`,
            points: `+${opp.points} Points`,
            desc: opp.description || 'Join us for a meaningful volunteer experience.',
            heroImg: opp.hero_image_url || opp.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
            mapLabel: opp.map_label || opp.location || 'Location'
        };
    });

    renderUrgentNeeds(urgent);
    renderRegularOpportunities(regular);
    updateMapCards(opps);
    applyConversions();
}

function renderUrgentNeeds(urgent) {
    const grid = document.getElementById('urgent-bento-grid');
    if (!grid || urgent.length === 0) return;
    grid.innerHTML = '';

    const primary = urgent[0];
    const pDate = new Date(primary.date);
    const slotsLeft = Math.max(0, (primary.max_volunteers || 10) - (primary.volunteers_filled || 0));

    let html = `
      <div class="bento-card-large" onclick="openEventDetails(${primary.id})">
        <div class="bento-large-header">
          <div class="bento-org-info">
            <div class="bento-org-logo" style="display:flex;align-items:center;justify-content:center;font-size:24px;background:#f5f5f5;border-radius:12px;width:100%;height:100%;">
              ${getCategoryEmoji(primary.category)}
            </div>
            <div class="bento-org-text">
              <h3 class="bento-title">${primary.title}</h3>
              <p class="bento-subtitle">${primary.org_name || ''}</p>
            </div>
          </div>
          <span class="bento-date-badge">${pDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
        </div>
        <div class="bento-image-wrap">
          <img src="${primary.hero_image_url || primary.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'}"
               alt="${primary.title}" class="bento-img"
               onerror="this.src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'" />
          <div class="bento-tags">
            <div class="bento-tag">
              <span class="material-icons-round">person_add</span>
              <span>${slotsLeft} Slots Left</span>
            </div>
            <div class="bento-tag">
              <span class="material-icons-round">stars</span>
              <span>${primary.points} Taw</span>
            </div>
          </div>
        </div>
      </div>`;

    if (urgent.length > 1) {
        let rowHtml = '<div class="bento-row">';
        for (let i = 1; i < Math.min(3, urgent.length); i++) {
            const sec = urgent[i];
            const sDate = new Date(sec.date);
            rowHtml += `
              <div class="bento-card-small" onclick="openEventDetails(${sec.id})">
                <div class="bento-small-meta">
                  <span class="material-icons-round text-secondary">${getCategoryIcon(sec.category)}</span>
                  <span class="bento-small-label text-secondary">${sec.category || 'General'}</span>
                </div>
                <h4 class="bento-small-title">${sec.title}</h4>
                <div class="bento-small-footer">
                  <span class="bento-small-time">${sDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                  <span class="material-icons-round text-primary">arrow_outward</span>
                </div>
              </div>`;
        }
        rowHtml += '</div>';
        html += rowHtml;
    }

    grid.innerHTML = html;
}

function renderRegularOpportunities(regular) {
    const carousel = document.getElementById('opportunities-carousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    if (regular.length === 0) return;

    regular.forEach(opp => {
        const d = new Date(opp.date);
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.dataset.category = opp.category || '';
        card.onclick = () => openEventDetails(opp.id);

        card.innerHTML = `
          <div class="opp-image">
            <img src="${opp.image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'}"
                 style="width:100%;height:100%;object-fit:cover;" alt="${opp.title}"
                 onerror="this.src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'" />
            <div class="opp-badge">+${opp.points} pts</div>
          </div>
          <div class="opp-content">
            <h3 class="opp-title">${opp.title}</h3>
            <div class="opp-meta-row">
              <div class="opp-meta">
                <span class="material-icons-round">location_on</span>
                <span>${opp.location ? opp.location.split(',')[0] : 'Bahrain'}</span>
              </div>
              <div class="opp-meta">
                <span class="material-icons-round">calendar_today</span>
                <span>${d.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
              </div>
            </div>
          </div>`;
        carousel.appendChild(card);
    });
}

// ── Map cards — wire to real DB opportunity IDs ──────────────────────────────
function updateMapCards(opps) {
    const cards = document.querySelectorAll('.volmap-event-card');
    if (!cards.length || !opps.length) return;

    // Match each card by index to a DB opportunity (round-robin by sorted order)
    const sorted = [...opps].sort((a, b) => new Date(a.date) - new Date(b.date));

    cards.forEach((card, i) => {
        const opp = sorted[i % sorted.length];
        if (!opp) return;

        // Update onclick to use real DB ID
        card.onclick = () => openEventDetails(opp.id);

        // Update card content if it has the standard structure
        const titleEl = card.querySelector('.volmap-card-title');
        const orgEl = card.querySelector('.volmap-card-org');
        const dateEl = card.querySelector('.volmap-card-date');

        if (titleEl) titleEl.textContent = opp.title;
        if (orgEl) orgEl.textContent = opp.org_name || opp.category || '';
        if (dateEl) dateEl.textContent = new Date(opp.date).toLocaleDateString(undefined, {month:'short', day:'numeric'});
    });
}

// ── Notifications (DB-derived, no notifications table) ───────────────────────
async function populateNotifications(_userId, transactions) {
    const todayList = document.getElementById('notif-today-list');
    const earlierList = document.getElementById('notif-earlier-list');
    if (!todayList && !earlierList) return;

    const todayCards = [];
    const earlierCards = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Urgent opportunities → Today section
    const urgentOpps = _dbOpportunities.filter(o => o.is_urgent).slice(0, 1);
    urgentOpps.forEach(opp => {
        todayCards.push(`
            <div class="notif-card" onclick="openEventDetails(${opp.id})">
                <div class="notif-card-icon-wrap urgent">
                    <span class="material-icons-round">notification_important</span>
                </div>
                <div class="notif-card-main">
                    <div class="notif-card-top">
                        <span class="notif-card-label urgent">Urgent Need</span>
                        <span class="notif-card-time">${new Date(opp.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                    </div>
                    <p class="notif-card-text"><strong>${opp.title}</strong> needs volunteers. Only ${Math.max(0,(opp.max_volunteers||10)-(opp.volunteers_filled||0))} spots left!</p>
                    <button class="notif-card-btn">View Details</button>
                </div>
            </div>`);
    });

    // Recent point transactions → Today / Earlier
    const recentTx = (transactions || []).slice(0, 3);
    recentTx.forEach(tx => {
        const txDate = new Date(tx.created_at);
        const isToday = txDate >= today;
        const timeStr = isToday
            ? txDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
            : txDate.toLocaleDateString(undefined, {month:'short', day:'numeric'});
        const card = `
            <div class="notif-card">
                <div class="notif-card-icon-wrap reward">
                    <span class="material-icons-round">stars</span>
                </div>
                <div class="notif-card-main">
                    <div class="notif-card-top">
                        <span class="notif-card-label reward">Points</span>
                        <span class="notif-card-time">${timeStr}</span>
                    </div>
                    <p class="notif-card-text">
                        ${tx.amount > 0 ? `You earned <strong>+${tx.amount} Taw Points</strong>` : `You spent <strong>${Math.abs(tx.amount)} Taw Points</strong>`}
                    </p>
                </div>
            </div>`;
        if (isToday) todayCards.push(card);
        else earlierCards.push(card);
    });

    // New upcoming opportunities → Earlier section
    const newOpps = _dbOpportunities
        .filter(o => !o.is_urgent)
        .slice(0, 2);
    newOpps.forEach(opp => {
        earlierCards.push(`
            <div class="notif-card" onclick="openEventDetails(${opp.id})">
                <div class="notif-card-icon-wrap discovery">
                    <span class="material-icons-round">explore</span>
                </div>
                <div class="notif-card-main">
                    <div class="notif-card-top">
                        <span class="notif-card-label discovery">New Opportunity</span>
                        <span class="notif-card-time">${new Date(opp.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                    </div>
                    <p class="notif-card-text"><strong>${opp.title}</strong> is now available near ${opp.location ? opp.location.split(',')[0] : 'you'}.</p>
                    <button class="notif-card-btn" onclick="event.stopPropagation(); openEventDetails(${opp.id})">View Details</button>
                </div>
            </div>`);
    });

    if (todayList) {
        todayList.innerHTML = todayCards.length
            ? todayCards.join('')
            : '<p style="padding:1rem;color:var(--on-surface-variant);font-size:0.875rem;">No new notifications today.</p>';
    }
    if (earlierList) {
        earlierList.innerHTML = earlierCards.length
            ? earlierCards.join('')
            : '<p style="padding:1rem;color:var(--on-surface-variant);font-size:0.875rem;">Nothing from earlier.</p>';
    }
}

function applyConversions() {
    if (typeof convertNumbersInDOM === 'function' && typeof currentLang !== 'undefined') {
        setTimeout(() => convertNumbersInDOM(currentLang), 50);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getCategoryEmoji(cat) {
    if (!cat) return '\u{1F64C}';
    const l = cat.toLowerCase();
    if (l.includes('env') || l.includes('nature') || l.includes('clean')) return '\u{1F30A}';
    if (l.includes('elder') || l.includes('care')) return '\u{1FAB6}';
    if (l.includes('edu') || l.includes('literacy')) return '\u{1F4DA}';
    if (l.includes('health') || l.includes('blood')) return '\u{1FA78}';
    if (l.includes('food') || l.includes('meal')) return '\u{1F372}';
    return '\u{1F319}';
}

function getCategoryIcon(cat) {
    if (!cat) return 'volunteer_activism';
    const l = cat.toLowerCase();
    if (l.includes('env') || l.includes('nature')) return 'eco';
    if (l.includes('elder') || l.includes('care')) return 'elderly';
    if (l.includes('edu') || l.includes('literacy')) return 'school';
    if (l.includes('health')) return 'health_and_safety';
    if (l.includes('food') || l.includes('meal')) return 'soup_kitchen';
    return 'groups';
}
