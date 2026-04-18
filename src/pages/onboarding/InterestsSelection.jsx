import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function InterestsSelection() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user && selected.length > 0) {
      // Find the profile id (same as auth user id)
      const userId = session.user.id
      // Delete old interests and insert new ones
      await supabase.from('user_interests').delete().eq('user_id', userId)
      const rows = selected.map(id => ({ user_id: userId, interest_name: id }))
      await supabase.from('user_interests').insert(rows)
    }
    setSaving(false)
    navigate('/onboarding/notifications')
  }

  const interests = [
    { id: 'env', label: 'Environment', icon: 'park' },
    { id: 'health', label: 'Health', icon: 'favorite' },
    { id: 'youth', label: 'Youth & Ed', icon: 'school' },
    { id: 'animals', label: 'Animals', icon: 'pets' },
    { id: 'elderly', label: 'Elderly', icon: 'elderly' },
    { id: 'arts', label: 'Arts', icon: 'palette' },
  ]

  const toggleInterest = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Header */}
      <RevealLayout className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
        <button 
          onClick={() => navigate('/onboarding/notifications')}
          className="text-sm font-bold text-primary uppercase tracking-wider px-2"
        >
          Skip
        </button>
      </RevealLayout>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-3 mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('interests_title')}</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {t('interests_subtitle')}
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2}>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, i) => {
              const isSelected = selected.includes(interest.id)
              return (
                <motion.button
                  key={interest.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 w-[calc(50%-6px)] h-32 shadow-soft",
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary shadow-lift" 
                      : "border-transparent bg-card text-foreground hover:border-border"
                  )}
                >
                  <span className={cn(
                    "material-icons-round text-4xl mb-2 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground/50"
                  )}>
                    {interest.icon}
                  </span>
                  <span className="font-bold text-sm">{interest.label}</span>
                  {/* Subtle check indicator */}
                  {isSelected && (
                    <motion.div 
                      layoutId={`check-${interest.id}`}
                      className="absolute top-2 end-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="material-icons-round text-white text-[12px]">check</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </RevealLayout>

        <div className="flex-1"></div>

        {/* Footer */}
        <RevealLayout delay={0.6} className="pt-8">
          <Button
            className="w-full h-14 text-lg"
            disabled={selected.length === 0 || saving}
            onClick={handleContinue}
          >
            {saving ? t('saving') : t('continue')}
          </Button>
        </RevealLayout>
      </div>
    </div>
  )
}
