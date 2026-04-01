# Taw Authentication & Data Persistence Roadmap (Supabase)

This roadmap outlines the strategy for integrating a modern, state-of-the-art authentication and backend data persistence layer into the Taw volunteerism application using **Supabase** (Managed PostgreSQL + Built-in Auth/RLS). 

---

## Phase 1: Architecture & Project Setup
Getting the Supabase engine running and connected to the Taw frontend.

- [ ] **Create Supabase Project**
  - Create a new project in the Supabase Dashboard.
  - Set up a robust, secure database password.
- [ ] **Configure Environment Variables**
  - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or equivalent for your framework) to the local `.env.local` file.
- [ ] **Install Supabase Client & Setup Connection**
  - Install the client: `npm install @supabase/supabase-js`.
  - Create a reusable `supabaseClient.js` helper utility.

---

## Phase 2: Database Schema & Row Level Security (RLS)
Designing the data layer and securing access policies so data is not publicly mutable.

- [ ] **Design Core Tables**
  - `profiles`: Extending the built-in Supabase `auth.users` for Taw (Points, Roles).
  - `interests`: Lookup table for volunteer categories.
  - `user_interests`: Junction table mapping volunteers to chosen interests.
  - `opportunities`: The volunteer tasks shown on the Home Feed.
  - `rewards`: Items available in the marketplace (Name, Cost, Image URL).
  - `transactions`: Ledger tracking points earned and spent on rewards.
- [ ] **Implement Row Level Security (RLS)**
  - Enable RLS on all tables.
  - `profiles`: Users can only `SELECT` and `UPDATE` their own profile (UUID match).
  - `opportunities`: Publicly readable (`SELECT`), but requires Admin privileges to `INSERT`/`UPDATE`.
  - `transactions`: Insertable via authenticated clients, but read-only for their own transactions.

---

## Phase 3: Core Authentication Flow (Supabase Auth)
Wiring up Supabase identity provider into Taw’s existing multi-step onboarding flow.

- [ ] **Configure Supabase Auth Providers**
  - Define whether to use simple Email/Password, Magic Links, or Social Providers (Google, Apple) in the Supabase Dashboard.
- [ ] **Initialize Global Auth Context**
  - Create a React Context (or equivalent) to track the Supabase `session` globally using `supabase.auth.onAuthStateChange`.
- [ ] **Implement Registration & Onboarding Sync**
  - Call `supabase.auth.signUp()` at the beginning of the onboarding flow.
  - When the final onboarding step completes, push the selected 'Interests' into the `user_interests` table using the new `user.id`.
- [ ] **Implement Login (Sign In)**
  - Call `supabase.auth.signInWithPassword()` or `signInWithOtp()`.

---

## Phase 4: Frontend Route Protection & State
Ensuring that unauthorized users are pushed to the login flow.

- [ ] **Implement Route Guards**
  - Wrap protected pages (Home Feed, Rewards, Profile) in an `<Authenticated>` guard that checks the Supabase session token.
- [ ] **Handle Loading States**
  - Build a skeleton screen/spinner while `supabase.auth.getSession()` resolves on app initialization.
- [ ] **Implement Logout (Sign Out)**
  - Add a completely functional logout using `supabase.auth.signOut()`.

---

## Phase 5: API & Feature Integration
Running SQL queries transparently through the Supabase client to hydrate the UI.

- [ ] **Integrate the Home Feed**
  - Fetch real `opportunities` via `supabase.from('opportunities').select('*')`.
  - Implement a real-time subscription via Supabase Realtime to push new opportunities instantly to connected users.
- [ ] **Integrate the Rewards Marketplace**
  - Fetch `rewards` data.
  - Deduct points: Use a Supabase **Postgres Function** (RPC) to atomically check the user's point balance and create a `transaction` in one secure step so they cannot overdraft.

---

## Phase 6: Advanced Features
Polishing the system for longevity.

- [ ] **Setup Storage Buckets**
  - Use Supabase Storage for user avatars and Reward images instead of hotlinking.
- [ ] **Role-Based Access Control (Admin UI)**
  - Implement an Admin flag in the `profiles` table to allow coordinators to add new rewards directly from the UI.
- [ ] **Database Triggers**
  - Auto-create a `profiles` row using Postgres Triggers whenever a new row is inserted into the `auth.users` system table.
