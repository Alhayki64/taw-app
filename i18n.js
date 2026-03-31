// ═══════════════════════════════════════
// TAW — Internationalization (i18n)
// ═══════════════════════════════════════

const translations = {
  en: {
    // Home
    'greeting':             'Hello, Ali!',
    'points-label':         'Taw Points',
    'opportunities-title':  'Opportunities Near You',
    'see-all':              'See All',
    'recent-activity':      'Recent Activity',

    // Opportunity cards
    'org-red-crescent':     'Bahrain Red Crescent',
    'org-green-bahrain':    'Green Bahrain Society',
    'org-muharraq':         'Muharraq Welfare',
    'opp-tree-planting':    'Tree Planting at Al Areen',
    'opp-beach-cleanup':    'Beach Cleanup — Amwaj',
    'opp-elderly-care':     'Elderly Care Visit',

    // Activity
    'act-tree':             'Tree Planting — Al Areen',
    'act-beach':            'Beach Cleanup — Zallaq',
    'act-elderly':          'Elderly Care Visit',
    'act-literacy':         'Literacy Workshop',

    // Discover
    'discover-badge':       'Urgent Story',
    'discover-hero-title':  'The Warmth of a Shared Meal in Manama',
    'discover-hero-desc':   'Every evening, Zainab and her team serve over 200 meals. They need four more hands tonight.',
    'discover-hero-btn':    'Answer the Call',
    'pill-all':             'All',
    'pill-environment':     'Environment',
    'pill-elderly':         'Elderly Care',
    'pill-education':       'Education',
    'volunteer-map':        'Volunteer Map',
    'active-spots':         '12 Active Spots',
    'view-map':             'View Map',
    'community-impact':     'Community Impact',
    'cat-environment':      'Environment',
    'cat-education':        'Education',
    'loc-karzakan':         'Karzakan Coast',
    'loc-hidaya':           'Al-Hidaya Center',
    'impact-title-1':       'Preserving our Coastline Together',
    'impact-desc-1':        "Join a growing community dedicated to restoring the natural beauty of Bahrain's shores. This weekend, we focus on the north lagoon.",
    'impact-title-2':       'Passing Down the Gift of Words',
    'impact-desc-2':        'Mentor young students in traditional storytelling and literacy skills. Help keep our rich oral history alive for the next generation.',
    'explore-nearby':       'Explore Nearby',
    'explore-subtitle':     '12 opportunities near you',

    // Volunteer Map page
    'volmap-title':         'Volunteer Map',
    'chip-all':             'All',
    'chip-environment':     'Environment',
    'chip-care':            'Care',
    'chip-education':       'Education',
    'map-tree-title':       'Tree Planting at Al Areen',
    'map-beach-title':      'Beach Cleanup — Amwaj',
    'map-elderly-title':    'Elderly Care Visit',
    'map-literacy-title':   'Literacy Workshop',
    'map-blood-title':      'Blood Donation Drive',
    'map-meal-title':       'Community Meal Prep',
    'spots-left':           'spots left',

    // Event Details
    'event-details-title':  'Event Details',
    'event-org':            'Bahrain Red Crescent Society',
    'event-org-type':       'Humanitarian Organization',
    'event-name':           'Tree Planting at Al Areen Wildlife Reserve',
    'event-desc':           "Join us for a meaningful morning of planting native trees at the beautiful Al Areen Wildlife Reserve. Help restore Bahrain's natural greenery and contribute to a sustainable future.",
    'detail-date':          'Date',
    'detail-date-val':      'December 12, 2025',
    'detail-time':          'Time',
    'detail-time-val':      '5:00 PM — 8:00 PM',
    'detail-location':      'Location',
    'detail-location-val':  'Al Areen, Bahrain',
    'detail-volunteers':    'Volunteers',
    'detail-volunteers-val':'24 / 40 spots filled',
    'map-label':            'Al Areen Wildlife Reserve',
    'points-reward':        'Points Reward',
    'points-reward-val':    '+200 Points',
    'apply-btn':            'Apply for This Event',

    // Check-in Success
    'success-title':        'Success!',
    'success-event':        'Tree Planting at Al Areen',
    'hours-logged':         'Hours Logged',
    'hours-value':          '3 hours',
    'points-earned':        'Taw Points Earned',
    'done-btn':             'Done',

    // Rewards Marketplace
    'rewards-title':        'Rewards Marketplace',
    'chip-cafes':           '☕ Cafés',
    'chip-dining':          '🍽️ Dining',
    'chip-entertainment':   '🎬 Entertainment',
    'chip-wellness':        '💆 Wellness',
    'reward-1':             '50% off any beverage',
    'reward-2':             'Free appetizer',
    'reward-3':             '20% off dinner bill',
    'reward-4':             'Buy 1 Get 1 Free Cinema Ticket',
    'brand-dining':         'Dining',
    'brand-entertainment':  'Entertainment',
    'price-unit':           'Points',

    // Profile
    'profile-title':        'Volunteer Profile',
    'profile-name':         'Ali Al-Hassan',
    'profile-since':        'Community Volunteer since 2023',
    'stat-hours-label':     'Total Hours Given',
    'stat-hours-val':       '125 hrs',
    'stat-points-label':    'Points Balance',
    'volunteer-history':    'Volunteer History',
    'hist-tree':            'Tree Planting — Al Areen',
    'hist-beach':           'Beach Cleanup — Zallaq',
    'hist-elderly':         'Elderly Care Visit',
    'hist-literacy':        'Literacy Workshop',
    'hist-blood':           'Blood Donation Drive',

    // Bottom Nav
    'nav-home':             'Home',
    'nav-discover':         'Discover',
    'nav-rewards':          'Rewards',
    'nav-profile':          'Profile',

    // Language toggle
    'lang-label':           'ع',
  },

  ar: {
    // Home
    'greeting':             'أهلاً، علي!',
    'points-label':         'نقاط طوع',
    'opportunities-title':  'فرص قريبة منك',
    'see-all':              'عرض الكل',
    'recent-activity':      'النشاط الأخير',

    // Opportunity cards
    'org-red-crescent':     'الهلال الأحمر البحريني',
    'org-green-bahrain':    'جمعية البحرين الخضراء',
    'org-muharraq':         'رعاية المحرق',
    'opp-tree-planting':    'زراعة الأشجار في العرين',
    'opp-beach-cleanup':    'تنظيف الشاطئ — أمواج',
    'opp-elderly-care':     'زيارة رعاية المسنين',

    // Activity
    'act-tree':             'زراعة الأشجار — العرين',
    'act-beach':            'تنظيف الشاطئ — الزلاق',
    'act-elderly':          'زيارة رعاية المسنين',
    'act-literacy':         'ورشة محو الأمية',

    // Discover
    'discover-badge':       'قصة عاجلة',
    'discover-hero-title':  'دفء وجبة مشتركة في المنامة',
    'discover-hero-desc':   'كل مساء، تقدم زينب وفريقها أكثر من ٢٠٠ وجبة. يحتاجون أربعة أيادٍ إضافية الليلة.',
    'discover-hero-btn':    'لبِّ النداء',
    'pill-all':             'الكل',
    'pill-environment':     'البيئة',
    'pill-elderly':         'رعاية المسنين',
    'pill-education':       'التعليم',
    'volunteer-map':        'خريطة المتطوعين',
    'active-spots':         '١٢ نقطة نشطة',
    'view-map':             'عرض الخريطة',
    'community-impact':     'الأثر المجتمعي',
    'cat-environment':      'البيئة',
    'cat-education':        'التعليم',
    'loc-karzakan':         'ساحل كرزكان',
    'loc-hidaya':           'مركز الهداية',
    'impact-title-1':       'نحافظ على ساحلنا معاً',
    'impact-desc-1':        'انضم إلى مجتمع متنامٍ يكرّس جهوده لاستعادة الجمال الطبيعي لسواحل البحرين. هذا الأسبوع نركّز على البحيرة الشمالية.',
    'impact-title-2':       'نقل هدية الكلمات',
    'impact-desc-2':        'ساهم في تعليم الطلاب الصغار مهارات السرد القصصي ومحو الأمية. ساعد في الحفاظ على تراثنا الشفهي للأجيال القادمة.',
    'explore-nearby':       'استكشف القريب',
    'explore-subtitle':     '١٢ فرصة قريبة منك',

    // Volunteer Map page
    'volmap-title':         'خريطة المتطوعين',
    'chip-all':             'الكل',
    'chip-environment':     'البيئة',
    'chip-care':            'الرعاية',
    'chip-education':       'التعليم',
    'map-tree-title':       'زراعة الأشجار في العرين',
    'map-beach-title':      'تنظيف الشاطئ — أمواج',
    'map-elderly-title':    'زيارة رعاية المسنين',
    'map-literacy-title':   'ورشة محو الأمية',
    'map-blood-title':      'حملة التبرع بالدم',
    'map-meal-title':       'إعداد وجبة مجتمعية',
    'spots-left':           'مقاعد متبقية',

    // Event Details
    'event-details-title':  'تفاصيل الحدث',
    'event-org':            'جمعية الهلال الأحمر البحريني',
    'event-org-type':       'منظمة إنسانية',
    'event-name':           'زراعة الأشجار في محمية العرين',
    'event-desc':           'انضم إلينا لصباح مميز من زراعة الأشجار المحلية في محمية العرين الجميلة. ساهم في استعادة خضرة البحرين الطبيعية وبناء مستقبل مستدام.',
    'detail-date':          'التاريخ',
    'detail-date-val':      '١٢ ديسمبر ٢٠٢٥',
    'detail-time':          'الوقت',
    'detail-time-val':      '٥:٠٠ م — ٨:٠٠ م',
    'detail-location':      'الموقع',
    'detail-location-val':  'العرين، البحرين',
    'detail-volunteers':    'المتطوعون',
    'detail-volunteers-val':'٢٤ / ٤٠ مقعد ممتلئ',
    'map-label':            'محمية العرين للحياة الفطرية',
    'points-reward':        'مكافأة النقاط',
    'points-reward-val':    '+٢٠٠ نقطة',
    'apply-btn':            'سجّل في هذا الحدث',

    // Check-in Success
    'success-title':        'تمّ بنجاح!',
    'success-event':        'زراعة الأشجار في العرين',
    'hours-logged':         'ساعات مسجّلة',
    'hours-value':          '٣ ساعات',
    'points-earned':        'نقاط طوع المكتسبة',
    'done-btn':             'تمّ',

    // Rewards Marketplace
    'rewards-title':        'سوق المكافآت',
    'chip-cafes':           '☕ مقاهي',
    'chip-dining':          '🍽️ مطاعم',
    'chip-entertainment':   '🎬 ترفيه',
    'chip-wellness':        '💆 صحة',
    'reward-1':             'خصم ٥٠٪ على أي مشروب',
    'reward-2':             'مقبّلات مجانية',
    'reward-3':             'خصم ٢٠٪ على فاتورة العشاء',
    'reward-4':             'اشترِ ١ واحصل على ١ تذكرة سينما',
    'brand-dining':         'مطاعم',
    'brand-entertainment':  'ترفيه',
    'price-unit':           'نقطة',

    // Profile
    'profile-title':        'ملف المتطوع',
    'profile-name':         'علي الحسّان',
    'profile-since':        'متطوع مجتمعي منذ ٢٠٢٣',
    'stat-hours-label':     'إجمالي الساعات',
    'stat-hours-val':       '١٢٥ ساعة',
    'stat-points-label':    'رصيد النقاط',
    'volunteer-history':    'سجل التطوع',
    'hist-tree':            'زراعة الأشجار — العرين',
    'hist-beach':           'تنظيف الشاطئ — الزلاق',
    'hist-elderly':         'زيارة رعاية المسنين',
    'hist-literacy':        'ورشة محو الأمية',
    'hist-blood':           'حملة التبرع بالدم',

    // Bottom Nav
    'nav-home':             'الرئيسية',
    'nav-discover':         'اكتشف',
    'nav-rewards':          'المكافآت',
    'nav-profile':          'الملف',

    // Language toggle
    'lang-label':           'EN',
  }
};

