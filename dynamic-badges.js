/**
 * Dynamic Event Badges
 * Automatically calculates and injects badges on event cards based on date and capacity.
 */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.opportunity-card, .bento-card-large');
  const now = new Date(); // Simulating "today"

  cards.forEach(card => {
    const dateStr = card.getAttribute('data-date');
    const capacityStr = card.getAttribute('data-capacity');

    if (!dateStr || !capacityStr) return;

    const eventDate = new Date(dateStr);
    const capacity = parseInt(capacityStr, 10);
    const hoursDifference = (eventDate - now) / (1000 * 60 * 60);

    let badgeText = '';
    let badgeClass = '';
    let iconName = '';

    // Logic:
    // 1. ≤ 5 spots: 'X spots left' (amber/orange)
    // 2. Otherwise exactly within 48 hours: 'Urgent' (red)
    // 3. Otherwise: 'This Weekend' (green)
    if (capacity <= 5) {
      badgeText = `${capacity} spots left`;
      badgeClass = 'badge-amber';
      iconName = 'group_add';
    } else if (hoursDifference > 0 && hoursDifference <= 48) {
      badgeText = 'Urgent';
      badgeClass = 'badge-red';
      iconName = 'notification_important';
    } else {
      badgeText = 'This Weekend';
      badgeClass = 'badge-green';
      iconName = 'event_available';
    }

    // Create the badge element
    const badge = document.createElement('div');
    badge.className = `dynamic-event-badge ${badgeClass}`;
    
    // The number inside the badge text needs to be eligible for conversion if in Arabic mode
    badge.innerHTML = `
      <span class="material-icons-round" style="font-size: 14px;">${iconName}</span>
      <span class="badge-text-content" data-original-text="${badgeText}">${badgeText}</span>
    `;

    // Ensure the number is converted if the page initialized in Arabic
    if (document.documentElement.dir === 'rtl' && window.convertToArabicNumerals) {
      const textSpan = badge.querySelector('.badge-text-content');
      textSpan.textContent = window.convertToArabicNumerals(badgeText);
    }

    // Inject the badge into the image wrapper
    const target = card.querySelector('.opp-image') || card.querySelector('.bento-image-wrap');
    if (target) {
      // Ensure target is relative so the absolute badge is contained
      target.style.position = 'relative'; 
      target.appendChild(badge);
    }
  });
});
