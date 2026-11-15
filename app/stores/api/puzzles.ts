export const usePuzzles = defineStore('api-puzzles', () => {
    const apiGetPuzzles = useApiGetPuzzles().useAsyncData()

    const puzzles = apiGetPuzzles
    const puzzlesList = computed(() => {
        return puzzles.data.value ?? []
    })

    const getPuzzle = (id: string) => {
        return computed(() => puzzlesList.value.find(p => p.id === id))
    }

    const getPuzzlesWithTrainingSet = () => computed(() => {
        return puzzlesList.value.filter(p => p.hasTrainingSets)
    })

    const load = () => {
        return apiGetPuzzles
    }

    return {
        getPuzzles: puzzlesList,
        getPuzzlesWithTrainingSet,
        getPuzzle,
        load
    }
})