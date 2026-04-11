/**
 * @fileoverview TAW — Centralized error handling utilities (ES Module)
 *
 * A thin wrapper around async operations that provides:
 *   1. Consistent try/catch with user-friendly error mapping
 *   2. Optional toast notification on failure
 *   3. Structured error typing for predictable error objects
 */

// ── Error code → user-facing message map ─────────────────────────────────────

/** @type {Record<string, string>} */
const ERROR_MAP = {
  // Supabase Auth codes
  'invalid_credentials':            'Incorrect email or password.',
  'email_not_confirmed':            'Please verify your email before signing in.',
  'user_already_exists':            'An account with this email already exists.',
  'weak_password':                  'Password is too weak. Use at least 8 characters.',
  // HTTP status fallbacks
  '401':                            'Session expired. Please sign in again.',
  '403':                            'You don\'t have permission to perform this action.',
  '409':                            'This action conflicts with an existing record.',
  '422':                            'The data you entered is invalid.',
  '429':                            'Too many attempts. Please wait 5 minutes.',
  '500':                            'A server error occurred. Please try again later.',
  // Network
  'Failed to fetch':                'No internet connection. Please check your network.',
  'NetworkError':                   'No internet connection. Please check your network.',
  // Default
  'default':                        'Something went wrong. Please try again.'
}

// ── Error type ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} TawError
 * @property {boolean} ok      - Always false.
 * @property {string}  message - User-facing message.
 * @property {unknown} raw     - Original error payload.
 */

/**
 * @typedef {Object} TawResult
 * @template T
 * @property {boolean}       ok    - true on success.
 * @property {T|null}        data  - The resolved data (null on failure).
 * @property {TawError|null} error - Structured error (null on success).
 */

// ── Core helpers ──────────────────────────────────────────────────────────────

/**
 * Map a raw error to a user-friendly string.
 *
 * @param {unknown} err
 * @returns {string}
 */
export function mapError(err) {
  if (!err) return ERROR_MAP['default']
  const raw = typeof err === 'string' ? err : (err?.message ?? String(err))

  // Check exact match first
  if (ERROR_MAP[raw]) return ERROR_MAP[raw]

  // Check prefix/substring match
  for (const [key, msg] of Object.entries(ERROR_MAP)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return msg
  }

  return ERROR_MAP['default']
}

/**
 * Wrap an async function with automatic error handling.
 *
 * @template T
 * @param {() => Promise<T>} fn - Async operation to run.
 * @param {object} [opts]
 * @param {(message: string) => void} [opts.onError] - Called with a user-friendly message on failure.
 * @returns {Promise<TawResult<T>>}
 *
 * @example
 * const { ok, data, error } = await safeAsync(() => fetchDeals())
 * if (!ok) showToast(error.message, 'error')
 */
export async function safeAsync(fn, { onError } = {}) {
  try {
    const data = await fn()
    return { ok: true, data, error: null }
  } catch (err) {
    const message = mapError(err)
    if (typeof onError === 'function') onError(message)
    console.error('[TAW Error]', err)
    return { ok: false, data: null, error: { ok: false, message, raw: err } }
  }
}

/**
 * Assert that a Supabase `{ data, error }` response is successful.
 * Throws a normalized Error if the Supabase response carries an error.
 *
 * @param {{ data: unknown, error: { message?: string } | null }} response
 * @returns {unknown} The `data` field.
 * @throws {Error}
 */
export function assertSupabase({ data, error }) {
  if (error) {
    throw new Error(error.message ?? 'Unknown Supabase error')
  }
  return data
}
