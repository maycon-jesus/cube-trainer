import type { TrainingSet, TrainingSetAlgorithm } from '~~/shared/types/trainingSet'

export const useCustomTimerStore = defineStore('customTimer', () => {
    const puzzle = ref<string | null>(null)
    // Metadata comes from the API already translated, so the set is stored as-is.
    const trainingSet = ref<TrainingSet | null>(null)
    // Algorithms are kept apart from the set: the API set does not embed them.
    const algorithms = ref<TrainingSetAlgorithm[]>([])

    function useTrainingSetDefault(puzzleId: string) {
        puzzle.value = puzzleId
        trainingSet.value = {
            id: 'default',
            name: 'Default',
            description: 'Default training set',
            imageUrl: '',
            algorithmCount: 0,
            puzzleId,
        }
        algorithms.value = []
    }

    function useTrainingSet(set: TrainingSet, setAlgorithms: TrainingSetAlgorithm[]) {
        puzzle.value = set.puzzleId
        trainingSet.value = set
        algorithms.value = [...setAlgorithms]
    }

    function addAlgorithmToTrainingSet(algorithm: TrainingSetAlgorithm) {
        if (!trainingSet.value) return
        if (algorithms.value.some(a => a.id === algorithm.id)) return
        algorithms.value.push(algorithm)
    }

    return {
        puzzle,
        trainingSet,
        algorithms,
        useTrainingSetDefault,
        useTrainingSet,
        addAlgorithmToTrainingSet,
    }
})
