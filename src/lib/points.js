/**
 * @fileoverview TAW — Pure points calculation logic (ES Module)
 *
 * All functions here are pure (no network, no DOM) so they can be
 * unit-tested with Vitest. The legacy points.js continues to serve
 * the running SPA.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

/** Base points awarded per hour of volunteering. */
export const POINTS_PER_HOUR = 100

/** Multiplier for the first-time a volunteer completes a session (50% bonus). */
export const FIRST_TIME_MULTIPLIER = 0.5

/** Multiplier for skilled sessions (50% bonus). */
export const SKILLED_MULTIPLIER = 0.5

/** Multiplier for urgent-session bonus (25% bonus). */
export const URGENT_MULTIPLIER = 0.25

/** Flat bonus for completing a 3rd session at the same org (loyalty). */
export const REPEAT_ORG_BONUS = 50

/** Maximum daily volunteer hours before a session is flagged. */
export const MAX_DAILY_HOURS = 10

/** Redemption window in minutes (deal expires after this). */
export const REDEMPTION_WINDOW_MINUTES = 15

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PointsBreakdown
 * @property {number} basePoints
 * @property {number} firstTimeBonus
 * @property {number} skilledBonus
 * @property {number} urgentBonus
 * @property {number} repeatOrgBonus
 * @property {number} total
 */

/**
 * @typedef {Object} SessionOptions
 * @property {number}  hours          - Duration of the session in hours.
 * @property {boolean} isFirstTime    - Whether this is the volunteer's first confirmed session.
 * @property {boolean} isSkilled      - Whether the volunteer provided skilled labour.
 * @property {boolean} isUrgent       - Whether the opportunity was marked urgent.
 * @property {boolean} isRepeatOrg    - True when the volunteer's 3rd session at this org.
 */

// ── Core calculation ──────────────────────────────────────────────────────────

/**
 * Calculate a full points breakdown for a confirmed volunteer session.
 *
 * @param {SessionOptions} opts
 * @returns {PointsBreakdown}
 */
export function calculateSessionPoints({
  hours,
  isFirstTime = false,
  isSkilled = false,
  isUrgent = false,
  isRepeatOrg = false
}) {
  const base = Math.round(hours * POINTS_PER_HOUR)
  const firstTimeBonus = isFirstTime ? Math.round(base * FIRST_TIME_MULTIPLIER) : 0
  const skilledBonus   = isSkilled   ? Math.round(base * SKILLED_MULTIPLIER)    : 0
  const urgentBonus    = isUrgent    ? Math.round(base * URGENT_MULTIPLIER)      : 0
  const repeatOrgBonus = isRepeatOrg ? REPEAT_ORG_BONUS                          : 0

  return {
    basePoints:     base,
    firstTimeBonus,
    skilledBonus,
    urgentBonus,
    repeatOrgBonus,
    total: base + firstTimeBonus + skilledBonus + urgentBonus + repeatOrgBonus
  }
}

/**
 * Check whether a session should be flagged for fraud review based on
 * total hours accumulated today (including the incoming session).
 *
 * @param {number} existingHoursToday - Hours already confirmed today.
 * @param {number} newHours           - Hours from the new incoming session.
 * @returns {boolean} true if it should be flagged
 */
export function shouldFlagSession(existingHoursToday, newHours) {
  return (existingHoursToday + newHours) > MAX_DAILY_HOURS
}

// ── Redemption helpers ────────────────────────────────────────────────────────

/**
 * Calculate the expiry timestamp for a new redemption.
 *
 * @param {Date} [now] - Reference time (defaults to current time).
 * @returns {Date}
 */
export function redemptionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + REDEMPTION_WINDOW_MINUTES * 60 * 1000)
}

// ── Display helpers ───────────────────────────────────────────────────────────

/**
 * Format a transaction type code into a human-readable label.
 *
 * @param {string} type
 * @returns {string}
 */
export function formatTransactionType(type) {
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
  return labels[type] ?? type
}

/**
 * Format an ISO date string into a short human-readable date.
 *
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-BH', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

/**
 * Determine whether a user's current balance can afford a deal.
 *
 * @param {number} currentBalance
 * @param {number} pointsCost
 * @returns {boolean}
 */
export function canAfford(currentBalance, pointsCost) {
  return typeof currentBalance === 'number'
    && typeof pointsCost       === 'number'
    && currentBalance >= pointsCost
}
