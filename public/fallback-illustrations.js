// ═══════════════════════════════════════════
// TAW — Category-Matched Fallback Illustrations
// ═══════════════════════════════════════════
//
// Displays beautiful category-specific illustrations
// when event images fail to load or have null src.
//

const FallbackIllustrations = (() => {
  // ── Category → Illustration mapping ──
  const categoryConfig = {
    environment: {
      image: 'fallback-environment.png',
      gradient: 'linear-gradient(145deg, rgba(0,84,64,0.55) 0%, rgba(15,110,86,0.35) 50%, rgba(132,214,185,0.2) 100%)',
      icon: 'eco',
      label: 'Environment',
      accentColor: '#0F6E56',
    },
    elderly: {
      image: 'fallback-elderly.png',
      gradient: 'linear-gradient(145deg, rgba(196,92,106,0.55) 0%, rgba(212,142,160,0.35) 50%, rgba(240,192,204,0.2) 100%)',
      icon: 'favorite',
      label: 'Elderly Care',
      accentColor: '#c45c6a',
    },
    education: {
      image: 'fallback-education.png',
      gradient: 'linear-gradient(145deg, rgba(52,120,193,0.55) 0%, rgba(100,160,220,0.35) 50%, rgba(180,210,245,0.2) 100%)',
      icon: 'school',
      label: 'Education',
      accentColor: '#3478c1',
    },
    // Default fallback
    default: {
      image: 'fallback-environment.png',
      gradient: 'linear-gradient(145deg, rgba(0,84,64,0.5) 0%, rgba(201,168,76,0.25) 60%, rgba(245,240,232,0.15) 100%)',
      icon: 'volunteer_activism',
      label: 'Volunteer',
      accentColor: '#005440',
    }
  };

  // ── Detect category from context ──
  function detectCategory(element) {
    // Walk up the DOM to find category hints
    const card = element.closest('[data-category]') ||
                 element.closest('.opportunity-card') ||
                 element.closest('.discover-impact-card') ||
                 element.closest('.history-card') ||
                 element.closest('.event-hero');

    if (!card) return 'default';

    // Check explicit data-category attribute
    const explicit = card.dataset.category;
    if (explicit) return mapCategory(explicit);

    // Check card text content for category keywords
    const text = card.textContent.toLowerCase();
    if (text.includes('tree') || text.includes('beach') || text.includes('clean') ||
        text.includes('plant') || text.includes('coast') || text.includes('environment') ||
        text.includes('eco') || text.includes('بيئة') || text.includes('شاطئ') || text.includes('شجر')) {
      return 'environment';
    }
    if (text.includes('elder') || text.includes('care') || text.includes('visit') ||
        text.includes('مسنين') || text.includes('رعاية')) {
      return 'elderly';
    }
    if (text.includes('educat') || text.includes('literacy') || text.includes('school') ||
        text.includes('book') || text.includes('mentor') || text.includes('workshop') ||
        text.includes('تعليم') || text.includes('أمية') || text.includes('ورشة')) {
      return 'education';
    }

    // Check the image's own classes or alt
    const img = element.tagName === 'IMG' ? element : element.querySelector('img');
    if (img) {
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('beach') || alt.includes('tree') || alt.includes('clean')) return 'environment';
      if (alt.includes('elder') || alt.includes('care')) return 'elderly';
      if (alt.includes('school') || alt.includes('book') || alt.includes('mentor')) return 'education';
    }

    // Check opp-image classes
    const oppImage = card.querySelector('.opp-image');
    if (oppImage) {
      if (oppImage.classList.contains('opp-image-1')) return 'environment';
      if (oppImage.classList.contains('opp-image-2')) return 'environment'; // beach = environment
      if (oppImage.classList.contains('opp-image-3')) return 'elderly';
    }

    return 'default';
  }

  function mapCategory(cat) {
    const mapping = {
      'environment': 'environment',
      'beach': 'environment',
      'tree': 'environment',
      'cleanup': 'environment',
      'elderly': 'elderly',
      'care': 'elderly',
      'education': 'education',
      'literacy': 'education',
      'workshop': 'education',
    };
    return mapping[cat.toLowerCase()] || 'default';
  }

  // ── Build fallback DOM ──
  function createFallbackElement(category) {
    const config = categoryConfig[category] || categoryConfig.default;

    const wrapper = document.createElement('div');
    wrapper.className = 'fallback-illustration';
    wrapper.setAttribute('data-fallback-category', category);

    // Background illustration image
    const bg = document.createElement('div');
    bg.className = 'fallback-bg';
    bg.style.backgroundImage = `url('${config.image}')`;
    wrapper.appendChild(bg);

    // Gradient overlay
    const overlay = document.createElement('div');
    overlay.className = 'fallback-gradient';
    overlay.style.background = config.gradient;
    wrapper.appendChild(overlay);

    // Category icon badge
    const badge = document.createElement('div');
    badge.className = 'fallback-badge';
    badge.style.setProperty('--accent', config.accentColor);
    badge.innerHTML = `
      <span class="material-icons-round">${config.icon}</span>
    `;
    wrapper.appendChild(badge);

    return wrapper;
  }

  // ── Handle image errors ──
  function handleImageError(img) {
    const parent = img.parentElement;
    if (!parent || parent.querySelector('.fallback-illustration')) return;

    const category = detectCategory(img);
    const fallback = createFallbackElement(category);

    // Hide broken image
    img.style.display = 'none';

    // Insert fallback
    parent.insertBefore(fallback, img);
    
    // Animate in
    requestAnimationFrame(() => {
      fallback.classList.add('fallback-visible');
    });
  }

  // ── Handle null / empty src images ──
  function handleNullImages() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.src || img.src === window.location.href || img.src === '') {
        handleImageError(img);
      }
    });
  }

  // ── Apply to specific containers ──
  function applyToContainer(container, category) {
    if (container.querySelector('.fallback-illustration')) return;

    const fallback = createFallbackElement(category || detectCategory(container));
    container.appendChild(fallback);

    requestAnimationFrame(() => {
      fallback.classList.add('fallback-visible');
    });
  }

  // ── Initialize: attach onerror listeners & observe new images ──
  function init() {
    // Handle existing images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => handleImageError(img));
      
      // Check already-broken images
      if (img.complete && img.naturalWidth === 0 && img.src && img.src !== window.location.href) {
        handleImageError(img);
      }
    });

    // Handle null src images
    handleNullImages();

    // Observe dynamically added images
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        mut.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const imgs = node.tagName === 'IMG' ? [node] : node.querySelectorAll?.('img') || [];
          imgs.forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
            if (!img.src || img.src === window.location.href) {
              handleImageError(img);
            }
          });
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    applyToContainer,
    handleImageError,
    detectCategory,
    categoryConfig,
  };
})();
