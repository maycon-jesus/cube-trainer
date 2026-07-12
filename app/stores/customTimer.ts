import type { TrainingSet } from "~~/lib/cube/cubesDefinition"

export const useCustomTimerStore = defineStore('customTimer', ()=>{
    const trainingSet = ref<TrainingSet|null>(null)
    const puzzle = ref<string|null>(null)

    function useTrainingSetDefault(puzzleId: string){
        puzzle.value = puzzleId
        trainingSet.value = {
            id: 'default',
            name: 'Default',
            description: 'Default training set',
            imageUrl: '',
            algorithms: []
        }
    }

    function useTrainingSet(set: TrainingSet){
        trainingSet.value = set
    }

    function addAlgorithmToTrainingSet(algorithm: TrainingSet['algorithms'][0]){
        if(!trainingSet.value) return
        if(trainingSet.value.algorithms.find(a => a.id === algorithm.id)) return
        trainingSet.value.algorithms.push(algorithm)
    }

    return {
        trainingSet,
        useTrainingSetDefault,
        useTrainingSet,
        addAlgorithmToTrainingSet,
        puzzle
    }
})