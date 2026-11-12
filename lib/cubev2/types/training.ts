import { Languages, Translator } from "../../translator/translator"

export type TrainingAlgorithm = {
    name: string,
    id: string,
    imageUrl: string,
    generateSetupScramble: () => Promise<string>,
    solves: string[],
}

export type TrainingSet = {
    name: string,
    id: string,
    description: string,
    imageUrl: string,
    algorithms: TrainingAlgorithm[],
}
