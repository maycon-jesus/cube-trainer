import type { TrainingSet } from "../../types/training"
import pllAlgorithms from "./pll"
import ollAlgorithms from "./oll"
import f2lAlgorithms from "./f2l"
import basicAlgorithms from "./basic"

export default [
    {
        name: 'puzzles.3x3x3.sets.basic.name',
        id: 'basic',
        description: 'puzzles.3x3x3.sets.basic.description',
        imageUrl: '/img/puzzles/3x3x3/training-sets/basic.png',
        algorithms: basicAlgorithms,
    },
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
    },
    {
        name: 'training.3x3x3.f2l.name',
        id: 'f2l',
        description: 'training.3x3x3.f2l.description',
        imageUrl: '/img/training/3x3x3/f2l.png',
        algorithms: f2lAlgorithms,
    },
] as TrainingSet[]