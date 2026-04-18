import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function GenderSelection() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      console.log('Updating profile for user:', session.user.id, 'to gender:', selected)
      const { error } = await supabase
        .from('profiles')
        .update({ gender: selected })
        .eq('id', session.user.id)
      
      if (error) {
        console.error('Failed to update gender:', error)
        alert('Failed to save gender: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      alert('No user session found')
      setSaving(false)
      return
    }
    setSaving(false)
    navigate('/onboarding/age')
  }

  const genders = [
    { id: 'male', label: t('gender_male'), icon: 'male' },
    { id: 'female', label: t('gender_female'), icon: 'female' },
    { id: 'other', label: t('gender_other'), icon: 'lock_person' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Header with Progress Steps */}
      <RevealLayout className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-primary rounded-full"></div>
          <div className="w-8 h-2 bg-muted rounded-full"></div>
          <div className="w-8 h-2 bg-muted rounded-full"></div>
        </div>
      </RevealLayout>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-3 mb-12">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('gender_title')}</h1>
          <p className="text-muted-foreground font-medium text-lg">
            {t('gender_subtitle')}
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-4">
          {genders.map((g, i) => (
            <RevealLayout key={g.id} delay={0.2 + (i * 0.1)}>
              <Card 
                className={cn(
                  "p-5 flex items-center gap-4 cursor-pointer border-2 transition-all duration-300",
                  selected === g.id 
                    ? "border-primary bg-primary/5 shadow-lift" 
                    : "border-transparent bg-card hover:border-border"
                )}
                onClick={() => setSelected(g.id)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  selected === g.id ? "bg-primary text-white" : "bg-muted text-foreground"
                )}>
                  <span className="material-icons-round text-2xl">{g.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{g.label}</h3>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  selected === g.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {selected === g.id && <span className="material-icons-round text-white text-[14px]">check</span>}
                </div>
              </Card>
            </RevealLayout>
          ))}
        </RevealLayout>

        <div className="flex-1"></div>

        {/* Footer */}
        <RevealLayout delay={0.5} className="pt-8">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selected || saving}
            onClick={handleContinue}
          >
            {saving ? t('saving') : t('continue')}
          </Button>
        </RevealLayout>
      </div>
    </div>
  )
}
