import { defineStore } from 'pinia'
import { useSolvesStore } from './solves'
import { useConfigStore } from './config'
import { IndexedDatabase } from '~~/lib/db/indexedDatabase'

export const DEFAULT_SESSION_NAME = 'Padrão'

export type Session = {
  id: string
  name: string
  createdAt: number
}

const db = new IndexedDatabase<Session>('sessions', {})

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

  async function add(name: string): Promise<string> {
    const session: Omit<Session, "id"> = { name, createdAt: Date.now() }
    const id = await db.add(session)
    sessions.value = [{ ...session, id }, ...sessions.value]
    return id
  }

  async function update(session: Session): Promise<void> {
    await db.put(session)
    sessions.value = sessions.value.map((it) => (it.id === session.id ? session : it))
  }

  async function remove(id: string, moveSolvesToSessionId?: string | null): Promise<void> {
    await db.delete(id)
    if (!moveSolvesToSessionId) {
      await solves.removeBySessionId(id)
    } else {
      await solves.changeSessionId(id, moveSolvesToSessionId)
    }
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
    return (await db.getAll(null, 1))[0]
  }

  async function getSession(id: string): Promise<Session | undefined> {
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

  return {
    sessions, getSession, getLastSession, ready, refresh, add, update, remove, clear, load, reset, getAll,
    count: () => db.count(),
    exportEach: db.exportEach.bind(db),
    importBatch: db.importBatch.bind(db),
  }
})
