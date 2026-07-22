import { defineStore } from 'pinia'
import { Database, type Stored } from '~~/lib/db/database'

export type TrainingCase = {
  setId: string
  algorithmId: string
}

export type TrainingPlaylist = Stored<{
  name: string
  puzzleId: string
  trainingCases: TrainingCase[]
  createdAt: number
}>

const db = new Database<TrainingPlaylist>('training-playlists', 'training-playlists', {
  version: 1,
  indexes: [
    { name: 'createdAt', keyPath: 'createdAt' },
    { name: 'puzzleId', keyPath: 'puzzleId' },
  ],
})

export const useTrainingPlaylistsStore = defineStore('trainingPlaylists', () => {
  async function getAll(): Promise<TrainingPlaylist[]> {
    if (!import.meta.client) return []
    const all = await db.getAll()
    return all.sort((a, b) => b.createdAt - a.createdAt)
  }

  async function add(playlist: Omit<TrainingPlaylist, 'id' | 'createdAt'>): Promise<number> {
    const entry: TrainingPlaylist = { ...playlist, createdAt: Date.now() }
    const id = await db.add(entry)
    return id as number
  }

  async function update(playlist: TrainingPlaylist): Promise<void> {
    await db.put(playlist)
  }

  async function remove(id: number): Promise<void> {
    await db.delete(id)
  }

  async function clear(): Promise<void> {
    await db.clear()
  }

  async function get(id: number): Promise<TrainingPlaylist | undefined> {
    return db.get(id)
  }

  async function getByPuzzleId(puzzleId: string): Promise<TrainingPlaylist[]> {
    const all = await db.getAllByIndex('puzzleId', puzzleId)
    return all.sort((a, b) => b.createdAt - a.createdAt)
  }

  async function load() {}

  async function reset() {
    await db.deleteDB()
  }

  return {
    getAll, add, update, remove, clear, get, getByPuzzleId, load, reset,
    count: () => db.count(),
    exportEach: db.exportEach.bind(db),
    importBatch: db.importBatch.bind(db),
  }
})
