import React, { createContext, useContext, useState, useEffect } from 'react'

const I18nContext = createContext()

const TRANSLATIONS = {
  en: { greeting: 'Hello, Ali!', urgentNeeds: 'Urgent Needs', homeSubtitle: 'Ready to make an impact today?' },
  ar: { greeting: 'مرحباً، علي!', urgentNeeds: 'احتياجات عاجلة', homeSubtitle: 'هل أنت مستعد لإحداث تأثير اليوم؟' }
}

export const useI18n = () => useContext(I18nContext)

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // Set HTML dir attribute for native RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => TRANSLATIONS[lang][key] || key

  const toggleLang = () => setLang(l => (l === 'en' ? 'ar' : 'en'))

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}
