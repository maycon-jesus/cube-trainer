import { TrainingSetAlgorithm } from "../../types/training"

function createAlgorithm(name: string, solves: string[]) {
    return {
        name: `puzzles.3x3x3.sets.f2l.cases.${name}`,
        id: `f2l-${name}`,
        imageUrl: `/img/puzzles/3x3x3/training-sets/f2l/${name}.png`,
        solves: solves
    }
}

const f2lAlgorithms: TrainingSetAlgorithm[] = [
    createAlgorithm("case-1", ["R U R'"]),
    createAlgorithm("case-2", ["L' U' L"]),
    createAlgorithm("case-3", ["U' L' U L"]),
    createAlgorithm("case-4", ["U R U' R'"]),
    createAlgorithm("case-5", ["U R U' R' F R' F' R"]),
    createAlgorithm("case-6", ["U' L' U L F' L F L'"]),
    createAlgorithm("case-7", ["R2 U2 F R2 F' U2 R' U R'"]),
    createAlgorithm("case-8", ["U L' U L U2 L' U L"]),
    createAlgorithm("case-9", ["U' R U' R' U2 R U' R'"]),
    createAlgorithm("case-10", ["U L' U' L U' F U F'"]),
    createAlgorithm("case-11", ["U' R U R' U F' U' F"]),
    createAlgorithm("case-12", ["U R U' R' U R U' R' U R U' R'"]),
    createAlgorithm("case-13", ["U' R' F R F' R U' R'"]),
    createAlgorithm("case-14", ["U L' U2 L U' F U F'"]),
    createAlgorithm("case-15", ["U' R U2 R' U F' U' F"]),
    createAlgorithm("case-16", ["U' R U' R' U R U R'"]),
    createAlgorithm("case-17", ["U L' U L U' L' U' L"]),
    createAlgorithm("case-18", ["R U' R' U2 F' U' F"]),
    createAlgorithm("case-19", ["L' U L U2 F U F'"]),
    createAlgorithm("case-20", ["R U2 R' U' R U R'"]),
    createAlgorithm("case-21", ["L' U2 L U L' U' L"]),
    createAlgorithm("case-22", ["U' L' U L U L' U L U' L' U L"]),
    createAlgorithm("case-23", ["U R U' R' U' R U' R' U R U' R'"]),
    createAlgorithm("case-24", ["U2 R U R' U R U' R'"]),
    createAlgorithm("case-25", ["U2 L' U' L U' L' U L"]),
    createAlgorithm("case-26", ["U R U2 R' U R U' R'"]),
    createAlgorithm("case-27", ["U' L' U2 L U' L' U L"]),
    createAlgorithm("case-28", ["U' R U' R' U R U' R'"]),
    createAlgorithm("case-29", ["U L' U L U' L' U L"]),
    createAlgorithm("case-30", ["U' R U R' U' R U R'"]),
    createAlgorithm("case-31", ["U L' U' L U L' U' L"]),
    createAlgorithm("case-32", ["R U' R' U R U2 R' U R U' R'"]),
    createAlgorithm("case-33", ["R U' R' U' R U R' U2 R U' R'"]),
    createAlgorithm("case-34", ["R U' R' Rw U' Rw' U2 Rw U Rw'"]),
    createAlgorithm("case-35", ["Rw U' Rw' U2 Rw U Rw' R U R'"]),
    createAlgorithm("case-36", ["U L' U2 L U L' U2 L"]),
    createAlgorithm("case-37", ["U' R U2 R' U' R U2 R'"]),
    createAlgorithm("case-38", ["U L' U' L U2 L' U L"]),
    createAlgorithm("case-39", ["U' R U R' U2 R U' R'"]),
    createAlgorithm("case-40", ["U' R U R' U R U R'"]),
    createAlgorithm("case-41", ["U L' U' L U' L' U' L"]),
]

export default f2lAlgorithms
