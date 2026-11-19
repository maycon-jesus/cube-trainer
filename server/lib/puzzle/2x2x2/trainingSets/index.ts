import type { TrainingSet } from "../../types/training"
import { ortegaOll } from "./ortega-oll"
import { ortegaPbl } from "./ortega-pbl"

export default [
    {
        name: 'training.2x2x2.oll.name',
        id: 'oll',
        description: 'training.2x2x2.oll.description',
        imageUrl: '/img/training/2x2x2/oll.png',
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