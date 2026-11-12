import { LanguageMessages, Languages, Translator } from "../translator/translator"
import type { CubePattern } from "./types/pattern"

import cube333 from "./3x3x3/definition"
import { TrainingSet } from "./types/training"

export type CubeDefinition = {
    id: string,
    name: string,
    imageUrl: string
    patterns: CubePattern[],
    trainingSets: TrainingSet[],
}

export const cubesDefinition: Record<string, CubeDefinition> = {
    "3x3x3": cube333,
}