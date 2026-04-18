import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fireTierUpConfetti } from '@/lib/confetti'

const PointsContext = createContext()

export const usePoints = () => useContext(PointsContext)

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const prevTierRef = useRef(null)

  const getTierName = (pts) => {
    if (pts >= 3000) return 'Platinum'
    if (pts >= 1500) return 'Gold'
    if (pts >= 500) return 'Silver'
    return 'Bronze'
  }

  useEffect(() => {
    let realtimeChannel = null

    const setupUser = async (userId) => {
      // Initial fetch
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single()
      if (!error && data) {
        const initialPoints = data.points ?? 0
        setPoints(initialPoints)
        prevTierRef.current = getTierName(initialPoints)
      }
      setLoading(false)

      // Real-time subscription for live points updates
      realtimeChannel = supabase
        .channel(`profile-points-${userId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        }, (payload) => {
          if (payload.new?.points !== undefined) {
            const newPoints = payload.new.points
            const newTier = getTierName(newPoints)
            if (prevTierRef.current && newTier !== prevTierRef.current) {
              fireTierUpConfetti()
            }
            prevTierRef.current = newTier
            setPoints(newPoints)
          }
        })
        .subscribe()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setupUser(session.user.id)
      } else {
        setPoints(0)
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

  const addPoints = (amount) => setPoints((prev) => prev + amount)

  const deductPoints = async (amount) => {
    if (points < amount) return false
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false

    // Optimistic update
    setPoints((prev) => prev - amount)

    const { error } = await supabase
      .from('profiles')
      .update({ points: points - amount })
      .eq('id', session.user.id)

    if (error) {
      // Rollback on failure
      setPoints((prev) => prev + amount)
      return false
    }
    return true
  }

  const getTierInfo = () => {
    if (points >= 3000) {
      return { 
        name: 'Platinum', 
        icon: 'diamond', 
        color: 'text-slate-200', 
        bg: 'bg-slate-200 text-slate-800',
        progress: 100, 
        nextTier: 'Max Tier',
        ptsNeeded: 0
      }
    }
    if (points >= 1500) {
      const needed = 3000 - points;
      const progress = ((points - 1500) / 1500) * 100;
      return { 
        name: 'Gold', 
        icon: 'stars', 
        color: 'text-amber-300', 
        bg: 'bg-[#f0d49d] text-amber-900',
        progress, 
        nextTier: 'Platinum',
        ptsNeeded: needed
      }
    }
    if (points >= 500) {
      const needed = 1500 - points;
      const progress = ((points - 500) / 1000) * 100;
      return { 
        name: 'Silver', 
        icon: 'stars', 
        color: 'text-slate-300', 
        bg: 'bg-slate-300 text-slate-800',
        progress, 
        nextTier: 'Gold',
        ptsNeeded: needed
      }
    }
    
    // Beginner / Bronze (< 500)
    const needed = 500 - points;
    const progress = (points / 500) * 100;
    return { 
      name: 'Bronze',  
      icon: 'stars', 
      color: 'text-amber-700', 
      bg: 'bg-amber-600/30 text-amber-100',
      progress, 
      nextTier: 'Silver',
      ptsNeeded: needed
    }
  }

  return (
    <PointsContext.Provider value={{ points, loading, addPoints, deductPoints, getTierInfo }}>
      {children}
    </PointsContext.Provider>
  )
}
