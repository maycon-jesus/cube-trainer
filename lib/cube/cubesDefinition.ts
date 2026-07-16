import { generateScramble as generateScramble3x3x3 } from "./3x3x3"
import { generateScramble as generateScrambleMegaminx } from "./megaminx"
import { generateScramble as generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import type { TrainingSet } from "./training/types"
import {MegaminxIcon, Mirror2x2Icon, Cube2x2x2Icon, Cube3x3x3Icon, Cube4x4x4Icon, Cube5x5x5Icon, Cube6x6x6Icon, Cube7x7x7Icon, Mirror3x3Icon, PyraminxIcon, OtherIcon} from "@icon"
import type { Component } from "vue"

export type { TrainingAlgorithm, TrainingSet } from "./training/types"

export type CubeData = {
    id: string,
    name: string,
    cubeEngine?: CubeEngine,
    imageUrl?: string,
    generateScramble?: (movesCount?: number) => string,
    icon: Component,
    loadTrainingSets?: () => Promise<TrainingSet[]>
}

export const cubesDefinition: Record<string, CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        name: "2x2x2",
        generateScramble: generateScramble3x3x3,
        icon: Cube2x2x2Icon
    },
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3",
        generateScramble: generateScramble3x3x3,
        icon: Cube3x3x3Icon,
        imageUrl: '/img/puzzle/3x3x3.png',
        loadTrainingSets: () => import("./3x3x3/training").then(m => m.default)
    },
    "4x4x4": {
        id: "4x4x4",
        name: "4x4x4",
        icon: Cube4x4x4Icon
    },
    "5x5x5": {
        id: "5x5x5",
        name: "5x5x5",
        icon: Cube5x5x5Icon
    },
    "6x6x6": {
        id: "6x6x6",
        name: "6x6x6",
        icon: Cube6x6x6Icon
    },
    "7x7x7": {
        id: "7x7x7",
        name: "7x7x7",
        icon: Cube7x7x7Icon
    },
    "pyraminx": {
        id: "pyraminx",
        name: "Pyraminx",
        generateScramble: generateScramblePyraminx,
        icon: PyraminxIcon
    },
    "megaminx": {
        id: "megaminx",
        name: "Megaminx",
        generateScramble: generateScrambleMegaminx,
        icon: MegaminxIcon
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        name: "Mirror 3x3x3",
        icon: Mirror3x3Icon
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        name: "Mirror 2x2x2",
        icon: Mirror2x2Icon
    },
    "other": {
        id: "other",
        name: "Other",
        icon: OtherIcon
    }
}