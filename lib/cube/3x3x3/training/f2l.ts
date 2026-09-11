import type { TrainingAlgorithm } from "../../training/types"
import { newAlgorithmSetup } from "./setup"

const f2lAlgorithms: TrainingAlgorithm[] = [
    {
        nameKey: 'training.3x3x3.f2l.cases.case-1',
        id: 'f2l-case-1',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-1.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R'"),
        solves: [
            "R U R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-2',
        id: 'f2l-case-2',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-2.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("y L' U' L"),
        solves: [
            "y L' U' L"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-3',
        id: 'f2l-case-3',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-3.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("y U' L' U L"),
        solves: [
            "y U' L' U L"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-4',
        id: 'f2l-case-4',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-4.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U R U' R'"),
        solves: [
            "U R U' R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-5',
        id: 'f2l-case-5',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-5.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U R U' R' U' F' U F"),
        solves: [
            "U R U' R' U' F' U F"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-6',
        id: 'f2l-case-6',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-6.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("y U' L' U L U F U' F'"),
        solves: [
            "y U' L' U L U F U' F'"
        ]
    },
     {
        nameKey: 'training.3x3x3.f2l.cases.case-7',
        id: 'f2l-case-7',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-7.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U' R' Dw R' U2 R U2' R' U R"),
        solves: [
            "R U' R' Dw R' U2 R U2' R' U R"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-8',
        id: 'f2l-case-8',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-8.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U R U R' U2 R U R'"),
        solves: [
            "U R U R' U2 R U R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-9',
        id: 'f2l-case-9',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-9.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U' R U' R' U2 R U' R'"),
        solves: [
            "U' R U' R' U2 R U' R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-10',
        id: 'f2l-case-10',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-10.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U2 R' F R F' U2 R U R'"),
        solves: [
            "U2 R' F R F' U2 R U R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.f2l.cases.case-11',
        id: 'f2l-case-11',
        imageUrl: '/img/training/3x3x3/f2l/f2l-case-11.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("U' R U R' U F' U' F"),
        solves: [
            "U' R U R' U F' U' F"
        ]
    },
]

export default f2lAlgorithms
