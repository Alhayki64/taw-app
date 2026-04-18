import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealLayout } from '@/components/RevealLayout'
import { usePoints } from '@/contexts/PointsProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { supabase } from '@/lib/supabaseClient'

export default function MarketplaceScreen() {
  const navigate = useNavigate()
  const { points } = usePoints()
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('All')
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  // High-res global brands for premium mockup visuals
  const merchantsList = [
    { name: "McDonald's", domain: 'mcdonalds.com', color: 'text-red-600' },
    { name: 'Starbucks', domain: 'starbucks.com', color: 'text-emerald-700' },
    { name: 'Costa Coffee', domain: 'costacoffee.com', color: 'text-amber-800' },
    { name: 'Shake Shack', domain: 'shakeshack.com', color: 'text-green-600' },
    { name: 'Burger King', domain: 'burgerking.com', color: 'text-orange-500' },
    { name: 'KFC', domain: 'kfc.com', color: 'text-red-700' },
    { name: "Papa John's", domain: 'papajohns.com', color: 'text-red-800' },
    { name: "Nando's", domain: 'nandos.com', color: 'text-stone-800' },
    { name: 'Caribou Coffee', domain: 'cariboucoffee.com', color: 'text-blue-700' },
  ]

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('deals')
      .select('id, title, brand_name, description, points_cost, category, image_url, status, expires_at, total_redeemed, max_redemptions, min_tier')
      .eq('status', 'active')
      .order('points_cost', { ascending: true })

    if (!error && data) setDeals(data)
    setLoading(false)
  }

  // Build filter chips dynamically from the fetched categories
  const uniqueCategories = ['All', ...new Set(deals.map(d => d.category).filter(Boolean))]

  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'All') return true;
    if (uniqueCategories.includes(activeFilter)) return deal.category === activeFilter;
    // Otherwise filter by brand name
    return deal.brand_name === activeFilter;
  })

  const canAfford = (cost) => points >= cost

  return (
    <div className="flex flex-col min-h-screen bg-secondary/5 px-6 pt-12 pb-24">
      {/* Header */}
      <RevealLayout className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">{t('rewards_title')}</h1>
          <p className="text-muted-foreground font-medium text-sm">{t('rewards_subtitle')}</p>
        </div>
        <div className="bg-card text-card-foreground px-3 py-2 rounded-xl shadow-sm border border-border flex flex-col items-center justify-center min-w-[56px]">
          <span className="text-primary font-black text-lg leading-none">{points}</span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">PTS</span>
        </div>
      </RevealLayout>

      {/* Filter Chips */}
      <RevealLayout delay={0.1} className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {uniqueCategories.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 snap-center ${
              activeFilter === f
                ? 'bg-primary text-primary-foreground shadow-lift scale-105'
                : 'bg-card text-muted-foreground border border-border hover:bg-secondary/10'
            }`}
          >
            {f === 'All' ? t('nav_home') : f}
          </button>
        ))}
        {/* Dynamic chip if a brand is selected */}
        {!uniqueCategories.includes(activeFilter) && (
          <button
            onClick={() => setActiveFilter('All')}
            className="whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 snap-center bg-primary text-primary-foreground shadow-lift scale-105 flex items-center gap-1"
          >
            <span>{activeFilter}</span>
            <span className="material-icons-round text-[16px] leading-none ms-1">close</span>
          </button>
        )}
      </RevealLayout>

      {/* Deal Grid */}
      <div className="flex flex-col gap-5 mt-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full h-36 bg-muted rounded-2xl animate-pulse" />
          ))
        ) : filteredDeals.length > 0 ? (
          filteredDeals.map((deal, i) => {
            const affordable = canAfford(deal.points_cost)
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/rewards/${deal.id}`)}
                className={`cursor-pointer bg-card rounded-3xl overflow-hidden border shadow-soft transition-all active:scale-[0.99] hover:shadow-lift ${
                  affordable ? 'border-border/50' : 'border-border/30 opacity-75'
                }`}
              >
                {/* Brand image / fallback (Vertical layout instead of horizontal) */}
                <div className="w-full h-40 bg-muted relative flex items-center justify-center overflow-hidden">
                  {deal.image_url ? (
                    <img src={deal.image_url} alt={deal.brand_name} className="w-full h-full object-cover origin-center transition-transform duration-500 hover:scale-105" />
                  ) : (
                    <span className="text-4xl font-black text-muted-foreground/20 uppercase tracking-widest">
                      {deal.brand_name?.[0] || '?'}
                    </span>
                  )}
                  {deal.category && (
                    <div className="absolute top-3 end-3 bg-background/90 text-foreground backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {deal.category === 'All' ? t('nav_home') : deal.category}
                    </div>
                  )}
                  {/* Gradient Overlay for polished transition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{deal.brand_name}</p>
                  <h4 className="font-extrabold text-foreground text-lg leading-tight">{deal.title}</h4>
                  {deal.description && (
                    <p className="text-sm font-medium text-muted-foreground mt-1.5 line-clamp-2">{deal.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-border/60">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                      <span className="material-icons-round text-amber-500 text-sm">stars</span>
                    </div>
                    <span className={`font-black text-lg ${affordable ? 'text-primary' : 'text-muted-foreground'}`}>
                      {deal.points_cost.toLocaleString()} <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">pts</span>
                    </span>
                  </div>
                </div>

                {!affordable && (
                  <div className="border-t border-border/30 px-5 py-3 bg-muted/40 flex items-center gap-2.5">
                    <span className="material-icons-round text-sm text-muted-foreground/70">lock</span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {t('need_more_points').replace('{pts}', (deal.points_cost - points).toLocaleString())}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })
        ) : (
          <div className="text-center py-20">
            <span className="material-icons-round text-5xl text-muted-foreground/20">card_giftcard</span>
            <p className="text-muted-foreground font-medium mt-3">{t('no_rewards')}</p>
          </div>
        )}
      </div>

      {/* All Merchants Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-extrabold text-foreground mb-4">{t('all_merchants')}</h2>
        <div className="grid grid-cols-3 gap-3">
          {merchantsList.map((merchant, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + (idx * 0.05) }}
              onClick={() => {
                setActiveFilter(merchant.name);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative aspect-square bg-card rounded-2xl border shadow-soft flex items-center justify-center p-3 text-center cursor-pointer hover:shadow-md transition-all active:scale-95 overflow-hidden group ${activeFilter === merchant.name ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
            >
              {/* Fallback Text (behind image) */}
              <span className={`absolute inset-0 flex items-center justify-center p-2 font-black text-[10px] uppercase tracking-tight leading-tight transition-opacity ${merchant.color}`}>
                {merchant.name}
              </span>
              
              {/* Brand Logo Placeholder (Using Google Favicons as it bypasses adblockers better) */}
              <img 
                src={`https://www.google.com/s2/favicons?domain=${merchant.domain}&sz=128`} 
                alt={merchant.name}
                className="relative z-10 w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                onLoad={(e) => {
                  // Hide the fallback text if image loads perfectly
                  if (e.target.previousSibling) e.target.previousSibling.style.opacity = '0';
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
