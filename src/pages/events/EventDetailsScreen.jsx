import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import SubPageHeader from '@/components/layout/SubPageHeader'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useEventDetails } from '@/hooks/useEventDetails'
import { useToast } from '@/contexts/ToastProvider'
import { useAuth } from '@/contexts/AuthProvider'
import { AuthModal } from '@/components/ui/AuthModal'
import { useLanguage } from '@/contexts/LanguageProvider'

export default function EventDetailsScreen() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, loading, isSignedUp, setIsSignedUp } = useEventDetails(id)
  const toast = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isCommitting, setIsCommitting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isCommitted = isSignedUp

  const handleShare = async () => {
    const shareData = {
      title: event?.title ?? 'Volunteer Opportunity',
      text: `Join me at "${t(event?.title)}" — volunteer with Tawwa!`,
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.info('Link copied to clipboard!')
    }
  }

  const handleCommit = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    setIsCommitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { navigate('/signin'); return }

    const { error } = await supabase
      .from('opportunity_signups')
      .insert({ opportunity_id: id, user_id: session.user.id, status: 'pending' })

    if (!error) {
      setIsSignedUp(true)
      toast.success('You\'re signed up! See you there.')
      setTimeout(() => navigate('/checkin-success', { state: { event } }), 800)
    } else {
      toast.error('Could not sign up: ' + error.message)
    }
    setIsCommitting(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <SubPageHeader title={t('loading')} />
        <div className="w-full h-64 bg-muted animate-pulse" />
        <div className="px-6 pt-6 space-y-4">
          <div className="h-8 bg-muted rounded-xl animate-pulse" />
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
          <div className="h-16 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-6 text-center">
        <span className="material-icons-round text-5xl text-muted-foreground/30">event_busy</span>
        <p className="text-muted-foreground font-medium mt-4">{t('event_unavailable')}</p>
        <button onClick={() => navigate('/home')} className="mt-6 text-primary font-bold">{t('back_home')}</button>
      </div>
    )
  }

  const heroImage = event.hero_image_url || event.image_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&q=80&w=800'

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-BH', { weekday: 'long', month: 'short', day: 'numeric' })
    : event.date
      ? new Date(event.date).toLocaleDateString('en-BH', { weekday: 'long', month: 'short', day: 'numeric' })
      : t('date_tbd')

  return (
    <div className="flex flex-col min-h-screen bg-background pb-28">
      <SubPageHeader title={t('event_details')} ActionIcon="share" onActionClick={handleShare} />

      {/* Hero Image */}
      <RevealLayout className="w-full h-64 relative">
        <img src={heroImage} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          {event.is_urgent && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/90 text-white backdrop-blur-sm px-2 py-1 rounded-sm mb-2 inline-block">
              {t('urgent')}
            </span>
          )}
          {event.category && !event.is_urgent && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/90 text-primary-foreground backdrop-blur-sm px-2 py-1 rounded-sm mb-2 inline-block">
              {event.category}
            </span>
          )}
          <h1 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md">{t(event.title)}</h1>
        </div>
      </RevealLayout>

      <div className="px-6 pt-6 flex-1 flex flex-col gap-5">

        {/* Date & Location Row */}
        <RevealLayout delay={0.1} className="flex gap-3">
          <div className="flex-1 p-4 bg-card rounded-2xl shadow-sm border border-border flex items-center gap-3">
            <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-xl text-primary">
              <span className="material-icons-round">calendar_month</span>
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">{formattedDate}</h4>
              <p dir="ltr" className="text-xs font-medium text-muted-foreground text-left">{event.time_range || t('time_tbd')}</p>
            </div>
          </div>
          <div className="flex-1 p-4 bg-card rounded-2xl shadow-sm border border-border flex items-center gap-3">
            <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-xl text-primary">
              <span className="material-icons-round">location_on</span>
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">{t(event.location) || t('bahrain')}</h4>
              <p className="text-xs font-medium text-muted-foreground">{t('check_in_site')}</p>
            </div>
          </div>
        </RevealLayout>

        {/* Points reward badge */}
        {event.points > 0 && (
          <RevealLayout delay={0.15} className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <span className="material-icons-round text-amber-500 text-2xl">stars</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">{t('points_reward')}</p>
              <p className="font-extrabold text-foreground text-lg">+{event.points} {t('tawwa_points')}</p>
            </div>
          </RevealLayout>
        )}

        {/* Description */}
        {event.description && (
          <RevealLayout delay={0.2}>
            <h3 className="text-lg font-bold text-foreground mb-2">{t('about_mission')}</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">{t(event.description)}</p>
          </RevealLayout>
        )}

        {/* Organizer */}
        {event.org_name && (
          <RevealLayout delay={0.3} className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {event.org_logo ? (
                <img src={event.org_logo} alt={event.org_name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="material-icons-round text-primary">corporate_fare</span>
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{t('organizer')}</p>
              <h4 className="font-bold text-foreground text-sm">{t(event.org_name)}</h4>
              {event.org_type && <p className="text-xs font-medium text-muted-foreground">{t(event.org_type)}</p>}
            </div>
          </RevealLayout>
        )}

        {/* Spots */}
        {event.spots && (
          <RevealLayout delay={0.35} className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
            <span className="material-icons-round text-muted-foreground">group</span>
            <div>
              <p className="font-bold text-foreground text-sm">{event.spots - (event.spots_filled || 0)} {t('spots_remaining')}</p>
              <p className="text-xs text-muted-foreground font-medium">{event.spots_filled || 0} {t('of')} {event.spots} {t('volunteers_signed_up')}</p>
            </div>
          </RevealLayout>
        )}

      </div>

      {/* Sticky Commit CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-5xl mx-auto p-6 bg-gradient-to-t from-background via-background to-transparent z-50">
        <Button
          className="w-full h-14 text-base font-bold shadow-lift transition-all duration-300"
          onClick={handleCommit}
          disabled={isCommitting || isCommitted}
        >
          {isCommitted ? (
            <span className="flex items-center gap-2">
              <span className="material-icons-round text-sm">check_circle</span> {t('signed_up')}
            </span>
          ) : isCommitting ? (
            <span className="flex items-center gap-2">
              <span className="material-icons-round animate-spin text-sm">sync</span> {t('committing')}
            </span>
          ) : (
            t('commit_volunteer')
          )}
        </Button>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

