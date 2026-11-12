import type { TrainingSet } from "../../types/training"
import pllAlgorithms from "./pll"
import ollAlgorithms from "./oll"
import f2lAlgorithms from "./f2l"
import ollI18n from "../../i18n/3x3x3/trainingSets/oll"
import f2lI18n from "../../i18n/3x3x3/trainingSets/f2l"

export default [
    {
        name: 'training.3x3x3.pll.name',
        id: 'pll',
        description: 'training.3x3x3.pll.description',
        imageUrl: '/img/training/3x3x3/pll.png',
        algorithms: pllAlgorithms,
    },
    {
        name: 'training.3x3x3.oll.name',
        id: 'oll',
        description: 'training.3x3x3.oll.description',
        imageUrl: '/img/training/3x3x3/oll.png',
        algorithms: ollAlgorithms,
        languagesMessages: ollI18n
    },
    {
        name: 'training.3x3x3.f2l.name',
        id: 'f2l',
        description: 'training.3x3x3.f2l.description',
        imageUrl: '/img/training/3x3x3/f2l.png',
        algorithms: f2lAlgorithms,
        languagesMessages: f2lI18n
    }
] as TrainingSet[]