import { defineStore } from 'pinia'
import { Database, type Stored } from '~~/lib/db/database'
import { useSolvesStore } from './solves'

export const DEFAULT_SESSION_NAME = 'Padrão'

export type Session = Stored<{
  name: string
  createdAt: number
}>

const db = new Database<Session>('session', 'session', {
  indexes: [{ name: 'createdAt', keyPath: 'createdAt' }],
})

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>([])
  const ready = ref(false)
  const solves = useSolvesStore()

  async function refresh() {
    if (!import.meta.client) return
    const all = await db.getAll()

    // Newest first.
    sessions.value = all.sort((a, b) => b.createdAt - a.createdAt)
    ready.value = true
  }

  async function add(session: Omit<Session, 'id'>): Promise<number> {
    const id = await db.add(session)
    sessions.value = [{ ...session, id }, ...sessions.value]
    return id
  }

  async function update(session: Session): Promise<void> {
    await db.put(session)
    sessions.value = sessions.value.map((it) => (it.id === session.id ? session : it))
  }

  async function remove(id: number): Promise<void> {
    await db.delete(id)
    await solves.removeBySessionId(id)
    sessions.value = sessions.value.filter((it) => it.id !== id)
  }

  async function clear(): Promise<void> {
    await db.clear()
    sessions.value = []
  }

  async function seed(sessionName: string = DEFAULT_SESSION_NAME): Promise<void> {
    if (!import.meta.client) return
    const count = await db.count()
    if (count === 0) {
      await add({ createdAt: Date.now(), name: sessionName })
    }
  }

  async function getLastSession(): Promise<Session | undefined> {
    return (await db.getEntries(1, 'prev'))[0]
  }

  async function getSession(id: number) {
    return db.get(id)
  }

  return { sessions, getSession, getLastSession, ready, refresh, add, update, remove, clear, seed }
})
