import { JOURNAL_STORE } from '~~/lib/db/indexedDatabase'
import { LEGACY_DATABASES, LEGACY_SECTIONS, type LegacyData, type LegacySection, type MigratedData } from './schema'

const SNAPSHOT_DB = 'legacy-migration-v1'
const SNAPSHOT_STORE = 'snapshot'
const SNAPSHOT_KEY = 'data'

function request<R>(req: IDBRequest<R>): Promise<R> {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

async function exists(name: string): Promise<boolean | undefined> {
    if (typeof indexedDB.databases !== 'function') return undefined
    try {
        return (await indexedDB.databases()).some((db) => db.name === name && (db.version ?? 0) > 0)
    } catch {
        return undefined
    }
}

/** Opens a database only if it already exists; never leaves an empty one behind. */
export async function openExisting(name: string): Promise<IDBDatabase | null> {
    if (await exists(name) === false) return null

    const db = await new Promise<IDBDatabase | null>((resolve, reject) => {
        let creating = false
        const req = indexedDB.open(name)
        req.onupgradeneeded = () => {
            // It did not exist: abort the creation instead of leaving an empty v1 database,
            // which would stop the new store from ever running its own upgrade.
            creating = true
            const created = req.result
            req.transaction!.abort()
            created.close()
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = (ev) => {
            if (!creating) return reject(req.error)
            ev.preventDefault()
            resolve(null)
        }
    })
    if (!db) await deleteDatabase(name)
    return db
}

/**
 * A legacy database is one that still has the pre-refactor layout. Databases that reuse
 * their name in the new layout are told apart by the missing journal store.
 */
export function isLegacyLayout(section: LegacySection, db: IDBDatabase): boolean {
    const legacy = LEGACY_DATABASES[section]
    if (!db.objectStoreNames.contains(legacy.store)) return false
    return !legacy.sharesNameWithCurrent || !db.objectStoreNames.contains(JOURNAL_STORE)
}

export async function hasLegacyLayout(section: LegacySection): Promise<boolean> {
    const db = await openExisting(LEGACY_DATABASES[section].name)
    if (!db) return false
    try {
        return isLegacyLayout(section, db)
    } finally {
        db.close()
    }
}

/** Reads every legacy section, or returns `null` when there is nothing to migrate. */
export async function readLegacyData(): Promise<LegacyData | null> {
    const data: LegacyData = { sessions: [], solves: [], trainingPlaylists: [], config: [] }
    let found = false

    for (const section of LEGACY_SECTIONS) {
        const { name, store } = LEGACY_DATABASES[section]
        const db = await openExisting(name)
        if (!db) continue
        try {
            if (!isLegacyLayout(section, db)) continue
            found = true
            // getAll returns rows in primary-key order, which the converter relies on.
            const rows = await request(db.transaction(store, 'readonly').objectStore(store).getAll())
            ;(data[section] as unknown[]) = rows
        } finally {
            db.close()
        }
    }

    return found ? data : null
}

export function deleteDatabase(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(name)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
        // Another tab (still running the old build) holds a connection; the delete
        // proceeds as soon as it closes, so keep waiting instead of failing.
        req.onblocked = () => console.warn(`[legacy-db] waiting for other tabs to release "${name}"`)
    })
}

// Snapshot: the converted data is persisted before any legacy database is deleted, so an
// interrupted migration resumes from it (with the same UUIDs) instead of losing data.

function openSnapshotDb(): Promise<IDBDatabase> {
    const req = indexedDB.open(SNAPSHOT_DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(SNAPSHOT_STORE)
    return request(req)
}

export async function loadSnapshot(): Promise<MigratedData | null> {
    const db = await openExisting(SNAPSHOT_DB)
    if (!db) return null
    try {
        if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) return null
        const tx = db.transaction(SNAPSHOT_STORE, 'readonly')
        return (await request(tx.objectStore(SNAPSHOT_STORE).get(SNAPSHOT_KEY))) ?? null
    } finally {
        db.close()
    }
}

export async function saveSnapshot(data: MigratedData): Promise<void> {
    const db = await openSnapshotDb()
    try {
        const tx = db.transaction(SNAPSHOT_STORE, 'readwrite')
        tx.objectStore(SNAPSHOT_STORE).put(data, SNAPSHOT_KEY)
        await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve()
            tx.onabort = () => reject(tx.error ?? new Error('Snapshot transaction aborted'))
        })
    } finally {
        db.close()
    }
}

export function deleteSnapshot(): Promise<void> {
    return deleteDatabase(SNAPSHOT_DB)
}
