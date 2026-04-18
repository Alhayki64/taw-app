import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function SignInScreen() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignIn = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      await signIn(email, password)
      navigate('/home') // Go to app shell after sign in
    } catch (err) {
      setErrorMsg(err.message)
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
          {errorMsg && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2 mb-2">
              <span className="material-icons-round text-base">error</span>
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('email')}</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">email</span>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ali@example.com" 
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('password')}</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" 
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</a>
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
