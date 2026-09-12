import { GraphNode, GraphEdge, GraphStep } from './types'

export function createDefaultGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 'A', x: 120, y: 80,  state: 'default', label: 'A' },
    { id: 'B', x: 300, y: 40,  state: 'default', label: 'B' },
    { id: 'C', x: 480, y: 80,  state: 'default', label: 'C' },
    { id: 'D', x: 200, y: 200, state: 'default', label: 'D' },
    { id: 'E', x: 380, y: 200, state: 'default', label: 'E' },
    { id: 'F', x: 120, y: 320, state: 'default', label: 'F' },
    { id: 'G', x: 300, y: 320, state: 'default', label: 'G' },
    { id: 'H', x: 480, y: 320, state: 'default', label: 'H' },
  ]

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 4, state: 'default' },
    { from: 'A', to: 'D', weight: 2, state: 'default' },
    { from: 'B', to: 'C', weight: 3, state: 'default' },
    { from: 'B', to: 'E', weight: 5, state: 'default' },
    { from: 'C', to: 'E', weight: 1, state: 'default' },
    { from: 'D', to: 'E', weight: 7, state: 'default' },
    { from: 'D', to: 'F', weight: 3, state: 'default' },
    { from: 'E', to: 'G', weight: 2, state: 'default' },
    { from: 'E', to: 'H', weight: 4, state: 'default' },
    { from: 'F', to: 'G', weight: 6, state: 'default' },
    { from: 'G', to: 'H', weight: 1, state: 'default' },
  ]

  return { nodes, edges }
}

function cloneGraph(nodes: GraphNode[], edges: GraphEdge[]) {
  return {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
  }
}

export function* bfsGenerator(
  startId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): Generator<GraphStep> {
  const ns = nodes.map(n => ({ ...n }))
  const es = edges.map(e => ({ ...e }))

  const adj: Record<string, string[]> = {}
  ns.forEach(n => (adj[n.id] = []))
  es.forEach(e => {
    adj[e.from].push(e.to)
    adj[e.to].push(e.from)
  })

  const visited = new Set<string>()
  const queue: string[] = [startId]
  visited.add(startId)
  ns.find(n => n.id === startId)!.state = 'start'

  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...queue], description: `BFS start from node ${startId}. Queue: [${queue}]` }

  while (queue.length > 0) {
    const current = queue.shift()!
    const curNode = ns.find(n => n.id === current)!
    if (curNode.state !== 'start') curNode.state = 'current'

    yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...queue], description: `Visiting node ${current}` }

    for (const neighbor of adj[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        const edge = es.find(e => (e.from === current && e.to === neighbor) || (e.from === neighbor && e.to === current))
        if (edge) edge.state = 'traversed'
        ns.find(n => n.id === neighbor)!.state = 'visited'
        yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...queue], description: `Discovered neighbor ${neighbor}. Queue: [${queue}]` }
      }
    }

    if (curNode.state !== 'start') curNode.state = 'visited'
  }

  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [], description: 'BFS complete! All reachable nodes visited.' }
}

export function* dfsGenerator(
  startId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): Generator<GraphStep> {
  const ns = nodes.map(n => ({ ...n }))
  const es = edges.map(e => ({ ...e }))

  const adj: Record<string, string[]> = {}
  ns.forEach(n => (adj[n.id] = []))
  es.forEach(e => {
    adj[e.from].push(e.to)
    adj[e.to].push(e.from)
  })

  const visited = new Set<string>()
  const stack: string[] = []

  ns.find(n => n.id === startId)!.state = 'start'
  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [startId], description: `DFS start from node ${startId}` }

  function* dfsVisit(nodeId: string): Generator<GraphStep> {
    visited.add(nodeId)
    stack.push(nodeId)
    const node = ns.find(n => n.id === nodeId)!
    if (node.state !== 'start') node.state = 'current'
    yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...stack], description: `DFS exploring node ${nodeId}. Stack: [${stack}]` }

    for (const neighbor of adj[nodeId]) {
      if (!visited.has(neighbor)) {
        const edge = es.find(e => (e.from === nodeId && e.to === neighbor) || (e.from === neighbor && e.to === nodeId))
        if (edge) edge.state = 'traversed'
        yield* dfsVisit(neighbor)
      }
    }

    if (node.state !== 'start') node.state = 'visited'
    stack.pop()
    yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...stack], description: `Backtracking from ${nodeId}` }
  }

  yield* dfsVisit(startId)
  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [], description: 'DFS complete! All reachable nodes visited.' }
}

export function* dijkstraGenerator(
  startId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): Generator<GraphStep> {
  const ns = nodes.map(n => ({ ...n, distance: Infinity }))
  const es = edges.map(e => ({ ...e }))

  const adj: Record<string, Array<{ to: string; weight: number }>> = {}
  ns.forEach(n => (adj[n.id] = []))
  es.forEach(e => {
    adj[e.from].push({ to: e.to, weight: e.weight ?? 1 })
    adj[e.to].push({ to: e.from, weight: e.weight ?? 1 })
  })

  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const unvisited = new Set<string>()

  ns.forEach(n => {
    dist[n.id] = Infinity
    prev[n.id] = null
    unvisited.add(n.id)
  })

  dist[startId] = 0
  ns.find(n => n.id === startId)!.state = 'start'
  ns.find(n => n.id === startId)!.distance = 0

  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [startId], description: `Dijkstra start from ${startId}. Distance: 0` }

  while (unvisited.size > 0) {
    // Get unvisited node with min dist
    let u: string | null = null
    let minDist = Infinity
    for (const id of unvisited) {
      if (dist[id] < minDist) {
        minDist = dist[id]
        u = id
      }
    }

    if (!u || dist[u] === Infinity) break
    unvisited.delete(u)

    const uNode = ns.find(n => n.id === u)!
    if (uNode.state !== 'start') uNode.state = 'current'
    yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...unvisited], description: `Processing node ${u} (dist=${dist[u]})` }

    for (const { to, weight } of adj[u]) {
      if (!unvisited.has(to)) continue
      const alt = dist[u] + weight
      const edge = es.find(e => (e.from === u && e.to === to) || (e.from === to && e.to === u))
      if (edge) edge.state = 'traversed'
      const toNode = ns.find(n => n.id === to)!
      const prevDist = dist[to]

      if (alt < dist[to]) {
        dist[to] = alt
        prev[to] = u
        toNode.distance = alt
        if (toNode.state !== 'start') toNode.state = 'visited'
        yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...unvisited], description: `Updated dist[${to}] = ${alt} (was ${prevDist === Infinity ? '∞' : prevDist})` }
      } else {
        yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [...unvisited], description: `No improvement for ${to}: ${alt} ≥ ${dist[to]}` }
      }
    }

    if (uNode.state !== 'start') uNode.state = 'visited'
  }

  // Highlight shortest path from every reachable node
  yield { nodes: cloneGraph(ns, es).nodes, edges: cloneGraph(ns, es).edges, queue: [], description: `Dijkstra complete! Shortest paths from ${startId} found.` }
}

export function getGraphGenerator(algorithmId: string, startId: string, nodes: GraphNode[], edges: GraphEdge[]) {
  switch (algorithmId) {
    case 'bfs': return bfsGenerator(startId, nodes, edges)
    case 'dfs': return dfsGenerator(startId, nodes, edges)
    case 'dijkstra': return dijkstraGenerator(startId, nodes, edges)
    default: return bfsGenerator(startId, nodes, edges)
  }
}
