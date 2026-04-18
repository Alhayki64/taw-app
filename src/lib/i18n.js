/**
 * @fileoverview Tawwa — Pure i18n logic (ES Module)
 *
 * This module contains ONLY pure functions extracted from i18n.js
 * so they can be unit-tested with Vitest without a DOM or browser globals.
 *
 * The legacy i18n.js in the root continues to serve the SPA via <script> tag.
 * This module is the testable mirror of that logic.
 */

// ── Translation Tables ────────────────────────────────────────────────────────

/** @type {{ en: Record<string,string>, ar: Record<string,string> }} */
export const translations = {
  en: {
    'landing-headline':   'Volunteer. Earn. Impact.',
    'landing-cta':        'Join the Cause',
    'greeting':           'Hello, Guest!',
    'points-label':       'Tawwa Points',
    'error-fallback-title': 'Something went wrong',
    'toast-dismiss':      'Dismiss',
    'btn-cancel':         'Cancel',
    'confirm-delete':     'Delete',
    'sign-out':           'Sign Out',
    'nav-home':           'Home',
    'nav-rewards':        'Rewards',
    'nav-profile':        'Profile',
    'lang-label':         'ع',
    'email-invalid':      'Please enter a valid email',
    'password-too-short': 'Password must be at least 6 characters',
  },
  ar: {
    'landing-headline':   'تطوّع. اكسب. أثِّر.',
    'landing-cta':        'انضم للقضية',
    'greeting':           'أهلاً، ضيف!',
    'points-label':       'نقاط طوّع',
    'error-fallback-title': 'حدث خطأ ما',
    'toast-dismiss':      'إغلاق',
    'btn-cancel':         'إلغاء',
    'confirm-delete':     'حذف',
    'sign-out':           'تسجيل الخروج',
    'nav-home':           'الرئيسية',
    'nav-rewards':        'المكافآت',
    'nav-profile':        'الملف',
    'lang-label':         'EN',
    'email-invalid':      'يرجى إدخال بريد إلكتروني صحيح',
    'password-too-short': 'يجب أن تكون كلمة المرور ٦ أحرف على الأقل',
  }
}

// ── Numeral conversion helpers ────────────────────────────────────────────────

/** @type {Record<string,string>} */
const westernToArabic = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
}

/** @type {Record<string,string>} */
const arabicToWestern = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
}

/**
 * Convert Western (0-9) digits to Arabic-Indic (٠-٩).
 * @param {string|number} value
 * @returns {string}
 */
export function toArabicNumerals(value) {
  return String(value).replace(/[0-9]/g, d => westernToArabic[d])
}

/**
 * Convert Arabic-Indic (٠-٩) digits back to Western (0-9).
 * @param {string|number} value
 * @returns {string}
 */
export function toWesternNumerals(value) {
  return String(value).replace(/[٠-٩]/g, d => arabicToWestern[d])
}

// ── Translation lookup ────────────────────────────────────────────────────────

/**
 * Look up a translation key for the given locale.
 * Falls back to the English string, then to the raw key.
 * @param {string} key
 * @param {'en'|'ar'} lang
 * @returns {string}
 */
export function t(key, lang = 'en') {
  const pack = translations[lang] ?? translations['en']
  return pack[key] ?? translations['en'][key] ?? key
}

/**
 * Determine whether a translation value should be injected as HTML
 * (it contains a '<' character) or as plain text.
 * @param {string} value
 * @returns {boolean}
 */
export function containsHtml(value) {
  return typeof value === 'string' && value.includes('<')
}

// ── TAW-XXXX code validation ──────────────────────────────────────────────────

/** Regex pattern for valid TAW codes. */
export const TAW_CODE_PATTERN = /^TAW-\d{4}$/

/**
 * Validate a TAW-XXXX code string.
 * @param {string} code
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateTawCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'TAW code is required' }
  }
  const trimmed = code.trim().toUpperCase()
  if (!TAW_CODE_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid TAW-XXXX code (e.g. TAW-1234)' }
  }
  return { valid: true, error: null }
}
