import type { TrainingSet } from "../../training/types"
import { createMessageLoader } from "../../training/messages"
import pllAlgorithms from "./pll"
import ollAlgorithms from "./oll"
import f2lAlgorithms from "./f2l"

const trainingSets333: TrainingSet[] = [
    {
        nameKey: 'training.3x3x3.pll.name',
        id: 'pll',
        descriptionKey: 'training.3x3x3.pll.description',
        imageUrl: '/img/training/3x3x3/pll.png',
        algorithms: pllAlgorithms,
        loadMessages: createMessageLoader({
            en: () => import('./pll.i18n/en.json'),
            pt: () => import('./pll.i18n/pt.json'),
            es: () => import('./pll.i18n/es.json'),
            zh: () => import('./pll.i18n/zh.json'),
        })
    },
    {
        nameKey: 'training.3x3x3.oll.name',
        id: 'oll',
        descriptionKey: 'training.3x3x3.oll.description',
        imageUrl: '/img/training/3x3x3/oll.png',
        algorithms: ollAlgorithms,
        loadMessages: createMessageLoader({
            en: () => import('./oll.i18n/en.json'),
            pt: () => import('./oll.i18n/pt.json'),
            es: () => import('./oll.i18n/es.json'),
            zh: () => import('./oll.i18n/zh.json'),
        })
    },
    {
        nameKey: 'training.3x3x3.f2l.name',
        id: 'f2l',
        descriptionKey: 'training.3x3x3.f2l.description',
        imageUrl: '/img/training/3x3x3/f2l.png',
        algorithms: f2lAlgorithms,
        loadMessages: createMessageLoader({
            en: () => import('./f2l.i18n/en.json'),
            pt: () => import('./f2l.i18n/pt.json'),
            es: () => import('./f2l.i18n/es.json'),
            zh: () => import('./f2l.i18n/zh.json'),
        })
    }
]

export default trainingSets333
