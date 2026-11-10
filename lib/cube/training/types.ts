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
    algorithms: TrainingAlgorithm[],
    // Locale messages for this set's nameKey/descriptionKey and its algorithm nameKeys.
    // Must be merged into vue-i18n before the set is rendered.
    loadMessages?: (locale: string) => Promise<Record<string, unknown> | undefined>
}
