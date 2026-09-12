'use client'

import { useState } from 'react'
import { AlgorithmMeta } from '@/lib/types'
import { ComplexityPanel } from './complexity-panel'
import { cn } from '@/lib/utils'
import { Plus, Trash2, ArrowRight } from 'lucide-react'

interface Props {
  meta: AlgorithmMeta
}

/* ─── Array ─── */
function ArrayViz() {
  const [items, setItems] = useState([12, 45, 7, 89, 23, 56, 34])
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [log, setLog] = useState('Array initialized.')

  const push = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setItems((p) => [...p, v])
    setLog(`Pushed ${v} at index ${items.length}. O(1) amortized.`)
    setInput('')
  }

  const pop = () => {
    if (!items.length) return
    const v = items[items.length - 1]
    setItems((p) => p.slice(0, -1))
    setLog(`Popped ${v} from end. O(1).`)
  }

  const search = () => {
    const v = parseInt(searchVal)
    const idx = items.indexOf(v)
    setHighlighted(idx >= 0 ? idx : null)
    setLog(idx >= 0 ? `Found ${v} at index ${idx}. O(n) linear search.` : `${v} not found. O(n).`)
  }

  return (
    <div className="space-y-4">
      {/* Visualization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase mb-3">Memory Layout (contiguous)</div>
        <div className="flex gap-px overflow-x-auto pb-2">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  'w-14 h-14 flex items-center justify-center border text-sm font-bold font-mono rounded-sm transition-all duration-200',
                  highlighted === i
                    ? 'bg-neon/20 border-neon text-neon shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'bg-surface-2 border-border/60 text-foreground'
                )}
              >
                {item}
              </div>
              <div className="text-[10px] text-muted-foreground/50 mt-1 font-mono">[{i}]</div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="w-full h-14 flex items-center justify-center text-muted-foreground text-sm">
              Empty array
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Push / Pop</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) push() }}
              placeholder="value"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40"
            />
            <button onClick={push} className="px-3 py-1 rounded bg-neon/15 border border-neon/30 text-neon text-sm hover:bg-neon/25 transition-all">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={pop} className="px-3 py-1 rounded bg-danger/10 border border-danger/20 text-danger text-sm hover:bg-danger/20 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Linear Search</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) search() }}
              placeholder="search value"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40"
            />
            <button onClick={search} className="px-3 py-1 rounded bg-compare/10 border border-compare/20 text-compare text-sm hover:bg-compare/20 transition-all text-[11px] font-mono">
              Find
            </button>
          </div>
        </div>
      </div>

      <LogLine text={log} />
    </div>
  )
}

/* ─── Linked List ─── */
function LinkedListViz() {
  const [nodes, setNodes] = useState([10, 20, 30, 40, 50])
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const [log, setLog] = useState('Singly linked list initialized.')

  const prepend = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setNodes((p) => [v, ...p])
    setLog(`Prepended ${v} at head. O(1).`)
    setHighlighted(0)
    setInput('')
  }

  const append = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setNodes((p) => [...p, v])
    setLog(`Appended ${v} at tail. O(n) traversal required.`)
    setHighlighted(nodes.length)
    setInput('')
  }

  const removeHead = () => {
    if (!nodes.length) return
    const v = nodes[0]
    setNodes((p) => p.slice(1))
    setHighlighted(null)
    setLog(`Removed head node ${v}. O(1).`)
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase mb-3">Node chain</div>
        <div className="flex items-center flex-wrap gap-1 overflow-x-auto">
          {nodes.map((val, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={cn(
                'flex flex-col border rounded overflow-hidden transition-all duration-200',
                highlighted === i ? 'border-neon/50' : 'border-border/60'
              )}>
                <div className={cn(
                  'px-4 py-2 text-sm font-bold font-mono text-center',
                  highlighted === i ? 'bg-neon/20 text-neon' : 'bg-surface-2 text-foreground'
                )}>{val}</div>
                <div className="px-4 py-1 bg-background/50 text-[10px] text-muted-foreground/60 text-center font-mono">
                  {i < nodes.length - 1 ? '→next' : 'null'}
                </div>
              </div>
              {i < nodes.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
            </div>
          ))}
          {nodes.length === 0 && <div className="text-muted-foreground text-sm">Empty list</div>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2 col-span-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Operations</div>
          <div className="flex gap-2">
            <input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="value"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-neon/40 text-foreground placeholder:text-muted-foreground/50" />
            <button onClick={prepend} className="px-3 py-1 rounded bg-neon/15 border border-neon/30 text-neon text-[11px] hover:bg-neon/25 transition-all whitespace-nowrap">Prepend</button>
            <button onClick={append} className="px-3 py-1 rounded bg-compare/10 border border-compare/20 text-compare text-[11px] hover:bg-compare/20 transition-all whitespace-nowrap">Append</button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Remove</div>
          <button onClick={removeHead} className="w-full px-3 py-1.5 rounded bg-danger/10 border border-danger/20 text-danger text-sm hover:bg-danger/20 transition-all">Remove Head</button>
        </div>
      </div>

      <LogLine text={log} />
    </div>
  )
}

/* ─── Stack ─── */
function StackViz() {
  const [stack, setStack] = useState([3, 7, 1, 9])
  const [input, setInput] = useState('')
  const [log, setLog] = useState('Stack initialized. LIFO order.')

  const push = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setStack((p) => [v, ...p])
    setLog(`PUSH ${v} onto top. O(1).`)
    setInput('')
  }

  const pop = () => {
    if (!stack.length) return
    const v = stack[0]
    setStack((p) => p.slice(1))
    setLog(`POP ${v} from top. O(1). Stack size: ${stack.length - 1}`)
  }

  const peek = () => {
    if (!stack.length) { setLog('Stack is empty!'); return }
    setLog(`PEEK: top element is ${stack[0]}. O(1). No removal.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="bg-card border border-border rounded-lg p-6 flex-1">
          <div className="text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase mb-3">Stack (LIFO)</div>
          <div className="flex flex-col gap-px max-w-[200px] mx-auto">
            <div className="text-[10px] text-center text-muted-foreground/50 mb-1 font-mono">← TOP</div>
            {stack.map((val, i) => (
              <div key={i} className={cn(
                'px-6 py-2.5 border text-sm font-bold font-mono text-center rounded-sm transition-all duration-200',
                i === 0 ? 'bg-neon/20 border-neon/50 text-neon shadow-[0_0_8px_rgba(34,197,94,0.2)]' : 'bg-surface-2 border-border/60 text-foreground'
              )}>
                {val}
              </div>
            ))}
            {stack.length === 0 && (
              <div className="px-6 py-4 border border-dashed border-border/40 text-center text-sm text-muted-foreground rounded">
                Empty
              </div>
            )}
            <div className="h-px bg-neon/30 mt-1" />
            <div className="text-[10px] text-center text-muted-foreground/50 mt-1 font-mono">BOTTOM</div>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="bg-card border border-border rounded-lg p-3 space-y-2">
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Push</div>
            <div className="flex gap-2">
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) push() }}
                placeholder="value"
                className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
              <button onClick={push} className="px-3 rounded bg-neon/15 border border-neon/30 text-neon hover:bg-neon/25 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button onClick={pop} className="w-full px-3 py-2 rounded bg-danger/10 border border-danger/20 text-danger text-sm hover:bg-danger/20 transition-all font-mono">
            pop()
          </button>
          <button onClick={peek} className="w-full px-3 py-2 rounded bg-compare/10 border border-compare/20 text-compare text-sm hover:bg-compare/20 transition-all font-mono">
            peek()
          </button>
          <div className="bg-card border border-border rounded px-3 py-2 text-[11px] text-muted-foreground font-mono">
            size = <span className="text-neon">{stack.length}</span>
          </div>
        </div>
      </div>
      <LogLine text={log} />
    </div>
  )
}

/* ─── Queue ─── */
function QueueViz() {
  const [queue, setQueue] = useState([5, 12, 8, 3])
  const [input, setInput] = useState('')
  const [log, setLog] = useState('Queue initialized. FIFO order.')

  const enqueue = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setQueue((p) => [...p, v])
    setLog(`ENQUEUE ${v} at rear. O(1).`)
    setInput('')
  }

  const dequeue = () => {
    if (!queue.length) return
    const v = queue[0]
    setQueue((p) => p.slice(1))
    setLog(`DEQUEUE ${v} from front. O(1). Queue size: ${queue.length - 1}`)
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase mb-3">Queue (FIFO)</div>
        <div className="flex items-stretch gap-px overflow-x-auto">
          <div className="flex flex-col justify-center pr-2 text-[10px] text-neon/70 font-mono whitespace-nowrap">FRONT →</div>
          {queue.map((val, i) => (
            <div key={i} className={cn(
              'w-16 h-16 flex items-center justify-center border text-sm font-bold font-mono shrink-0 transition-all duration-200',
              i === 0 ? 'bg-neon/20 border-neon/50 text-neon' : 'bg-surface-2 border-border/60 text-foreground'
            )}>
              {val}
            </div>
          ))}
          {queue.length === 0 && <div className="flex-1 h-16 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border/40 rounded">Empty</div>}
          <div className="flex flex-col justify-center pl-2 text-[10px] text-compare/70 font-mono whitespace-nowrap">← REAR</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Enqueue</div>
          <div className="flex gap-2">
            <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) enqueue() }}
              placeholder="value"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
            <button onClick={enqueue} className="px-3 rounded bg-neon/15 border border-neon/30 text-neon hover:bg-neon/25 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Dequeue</div>
          <button onClick={dequeue} className="w-full px-3 py-2 rounded bg-danger/10 border border-danger/20 text-danger text-sm hover:bg-danger/20 transition-all font-mono">
            dequeue() from front
          </button>
        </div>
      </div>

      <LogLine text={log} />
    </div>
  )
}

/* ─── Binary Tree ─── */
interface TreeNode { val: number; left?: TreeNode; right?: TreeNode }

function insertBST(root: TreeNode | undefined, val: number): TreeNode {
  if (!root) return { val }
  if (val < root.val) return { ...root, left: insertBST(root.left, val) }
  if (val > root.val) return { ...root, right: insertBST(root.right, val) }
  return root
}

function BinaryTreeViz() {
  const [root, setRoot] = useState<TreeNode | undefined>(() => {
    let r: TreeNode | undefined
    for (const v of [40, 20, 60, 10, 30, 50, 70]) r = insertBST(r, v)
    return r
  })
  const [input, setInput] = useState('')
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [log, setLog] = useState('Binary Search Tree initialized.')

  const insert = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setRoot((r) => insertBST(r, v))
    setHighlighted(v)
    setLog(`Inserted ${v}. BST property maintained. O(log n) average.`)
    setInput('')
  }

  const search = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    let node = root, steps = 0
    while (node) {
      steps++
      if (node.val === v) { setHighlighted(v); setLog(`Found ${v} in ${steps} step(s). O(log n) average.`); return }
      node = v < node.val ? node.left : node.right
    }
    setHighlighted(null)
    setLog(`${v} not found after ${steps} step(s).`)
  }

  // Render tree recursively in SVG
  function renderNode(node: TreeNode | undefined, x: number, y: number, spread: number, depth: number): React.ReactNode {
    if (!node) return null
    const leftX = x - spread
    const rightX = x + spread
    const childY = y + 60

    return (
      <g key={`${node.val}-${x}-${y}`}>
        {node.left && <line x1={x} y1={y} x2={leftX} y2={childY} stroke="#334155" strokeWidth="1.5" />}
        {node.right && <line x1={x} y1={y} x2={rightX} y2={childY} stroke="#334155" strokeWidth="1.5" />}
        <circle
          cx={x} cy={y} r={18}
          fill={highlighted === node.val ? '#166534' : '#1e2130'}
          stroke={highlighted === node.val ? '#4ade80' : '#334155'}
          strokeWidth={highlighted === node.val ? 2 : 1.5}
        />
        <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold"
          fill={highlighted === node.val ? '#4ade80' : '#94a3b8'} fontFamily="monospace">
          {node.val}
        </text>
        {renderNode(node.left, leftX, childY, Math.max(spread / 1.8, 18), depth + 1)}
        {renderNode(node.right, rightX, childY, Math.max(spread / 1.8, 18), depth + 1)}
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ height: 280 }}>
        <svg width="100%" height="100%" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
          {renderNode(root, 300, 40, 110, 0)}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Insert / Search</div>
          <div className="flex gap-2">
            <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) insert() }}
              placeholder="value"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
            <button onClick={insert} className="px-3 py-1 rounded bg-neon/15 border border-neon/30 text-neon text-[11px] hover:bg-neon/25 transition-all">Insert</button>
            <button onClick={search} className="px-3 py-1 rounded bg-compare/10 border border-compare/20 text-compare text-[11px] hover:bg-compare/20 transition-all">Search</button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">BST Property</div>
          <div className="text-[11px] text-muted-foreground font-mono leading-relaxed">
            left.val {'<'} root.val {'<'} right.val
          </div>
        </div>
      </div>

      <LogLine text={log} />
    </div>
  )
}

/* ─── Hash Table ─── */
function HashTableViz() {
  const SIZE = 8
  const [buckets, setBuckets] = useState<Array<Array<{ key: string; val: number }>>>(() =>
    Array.from({ length: SIZE }, () => [])
  )
  const [keyInput, setKeyInput] = useState('')
  const [valInput, setValInput] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [log, setLog] = useState(`Hash table with ${SIZE} buckets. Using djb2 hash.`)

  function hash(key: string) {
    let h = 5381
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h) + key.charCodeAt(i)
    return Math.abs(h) % SIZE
  }

  const put = () => {
    if (!keyInput) return
    const v = parseInt(valInput)
    if (isNaN(v)) return
    const idx = hash(keyInput)
    setBuckets((prev) => {
      const next = prev.map((b) => [...b])
      const existing = next[idx].findIndex((e) => e.key === keyInput)
      if (existing >= 0) next[idx][existing].val = v
      else next[idx].push({ key: keyInput, val: v })
      return next
    })
    setHighlighted(idx)
    setLog(`hash("${keyInput}") = ${idx}. Stored {${keyInput}: ${v}}.${buckets[idx].length > 0 ? ' Collision handled via chaining.' : ''}`)
    setKeyInput(''); setValInput('')
  }

  const get = () => {
    if (!searchKey) return
    const idx = hash(searchKey)
    const entry = buckets[idx].find((e) => e.key === searchKey)
    setHighlighted(idx)
    if (entry) setLog(`hash("${searchKey}") = ${idx}. Found value: ${entry.val}. O(1) average.`)
    else setLog(`hash("${searchKey}") = ${idx}. Key not found in bucket ${idx}.`)
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase mb-3">Hash Table (Separate Chaining)</div>
        <div className="space-y-1">
          {buckets.map((bucket, i) => (
            <div key={i} className={cn(
              'flex items-stretch rounded overflow-hidden border transition-all duration-200',
              highlighted === i ? 'border-neon/40' : 'border-border/40'
            )}>
              <div className={cn(
                'w-10 flex items-center justify-center text-[11px] font-mono font-bold border-r shrink-0',
                highlighted === i ? 'bg-neon/20 border-neon/30 text-neon' : 'bg-surface-2 border-border/30 text-muted-foreground'
              )}>
                [{i}]
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 min-h-[36px] flex-wrap">
                {bucket.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground/40 font-mono italic">empty</span>
                ) : (
                  bucket.map((entry, j) => (
                    <div key={j} className="flex items-center gap-0.5">
                      {j > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
                      <span className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-mono border',
                        highlighted === i ? 'bg-neon/15 border-neon/30 text-neon' : 'bg-background border-border/50 text-foreground'
                      )}>
                        {entry.key}:{entry.val}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">put(key, value)</div>
          <div className="flex gap-2">
            <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="key"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
            <input type="number" value={valInput} onChange={(e) => setValInput(e.target.value)} placeholder="val"
              className="w-16 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
            <button onClick={put} className="px-3 rounded bg-neon/15 border border-neon/30 text-neon hover:bg-neon/25 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">get(key)</div>
          <div className="flex gap-2">
            <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) get() }}
              placeholder="key"
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40" />
            <button onClick={get} className="px-3 rounded bg-compare/10 border border-compare/20 text-compare hover:bg-compare/20 transition-all text-[11px] font-mono">
              Get
            </button>
          </div>
        </div>
      </div>

      <LogLine text={log} />
    </div>
  )
}

/* ─── Shared log line ─── */
function LogLine({ text }: { text: string }) {
  return (
    <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-2 min-h-[2.5rem]">
      <div className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
      <span className="text-sm text-foreground font-mono">{text}</span>
    </div>
  )
}

/* ─── Main export ─── */
const DS_COMPONENTS: Record<string, React.FC> = {
  'array-viz': ArrayViz,
  'linked-list-viz': LinkedListViz,
  'stack-viz': StackViz,
  'queue-viz': QueueViz,
  'binary-tree-viz': BinaryTreeViz,
  'hash-table-viz': HashTableViz,
}

export function DataStructureVisualizer({ meta }: Props) {
  const Component = DS_COMPONENTS[meta.id]

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {Component ? <Component /> : (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          Visualization for {meta.name} coming soon
        </div>
      )}
      <ComplexityPanel meta={meta} />
    </div>
  )
}
