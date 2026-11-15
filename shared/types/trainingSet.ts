export type TrainingSet = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    algorithmCount: number,
    puzzleId: string
}

export type TrainingSetAlgorithm = {
    id: string,
    name: string,
    imageUrl: string,
    solves: string[],
    setId: string,
    puzzleId: string
}