import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function NotificationPermission() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const saveAndNavigate = async (granted) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ notifications_enabled: granted })
        .eq('id', session.user.id)
    }
    navigate('/home', { replace: true })
  }

  const handleEnable = async () => {
    setLoading(true)
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      await saveAndNavigate(result === 'granted')
    } else {
      await saveAndNavigate(false)
    }
    setLoading(false)
  }

  const handleSkip = () => saveAndNavigate(false)

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 pt-12 pb-8 relative overflow-hidden">
      {/* Background Graphic Decoration */}
      <div className="absolute -top-32 -end-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -start-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
        
        <RevealLayout delay={0.1} className="relative mb-10 w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-lift relative z-10">
            <span className="material-icons-round text-5xl">notifications_active</span>
          </div>
          {/* Floating badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -top-2 -end-2 bg-card text-foreground shadow-sm px-2 py-1 flex items-center gap-1 rounded-full text-xs font-bold border border-border"
          >
            <span className="material-icons-round text-[12px] text-green-500">stars</span> +50
          </motion.div>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-4 max-w-sm mb-12">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{t('notif_title')}</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {t('notif_subtitle')}
          </p>
        </RevealLayout>

      </div>

      {/* Footer Actions */}
      <RevealLayout delay={0.4} className="space-y-4 z-10">
        <Button
          className="w-full h-14 text-lg shadow-lift"
          onClick={handleEnable}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="material-icons-round animate-spin text-sm">sync</span> {t('saving')}
            </span>
          ) : (
            t('notif_enable')
          )}
        </Button>
        <button
          className="w-full h-14 text-lg font-bold text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleSkip}
          disabled={loading}
        >
          {t('notif_maybe_later')}
        </button>
      </RevealLayout>
    </div>
  )
}
