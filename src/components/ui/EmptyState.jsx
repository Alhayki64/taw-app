export function EmptyState({ icon = 'inbox', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <span className="material-icons-round text-5xl text-muted-foreground/30 mb-4">{icon}</span>
      <p className="font-bold text-foreground mb-1">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
