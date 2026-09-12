export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'data-structures'
  | 'dynamic-programming'

export type AlgorithmId =
  | 'bubble-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'heap-sort'
  | 'insertion-sort'
  | 'selection-sort'
  | 'binary-search'
  | 'linear-search'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'array-viz'
  | 'linked-list-viz'
  | 'stack-viz'
  | 'queue-viz'
  | 'binary-tree-viz'
  | 'hash-table-viz'

export interface AlgorithmMeta {
  id: AlgorithmId
  name: string
  category: AlgorithmCategory
  timeComplexity: { best: string; average: string; worst: string }
  spaceComplexity: string
  description: string
  stable?: boolean
  inPlace?: boolean
}

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found'

export interface SortBar {
  value: number
  state: BarState
  id: number
}

export interface SortStep {
  bars: SortBar[]
  comparing?: [number, number]
  swapping?: [number, number]
  pivotIndex?: number
  sortedIndices?: number[]
  description: string
}

export interface GraphNode {
  id: string
  x: number
  y: number
  state: 'default' | 'visited' | 'current' | 'path' | 'start' | 'end'
  distance?: number
  label?: string
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
  state: 'default' | 'traversed' | 'path'
}

export interface GraphStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  queue?: string[]
  description: string
}
