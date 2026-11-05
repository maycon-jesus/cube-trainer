import { generateScramble as generateScramble3x3x3 } from "./3x3x3"
import { generateScramble as generateScrambleMegaminx } from "./megaminx"
import { generateScramble as generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import type { TrainingSet } from "./training/types"
import type { CubePattern } from "./patterns/types"
import trainingSets333 from "./3x3x3/training"
import patterns333 from "./3x3x3/patterns"
import {trainingSets as trainingSets222} from "./2x2x2/training"

export type { TrainingAlgorithm, TrainingSet } from "./training/types"
export type { CubePattern, PatternDifficulty } from "./patterns/types"

export type CubeData = {
    id: string,
    name: string,
    cubeEngine?: CubeEngine,
    imageUrl?: string,
    generateScramble?: (movesCount?: number) => string,
    icon: string,
    trainingSets?: TrainingSet[],
    patterns?: CubePattern[]
}

export const cubesDefinition: Record<string, CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        name: "2x2x2",
        generateScramble: generateScramble3x3x3,
        icon: "Cube2x2x2",
        imageUrl: '/img/puzzle/2x2x2.png',
        trainingSets: trainingSets222
    },
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3",
        generateScramble: generateScramble3x3x3,
        icon: "Cube3x3x3",
        imageUrl: '/img/puzzle/3x3x3.png',
        trainingSets: trainingSets333,
        patterns: patterns333
    },
    "4x4x4": {
        id: "4x4x4",
        name: "4x4x4",
        icon: "Cube4x4x4"
    },
    "5x5x5": {
        id: "5x5x5",
        name: "5x5x5",
        icon: "Cube5x5x5"
    },
    "6x6x6": {
        id: "6x6x6",
        name: "6x6x6",
        icon: "Cube6x6x6"
    },
    "7x7x7": {
        id: "7x7x7",
        name: "7x7x7",
        icon: "Cube7x7x7"
    },
    "pyraminx": {
        id: "pyraminx",
        name: "Pyraminx",
        generateScramble: generateScramblePyraminx,
        icon: "Pyraminx"
    },
    "megaminx": {
        id: "megaminx",
        name: "Megaminx",
        generateScramble: generateScrambleMegaminx,
        icon: "Megaminx"
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        name: "Mirror 3x3x3",
        icon: "Mirror3x3"
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        name: "Mirror 2x2x2",
        icon: "Mirror2x2"
    },
    "gear-2x2x2": {
        id: "gear-2x2x2",
        name: "Gear Cube 2x2x2",
        icon: "GearCube2x2x2"
    },
    "gear-3x3x3": {
        id: "gear-3x3x3",
        name: "Gear Cube 3x3x3",
        icon: "GearCube3x3x3"
    },
    "fto": {
        id: "fto",
        name: "FTO",
        icon: "FTO"
    },
    "other": {
        id: "other",
        name: "Other",
        icon: "Puzzle"
    }
}