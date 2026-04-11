/**
 * @fileoverview Unit tests — Points calculation & helpers
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSessionPoints,
  shouldFlagSession,
  redemptionExpiresAt,
  formatTransactionType,
  formatDate,
  canAfford,
  POINTS_PER_HOUR,
  REPEAT_ORG_BONUS,
  REDEMPTION_WINDOW_MINUTES,
  MAX_DAILY_HOURS
} from '@lib/points.js'

// ── calculateSessionPoints() ──────────────────────────────────────────────────

describe('calculateSessionPoints()', () => {
  it('calculates base points correctly for a 2-hour session', () => {
    const result = calculateSessionPoints({ hours: 2 })
    expect(result.basePoints).toBe(200)
    expect(result.total).toBe(200)
  })

  it('rounds base points (e.g. 1.5 hours → 150)', () => {
    const result = calculateSessionPoints({ hours: 1.5 })
    expect(result.basePoints).toBe(150)
  })

  it('applies 50% first-time bonus on top of base', () => {
    const result = calculateSessionPoints({ hours: 2, isFirstTime: true })
    expect(result.firstTimeBonus).toBe(100) // 50% of 200
    expect(result.total).toBe(300)
  })

  it('applies 50% skills bonus', () => {
    const result = calculateSessionPoints({ hours: 2, isSkilled: true })
    expect(result.skilledBonus).toBe(100)
    expect(result.total).toBe(300)
  })

  it('applies 25% urgent bonus', () => {
    const result = calculateSessionPoints({ hours: 2, isUrgent: true })
    expect(result.urgentBonus).toBe(50) // 25% of 200
    expect(result.total).toBe(250)
  })

  it('applies flat repeat-org loyalty bonus', () => {
    const result = calculateSessionPoints({ hours: 2, isRepeatOrg: true })
    expect(result.repeatOrgBonus).toBe(REPEAT_ORG_BONUS)
    expect(result.total).toBe(200 + REPEAT_ORG_BONUS)
  })

  it('stacks all bonuses correctly', () => {
    const result = calculateSessionPoints({
      hours: 2,
      isFirstTime: true,
      isSkilled: true,
      isUrgent: true,
      isRepeatOrg: true
    })
    const expected = 200 + 100 + 100 + 50 + REPEAT_ORG_BONUS
    expect(result.total).toBe(expected)
  })

  it('returns zero total for 0 hours', () => {
    const result = calculateSessionPoints({ hours: 0 })
    expect(result.total).toBe(0)
  })

  it('handles no optional flags (all false by default)', () => {
    const result = calculateSessionPoints({ hours: 3 })
    expect(result.firstTimeBonus).toBe(0)
    expect(result.skilledBonus).toBe(0)
    expect(result.urgentBonus).toBe(0)
    expect(result.repeatOrgBonus).toBe(0)
  })

  it('exposes all breakdown fields', () => {
    const result = calculateSessionPoints({ hours: 1 })
    expect(result).toHaveProperty('basePoints')
    expect(result).toHaveProperty('firstTimeBonus')
    expect(result).toHaveProperty('skilledBonus')
    expect(result).toHaveProperty('urgentBonus')
    expect(result).toHaveProperty('repeatOrgBonus')
    expect(result).toHaveProperty('total')
  })
})

// ── POINTS_PER_HOUR constant ──────────────────────────────────────────────────

describe('POINTS_PER_HOUR', () => {
  it('is 100', () => {
    expect(POINTS_PER_HOUR).toBe(100)
  })
})

// ── shouldFlagSession() ───────────────────────────────────────────────────────

describe('shouldFlagSession()', () => {
  it('does NOT flag when total hours are exactly at the limit', () => {
    expect(shouldFlagSession(8, 2)).toBe(false)  // 8 + 2 = 10, not > 10
  })

  it('flags when total hours exceed the daily limit', () => {
    expect(shouldFlagSession(9, 2)).toBe(true)   // 9 + 2 = 11 > 10
  })

  it('does not flag a normal short session', () => {
    expect(shouldFlagSession(0, 3)).toBe(false)
  })

  it('flags an already-exceeded day with any addition', () => {
    expect(shouldFlagSession(10, 0.5)).toBe(true)
  })

  it('uses MAX_DAILY_HOURS constant (10)', () => {
    expect(MAX_DAILY_HOURS).toBe(10)
  })
})

// ── redemptionExpiresAt() ─────────────────────────────────────────────────────

describe('redemptionExpiresAt()', () => {
  it('returns a Date', () => {
    expect(redemptionExpiresAt()).toBeInstanceOf(Date)
  })

  it(`expires ${REDEMPTION_WINDOW_MINUTES} minutes after the reference time`, () => {
    const ref = new Date('2025-01-01T12:00:00Z')
    const result = redemptionExpiresAt(ref)
    const expectedMs = ref.getTime() + REDEMPTION_WINDOW_MINUTES * 60 * 1000
    expect(result.getTime()).toBe(expectedMs)
  })

  it('defaults to approximately now (within 1 s)', () => {
    const before = Date.now()
    const result = redemptionExpiresAt()
    const after  = Date.now()
    const expectedMin = before + REDEMPTION_WINDOW_MINUTES * 60 * 1000
    const expectedMax = after  + REDEMPTION_WINDOW_MINUTES * 60 * 1000
    expect(result.getTime()).toBeGreaterThanOrEqual(expectedMin)
    expect(result.getTime()).toBeLessThanOrEqual(expectedMax)
  })
})

// ── formatTransactionType() ───────────────────────────────────────────────────

describe('formatTransactionType()', () => {
  it('maps earn_base → Volunteering', () => {
    expect(formatTransactionType('earn_base')).toBe('Volunteering')
  })

  it('maps redeem → Deal redeemed', () => {
    expect(formatTransactionType('redeem')).toBe('Deal redeemed')
  })

  it('maps expire → Points expired', () => {
    expect(formatTransactionType('expire')).toBe('Points expired')
  })

  it('maps admin_adjust → Adjustment', () => {
    expect(formatTransactionType('admin_adjust')).toBe('Adjustment')
  })

  it('returns the raw type for unknown codes', () => {
    expect(formatTransactionType('some_future_type')).toBe('some_future_type')
  })
})

// ── canAfford() ───────────────────────────────────────────────────────────────

describe('canAfford()', () => {
  it('returns true when balance equals cost', () => {
    expect(canAfford(500, 500)).toBe(true)
  })

  it('returns true when balance exceeds cost', () => {
    expect(canAfford(1000, 300)).toBe(true)
  })

  it('returns false when balance is insufficient', () => {
    expect(canAfford(100, 500)).toBe(false)
  })

  it('returns false for zero balance with any cost', () => {
    expect(canAfford(0, 1)).toBe(false)
  })

  it('returns false for non-numeric inputs', () => {
    expect(canAfford(null, 100)).toBe(false)
    expect(canAfford(500, undefined)).toBe(false)
  })
})
