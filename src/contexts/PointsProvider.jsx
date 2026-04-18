import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const PointsContext = createContext()

export const usePoints = () => useContext(PointsContext)

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch points whenever auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchPoints(session.user.id)
      } else {
        setPoints(0)
        setLoading(false)
      }
    })

    // Also fetch on first mount if session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchPoints(session.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchPoints = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setPoints(data.points ?? 0)
    }
    setLoading(false)
  }

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
