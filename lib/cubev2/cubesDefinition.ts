import { generateScramble as generateScrambleMegaminx } from "./megaminx"
import { generateScramble as generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import { Engine as Engine333 } from "./3x3x3/engine"
import { generateScramble as generateScramble333, invertScramble as invertScramble333 } from "./3x3x3/scramble"

export type CubeData = {
    id: string,
    icon: string,
    createEngine?: () => CubeEngine
    generateScramble?: (movesCount?: number) => string,
    invertScramble?: (scramble: string) => string
}

export const cubesDefinition: Record<string, CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        generateScramble: generateScramble333,
        icon: "Cube2x2x2"
    },
    "3x3x3": {
        id: "3x3x3",
        generateScramble: generateScramble333,
        invertScramble: invertScramble333,
        icon: "Cube3x3x3",
        createEngine: () => new Engine333()
    },
    "4x4x4": {
        id: "4x4x4",
        icon: "Cube4x4x4"
    },
    "5x5x5": {
        id: "5x5x5",
        icon: "Cube5x5x5"
    },
    "6x6x6": {
        id: "6x6x6",
        icon: "Cube6x6x6"
    },
    "7x7x7": {
        id: "7x7x7",
        icon: "Cube7x7x7"
    },
    "pyraminx": {
        id: "pyraminx",
        generateScramble: generateScramblePyraminx,
        icon: "Pyraminx"
    },
    "megaminx": {
        id: "megaminx",
        generateScramble: generateScrambleMegaminx,
        icon: "Megaminx"
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        icon: "Mirror3x3"
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        icon: "Mirror2x2"
    },
    "gear-2x2x2": {
        id: "gear-2x2x2",
        icon: "GearCube2x2x2"
    },
    "gear-3x3x3": {
        id: "gear-3x3x3",
        icon: "GearCube3x3x3"
    },
    "fto": {
        id: "fto",
        icon: "FTO"
    },
    "other": {
        id: "other",
        icon: "Puzzle"
    }
}