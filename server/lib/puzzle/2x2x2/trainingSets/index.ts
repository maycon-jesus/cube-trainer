import type { TrainingSet } from "../../types/training"
import { ortegaOll } from "./ortega-oll"
import { ortegaPbl } from "./ortega-pbl"

export default [
    {
        name: 'puzzles.2x2x2.sets.ortega-oll.name',
        id: 'ortega-oll',
        description: 'puzzles.2x2x2.sets.ortega-oll.description',
        imageUrl: '/img/puzzles/2x2x2/training-sets/ortega-oll.png',
        algorithms: ortegaOll,
    },
    {
        name: 'puzzles.2x2x2.sets.ortega-pbl.name',
        id: 'ortega-pbl',
        description: 'puzzles.2x2x2.sets.ortega-pbl.description',
        imageUrl: '/img/puzzles/2x2x2/training-sets/ortega-pbl.png',
        algorithms: ortegaPbl,
    }
] as TrainingSet[]