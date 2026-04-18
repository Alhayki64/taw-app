import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

async function fetchDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select('id, title, brand_name, description, points_cost, category, image_url, status, expires_at, total_redeemed, max_redemptions, min_tier')
    .eq('status', 'active')
    .order('points_cost', { ascending: true })
  if (error) throw error
  return data
}

export function useDeals() {
  const { data: deals = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
  })
  return { deals, loading, error, refetch }
}
