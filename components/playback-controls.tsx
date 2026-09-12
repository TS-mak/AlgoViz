'use client'

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  Shuffle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaybackControlsProps {
  isPlaying: boolean
  isFinished: boolean
  canStepBack: boolean
  canStepForward: boolean
  speed: number
  stepIndex: number
  totalSteps: number
  onPlay: () => void
  onPause: () => void
  onStepBack: () => void
  onStepForward: () => void
  onReset: () => void
  onShuffle: () => void
  onSpeedChange: (speed: number) => void
}

const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4]
const SPEED_LABELS: Record<number, string> = {
  0.25: '0.25x',
  0.5: '0.5x',
  1: '1x',
  1.5: '1.5x',
  2: '2x',
  4: '4x',
}

function ControlButton({
  onClick,
  disabled,
  children,
  className,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded border border-border transition-all duration-150',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-accent hover:border-neon/30 active:scale-95',
        className
      )}
    >
      {children}
    </button>
  )
}

export function PlaybackControls({
  isPlaying,
  isFinished,
  canStepBack,
  canStepForward,
  speed,
  stepIndex,
  totalSteps,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onShuffle,
  onSpeedChange,
}: PlaybackControlsProps) {
  const progress = totalSteps > 0 ? (stepIndex / Math.max(totalSteps - 1, 1)) * 100 : 0

  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 space-y-3">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-neon rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Step counter */}
        <div className="text-[11px] text-muted-foreground font-mono">
          Step{' '}
          <span className="text-foreground">{stepIndex + 1}</span>
          {' / '}
          <span className="text-foreground">{Math.max(totalSteps, 1)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <ControlButton onClick={onReset} title="Reset">
            <SkipBack className="w-3.5 h-3.5 text-muted-foreground" />
          </ControlButton>

          <ControlButton onClick={onStepBack} disabled={!canStepBack}>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </ControlButton>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded border transition-all duration-150 active:scale-95',
              isFinished
                ? 'border-muted/30 bg-muted/10 text-muted-foreground'
                : 'border-neon/40 bg-neon/15 text-neon hover:bg-neon/25 hover:border-neon/60'
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          <ControlButton onClick={onStepForward} disabled={!canStepForward}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </ControlButton>

          <ControlButton onClick={() => {}} title="Skip to end" disabled={isFinished}>
            <SkipForward className="w-3.5 h-3.5 text-muted-foreground" />
          </ControlButton>
        </div>

        {/* Speed + Shuffle */}
        <div className="flex items-center gap-2">
          <ControlButton onClick={onShuffle} title="Randomize input">
            <Shuffle className="w-3.5 h-3.5 text-muted-foreground" />
          </ControlButton>

          <div className="flex items-center gap-0.5 bg-background rounded border border-border overflow-hidden">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={cn(
                  'px-2 py-1 text-[10px] font-mono transition-all duration-100',
                  speed === s
                    ? 'bg-neon/20 text-neon'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {SPEED_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
