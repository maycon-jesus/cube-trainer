import { migrateLegacyDatabases } from '~/migrations/legacy-v1'
import { useConfigStore } from '~/stores/db/config'
import { useSessionsStore } from '~/stores/db/sessions'
import { useSolvesStore } from '~/stores/db/solves'
import { useTrainingPlaylistsStore } from '~/stores/db/trainingPlaylists'

// TODO(legacy-db): remove together with app/migrations/legacy-v1 once the old layout is dropped.
// Async plugins are awaited before the app mounts, so no store touches IndexedDB before this ends.
export default defineNuxtPlugin({
    name: 'legacy-db-migration',
    async setup() {
        try {
            await migrateLegacyDatabases({
                sessions: useSessionsStore(),
                solves: useSolvesStore(),
                trainingPlaylists: useTrainingPlaylistsStore(),
                config: useConfigStore(),
            })
        } catch (err) {
            // The snapshot is kept, so the next load retries from where this one stopped.
            console.error('[legacy-db] migration failed', err)
        }
    },
})
