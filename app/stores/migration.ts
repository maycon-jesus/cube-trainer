import { useConfigStore } from "./db/config"
import { useSessionsStore } from "./db/sessions"
import { useSolvesStore } from "./db/solves"

export interface DatabaseMigration {
    load(): Promise<void>
    reset(): Promise<void>
}

export const useMigrationStore = defineStore('migration', () => {
    const modules: DatabaseMigration[] = [
        useSessionsStore(),
        useSolvesStore(),
        useConfigStore(),
    ]

    async function load() {
        for (const module of modules) {
            await module.load()
        }
    }

    async function reset() {
        for (const module of modules) {
            await module.reset()
        }
    }

    async function resetAndLoad() {
        await reset()
        await load()
    }

    return { load, reset, resetAndLoad }
})