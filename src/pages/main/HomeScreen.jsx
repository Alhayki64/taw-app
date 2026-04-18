import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import { ImpactCard } from '@/components/ui/impact-card'
import { useAuth } from '@/contexts/AuthProvider'
import { usePoints } from '@/contexts/PointsProvider'
import { supabase } from '@/lib/supabaseClient'
import { useOpportunities } from '@/hooks/useOpportunities'
import { OpportunityCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { points, getTierInfo } = usePoints()
  const tier = getTierInfo()

  const { opportunities, loading: feedLoading } = useOpportunities()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifsLoading, setNotifsLoading] = useState(false)

  const categories = [
    { key: 'All',           label: 'All',         icon: 'apps' },
    { key: 'Environment',   label: 'Environment', icon: 'park' },
    { key: 'Community',     label: 'Community',   icon: 'people' },
    { key: 'Elderly',       label: 'Elderly',     icon: 'elderly' },
    { key: 'Education',     label: 'Education',   icon: 'school' },
  ]

  const fetchNotifications = async () => {
    setNotifsLoading(true)
    // Fetch user's RSVPs as notifications
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { setNotifsLoading(false); return }

    const { data } = await supabase
      .from('opportunity_signups')
      .select('id, status, created_at, opportunity_id, opportunities(title, points, date)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    const items = [
      // Always include a welcome notification
      {
        id: 'welcome',
        icon: 'volunteer_activism',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        title: 'Welcome to Tawwa! 🌱',
        body: 'Start your volunteering journey and earn points for making an impact.',
        time: 'Today',
      },
      ...(data || []).map(s => ({
        id: s.id,
        icon: s.status === 'confirmed' ? 'check_circle' : 'hourglass_top',
        iconColor: s.status === 'confirmed' ? 'text-green-500' : 'text-amber-500',
        iconBg: s.status === 'confirmed' ? 'bg-green-500/10' : 'bg-amber-500/10',
        title: s.status === 'confirmed' 
          ? `✅ Session Confirmed: ${s.opportunities?.title || 'Event'}`
          : `📋 RSVP Pending: ${s.opportunities?.title || 'Event'}`,
        body: s.status === 'confirmed'
          ? `+${s.opportunities?.points || 0} points have been added to your account.`
          : 'Your spot is reserved. Points will be awarded after session confirmation.',
        time: new Date(s.created_at).toLocaleDateString('en-BH', { month: 'short', day: 'numeric' }),
      }))
    ]
    setNotifications(items)
    setNotifsLoading(false)
  }

  const filteredOpps = activeCategory === 'All'
    ? opportunities
    : opportunities.filter(o => o.category?.toLowerCase().includes(activeCategory.toLowerCase()))

  const finalFeed = filteredOpps.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase()
    return o.title?.toLowerCase().includes(q) 
        || o.org_name?.toLowerCase().includes(q) 
        || o.description?.toLowerCase().includes(q)
  })

  const urgentOpps = opportunities.filter(o => o.is_urgent)
  const displayFeed = finalFeed.length > 0 ? finalFeed : (searchQuery ? [] : opportunities)

  const displayName = profile?.display_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Volunteer'
  const avatarUrl = profile?.avatar_url

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <RevealLayout className="px-6 pt-12 pb-6 bg-primary text-primary-foreground rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                : <span className="material-icons-round text-white">person</span>
              }
            </div>
            <div>
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Welcome back,</p>
              <h2 className="text-xl font-bold capitalize">{displayName}</h2>
            </div>
          </div>
          <button
            onClick={() => { setNotificationsOpen(o => !o); if (!notificationsOpen) fetchNotifications() }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="material-icons-round" aria-hidden="true">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-primary"></span>
          </button>
        </div>

        {/* Gamified Premium Status Card */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mt-4 bg-[#315646] rounded-[24px] p-4 shadow-xl relative overflow-hidden"
        >
          {/* Top Row: Title & Tier Pill */}
          <div className="flex justify-between items-start mb-1">
            <span className="text-[#a4caba] font-extrabold tracking-widest text-[10px] uppercase">
              Tawwa Points
            </span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${tier.bg} shadow-sm`}>
              <span className="material-icons-round text-[12px] leading-none">{tier.icon}</span>
              <span className="text-[10px] font-bold leading-none pe-0.5">{tier.name} Tier</span>
            </div>
          </div>

          {/* Points Display */}
          <div className="flex items-baseline gap-1 mt-0.5 mb-5">
            <span className="text-white font-black text-4xl tracking-tight leading-none drop-shadow-sm">
              {points.toLocaleString()}
            </span>
            <span className="text-[#a4caba] font-bold text-base drop-shadow-sm relative top-0.5">pts</span>
          </div>

          {/* Progress Section */}
          <div className="space-y-1.5 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[#e2f1eb] font-medium text-[11px]">
                {tier.name === 'Platinum' ? 'Max Level Reached' : `Progress to ${tier.nextTier}`}
              </span>
              {tier.ptsNeeded > 0 && (
                <span className="text-[#a4caba] font-medium text-[10px]">
                  {tier.ptsNeeded.toLocaleString()} pts to next level
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${tier.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${tier.name === 'Bronze' ? 'bg-amber-500' : tier.name === 'Silver' ? 'bg-slate-300' : 'bg-[#f0d49d]'}`}
              />
            </div>
          </div>
          
          {/* Subtle decoration overlay */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white opacity-[0.03] rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-black opacity-[0.05] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </motion.div>
      </RevealLayout>

      {/* Notification Panel */}
      {notificationsOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setNotificationsOpen(false)}
          />
          {/* Panel */}
          <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-card border-b border-border shadow-2xl rounded-b-[32px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-14 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground font-medium">{notifications.length} updates</p>
              </div>
              <button 
                onClick={() => setNotificationsOpen(false)}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <span className="material-icons-round text-foreground text-lg">close</span>
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto py-3">
              {notifsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <span className="material-icons-round text-primary animate-spin text-3xl">sync</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="material-icons-round text-4xl text-muted-foreground/30">notifications_off</span>
                  <p className="text-muted-foreground font-medium mt-3 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div key={n.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${i === 0 ? 'bg-primary/5' : ''}`}>
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${n.iconBg}`}>
                      <span className={`material-icons-round text-lg ${n.iconColor}`}>{n.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground leading-snug">{n.title}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-semibold shrink-0 mt-0.5">{n.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <div className="px-6 py-4 pb-28 flex flex-col gap-6">

        {/* Global Search Bar */}
        <RevealLayout delay={0.05}>
          <div className="flex items-center h-14 bg-card text-card-foreground rounded-2xl shadow-sm border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden transition-all px-4 group">
            <span className="material-icons-round text-muted-foreground group-focus-within:text-primary transition-colors me-2">search</span>
            <input 
              type="text" 
              placeholder="Search events, organizations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted transition-colors">
                <span className="material-icons-round text-[14px]">close</span>
              </button>
            )}
          </div>
        </RevealLayout>

        {/* Urgent Banner (only if data exists and no search query active) */}
        {!searchQuery && urgentOpps.length > 0 && (
          <RevealLayout delay={0.1}>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <span className="material-icons-round text-red-500 text-lg">warning_amber</span>
                Urgent Needs
              </h3>
              <button className="text-xs font-bold text-primary hover:underline">See All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
              {urgentOpps.map((opp, idx) => (
                <div 
                  key={opp.id}
                  className="min-w-[280px] snap-center cursor-pointer"
                  onClick={() => navigate(`/event/${opp.id}`)}
                >
                  <ImpactCard
                    title={opp.title}
                    location={opp.location}
                    category={opp.category}
                    points={opp.points}
                    imageUrl={opp.image_url || `https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&q=80&w=600`}
                    delay={0.1 * idx}
                  />
                </div>
              ))}
            </div>
          </RevealLayout>
        )}

        {/* Category Filter */}
        <RevealLayout delay={0.2}>
          <h3 className="text-xl font-extrabold text-foreground mb-3">Discover</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-primary text-primary-foreground shadow-lift'
                    : 'bg-card text-muted-foreground border border-border hover:bg-secondary/10'
                }`}
              >
                <span className="material-icons-round text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </RevealLayout>

        {/* Opportunities Feed */}
        <RevealLayout delay={0.3} className="flex flex-col gap-4">
          {feedLoading ? (
            Array.from({ length: 3 }).map((_, i) => <OpportunityCardSkeleton key={i} />)
          ) : displayFeed.length > 0 ? (
            displayFeed.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/event/${opp.id}`)}
                className="cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 flex gap-4 p-4 hover:shadow-md transition-shadow active:scale-[0.99]"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                  {opp.image_url ? (
                    <img src={opp.image_url} alt={opp.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="material-icons-round text-3xl">volunteer_activism</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {opp.is_urgent && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-sm mb-1 inline-block">Urgent</span>
                      )}
                      <h4 className="font-extrabold text-foreground text-sm leading-snug">{opp.title}</h4>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                        <span className="material-icons-round text-xs">location_on</span>
                        {opp.location || 'Bahrain'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-primary font-black text-sm">+{opp.points}</span>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">pts</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {opp.org_name && <span>{opp.org_name}</span>}
                    {opp.time_range && <span>·  {opp.time_range}</span>}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon="search_off"
              title="No opportunities found"
              subtitle="Try a different category or check back later."
            />
          )}
        </RevealLayout>

      </div>
    </div>
  )
}
