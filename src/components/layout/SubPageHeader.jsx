import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'

export default function SubPageHeader({ title, ActionIcon, onActionClick }) {
  const navigate = useNavigate()

  return (
    <RevealLayout className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary/10 transition-colors"
        >
          <span className="material-icons-round text-foreground">arrow_back</span>
        </button>
        
        {/* Title */}
        <h1 className="text-xl font-bold text-foreground absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>

        {/* Action Icon (Optional) */}
        {ActionIcon ? (
          <button 
            onClick={onActionClick}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary/10 transition-colors"
          >
            <span className="material-icons-round text-foreground">{ActionIcon}</span>
          </button>
        ) : (
          <div className="w-10" /> /* Spacer */
        )}
      </div>
    </RevealLayout>
  )
}
