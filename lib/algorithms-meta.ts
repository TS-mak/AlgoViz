import { AlgorithmMeta } from './types'

export const ALGORITHMS: AlgorithmMeta[] = [
  // Sorting
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.',
    stable: true,
    inPlace: true,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description:
      'Divides the array in half, recursively sorts each half, then merges the sorted halves back together. A classic divide-and-conquer algorithm.',
    stable: true,
    inPlace: false,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    description:
      'Selects a pivot element and partitions the array around it, placing smaller elements before and larger elements after the pivot. Recursively applied.',
    stable: false,
    inPlace: true,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    description:
      'Builds a max-heap from the data, then repeatedly extracts the maximum element to build the sorted array. Combines efficiency of merge sort with in-place sorting.',
    stable: false,
    inPlace: true,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description:
      'Builds the final sorted array one item at a time. Iterates through each element and inserts it into the correct position in the already-sorted portion.',
    stable: true,
    inPlace: true,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description:
      'Divides the array into sorted and unsorted portions. Repeatedly finds the minimum element from the unsorted portion and places it at the beginning of the sorted portion.',
    stable: false,
    inPlace: true,
  },
  // Graph
  {
    id: 'bfs',
    name: 'BFS',
    category: 'graph',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description:
      'Explores all neighbors at the present depth prior to moving on to nodes at the next depth level. Uses a queue data structure.',
  },
  {
    id: 'dfs',
    name: 'DFS',
    category: 'graph',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description:
      'Explores as far as possible along each branch before backtracking. Uses a stack (or recursion) data structure.',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's",
    category: 'graph',
    timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    description:
      "Finds the shortest path between nodes in a weighted graph. Uses a priority queue to always process the node with the smallest tentative distance next.",
  },
  // Data Structures
  {
    id: 'array-viz',
    name: 'Array',
    category: 'data-structures',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description:
      'A contiguous block of memory storing elements of the same type. Access by index is O(1), but insertion/deletion can require shifting elements.',
  },
  {
    id: 'linked-list-viz',
    name: 'Linked List',
    category: 'data-structures',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description:
      'A sequence of nodes where each node stores data and a pointer to the next node. Efficient insertion/deletion at head, but no random access.',
  },
  {
    id: 'stack-viz',
    name: 'Stack',
    category: 'data-structures',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    description:
      'A LIFO (Last In, First Out) data structure. Elements are pushed and popped from the top only. Used in recursion, undo operations, and expression parsing.',
  },
  {
    id: 'queue-viz',
    name: 'Queue',
    category: 'data-structures',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    description:
      'A FIFO (First In, First Out) data structure. Elements are enqueued at the back and dequeued from the front. Used in BFS, scheduling, and buffering.',
  },
  {
    id: 'binary-tree-viz',
    name: 'Binary Tree',
    category: 'data-structures',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description:
      'A hierarchical structure where each node has at most two children. Binary Search Trees maintain ordering, enabling efficient search, insert, and delete operations.',
  },
  {
    id: 'hash-table-viz',
    name: 'Hash Table',
    category: 'data-structures',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description:
      'Maps keys to values using a hash function. Average O(1) lookups, insertions, and deletions. Collisions are handled via chaining or open addressing.',
  },
]

export const CATEGORIES = [
  { id: 'sorting', label: 'Sorting', color: 'text-neon' },
  { id: 'graph', label: 'Graph', color: 'text-compare' },
  { id: 'data-structures', label: 'Data Structures', color: 'text-warn' },
] as const
