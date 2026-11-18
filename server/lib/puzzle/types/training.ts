export type TrainingSet = {
    name: string,
    id: string,
    description: string,
    imageUrl: string,
    algorithms: TrainingSetAlgorithm[],
}

export type TrainingSetAlgorithm = {
    name: string,
    id: string,
    imageUrl: string,
    solves: string[]
}