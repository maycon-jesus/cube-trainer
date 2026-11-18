import { TrainingSetAlgorithm } from "../../types/training"

function createAlgorithm(name: string, solves: string[]): TrainingSetAlgorithm {
    return {
        name: `puzzles.3x3x3.sets.basic.cases.${name}`,
        id: `basic-${name}`,
        imageUrl: `/img/puzzles/3x3x3/training-sets/basic/${name}.svg`,
        solves: solves
    }
}

const basicAlgorithms: TrainingSetAlgorithm[] = [
    createAlgorithm("second-layer-1", ["U R U' R' U' F' U F"]),
    createAlgorithm("second-layer-2", ["U' L' U L U F U' F'"]),
    createAlgorithm("yellow-cross-1", ["F R U R' U' F'"]),
    createAlgorithm("yellow-cross-2", ["F R U R' U' F'"]),
    createAlgorithm("yellow-cross-3", ["F R U R' U' F'"]),
    createAlgorithm("yellow-face-1", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-2", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-3", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-4", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-5", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-6", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-face-7", ["R U R' U R U2 R'"]),
    createAlgorithm("yellow-corner-1", ["R B' R F2 R' B R F2 R2"]),
    createAlgorithm("yellow-corner-2", ["R B' R F2 R' B R F2 R2"]),
    createAlgorithm("yellow-middle-clockwise", ["F2 U L R' F2 L' R U F2"]),
    createAlgorithm("yellow-middle-anticlockwise", ["F2 U' L R' F2 L' R U' F2"]),
]

export default basicAlgorithms
