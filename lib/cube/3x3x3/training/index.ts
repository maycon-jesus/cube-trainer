import type { TrainingSet } from "../../training/types"

const trainingSets333: TrainingSet[] = [
    {
        nameKey: 'training.3x3x3.pll.name',
        id: 'pll',
        descriptionKey: 'training.3x3x3.pll.description',
        imageUrl: '/img/training/3x3x3/pll.png',
        algorithms: () => import("./pll").then(m => m.default)
    },
    {
        nameKey: 'training.3x3x3.oll.name',
        id: 'oll',
        descriptionKey: 'training.3x3x3.oll.description',
        imageUrl: '/img/training/3x3x3/oll.png',
        algorithms: () => import("./oll").then(m => m.default)
    }
]

export default trainingSets333
