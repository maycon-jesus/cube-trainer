/**
 * One-off migration from the pre-UUID IndexedDB layout (numeric ids, databases `session`,
 * `solves-history`, `training-playlists`, `config`) to the current one.
 *
 * Self-contained on purpose. To drop legacy support, delete this folder and
 * `app/plugins/legacy-db-migration.client.ts`.
 */
import { IndexedDatabase } from '~~/lib/db/indexedDatabase'
import { LegacyConverter } from './converter'
import {
    deleteDatabase, deleteSnapshot, hasLegacyLayout, loadSnapshot, readLegacyData, saveSnapshot,
} from './idb'
import { LEGACY_DATABASES, LEGACY_SECTIONS, type LegacySection, type MigratedData } from './schema'

export type MigrationTarget<Row> = { importBatch(rows: Row[]): Promise<void> }
export type MigrationTargets = { [K in LegacySection]: MigrationTarget<MigratedData[K][number]> }

const WRITE_BATCH_SIZE = 1000
const LOCK_NAME = 'cube-trainer:legacy-db-migration-v1'

/** Runs `fn` while holding a cross-tab lock, so two tabs never migrate at the same time. */
function withLock(fn: () => Promise<void>): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.locks) {
        return navigator.locks.request(LOCK_NAME, fn)
    }
    return fn()
}

async function writeSection<K extends LegacySection>(target: MigrationTargets[K], rows: MigratedData[K]) {
    for (let i = 0; i < rows.length; i += WRITE_BATCH_SIZE) {
        await target.importBatch(rows.slice(i, i + WRITE_BATCH_SIZE) as never)
    }
}

/**
 * Idempotent and resumable. Steps:
 *  1. read + convert the legacy data and persist it as a snapshot (or resume an existing one);
 *  2. delete the legacy databases whose names the new layout reuses;
 *  3. write everything through the stores (`importBatch` = put, so retries are safe);
 *  4. delete the remaining legacy databases and the snapshot.
 *
 * Must run before any store opens its database.
 */
export async function migrateLegacyDatabases(targets: MigrationTargets): Promise<boolean> {
    if (!IndexedDatabase.supported) return false

    let migrated = false
    await withLock(async () => {
        let data = await loadSnapshot()
        if (!data) {
            const legacy = await readLegacyData()
            if (!legacy) return
            data = new LegacyConverter().convertAll(legacy)
            await saveSnapshot(data)
        }

        for (const section of LEGACY_SECTIONS) {
            const legacy = LEGACY_DATABASES[section]
            if (legacy.sharesNameWithCurrent && await hasLegacyLayout(section)) {
                await deleteDatabase(legacy.name)
            }
        }

        for (const section of LEGACY_SECTIONS) {
            await writeSection(targets[section], data[section])
        }

        for (const section of LEGACY_SECTIONS) {
            const legacy = LEGACY_DATABASES[section]
            if (!legacy.sharesNameWithCurrent) await deleteDatabase(legacy.name)
        }
        await deleteSnapshot()
        migrated = true
    })
    return migrated
}

