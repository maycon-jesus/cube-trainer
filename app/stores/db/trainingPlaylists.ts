import { defineStore } from 'pinia'
import { IndexedDatabase, type StoredItemPreset } from '~~/lib/db/indexedDatabase'

export type TrainingCase = {
  setId: string
  algorithmId: string
}

export type TrainingPlaylist = StoredItemPreset<{
  name: string
  puzzleId: string
  trainingCases: TrainingCase[]
  createdAt: number
}>

const db = new IndexedDatabase<TrainingPlaylist>("training-playlists", {})

export const useTrainingPlaylistsStore = defineStore('trainingPlaylists', () => {
  async function getAll(): Promise<TrainingPlaylist[]> {
    if (!import.meta.client) return []
    const all = await db.getAll()
    return all
  }

  async function add(playlist: Omit<TrainingPlaylist, 'id' | 'createdAt'>): Promise<string> {
    const entry = { ...playlist, createdAt: Date.now() }
    const id = await db.add(entry)
    return id
  }

  async function update(playlist: TrainingPlaylist): Promise<void> {
    await db.put(playlist)
  }

  async function remove(id: string): Promise<void> {
    await db.delete(id)
  }

  async function clear(): Promise<void> {
    await db.clear()
  }

  async function get(id: string): Promise<TrainingPlaylist | undefined> {
    return db.get(id)
  }

  async function load() { }

  async function reset() {
    await db.deleteDB()
  }

  return {
    getAll, add, update, remove, clear, get, load, reset,
    count: () => db.count(),
    exportEach: db.exportEach.bind(db),
    importBatch: db.importBatch.bind(db),
  }
})

export { db as trainingPlaylistsDb }
