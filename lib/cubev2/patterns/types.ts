export type PatternDifficulty = 'easy' | 'medium' | 'hard'

export type CubePattern = {
    nameKey?: string,
    name?: string,
    id: string,
    descriptionKey?: string,
    description?: string,
    difficulty: PatternDifficulty,
    imageUrl: string,
    /** Moves applied to a solved cube to produce the pattern. */
    algorithm: string,
}
