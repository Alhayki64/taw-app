import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import SubPageHeader from '@/components/layout/SubPageHeader'
import { useAuth } from '@/contexts/AuthProvider'
import { usePoints } from '@/contexts/PointsProvider'
import { supabase } from '@/lib/supabaseClient'

export default function ImpactHistory() {
  const { user } = useAuth()
  const { points } = usePoints()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) fetchSessions(user.id)
  }, [user])

  const fetchSessions = async (userId) => {
    const { data, error } = await supabase
      .from('opportunity_signups')
      .select(`
        id,
        status,
        checked_in,
        checked_in_at,
        created_at,
        opportunities ( title, category, location, image_url, points, hours )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) setSessions(data)
    setLoading(false)
  }

  const statusConfig = {
    confirmed:  { label: 'Confirmed',  icon: 'check_circle',  color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-950'  },
    pending:    { label: 'Applied',    icon: 'hourglass_top', color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950'  },
    checked_in: { label: 'Checked In', icon: 'login',         color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950'   },
    cancelled:  { label: 'Cancelled',  icon: 'cancel',        color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950'    },
  }

  const totalPoints = sessions.reduce((sum, s) => {
    if (s.status === 'confirmed' || s.checked_in) return sum + (s.opportunities?.points || 0)
    return sum
  }, 0)
  const totalHours = sessions.reduce((sum, s) => sum + (parseFloat(s.opportunities?.hours) || 0), 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SubPageHeader title="Impact History" />

      {/* Stats Banner */}
      <RevealLayout className="mx-6 mt-6 mb-4 bg-primary text-primary-foreground rounded-3xl p-5 flex justify-around">
        <div className="text-center">
          <p className="text-3xl font-black">{sessions.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Sessions</p>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <p className="text-3xl font-black">{totalHours.toFixed(1)}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Hours</p>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <p className="text-3xl font-black">{totalPoints.toLocaleString()}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Pts Earned</p>
        </div>
      </RevealLayout>

        {/* Session List */}
      <div className="flex-1 px-6 pb-10 flex flex-col gap-3 mt-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
          ))
        ) : sessions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <span className="material-icons-round text-6xl text-muted-foreground/20 mb-4">volunteer_activism</span>
            <h3 className="font-extrabold text-foreground text-lg mb-1">No sessions yet</h3>
            <p className="text-muted-foreground text-sm font-medium max-w-xs">
              Your volunteer history will appear here once you check in to your first opportunity.
            </p>
          </div>
        ) : (
          sessions.map((session, idx) => {
            const opp = session.opportunities
            const status = statusConfig[session.status] ?? statusConfig.pending
            const date = new Date(session.created_at).toLocaleDateString('en-BH', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-card text-card-foreground rounded-2xl border border-border/50 shadow-sm overflow-hidden flex gap-0"
              >
                {/* Category color bar */}
                <div className={`w-1.5 shrink-0 ${
                  opp?.category === 'Environment' ? 'bg-green-500' :
                  opp?.category === 'Community'   ? 'bg-blue-500'  :
                  opp?.category === 'Education'   ? 'bg-purple-500':
                  'bg-primary'
                }`} />

                <div className="flex-1 flex gap-3 p-4">
                  {/* Image */}
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

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground font-medium">{date}</p>
                      {opp?.hours && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <p className="text-xs text-muted-foreground font-medium">{opp.hours}h</p>
                        </>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full ${status.bg}`}>
                      <span className={`material-icons-round text-[10px] ${status.color}`}>{status.icon}</span>
                      <span className={`text-[10px] font-bold ${status.color}`}>{status.label}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
