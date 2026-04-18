import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'

const slides = [
  {
    id: 1,
    image: '/mascot/mascot-wavy.png',
    titleKey: 'walkthrough_1_title',
    subtitleKey: "walkthrough_1_subtitle"
  },
  {
    id: 2,
    image: '/mascot/mascot-idle.png',
    titleKey: 'walkthrough_2_title',
    subtitleKey: 'walkthrough_2_subtitle'
  },
  {
    id: 3,
    image: '/mascot/mascot-sit.png',
    titleKey: 'walkthrough_3_title',
    subtitleKey: 'walkthrough_3_subtitle'
  },
  {
    id: 4,
    image: '/mascot/mascot-celebrate.png',
    titleKey: 'walkthrough_4_title',
    subtitleKey: 'walkthrough_4_subtitle'
  }
]

export default function WalkthroughScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  // If already logged in, skip the walkthrough screen
  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden selection:bg-primary/20">
      {/* Background Decor - same premium feel as welcome */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-primary/10 to-transparent clip-bottom-rounded transition-colors duration-700"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-colors duration-700"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 pb-10 px-6 pt-12">
        {/* Top bar: Language Toggle & Skip button */}
        <div className="flex justify-between items-center mb-6 h-10">
          {currentSlide < slides.length - 1 ? (
             <button 
              onClick={() => setCurrentSlide(slides.length - 1)}
              className="text-muted-foreground font-medium text-sm px-2 py-1 hover:text-foreground transition-colors"
            >
              {t('skip')}
            </button>
          ) : (
            <div></div> // Empty div to balance flex-between if skip is gone
          )}
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
          >
            <span className="material-icons-round text-base">language</span>
            {language === 'en' ? 'عربي' : 'English'}
          </button>
        </div>
        
        {/* Carousel Content */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              <div className="h-[300px] flex items-center justify-center mb-8 relative w-full">
                {/* Image Backdrop Glow */}
                <div className="absolute inset-x-8 inset-y-12 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].titleKey} 
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              </div>

              <div className="space-y-4 px-2 max-w-sm">
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {/* Using raw text if translation key doesn't exist yet, wrapped in a generic standard approach */}
                  {t(slides[currentSlide].titleKey) || slides[currentSlide].titleKey}
                </h1>
                <p className="text-[17px] font-medium text-muted-foreground leading-relaxed">
                  {t(slides[currentSlide].subtitleKey) || slides[currentSlide].subtitleKey}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <div className="pt-8 flex flex-col items-center gap-6 mt-auto">
          {/* Pagination Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' 
                    : 'w-2.5 bg-muted hover:bg-muted-foreground/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-full h-[104px] flex flex-col justify-end">
            <AnimatePresence mode="wait">
              {currentSlide < slides.length - 1 ? (
                // Next / Prev actions for intermediate slides
                <motion.div
                  key="nav-buttons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full flex gap-4"
                >
                  {currentSlide > 0 && (
                    <Button 
                      variant="outline" 
                      className="flex-1 h-14 text-base border-primary/20 hover:bg-primary/5"
                      onClick={prevSlide}
                    >
                      {t('back')}
                    </Button>
                  )}
                  <Button 
                    className="flex-1 h-14 text-base shadow-lg shadow-primary/20"
                    onClick={nextSlide}
                  >
                    {t('continue')}
                  </Button>
                </motion.div>
              ) : (
                // Final slide actions
                <motion.div
                  key="final-actions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full space-y-4"
                >
                  <Button 
                    className="w-full text-lg h-14 shadow-lg shadow-primary/30" 
                    onClick={() => navigate('/signup')}
                  >
                    {t('start_journey')}
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    className="w-full text-base h-12 text-muted-foreground hover:text-foreground" 
                    onClick={() => navigate('/home')}
                  >
                    {t('explore_guest')}
                  </Button>

                  <div className="text-center pt-1">
                    <p className="text-sm text-foreground font-medium">
                      {t('already_have_account_text')}
                      <button
                        onClick={() => navigate('/signin')}
                        className="text-primary font-bold hover:underline underline-offset-4 focus:outline-none"
                      >
                        {t('sign_in_btn')}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
