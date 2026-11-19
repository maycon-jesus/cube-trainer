import { TrainingSetAlgorithm } from "../../types/training"
import { invertScramble, randomAUFScramble } from "../cube"

export function newAlgorithmSetup(setId: string, algorithId: string, solve: string): TrainingSetAlgorithm {
    return {
        name: `training.2x2x2.${setId}.cases.${algorithId}`,
        id: algorithId,
        imageUrl: `/img/training/2x2x2/${setId}/${algorithId}.svg`,
        solves: [
            solve
        ]
    }
}
