import { SortBar, SortStep, BarState } from './types'

function cloneBars(bars: SortBar[]): SortBar[] {
  return bars.map((b) => ({ ...b }))
}

function setState(bars: SortBar[], indices: number[], state: BarState): SortBar[] {
  const clone = cloneBars(bars)
  indices.forEach((i) => {
    if (clone[i]) clone[i].state = state
  })
  return clone
}

export function* bubbleSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const n = bars.length
  const sortedIndices: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      bars = setState(bars, [j, j + 1], 'comparing')
      yield { bars: cloneBars(bars), comparing: [j, j + 1], sortedIndices: [...sortedIndices], description: `Comparing bars[${j}]=${bars[j].value} and bars[${j+1}]=${bars[j+1].value}` }

      if (bars[j].value > bars[j + 1].value) {
        bars = setState(bars, [j, j + 1], 'swapping')
        yield { bars: cloneBars(bars), swapping: [j, j + 1], sortedIndices: [...sortedIndices], description: `Swapping ${bars[j].value} and ${bars[j+1].value}` }
        const tmp = bars[j].value
        bars[j].value = bars[j + 1].value
        bars[j + 1].value = tmp
        swapped = true
      }

      bars[j].state = 'default'
      bars[j + 1].state = 'default'
    }
    sortedIndices.push(n - 1 - i)
    bars[n - 1 - i].state = 'sorted'
    yield { bars: cloneBars(bars), sortedIndices: [...sortedIndices], description: `Element ${bars[n-1-i].value} is in its final position` }
    if (!swapped) break
  }

  // Mark remaining as sorted
  bars = bars.map((b) => ({ ...b, state: 'sorted' as BarState }))
  yield { bars: cloneBars(bars), sortedIndices: bars.map((_, i) => i), description: 'Array is fully sorted!' }
}

export function* insertionSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const n = bars.length

  bars[0].state = 'sorted'
  yield { bars: cloneBars(bars), sortedIndices: [0], description: 'First element is trivially sorted' }

  for (let i = 1; i < n; i++) {
    const key = bars[i].value
    bars[i].state = 'comparing'
    yield { bars: cloneBars(bars), comparing: [i, i], description: `Inserting ${key} into sorted portion` }

    let j = i - 1
    while (j >= 0 && bars[j].value > key) {
      bars[j].state = 'swapping'
      bars[j + 1].value = bars[j].value
      bars[j + 1].state = 'swapping'
      yield { bars: cloneBars(bars), swapping: [j, j + 1], description: `Shifting ${bars[j].value} right` }
      bars[j].state = 'sorted'
      bars[j + 1].state = 'sorted'
      j--
    }
    bars[j + 1].value = key
    bars[j + 1].state = 'sorted'
    // mark all up to i as sorted
    for (let k = 0; k <= i; k++) bars[k].state = 'sorted'
    yield { bars: cloneBars(bars), sortedIndices: Array.from({ length: i + 1 }, (_, k) => k), description: `Placed ${key} at position ${j + 1}` }
  }

  bars = bars.map((b) => ({ ...b, state: 'sorted' as BarState }))
  yield { bars: cloneBars(bars), sortedIndices: bars.map((_, i) => i), description: 'Array is fully sorted!' }
}

