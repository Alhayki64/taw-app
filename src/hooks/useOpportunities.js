import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

async function fetchOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id, title, description, cause_category, location, points_per_session, image_url, is_urgent, event_date, time_range, spots, spots_filled, organisations(name, logo_url)')
    .eq('status', 'active')
    .order('is_urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return (data || []).map(o => ({
    ...o,
    category: o.cause_category,
    points:   o.points_per_session,
    date:     o.event_date,
    org_name: o.organisations?.name,
    org_logo: o.organisations?.logo_url,
  }))
}

export function useOpportunities() {
  const { data: opportunities = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  })
  return { opportunities, loading, error, refetch }
}
