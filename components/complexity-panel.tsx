'use client'

import { AlgorithmMeta } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ComplexityPanelProps {
  meta: AlgorithmMeta
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('px-2 py-0.5 rounded text-[11px] font-mono border', className)}>
      {children}
    </span>
  )
}

function ComplexityRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn('text-[11px] font-mono', highlight ? 'text-neon' : 'text-foreground')}>
        {value}
      </span>
    </div>
  )
}

export function ComplexityPanel({ meta }: ComplexityPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60">
            Complexity Analysis
          </span>
        </div>
        <h3 className="text-base font-bold text-foreground">{meta.name}</h3>
      </div>

      {/* Description */}
      <p className="text-[12px] text-muted-foreground leading-relaxed">{meta.description}</p>

      {/* Time Complexity */}
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">
          Time Complexity
        </div>
        <div className="bg-background/50 rounded border border-border/50 px-3 py-1 divide-y divide-border/30">
          <ComplexityRow label="Best Case" value={meta.timeComplexity.best} highlight />
          <ComplexityRow label="Average Case" value={meta.timeComplexity.average} />
          <ComplexityRow label="Worst Case" value={meta.timeComplexity.worst} />
        </div>
      </div>

      {/* Space Complexity */}
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">
          Space Complexity
        </div>
        <div className="bg-background/50 rounded border border-border/50 px-3 py-1">
          <ComplexityRow label="Auxiliary Space" value={meta.spaceComplexity} highlight />
        </div>
      </div>

      {/* Properties */}
      {(meta.stable !== undefined || meta.inPlace !== undefined) && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">
            Properties
          </div>
          <div className="flex flex-wrap gap-2">
            {meta.stable !== undefined && (
              <Badge
                className={
                  meta.stable
                    ? 'bg-neon/10 text-neon border-neon/20'
                    : 'bg-danger/10 text-danger border-danger/20'
                }
              >
                {meta.stable ? 'Stable' : 'Unstable'}
              </Badge>
            )}
            {meta.inPlace !== undefined && (
              <Badge
                className={
                  meta.inPlace
                    ? 'bg-neon/10 text-neon border-neon/20'
                    : 'bg-warn/10 text-warn border-warn/20'
                }
              >
                {meta.inPlace ? 'In-Place' : 'Not In-Place'}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
