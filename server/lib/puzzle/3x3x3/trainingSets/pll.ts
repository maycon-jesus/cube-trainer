import { TrainingSetAlgorithm } from "../../types/training"

const pllAlgorithms: TrainingSetAlgorithm[] = [
    {
        name: 'training.3x3x3.pll.cases.u-clockwise',
        id: 'pll-u-horario',
        imageUrl: '/img/training/3x3x3/pll/pll-case-u-clockwise.png',
        solves: [
            "R' U R' U' R' U' R' U R U R2"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.u-anticlockwise',
        id: 'pll-u-anti-horario',
        imageUrl: '/img/training/3x3x3/pll/pll-case-u-anticlockwise.png',
        solves: [
            "R2 U' R' U' R U R U R U' R"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.a-clockwise',
        id: 'pll-a-horario',
        imageUrl: '/img/training/3x3x3/pll/pll-case-a-clockwise.png',
        solves: [
            "x R' U R' D2 R U' R' D2 R2 x'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.a-anticlockwise',
        id: 'pll-a-anti-horario',
        imageUrl: '/img/training/3x3x3/pll/pll-case-a-anticlockwise.png',
        solves: [
            "x R2' D2 R U R' D2 R U' R x'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.h',
        id: 'pll-h',
        imageUrl: '/img/training/3x3x3/pll/pll-case-h.png',
        solves: [
            "M2 U M2 U2 M2 U M2"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.z',
        id: 'pll-z',
        imageUrl: '/img/training/3x3x3/pll/pll-case-z.png',
        solves: [
            "M2 U M2 U M' U2 M2 U2 M'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.t',
        id: 'pll-t',
        imageUrl: '/img/training/3x3x3/pll/pll-case-t.png',
        solves: [
            "R U R' U' R' F R2 U' R' U' R U R' F'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.f',
        id: 'pll-f',
        imageUrl: '/img/training/3x3x3/pll/pll-case-f.png',
        solves: [
            "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.y',
        id: 'pll-y',
        imageUrl: '/img/training/3x3x3/pll/pll-case-y.png',
        solves: [
            "F R U' R' U' R U R' F' R U R' U' R' F R F'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.e',
        id: 'pll-e',
        imageUrl: '/img/training/3x3x3/pll/pll-case-e.png',
        solves: [
            "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.v',
        id: 'pll-v',
        imageUrl: '/img/training/3x3x3/pll/pll-case-v.png',
        solves: [
            "R' U R' Dw' R' F' R2 U' R' U R' F R F"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.ra',
        id: 'pll-ra',
        imageUrl: '/img/training/3x3x3/pll/pll-case-ra.png',
        solves: [
            "R U' R' U' R U R D R' U' R D' R' U2 R' U'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.rb',
        id: 'pll-rb',
        imageUrl: '/img/training/3x3x3/pll/pll-case-rb.png',
        solves: [
            "R' U2 R U2' R' F R U R' U' R' F' R2 U'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.ja',
        id: 'pll-ja',
        imageUrl: '/img/training/3x3x3/pll/pll-case-ja.png',
        solves: [
            "x R2 F R F' R U2 Rw' U Rw U2 x'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.jb',
        id: 'pll-jb',
        imageUrl: '/img/training/3x3x3/pll/pll-case-jb.png',
        solves: [
            "R U R' F' R U R' U' R' F R2 U' R' U'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.na',
        id: 'pll-na',
        imageUrl: '/img/training/3x3x3/pll/pll-case-na.png',
        solves: [
            "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.nb',
        id: 'pll-nb',
        imageUrl: '/img/training/3x3x3/pll/pll-case-nb.png',
        solves: [
            "R' U R U' R' F' U' F R U R' F R' F' R U' R"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.ga',
        id: 'pll-ga',
        imageUrl: '/img/training/3x3x3/pll/pll-case-ga.png',
        solves: [
            "R2' Uw R' U R' U' R Uw' R2 y' R' U R"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.gb',
        id: 'pll-gb',
        imageUrl: '/img/training/3x3x3/pll/pll-case-gb.png',
        solves: [
            "R' U' R U D' R2 U R' U R U' R U' R2 D U'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.gc',
        id: 'pll-gc',
        imageUrl: '/img/training/3x3x3/pll/pll-case-gc.png',
        solves: [
            "R2 U' R U' R U R' U R2 D' U R U' R' D U'"
        ]
    },
    {
        name: 'training.3x3x3.pll.cases.gd',
        id: 'pll-gd',
        imageUrl: '/img/training/3x3x3/pll/pll-case-gd.png',
        solves: [
            "R U R' y' R2 Uw' R U' R' U R' Uw R2"
        ]
    },
]

export default pllAlgorithms
