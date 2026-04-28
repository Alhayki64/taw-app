import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { useDemo } from '@/contexts/DemoContext'
import { useToast } from '@/contexts/ToastProvider'

export default function WalkthroughScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()
  const { isDemoMode, signInAsDemo } = useDemo()
  const toast = useToast()
  const [demoLoading, setDemoLoading] = useState(false)

  // If already logged in, skip the welcome screen
  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden selection:bg-primary/20">
      {/* Background Decor - premium feel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-primary/10 to-transparent clip-bottom-rounded transition-colors duration-700"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-colors duration-700"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 pb-10 px-6 pt-12">
        {/* Top bar: Language Toggle Only */}
        <div className="flex justify-end items-center mb-6 h-10">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
          >
            <span className="material-icons-round text-base">language</span>
            {language === 'en' ? 'عربي' : 'English'}
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center w-full"
          >
            <div className="h-[300px] flex items-center justify-center mb-8 relative w-full">
              {/* Image Backdrop Glow */}
              <div className="absolute inset-x-8 inset-y-12 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
              <img 
                src="/mascot/mascot-wavy.webp"
                alt="Welcome to Tawwa" 
                className="max-h-full max-w-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="space-y-4 px-2 max-w-sm">
              <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                {t('walkthrough_1_title') || 'مرحباً بك في طوّع'}
              </h1>
              <p className="text-[17px] font-medium text-muted-foreground leading-relaxed">
                {t('walkthrough_1_subtitle') || 'نسيجك المدني يبدأ هنا. لِنُحدث تأثيراً معاً!'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-8 flex flex-col items-center gap-6 mt-auto">
          <div className="w-full flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="w-full space-y-4"
            >
              <Button
                className="w-full text-lg h-14 shadow-lg shadow-primary/30"
                onClick={() => navigate('/signup')}
              >
                {t('start_journey') || 'ابدأ رحلتك'}
              </Button>

              {isDemoMode && (
                <Button
                  variant="ghost"
                  className="w-full h-12 text-sm text-muted-foreground border border-dashed border-border hover:text-foreground hover:border-muted-foreground/50"
                  disabled={demoLoading}
                  onClick={async () => {
                    setDemoLoading(true)
                    const { error } = await signInAsDemo()
                    if (error) {
                      toast.error(t(error.message) || error.message)
                      setDemoLoading(false)
                    }
                  }}
                >
                  {demoLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-icons-round text-sm animate-spin">sync</span>
                      Signing in…
                    </span>
                  ) : (
                    <>
                      <span className="material-icons-round text-sm me-2">bolt</span>
                      Try Demo
                    </>
                  )}
                </Button>
              )}

              <Button 
                variant="outline"
                className="w-full text-base h-12 border-primary/20 hover:bg-primary/5 text-foreground" 
                onClick={() => navigate('/home')}
              >
                {t('explore_guest') || 'تصفح كزائر'}
              </Button>

              <div className="text-center pt-1">
                <p className="text-sm text-foreground font-medium">
                  {t('already_have_account_text') || 'لديك حساب بالفعل؟ '}
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-primary font-bold hover:underline underline-offset-4 focus:outline-none"
                  >
                    {t('sign_in_btn') || 'تسجيل الدخول'}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
