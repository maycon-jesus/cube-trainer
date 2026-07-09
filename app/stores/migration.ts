import { useConfigStore } from "./db/config"
import { useSessionsStore } from "./db/sessions"
import { useSolvesStore } from "./db/solves"

function downloadFile(content:BlobPart[], filename:string, mimeType = 'text/plain') {
  const blob = new Blob(content, { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url); // free memory
}

export interface DatabaseMigration {
    $id: string,
    load(): Promise<void>
    reset(): Promise<void>
    exportAll(): Promise<unknown[]>
    importAll(data: unknown[]): Promise<void>
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

    async function exportAll(filename = 'cube-trainer-export'): Promise<void> {
        const allData: Record<string, unknown[]> = {}
        for (const module of modules) {
            const data = await module.exportAll()
            allData[module.$id] = data
        }
        const jsonData = JSON.stringify(allData, null, 2)
        const safeFilename = filename.trim().replace(/\.json$/i, '') || 'cube-trainer-export'
        downloadFile([jsonData], `${safeFilename}.json`, 'application/json')
    }

    async function importAll(data: Record<string, unknown[]>): Promise<void> {
        for (const module of modules) {
            const moduleData = data[module.$id]
            if (moduleData) {
                await module.importAll(moduleData)
            }
        }
        await load() // Reload data after import
    }

    return { load, reset, resetAndLoad ,exportAll,importAll}
})