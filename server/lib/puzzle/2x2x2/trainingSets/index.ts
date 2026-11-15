import type { TrainingSet } from "../../types/training"
import { ollAlgorithms } from "./oll"

export default [
    {
        name: 'training.2x2x2.oll.name',
        id: 'oll',
        description: 'training.2x2x2.oll.description',
        imageUrl: '/img/training/2x2x2/oll.png',
        algorithms: ollAlgorithms,
    }
] as TrainingSet[]