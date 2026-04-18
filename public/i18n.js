<<<<<<< HEAD
// ═══════════════════════════════════════
// TAW — Internationalization (i18n)
// ═══════════════════════════════════════

const translations = {
  en: {
    // Landing
    'landing-headline':     'Volunteer. Earn. <br/>Impact.',
    'landing-subtitle':     'Join the movement transforming lives in Bahrain.',
    'landing-cta':          'Join the Cause',
    'landing-explore':      'Explore the app →',
    'landing-signin':       'Already making an impact?',
    'landing-signin-link':  'Sign In',

    // Onboarding: Interests
    'interests-title':      'What drives you?',
    'interests-subtitle':   'Select the causes you\'re most passionate about to personalize your volunteer journey.',
    'interests-why-title':  'Why this matters?',
    'interests-why-desc':   'Personalizing your interests helps us match you with high-impact opportunities that earn you more Taw Points.',
    'btn-skip':             'Skip',
    'btn-next':             'Next',

    // Onboarding: Notifications
    'notif-title':          'Stay in the Loop',
    'notif-subtitle':       'Enable notifications to get real-time alerts for urgent volunteer needs, reward milestones, and community updates.',
    'notif-b1-title':       'Urgent Direct Actions',
    'notif-b1-desc':        'Immediate opportunities to help in your immediate area.',
    'notif-b2-title':       'Verification Alerts',
    'notif-b2-desc':        'Get notified the moment your service hours are approved.',
    'notif-b3-title':       'Local Rewards',
    'notif-b3-desc':        'Get notified the moment you earn new points and rewards.',
    'btn-allow':            'Allow Notifications',
    'btn-maybe-later':      'Maybe Later',

    // Interest categories
    'cat-environment':      'Environment',
    'cat-elderly':          'Elderly Care',
    'cat-education':        'Education',
    'cat-health':           'Health',
    'cat-animal':           'Animal Welfare',
    'cat-social':           'Social Welfare',
    'cat-advocacy':         'Advocacy',
    'cat-arts':             'Arts & Culture',
    'cat-food':             'Food Security',

    // Home
    'greeting':                 'Hello, Guest!',
    'home-subtitle':            'Ready to make an impact today?',
    'points-label':             'Taw Points',
    'points-total-label':       'Total Balance',
    'tier-gold':                'Gold Tier',
    'progress-platinum':        'Progress to Platinum',
    'progress-pts-left':        '500 pts to next level',
    'impact-community-title':   'Total Community Impact',
    'impact-community-sub':     'You\'re making Bahrain better.',
    'hours-label':              'Hours',
    'opportunities-title':      'Opportunities Near You',
    'see-all':                  'See All',

    // Opportunity cards
    'org-red-crescent':         'Bahrain Red Crescent',
    'org-green-bahrain':        'Green Bahrain Society',
    'org-muharraq':             'Muharraq Welfare',
    'opp-tree-planting':        'Tree Planting at Al Areen',
    'opp-beach-cleanup':        'Coastal Beach Cleanup',
    'opp-food-drive':           'Ramadan Food Drive',
    'opp-elderly-care':         'Elderly Care Visit',
    'opp-date-tomorrow':        'Tomorrow, 08:00',
    'opp-date-sat':             'Sat, 16:00',
    'opp-date-sun':             'Sun, 10:00',


    // Discover
    'weave-hero-title':     'Weave Your Part in Bahrain\'s Story',
    'weave-hero-desc':      'Join 2,500+ volunteers making a daily difference.',
    'explore-now':          'Explore Now',
    'browse-by-impact':     'Browse by Impact',
    'view-all':             'View All',
    'pill-all':             'All',
    'pill-environment':     'Environment',
    'pill-elderly':         'Elderly Care',
    'pill-education':       'Education',
    'pill-health':          'Health',
    'pill-community':       'Community',
    'urgent-needs':         'Urgent Needs',
    'high-priority':        'High Priority',
    'marine-title':         'Marine Cleanup: Malkiya Beach',
    'marine-org':           'Bahrain Ocean Society',
    'tomorrow':             'Tomorrow',
    'slots-8':              '8 Slots Left',
    'points-50':            '50 Taw',
    'elderly-support':      'Elderly Support',
    'evening-tea':          'Evening Tea at Muharraq Care Home',
    '1800-today':           '18:00 Today',
    'tutoring':             'Tutoring',
    'math-help':            'Math Help for Secondary Students',
    'online-wed':           'Online • Wed',
    'community-impact':     'Community Impact',
    'your-community-impact':'Your Community Impact',
    'weekly-goal-15':       'Weekly Goal: 15 Hours',
    'hours-done':           'Hours Done',
    'discover-badge':       'Urgent Story',
    'discover-hero-title':  'The Warmth of a Shared Meal in Manama',
    'discover-hero-desc':   'Every evening, Zainab and her team serve over 200 meals. They need four more hands tonight.',
    'discover-hero-btn':    'Answer the Call',
    'volunteer-map':        'Volunteer Map',
    'active-spots':         '12 Active Spots',
    'view-map':             'View Map',
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
    'reward-detail-title':  'Reward Details',
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

    // Settings
    'app-prefs':            'App Preferences',
    'lang-setting':         'Language',
    'dark-mode-label':      'Appearance (Dark Mode)',

    // Bottom Nav
    'nav-home':             'Home',
    'nav-discover':         'Discover',
    'nav-rewards':          'Rewards',
    'nav-profile':          'Profile',
    'nav-notifications':    'Notifications',
    'sign-out':             'Sign Out',

    // Notification permission page — stories
    'np-headline':           'See Your Impact',
    'np-subtitle-text':      'Discover how real-time notifications turn your small acts into nationwide community milestones.',
    'np-story-1-title':      '4,200+ Lives Touched',
    'np-story-1-quote':      '"Because of urgent notifications, 50 volunteers arrived in under an hour to support our flood relief efforts in Manama."',
    'np-story-2-title':      "A Father's Gratitude",
    'np-story-2-quote':      '"The blood donor alert saved my son. I saw the Taw volunteer walk into the hospital just 20 minutes after the request went out."',
    'np-story-3-title':      '15 Tons of Waste Removed',
    'np-story-3-quote':      'By coordinating via instant alerts, our community removed 15 tons of ocean plastic from local shores in just one weekend.',
    'np-btn-next-story':     'Next Story',
    'np-btn-hero':           'Be the Next Hero',
    'np-btn-skip-now':       'Skip for now',

    // Edit profile
    'ep-title':              'Edit Profile',
    'ep-avatar-hint':        'Tap to change photo',
    'ep-name-label':         'Full Name',
    'ep-email-label':        'Email',
    'ep-phone-label':        'Phone Number',
    'ep-bio-label':          'Bio',
    'ep-save-text':          'Save Changes',

    // Photo action sheet
    'photo-sheet-title':     'Profile Photo',
    'photo-take':            'Take Photo',
    'photo-gallery':         'Choose from Gallery',
    'photo-remove':          'Remove Photo',
    'photo-cancel':          'Cancel',

    // Notifications page
    'notif-today':           'Today',
    'notif-earlier':         'Earlier',
    'notif-view-details':    'View Details',

    // Confirm application modal
    'confirm-app-title':     'Application Submitted!',
    'confirm-app-notice':    'The organizer will review your application. You will receive a notification when approved.',
    'confirm-app-home':      'Back to Home',
    'confirm-app-more':      'Find More Events',

    // Confirm redemption modal
    'confirm-redeem-title':  'Final Step',
    'confirm-redeem-sub':    'Verify your selection before we finalize your reward.',
    'confirm-redeem-notice': 'This reward will be added to your My Rewards section immediately upon confirmation.',
    'confirm-purchase-btn':  'Confirm Purchase',
    'confirm-cancel-btn':    'Cancel',

    // Auth prompt modal
    'auth-prompt-title':     'Sign in to continue',
    'auth-prompt-sub':       'Create a free account or sign in to take part.',
    'auth-prompt-create':    'Create Account',
    'auth-prompt-signin':    'Sign In',
    'auth-prompt-later':     'Maybe Later',

    // Reward redeemed page
    'rr-page-title':         'Reward Redeemed',
    'rr-code-label':         'REDEMPTION CODE',
    'rr-valid-duration':     'Valid for 48 hours',
    'rr-expires-label':      'Expires:',
    'rr-branches':           'Available at all Bahrain branches',
    'rr-how-to-title':       'How to use',

    // Notification category labels
    'notif-label-urgent':    'Urgent Action',
    'notif-label-reward':    'Rewards',
    'notif-label-discovery': 'Discovery',
    'notif-label-system':    'System',

    // Dynamic JS strings
    'valid-at':              'Valid at',
    'taw-currency':          'Taw',
    'reward-converted-msg':  'Your Taw Points have been converted into a great reward.',
    'applied-for':           'You have successfully applied for',
    'email-invalid':         'Please enter a valid email',
    'password-too-short':    'Password must be at least 6 characters',

    // Language toggle
    'lang-label':           'ع',
  },

  ar: {
    // Landing
    'landing-headline':     'تطوّع. اكسب. <br/>أثِّر.',
    'landing-subtitle':     'انضم للحركة التي تغيّر حياة الناس في البحرين.',
    'landing-cta':          'انضم للقضية',
    'landing-explore':      'استكشف التطبيق ←',
    'landing-signin':       'سبق وأحدثت أثراً؟',
    'landing-signin-link':  'سجّل دخول',

    // Onboarding: Interests
    'interests-title':      'ما الذي يُلهمك؟',
    'interests-subtitle':   'اختر القضايا التي تهمك لنُخصّص لك رحلة تطوعية تناسب شغفك.',
    'interests-why-title':  'لماذا هذا مهم؟',
    'interests-why-desc':   'تخصيص اهتماماتك يساعدنا في ربطك بفرص تطوعية مؤثرة تُكسبك نقاط طوع أكثر.',
    'btn-skip':             'تخطّي',
    'btn-next':             'التالي',

    // Onboarding: Notifications
    'notif-title':          'ابقَ على اطّلاع',
    'notif-subtitle':       'فعّل الإشعارات لتصلك تنبيهات فورية عن فرص التطوع العاجلة، والمكافآت، وأخبار المجتمع.',
    'notif-b1-title':       'إجراءات عاجلة',
    'notif-b1-desc':        'فرص تطوعية فورية في منطقتك.',
    'notif-b2-title':       'تنبيهات التحقق',
    'notif-b2-desc':        'ستُبلَّغ فور اعتماد ساعاتك التطوعية.',
    'notif-b3-title':       'مكافآت محلية',
    'notif-b3-desc':        'ستُبلَّغ فور حصولك على نقاط ومكافآت جديدة.',
    'btn-allow':            'السماح بالإشعارات',
    'btn-maybe-later':      'لاحقاً',

    // Interest categories
    'cat-environment':      'البيئة',
    'cat-elderly':          'رعاية المسنين',
    'cat-education':        'التعليم',
    'cat-health':           'الصحة',
    'cat-animal':           'رعاية الحيوان',
    'cat-social':           'الرعاية الاجتماعية',
    'cat-advocacy':         'المناصرة',
    'cat-arts':             'الفنون والثقافة',
    'cat-food':             'الأمن الغذائي',

    // Home
    'greeting':                 'أهلاً، ضيف!',
    'home-subtitle':            'مستعد لإحداث أثر اليوم؟',
    'points-label':             'نقاط طوع',
    'points-total-label':       'الرصيد الكلي',
    'tier-gold':                'الفئة الذهبية',
    'progress-platinum':        'التقدم نحو البلاتين',
    'progress-pts-left':        '٥٠٠ نقطة للمستوى التالي',
    'impact-community-title':   'إجمالي الأثر المجتمعي',
    'impact-community-sub':     'أنت تجعل البحرين أفضل.',
    'hours-label':              'ساعة',
    'opportunities-title':      'فرص قريبة منك',
    'see-all':                  'عرض الكل',

    // Opportunity cards
    'org-red-crescent':         'الهلال الأحمر البحريني',
    'org-green-bahrain':        'جمعية البحرين الخضراء',
    'org-muharraq':             'رعاية المحرق',
    'opp-tree-planting':        'زراعة الأشجار في العرين',
    'opp-beach-cleanup':        'تنظيف الشاطئ الساحلي',
    'opp-food-drive':           'حملة توزيع طعام رمضان',
    'opp-elderly-care':         'زيارة رعاية المسنين',
    'opp-date-tomorrow':        'غداً، ٠٨:٠٠',
    'opp-date-sat':             'السبت، ١٦:٠٠',
    'opp-date-sun':             'الأحد، ١٠:٠٠',


    // Discover
    'weave-hero-title':     'اصنع أثرك في قصة البحرين',
    'weave-hero-desc':      'انضم لأكثر من ٢٬٥٠٠ متطوع يصنعون فرقاً كل يوم.',
    'explore-now':          'استكشف الآن',
    'browse-by-impact':     'تصفّح حسب الأثر',
    'view-all':             'عرض الكل',
    'pill-all':             'الكل',
    'pill-environment':     'البيئة',
    'pill-elderly':         'رعاية المسنين',
    'pill-education':       'التعليم',
    'pill-health':          'الصحة',
    'pill-community':       'المجتمع',
    'urgent-needs':         'احتياجات عاجلة',
    'high-priority':        'أولوية عالية',
    'marine-title':         'تنظيف بحري: شاطئ مالكية',
    'marine-org':           'جمعية البحرين للمحيطات',
    'tomorrow':             'غداً',
    'slots-8':              '٨ أماكن متبقية',
    'points-50':            '٥٠ طوع',
    'elderly-support':      'دعم المسنين',
    'evening-tea':          'شاي المساء في دار رعاية المحرق',
    '1800-today':           '٦:٠٠ م اليوم',
    'tutoring':             'دروس خصوصية',
    'math-help':            'مساعدة رياضيات لطلاب الثانوي',
    'online-wed':           'عبر الإنترنت • الأربعاء',
    'community-impact':     'الأثر المجتمعي',
    'your-community-impact':'أثرك في المجتمع',
    'weekly-goal-15':       'هدف الأسبوع: ١٥ ساعة',
    'hours-done':           'ساعات مُنجزة',
    'discover-badge':       'قصة عاجلة',
    'discover-hero-title':  'دفء وجبة مشتركة في المنامة',
    'discover-hero-desc':   'كل مساء، تقدم زينب وفريقها أكثر من ٢٠٠ وجبة. يحتاجون أربعة أيادٍ إضافية الليلة.',
    'discover-hero-btn':    'لبِّ النداء',
    'volunteer-map':        'خريطة المتطوعين',
    'active-spots':         '١٢ نقطة نشطة',
    'view-map':             'عرض الخريطة',
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
    'reward-detail-title':  'تفاصيل المكافأة',
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

    // Settings
    'app-prefs':            'تفضيلات التطبيق',
    'lang-setting':         'اللغة',
    'dark-mode-label':      'المظهر (الوضع الداكن)',

    // Bottom Nav
    'nav-home':             'الرئيسية',
    'nav-discover':         'اكتشف',
    'nav-rewards':          'المكافآت',
    'nav-profile':          'الملف',
    'nav-notifications':    'الإشعارات',
    'sign-out':             'تسجيل الخروج',

    // Notification permission page — stories
    'np-headline':           'شاهد أثرك',
    'np-subtitle-text':      'اكتشف كيف تحوّل الإشعارات الفورية أعمالك الصغيرة إلى إنجازات مجتمعية كبرى.',
    'np-story-1-title':      '٤٬٢٠٠+ حياة تلمستها',
    'np-story-1-quote':      '"بفضل الإشعارات العاجلة، وصل ٥٠ متطوعاً في أقل من ساعة لدعم جهودنا في إغاثة فيضانات المنامة."',
    'np-story-2-title':      'امتنان أب',
    'np-story-2-quote':      '"تنبيه التبرع بالدم أنقذ ابني. رأيت المتطوع يدخل المستشفى بعد ٢٠ دقيقة فقط من إرسال الطلب."',
    'np-story-3-title':      '١٥ طناً من النفايات أُزيلت',
    'np-story-3-quote':      'بالتنسيق عبر التنبيهات الفورية، أزال مجتمعنا ١٥ طناً من البلاستيك البحري من شواطئنا في عطلة نهاية أسبوع واحدة.',
    'np-btn-next-story':     'القصة التالية',
    'np-btn-hero':           'كن البطل القادم',
    'np-btn-skip-now':       'تخطّي الآن',

    // Edit profile
    'ep-title':              'تعديل الملف الشخصي',
    'ep-avatar-hint':        'اضغط لتغيير الصورة',
    'ep-name-label':         'الاسم الكامل',
    'ep-email-label':        'البريد الإلكتروني',
    'ep-phone-label':        'رقم الهاتف',
    'ep-bio-label':          'نبذة تعريفية',
    'ep-save-text':          'حفظ التغييرات',

    // Photo action sheet
    'photo-sheet-title':     'صورة الملف الشخصي',
    'photo-take':            'التقاط صورة',
    'photo-gallery':         'اختر من المعرض',
    'photo-remove':          'حذف الصورة',
    'photo-cancel':          'إلغاء',

    // Notifications page
    'notif-today':           'اليوم',
    'notif-earlier':         'سابقاً',
    'notif-view-details':    'عرض التفاصيل',

    // Confirm application modal
    'confirm-app-title':     'تم التسجيل!',
    'confirm-app-notice':    'سيراجع المنظّم طلبك وستتلقى إشعاراً عند القبول.',
    'confirm-app-home':      'العودة للرئيسية',
    'confirm-app-more':      'ابحث عن المزيد',

    // Confirm redemption modal
    'confirm-redeem-title':  'الخطوة الأخيرة',
    'confirm-redeem-sub':    'تحقق من اختيارك قبل تأكيد استبدال مكافأتك.',
    'confirm-redeem-notice': 'ستُضاف هذه المكافأة إلى قسم مكافآتي فور التأكيد.',
    'confirm-purchase-btn':  'تأكيد الشراء',
    'confirm-cancel-btn':    'إلغاء',

    // Auth prompt modal
    'auth-prompt-title':     'سجّل دخولك للمتابعة',
    'auth-prompt-sub':       'أنشئ حساباً مجانياً أو سجّل دخولك للمشاركة.',
    'auth-prompt-create':    'إنشاء حساب',
    'auth-prompt-signin':    'تسجيل الدخول',
    'auth-prompt-later':     'ربما لاحقاً',

    // Reward redeemed page
    'rr-page-title':         'تم استبدال المكافأة',
    'rr-code-label':         'رمز الاستبدال',
    'rr-valid-duration':     'صالح لمدة ٤٨ ساعة',
    'rr-expires-label':      'ينتهي:',
    'rr-branches':           'متاح في جميع فروع البحرين',
    'rr-how-to-title':       'كيفية الاستخدام',

    // Notification category labels
    'notif-label-urgent':    'إجراء عاجل',
    'notif-label-reward':    'المكافآت',
    'notif-label-discovery': 'اكتشاف',
    'notif-label-system':    'النظام',

    // Dynamic JS strings
    'valid-at':              'صالح في',
    'taw-currency':          'طوع',
    'reward-converted-msg':  'تم تحويل نقاط طوع الخاصة بك إلى مكافأة رائعة.',
    'applied-for':           'لقد سجّلت بنجاح في',
    'email-invalid':         'يرجى إدخال بريد إلكتروني صحيح',
    'password-too-short':    'يجب أن تكون كلمة المرور ٦ أحرف على الأقل',

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
      const val = translations[lang][key];
      // Use innerHTML if translation contains HTML tags, otherwise textContent
      if (val.includes('<')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
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
    const onclick = opt.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/'([^']+)'/);
      if (match) {
        opt.classList.toggle('active', match[1] === lang);
      }
    }
  });

  // Re-apply auth page text if auth mode function exists
  if (typeof setAuthMode === 'function') {
    setAuthMode(typeof authMode !== 'undefined' ? authMode : 'signin');
  }

  // Re-apply dynamic greeting with real user name
  if (typeof updateUserDisplay === 'function') {
    updateUserDisplay();
  }
}

