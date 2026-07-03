import { generateScramble333 } from "./333"
import { generateScrambleMegaminx } from "./megaminx"
import type { CubeEngine } from "./cube"

export type CubeData = {
    id: string,
    name: string,
    cubeEngine?: CubeEngine,
    generateScramble?: (movesCount?: number) => string,
}

export const cubesDefinition: Record<string, CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        name: "2x2x2",
        generateScramble: generateScramble333
    },
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3",
        generateScramble: generateScramble333
    },
    "4x4x4": {
        id: "4x4x4",
        name: "4x4x4"
    },
    "5x5x5": {
        id: "5x5x5",
        name: "5x5x5"
    },
    "6x6x6": {
        id: "6x6x6",
        name: "6x6x6"
    },
    "7x7x7": {
        id: "7x7x7",
        name: "7x7x7"
    },
    "pyraminx": {
        id: "pyraminx",
        name: "Pyraminx"
    },
    "megaminx": {
        id: "megaminx",
        name: "Megaminx",
        generateScramble: generateScrambleMegaminx
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        name: "Mirror 3x3x3"
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        name: "Mirror 2x2x2"
    },
    "other": {
        id: "other",
        name: "Other"
    }
}