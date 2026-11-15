import { generateScramble as generateScrambleMegaminx } from "./megaminx"
import { generateScramble as generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import { Engine as Engine333 } from "./3x3x3/engine"
import { generateScramble as generateScramble333, invertScramble as invertScramble333, randomAUFScramble } from "./3x3x3/scramble"
import { newAlgorithmSetup } from "./3x3x3/training/setup"

export type PuzzleDefinition = {
    id: string,
    createEngine?: () => CubeEngine
    generateScramble?: (movesCount?: number) => string,
    generateAlgorithmSetup?: (scramble: string) => Promise<string>
    invertScramble?: (scramble: string) => string
}

export const puzzlesDefinition: Record<string, PuzzleDefinition> = {
    "2x2x2": {
        id: "2x2x2",
        generateScramble: generateScramble333,
    },
    "3x3x3": {
        id: "3x3x3",
        generateScramble: generateScramble333,
        invertScramble: invertScramble333,
        generateAlgorithmSetup: newAlgorithmSetup,
        createEngine: () => new Engine333()
    },
    "4x4x4": {
        id: "4x4x4",
    },
    "5x5x5": {
        id: "5x5x5",
    },
    "6x6x6": {
        id: "6x6x6",
    },
    "7x7x7": {
        id: "7x7x7",
    },
    "pyraminx": {
        id: "pyraminx",
        generateScramble: generateScramblePyraminx,
    },
    "megaminx": {
        id: "megaminx",
        generateScramble: generateScrambleMegaminx,
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
    },
    "gear-2x2x2": {
        id: "gear-2x2x2",
    },
    "gear-3x3x3": {
        id: "gear-3x3x3",
    },
    "fto": {
        id: "fto",
    },
    "other": {
        id: "other",
    }
}