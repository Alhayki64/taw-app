import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function CheckInSuccessScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const event = location.state?.event

  useEffect(() => {
    // Burst confetti from both sides
    const end = Date.now() + 1800
    const colors = ['#16a34a', '#ffffff', '#86efac']

    ;(function frame() {
      confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }())
  }, [])

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden text-primary-foreground text-center">
      
      <RevealLayout className="relative z-10 flex flex-col items-center w-full">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <span className="material-icons-round text-6xl text-primary">check_circle</span>
        </motion.div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-3">{t('signed_up')}</h1>

        {event?.title && (
          <p className="text-base font-bold opacity-90 mb-1">
            {event.title}
          </p>
        )}

        <p className="text-base font-medium opacity-75 max-w-sm mb-10">
          {event?.title ? t('committed_mission') : t('thank_you_volunteering')}
        </p>

        {/* Info Cards */}
        <div className="w-full space-y-3 mb-10">
          {/* Points Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center gap-4">
            <span className="material-icons-round text-amber-300 text-3xl">stars</span>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">{t('points_on_completion')}</p>
              <p className="text-xl font-black">
                {event?.points ? `+${event.points} ${t('pts')}` : t('pending')}
              </p>
            </div>
            <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full font-bold">{t('pending')}</span>
          </div>

          {/* Date Card */}
          {(event?.date || event?.event_date) && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center gap-4">
              <span className="material-icons-round text-white/80 text-3xl">calendar_month</span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider opacity-75">{t('event_date')}</p>
                <p className="text-base font-bold">
                  {new Date(event?.event_date || event?.date).toLocaleDateString('en-BH', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          {/* Location Card */}
          {event?.location && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center gap-4">
              <span className="material-icons-round text-white/80 text-3xl">location_on</span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider opacity-75">{t('location')}</p>
                <p className="text-base font-bold">{event.location}</p>
              </div>
            </div>
          )}
        </div>
      </RevealLayout>

      <RevealLayout delay={0.4} className="w-full z-10 mt-auto space-y-3">
        <Button 
          className="w-full h-14 text-lg bg-white text-primary hover:bg-gray-100 shadow-lift font-bold" 
          onClick={() => navigate('/home')}
        >
          {t('back_home')}
        </Button>
        <button
          onClick={() => navigate('/profile/history')}
          className="w-full h-12 text-sm font-bold text-white/70 hover:text-white transition-colors"
        >
          {t('view_impact_history')} →
        </button>
      </RevealLayout>
    </div>
  )
}
