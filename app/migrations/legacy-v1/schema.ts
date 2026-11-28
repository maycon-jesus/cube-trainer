import type { Config } from '~/stores/db/config'
import type { Session } from '~/stores/db/sessions'
import type { Penalty, Solve, Type } from '~/stores/db/solves'
import type { TrainingCase, TrainingPlaylist } from '~/stores/db/trainingPlaylists'

/**
 * Where each section lived before the UUID refactor. `sharesNameWithCurrent` marks the databases
 * whose name (and version 1) is reused by the new layout: they must be deleted before the new
 * store opens them, otherwise `onupgradeneeded` never runs and the `__journal` store is missing.
 */
export const LEGACY_DATABASES = {
    sessions: { name: 'session', store: 'session', sharesNameWithCurrent: false },
    solves: { name: 'solves-history', store: 'solves', sharesNameWithCurrent: false },
    trainingPlaylists: { name: 'training-playlists', store: 'training-playlists', sharesNameWithCurrent: true },
    config: { name: 'config', store: 'config', sharesNameWithCurrent: true },
} as const

export type LegacySection = keyof typeof LEGACY_DATABASES

/** Section order matters: sessions must be converted before solves and config reference them. */
export const LEGACY_SECTIONS: LegacySection[] = ['sessions', 'solves', 'trainingPlaylists', 'config']

export type LegacySession = {
    id: number
    name: string
    createdAt: number
}

export type LegacySolve = {
    id: number
    ms: number
    scramble: string
    penalty?: Penalty
    createdAt: number
    puzzle: string
    type?: Type
    sessionId: number | string
    trainingAlgorithmId?: string
}

export type LegacyTrainingPlaylist = {
    id: number
    name: string
    puzzleId: string
    trainingCases: TrainingCase[]
    createdAt: number
}

export type LegacyConfig = {
    id: string
    value: unknown
}

export type LegacyData = {
    sessions: LegacySession[]
    solves: LegacySolve[]
    trainingPlaylists: LegacyTrainingPlaylist[]
    config: LegacyConfig[]
}

export type MigratedData = {
    sessions: Session[]
    solves: Solve[]
    trainingPlaylists: TrainingPlaylist[]
    config: Config[]
}
