/* =============================================
   TAW — AUTH PAGE LOGIC
   ============================================= */

// ── Auth Prompt (for guests attempting protected actions) ──
function showAuthPrompt(actionLabel) {
  const label = document.getElementById('auth-prompt-label');
  if (label) {
    const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
    label.textContent = isAr ? 'سجّل دخولك للمتابعة' : 'Sign in to continue';
  }
  const modal = document.getElementById('modal-auth-prompt');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  trapFocus(modal);
}

function hideAuthPrompt() {
  const modal = document.getElementById('modal-auth-prompt');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
  releaseFocus();
}

// ── Auth Mode ──
let authMode = 'signin'; // 'signin' or 'signup'

const authText = {
  en: {
    signInTitle: 'Welcome Back',
    signUpTitle: 'Create Account',
    signInSubtitle: 'Sign in to continue your volunteer journey.',
    signUpSubtitle: 'Sign up to start your volunteer journey.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    hasAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    nameLabel: 'Full Name',
    namePlaceholder: 'Your Name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Your password',
  },
  ar: {
    signInTitle: 'أهلاً بعودتك',
    signUpTitle: 'إنشاء حساب',
    signInSubtitle: 'سجّل دخولك لمتابعة رحلتك التطوعية.',
    signUpSubtitle: 'أنشئ حساباً لتبدأ رحلتك التطوعية.',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    hasAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'اسمك',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'كلمة المرور',
  }
};

function setAuthMode(mode) {
  authMode = mode;
  const isSignUp = mode === 'signup';
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  const t = authText[lang] || authText.en;

  document.getElementById('auth-title').textContent = isSignUp ? t.signUpTitle : t.signInTitle;
  document.getElementById('auth-subtitle').textContent = isSignUp ? t.signUpSubtitle : t.signInSubtitle;
  document.getElementById('auth-submit-text').textContent = isSignUp ? t.signUp : t.signIn;
  document.getElementById('auth-toggle-text').textContent = isSignUp ? t.hasAccount : t.noAccount;
  document.getElementById('auth-toggle-btn').textContent = isSignUp ? t.signIn : t.signUp;

  const nameLabel = document.querySelector('label[for="auth-name"]');
  const emailLabel = document.querySelector('label[for="auth-email"]');
  const passLabel = document.querySelector('label[for="auth-password"]');
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  if (nameLabel) nameLabel.textContent = t.nameLabel;
  if (emailLabel) emailLabel.textContent = t.emailLabel;
  if (passLabel) passLabel.textContent = t.passwordLabel;
  if (nameInput) nameInput.placeholder = t.namePlaceholder;
  if (emailInput) emailInput.placeholder = t.emailPlaceholder;
  if (passInput) passInput.placeholder = t.passwordPlaceholder;

  const nameContainer = document.getElementById('auth-name-container');
  if (nameContainer && nameInput) {
    nameContainer.style.display = isSignUp ? 'block' : 'none';
    nameInput.required = isSignUp;
  }

  document.getElementById('auth-error').style.display = 'none';

  const progressBar = document.getElementById('onboarding-progress-auth');
  if (progressBar) progressBar.style.display = isSignUp ? 'flex' : 'none';
}

function toggleAuthMode() {
  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
}

window.goToSignUp = function() {
  navigateTo('auth');
  setAuthMode('signup');
};

// ── Real-time Form Validation ──
;(function initFormValidation() {
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const emailWrap = document.getElementById('email-input-wrap');
  const passWrap = document.getElementById('password-input-wrap');
  const emailError = document.getElementById('email-error');
  const passError = document.getElementById('password-error');
  const strengthEl = document.getElementById('password-strength');
  if (!emailInput || !passInput) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailTimer = null;

  emailInput.addEventListener('input', () => {
    clearTimeout(emailTimer);
    emailTimer = setTimeout(() => {
      const val = emailInput.value.trim();
      if (!val) {
        emailWrap.classList.remove('invalid', 'valid');
        emailError.textContent = '';
      } else if (!emailRegex.test(val)) {
        emailWrap.classList.add('invalid');
        emailWrap.classList.remove('valid');
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        emailError.textContent = isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
      } else {
        emailWrap.classList.add('valid');
        emailWrap.classList.remove('invalid');
        emailError.textContent = '';
      }
    }, 300);
  });

  passInput.addEventListener('input', () => {
    const val = passInput.value;
    if (authMode === 'signup' && strengthEl) strengthEl.style.display = val ? 'flex' : 'none';

    if (!val) {
      passWrap.classList.remove('invalid', 'valid');
      passError.textContent = '';
      return;
    }
    if (val.length < 6) {
      passWrap.classList.add('invalid');
      passWrap.classList.remove('valid');
      const isArPass = typeof currentLang !== 'undefined' && currentLang === 'ar';
      passError.textContent = isArPass ? 'يجب أن تكون كلمة المرور ٦ أحرف على الأقل' : 'Password must be at least 6 characters';
    } else {
      passWrap.classList.add('valid');
      passWrap.classList.remove('invalid');
      passError.textContent = '';
    }

    if (strengthEl) {
      const bars = strengthEl.querySelectorAll('.strength-bar');
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;

      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < score) {
          bar.classList.add(score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong');
        }
      });
    }
  });

  const origSetAuthMode = setAuthMode;
  setAuthMode = function(mode) {
    origSetAuthMode(mode);
    emailWrap.classList.remove('invalid', 'valid');
    passWrap.classList.remove('invalid', 'valid');
    emailError.textContent = '';
    passError.textContent = '';
    if (strengthEl) strengthEl.style.display = 'none';
  };
})();

async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const nameInput = document.getElementById('auth-name');
  const name = nameInput ? nameInput.value.trim() : '';
  const submitBtn = document.getElementById('auth-submit-btn');
  const spinner = document.getElementById('auth-spinner');
  const submitText = document.getElementById('auth-submit-text');
  const errorEl = document.getElementById('auth-error');
  const errorText = document.getElementById('auth-error-text');

  submitBtn.disabled = true;
  spinner.style.display = 'inline-flex';
  submitText.style.opacity = '0.5';
  errorEl.style.display = 'none';

  try {
    if (authSchema) {
      const parsed = authSchema.safeParse({ email, password, name: authMode === 'signup' ? name : undefined });
      if (!parsed.success) throw new Error(parsed.error.errors[0].message);
    }

    if (authMode === 'signup') {
      if (authSchema && name.trim().length < 2) throw new Error("Name must be at least 2 characters");
      await signUp(email, password, name);
      navigateTo('interests');
    } else {
      await signIn(email, password);
      navigateTo('home');
    }
    document.getElementById('auth-form').reset();
  } catch (err) {
    errorText.textContent = err.message || 'Authentication failed. Please try again.';
    errorEl.style.display = 'flex';
  } finally {
    submitBtn.disabled = false;
    spinner.style.display = 'none';
    submitText.style.opacity = '1';
  }
}

async function handleSignOut() {
  try {
    await signOut();
  } catch (e) {
    // Ignore sign-out errors
  }
  authState.session = null;
  authState.user = null;
  navigateTo('landing');
  pageHistory = ['landing'];
}
