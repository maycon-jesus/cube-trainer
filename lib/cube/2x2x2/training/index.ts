import type {TrainingSet} from "../../training/types"
import { ollAlgorithms } from "./oll"

export const trainingSets: TrainingSet[]= [
    {
        nameKey: 'training.2x2x2.oll.name',
        id: 'oll',
        descriptionKey: 'training.2x2x2.oll.description',
        imageUrl: '/img/training/2x2x2/oll.png',
        algorithms: ollAlgorithms
    }
]