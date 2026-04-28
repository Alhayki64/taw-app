import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { useAuth } from '@/contexts/AuthProvider'
import { usePoints } from '@/contexts/PointsProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { useTheme } from '@/contexts/ThemeProvider'
import { supabase } from '@/lib/supabaseClient'
import { useDownloadCV } from '@/hooks/useDownloadCV'
import { useTutorial } from '@/contexts/TutorialContext'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { points } = usePoints()
  const { t, language, toggleLanguage } = useLanguage()
  const { isDarkMode, toggleTheme } = useTheme()
  const { resetTutorial } = useTutorial()

  const { getTierInfo } = usePoints()
  const tier = getTierInfo()

  const downloadCV = useDownloadCV()

  const [sessionCount, setSessionCount] = useState(0)
  const [redeemedCount, setRedeemedCount] = useState(0)
  const [confirmedCount, setConfirmedCount] = useState(0)
  const [cvExports, setCvExports] = useState([])
  const [cvLoading, setCvLoading] = useState(false)
  const [cvError, setCvError] = useState(null)
  const [revokingId, setRevokingId] = useState(null)

  useEffect(() => {
    if (user?.id) fetchStats(user.id)
  }, [user])

  const fetchStats = async (userId) => {
    const [sessions, redeemed, confirmed, exports_] = await Promise.all([
      supabase.from('opportunity_signups').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('redemptions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('opportunity_signups').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).or('status.eq.confirmed,checked_in.eq.true'),
      supabase.from('cv_exports').select('id, verification_token, generated_at, is_revoked, total_sessions, tier_at_export')
        .eq('user_id', userId).order('generated_at', { ascending: false }),
    ])
    setSessionCount(sessions.count || 0)
    setRedeemedCount(redeemed.count || 0)
    setConfirmedCount(confirmed.count || 0)
    setCvExports(exports_.data || [])
  }

  const handleDownloadCV = async () => {
    setCvLoading(true)
    setCvError(null)
    try {
      await downloadCV()
      // Refresh exports list after successful generation
      if (user?.id) {
        const { data } = await supabase
          .from('cv_exports')
          .select('id, verification_token, generated_at, is_revoked, total_sessions, tier_at_export')
          .eq('user_id', user.id)
          .order('generated_at', { ascending: false })
        setCvExports(data || [])
      }
    } catch (err) {
      setCvError(err.message || 'Failed to generate CV')
    } finally {
      setCvLoading(false)
    }
  }

  const handleRevokeCV = async (exportId) => {
    setRevokingId(exportId)
    await supabase.from('cv_exports').update({ is_revoked: true }).eq('id', exportId)
    setCvExports(prev => prev.map(e => e.id === exportId ? { ...e, is_revoked: true } : e))
    setRevokingId(null)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = profile?.display_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Volunteer'
  const avatarUrl = profile?.avatar_url

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background px-6 pt-32 pb-24 text-center items-center">
        <RevealLayout className="flex flex-col items-center w-full max-w-sm mx-auto">
          <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-4 border-primary/20">
            <span className="material-icons-round text-primary text-5xl">lock_outline</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-3">{t('join_tawwa')}</h2>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            {t('guest_profile_desc')}
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-primary text-primary-foreground font-bold h-14 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity mb-4"
          >
            {t('sign_up_btn')}
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-card text-foreground border border-border font-bold h-14 rounded-xl hover:bg-muted transition-colors"
          >
            {t('log_in')}
          </button>

          <div className="w-full h-px bg-border/50 my-8"></div>
          
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full h-14 bg-card border border-border/50 rounded-calc px-5 hover:bg-muted transition-colors mb-2 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-sm text-primary">dark_mode</span>
              <span className="font-bold text-foreground">{t('dark_mode')}</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${isDarkMode ? 'start-6' : 'start-1'}`} />
            </div>
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center justify-between w-full h-14 bg-card border border-border/50 rounded-2xl px-5 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-sm text-primary">language</span>
              <span className="font-bold text-foreground">{t('switch_language')}</span>
            </div>
            <span className="text-muted-foreground font-bold text-xs bg-muted px-2 py-1 rounded-md">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>
        </RevealLayout>
      </div>
    )
  }

  const settingsList = [
    { icon: 'edit',              label: t('edit_profile'),    path: '/profile/edit' },
    { icon: 'history',           label: 'My Activity',        path: '/profile/history' },
    { icon: 'dark_mode',         label: t('dark_mode'),       action: toggleTheme, toggleValue: isDarkMode },
    { icon: 'language',          label: t('switch_language'), action: toggleLanguage },
    { icon: 'tour',              label: 'Replay App Tour',    action: () => { resetTutorial(); navigate('/home') } },
    { icon: 'help_outline',      label: t('help_support'),    path: null },
    { icon: 'privacy_tip',       label: t('privacy_policy'),  path: null },
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

        {/* Tier badge */}
        <div id="tutorial-profile-tier" className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold ${tier.bg}`}>
          <span className="material-icons-round text-sm">{tier.icon}</span>
          {tier.name} Volunteer
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 w-full">
          <div className="bg-card rounded-2xl p-3 shadow-soft border border-border/50 text-center">
            <h4 className="text-xl font-black text-primary">{points.toLocaleString()}</h4>
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{t('available_points')}</p>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-soft border border-border/50 text-center">
            <h4 className="text-xl font-black text-primary">{sessionCount}</h4>
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{t('sessions_done')}</p>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-soft border border-border/50 text-center">
            <h4 className="text-xl font-black text-primary">{redeemedCount}</h4>
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Redeemed</p>
          </div>
        </div>
      </RevealLayout>

      {/* ── Volunteer CV ── */}
      <RevealLayout delay={0.15} className="mb-4">
        <div id="tutorial-cv-card" className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-icons-round text-sm text-primary">workspace_premium</span>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">My Volunteer CV</p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {confirmedCount > 0
                  ? `${confirmedCount} confirmed session${confirmedCount !== 1 ? 's' : ''} · tamper-evident PDF`
                  : 'Complete a volunteer session to unlock'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCV}
            disabled={cvLoading || confirmedCount === 0}
            className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              bg-[#2D5A3D] text-white hover:bg-[#245030] active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cvLoading ? (
              <>
                <span className="material-icons-round text-sm animate-spin">sync</span>
                Generating…
              </>
            ) : (
              <>
                <span className="material-icons-round text-sm">download</span>
                Download Verified CV
              </>
            )}
          </button>

          {cvError && (
            <p className="text-xs text-destructive font-medium mt-2 text-center">{cvError}</p>
          )}

          {/* Past exports */}
          {cvExports.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Past Exports</p>
              {cvExports.map(exp => (
                <div key={exp.id} className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs
                  ${exp.is_revoked ? 'bg-muted/30 border-border/30 opacity-60' : 'bg-muted/20 border-border/50'}`}>
                  <div>
                    <span className="font-semibold text-foreground">
                      {new Date(exp.generated_at).toLocaleDateString('en-BH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {exp.total_sessions} sessions · {exp.tier_at_export}
                    </span>
                    {exp.is_revoked && (
                      <span className="ml-2 text-destructive font-bold">· Revoked</span>
                    )}
                  </div>
                  {!exp.is_revoked && (
                    <button
                      onClick={() => handleRevokeCV(exp.id)}
                      disabled={revokingId === exp.id}
                      className="text-destructive/70 hover:text-destructive font-bold transition-colors ml-3"
                      title="Revoke this CV"
                    >
                      {revokingId === exp.id ? '…' : 'Revoke'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
