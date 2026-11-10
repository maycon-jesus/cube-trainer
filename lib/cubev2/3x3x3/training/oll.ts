import type { TrainingAlgorithm } from "../../training/types"
import { newAlgorithmSetup } from "./setup"

const ollAlgorithms: TrainingAlgorithm[] = [
    {
        nameKey: 'training.3x3x3.oll.cases.point-1',
        id: 'oll-point-1',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-1.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U2 R2' F R F' U2' R' F R F'"),
        solves: [
            "R U2 R2' F R F' U2' R' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-2',
        id: 'oll-point-2',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-2.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F R U R' U' S R U R' U' Fw'"),
        solves: [
            "F R U R' U' S R U R' U' Fw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-3',
        id: 'oll-point-3',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-3.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' Fw' U' F R U R' U' F'"),
        solves: [
            "Fw R U R' U' Fw' U' F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-4',
        id: 'oll-point-4',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-4.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' Fw' U F R U R' U' F'"),
        solves: [
            "Fw R U R' U' Fw' U F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-17',
        id: 'oll-point-17',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-17.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R' F R F' U2 R' F R F'"),
        solves: [
            "R U R' U R' F R F' U2 R' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-18',
        id: 'oll-point-18',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-18.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U R U2 Rw2 U' R U' R' U2 Rw"),
        solves: [
            "Rw U R' U R U2 Rw2 U' R U' R' U2 Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.point-19',
        id: 'oll-point-19',
        imageUrl: '/img/training/3x3x3/oll/oll-case-point-19.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("M U R U R' U' M' R' F R F'"),
        solves: [
            "M U R U R' U' M' R' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.square-5',
        id: 'oll-square-5',
        imageUrl: '/img/training/3x3x3/oll/oll-case-square-5.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' U2 R U R' U Rw"),
        solves: [
            "Rw' U2 R U R' U Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.square-6',
        id: 'oll-square-6',
        imageUrl: '/img/training/3x3x3/oll/oll-case-square-6.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U2 R' U' R U' Rw'"),
        solves: [
            "Rw U2 R' U' R U' Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.slbs-7',
        id: 'oll-slbs-7',
        imageUrl: '/img/training/3x3x3/oll/oll-case-slbs-7.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U R U2 Rw'"),
        solves: [
            "Rw U R' U R U2 Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.slbs-8',
        id: 'oll-slbs-8',
        imageUrl: '/img/training/3x3x3/oll/oll-case-slbs-8.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' U' R U' R' U2 Rw"),
        solves: [
            "Rw' U' R U' R' U2 Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.slbs-11',
        id: 'oll-slbs-11',
        imageUrl: '/img/training/3x3x3/oll/oll-case-slbs-11.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' R2 U R' U R U2 R' U M'"),
        solves: [
            "Rw' R2 U R' U R U2 R' U M'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.slbs-12',
        id: 'oll-slbs-12',
        imageUrl: '/img/training/3x3x3/oll/oll-case-slbs-12.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F R U R' U' F' U F R U R' U' F'"),
        solves: [
            "F R U R' U' F' U F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.fish-9',
        id: 'oll-fish-9',
        imageUrl: '/img/training/3x3x3/oll/oll-case-fish-9.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U' R' F R2 U R' U' F'"),
        solves: [
            "R U R' U' R' F R2 U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.fish-10',
        id: 'oll-fish-10',
        imageUrl: '/img/training/3x3x3/oll/oll-case-fish-10.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R' F R F' R U2 R'"),
        solves: [
            "R U R' U R' F R F' R U2 R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.fish-35',
        id: 'oll-fish-35',
        imageUrl: '/img/training/3x3x3/oll/oll-case-fish-35.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U2 R2 F R F' R U2 R'"),
        solves: [
            "R U2 R2 F R F' R U2 R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.fish-37',
        id: 'oll-fish-37',
        imageUrl: '/img/training/3x3x3/oll/oll-case-fish-37.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F R U' R' U' R U R' F'"),
        solves: [
            "F R U' R' U' R U R' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.knight-13',
        id: 'oll-knight-13',
        imageUrl: '/img/training/3x3x3/oll/oll-case-knight-13.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U' Rw' U' Rw U Rw' F' U F"),
        solves: [
            "Rw U' Rw' U' Rw U Rw' F' U F"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.knight-14',
        id: 'oll-knight-14',
        imageUrl: '/img/training/3x3x3/oll/oll-case-knight-14.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' F R U R' F' R F U' F'"),
        solves: [
            "R' F R U R' F' R F U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.knight-15',
        id: 'oll-knight-15',
        imageUrl: '/img/training/3x3x3/oll/oll-case-knight-15.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' U' Rw R' U' R U Rw' U Rw"),
        solves: [
            "Rw' U' Rw R' U' R U Rw' U Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.knight-16',
        id: 'oll-knight-16',
        imageUrl: '/img/training/3x3x3/oll/oll-case-knight-16.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U Rw' R U R' U' Rw U' Rw'"),
        solves: [
            "Rw U Rw' R U R' U' Rw U' Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.co-20',
        id: 'oll-co-20',
        imageUrl: '/img/training/3x3x3/oll/oll-case-co-20.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("M U R U R' U' M2 U R U' Rw'"),
        solves: [
            "M U R U R' U' M2 U R U' Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.co-28',
        id: 'oll-co-28',
        imageUrl: '/img/training/3x3x3/oll/oll-case-co-28.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U' M U R U' R'"),
        solves: [
            "Rw U R' U' M U R U' R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.co-57',
        id: 'oll-co-57',
        imageUrl: '/img/training/3x3x3/oll/oll-case-co-57.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U' M' U R U' Rw'"),
        solves: [
            "R U R' U' M' U R U' Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-21',
        id: 'oll-ocll-21',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-21.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R U' R' U R U2 R'"),
        solves: [
            "R U R' U R U' R' U R U2 R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-22',
        id: 'oll-ocll-22',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-22.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U2 R2 U' R2 U' R2 U2 R"),
        solves: [
            "R U2 R2 U' R2 U' R2 U2 R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-23',
        id: 'oll-ocll-23',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-23.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R2 D' R U2 R' D R U2 R"),
        solves: [
            "R2 D' R U2 R' D R U2 R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-24',
        id: 'oll-ocll-24',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-24.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U' Rw' F R F'"),
        solves: [
            "Rw U R' U' Rw' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-25',
        id: 'oll-ocll-25',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-25.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F' Rw U R' U' Rw' F R"),
        solves: [
            "F' Rw U R' U' Rw' F R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-26',
        id: 'oll-ocll-26',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-26.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' U' R U' R' U2 R"),
        solves: [
            "R' U' R U' R' U2 R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.ocll-27',
        id: 'oll-ocll-27',
        imageUrl: '/img/training/3x3x3/oll/oll-case-ocll-27.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R U2 R'"),
        solves: [
            "R U R' U R U2 R'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.awkward-29',
        id: 'oll-awkward-29',
        imageUrl: '/img/training/3x3x3/oll/oll-case-awkward-29.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("M U R U R' U' R' F R F' M'"),
        solves: [
            "M U R U R' U' R' F R F' M'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.awkward-30',
        id: 'oll-awkward-30',
        imageUrl: '/img/training/3x3x3/oll/oll-case-awkward-30.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F U R U2 R' U' R U2 R' U' F'"),
        solves: [
            "F U R U2 R' U' R U2 R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.awkward-41',
        id: 'oll-awkward-41',
        imageUrl: '/img/training/3x3x3/oll/oll-case-awkward-41.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R U2 R' F R U R' U' F'"),
        solves: [
            "R U R' U R U2 R' F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.awkward-42',
        id: 'oll-awkward-42',
        imageUrl: '/img/training/3x3x3/oll/oll-case-awkward-42.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' U' R U' R' U2 R F R U R' U' F'"),
        solves: [
            "R' U' R U' R' U2 R F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.p-31',
        id: 'oll-p-31',
        imageUrl: '/img/training/3x3x3/oll/oll-case-p-31.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' U' F U R U' R' F' R"),
        solves: [
            "R' U' F U R U' R' F' R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.p-32',
        id: 'oll-p-32',
        imageUrl: '/img/training/3x3x3/oll/oll-case-p-32.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("S R U R' U' R' F R Fw'"),
        solves: [
            "S R U R' U' R' F R Fw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.p-43',
        id: 'oll-p-43',
        imageUrl: '/img/training/3x3x3/oll/oll-case-p-43.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Fw' L' U' L U Fw"),
        solves: [
            "Fw' L' U' L U Fw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.p-44',
        id: 'oll-p-44',
        imageUrl: '/img/training/3x3x3/oll/oll-case-p-44.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' Fw'"),
        solves: [
            "Fw R U R' U' Fw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.t-33',
        id: 'oll-t-33',
        imageUrl: '/img/training/3x3x3/oll/oll-case-t-33.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U' R' F R F'"),
        solves: [
            "R U R' U' R' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.t-45',
        id: 'oll-t-45',
        imageUrl: '/img/training/3x3x3/oll/oll-case-t-45.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F R U R' U' F'"),
        solves: [
            "F R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.c-34',
        id: 'oll-c-34',
        imageUrl: '/img/training/3x3x3/oll/oll-case-c-34.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R2 U' R' F R U R U' F'"),
        solves: [
            "R U R2 U' R' F R U R U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.c-46',
        id: 'oll-c-46',
        imageUrl: '/img/training/3x3x3/oll/oll-case-c-46.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' U' R' F R F' U R"),
        solves: [
            "R' U' R' F R F' U R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.w-36',
        id: 'oll-w-36',
        imageUrl: '/img/training/3x3x3/oll/oll-case-w-36.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("L' U' L U' L' U L U L F' L' F"),
        solves: [
            "L' U' L U' L' U L U L F' L' F"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.w-38',
        id: 'oll-w-38',
        imageUrl: '/img/training/3x3x3/oll/oll-case-w-38.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R U' R' U' R' F R F'"),
        solves: [
            "R U R' U R U' R' U' R' F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.blbs-39',
        id: 'oll-blbs-39',
        imageUrl: '/img/training/3x3x3/oll/oll-case-blbs-39.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("L F' L' U' L U F U' L'"),
        solves: [
            "L F' L' U' L U F U' L'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.blbs-40',
        id: 'oll-blbs-40',
        imageUrl: '/img/training/3x3x3/oll/oll-case-blbs-40.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R' F R U R' U' F' U R"),
        solves: [
            "R' F R U R' U' F' U R"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-47',
        id: 'oll-l-47',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-47.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F' L' U' L U L' U' L U F"),
        solves: [
            "F' L' U' L U L' U' L U F"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-48',
        id: 'oll-l-48',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-48.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("F R U R' U' R U R' U' F'"),
        solves: [
            "F R U R' U' R U R' U' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-49',
        id: 'oll-l-49',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-49.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U' Rw2 U Rw2 U Rw2 U' Rw"),
        solves: [
            "Rw U' Rw2 U Rw2 U Rw2 U' Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-50',
        id: 'oll-l-50',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-50.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' U Rw2 U' Rw2 U' Rw2 U Rw'"),
        solves: [
            "Rw' U Rw2 U' Rw2 U' Rw2 U Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-53',
        id: 'oll-l-53',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-53.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw' U' R U' R' U R U' R' U2 Rw"),
        solves: [
            "Rw' U' R U' R' U R U' R' U2 Rw"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.l-54',
        id: 'oll-l-54',
        imageUrl: '/img/training/3x3x3/oll/oll-case-l-54.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U R U' R' U R U2 Rw'"),
        solves: [
            "Rw U R' U R U' R' U R U2 Rw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.i-51',
        id: 'oll-i-51',
        imageUrl: '/img/training/3x3x3/oll/oll-case-i-51.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' R U R' U' Fw'"),
        solves: [
            "Fw R U R' U' R U R' U' Fw'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.i-52',
        id: 'oll-i-52',
        imageUrl: '/img/training/3x3x3/oll/oll-case-i-52.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R Dw' R U' R' F'"),
        solves: [
            "R U R' U R Dw' R U' R' F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.i-55',
        id: 'oll-i-55',
        imageUrl: '/img/training/3x3x3/oll/oll-case-i-55.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("R U2 R2 U' R U' R' U2 F R F'"),
        solves: [
            "R U2 R2 U' R U' R' U2 F R F'"
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.cases.i-56',
        id: 'oll-i-56',
        imageUrl: '/img/training/3x3x3/oll/oll-case-i-56.svg',
        generateSetupScramble: ()=> newAlgorithmSetup("Rw U Rw' U R U' R' U R U' R' Rw U' Rw'"),
        solves: [
            "Rw U Rw' U R U' R' U R U' R' Rw U' Rw'"
        ]
    }
]

export default ollAlgorithms
