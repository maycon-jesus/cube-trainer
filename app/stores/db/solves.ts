import { defineStore } from 'pinia'
import { Database, type Stored } from '~~/lib/db/database'

export type Penalty = 'none' | '+2' | 'dnf'
export type Category = 'normal' | 'training'

export type Solve = Stored<{
  ms: number
  scramble: string
  penalty: Penalty
  createdAt: number
  puzzle: string
  category: Category
  sessionId: number
  trainingId: string
  tagsId: number[]
}>

// Shared instance
const db = new Database<Solve>('solves-history', 'solves', {
  version: 1,
  indexes: [{ name: 'createdAt', keyPath: 'createdAt' }, { name: 'sessionId', keyPath: 'sessionId' }, { name: 'trainingId', keyPath: 'trainingId' }, { name: 'puzzle', keyPath: 'puzzle' },
  { name: 'category', keyPath: 'category' },
  {
    name: 'all-solves',
    keyPath: ['category', 'sessionId', 'puzzle', 'trainingId'],
    options: { unique: false },
  },
  ],
})

export const useSolvesStore = defineStore('solves', () => {
  const solves = ref<Solve[]>([])
  const ready = ref(false)

  async function refresh() {
    if (!import.meta.client) return
    const all = await db.getAll()

    // Newest first.
    solves.value = all.sort((a, b) => b.createdAt - a.createdAt)
    ready.value = true
  }

  async function add(solve: Omit<Solve, 'id'>): Promise<number> {
    const id = await db.add(solve)
    solves.value = [{ ...solve, id }, ...solves.value]
    return id as number
  }

  async function update(solve: Solve): Promise<void> {
    await db.put(solve)
    solves.value = solves.value.map((it) => (it.id === solve.id ? solve : it))
  }

  async function remove(id: number): Promise<void> {
    await db.delete(id)
    solves.value = solves.value.filter((it) => it.id !== id)
  }

  async function removeBySessionId(id: number): Promise<void> {
    const all = await db.getAllByIndex('sessionId', id)
    const ids = all.map(it => it.id!)
    await db.bulkDelete(ids)
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

  async function getAll(type: Category, sessionId: number, puzzle: string, trainingId: string): Promise<Solve[]> {
    const solves = await db.getAllByIndex('all-solves', [type, sessionId, puzzle, trainingId])
    return solves.sort((a, b) => b.createdAt - a.createdAt)
  }

  async function getBySessionId(sessionId: number, size: number): Promise<Solve[]> {
    const solves = await db.getEntriesByIndex('sessionId', sessionId, size, 'prev')
    return solves
  }

  async function countBySessionId(sessionId: number): Promise<number> {
    const count = await db.countByIndex('sessionId', sessionId)
    return count
  }

  async function changeSessionId(oldSessionId: number, newSessionId: number): Promise<void> {
    const solves = await db.getAllByIndex('sessionId', oldSessionId)
    for (const solve of solves) {
      solve.sessionId = newSessionId
      await db.put(solve)
    }
  }

  return { solves, ready, refresh, add, update, remove, clear, removeBySessionId, reset, load, getAll, getBySessionId ,countBySessionId, changeSessionId, exportAll: db.exportAll.bind(db), importAll: db.importAll.bind(db)}
})
