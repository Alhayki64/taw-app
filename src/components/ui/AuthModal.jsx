import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageProvider'

export function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-card z-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl sm:max-w-sm sm:w-full"
          >
            <div className="flex flex-col items-center text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons-round text-primary text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground mb-2">{t('auth_modal_title')}</h2>
              <p className="text-muted-foreground text-sm font-medium">{t('auth_modal_desc')}</p>
            </div>

            <div className="space-y-3 mt-4">
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-primary text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                {t('sign_up_btn')}
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="w-full bg-card text-foreground border border-border font-bold h-12 rounded-xl hover:bg-muted transition-colors"
              >
                {t('log_in')}
              </button>
              <button
                onClick={onClose}
                className="w-full bg-transparent text-muted-foreground font-medium h-10 rounded-xl hover:text-foreground transition-colors mt-2"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
