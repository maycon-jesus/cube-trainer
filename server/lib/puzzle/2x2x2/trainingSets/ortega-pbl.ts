import { TrainingSetAlgorithm } from "../../types/training"

function createAlgorithm(name: string, solves: string[]): TrainingSetAlgorithm {
    return {
        name: `puzzles.2x2x2.sets.ortega-pbl.cases.${name}`,
        id: `ortega-pbl-${name}`,
        imageUrl: `/img/puzzles/2x2x2/training-sets/ortega-pbl/${name}.svg`,
        solves: solves
    }
}


export const ortegaPbl: TrainingSetAlgorithm[] = [
    createAlgorithm("adj", ["y R U2 R' U' R U2 L' U R' U' L"]),
    createAlgorithm("opp", ["R U' R' U' F2 U' R U R' D R2"]),
    createAlgorithm("opp-opp", ["R2 F2 R2"]),
    createAlgorithm("adj-adj", ["R2 U R2 U D R2 U R2"]),
    createAlgorithm("adj-opp", ["R U' R F2 R' U R'"]),
    createAlgorithm("opp-adj", ["R' D R' F2 R D' R"]),
]