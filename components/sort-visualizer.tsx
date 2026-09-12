'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SortStep, SortBar, AlgorithmMeta } from '@/lib/types'
import { getSortGenerator } from '@/lib/sort-generators'
import { PlaybackControls } from './playback-controls'
import { ComplexityPanel } from './complexity-panel'
import { cn } from '@/lib/utils'

interface SortVisualizerProps {
  meta: AlgorithmMeta
}

const BAR_COLORS: Record<SortBar['state'], string> = {
  default: 'bg-surface-2 border-border/50',
  comparing: 'bg-warn/70 border-warn',
  swapping: 'bg-danger/70 border-danger',
  sorted: 'bg-neon/70 border-neon',
  pivot: 'bg-compare/70 border-compare',
  found: 'bg-neon border-neon',
}

const BAR_SHADOW: Record<SortBar['state'], string> = {
  default: '',
  comparing: 'shadow-[0_0_8px_rgba(234,179,8,0.4)]',
  swapping: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
  sorted: 'shadow-[0_0_6px_rgba(34,197,94,0.3)]',
  pivot: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]',
  found: 'shadow-[0_0_10px_rgba(34,197,94,0.6)]',
}

// Deterministic initial data for server-side rendering
function generateDeterministicArray(size: number = 30): number[] {
  // Use a simple deterministic pattern instead of Math.random()
  // This ensures server and client render the same initial state
  return Array.from({ length: size }, (_, i) => ((i * 37 + 13) % 90) + 10)
}

function generateRandomArray(size: number = 30): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

const STEP_MS: Record<number, number> = {
  0.25: 800,
  0.5: 400,
  1: 200,
  1.5: 130,
  2: 100,
  4: 30,
}

export function SortVisualizer({ meta }: SortVisualizerProps) {
  const [arraySize, setArraySize] = useState(32)
  // Initialize with deterministic data to avoid hydration mismatch
  const [rawData, setRawData] = useState<number[]>(() => 
    generateDeterministicArray(32)
  )
  const [steps, setSteps] = useState<SortStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Generate random data only after mount (client-side only)
  useEffect(() => {
    setIsMounted(true)
    setRawData(generateRandomArray(32))
  }, [])

  // Build all steps upfront whenever algo or data changes
  useEffect(() => {
    const gen = getSortGenerator(meta.id, [...rawData])
    const allSteps: SortStep[] = []
    for (const step of gen) allSteps.push(step)
    setSteps(allSteps)
    setStepIndex(0)
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [meta.id, rawData])

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, STEP_MS[speed] ?? 200)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])

  const currentStep = steps[stepIndex]
  const bars = currentStep?.bars ?? rawData.map((v, i) => ({ value: v, state: 'default' as const, id: i }))

  const handleShuffle = useCallback(() => {
    setRawData(generateRandomArray(arraySize))
  }, [arraySize])

  const handleReset = useCallback(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [])

  const handleSizeChange = (size: number) => {
    setArraySize(size)
    // Only generate random data if mounted, otherwise use deterministic
    setRawData(isMounted ? generateRandomArray(size) : generateDeterministicArray(size))
  }

  const maxVal = Math.max(...bars.map((b) => b.value), 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Array size control */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>Array Size:</span>
        {[16, 24, 32, 48, 64].map((size) => (
          <button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={cn(
              'px-2 py-0.5 rounded border text-[11px] transition-all',
              arraySize === size
                ? 'border-neon/40 bg-neon/15 text-neon'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {size}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-warn/70 border border-warn inline-block" />
            Comparing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-danger/70 border border-danger inline-block" />
            Swapping
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-compare/70 border border-compare inline-block" />
            Pivot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-neon/70 border border-neon inline-block" />
            Sorted
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col" style={{ height: 280 }}>
        <div className="flex-1 flex items-end gap-0.5 min-h-0">
          {bars.map((bar, i) => (
            <div
              key={bar.id}
              className={cn(
                'flex-1 rounded-t border transition-all duration-100',
                BAR_COLORS[bar.state],
                BAR_SHADOW[bar.state]
              )}
              style={{ height: `${(bar.value / maxVal) * 100}%`, minHeight: '4px' }}
              title={`${bar.value}`}
            />
          ))}
        </div>
      </div>

      {/* Step description */}
      <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-2 min-h-[2.5rem]">
        <div className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
        <span className="text-sm text-foreground font-mono">
          {currentStep?.description ?? 'Press play to start visualization'}
        </span>
      </div>

      {/* Playback */}
      <PlaybackControls
        isPlaying={isPlaying}
        isFinished={stepIndex >= steps.length - 1}
        canStepBack={stepIndex > 0}
        canStepForward={stepIndex < steps.length - 1}
        speed={speed}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepBack={() => { setIsPlaying(false); setStepIndex((p) => Math.max(0, p - 1)) }}
        onStepForward={() => { setIsPlaying(false); setStepIndex((p) => Math.min(steps.length - 1, p + 1)) }}
        onReset={handleReset}
        onShuffle={handleShuffle}
        onSpeedChange={setSpeed}
      />

      {/* Complexity */}
      <ComplexityPanel meta={meta} />
    </div>
  )
}