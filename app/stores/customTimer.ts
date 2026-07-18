import type { TrainingAlgorithm, TrainingSet } from "~~/lib/cube/cubesDefinition"

export const useCustomTimerStore = defineStore('customTimer', ()=>{
    const trainingSet = ref<TrainingSet|null>(null)
    const puzzle = ref<string|null>(null)
    const defaultAlgorithms = ref<TrainingAlgorithm[]>([])

    function useTrainingSetDefault(puzzleId: string){
        puzzle.value = puzzleId
        defaultAlgorithms.value = []
        trainingSet.value = {
            id: 'default',
            name: 'Default',
            description: 'Default training set',
            imageUrl: '',
            algorithms: () => Promise.resolve(defaultAlgorithms.value)
        }
    }

    function useTrainingSet(set: TrainingSet){
        trainingSet.value = set
    }

    function addAlgorithmToTrainingSet(algorithm: TrainingAlgorithm){
        if(!trainingSet.value) return
        if(defaultAlgorithms.value.find(a => a.id === algorithm.id)) return
        defaultAlgorithms.value.push(algorithm)
    }

    return {
        trainingSet,
        useTrainingSetDefault,
        useTrainingSet,
        addAlgorithmToTrainingSet,
        puzzle
    }
})
