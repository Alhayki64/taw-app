import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageTransition } from './components/RevealLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Layouts
import MainLayout from '@/components/layout/MainLayout'

// Lazy loaded screens
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'))
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
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
              {/* Public / Auth */}
              <Route path="/" element={<PageTransition keyName="welcome"><WelcomeScreen /></PageTransition>} />
              <Route path="/signup" element={<PageTransition keyName="signup"><SignUpScreen /></PageTransition>} />
              <Route path="/signin" element={<PageTransition keyName="signin"><SignInScreen /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition keyName="forgotpw"><ForgotPasswordScreen /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition keyName="resetpw"><ResetPasswordScreen /></PageTransition>} />
              
              {/* Onboarding Flow */}
              <Route path="/onboarding/gender" element={<PageTransition keyName="gender"><GenderSelection /></PageTransition>} />
              <Route path="/onboarding/age" element={<PageTransition keyName="age"><AgeSelection /></PageTransition>} />
              <Route path="/onboarding/interests" element={<PageTransition keyName="inter"><InterestsSelection /></PageTransition>} />
              <Route path="/onboarding/notifications" element={<PageTransition keyName="notif"><NotificationPermission /></PageTransition>} />

              {/* Main App (Protected / Shell) */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/home" element={<PageTransition keyName="home"><HomeScreen /></PageTransition>} />
                <Route path="/rewards" element={<PageTransition keyName="rewards"><MarketplaceScreen /></PageTransition>} />
                <Route path="/profile" element={<PageTransition keyName="profile"><ProfileScreen /></PageTransition>} />
              </Route>

              {/* Deep Details (Fullscreen, No Bottom Nav) */}
              <Route path="/event/:id" element={<ProtectedRoute><PageTransition keyName="edetail"><EventDetailsScreen /></PageTransition></ProtectedRoute>} />
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
}
