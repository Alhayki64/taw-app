# Taw Authentication & Data Persistence Roadmap (Supabase MVP)

This roadmap outlines the strategy for integrating authentication and backend data persistence into the Taw volunteerism app using **Supabase** (Managed PostgreSQL + Built-in Auth/RLS).

> **Note:** Taw is a vanilla JS app with no build step. All integration uses CDN imports and global scripts.

---

## Phase 1: Project Setup & Supabase Connection

- [ ] **Create Supabase Project**
  - Create a new project in the Supabase Dashboard.
  - Set a secure database password.
- [x] **Add Supabase CDN Script** — `index.html`
  - Added before `app.js`:
    ```html
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    ```
- [x] **Create `config.js` for Keys** — `config.js`, `.gitignore`
  - Created git-ignored `config.js` with placeholder `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- [x] **Create `supabaseClient.js` Helper** — `supabaseClient.js`
  - Initializes client, auth state tracking (`authState`), `onAuthStateChange` listener, and helper functions (`signUp`, `signIn`, `signOut`, `getSession`, `saveUserInterests`).

---

## Phase 2: Database Schema & Row Level Security (RLS)

- [x] **Design Core Tables** — `docs/supabase-schema.sql`
  - `profiles`: Extends `auth.users` (display name, points, avatar URL).
  - `interests`: Lookup table for volunteer categories (seeded with 9 categories).
  - `user_interests`: Junction table mapping users to chosen interests.
  - `opportunities`: Volunteer tasks shown on the Home Feed.
  - `opportunity_signups`: Tracks which users signed up / checked in to which opportunities.
  - `rewards`: Items in the marketplace (name, cost, image URL).
  - `point_ledger`: Tracks points earned and spent.
- [x] **Create DB Trigger for Profile Auto-Creation** — `docs/supabase-schema.sql`
  - `handle_new_user()` trigger auto-creates a `profiles` row on `auth.users` insert.
- [x] **Implement Row Level Security (RLS)** — `docs/supabase-schema.sql`
  - All tables have RLS enabled with appropriate policies.
- [x] **Reward Redemption RPC** — `docs/supabase-schema.sql`
  - `redeem_reward()` function atomically checks balance and deducts points.
- [ ] **Run Schema in Supabase SQL Editor**
  - Copy `docs/supabase-schema.sql` into Supabase Dashboard → SQL Editor → Run.

---

## Phase 3: Authentication Flow

- [ ] **Configure Auth Provider**
  - Enable Email/Password in Supabase Dashboard.
  - Disable email confirmation for dev/MVP (Dashboard > Auth > Settings).
- [x] **Build `page-auth` Login/Signup UI** — `index.html`
  - Added `<section id="page-auth">` with email/password form, sign-up/sign-in toggle, error display, and loading spinner.
  - Updated landing page "Sign In" button to `navigateTo('auth')`.
- [x] **Wire Up Auth Calls** — `app.js`
  - `handleAuthSubmit()`: Sign up → onboarding flow; Sign in → home.
  - `toggleAuthMode()`: Toggles between Sign In / Sign Up modes.
- [x] **Track Auth State Globally** — `supabaseClient.js`, `app.js`
  - `authState` object synced via `supabase.auth.onAuthStateChange()`.
- [x] **Implement Logout** — `index.html`, `app.js`
  - Sign Out button added to profile page settings.
  - `handleSignOut()` calls `supabase.auth.signOut()` and returns to landing.

---

## Phase 4: Route Protection

- [x] **Guard Protected Routes** — `app.js`
  - `protectedPages` set defines guarded pages.
  - `navigateTo()` checks `authState.session` and redirects to `page-auth` if unauthenticated.
- [x] **Session Restore on Load** — `app.js`
  - `DOMContentLoaded` calls `getSession()` before rendering. If session exists, skips landing and navigates to home.

---

## Phase 5: Live Data Integration

- [ ] **Home Feed**
  - Fetch opportunities via `supabase.from('opportunities').select('*')`.
  - Filter by user's interests from `user_interests` where practical.
- [ ] **Rewards Marketplace**
  - Fetch `rewards` data from Supabase.
  - Reward redemption: call `supabase.rpc('redeem_reward', { reward_id })`.
- [ ] **Check-In Flow**
  - On QR check-in, insert a row into `opportunity_signups` to record attendance.

---

## Phase 6: Post-MVP Stretch Goals

- [ ] **Realtime subscriptions** for the Home Feed (push new opportunities to connected users).
- [ ] **Supabase Storage** for user avatars and reward images.
- [ ] **Admin role flag** in `profiles` to allow coordinators to manage opportunities/rewards from the UI.
- [ ] **Volunteer hours tracking** table and profile stats wiring.
- [ ] **Social auth providers** (Google, Apple).
