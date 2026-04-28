import { createContext, useContext, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'

const DemoContext = createContext({ isDemoMode: false, signInAsDemo: () => {} })

export function DemoProvider({ children }) {
  const isDemoMode = useMemo(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('demo') === 'true'
    if (fromUrl) sessionStorage.setItem('tawwa_demo', '1')
    return fromUrl || sessionStorage.getItem('tawwa_demo') === '1'
  }, [])

  const signInAsDemo = async () => {
    // Try sign in first (account already exists)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@tawwa.app',
      password: 'Demo1234!',
    })
    if (!error) return { data, error: null }

    // First time: create the account via proper GoTrue signup.
    // The handle_new_user trigger auto-seeds profile + sessions.
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'demo@tawwa.app',
        password: 'Demo1234!',
        options: { data: { display_name: 'Ahmed Al-Hashimi' } },
      })
      if (signUpError) return { data: null, error: signUpError }

      // If email confirmation is disabled, sign in immediately
      const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
        email: 'demo@tawwa.app',
        password: 'Demo1234!',
      })
      if (!error2) return { data: data2, error: null }

      // Email confirmation required — tell the user
      return {
        data: null,
        error: { message: 'demo_email_error', isKey: true },
      }
    }

    return { data: null, error }
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, signInAsDemo }}>
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => useContext(DemoContext)
