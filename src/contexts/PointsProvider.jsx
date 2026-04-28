import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fireTierUpConfetti } from '@/lib/confetti'

const PointsContext = createContext()

export const usePoints = () => useContext(PointsContext)

export const PointsProvider = ({ children }) => {
  const [points, setPoints]                   = useState(0)
  const [lifetimePoints, setLifetimePoints]   = useState(0)
  const [loading, setLoading]                 = useState(true)
  const prevTierRef                           = useRef(null)

  // Tier thresholds aligned with the DB `tiers` table (min_lifetime_points)
  const getTierName = (pts) => {
    if (pts >= 4000) return 'Platinum'
    if (pts >= 1500) return 'Gold'
    if (pts >= 500)  return 'Silver'
    return 'Bronze'
  }

  useEffect(() => {
    let realtimeChannel = null

    const setupUser = async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('points, lifetime_points')
        .eq('id', userId)
        .single()

      if (!error && data) {
        const initPoints   = data.points          ?? 0
        const initLifetime = data.lifetime_points ?? 0
        setPoints(initPoints)
        setLifetimePoints(initLifetime)
        prevTierRef.current = getTierName(initLifetime)
      }
      setLoading(false)

      realtimeChannel = supabase
        .channel(`profile-points-${userId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        }, (payload) => {
          if (payload.new?.points !== undefined) {
            setPoints(payload.new.points)
          }
          if (payload.new?.lifetime_points !== undefined) {
            const newLifetime = payload.new.lifetime_points
            const newTier     = getTierName(newLifetime)
            if (prevTierRef.current && newTier !== prevTierRef.current) {
              fireTierUpConfetti()
            }
            prevTierRef.current = newTier
            setLifetimePoints(newLifetime)
          }
        })
        .subscribe()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setupUser(session.user.id)
      } else {
        setPoints(0)
        setLifetimePoints(0)
        setLoading(false)
        if (realtimeChannel) supabase.removeChannel(realtimeChannel)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setupUser(session.user.id)
      else setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      if (realtimeChannel) supabase.removeChannel(realtimeChannel)
    }
  }, [])

  // Earning points: increments BOTH spendable balance and lifetime total
  const addPoints = async (amount) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    await supabase
      .from('profiles')
      .update({
        points:          points + amount,
        lifetime_points: lifetimePoints + amount,
      })
      .eq('id', session.user.id)
    // Real-time subscription handles state + tier-up animation
  }

  // Spending points: decrements spendable balance only — lifetime total never changes
  const deductPoints = async (amount) => {
    if (points < amount) return false
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false

    setPoints((prev) => prev - amount)

    const { error } = await supabase
      .from('profiles')
      .update({ points: points - amount })
      .eq('id', session.user.id)

    if (error) {
      setPoints((prev) => prev + amount)
      return false
    }
    return true
  }

  // Tier is calculated from lifetime_points so spending never demotes a user
  const getTierInfo = () => {
    if (lifetimePoints >= 4000) {
      return {
        name: 'Platinum',
        icon: 'diamond',
        color: 'text-slate-200',
        bg: 'bg-slate-200 text-slate-800',
        progress: 100,
        nextTier: 'Max Tier',
        ptsNeeded: 0,
      }
    }
    if (lifetimePoints >= 1500) {
      return {
        name: 'Gold',
        icon: 'stars',
        color: 'text-amber-300',
        bg: 'bg-[#f0d49d] text-amber-900',
        progress: ((lifetimePoints - 1500) / 2500) * 100,
        nextTier: 'Platinum',
        ptsNeeded: 4000 - lifetimePoints,
      }
    }
    if (lifetimePoints >= 500) {
      return {
        name: 'Silver',
        icon: 'stars',
        color: 'text-slate-300',
        bg: 'bg-slate-300 text-slate-800',
        progress: ((lifetimePoints - 500) / 1000) * 100,
        nextTier: 'Gold',
        ptsNeeded: 1500 - lifetimePoints,
      }
    }
    return {
      name: 'Bronze',
      icon: 'stars',
      color: 'text-amber-700',
      bg: 'bg-amber-600/30 text-amber-100',
      progress: (lifetimePoints / 500) * 100,
      nextTier: 'Silver',
      ptsNeeded: 500 - lifetimePoints,
    }
  }

  return (
    <PointsContext.Provider value={{ points, lifetimePoints, loading, addPoints, deductPoints, getTierInfo }}>
      {children}
    </PointsContext.Provider>
  )
}
