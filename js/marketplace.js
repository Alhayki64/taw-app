/* =============================================
   TAW — MARKETPLACE, MAP & EVENT/PARTNER DETAILS
   ============================================= */

// ── Category Filter (Marketplace) ──
function filterCategory(chipEl, category) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');

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
  const carousel = document.getElementById('opportunities-carousel');
  if (carousel) {
    carousel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  document.querySelectorAll('.opportunity-card').forEach(card => {
    const match = !category || card.dataset.category === category;
    card.style.opacity = match ? '1' : '0.4';
    card.style.transform = match ? '' : 'scale(0.97)';
    card.style.transition = 'opacity 0.25s, transform 0.25s';
  });
  setTimeout(() => {
    document.querySelectorAll('.opportunity-card').forEach(card => {
      card.style.opacity = '';
      card.style.transform = '';
    });
  }, 3000);
}

// ── Show map card on pin click ──
function showMapCard(index) {
  const scroll = document.getElementById('volmap-cards-scroll');
  const cards = scroll?.querySelectorAll('.volmap-event-card');
  if (!scroll || !cards || !cards[index]) return;

  document.querySelectorAll('.volmap-pin').forEach((pin, i) => {
    pin.classList.toggle('active', i === index);
  });

  cards.forEach((card, i) => {
    card.classList.toggle('selected', i === index);
  });

  cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// ── Open Event Details ──
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
  if (mapLabel) mapLabel.textContent = event.mapLabel;

  const pointsVal = document.querySelector('#event-reward-callout .reward-value');
  if (pointsVal) pointsVal.textContent = event.points;

  navigateTo('event-details');
};

// ── Open Partner Detail ──
window.openPartnerDetail = function(partnerId) {
  const p = partnersData[partnerId];
  if (!p) return;

  const hero = document.getElementById('pd-hero-img');
  if (hero) hero.src = p.heroImg;

  const logoWrap = document.getElementById('pd-logo-wrap');
  if (logoWrap) {
    if (p.logoImg) {
      logoWrap.innerHTML = `<img style="width:100%;height:100%;object-fit:contain;" alt="${p.name} logo" src="${p.logoImg}"/>`;
    } else {
      logoWrap.innerHTML = `<span class="material-symbols-outlined" style="color:#005440;font-size:32px;">${p.logoIcon || 'store'}</span>`;
    }
  }

  const nameEl = document.getElementById('pd-name');
  if (nameEl) nameEl.textContent = p.name;
  const catEl = document.getElementById('pd-category');
  if (catEl) catEl.textContent = p.category;
  const ratingEl = document.getElementById('pd-rating');
  if (ratingEl) ratingEl.textContent = p.rating;
  const offersEl = document.getElementById('pd-offers');
  if (offersEl) offersEl.textContent = p.offers;

  const civicEl = document.getElementById('pd-civic-text');
  if (civicEl) civicEl.textContent = p.civicText;

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
