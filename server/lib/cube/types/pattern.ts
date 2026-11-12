export type PatternDifficulty = 'easy' | 'medium' | 'hard'

export type CubePattern = {
    name: string,
    id: string,
    description: string,
    difficulty: PatternDifficulty,
    imageUrl: string,
    /** Moves applied to a solved cube to produce the pattern. */
    algorithm: string,
}
