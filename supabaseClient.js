/* =============================================
   TAW (طوع) — SUPABASE CLIENT
   ============================================= */

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} AuthState
 * @property {import('@supabase/supabase-js').Session | null} session - Active session or null.
 * @property {import('@supabase/supabase-js').User    | null} user    - Authenticated user or null.
 * @property {boolean}                                         loading  - True until first auth event fires.
 */

/**
 * @typedef {Object} Opportunity
 * @property {string}  id
 * @property {string}  title
 * @property {string}  org_name
 * @property {string}  category
 * @property {string}  date
 * @property {string}  [time_range]
 * @property {string}  [location]
 * @property {number}  [volunteers_filled]
 * @property {number}  [max_volunteers]
 * @property {number}  points
 * @property {string}  [description]
 * @property {string}  [hero_image_url]
 * @property {string}  [image_url]
 * @property {string}  [map_label]
 */

/**
 * @typedef {Object} Deal
 * @property {string}  id
 * @property {string}  title
 * @property {string}  brand_name
 * @property {string}  [category]
 * @property {number}  [points_cost]
 * @property {number}  [cost]
 * @property {string}  [description]
 * @property {string}  [expires_at]
 * @property {number}  [usage_limit]
 * @property {string}  [terms]
 * @property {string}  [image_url]
 * @property {string}  status
 */

/**
 * @typedef {Object} VolunteerSession
 * @property {string}  id
 * @property {string}  user_id
 * @property {string}  opportunity_id
 * @property {string}  org_id
 * @property {string}  status         - 'checked_in' | 'confirmed' | 'cancelled'
 * @property {string}  [confirmed_at]
 * @property {number}  [hours]
 * @property {number}  [points_awarded]
 * @property {boolean} [flagged_for_review]
 */

// ── Client instance ───────────────────────────────────────────────────────────

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth State ────────────────────────────────────────────────────────────────

/** @type {AuthState} */
const authState = {
  session: null,
  user: null,
  loading: true,
};

/** @type {Array<function(string, import('@supabase/supabase-js').Session|null): void>} */
const authListeners = [];

/**
 * Register a callback to be notified on every auth state change.
 * @param {function(string, import('@supabase/supabase-js').Session|null): void} callback
 */
function onAuthStateChange(callback) {
  authListeners.push(callback);
}

/**
 * Propagate an auth state change to all registered listeners and update
 * the shared `authState` singleton.
 * @param {string}                                              event
 * @param {import('@supabase/supabase-js').Session | null}     session
 */
function notifyAuthListeners(event, session) {
  authState.session = session;
  authState.user = session?.user ?? null;
  authState.loading = false;
  authListeners.forEach(cb => cb(event, session));
}

// Subscribe to Supabase's internal auth events
supabaseClient.auth.onAuthStateChange((event, session) => {
  notifyAuthListeners(event, session);
});

// ── Auth helpers ──────────────────────────────────────────────────────────────

/**
 * Register a new user with email, password, and display name.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse['data']>}
 * @throws {Error} if Supabase returns an auth error
 */
async function signUp(email, password, name) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse['data']>}
 * @throws {Error}
 */
async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user and clear the session.
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current active session, if any.
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 * @throws {Error}
 */
async function getSession() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  return session;
}

// ── Data fetch helpers ────────────────────────────────────────────────────────

/**
 * Fetch upcoming volunteer opportunities (paginated, first 20).
 * Only returns today's or future opportunities ordered by date.
 * @returns {Promise<Opportunity[]>}
 * @throws {Error}
 */
async function fetchOpportunities() {
  const { data, error } = await supabaseClient
    .from('opportunities')
    .select('id, title, org_name, category, date, time_range, location, volunteers_filled, max_volunteers, points, description, hero_image_url, image_url, map_label')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .range(0, 19);
  if (error) throw error;
  return data || [];
}

/**
 * Fetch active deals for the rewards marketplace (paginated, first 20).
 * @returns {Promise<Deal[]>}
 * @throws {Error}
 */
async function fetchDeals() {
  const { data, error } = await supabaseClient
    .from('deals')
    .select('id, title, brand_name, category, points_cost, description, expires_at, usage_limit, terms, image_url, status')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(0, 19);
  if (error) throw error;
  return data || [];
}

/**
 * Fetch a volunteer's confirmed sessions (last 20), joined with opportunity title/category.
 * @param {string} userId - UUID of the authenticated volunteer.
 * @returns {Promise<VolunteerSession[]>}
 * @throws {Error}
 */
async function fetchUserSessions(userId) {
  const { data, error } = await supabaseClient
    .from('volunteer_sessions')
    .select('*, opportunities(title, category, icon, org_name)')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .order('confirmed_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

// ── Edge Function callers ─────────────────────────────────────────────────────

/**
 * Retrieve the current user's JWT access token, used to authenticate Edge
 * Function calls. Falls back to the anon key if no session is active.
 * @returns {Promise<string>}
 */
async function getAccessToken() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session?.access_token || SUPABASE_ANON_KEY;
}

/**
 * Call the `check-in` Edge Function to register a volunteer at an event.
 * Optionally includes a TAW-XXXX code for fraud checks at the server.
 *
 * @param {string}      userId        - The volunteer's user UUID.
 * @param {string}      opportunityId - The opportunity UUID.
 * @param {string}      orgId         - The hosting organisation UUID.
 * @param {string|null} [tawCode]     - Optional TAW-XXXX verification code.
 * @returns {Promise<{ success?: boolean; session_id?: string; error?: string }>}
 */
async function createCheckIn(userId, opportunityId, orgId, tawCode = null) {
  const token = await getAccessToken();
  const payload = { user_id: userId, opportunity_id: opportunityId, org_id: orgId };
  if (tawCode) payload.taw_code = tawCode;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// ── User preferences ──────────────────────────────────────────────────────────

/**
 * Persist a volunteer's interest category selection to Supabase.
 * Replaces any existing interest rows for the user in a single operation.
 *
 * @param {string[]} interests - Array of interest category names.
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function saveUserInterests(interests) {
  if (!authState.user) return;
  const userId = authState.user.id;

  // Delete existing interests for this user, then insert new ones
  await supabaseClient.from('user_interests').delete().eq('user_id', userId);

  if (interests.length > 0) {
    const rows = interests.map(name => ({ user_id: userId, interest_name: name }));
    const { error } = await supabaseClient.from('user_interests').insert(rows);
    if (error) throw error;
  }
}
