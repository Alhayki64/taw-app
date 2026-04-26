import { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageTransition } from './components/RevealLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Layouts
import MainLayout from '@/components/layout/MainLayout'

// Lazy loaded screens
const WalkthroughScreen = lazy(() => import('./pages/WalkthroughScreen'))
const SignUpScreen = lazy(() => import('./pages/SignUpScreen'))
const SignInScreen = lazy(() => import('./pages/auth/SignInScreen'))
const ForgotPasswordScreen = lazy(() => import('./pages/auth/ForgotPasswordScreen'))
const ResetPasswordScreen = lazy(() => import('./pages/auth/ResetPasswordScreen'))

// Onboarding
const GenderSelection = lazy(() => import('./pages/GenderSelection'))
const AgeSelection = lazy(() => import('./pages/AgeSelection'))
const InterestsSelection = lazy(() => import('./pages/onboarding/InterestsSelection'))
const NotificationPermission = lazy(() => import('./pages/onboarding/NotificationPermission'))

// Main App Screens
const HomeScreen = lazy(() => import('./pages/main/HomeScreen'))
const MarketplaceScreen = lazy(() => import('./pages/main/MarketplaceScreen'))
const ProfileScreen = lazy(() => import('./pages/main/ProfileScreen'))

// Deep Detailing Flows
const EventDetailsScreen = lazy(() => import('./pages/events/EventDetailsScreen'))
const CheckInSuccessScreen = lazy(() => import('./pages/events/CheckInSuccessScreen'))
const RewardRedemptionFlow = lazy(() => import('./pages/rewards/RewardRedemptionFlow'))

// Profile Sub-screens
const EditProfile = lazy(() => import('./pages/profile/EditProfile'))
const ImpactHistory = lazy(() => import('./pages/profile/ImpactHistory'))

// Optional: A beautiful loading spinner for lazy loaded routes
const SuspenseFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <span className="material-icons-round text-primary text-4xl animate-spin">sync</span>
  </div>
)

export default function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const appContent = (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
              {/* Public / Auth */}
              <Route path="/" element={<PageTransition keyName="walkthrough"><WalkthroughScreen /></PageTransition>} />
              <Route path="/signup" element={<PageTransition keyName="signup"><SignUpScreen /></PageTransition>} />
              <Route path="/signin" element={<PageTransition keyName="signin"><SignInScreen /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition keyName="forgotpw"><ForgotPasswordScreen /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition keyName="resetpw"><ResetPasswordScreen /></PageTransition>} />
              
              {/* Onboarding Flow */}
              <Route path="/onboarding/gender" element={<PageTransition keyName="gender"><GenderSelection /></PageTransition>} />
              <Route path="/onboarding/age" element={<PageTransition keyName="age"><AgeSelection /></PageTransition>} />
              <Route path="/onboarding/interests" element={<PageTransition keyName="inter"><InterestsSelection /></PageTransition>} />
              <Route path="/onboarding/notifications" element={<PageTransition keyName="notif"><NotificationPermission /></PageTransition>} />

              {/* Main App (Public / Shell) */}
              <Route element={<MainLayout />}>
                <Route path="/home" element={<PageTransition keyName="home"><HomeScreen /></PageTransition>} />
                <Route path="/rewards" element={<PageTransition keyName="rewards"><MarketplaceScreen /></PageTransition>} />
                <Route path="/profile" element={<PageTransition keyName="profile"><ProfileScreen /></PageTransition>} />
              </Route>

              {/* Deep Details (Fullscreen, No Bottom Nav) */}
              <Route path="/event/:id" element={<PageTransition keyName="edetail"><EventDetailsScreen /></PageTransition>} />
              <Route path="/checkin-success" element={<ProtectedRoute><PageTransition keyName="success"><CheckInSuccessScreen /></PageTransition></ProtectedRoute>} />
              <Route path="/rewards/:id" element={<ProtectedRoute><PageTransition keyName="rdetail"><RewardRedemptionFlow /></PageTransition></ProtectedRoute>} />

              {/* Profile Sub-screens */}
              <Route path="/profile/edit" element={<ProtectedRoute><PageTransition keyName="editprofile"><EditProfile /></PageTransition></ProtectedRoute>} />
              <Route path="/profile/history" element={<ProtectedRoute><PageTransition keyName="history"><ImpactHistory /></PageTransition></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
  )

  if (!isDesktop) {
    return appContent
  }

  return (
    <div className="min-h-screen bg-[#2D5A3D] flex items-center justify-center p-8 gap-16 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Side: Branding */}
      <div className="hidden md:flex flex-col flex-1 max-w-lg text-[#F5F2EC] z-10">
        <div className="mb-8 flex items-center gap-4">
          <img src="/taw-logo.png" alt="Tawwa Logo" className="w-16 h-16 object-contain drop-shadow-md" />
          <h1 className="text-5xl font-bold tracking-tight">Tawwa</h1>
        </div>
        
        <div className="mb-6">
          <h2 
            className="text-6xl font-black mb-3 text-[#D4AF37] drop-shadow-md" 
            dir="rtl" 
            style={{ fontFamily: 'Tajawal, "Noto Kufi Arabic", sans-serif' }}
          >
            لوطني أعطي
          </h2>
          <p className="text-3xl font-semibold opacity-95 tracking-wide">
            Volunteer. Earn. Give Back.
          </p>
        </div>
        
        <p className="text-xl opacity-90 leading-relaxed font-light">
          Tawwa connects volunteers with opportunities across Bahrain. Earn points, unlock rewards, and make an impact in your community.
        </p>
      </div>

      {/* Right Side: Device Mockup */}
      <div className="w-[390px] h-[844px] max-h-[90vh] bg-background rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[8px] border-black overflow-hidden relative z-10 flex flex-col shrink-0">
        {appContent}
      </div>
    </div>
  )
}
