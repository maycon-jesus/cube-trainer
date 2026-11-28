import { createUuidv7Generator } from '~~/lib/uuid/v7'
import type { Config } from '~/stores/db/config'
import type { Session } from '~/stores/db/sessions'
import type { Solve } from '~/stores/db/solves'
import type { TrainingPlaylist } from '~/stores/db/trainingPlaylists'
import type {
    LegacyConfig, LegacyData, LegacySession, LegacySolve, LegacyTrainingPlaylist, MigratedData,
} from './schema'

const RECOVERED_SESSION_NAME = 'Sessão recuperada'

/**
 * Converts legacy rows (numeric autoincrement ids) into the UUIDv7 layout, keeping the
 * old-id -> new-id map so solves and config can be re-pointed at the migrated sessions.
 *
 * Rows must be fed in their old primary-key order: each section has its own UUIDv7
 * generator seeded with `createdAt`, so the new keys keep the old ordering while
 * carrying (approximately) the original creation time.
 */
export class LegacyConverter {
    private readonly sessionIds = new Map<string, string>()
    private readonly recovered: Session[] = []
    private readonly sessionUuid = createUuidv7Generator()
    private readonly solveUuid = createUuidv7Generator()
    private readonly playlistUuid = createUuidv7Generator()

    session(row: LegacySession): Session {
        const id = this.sessionUuid(row.createdAt)
        this.sessionIds.set(String(row.id), id)
        return { id, name: row.name, createdAt: row.createdAt }
    }

    solve(row: LegacySolve): Solve {
        const { id: _id, puzzle, trainingAlgorithmId, sessionId, ...rest } = row
        return {
            ...rest,
            id: this.solveUuid(row.createdAt),
            penalty: row.penalty ?? 'none',
            type: row.type ?? 'normal',
            puzzleId: puzzle,
            sessionId: this.resolveSession(sessionId, row.createdAt),
            trainingAlgorithmId: trainingAlgorithmId || undefined,
        }
    }

    trainingPlaylist(row: LegacyTrainingPlaylist): TrainingPlaylist {
        return { ...row, id: this.playlistUuid(row.createdAt) }
    }

    /** Re-points `sessionId` at the migrated session; any other entry is kept as is. */
    config(row: LegacyConfig): Config {
        if (row.id !== 'sessionId') return row as Config
        const mapped = this.sessionIds.get(String(row.value))
        return mapped ? { id: row.id, value: mapped } : row as Config
    }

    convertAll(data: LegacyData): MigratedData {
        const sessions = data.sessions.map((row) => this.session(row))
        const solves = data.solves.map((row) => this.solve(row))
        const trainingPlaylists = data.trainingPlaylists.map((row) => this.trainingPlaylist(row))
        const config = data.config.map((row) => this.config(row))
        return { sessions: [...sessions, ...this.takeRecoveredSessions()], solves, trainingPlaylists, config }
    }

    /** Sessions created for solves whose legacy session no longer exists (still user data). */
    private takeRecoveredSessions(): Session[] {
        return this.recovered.splice(0)
    }

    private resolveSession(legacyId: number | string, createdAt: number): string {
        const key = String(legacyId)
        const known = this.sessionIds.get(key)
        if (known) return known

        const session: Session = {
            id: this.sessionUuid(createdAt),
            name: `${RECOVERED_SESSION_NAME} #${key}`,
            createdAt,
        }
        this.sessionIds.set(key, session.id)
        this.recovered.push(session)
        return session.id
    }
}
