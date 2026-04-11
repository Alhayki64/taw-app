/**
 * @fileoverview Unit tests — i18n & TAW-XXXX validation
 */

import { describe, it, expect } from 'vitest'
import {
  t,
  toArabicNumerals,
  toWesternNumerals,
  containsHtml,
  validateTawCode,
  TAW_CODE_PATTERN
} from '@lib/i18n.js'

// ── t() — translation lookup ──────────────────────────────────────────────────

describe('t() translation lookup', () => {
  it('returns the English string for a known key', () => {
    expect(t('nav-home', 'en')).toBe('Home')
  })

  it('returns the Arabic string for a known key', () => {
    expect(t('nav-home', 'ar')).toBe('الرئيسية')
  })

  it('falls back to English when key is missing in Arabic pack', () => {
    // email-invalid is present in both, but if we add a key only to EN it falls back
    expect(t('email-invalid', 'en')).toBe('Please enter a valid email')
  })

  it('returns the raw key when it is not found in any locale', () => {
    expect(t('nonexistent-key-xyz', 'en')).toBe('nonexistent-key-xyz')
  })

  it('defaults to English when no lang arg is provided', () => {
    expect(t('sign-out')).toBe('Sign Out')
  })
})

// ── Numeral conversion ────────────────────────────────────────────────────────

describe('toArabicNumerals()', () => {
  it('converts a simple number string', () => {
    expect(toArabicNumerals('123')).toBe('١٢٣')
  })

  it('converts a mixed string', () => {
    expect(toArabicNumerals('3 hours')).toBe('٣ hours')
  })

  it('leaves non-digit characters untouched', () => {
    expect(toArabicNumerals('TAW-1234')).toBe('TAW-١٢٣٤')
  })

  it('handles a numeric (non-string) input', () => {
    expect(toArabicNumerals(500)).toBe('٥٠٠')
  })

  it('returns empty string for empty input', () => {
    expect(toArabicNumerals('')).toBe('')
  })
})

describe('toWesternNumerals()', () => {
  it('converts Arabic-Indic digits back to Western', () => {
    expect(toWesternNumerals('١٢٣')).toBe('123')
  })

  it('round-trips correctly through toArabic then toWestern', () => {
    const original = '2025'
    expect(toWesternNumerals(toArabicNumerals(original))).toBe(original)
  })

  it('handles strings with no Arabic digits', () => {
    expect(toWesternNumerals('hello')).toBe('hello')
  })
})

// ── containsHtml() ────────────────────────────────────────────────────────────

describe('containsHtml()', () => {
  it('returns true for strings with HTML tags', () => {
    expect(containsHtml('Volunteer. Earn. <br/> Impact.')).toBe(true)
  })

  it('returns false for plain strings', () => {
    expect(containsHtml('Hello, Guest!')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(containsHtml('')).toBe(false)
  })

  it('returns false for non-string values', () => {
    expect(containsHtml(null)).toBe(false)
    expect(containsHtml(undefined)).toBe(false)
  })
})

// ── validateTawCode() ─────────────────────────────────────────────────────────

describe('validateTawCode()', () => {
  it('accepts a valid TAW-XXXX code', () => {
    const result = validateTawCode('TAW-1234')
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('accepts a valid code regardless of case input', () => {
    const result = validateTawCode('taw-9999')
    expect(result.valid).toBe(true)
  })

  it('rejects a code without the dash', () => {
    expect(validateTawCode('TAW1234').valid).toBe(false)
  })

  it('rejects a code with fewer than 4 digits', () => {
    expect(validateTawCode('TAW-12').valid).toBe(false)
  })

  it('rejects a code with more than 4 digits', () => {
    expect(validateTawCode('TAW-12345').valid).toBe(false)
  })

  it('rejects a code with letters in the digit position', () => {
    expect(validateTawCode('TAW-ABCD').valid).toBe(false)
  })

  it('rejects null / undefined', () => {
    expect(validateTawCode(null).valid).toBe(false)
    expect(validateTawCode(undefined).valid).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(validateTawCode('').valid).toBe(false)
  })
})

// ── TAW_CODE_PATTERN regex ────────────────────────────────────────────────────

describe('TAW_CODE_PATTERN regex', () => {
  it('matches valid codes', () => {
    expect(TAW_CODE_PATTERN.test('TAW-0000')).toBe(true)
    expect(TAW_CODE_PATTERN.test('TAW-9999')).toBe(true)
  })

  it('does not match invalid codes', () => {
    expect(TAW_CODE_PATTERN.test('TAW-999')).toBe(false)
    expect(TAW_CODE_PATTERN.test('TAW-99999')).toBe(false)
    expect(TAW_CODE_PATTERN.test('TAW 1234')).toBe(false)
    expect(TAW_CODE_PATTERN.test('')).toBe(false)
  })
})
