# Taw Authentication & Data Persistence Roadmap

This roadmap outlines the strategy for integrating a modern, state-of-the-art authentication and backend data persistence layer into the Taw volunteerism application. This plan incorporates 2026 best practices, including passwordless authentication, passkeys (WebAuthn/FIDO2), and scalable NoSQL/Relational data mapping.

---

## Phase 1: Architecture Selection & Project Setup
The first step is formally choosing the backend stack and scaffolding the environment.

- [ ] **Select Backend Stack**
  - *Option A (All-in-One)*: **Supabase** (Managed Postgres + Built-in Auth/RLS). Ideal for relational data like rewards and users.
  - *Option B (Best-in-Class Split)*: **Clerk** (Top-tier Next.js/React Auth DX) + **Convex / Vercel Postgres**.
  - *Option C (Mobile-First)*: **Firebase** (Firestore + Auth). Excellent for real-time document syncing.
- [ ] **Environment Setup**
  - Create the backend project (e.g., Supabase organization and database).
  - Provision Dev, Staging, and Production environments.
  - Add API keys to local `.env.local` files.
- [ ] **Install Dependencies**
  - Add SDKs to the Taw frontend (`@supabase/supabase-js`, `@clerk/clerk-react`, etc.).

---

## Phase 2: Database Schema & Security Modeling
Designing the data layer to support Taw's multi-step onboarding, Home Feed, and Rewards Marketplace.

- [ ] **Design Core Tables/Collections**
  - `users`: Extending base auth data (Points, Preferences, Roles).
  - `interests`: Lookup table for volunteer categories.
  - `user_interests`: Junction table mapping volunteers to their chosen interests during onboarding.
  - `opportunities`: The volunteer tasks shown on the Home Feed.
  - `rewards`: Items available in the marketplace (Name, Cost, Image URL).
  - `transactions`: Ledger tracking points earned for volunteering and spent on rewards.
- [ ] **Implement Security Rules (Crucial)**
  - If using Supabase: Define **Row Level Security (RLS)** policies.
    - Example: `Users can only SELECT and UPDATE their own row in the users table.`
    - Example: `Home feed opportunities are public to SELECT, but only admins can INSERT.`

---

## Phase 3: Core Authentication Flow (Onboarding)
Wiring up the identity provider into Taw’s existing multi-step onboarding flow.

- [ ] **Initialize Global Auth Context**
  - Create a React Context or global store (Zustand/Redux) to track `currentUser` and `sessionToken` globally.
- [ ] **Implement Registration (Sign Up)**
  - Integrate user creation at the beginning of the onboarding flow.
  - *Modern UX*: Implement Magic Links or OTP to avoid complex password creation.
- [ ] **Implement Login (Sign In)**
  - Build a clean login screen.
  - *Modern UX*: Implement Passkey (FIDO2) support for seamless biometric login.
- [ ] **Sync Onboarding Data**
  - Ensure the "Interest Selection" and "Notification Options" screens push data correctly to the database under the newly authenticated user's ID.

---

## Phase 4: Frontend Route Protection & State
Ensuring that unauthorized users cannot organically navigate or bypass the login screens.

- [ ] **Implement Route Guards**
  - Wrap protected pages (Home Feed, Rewards, Profile) in an `<Authenticated>` guard.
  - Unauthenticated users attempting to access these routes should be redirected back to the Onboarding/Login sequence.
- [ ] **Handle Loading States**
  - Build a skeleton screen or spinner that displays while the app is validating the user's session token on initialization.
- [ ] **Implement Logout (Sign Out)**
  - Add a logout button to the Profile or Settings menu.
  - Clear the local session cache and redirect securely.

---

## Phase 5: API & Feature Integration
Connecting the UI components to live data instead of hardcoded mock data.

- [ ] **Integrate the Home Feed**
  - Fetch `opportunities` from the database.
  - Filter opportunities based on the user's selected interests.
- [ ] **Integrate the Rewards Marketplace**
  - Fetch `rewards` pricing from the database.
  - Implement a point check: Ensure `currentUser.points >= reward.cost` before allowing redemption.
- [ ] **Develop Cloud Functions / Edge Functions**
  - Create secure backend logic for sensitive operations (e.g., deducting points and securely logging a transaction off the client to prevent score manipulation).

---

## Phase 6: Advanced Features (Optional/Future)
Polishing the authentication system for long-term scalability.

- [ ] **Social Logins (SSO)**
  - Enable "Sign in with Google" or "Sign in with Apple" for lower friction.
- [ ] **Role-Based Access Control (RBAC)**
  - Implement an "Admin" role for coordinators manually adding new opportunities or rewards.
  - Create a segmented Admin Dashboard.
- [ ] **Session Management & Revocation**
  - Allow users to view active sessions across devices and log them out remotely.
