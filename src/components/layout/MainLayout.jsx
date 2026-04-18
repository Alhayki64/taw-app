import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    { path: '/home', icon: 'home', label: t('nav_home') },
    { path: '/rewards', icon: 'workspace_premium', label: t('nav_rewards') },
    { path: '/profile', icon: 'person', label: t('nav_profile') },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Scrollable Container */}
      <div className="w-full max-w-md bg-background min-h-screen relative flex flex-col pb-20 shadow-xl overflow-x-hidden">
        
        {/* Child Screen Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <Outlet />
        </div>

        {/* Bottom Navigation Bar */}
        <nav aria-label="Main navigation" className="fixed bottom-0 w-full max-w-md bg-card text-card-foreground border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50 rounded-t-3xl pb-safe pt-2 px-6">
          <ul className="flex justify-between items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <li key={item.path} className="relative flex-1">
                  <button
                    onClick={() => navigate(item.path)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      "w-full flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"
                    )}
                  >
                    <span className="material-icons-round text-2xl" aria-hidden="true">{item.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                  {/* Active Indicator Animation */}
                  {isActive && (
                    <motion.div 
                      layoutId="bottom-nav-indicator"
                      className="absolute -top-3 left-1/2 w-10 h-1 bg-primary rounded-full -translate-x-1/2"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
