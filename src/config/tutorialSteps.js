/**
 * Returns the ordered tutorial step definitions.
 * @param {{ isAr: boolean }} opts
 */
export function getTutorialSteps({ isAr }) {
  const t = (en, ar) => (isAr ? ar : en)

  return [
    {
      title:   t('Welcome to Tawwa!', '!أهلاً بك في طوّع'),
      text:    t(
        'Let me give you a quick tour of your new civic fabric.',
        'دعني أعطيك جولة سريعة في تطبيقك الجديد.'
      ),
      mascot:   'mascot-celebrate.webp',
      targetId: null,
    },
    {
      title:   t('Impact Dashboard', 'لوحة التأثير'),
      text:    t(
        'Track your points and level up by completing volunteer opportunities.',
        'تابع نقاطك وارتقِ بمستواك عند إكمال الفرص التطوعية.'
      ),
      mascot:    'mascot-point-up.webp',
      placement: 'below',
      targetId:  'tutorial-impact',
    },
    {
      title:   t('Discover Events', 'اكتشف الفعاليات'),
      text:    t(
        'Use the search bar and category filters to find the perfect way to volunteer.',
        'استخدم البحث والفلاتر لإيجاد الفرصة المثالية للتطوع.'
      ),
      mascot:    'mascot-explain.webp',
      placement: 'below',
      targetId:  'tutorial-search',
    },
    {
      title:   t('Opportunities Feed', 'قائمة الفرص'),
      text:    t(
        'Browse urgent needs and upcoming events right here. Tap any card to sign up.',
        'تصفح الاحتياجات العاجلة والفعاليات القادمة هنا. اضغط على أي بطاقة للتسجيل.'
      ),
      mascot:    'mascot-point-left.webp',
      placement: 'above',
      targetId:  'tutorial-feed',
    },
    {
      title:          t('Navigation Menu', 'القائمة السفلية'),
      text:           t(
        'Switch between Home, Rewards, and your Profile from the bottom menu.',
        'تنقل بين الرئيسية والمكافآت وملفك الشخصي من القائمة السفلية.'
      ),
      mascot:         'mascot-point-down.webp',
      placement:      'above',
      targetId:       'tutorial-bottom-nav',
      mascotPosition: 'bottom',
    },
    {
      title:   t('Rewards Center', 'مركز المكافآت'),
      text:    t(
        'Redeem your hard-earned volunteer points for real rewards from local businesses.',
        'استبدل نقاط تطوعك بمكافآت حقيقية من الشركاء المحليين.'
      ),
      mascot:    'mascot-celebrate.webp',
      placement: 'below',
      targetId:  'tutorial-rewards-header',
      path:      '/rewards',
    },
    {
      title:   t('Your Profile & Tier', 'ملفك الشخصي ومستواك'),
      text:    t(
        'Level up from Bronze to Platinum as you volunteer more. Your tier unlocks better rewards.',
        'ارتقِ من البرونز إلى البلاتينيوم كلما تطوعت أكثر. مستواك يفتح مكافآت أفضل.'
      ),
      mascot:    'mascot-point-up.webp',
      placement: 'below',
      targetId:  'tutorial-profile-tier',
      path:      '/profile',
    },
    {
      title:   t('Verified Volunteer CV', 'السيرة الذاتية التطوعية'),
      text:    t(
        'Once you complete sessions, download a tamper-proof PDF CV with a QR code employers can verify.',
        'بعد إكمال الجلسات، حمّل سيرة ذاتية تطوعية موثقة بـ QR يمكن للجهات التحقق منها.'
      ),
      mascot:    'mascot-explain.webp',
      placement: 'above',
      targetId:  'tutorial-cv-card',
    },
    {
      title:   t('Ready to Go!', '!أنت جاهز'),
      text:    t(
        "You're all set to make a positive impact. Dive in!",
        'كل شيء جاهز لتبدأ بإحداث تأثير إيجابي. انطلق!'
      ),
      mascot:   'mascot-idle.webp',
      targetId: null,
      path:     '/home',
    },
  ]
}
