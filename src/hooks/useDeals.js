import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

async function fetchDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select('id, title, category, description, points_cost, image_url, status, expiry_date, redemption_count, usage_limit, businesses(name)')
    .eq('status', 'active')
    .order('points_cost', { ascending: true })
  if (error) throw error
  return (data || []).map(d => ({
    ...d,
    brand_name:      d.businesses?.name,
    expires_at:      d.expiry_date,
    total_redeemed:  d.redemption_count,
    max_redemptions: d.usage_limit,
  }))
}

export function useDeals() {
  const { data: deals = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
  })
  return { deals, loading, error, refetch }
}
