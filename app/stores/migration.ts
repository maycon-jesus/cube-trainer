import { useConfigStore } from "./db/config"
import { useSessionsStore } from "./db/sessions"
import { useSolvesStore } from "./db/solves"
import { useTrainingPlaylistsStore } from "./db/trainingPlaylists"

function downloadFile(content:BlobPart[], filename:string, mimeType = 'text/plain') {
  const blob = new Blob(content, { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export interface DatabaseMigration {
    $id: string,
    load(): Promise<void>
    reset(): Promise<void>
    /** Wipe the store before an import. */
    clear(): Promise<void>
    /** Row count in the store. */
    count(): Promise<number>
    exportEach(onBatch: (rows: unknown[]) => Promise<void>, batchSize?: number): Promise<void>
    importBatch(rows: unknown[]): Promise<void>
}

/** Thrown when the imported file isn't a Cube Trainer export. */
export class InvalidBackupFileError extends Error {
    constructor() {
        super('Invalid backup file')
        this.name = 'InvalidBackupFileError'
    }
}

const EXPORT_HEADER = '#cube-trainer-export'
const IMPORT_BATCH_SIZE = 10000
const EXPORT_BATCH_SIZE = 10000

function sectionHeader(id: string): string {
    return `===${id}===`
}

function parseSectionHeader(line: string): string | null {
    const match = line.match(/^===(.+)===$/)
    return match ? match[1]! : null
}

// Minimal File System Access API typing (Chromium-only) to stream straight to disk.
interface FileSystemWritable {
    write(chunk: string): Promise<void>
    close(): Promise<void>
    abort(): Promise<void>
}
type ShowSaveFilePicker = (options?: {
    suggestedName?: string
    types?: { description?: string, accept: Record<string, string[]> }[]
}) => Promise<{ createWritable(): Promise<FileSystemWritable> }>

function getSaveFilePicker(): ShowSaveFilePicker | null {
    if (typeof window === 'undefined') return null
    const picker = (window as unknown as { showSaveFilePicker?: ShowSaveFilePicker }).showSaveFilePicker
    return typeof picker === 'function' ? picker : null
}

export const useMigrationStore = defineStore('migration', () => {
    const modules: DatabaseMigration[] = [
        useSessionsStore(),
        useSolvesStore(),
        useTrainingPlaylistsStore(),
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

    // Writes the export line by line: header with the row total, then a
    // ===<store>=== marker per store followed by its records (paged from IndexedDB).
    async function writeExport(
        write: (chunk: string) => Promise<void>,
        batchSize?: number,
        onProgress?: (exported: number, total: number) => void,
    ): Promise<void> {
        let total = 0
        for (const module of modules) total += await module.count()

        let exported = 0
        await write(`${EXPORT_HEADER} total=${total}\n`)
        for (const module of modules) {
            await write(`${sectionHeader(module.$id)}\n`)
            await module.exportEach(async (rows) => {
                let chunk = ''
                for (const row of rows) chunk += `${JSON.stringify(row)}\n`
                await write(chunk)
                exported += rows.length
                onProgress?.(exported, total)
            }, batchSize)
        }
    }

    /** Resolves `true` when the file was written, `false` when the user cancelled the save dialog. */
    async function exportAll(
        filename = 'cube-trainer-export',
        options: { batchSize?: number, onProgress?: (exported: number, total: number) => void } = {},
    ): Promise<boolean> {
        const { batchSize = EXPORT_BATCH_SIZE, onProgress } = options
        const safeFilename = filename.trim().replace(/\.txt$/i, '') || 'cube-trainer-export'
        const downloadName = `${safeFilename}.txt`

        // Chromium: stream straight to disk, so big exports never sit in memory.
        const picker = getSaveFilePicker()
        if (picker) {
            let handle: Awaited<ReturnType<ShowSaveFilePicker>> | null = null
            try {
                handle = await picker({
                    suggestedName: downloadName,
                    types: [{ description: 'Cube Trainer backup', accept: { 'text/plain': ['.txt'] } }],
                })
            } catch (err) {
                // User cancelled the save dialog.
                if ((err as DOMException)?.name === 'AbortError') return false
                console.error(err) // otherwise fall back to the Blob download
            }

            if (handle) {
                const writable = await handle.createWritable()
                try {
                    await writeExport((chunk) => writable.write(chunk), batchSize, onProgress)
                    await writable.close()
                    return true
                } catch (err) {
                    console.error(err)
                    await writable.abort().catch(() => {})
                    // fall through to the Blob download below
                }
            }
        }

        // Fallback (Firefox/Safari): build the file from Blob parts and download it.
        const parts: BlobPart[] = []
        await writeExport((chunk) => {
            parts.push(chunk)
            return Promise.resolve()
        }, batchSize, onProgress)
        downloadFile(parts, downloadName, 'text/plain')
        return true
    }

    async function importAll(
        file: File,
        options: { onProgress?: (imported: number, total: number) => void } = {},
    ): Promise<void> {
        const reader = file.stream().pipeThrough(new TextDecoderStream()).getReader()
        await importStreamed(reader, options.onProgress)
        await load()
    }

    async function importStreamed(
        reader: ReadableStreamDefaultReader<string>,
        onProgress?: (imported: number, total: number) => void,
    ): Promise<void> {
        const moduleById = new Map(modules.map((m) => [m.$id, m]))
        let current: DatabaseMigration | null = null
        let batch: unknown[] = []
        let buffer = ''
        let done = false
        let imported = 0
        let total = 0 // parsed from the export header
        let headerSeen = false

        const flush = async () => {
            if (current && batch.length) {
                await current.importBatch(batch)
                imported += batch.length
                onProgress?.(imported, total)
                batch = []
            }
        }

        const handleLine = async (raw: string) => {
            const line = raw.trim()
            if (line.startsWith(EXPORT_HEADER)) {
                headerSeen = true
                const match = line.match(/total=(\d+)/)
                if (match) total = Number(match[1])
                return
            }
            if (!line || line.startsWith('#')) return

            // Refuse to touch any store until the header confirmed a real export.
            if (!headerSeen) throw new InvalidBackupFileError()

            const sectionId = parseSectionHeader(line)
            if (sectionId !== null) {
                await flush()
                current = moduleById.get(sectionId) ?? null
                await current?.clear()
                return
            }

            if (!current) return
            batch.push(JSON.parse(line))
            if (batch.length >= IMPORT_BATCH_SIZE) await flush()
        }

        while (!done) {
            const { done: readerDone, value } = await reader.read()
            done = readerDone
            if (value) buffer += value

            let newlineIndex: number
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, newlineIndex)
                buffer = buffer.slice(newlineIndex + 1)
                await handleLine(line)
            }
        }
        // Last line if it has no trailing newline.
        if (buffer) await handleLine(buffer)
        if (!headerSeen) throw new InvalidBackupFileError()
        await flush()
    }

    return { load, reset, resetAndLoad ,exportAll,importAll}
})