export function* selectionSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const n = bars.length
  const sortedIndices: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    bars[minIdx].state = 'pivot'
    yield { bars: cloneBars(bars), sortedIndices: [...sortedIndices], description: `Finding minimum in range [${i}, ${n-1}]` }

    for (let j = i + 1; j < n; j++) {
      bars[j].state = 'comparing'
      yield { bars: cloneBars(bars), comparing: [minIdx, j], sortedIndices: [...sortedIndices], description: `Comparing ${bars[j].value} with current min ${bars[minIdx].value}` }

      if (bars[j].value < bars[minIdx].value) {
        if (minIdx !== i) bars[minIdx].state = 'default'
        minIdx = j
        bars[minIdx].state = 'pivot'
      } else {
        bars[j].state = 'default'
      }
    }

    if (minIdx !== i) {
      bars[i].state = 'swapping'
      bars[minIdx].state = 'swapping'
      yield { bars: cloneBars(bars), swapping: [i, minIdx], sortedIndices: [...sortedIndices], description: `Swapping ${bars[i].value} and ${bars[minIdx].value}` }
      const tmp = bars[i].value
      bars[i].value = bars[minIdx].value
      bars[minIdx].value = tmp
    }

    for (let k = i; k < n; k++) bars[k].state = 'default'
    sortedIndices.push(i)
    bars[i].state = 'sorted'
    yield { bars: cloneBars(bars), sortedIndices: [...sortedIndices], description: `${bars[i].value} placed at position ${i}` }
  }

  sortedIndices.push(n - 1)
  bars = bars.map((b) => ({ ...b, state: 'sorted' as BarState }))
  yield { bars: cloneBars(bars), sortedIndices: [...sortedIndices], description: 'Array is fully sorted!' }
}

export function* mergeSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const steps: SortStep[] = []

  function mergeSort(arr: SortBar[], left: number, right: number) {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    merge(arr, left, mid, right)
  }

  function merge(arr: SortBar[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1).map(b => ({ ...b }))
    const rightArr = arr.slice(mid + 1, right + 1).map(b => ({ ...b }))
    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      arr[k].state = 'comparing'
      steps.push({ bars: cloneBars(arr), comparing: [left + i, mid + 1 + j], description: `Merging: comparing ${leftArr[i].value} and ${rightArr[j].value}` })
      arr[k].state = 'default'

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k].value = leftArr[i].value
        i++
      } else {
        arr[k].value = rightArr[j].value
        j++
      }
      arr[k].state = 'swapping'
      steps.push({ bars: cloneBars(arr), description: `Placed ${arr[k].value} at position ${k}` })
      arr[k].state = 'default'
      k++
    }

    while (i < leftArr.length) {
      arr[k].value = leftArr[i].value
      arr[k].state = 'swapping'
      steps.push({ bars: cloneBars(arr), description: `Copying ${arr[k].value} from left subarray` })
      arr[k].state = 'default'
      i++; k++
    }

    while (j < rightArr.length) {
      arr[k].value = rightArr[j].value
      arr[k].state = 'swapping'
      steps.push({ bars: cloneBars(arr), description: `Copying ${arr[k].value} from right subarray` })
      arr[k].state = 'default'
      j++; k++
    }
  }

  mergeSort(bars, 0, bars.length - 1)
  bars = bars.map(b => ({ ...b, state: 'sorted' as BarState }))
  steps.push({ bars: cloneBars(bars), sortedIndices: bars.map((_, i) => i), description: 'Array is fully sorted!' })

  for (const step of steps) yield step
}

export function* quickSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const steps: SortStep[] = []
  const sortedSet = new Set<number>()

  function partition(arr: SortBar[], low: number, high: number): number {
    const pivotVal = arr[high].value
    arr[high].state = 'pivot'
    steps.push({ bars: cloneBars(arr), pivotIndex: high, description: `Pivot = ${pivotVal} at index ${high}` })

    let i = low - 1
    for (let j = low; j < high; j++) {
      arr[j].state = 'comparing'
      steps.push({ bars: cloneBars(arr), comparing: [j, high], pivotIndex: high, description: `Comparing ${arr[j].value} with pivot ${pivotVal}` })

      if (arr[j].value <= pivotVal) {
        i++
        if (i !== j) {
          arr[i].state = 'swapping'
          arr[j].state = 'swapping'
          steps.push({ bars: cloneBars(arr), swapping: [i, j], pivotIndex: high, description: `Swapping ${arr[i].value} and ${arr[j].value}` })
          const tmp = arr[i].value
          arr[i].value = arr[j].value
          arr[j].value = tmp
        }
      }
      if (arr[j].state !== 'sorted') arr[j].state = 'default'
      if (arr[i] && arr[i].state !== 'sorted') arr[i].state = 'default'
    }

    arr[i + 1].state = 'swapping'
    arr[high].state = 'swapping'
    steps.push({ bars: cloneBars(arr), swapping: [i + 1, high], description: `Placing pivot ${pivotVal} at position ${i + 1}` })
    const tmp = arr[i + 1].value
    arr[i + 1].value = arr[high].value
    arr[high].value = tmp

    sortedSet.add(i + 1)
    arr[i + 1].state = 'sorted'
    if (arr[high].state !== 'sorted') arr[high].state = 'default'
    steps.push({ bars: cloneBars(arr), pivotIndex: i + 1, sortedIndices: [...sortedSet], description: `Pivot ${pivotVal} is now in its final position ${i + 1}` })

    return i + 1
  }

  function quickSort(arr: SortBar[], low: number, high: number) {
    if (low < high) {
      const pi = partition(arr, low, high)
      quickSort(arr, low, pi - 1)
      quickSort(arr, pi + 1, high)
    } else if (low === high) {
      sortedSet.add(low)
      arr[low].state = 'sorted'
    }
  }

  quickSort(bars, 0, bars.length - 1)
  bars = bars.map(b => ({ ...b, state: 'sorted' as BarState }))
  steps.push({ bars: cloneBars(bars), sortedIndices: bars.map((_, i) => i), description: 'Array is fully sorted!' })

  for (const step of steps) yield step
}

