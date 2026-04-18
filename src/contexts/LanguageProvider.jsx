import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../lib/translations'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthProvider'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { user } = useAuth()
  
  // Default to english, but check localStorage first
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en'
  })

  // Whenever language changes, update the <html> tag layout properties
  useEffect(() => {
    // Save locally
    localStorage.setItem('app_language', language)
    
    // Set direction for Tailwind / Browser
    const dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = language
    
    // Sync to backend if logged in
    if (user) {
      supabase.from('profiles').update({ language }).eq('id', user.id).then()
    }
  }, [language, user])

  // Optional: Pull preference from backend on initial load
  useEffect(() => {
    if (!user) return
    const fetchLang = async () => {
      const { data } = await supabase.from('profiles').select('language').eq('id', user.id).single()
      if (data?.language && data.language !== language) {
        setLanguage(data.language)
      }
    }
    fetchLang()
  }, [user])

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'))
  }

  // Translation helper function
  const t = (key, variables = {}) => {
    let text = translations[language]?.[key] || translations['en'][key] || key
    
    // Simple interpolation (e.g., {name})
    Object.keys(variables).forEach(varKey => {
      text = text.replace(`{${varKey}}`, variables[varKey])
    })
    
    return text
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
