export type TrainingAlgorithm = {
    nameKey?: string,
    name?: string,
    id: string,
    imageUrl: string,
    generateSetupScramble: ()=> Promise<string>,
    solves: string[],
}

export type TrainingSet = {
    nameKey?: string,
    name?: string,
    id: string,
    descriptionKey?: string,
    description?: string,
    imageUrl: string,
    algorithms: () => Promise<TrainingAlgorithm[]>
}
