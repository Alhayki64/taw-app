import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '../components/RevealLayout'
import { Button } from '../components/ui/button'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../contexts/LanguageProvider'

export default function AgeSelection() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [dob, setDob] = useState('')
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase.from('profiles').update({ birthdate: dob }).eq('id', session.user.id)
    }
    setSaving(false)
    navigate('/onboarding/interests')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Header with Progress Steps */}
      <RevealLayout className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-primary rounded-full"></div>
          <div className="w-8 h-2 bg-primary rounded-full"></div>
          <div className="w-8 h-2 bg-muted rounded-full"></div>
        </div>
      </RevealLayout>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-3 mb-10">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('age_title')}</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {t('age_subtitle')}
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">Date of Birth</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">calendar_month</span>
              <input 
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </RevealLayout>

        <div className="flex-1"></div>

        {/* Footer */}
        <RevealLayout delay={0.6} className="pt-8">
          <Button
            className="w-full h-14 text-lg"
            disabled={!dob || saving}
            onClick={handleContinue}
          >
            {saving ? t('saving') : t('continue')}
          </Button>
        </RevealLayout>
      </div>
    </div>
  )
}
