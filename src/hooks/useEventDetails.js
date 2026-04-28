import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

async function fetchEvent(id) {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*, organisations(name, logo_url)')
    .eq('id', id)
    .single()
  if (error) throw error
  if (!data) return null
  return {
    ...data,
    category: data.cause_category,
    points:   data.points_per_session,
    date:     data.event_date,
    org_name: data.organisations?.name,
    org_logo: data.organisations?.logo_url,
  }
}

export function useEventDetails(id) {
  const { data: event, isLoading: loading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  })

  const [isSignedUp, setIsSignedUp] = useState(false)

  useEffect(() => {
    if (!id) return
    const checkSignup = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data } = await supabase
        .from('opportunity_signups')
        .select('id')
        .eq('opportunity_id', id)
        .eq('user_id', session.user.id)
        .single()
      if (data) setIsSignedUp(true)
    }
    checkSignup()
  }, [id])

  return { event, loading, error, isSignedUp, setIsSignedUp }
}
