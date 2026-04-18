import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/contexts/ToastProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { z } from 'zod'

const makeResetSchema = (t) =>
  z
    .object({
      password: z.string().min(8, t('password_too_short')),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
      message: t('passwords_no_match'),
      path: ['confirm'],
    })

export default function ResetPasswordScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const resetSchema = makeResetSchema(t)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleReset = async () => {
    setErrors({})
    const result = resetSchema.safeParse({ password, confirm })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t('password_updated'))
      navigate('/signin')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      <RevealLayout className="flex items-center mb-10">
        <button
          onClick={() => navigate('/signin')}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary" aria-hidden="true">arrow_back</span>
        </button>
      </RevealLayout>

      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-3 mb-10">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('set_new_password')}</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {t('set_new_password_desc')}
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('new_password')}</label>
            <div className={`flex items-center h-14 bg-card rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.password ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3" aria-hidden="true">lock</span>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('at_least_8_chars')}
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium px-1">{errors.password[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('confirm_password')}</label>
            <div className={`flex items-center h-14 bg-card rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.confirm ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3" aria-hidden="true">lock_reset</span>
              <input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={t('repeat_password')}
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.confirm && <p className="text-xs text-destructive font-medium px-1">{errors.confirm[0]}</p>}
          </div>
        </RevealLayout>

        <div className="flex-1" />

        <RevealLayout delay={0.3} className="pt-8">
          <Button
            className="w-full h-14 text-lg"
            onClick={handleReset}
            disabled={!password || !confirm || loading}
          >
            {loading ? t('updating') : t('update_password')}
          </Button>
        </RevealLayout>
      </div>
    </div>
  )
}
