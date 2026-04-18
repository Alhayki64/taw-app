import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { useAuth } from '@/contexts/AuthProvider'
import { usePoints } from '@/contexts/PointsProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { useTheme } from '@/contexts/ThemeProvider'
import { supabase } from '@/lib/supabaseClient'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { points } = usePoints()
  const { t, language, toggleLanguage } = useLanguage()
  const { isDarkMode, toggleTheme } = useTheme()

  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    if (user?.id) fetchSessionCount(user.id)
  }, [user])

  const fetchSessionCount = async (userId) => {
    const { count } = await supabase
      .from('opportunity_signups')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    setSessionCount(count || 0)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = profile?.display_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Volunteer'
  const avatarUrl = profile?.avatar_url

  const settingsList = [
    { icon: 'edit',         label: t('edit_profile'),      path: '/profile/edit' },
    { icon: 'history',      label: t('impact_history'),    path: '/profile/history' },
    { icon: 'dark_mode',    label: t('dark_mode'),         action: toggleTheme, toggleValue: isDarkMode },
    { icon: 'language',     label: t('switch_language'),   action: toggleLanguage },
    { icon: 'help_outline', label: t('help_support'),      path: null },
    { icon: 'privacy_tip',  label: t('privacy_policy'),    path: null },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 pt-12 pb-24">
      <RevealLayout className="flex flex-col items-center justify-center text-center mt-6 mb-10">
        <div className="relative mb-4">
          <div className="w-28 h-28 bg-primary/10 rounded-full border-4 border-primary/30 shadow-xl flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="material-icons-round text-primary text-5xl">person</span>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="absolute bottom-0.5 end-0.5 w-9 h-9 bg-primary text-primary-foreground shadow-lg border-2 border-background rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className="material-icons-round text-[18px]">photo_camera</span>
          </button>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground capitalize">{displayName}</h2>
        <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>

        <div className="flex items-center gap-4 mt-6 w-full">
          <div className="flex-1 bg-card rounded-2xl p-4 shadow-soft border border-border/50 text-center">
            <h4 className="text-2xl font-black text-primary">{points.toLocaleString()}</h4>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{t('available_points')}</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-4 shadow-soft border border-border/50 text-center">
            <h4 className="text-2xl font-black text-primary">{sessionCount}</h4>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{t('sessions_done')}</p>
          </div>
        </div>
      </RevealLayout>

      <RevealLayout delay={0.2} className="flex-1 flex flex-col space-y-2">
        {settingsList.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (item.path) navigate(item.path)
              else if (item.action) item.action()
            }}
            className={`flex items-center justify-between w-full h-16 bg-card border border-border/50 rounded-2xl px-5 transition-colors shadow-sm ${
              (item.path || item.action) ? 'hover:bg-muted cursor-pointer' : 'cursor-default opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-icons-round text-sm text-primary">{item.icon}</span>
              </div>
              <span className="font-bold text-foreground">{item.label}</span>
            </div>
            {item.toggleValue !== undefined ? (
              <div className={`w-10 h-5 rounded-full relative transition-colors ${item.toggleValue ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${item.toggleValue ? 'start-6' : 'start-1'}`} />
              </div>
            ) : (
              <span className={`material-icons-round text-muted-foreground/40 ${language === 'ar' ? 'rotate-180' : ''}`}>chevron_right</span>
            )}
          </button>
        ))}
      </RevealLayout>

      <RevealLayout delay={0.4} className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20"
        >
          {t('sign_out')}
        </button>
      </RevealLayout>
    </div>
  )
}
