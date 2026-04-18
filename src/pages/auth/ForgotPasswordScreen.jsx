import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/contexts/ToastProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { forgotPasswordSchema } from '@/lib/schemas'

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSend = async () => {
    setErrors({})
    const result = forgotPasswordSchema.safeParse({ email })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      <RevealLayout className="flex items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary" aria-hidden="true">arrow_back</span>
        </button>
      </RevealLayout>

      <div className="flex-1 flex flex-col">
        {sent ? (
          <RevealLayout className="flex flex-col items-center text-center pt-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-icons-round text-primary text-4xl">mark_email_read</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-3">{t('check_your_email')}</h1>
            <p className="text-muted-foreground font-medium leading-relaxed mb-8">
              {t('reset_link_sent')} <span className="font-bold text-foreground">{email}</span>
            </p>
            <Button className="w-full h-14 text-lg" onClick={() => navigate('/signin')}>
              {t('back_to_sign_in')}
            </Button>
          </RevealLayout>
        ) : (
          <>
            <RevealLayout delay={0.1} className="space-y-3 mb-10">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('forgot_password')}</h1>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                {t('forgot_password_desc')}
              </p>
            </RevealLayout>

            <RevealLayout delay={0.2} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('email')}</label>
                <div className={`flex items-center h-14 bg-card rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.email ? 'border-destructive' : 'border-border'}`}>
                  <span className="material-icons-round text-muted-foreground/60 me-3" aria-hidden="true">email</span>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ali@example.com"
                    className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-medium px-1">{errors.email[0]}</p>}
              </div>
            </RevealLayout>

            <div className="flex-1" />

            <RevealLayout delay={0.3} className="pt-8">
              <Button
                className="w-full h-14 text-lg"
                onClick={handleSend}
                disabled={!email || loading}
              >
                {loading ? t('sending') : t('send_reset_link')}
              </Button>
            </RevealLayout>
          </>
        )}
      </div>
    </div>
  )
}
