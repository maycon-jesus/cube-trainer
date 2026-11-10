import { cubesDefinition, type CubeData, type TrainingAlgorithm, type TrainingSet } from "~~/lib/cube/cubesDefinition"
import type { Solve } from '~/stores/db/solves'

export type SolveTraining = {
    set: TrainingSet
    algorithm: TrainingAlgorithm
    setName: string
    algorithmName: string
}

// Cache module-level dos sets já carregados por puzzle e locale. Reativo para que os labels
// que dependem dele sejam re-renderizados quando o chunk de treino (e suas mensagens) chegar.
const loadedSets = reactive<Record<string, TrainingSet[]>>({})
const requestedSets = new Set<string>()

function ensureTrainingSetsLoaded(puzzle: string, locale: string, loadSets: (puzzle: CubeData) => Promise<TrainingSet[]>) {
    const key = `${locale}:${puzzle}`
    if (loadedSets[key] || requestedSets.has(key)) return
    const data = cubesDefinition[puzzle]
    if (!data?.loadTrainingSets) return
    requestedSets.add(key)
    loadSets(data).then((sets) => {
        loadedSets[key] = sets
    })
}

export function useTrainingLabels() {
    const { t, locale } = useI18n()
    const loadSets = useTrainingSetLoader()

    // The owning set is resolved from the algorithm id, which is unique within a
    // puzzle (the set id is embedded in it, e.g. `oll-1`), so the solve doesn't
    // need to store the set separately.
    function findAlgorithm(puzzle: string, algorithmId: string): { set: TrainingSet, algorithm: TrainingAlgorithm } | undefined {
        if (!algorithmId) return undefined
        ensureTrainingSetsLoaded(puzzle, locale.value, loadSets)
        for (const set of loadedSets[`${locale.value}:${puzzle}`] ?? []) {
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
