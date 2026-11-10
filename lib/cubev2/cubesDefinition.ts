import patterns333 from "./3x3x3/patterns"
import type { CubePattern } from "./patterns/types"

export type { TrainingAlgorithm, TrainingSet } from "./training/types"
export type { CubePattern, PatternDifficulty } from "./patterns/types"

export type CubeData = {
    id: string,
    name: string,
    patterns: CubePattern[],
}

export const cubesDefinition: Record<string, CubeData> = {
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3",
        patterns: patterns333,
    },
}