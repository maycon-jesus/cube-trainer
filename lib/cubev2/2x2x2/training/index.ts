import type {TrainingSet} from "../../training/types"
import { createMessageLoader } from "../../training/messages"
import { ollAlgorithms } from "./oll"

export const trainingSets: TrainingSet[]= [
    {
        nameKey: 'training.2x2x2.oll.name',
        id: 'oll',
        descriptionKey: 'training.2x2x2.oll.description',
        imageUrl: '/img/training/2x2x2/oll.png',
        algorithms: ollAlgorithms,
        loadMessages: createMessageLoader({
            en: () => import('./oll.i18n/en.json'),
            pt: () => import('./oll.i18n/pt.json'),
            es: () => import('./oll.i18n/es.json'),
            zh: () => import('./oll.i18n/zh.json'),
        })
    }
]
