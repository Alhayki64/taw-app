import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-2xl bg-muted', className)} />
}

export function OpportunityCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border/50">
      <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function DealCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <Skeleton className="w-full h-32 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-1/2 mt-2" />
      </div>
    </div>
  )
}

export function EventDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Skeleton className="w-full h-64 rounded-none" />
      <div className="px-6 pt-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}

export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
    </div>
  )
}
