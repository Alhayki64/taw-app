import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Renders the horizontal scrolling or wrapping grid.
export function BentoGrid({ children, className }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 auto-rows-[120px]", className)}>
      {children}
    </div>
  )
}

// Renders an individual bento block.
export function BentoBlock({ title, subtitle, icon, className, colorClass = "bg-primary text-primary-foreground", onClick }) {
  return (
    <motion.div 
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-4 flex flex-col justify-between cursor-pointer shadow-soft hover:shadow-lift transition-shadow",
        colorClass,
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="material-icons-round text-3xl opacity-90">{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-lg leading-tight">{title}</h3>
        {subtitle && <p className="text-xs opacity-80 mt-1 font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