export function* heapSortGenerator(initial: number[]): Generator<SortStep> {
  let bars: SortBar[] = initial.map((v, i) => ({ value: v, state: 'default', id: i }))
  const steps: SortStep[] = []
  const n = bars.length

  function heapify(arr: SortBar[], size: number, root: number) {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    arr[root].state = 'comparing'
    if (left < size) arr[left].state = 'comparing'
    if (right < size) arr[right].state = 'comparing'
    steps.push({ bars: cloneBars(arr), description: `Heapifying at root ${root} (value ${arr[root].value})` })

    if (left < size && arr[left].value > arr[largest].value) largest = left
    if (right < size && arr[right].value > arr[largest].value) largest = right

    if (largest !== root) {
      arr[root].state = 'swapping'
      arr[largest].state = 'swapping'
      steps.push({ bars: cloneBars(arr), swapping: [root, largest], description: `Swapping ${arr[root].value} and ${arr[largest].value}` })
      const tmp = arr[root].value
      arr[root].value = arr[largest].value
      arr[largest].value = tmp
    }

    arr[root].state = 'default'
    if (left < size && arr[left].state !== 'sorted') arr[left].state = 'default'
    if (right < size && arr[right].state !== 'sorted') arr[right].state = 'default'

    if (largest !== root) heapify(arr, size, largest)
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(bars, n, i)

  steps.push({ bars: cloneBars(bars), description: 'Max-heap built! Now extracting elements.' })

  for (let i = n - 1; i > 0; i--) {
    bars[0].state = 'swapping'
    bars[i].state = 'swapping'
    steps.push({ bars: cloneBars(bars), swapping: [0, i], description: `Moving max ${bars[0].value} to position ${i}` })
    const tmp = bars[0].value
    bars[0].value = bars[i].value
    bars[i].value = tmp
    bars[i].state = 'sorted'
    steps.push({ bars: cloneBars(bars), description: `${bars[i].value} is now sorted at position ${i}` })
    heapify(bars, i, 0)
  }

  bars = bars.map(b => ({ ...b, state: 'sorted' as BarState }))
  steps.push({ bars: cloneBars(bars), sortedIndices: bars.map((_, i) => i), description: 'Array is fully sorted!' })

  for (const step of steps) yield step
}

export function getSortGenerator(algorithmId: string, data: number[]) {
  switch (algorithmId) {
    case 'bubble-sort': return bubbleSortGenerator(data)
    case 'merge-sort': return mergeSortGenerator(data)
    case 'quick-sort': return quickSortGenerator(data)
    case 'heap-sort': return heapSortGenerator(data)
    case 'insertion-sort': return insertionSortGenerator(data)
    case 'selection-sort': return selectionSortGenerator(data)
    default: return bubbleSortGenerator(data)
  }
}
