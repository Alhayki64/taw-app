import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

async function fetchOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id, title, description, category, location, points, image_url, is_urgent, date, org_name, time_range, spots, spots_filled')
    .eq('status', 'active')
    .order('is_urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

export function useOpportunities() {
  const { data: opportunities = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  })
  return { opportunities, loading, error, refetch }
}
