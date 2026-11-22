import { generateScramble as generateScrambleMegaminx } from "./megaminx"
import { generateScramble as generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import { Engine as Engine333 } from "./3x3x3/engine"
import { generateScramble as generateScramble333, invertScramble as invertScramble333 } from "./3x3x3/scramble"
import { generateScramble as generateScramble222, invertScramble as invertScramble222 } from "./2x2x2/scramble"
import { generateScramble as generateScramble555, invertScramble as invertScramble555 } from "./5x5x5/scramble"
import { generateScramble as generateScramble444, invertScramble as invertScramble444 } from "./4x4x4/scramble"
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
        generateScramble: generateScramble222,
        invertScramble: invertScramble222,
        generateAlgorithmSetup: (s: string) => Promise.resolve(invertScramble222(s))
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
        generateScramble: generateScramble444,
        invertScramble: invertScramble444,
    },
    "5x5x5": {
        id: "5x5x5",
        generateScramble: generateScramble555,
        invertScramble: invertScramble555,
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