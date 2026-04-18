import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import SubPageHeader from '@/components/layout/SubPageHeader'
import { usePoints } from '@/contexts/PointsProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { supabase } from '@/lib/supabaseClient'

export default function RewardRedemptionFlow() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { points, deductPoints } = usePoints()
  const { t } = useLanguage()

  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState(null)

  useEffect(() => {
    fetchDeal()
  }, [id])

  const fetchDeal = async () => {
    const { data, error } = await supabase
      .from('deals')
      .select('id, title, brand_name, description, points_cost, category, image_url, terms, expires_at')
      .eq('id', id)
      .single()

    if (!error && data) setDeal(data)
    setLoading(false)
  }

  const handleRedeem = async () => {
    if (!deal || points < deal.points_cost) return
    setRedeeming(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { navigate('/signin'); return }

    // Generate a unique code
    const code = `TAW-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    const { error } = await supabase
      .from('redemptions')
      .insert({
        user_id: session.user.id,
        deal_id: deal.id,
        points_spent: deal.points_cost,
        points_used: deal.points_cost,
        code,
        expires_at: expiresAt,
        status: 'completed',
      })

    if (!error) {
      await deductPoints(deal.points_cost)
      setRedemptionCode(code)
    }
    setRedeeming(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <SubPageHeader title="Loading..." />
        <div className="px-6 pt-8 space-y-4">
          <div className="h-48 bg-muted rounded-3xl animate-pulse" />
          <div className="h-14 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 text-center">
        <span className="material-icons-round text-5xl text-muted-foreground/30">card_giftcard</span>
        <p className="text-muted-foreground font-medium mt-4">This reward is no longer available.</p>
        <button onClick={() => navigate('/rewards')} className="mt-6 text-primary font-bold">{t('back_to_rewards')}</button>
      </div>
    )
  }

  const canAfford = points >= deal.points_cost

  // Success state — show redemption code
  if (redemptionCode) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <SubPageHeader title={t('redemption_code')} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <span className="material-icons-round text-primary text-4xl">check_circle</span>
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-foreground mb-2">{t('enjoy_reward')}</h2>
            <p className="text-muted-foreground font-medium text-sm">{t('show_code').replace('{brand}', deal.brand_name)}</p>
          </div>
          <div className="w-full bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{deal.brand_name} · {t('redemption_code')}</p>
            <p className="text-3xl font-black text-foreground tracking-[0.15em] relative select-all">{redemptionCode}</p>
            <p className="text-xs text-muted-foreground mt-3">{t('valid_days')}</p>
          </div>
          <button
            onClick={() => navigate('/rewards')}
            className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-base shadow-lift"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SubPageHeader title={t('redeem_reward')} />

      <div className="flex-1 px-6 pt-8 pb-24 flex flex-col items-center gap-6">
        <RevealLayout className="w-full bg-card rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-border">
          {/* Brand visual */}
          <div className="h-48 bg-muted flex items-center justify-center relative overflow-hidden">
            {deal.image_url ? (
              <img src={deal.image_url} alt={deal.brand_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-muted-foreground/20 uppercase tracking-widest">{deal.brand_name}</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="p-6 relative">
            <div className="absolute -top-10 end-6 w-20 h-20 bg-card rounded-full flex flex-col items-center justify-center border-2 border-border shadow-md">
              <span className="text-lg font-black text-primary">{deal.points_cost.toLocaleString()}</span>
              <span className="text-[8px] font-bold uppercase text-primary tracking-widest">PTS</span>
            </div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 mt-2">{deal.brand_name}</p>
            <h2 className="text-2xl font-extrabold text-foreground leading-tight mb-2">{deal.title}</h2>
            {deal.description && (
              <p className="text-sm font-medium text-muted-foreground">{deal.description}</p>
            )}
          </div>

          <div className="border-t-2 border-dashed border-border p-6 bg-secondary/5 space-y-3">
            <button
              className={`w-full h-14 rounded-xl font-bold tracking-wide text-sm transition-all ${
                canAfford && !redeeming
                  ? 'bg-primary text-primary-foreground shadow-lift hover:opacity-90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={handleRedeem}
              disabled={!canAfford || redeeming}
            >
              {redeeming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-icons-round animate-spin text-sm">sync</span> {t('processing')}
                </span>
              ) : canAfford ? (
                t('redeem_for').replace('{pts}', deal.points_cost.toLocaleString())
              ) : (
                t('need_more_points').replace('{pts}', (deal.points_cost - points).toLocaleString())
              )}
            </button>
            <p className="text-xs font-bold text-muted-foreground text-center">
              {t('your_balance')} <span className="text-foreground">{points.toLocaleString()} pts</span>
            </p>
          </div>
        </RevealLayout>
      </div>
    </div>
  )
}

