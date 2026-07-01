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
  trainingId?: number
}>

// Shared instance
const db = new Database<Solve>('solves-history', 'solves', {
  version: 1,
  indexes: [{ name: 'createdAt', keyPath: 'createdAt' }, { name: 'sessionId', keyPath: 'sessionId' }],
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
    return id
  }

  async function update(solve: Solve): Promise<void> {
    await db.put(solve)
    solves.value = solves.value.map((it) => (it.id === solve.id ? solve : it))
  }

  async function remove(id: number): Promise<void> {
    await db.delete(id)
    solves.value = solves.value.filter((it) => it.id !== id)
  }

  async function removeBySessionId(id: number): Promise<void[]> {
    const all = await db.getAllByIndex('sessionId', id)
    const ids = all.map(it => it.sessionId)
    return db.bulkDelete(ids)
  }

  async function clear(): Promise<void> {
    await db.clear()
    solves.value = []
  }

  return { solves, ready, refresh, add, update, remove, clear, removeBySessionId }
})
