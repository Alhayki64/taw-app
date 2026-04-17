/* =============================================
   TAW — INIT: SCHEMAS, ESCAPE KEY, BOOTSTRAP
   ============================================= */

// ── Zod Validation Schemas ──
const authSchema = window.Zod ? window.Zod.z.object({
  email: window.Zod.z.string().email("Invalid email address"),
  password: window.Zod.z.string().min(6, "Password must be at least 6 characters"),
  name: window.Zod.z.string().optional()
}) : null;

const profileSchema = window.Zod ? window.Zod.z.object({
  name: window.Zod.z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: window.Zod.z.string().max(20, "Phone is too long").optional().or(window.Zod.z.literal('')),
  bio: window.Zod.z.string().max(300, "Bio is too long").optional().or(window.Zod.z.literal(''))
}) : null;

const tawCodeSchema = window.Zod ? window.Zod.z.string().regex(/^TAW-\d{4}$/, "Invalid TAW-XXXX code") : null;

// ── Global Escape Key Handler ──
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const appModal = document.getElementById('modal-confirm-application');
  const redeemModal = document.getElementById('modal-confirm-redemption');
  if (appModal && appModal.style.display !== 'none') {
    hideConfirmApplication(null);
  } else if (redeemModal && redeemModal.style.display !== 'none') {
    hideConfirmRedemption(null);
  }
});

// ── Initialize ──
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof onAuthStateChange === 'function') {
    onAuthStateChange((event, session) => {
      if (session && session.user) {
        updateUserDisplay();
      }
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        navigateTo('auth');
      }
    });
  }

  if (localStorage.getItem('taw-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcons(true);
  }

  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) bottomNav.classList.add('hidden');

  try {
    const session = await getSession();
    if (session) {
      authState.session = session;
      authState.user = session.user;
      authState.loading = false;
      updateUserDisplay();
      const landingPage = document.getElementById('page-landing');
      if (landingPage) landingPage.classList.remove('active');
      navigateTo('home');
      return;
    }
  } catch (e) {
    // Supabase not configured yet — fall through to landing
  }

  authState.loading = false;
  updateUserDisplay();
  const landingPage = document.getElementById('page-landing');
  if (landingPage) landingPage.classList.add('active');
});
