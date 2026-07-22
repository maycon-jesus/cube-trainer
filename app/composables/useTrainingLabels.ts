import { cubesDefinition, type TrainingAlgorithm, type TrainingSet } from '~~/lib/cube/cubesDefinition'
import type { Solve } from '~/stores/db/solves'

export type SolveTraining = {
    set: TrainingSet
    algorithm: TrainingAlgorithm
    setName: string
    algorithmName: string
}

export function useTrainingLabels() {
    const { t } = useI18n()

    // The owning set is resolved from the algorithm id, which is unique within a
    // puzzle (the set id is embedded in it, e.g. `oll-1`), so the solve doesn't
    // need to store the set separately.
    function findAlgorithm(puzzle: string, algorithmId: string): { set: TrainingSet, algorithm: TrainingAlgorithm } | undefined {
        if (!algorithmId) return undefined
        for (const set of cubesDefinition[puzzle]?.trainingSets ?? []) {
            const algorithm = set.algorithms.find(it => it.id === algorithmId)
            if (algorithm) return { set, algorithm }
        }
        return undefined
    }

    function label(entity?: { name?: string, nameKey?: string }): string {
        if (!entity) return ''
        return entity.name ?? (entity.nameKey ? t(entity.nameKey) : '')
    }

    function ofSolve(solve: Solve): SolveTraining | null {
        if (solve.type !== 'training') return null
        const found = findAlgorithm(solve.puzzle, solve.trainingAlgorithmId)
        if (!found) return null
        return { ...found, setName: label(found.set), algorithmName: label(found.algorithm) }
    }

    return { findAlgorithm, label, ofSolve }
}
