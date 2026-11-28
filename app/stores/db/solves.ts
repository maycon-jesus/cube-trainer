import { defineStore } from 'pinia'
import { IndexedDatabase, type StoredItemPreset } from '~~/lib/db/indexedDatabase'

export type Penalty = 'none' | '+2' | 'dnf'
export type Type = 'normal' | 'training'

export type SolvesFilter = {
  type?: Type
  sessionId?: string
  puzzleId?: string
  trainingAlgorithmId?: string
  trainingAlgorithmIds?: string[]
}

export type Solve = StoredItemPreset<{
  ms: number
  scramble: string
  penalty: Penalty
  createdAt: number
  puzzleId: string
  type: Type
  sessionId: string
  trainingAlgorithmId?: string
}>

const db = new IndexedDatabase<Solve>('solves', {
  indexes: [
    { name: 'sessionId', keyPath: 'sessionId' },
    { name: 'trainingAlgorithmId', keyPath: 'trainingAlgorithmId' },
    { name: 'puzzleId', keyPath: 'puzzleId' },
    { name: 'type', keyPath: 'type' },
  ],
})

const newestFirst = (a: Solve, b: Solve) => b.createdAt - a.createdAt

export const useSolvesStore = defineStore('solves', () => {
  const solves = ref<Solve[]>([])
  const ready = ref(false)

  async function refresh() {
    if (!import.meta.client) return
    const all = await db.getEntries(null, 'prev', 10000)
    solves.value = all.sort(newestFirst)
    ready.value = true
  }

  async function add(solve: Omit<Solve, 'id'>): Promise<string> {
    const id = await db.add(solve)
    solves.value = [{ ...solve, id }, ...solves.value]
    return id
  }

  async function update(solve: Solve): Promise<void> {
    await db.put(solve)
    solves.value = solves.value.map((it) => (it.id === solve.id ? solve : it))
  }

  async function remove(id: string): Promise<void> {
    await db.delete(id)
    solves.value = solves.value.filter((it) => it.id !== id)
  }

  async function removeBySessionId(sessionId: string): Promise<void> {
    const all = await db.getAllByIndex('sessionId', sessionId)
    await db.bulkDelete(all.map((it) => it.id))
    solves.value = solves.value.filter((it) => it.sessionId !== sessionId)
  }

  async function clear(): Promise<void> {
    await db.clear()
    solves.value = []
  }

  async function load() {
    await refresh()
  }

  async function reset() {
    ready.value = false
    solves.value = []
    await db.deleteDB()
  }

  /**
   * Most recent solves for a training case, newest first. Reads the in-memory
   * `solves` ref (already newest-first) so callers stay reactive. `limit` caps
   * the window (default 100, enough for an ao100).
   */
  function getByTrainingAlgorithmId(trainingAlgorithmId: string, limit = 100): Solve[] {
    return solves.value.filter((solve) => solve.trainingAlgorithmId === trainingAlgorithmId).slice(0, limit)
  }

  function matchesFilter(filter: SolvesFilter) {
    return (solve: Solve) => {
      if (filter.type && (solve.type ?? 'normal') !== filter.type) return false
      if (filter.sessionId && solve.sessionId !== filter.sessionId) return false
      if (filter.puzzleId && solve.puzzleId !== filter.puzzleId) return false
      if (filter.trainingAlgorithmId && solve.trainingAlgorithmId !== filter.trainingAlgorithmId) return false
      if (filter.trainingAlgorithmIds && (!solve.trainingAlgorithmId || !filter.trainingAlgorithmIds.includes(solve.trainingAlgorithmId))) return false
      return true
    }
  }

  function getEntriesWithFilter(filter: SolvesFilter, direction: IDBCursorDirection, size: number): Promise<Solve[]> {
    const predicate = matchesFilter(filter)
    const index = (['trainingAlgorithmId', 'sessionId', 'puzzleId'] as const).find((key) => filter[key])
    if (index) return db.getEntriesByIndex(index, filter[index], direction, size, predicate)
    return db.getEntries(null, direction, size, predicate)
  }

  async function getAllWithFilter(filter: SolvesFilter & {
    pageSize: number
    page: number
  }): Promise<Solve[]> {
    const offset = (filter.page - 1) * filter.pageSize
    const entries = await getEntriesWithFilter(filter, 'prev', offset + filter.pageSize)
    return entries.slice(offset)
  }

  async function countWithFilter(filter: SolvesFilter): Promise<number> {
    const entries = await getEntriesWithFilter(filter, 'next', -1)
    return entries.length
  }

  async function getBySessionId(sessionId: string, size: number): Promise<Solve[]> {
    return db.getEntriesByIndex('sessionId', sessionId, 'prev', size)
  }

  async function countBySessionId(sessionId: string): Promise<number> {
    return db.countByIndex('sessionId', sessionId)
  }

  async function changeSessionId(oldSessionId: string, newSessionId: string): Promise<void> {
    const moved = (await db.getAllByIndex('sessionId', oldSessionId))
      .map((solve) => ({ ...solve, sessionId: newSessionId }))
    await db.bulkPut(moved)
    solves.value = solves.value.map((it) => (it.sessionId === oldSessionId ? { ...it, sessionId: newSessionId } : it))
  }

  return {
    solves, ready, refresh, add, update, remove, clear, removeBySessionId, reset, load, getByTrainingAlgorithmId, getBySessionId, countBySessionId, getAllWithFilter, countWithFilter, changeSessionId,
    count: () => db.count(),
    exportEach: db.exportEach.bind(db),
    importBatch: db.importBatch.bind(db),
  }
})

export { db as solvesDb }
