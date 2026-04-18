import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()

  // If already logged in, skip the welcome screen
  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user])

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-primary/10 to-transparent clip-bottom-rounded"></div>
        {/* Placeholder for actual background image if needed */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 pb-10 px-6 pt-12">
        {/* Language Toggle */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
          >
            <span className="material-icons-round text-base">language</span>
            {language === 'en' ? 'عربي' : 'English'}
          </button>
        </div>
        
        {/* Logo Section */}
        <RevealLayout className="flex justify-center mb-16" delay={0.1}>
          <div className="flex items-center justify-center">
            <img 
              src="/taw-logo.png" 
              alt="Tawwa Logo - لوطني أعطي" 
              className="w-48 object-contain drop-shadow-md"
            />
          </div>
        </RevealLayout>

        <div className="flex-1 flex flex-col justify-end gap-10">
          
          {/* Typography Section */}
          <RevealLayout delay={0.3} className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight px-2">
              {t('welcome_title')}
            </h1>
            <p className="text-lg font-medium text-muted-foreground px-6">
              {t('welcome_subtitle')}
            </p>
          </RevealLayout>

          {/* Action Area */}
          <RevealLayout delay={0.5} className="space-y-4 pt-8">
            <Button 
              className="w-full text-lg h-14" 
              onClick={() => navigate('/signup')}
            >
              {t('start_journey')}
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-sm text-foreground font-medium">
                {t('already_have_account')}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-primary font-bold hover:underline underline-offset-4 focus:outline-none"
                >
                  {t('sign_in_btn')}
                </button>
              </p>
            </div>
          </RevealLayout>
          
        </div>
      </div>
    </div>
  )
}
