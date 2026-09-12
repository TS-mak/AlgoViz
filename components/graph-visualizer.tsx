'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GraphNode, GraphEdge, GraphStep, AlgorithmMeta } from '@/lib/types'
import { createDefaultGraph, getGraphGenerator } from '@/lib/graph-generators'
import { PlaybackControls } from './playback-controls'
import { ComplexityPanel } from './complexity-panel'
import { cn } from '@/lib/utils'

interface GraphVisualizerProps {
  meta: AlgorithmMeta
}

const NODE_COLORS: Record<GraphNode['state'], string> = {
  default: '#1e2130',
  visited: '#166534',
  current: '#b45309',
  path: '#1d4ed8',
  start: '#15803d',
  end: '#b91c1c',
}

const NODE_BORDERS: Record<GraphNode['state'], string> = {
  default: '#334155',
  visited: '#22c55e',
  current: '#f59e0b',
  path: '#3b82f6',
  start: '#4ade80',
  end: '#f87171',
}

const EDGE_COLORS: Record<GraphEdge['state'], string> = {
  default: '#334155',
  traversed: '#22c55e',
  path: '#3b82f6',
}

const STEP_MS: Record<number, number> = {
  0.25: 1200,
  0.5: 600,
  1: 300,
  1.5: 200,
  2: 150,
  4: 60,
}

export function GraphVisualizer({ meta }: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [{ nodes: initNodes, edges: initEdges }] = useState(createDefaultGraph)
  const [startNode, setStartNode] = useState('A')
  const [steps, setSteps] = useState<GraphStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const gen = getGraphGenerator(meta.id, startNode, initNodes, initEdges)
    const allSteps: GraphStep[] = []
    for (const step of gen) allSteps.push(step)
    setSteps(allSteps)
    setStepIndex(0)
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [meta.id, startNode, initNodes, initEdges])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying) return
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev }
        return prev + 1
      })
    }, STEP_MS[speed] ?? 300)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])

  const currentStep = steps[stepIndex]
  const nodes = currentStep?.nodes ?? initNodes
  const edges = currentStep?.edges ?? initEdges

  const handleReset = useCallback(() => { setStepIndex(0); setIsPlaying(false) }, [])

  const getNode = (id: string) => nodes.find((n) => n.id === id)

  return (
    <div className="flex flex-col gap-4">
      {/* Start node selector */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
        <span>Start Node:</span>
        {initNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => setStartNode(n.id)}
            className={cn(
              'px-2.5 py-0.5 rounded border text-[11px] font-mono transition-all',
              startNode === n.id
                ? 'border-neon/40 bg-neon/15 text-neon'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {n.id}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#15803d] border-2 border-[#4ade80] inline-block" />
            Start/Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#b45309] border-2 border-[#f59e0b] inline-block" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1e2130] border-2 border-[#334155] inline-block" />
            Unvisited
          </span>
        </div>
      </div>

      {/* Graph SVG */}
      <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ height: 380 }}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = getNode(edge.from)
            const to = getNode(edge.to)
            if (!from || !to) return null
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            const color = EDGE_COLORS[edge.state]
            const isActive = edge.state !== 'default'
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeOpacity={isActive ? 1 : 0.5}
                />
                {meta.id === 'dijkstra' && edge.weight && (
                  <text
                    x={mx} y={my - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isActive ? '#22c55e' : '#64748b'}
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const bg = NODE_COLORS[node.state]
            const border = NODE_BORDERS[node.state]
            const isActive = node.state !== 'default'
            return (
              <g key={node.id}>
                {isActive && (
                  <circle
                    cx={node.x} cy={node.y} r={24}
                    fill={border}
                    fillOpacity={0.1}
                  />
                )}
                <circle
                  cx={node.x} cy={node.y} r={18}
                  fill={bg}
                  stroke={border}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <text
                  x={node.x} y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill={isActive ? '#fff' : '#94a3b8'}
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                {node.distance !== undefined && node.distance !== Infinity && meta.id === 'dijkstra' && (
                  <text
                    x={node.x} y={node.y + 30}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#22c55e"
                    fontFamily="monospace"
                  >
                    d={node.distance}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Queue / Stack display */}
      {currentStep?.queue && currentStep.queue.length > 0 && (
        <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground shrink-0">
            {meta.id === 'bfs' ? 'Queue:' : meta.id === 'dfs' ? 'Stack:' : 'Unvisited:'}
          </span>
          <div className="flex gap-1 flex-wrap">
            {currentStep.queue.map((nodeId, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-neon/15 border border-neon/30 text-neon text-[11px] font-mono"
              >
                {nodeId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-2 min-h-[2.5rem]">
        <div className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
        <span className="text-sm text-foreground font-mono">
          {currentStep?.description ?? 'Select a start node and press play'}
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
        onShuffle={() => setStartNode(initNodes[Math.floor(Math.random() * initNodes.length)].id)}
        onSpeedChange={setSpeed}
      />

      {/* Complexity */}
      <ComplexityPanel meta={meta} />
    </div>
  )
}
