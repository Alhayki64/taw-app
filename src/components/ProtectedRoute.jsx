import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthProvider'
import { supabase } from '@/lib/supabaseClient'

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Rules:
 *  1. No session → redirect to /  (Welcome)
 *  2. Session + onboarding incomplete (gender is null) → redirect to /onboarding/gender
 *  3. Session + onboarding complete → render children
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [onboardingDone, setOnboardingDone] = useState(null) // null = checking

  useEffect(() => {
    if (!user) return
    checkOnboarding(user.id)
  }, [user])

  const checkOnboarding = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('gender')
      .eq('id', userId)
      .single()
    // If gender is set, onboarding was completed
    setOnboardingDone(!!data?.gender)
  }

  // Still resolving auth session — render nothing (AuthProvider already blocks)
  if (loading) return null

  // Not logged in → send to Welcome
  if (!user) return <Navigate to="/" replace state={{ from: location }} />

  // Logged in but still checking onboarding status
  if (onboardingDone === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-icons-round text-primary text-4xl animate-spin">sync</span>
      </div>
    )
  }

  // Onboarding incomplete → send to first onboarding step
  if (!onboardingDone) {
    return <Navigate to="/onboarding/gender" replace />
  }

  // All good — render the protected page
  return children
}
