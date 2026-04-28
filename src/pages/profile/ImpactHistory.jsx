import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import SubPageHeader from '@/components/layout/SubPageHeader'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { supabase } from '@/lib/supabaseClient'

const statusConfig = {
  confirmed:  { label: 'Confirmed',  icon: 'check_circle',  color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-950'  },
  pending:    { label: 'Applied',    icon: 'hourglass_top', color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950'  },
  checked_in: { label: 'Checked In', icon: 'login',         color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950'   },
  cancelled:  { label: 'Cancelled',  icon: 'cancel',        color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950'    },
}

const categoryColor = (cat) => {
  if (cat === 'Environment') return 'bg-green-500'
  if (cat === 'Community')   return 'bg-blue-500'
  if (cat === 'Education')   return 'bg-purple-500'
  if (cat === 'Elderly')     return 'bg-orange-400'
  return 'bg-primary'
}

export default function ImpactHistory() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [tab, setTab]           = useState('upcoming')
  const [sessions, setSessions] = useState([])
  const [rewards, setRewards]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (user?.id) fetchAll(user.id)
  }, [user])

  const fetchAll = async (userId) => {
    setLoading(true)
    const [sessionsRes, rewardsRes] = await Promise.all([
      supabase
        .from('opportunity_signups')
        .select('id, status, checked_in, checked_in_at, created_at, opportunities(title, category, location, image_url, points, hours, event_date, date)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('redemptions')
        .select('id, code, points_spent, expires_at, used_at, created_at, deals(title, brand_name, points_cost)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ])
    if (!sessionsRes.error) setSessions(sessionsRes.data ?? [])
    if (!rewardsRes.error)  setRewards(rewardsRes.data ?? [])
    setLoading(false)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingSessions = sessions.filter(s => {
    const opp = s.opportunities
    if (!opp) return false
    const d = new Date(opp.event_date || opp.date || 0)
    return d >= today && s.status !== 'cancelled'
  })

  const pastSessions = sessions.filter(s => {
    const opp = s.opportunities
    if (!opp) return true
    const d = new Date(opp.event_date || opp.date || 0)
    return d < today || s.status === 'confirmed' || s.checked_in
  })

  const confirmedSessions = sessions.filter(s => s.status === 'confirmed' || s.checked_in)
  const totalPoints = confirmedSessions.reduce((sum, s) => sum + (s.opportunities?.points || 0), 0)
  const totalHours  = sessions.reduce((sum, s) => sum + (parseFloat(s.opportunities?.hours) || 0), 0)

  const tabs = [
    { key: 'upcoming', label: 'Upcoming',  icon: 'event',            count: upcomingSessions.length },
    { key: 'history',  label: 'History',   icon: 'volunteer_activism', count: pastSessions.length },
    { key: 'rewards',  label: 'Rewards',   icon: 'card_giftcard',    count: rewards.length },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SubPageHeader title="My Activity" />

      {/* Stats Banner */}
      <RevealLayout className="mx-6 mt-6 mb-4 bg-primary text-primary-foreground rounded-3xl p-5 flex justify-around">
        <div className="text-center">
          <p className="text-3xl font-black">{confirmedSessions.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">{t('stat_sessions')}</p>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <p className="text-3xl font-black">{totalHours.toFixed(1)}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">{t('stat_hours')}</p>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <p className="text-3xl font-black">{totalPoints.toLocaleString()}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">{t('stat_pts_earned')}</p>
        </div>
      </RevealLayout>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mb-4">
        {tabs.map(({ key, label, icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              tab === key
                ? 'bg-primary text-primary-foreground border-primary shadow-lift'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            <span className="material-icons-round text-base mb-0.5">{icon}</span>
            {label}
            {count > 0 && (
              <span className={`text-[9px] font-black mt-0.5 ${tab === key ? 'opacity-80' : 'text-primary'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-10 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse mb-3" />
              ))}
            </motion.div>
          ) : tab === 'upcoming' ? (
            <motion.div key="upcoming" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-3">
              {upcomingSessions.length === 0 ? (
                <EmptyTab icon="event" title="No upcoming commitments" subtitle="Sign up for volunteer opportunities to see them here." />
              ) : (
                upcomingSessions.map((s, idx) => <SessionCard key={s.id} session={s} idx={idx} />)
              )}
            </motion.div>
          ) : tab === 'history' ? (
            <motion.div key="history" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-3">
              {pastSessions.length === 0 ? (
                <EmptyTab icon="volunteer_activism" title="No past sessions yet" subtitle="Your completed volunteering sessions will appear here." />
              ) : (
                pastSessions.map((s, idx) => <SessionCard key={s.id} session={s} idx={idx} />)
              )}
            </motion.div>
          ) : (
            <motion.div key="rewards" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-3">
              {rewards.length === 0 ? (
                <EmptyTab icon="card_giftcard" title="No redeemed rewards yet" subtitle="Redeem your points for deals and they'll show up here." />
              ) : (
                rewards.map((r, idx) => <RewardCard key={r.id} redemption={r} idx={idx} />)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SessionCard({ session, idx }) {
  const opp    = session.opportunities
  const status = statusConfig[session.status] ?? statusConfig.pending
  const date   = new Date(session.created_at).toLocaleDateString('en-BH', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="bg-card text-card-foreground rounded-2xl border border-border/50 shadow-sm overflow-hidden flex"
    >
      <div className={`w-1.5 shrink-0 ${categoryColor(opp?.category)}`} />
      <div className="flex-1 flex gap-3 p-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {opp?.image_url ? (
            <img src={opp.image_url} alt={opp.title} className="w-full h-full object-cover" />
          ) : (
            <span className="material-icons-round text-muted-foreground/40 text-2xl">volunteer_activism</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-foreground text-sm leading-snug line-clamp-1">
              {opp?.title || 'Volunteer Session'}
            </h4>
            {opp?.points > 0 && (
              <span className="text-primary font-black text-sm shrink-0">+{opp.points}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">{date}{opp?.hours ? ` · ${opp.hours}h` : ''}</p>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full ${status.bg}`}>
            <span className={`material-icons-round text-[10px] ${status.color}`}>{status.icon}</span>
            <span className={`text-[10px] font-bold ${status.color}`}>{status.label}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RewardCard({ redemption, idx }) {
  const deal      = redemption.deals
  const isExpired = redemption.expires_at && new Date(redemption.expires_at) < new Date()
  const isUsed    = !!redemption.used_at
  const date      = new Date(redemption.created_at).toLocaleDateString('en-BH', { day: 'numeric', month: 'short', year: 'numeric' })
  const expiryStr = redemption.expires_at
    ? new Date(redemption.expires_at).toLocaleDateString('en-BH', { day: 'numeric', month: 'short' })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className={`bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden ${isExpired || isUsed ? 'opacity-60 border-border/30' : 'border-border/50'}`}
    >
      <div className="flex gap-3 p-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-icons-round text-primary text-2xl">card_giftcard</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{deal?.brand_name}</p>
              <h4 className="font-extrabold text-foreground text-sm leading-snug">{deal?.title}</h4>
            </div>
            <span className="text-muted-foreground font-black text-sm shrink-0">-{redemption.points_spent}</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">{date}{expiryStr ? ` · Expires ${expiryStr}` : ''}</p>
        </div>
      </div>
      <div className="border-t border-dashed border-border/50 px-4 py-2.5 flex items-center justify-between bg-muted/30">
        <span className="font-black text-sm tracking-widest text-foreground select-all">{redemption.code}</span>
        {isUsed ? (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Used</span>
        ) : isExpired ? (
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Expired</span>
        ) : (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
        )}
      </div>
    </motion.div>
  )
}

function EmptyTab({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-icons-round text-6xl text-muted-foreground/20 mb-4">{icon}</span>
      <h3 className="font-extrabold text-foreground text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium max-w-xs">{subtitle}</p>
    </div>
  )
}
