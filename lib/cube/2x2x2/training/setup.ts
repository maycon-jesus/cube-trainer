import type { TrainingAlgorithm } from "../../training/types"
import { invertScramble, randomAUFScramble } from "../cube"

export function newAlgorithmSetup(setId: string, algorithId:string, solve: string): TrainingAlgorithm {
    const scramble = randomAUFScramble(invertScramble(solve))

    return {
        nameKey: `training.2x2x2.${setId}.cases.${algorithId}`,
        id: algorithId,
        imageUrl: `/img/training/2x2x2/${setId}/${algorithId}.svg`,
        generateSetupScramble: ()=> Promise.resolve(scramble),
        solves: [
            solve
        ]
    }
}
