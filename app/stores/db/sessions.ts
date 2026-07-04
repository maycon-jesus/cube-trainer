import { defineStore } from 'pinia'
import { Database, type Stored } from '~~/lib/db/database'
import { useSolvesStore } from './solves'
import { useConfigStore } from './config'

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
  const config = useConfigStore()

  async function refresh() {
    if (!import.meta.client) return
    const all = await db.getAll()

    // Newest first.
    sessions.value = all.sort((a, b) => b.createdAt - a.createdAt)
    ready.value = true
  }

  async function add(name: string): Promise<number> {
    const session: Session = { name, createdAt: Date.now() }
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
    await load()
    await config.load()
  }

  async function clear(): Promise<void> {
    await db.clear()
    sessions.value = []
  }

  async function load(): Promise<void> {
    if (!import.meta.client) return
    const count = await db.count()
    if (count === 0) {
      await add(DEFAULT_SESSION_NAME)
    } else {
      await refresh()
    }
  }

  async function getLastSession(): Promise<Session | undefined> {
    return (await db.getEntries(null,1, 'prev'))[0]
  }

  async function getSession(id: number) {
    return db.get(id)
  }

  async function getAll(): Promise<Session[]> {
    return db.getAll()
  }

  async function reset() {
    ready.value = false
    sessions.value = []
    await db.deleteDB()
  }

  return { sessions, getSession, getLastSession, ready, refresh, add, update, remove, clear, load, reset ,getAll}
})
