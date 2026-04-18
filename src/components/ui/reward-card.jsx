import React from 'react'
import { Card } from './card'
import { RevealLayout } from '../RevealLayout'

export function RewardCard({ brand, title, description, pointsCost, imageUrl, delay = 0, isDailySpecial = false, onClick }) {
  return (
    <RevealLayout delay={delay}>
      <Card className="overflow-hidden cursor-pointer group flex flex-col h-full border-transparent hover:border-primary/20" onClick={onClick}>
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isDailySpecial && (
            <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-sm">
              <span className="material-icons-round text-[14px]">local_fire_department</span>
              DAILY SPECIAL
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="font-bold text-foreground text-lg leading-tight mb-2 line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground font-medium line-clamp-2 mb-4 flex-1">{description}</p>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <div className="flex flex-col">
              <span className="text-xl font-black text-primary leading-none">{pointsCost}</span>
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Taw Points</span>
            </div>
            <button className="bg-secondary/10 text-secondary-foreground font-bold text-xs px-4 py-2 rounded-full hover:bg-secondary/20 transition-colors">
              REDEEM
            </button>
          </div>
        </div>
      </Card>
    </RevealLayout>
  )
}
