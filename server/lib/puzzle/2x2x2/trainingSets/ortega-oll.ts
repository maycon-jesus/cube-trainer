import { TrainingSetAlgorithm } from "../../types/training";

function createAlgorithm(name: string, solves: string[]): TrainingSetAlgorithm {
    return {
        name: `puzzles.2x2x2.sets.ortega-oll.cases.${name}`,
        id: `ortega-oll-${name}`,
        imageUrl: `/img/puzzles/2x2x2/training-sets/ortega-oll/${name}.svg`,
        solves: solves
    }
}

export const ortegaOll: TrainingSetAlgorithm[] = [
    createAlgorithm("sune", ["R U R' U R U2 R'"]),
    createAlgorithm("anti-sune", ["R U2 R' U' R U' R'"]),
    createAlgorithm("u", ["F R U R' U' F'"]),
    createAlgorithm("t", ["R U R' U' R' F R F'"]),
    createAlgorithm("h", ["R2 U2 R U2 R2"]),
    createAlgorithm("pi", ["F R U R' U' R U R' U' F'"]),
    createAlgorithm("l", ["R U R U' L' U R' U' x'"])
]