let currentLang = 'en';

// ── Arabic-Indic Numeral Conversion ──
const westernToArabic = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const arabicToWestern = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };

function toArabicNumerals(str) {
  return String(str).replace(/[0-9]/g, d => westernToArabic[d]);
}

function toWesternNumerals(str) {
  return String(str).replace(/[٠-٩]/g, d => arabicToWestern[d]);
}

// Selectors for elements containing numbers that need conversion
const numericSelectors = [
  '.points-value',
  '.opp-badge',
  '.activity-points',
  '.activity-date',
  '.opp-meta span:last-child',
  '.price-amount',
  '.price-unit',
  '.history-date',
  '.history-hours',
  '.history-pts',
  '.impact-avatar-count',
  '.success-stat .stat-value',
  '.stat-card-value',
  '.volmap-pts-badge',
  '.volmap-distance',
  '.volmap-date',
  '.volmap-spots',
  '.volmap-count-badge',
].join(', ');

function convertNumbersInDOM(lang) {
  document.querySelectorAll(numericSelectors).forEach(el => {
    // Skip if this element has data-i18n (already handled by translation)
    if (el.hasAttribute('data-i18n')) return;

    if (lang === 'ar') {
      // Store original Western text for reverting
      if (!el.hasAttribute('data-original-text')) {
        el.setAttribute('data-original-text', el.textContent);
      }
      el.textContent = toArabicNumerals(el.textContent);
    } else {
      // Restore original Western text
      const original = el.getAttribute('data-original-text');
      if (original) {
        el.textContent = original;
        el.removeAttribute('data-original-text');
      } else {
        el.textContent = toWesternNumerals(el.textContent);
      }
    }
  });
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLanguage(currentLang);
  localStorage.setItem('taw-lang', currentLang);
}

function applyLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;

  // Set direction
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    document.body.classList.add('rtl');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    document.body.classList.remove('rtl');
  }

  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Convert all visible numbers to Arabic-Indic or Western
  convertNumbersInDOM(lang);

  // Update lang toggle button labels
  document.querySelectorAll('.lang-toggle-label').forEach(el => {
    el.textContent = translations[lang]['lang-label'];
  });

  // Update ALL Dropdown UIs
  document.querySelectorAll('.lang-trigger').forEach(trigger => {
    const triggerFlag = trigger.querySelector('.lang-flag');
    const triggerLabel = trigger.querySelector('.lang-label-text');
    if (triggerFlag && triggerLabel) {
      triggerFlag.textContent = lang === 'en' ? '🇺🇸' : '🇧🇭';
      triggerLabel.textContent = lang === 'en' ? 'English' : 'العربية';
    }
  });

  // Update active states in ALL dropdown menus
  document.querySelectorAll('.lang-option').forEach(opt => {
    const optLang = opt.getAttribute('onclick').match(/'([^']+)'/)[1];
    opt.classList.toggle('active', optLang === lang);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('taw-lang') || 'en';
  if (savedLang !== 'en') {
    applyLanguage(savedLang);
  }
});
