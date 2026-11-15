import cube333 from "./3x3x3/definition"
import cube222 from "./2x2x2/definition"
import { Pattern } from "~~/shared/types/pattern"
import { TrainingSet } from "~~/shared/types/trainingSet"

export type PuzzleDefinition = {
    id: string,
    name: string,
    imageUrl: string
    patterns: Pattern[],
    trainingSets: TrainingSet[],
}

export const cubesDefinition: Record<string, PuzzleDefinition> = {
    "2x2x2": cube222,
    "3x3x3": cube333,
    "4x4x4": {
        id: "4x4x4",
        imageUrl: '',
        name: 'name.4x4x4',
        patterns: [],
        trainingSets: []
    },
    "5x5x5": {
        id: "5x5x5",
        imageUrl: '',
        name: 'name.5x5x5',
        patterns: [],
        trainingSets: []
    },
    "6x6x6": {
        id: "6x6x6",
        imageUrl: '',
        name: 'name.6x6x6',
        patterns: [],
        trainingSets: []
    },
    "7x7x7": {
        id: "7x7x7",
        imageUrl: '',
        name: 'name.7x7x7',
        patterns: [],
        trainingSets: []
    },
    "pyraminx": {
        id: "pyraminx",
        imageUrl: '',
        name: 'name.pyraminx',
        patterns: [],
        trainingSets: []
    },
    "megaminx": {
        id: "megaminx",
        imageUrl: '',
        name: 'name.megaminx',
        patterns: [],
        trainingSets: []
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        imageUrl: '',
        name: 'name.mirror-3x3x3',
        patterns: [],
        trainingSets: []
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        imageUrl: '',
        name: 'name.mirror-2x2x2',
        patterns: [],
        trainingSets: []
    },
    "gear-2x2x2": {
        id: "gear-2x2x2",
        imageUrl: '',
        name: 'name.gear-2x2x2',
        patterns: [],
        trainingSets: []
    },
    "gear-3x3x3": {
        id: "gear-3x3x3",
        imageUrl: '',
        name: 'name.gear-3x3x3',
        patterns: [],
        trainingSets: []
    },
    "fto": {
        id: "fto",
        imageUrl: '',
        name: 'name.fto',
        patterns: [],
        trainingSets: []
    }
}