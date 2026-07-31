import type { TrainingSet } from "../../training/types"
import pllAlgorithms from "./pll"
import ollAlgorithms from "./oll"
import f2lAlgorithms from "./f2l"

const trainingSets333: TrainingSet[] = [
    {
        nameKey: 'training.3x3x3.pll.name',
        id: 'pll',
        descriptionKey: 'training.3x3x3.pll.description',
        imageUrl: '/img/training/3x3x3/pll.png',
        algorithms: pllAlgorithms
    },
    {
        nameKey: 'training.3x3x3.oll.name',
        id: 'oll',
        descriptionKey: 'training.3x3x3.oll.description',
        imageUrl: '/img/training/3x3x3/oll.png',
        algorithms: ollAlgorithms
    },
    {
        nameKey: 'training.3x3x3.f2l.name',
        id: 'f2l',
        descriptionKey: 'training.3x3x3.f2l.description',
        imageUrl: '/img/training/3x3x3/f2l.png',
        algorithms: f2lAlgorithms
    }
]

export default trainingSets333