// Make applyLanguage available globally
window.applyLanguage = applyLanguage;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('taw-lang') || 'en';
  if (savedLang !== 'en') {
    applyLanguage(savedLang);
  }
});
=======
// ═══════════════════════════════════════
// TAW — Internationalization (i18n)
// ═══════════════════════════════════════

const translations = {
  en: {
    // Landing
    'landing-headline':     'Volunteer. Earn. <br/>Impact.',
    'landing-subtitle':     'Join the movement transforming lives in Bahrain.',
    'landing-cta':          'Join the Cause',
    'landing-explore':      'Explore the app →',
    'landing-signin':       'Already making an impact?',
    'landing-signin-link':  'Sign In',

    // Onboarding: Interests
    'interests-title':      'What drives you?',
    'interests-subtitle':   'Select the causes you\'re most passionate about to personalize your volunteer journey.',
    'interests-why-title':  'Why this matters?',
    'interests-why-desc':   'Personalizing your interests helps us match you with high-impact opportunities that earn you more Tawwa Points.',
    'btn-skip':             'Skip',
    'btn-next':             'Next',

    // Onboarding: Notifications
    'notif-title':          'Stay in the Loop',
    'notif-subtitle':       'Enable notifications to get real-time alerts for urgent volunteer needs, reward milestones, and community updates.',
    'notif-b1-title':       'Urgent Direct Actions',
    'notif-b1-desc':        'Immediate opportunities to help in your immediate area.',
    'notif-b2-title':       'Verification Alerts',
    'notif-b2-desc':        'Get notified the moment your service hours are approved.',
    'notif-b3-title':       'Local Rewards',
    'notif-b3-desc':        'Get notified the moment you earn new points and rewards.',
    'btn-allow':            'Allow Notifications',
    'btn-maybe-later':      'Maybe Later',

    // Interest categories
    'cat-environment':      'Environment',
    'cat-elderly':          'Elderly Care',
    'cat-education':        'Education',
    'cat-health':           'Health',
    'cat-animal':           'Animal Welfare',
    'cat-social':           'Social Welfare',
    'cat-advocacy':         'Advocacy',
    'cat-arts':             'Arts & Culture',
    'cat-food':             'Food Security',

    // Home
    'greeting':                 'Hello, Guest!',
    'home-subtitle':            'Ready to make an impact today?',
    'points-label':             'Tawwa Points',
    'points-total-label':       'Total Balance',
    'tier-gold':                'Gold Tier',
    'progress-platinum':        'Progress to Platinum',
    'progress-pts-left':        '500 pts to next level',
    'impact-community-title':   'Total Community Impact',
    'impact-community-sub':     'You\'re making Bahrain better.',
    'hours-label':              'Hours',
    'opportunities-title':      'Opportunities Near You',
    'see-all':                  'See All',
    'rewards-brand-title':      'Redeem with points',
    'toast-dismiss':            'Dismiss',
    'error-fallback-title':     'Something went wrong',
    'error-fallback-body':      'The app hit an unexpected problem. Reload the page to continue safely.',
    'error-fallback-reload':    'Reload app',
    'error-fallback-dismiss':   'Dismiss',
    'aria-back':                'Go back',
    'aria-open-profile':        'Open profile',
    'aria-open-notifications':  'Open notifications',
    'aria-nav-home':            'Home tab',
    'aria-nav-rewards':         'Rewards tab',
    'aria-nav-profile':         'Profile tab',
    'aria-share-event':         'Share event',
    'confirm-default-title':    'Are you sure?',
    'btn-cancel':               'Cancel',
    'confirm-delete':           'Delete',

    // Opportunity cards
    'org-red-crescent':         'Bahrain Red Crescent',
    'org-green-bahrain':        'Green Bahrain Society',
    'org-muharraq':             'Muharraq Welfare',
    'opp-tree-planting':        'Tree Planting at Al Areen',
    'opp-beach-cleanup':        'Coastal Beach Cleanup',
    'opp-food-drive':           'Ramadan Food Drive',
    'opp-elderly-care':         'Elderly Care Visit',
    'opp-date-tomorrow':        'Tomorrow, 08:00',
    'opp-date-sat':             'Sat, 16:00',
    'opp-date-sun':             'Sun, 10:00',


    // Discover
    'weave-hero-title':     'Weave Your Part in Bahrain\'s Story',
    'weave-hero-desc':      'Join 2,500+ volunteers making a daily difference.',
    'explore-now':          'Explore Now',
    'browse-by-impact':     'Browse by Impact',
    'view-all':             'View All',
    'pill-all':             'All',
    'pill-environment':     'Environment',
    'pill-elderly':         'Elderly Care',
    'pill-education':       'Education',
    'pill-health':          'Health',
    'pill-community':       'Community',
    'urgent-needs':         'Urgent Needs',
    'high-priority':        'High Priority',
    'marine-title':         'Marine Cleanup: Malkiya Beach',
    'marine-org':           'Bahrain Ocean Society',
    'tomorrow':             'Tomorrow',
    'slots-8':              '8 Slots Left',
    'points-50':            '50 Taw',
    'elderly-support':      'Elderly Support',
    'evening-tea':          'Evening Tea at Muharraq Care Home',
    '1800-today':           '18:00 Today',
    'tutoring':             'Tutoring',
    'math-help':            'Math Help for Secondary Students',
    'online-wed':           'Online • Wed',
    'community-impact':     'Community Impact',
    'your-community-impact':'Your Community Impact',
    'weekly-goal-15':       'Weekly Goal: 15 Hours',
    'hours-done':           'Hours Done',
    'discover-badge':       'Urgent Story',
    'discover-hero-title':  'The Warmth of a Shared Meal in Manama',
    'discover-hero-desc':   'Every evening, Zainab and her team serve over 200 meals. They need four more hands tonight.',
    'discover-hero-btn':    'Answer the Call',
    'volunteer-map':        'Volunteer Map',
    'active-spots':         '12 Active Spots',
    'view-map':             'View Map',
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
    'points-earned':        'Tawwa Points Earned',
    'done-btn':             'Done',

    // Rewards Marketplace
    'rewards-title':        'Rewards Marketplace',
    'reward-detail-title':  'Reward Details',
    'missing-spot-title':   'Missing a spot? Tell us!',
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

    // Settings
    'app-prefs':            'App Preferences',
    'lang-setting':         'Language',
    'dark-mode-label':      'Appearance (Dark Mode)',

    // Bottom Nav
    'nav-home':             'Home',
    'nav-discover':         'Discover',
    'nav-rewards':          'Rewards',
    'nav-profile':          'Profile',
    'nav-notifications':    'Notifications',
    'sign-out':             'Sign Out',

    // Notification permission page — stories
    'np-headline':           'See Your Impact',
    'np-subtitle-text':      'Discover how real-time notifications turn your small acts into nationwide community milestones.',
    'np-story-1-title':      '4,200+ Lives Touched',
    'np-story-1-quote':      '"Because of urgent notifications, 50 volunteers arrived in under an hour to support our flood relief efforts in Manama."',
    'np-story-2-title':      "A Father's Gratitude",
    'np-story-2-quote':      '"The blood donor alert saved my son. I saw the Tawwa volunteer walk into the hospital just 20 minutes after the request went out."',
    'np-story-3-title':      '15 Tons of Waste Removed',
    'np-story-3-quote':      'By coordinating via instant alerts, our community removed 15 tons of ocean plastic from local shores in just one weekend.',
    'np-btn-next-story':     'Next Story',
    'np-btn-hero':           'Be the Next Hero',
    'np-btn-skip-now':       'Skip for now',

    // Edit profile
    'ep-title':              'Edit Profile',
    'ep-avatar-hint':        'Tap to change photo',
    'ep-name-label':         'Full Name',
    'ep-email-label':        'Email',
    'ep-phone-label':        'Phone Number',
    'ep-bio-label':          'Bio',
    'ep-save-text':          'Save Changes',

    // Photo action sheet
    'photo-sheet-title':     'Profile Photo',
    'photo-take':            'Take Photo',
    'photo-gallery':         'Choose from Gallery',
    'photo-remove':          'Remove Photo',
    'photo-cancel':          'Cancel',

    // Notifications page
    'notif-today':           'Today',
    'notif-earlier':         'Earlier',
    'notif-view-details':    'View Details',

    // Confirm application modal
    'confirm-app-title':     'Application Submitted!',
    'confirm-app-notice':    'The organizer will review your application. You will receive a notification when approved.',
    'confirm-app-home':      'Back to Home',
    'confirm-app-more':      'Find More Events',

    // Confirm redemption modal
    'confirm-redeem-title':  'Final Step',
    'confirm-redeem-sub':    'Verify your selection before we finalize your reward.',
    'confirm-redeem-notice': 'This reward will be added to your My Rewards section immediately upon confirmation.',
    'confirm-purchase-btn':  'Confirm Purchase',
    'confirm-cancel-btn':    'Cancel',

    // Auth prompt modal
    'auth-prompt-title':     'Sign in to continue',
    'auth-prompt-sub':       'Create a free account or sign in to take part.',
    'auth-prompt-create':    'Create Account',
    'auth-prompt-signin':    'Sign In',
    'auth-prompt-later':     'Maybe Later',

    // Reward redeemed page
    'rr-page-title':         'Reward Redeemed',
    'rr-code-label':         'REDEMPTION CODE',
    'rr-valid-duration':     'Valid for 48 hours',
    'rr-expires-label':      'Expires:',
    'rr-branches':           'Available at all Bahrain branches',
    'rr-how-to-title':       'How to use',

    // Notification category labels
    'notif-label-urgent':    'Urgent Action',
    'notif-label-reward':    'Rewards',
    'notif-label-discovery': 'Discovery',
    'notif-label-system':    'System',

    // Dynamic JS strings
    'valid-at':              'Valid at',
    'taw-currency':          'Tawwa',
    'reward-converted-msg':  'Your Tawwa Points have been converted into a great reward.',
    'applied-for':           'You have successfully applied for',
    'email-invalid':         'Please enter a valid email',
    'password-too-short':    'Password must be at least 6 characters',

    // Language toggle
    'lang-label':           'ع',
  },

  ar: {
    // Landing
    'landing-headline':     'تطوّع. اكسب. <br/>أثِّر.',
    'landing-subtitle':     'انضم للحركة التي تغيّر حياة الناس في البحرين.',
    'landing-cta':          'انضم للقضية',
    'landing-explore':      'استكشف التطبيق ←',
    'landing-signin':       'سبق وأحدثت أثراً؟',
    'landing-signin-link':  'سجّل دخول',

    // Onboarding: Interests
    'interests-title':      'ما الذي يُلهمك؟',
    'interests-subtitle':   'اختر القضايا التي تهمك لنُخصّص لك رحلة تطوعية تناسب شغفك.',
    'interests-why-title':  'لماذا هذا مهم؟',
    'interests-why-desc':   'تخصيص اهتماماتك يساعدنا في ربطك بفرص تطوعية مؤثرة تُكسبك نقاط طوع أكثر.',
    'btn-skip':             'تخطّي',
    'btn-next':             'التالي',

    // Onboarding: Notifications
    'notif-title':          'ابقَ على اطّلاع',
    'notif-subtitle':       'فعّل الإشعارات لتصلك تنبيهات فورية عن فرص التطوع العاجلة، والمكافآت، وأخبار المجتمع.',
    'notif-b1-title':       'إجراءات عاجلة',
    'notif-b1-desc':        'فرص تطوعية فورية في منطقتك.',
    'notif-b2-title':       'تنبيهات التحقق',
    'notif-b2-desc':        'ستُبلَّغ فور اعتماد ساعاتك التطوعية.',
    'notif-b3-title':       'مكافآت محلية',
    'notif-b3-desc':        'ستُبلَّغ فور حصولك على نقاط ومكافآت جديدة.',
    'btn-allow':            'السماح بالإشعارات',
    'btn-maybe-later':      'لاحقاً',

    // Interest categories
    'cat-environment':      'البيئة',
    'cat-elderly':          'رعاية المسنين',
    'cat-education':        'التعليم',
    'cat-health':           'الصحة',
    'cat-animal':           'رعاية الحيوان',
    'cat-social':           'الرعاية الاجتماعية',
    'cat-advocacy':         'المناصرة',
    'cat-arts':             'الفنون والثقافة',
    'cat-food':             'الأمن الغذائي',

    // Home
    'greeting':                 'أهلاً، ضيف!',
    'home-subtitle':            'مستعد لإحداث أثر اليوم؟',
    'points-label':             'نقاط طوع',
    'points-total-label':       'الرصيد الكلي',
    'tier-gold':                'الفئة الذهبية',
    'progress-platinum':        'التقدم نحو البلاتين',
    'progress-pts-left':        '٥٠٠ نقطة للمستوى التالي',
    'impact-community-title':   'إجمالي الأثر المجتمعي',
    'impact-community-sub':     'أنت تجعل البحرين أفضل.',
    'hours-label':              'ساعة',
    'opportunities-title':      'فرص قريبة منك',
    'see-all':                  'عرض الكل',
    'rewards-brand-title':      'استبدل بنقاطك',
    'toast-dismiss':            'إغلاق',
    'error-fallback-title':     'حدث خطأ ما',
    'error-fallback-body':      'واجه التطبيق مشكلة غير متوقعة. أعد تحميل الصفحة للمتابعة بأمان.',
    'error-fallback-reload':    'إعادة تحميل التطبيق',
    'error-fallback-dismiss':   'إغلاق',
    'aria-back':                'رجوع',
    'aria-open-profile':        'فتح الملف الشخصي',
    'aria-open-notifications':  'فتح الإشعارات',
    'aria-nav-home':            'تبويب الرئيسية',
    'aria-nav-rewards':         'تبويب المكافآت',
    'aria-nav-profile':         'تبويب الملف الشخصي',
    'aria-share-event':         'مشاركة الفعالية',
    'confirm-default-title':    'هل أنت متأكد؟',
    'btn-cancel':               'إلغاء',
    'confirm-delete':           'حذف',

    // Opportunity cards
    'org-red-crescent':         'الهلال الأحمر البحريني',
    'org-green-bahrain':        'جمعية البحرين الخضراء',
    'org-muharraq':             'رعاية المحرق',
    'opp-tree-planting':        'زراعة الأشجار في العرين',
    'opp-beach-cleanup':        'تنظيف الشاطئ الساحلي',
    'opp-food-drive':           'حملة توزيع طعام رمضان',
    'opp-elderly-care':         'زيارة رعاية المسنين',
    'opp-date-tomorrow':        'غداً، ٠٨:٠٠',
    'opp-date-sat':             'السبت، ١٦:٠٠',
    'opp-date-sun':             'الأحد، ١٠:٠٠',


    // Discover
    'weave-hero-title':     'اصنع أثرك في قصة البحرين',
    'weave-hero-desc':      'انضم لأكثر من ٢٬٥٠٠ متطوع يصنعون فرقاً كل يوم.',
    'explore-now':          'استكشف الآن',
    'browse-by-impact':     'تصفّح حسب الأثر',
    'view-all':             'عرض الكل',
    'pill-all':             'الكل',
    'pill-environment':     'البيئة',
    'pill-elderly':         'رعاية المسنين',
    'pill-education':       'التعليم',
    'pill-health':          'الصحة',
    'pill-community':       'المجتمع',
    'urgent-needs':         'احتياجات عاجلة',
    'high-priority':        'أولوية عالية',
    'marine-title':         'تنظيف بحري: شاطئ مالكية',
    'marine-org':           'جمعية البحرين للمحيطات',
    'tomorrow':             'غداً',
    'slots-8':              '٨ أماكن متبقية',
    'points-50':            '٥٠ طوع',
    'elderly-support':      'دعم المسنين',
    'evening-tea':          'شاي المساء في دار رعاية المحرق',
    '1800-today':           '٦:٠٠ م اليوم',
    'tutoring':             'دروس خصوصية',
    'math-help':            'مساعدة رياضيات لطلاب الثانوي',
    'online-wed':           'عبر الإنترنت • الأربعاء',
    'community-impact':     'الأثر المجتمعي',
    'your-community-impact':'أثرك في المجتمع',
    'weekly-goal-15':       'هدف الأسبوع: ١٥ ساعة',
    'hours-done':           'ساعات مُنجزة',
    'discover-badge':       'قصة عاجلة',
    'discover-hero-title':  'دفء وجبة مشتركة في المنامة',
    'discover-hero-desc':   'كل مساء، تقدم زينب وفريقها أكثر من ٢٠٠ وجبة. يحتاجون أربعة أيادٍ إضافية الليلة.',
    'discover-hero-btn':    'لبِّ النداء',
    'volunteer-map':        'خريطة المتطوعين',
    'active-spots':         '١٢ نقطة نشطة',
    'view-map':             'عرض الخريطة',
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
    'reward-detail-title':  'تفاصيل المكافأة',
    'missing-spot-title':   'لم نغطِ مكاناً؟ أخبرنا!',
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

    // Settings
    'app-prefs':            'تفضيلات التطبيق',
    'lang-setting':         'اللغة',
    'dark-mode-label':      'المظهر (الوضع الداكن)',

    // Bottom Nav
    'nav-home':             'الرئيسية',
    'nav-discover':         'اكتشف',
    'nav-rewards':          'المكافآت',
    'nav-profile':          'الملف',
    'nav-notifications':    'الإشعارات',
    'sign-out':             'تسجيل الخروج',

    // Notification permission page — stories
    'np-headline':           'شاهد أثرك',
    'np-subtitle-text':      'اكتشف كيف تحوّل الإشعارات الفورية أعمالك الصغيرة إلى إنجازات مجتمعية كبرى.',
    'np-story-1-title':      '٤٬٢٠٠+ حياة تلمستها',
    'np-story-1-quote':      '"بفضل الإشعارات العاجلة، وصل ٥٠ متطوعاً في أقل من ساعة لدعم جهودنا في إغاثة فيضانات المنامة."',
    'np-story-2-title':      'امتنان أب',
    'np-story-2-quote':      '"تنبيه التبرع بالدم أنقذ ابني. رأيت المتطوع يدخل المستشفى بعد ٢٠ دقيقة فقط من إرسال الطلب."',
    'np-story-3-title':      '١٥ طناً من النفايات أُزيلت',
    'np-story-3-quote':      'بالتنسيق عبر التنبيهات الفورية، أزال مجتمعنا ١٥ طناً من البلاستيك البحري من شواطئنا في عطلة نهاية أسبوع واحدة.',
    'np-btn-next-story':     'القصة التالية',
    'np-btn-hero':           'كن البطل القادم',
    'np-btn-skip-now':       'تخطّي الآن',

    // Edit profile
    'ep-title':              'تعديل الملف الشخصي',
    'ep-avatar-hint':        'اضغط لتغيير الصورة',
    'ep-name-label':         'الاسم الكامل',
    'ep-email-label':        'البريد الإلكتروني',
    'ep-phone-label':        'رقم الهاتف',
    'ep-bio-label':          'نبذة تعريفية',
    'ep-save-text':          'حفظ التغييرات',

    // Photo action sheet
    'photo-sheet-title':     'صورة الملف الشخصي',
    'photo-take':            'التقاط صورة',
    'photo-gallery':         'اختر من المعرض',
    'photo-remove':          'حذف الصورة',
    'photo-cancel':          'إلغاء',

    // Notifications page
    'notif-today':           'اليوم',
    'notif-earlier':         'سابقاً',
    'notif-view-details':    'عرض التفاصيل',

    // Confirm application modal
    'confirm-app-title':     'تم التسجيل!',
    'confirm-app-notice':    'سيراجع المنظّم طلبك وستتلقى إشعاراً عند القبول.',
    'confirm-app-home':      'العودة للرئيسية',
    'confirm-app-more':      'ابحث عن المزيد',

    // Confirm redemption modal
    'confirm-redeem-title':  'الخطوة الأخيرة',
    'confirm-redeem-sub':    'تحقق من اختيارك قبل تأكيد استبدال مكافأتك.',
    'confirm-redeem-notice': 'ستُضاف هذه المكافأة إلى قسم مكافآتي فور التأكيد.',
    'confirm-purchase-btn':  'تأكيد الشراء',
    'confirm-cancel-btn':    'إلغاء',

    // Auth prompt modal
    'auth-prompt-title':     'سجّل دخولك للمتابعة',
    'auth-prompt-sub':       'أنشئ حساباً مجانياً أو سجّل دخولك للمشاركة.',
    'auth-prompt-create':    'إنشاء حساب',
    'auth-prompt-signin':    'تسجيل الدخول',
    'auth-prompt-later':     'ربما لاحقاً',

    // Reward redeemed page
    'rr-page-title':         'تم استبدال المكافأة',
    'rr-code-label':         'رمز الاستبدال',
    'rr-valid-duration':     'صالح لمدة ٤٨ ساعة',
    'rr-expires-label':      'ينتهي:',
    'rr-branches':           'متاح في جميع فروع البحرين',
    'rr-how-to-title':       'كيفية الاستخدام',

    // Notification category labels
    'notif-label-urgent':    'إجراء عاجل',
    'notif-label-reward':    'المكافآت',
    'notif-label-discovery': 'اكتشاف',
    'notif-label-system':    'النظام',

    // Dynamic JS strings
    'valid-at':              'صالح في',
    'taw-currency':          'طوع',
    'reward-converted-msg':  'تم تحويل نقاط طوع الخاصة بك إلى مكافأة رائعة.',
    'applied-for':           'لقد سجّلت بنجاح في',
    'email-invalid':         'يرجى إدخال بريد إلكتروني صحيح',
    'password-too-short':    'يجب أن تكون كلمة المرور ٦ أحرف على الأقل',

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
      const val = translations[lang][key];
      // Use innerHTML if translation contains HTML tags, otherwise textContent
      if (val.includes('<')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute('aria-label', translations[lang][key]);
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
    const onclick = opt.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/'([^']+)'/);
      if (match) {
        opt.classList.toggle('active', match[1] === lang);
      }
    }
  });

  // Re-apply auth page text if auth mode function exists
  if (typeof setAuthMode === 'function') {
    setAuthMode(typeof authMode !== 'undefined' ? authMode : 'signin');
  }

  // Re-apply dynamic greeting with real user name
  if (typeof updateUserDisplay === 'function') {
    updateUserDisplay();
  }
}

// Make applyLanguage available globally
window.applyLanguage = applyLanguage;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('taw-lang') || 'en';
  if (savedLang !== 'en') {
    applyLanguage(savedLang);
  }
});
>>>>>>> 0491e48748a4e8a561a915951c263da89295a035
