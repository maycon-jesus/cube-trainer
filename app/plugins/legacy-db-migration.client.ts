import { migrateLegacyDatabases } from '~/migrations/legacy-v1'
import { configDb } from '~/stores/db/config'
import { sessionsDb } from '~/stores/db/sessions'
import { solvesDb } from '~/stores/db/solves'
import { trainingPlaylistsDb } from '~/stores/db/trainingPlaylists'

// TODO(legacy-db): remove together with app/migrations/legacy-v1 once the old layout is dropped.
// Async plugins are awaited before the app mounts, so no store touches IndexedDB before this ends.
// Uses the store databases directly: the stores need a component setup context (useTheme).
export default defineNuxtPlugin({
    name: 'legacy-db-migration',
    async setup() {
        try {
            await migrateLegacyDatabases({
                sessions: sessionsDb,
                solves: solvesDb,
                trainingPlaylists: trainingPlaylistsDb,
                config: configDb,
            })
        } catch (err) {
            // The snapshot is kept, so the next load retries from where this one stopped.
            console.error('[legacy-db] migration failed', err)
        }
    },
})
