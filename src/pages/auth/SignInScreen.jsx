import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { signInSchema } from '@/lib/schemas'
import { useToast } from '@/contexts/ToastProvider'

export default function SignInScreen() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSignIn = async () => {
    setErrors({})

    const result = signInSchema.safeParse({ email, password })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Header */}
      <RevealLayout className="flex items-center mb-10">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
      </RevealLayout>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-3 mb-10">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('welcome_back')}</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Sign in to continue making an impact.
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('email')}</label>
            <div className={`flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.email ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3">email</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ali@example.com"
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive font-medium px-1">{errors.email[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('password')}</label>
            <div className={`flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.password ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3">lock</span>
              <input
                id="password"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" 
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium px-1">{errors.password[0]}</p>}
          </div>

          <div className="flex justify-end">
            <button onClick={() => navigate('/forgot-password')} className="text-sm font-bold text-primary hover:underline">Forgot Password?</button>
          </div>
        </RevealLayout>

        <div className="flex-1"></div>

        {/* Footer */}
        <RevealLayout delay={0.4} className="pt-8">
          <Button 
            className="w-full h-14 text-lg" 
            onClick={handleSignIn}
            disabled={!email || !password || loading}
          >
            {loading ? t('signing_in') : t('sign_in_btn')}
          </Button>
          <div className="mt-6 flex justify-center items-center gap-1">
            <button onClick={() => navigate('/signup')} className="text-sm font-bold text-primary hover:underline">
              {t('no_account')}
            </button>
          </div>
        </RevealLayout>
      </div>
    </div>
  )
}
