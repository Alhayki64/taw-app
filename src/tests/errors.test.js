/**
 * @fileoverview Unit tests — Error handling utilities
 */

import { describe, it, expect, vi } from 'vitest'
import { mapError, safeAsync, assertSupabase } from '@lib/errors.js'

// ── mapError() ────────────────────────────────────────────────────────────────

describe('mapError()', () => {
  it('maps invalid_credentials to a friendly message', () => {
    expect(mapError('invalid_credentials')).toBe('Incorrect email or password.')
  })

  it('maps 429 status to rate-limit message', () => {
    expect(mapError('429')).toContain('Too many attempts')
  })

  it('maps a "Failed to fetch" network error', () => {
    expect(mapError('Failed to fetch')).toContain('No internet')
  })

  it('maps an Error object by reading its message', () => {
    const err = new Error('weak_password')
    expect(mapError(err)).toBe('Password is too weak. Use at least 8 characters.')
  })

  it('does a substring match inside longer error strings', () => {
    // Supabase sometimes returns "AuthApiError: invalid_credentials: ..."
    const err = new Error('AuthApiError: invalid_credentials: Email not confirmed')
    expect(mapError(err)).toBe('Incorrect email or password.')
  })

  it('returns the default fallback for unknown errors', () => {
    expect(mapError('some_totally_unknown_code')).toBe('Something went wrong. Please try again.')
  })

  it('returns default for null/undefined', () => {
    expect(mapError(null)).toBe('Something went wrong. Please try again.')
    expect(mapError(undefined)).toBe('Something went wrong. Please try again.')
  })
})

// ── safeAsync() ───────────────────────────────────────────────────────────────

describe('safeAsync()', () => {
  it('returns { ok: true, data } on success', async () => {
    const result = await safeAsync(async () => ({ id: 1, name: 'Test' }))
    expect(result.ok).toBe(true)
    expect(result.data).toEqual({ id: 1, name: 'Test' })
    expect(result.error).toBeNull()
  })

  it('returns { ok: false, error } on thrown Error', async () => {
    const result = await safeAsync(async () => { throw new Error('Failed to fetch') })
    expect(result.ok).toBe(false)
    expect(result.data).toBeNull()
    expect(result.error.message).toContain('No internet')
  })

  it('calls onError callback with the user-friendly message', async () => {
    const onError = vi.fn()
    await safeAsync(async () => { throw new Error('weak_password') }, { onError })
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith('Password is too weak. Use at least 8 characters.')
  })

  it('does NOT call onError on success', async () => {
    const onError = vi.fn()
    await safeAsync(async () => 42, { onError })
    expect(onError).not.toHaveBeenCalled()
  })

  it('wraps a rejected promise (non-Error rejection)', async () => {
    const result = await safeAsync(async () => Promise.reject('429'))
    expect(result.ok).toBe(false)
    expect(result.error.message).toContain('Too many attempts')
  })
})

// ── assertSupabase() ──────────────────────────────────────────────────────────

describe('assertSupabase()', () => {
  it('returns data when there is no error', () => {
    const response = { data: [{ id: 1 }], error: null }
    expect(assertSupabase(response)).toEqual([{ id: 1 }])
  })

  it('throws when error is present', () => {
    const response = { data: null, error: { message: 'row not found' } }
    expect(() => assertSupabase(response)).toThrow('row not found')
  })

  it('throws a generic message when error has no message field', () => {
    const response = { data: null, error: {} }
    expect(() => assertSupabase(response)).toThrow('Unknown Supabase error')
  })
})
