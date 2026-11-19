import { TrainingSetAlgorithm } from "../../types/training";
import { newAlgorithmSetup } from "./setup";

function createAlgorithm(name: string, solves: string[]): TrainingSetAlgorithm {
    return {
        name: `puzzles.2x2x2.sets.ortega-pbl.cases.${name}`,
        id: `ortega-oll-${name}`,
        imageUrl: `/img/puzzles/2x2x2/training-sets/ortega-pbl/${name}.svg`,
        solves: solves
    }
}

export const ortegaOll: TrainingSetAlgorithm[] = [
    createAlgorithm("1", ["R U R' U R U2 R'"]),
    createAlgorithm("2", ["R U2 R' U' R U' R'"]),
    createAlgorithm("3", ["F R U R' U' F'"]),
    createAlgorithm("4", ["R U R' U' R' F R F'"]),
    createAlgorithm("5", ["R2 U2 R U2 R2"]),
    createAlgorithm("6", ["F R U R' U' R U R' U' F'"]),
    createAlgorithm("7", ["R U R U' L' U R' U' x'"])
]