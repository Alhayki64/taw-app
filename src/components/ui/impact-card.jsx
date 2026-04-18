import React from 'react'
import { Card } from './card'
import { RevealLayout } from '../RevealLayout'

export function ImpactCard({ title, location, category, points, imageUrl, delay = 0, onClick }) {
  return (
    <RevealLayout delay={delay}>
      <Card className="overflow-hidden cursor-pointer group border-transparent hover:border-primary/20" onClick={onClick}>
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="material-icons-round text-[14px] text-green-600">stars</span>
            <span className="text-xs font-bold text-foreground">+{points} pts</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/80 backdrop-blur-md px-2 py-0.5 rounded-sm">
                {category}
              </span>
              <span className="text-xs font-medium flex items-center gap-0.5 opacity-90">
                <span className="material-icons-round text-[12px]">place</span>
                {location}
              </span>
            </div>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 shadow-sm">{title}</h3>
          </div>
        </div>
      </Card>
    </RevealLayout>
  )
}
