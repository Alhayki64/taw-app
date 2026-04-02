/* =============================================
   TAW (طوع) — SUPABASE CLIENT
   ============================================= */

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth State ──
const authState = {
  session: null,
  user: null,
  loading: true,
};

// ── Auth State Listeners ──
const authListeners = [];

function onAuthStateChange(callback) {
  authListeners.push(callback);
}

function notifyAuthListeners(event, session) {
  authState.session = session;
  authState.user = session?.user ?? null;
  authState.loading = false;
  authListeners.forEach(cb => cb(event, session));
}

// ── Initialize Auth Listener ──
supabaseClient.auth.onAuthStateChange((event, session) => {
  notifyAuthListeners(event, session);
});

// ── Auth Helper Functions ──

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

async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getSession() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  return session;
}

// ── Fetch Opportunities ──
async function fetchOpportunities() {
  const { data, error } = await supabaseClient
    .from('opportunities')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ── Fetch Deals ──
async function fetchDeals() {
  const { data, error } = await supabaseClient
    .from('deals')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Fetch user volunteer sessions (confirmed) ──
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

// ── Get current access token for edge function calls ──
async function getAccessToken() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session?.access_token || SUPABASE_ANON_KEY;
}

// ── Create a check-in session ──
async function createCheckIn(userId, opportunityId, orgId) {
  const token = await getAccessToken();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId, opportunity_id: opportunityId, org_id: orgId })
  });
  return res.json();
}

// ── Save User Interests to Supabase ──
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
