import { Cube333, invertScramble, randomAUFScramble } from ".."
import type { TrainingSet } from "../../training/types"
import { solveCube333InWorker } from "../solveInWorker"

async function newAlgorithmSetup(scramble: string): Promise<string> {
    const scrambleInvert = randomAUFScramble(invertScramble(scramble))
    const cube = new Cube333()
    cube.applyMoves(scrambleInvert.split(' '))
    return invertScramble(await solveCube333InWorker(cube))
}

const trainingSets333: TrainingSet[] = [
    {
        nameKey: 'training.3x3x3.pll.name',
        id: 'pll',
        descriptionKey: 'training.3x3x3.pll.description',
        imageUrl: '/img/training/3x3x3/pll.png',
        algorithms: [
            {
                nameKey: 'training.3x3x3.pll.cases.u-clockwise',
                id: 'pll-u-horario',
                imageUrl: '/img/training/3x3x3/pll/pll-case-u-clockwise.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U R' U' R' U' R' U R U R2"),
                solves: [
                    "R' U R' U' R' U' R' U R U R2"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.u-anticlockwise',
                id: 'pll-u-anti-horario',
                imageUrl: '/img/training/3x3x3/pll/pll-case-u-anticlockwise.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R2 U' R' U' R U R U R U' R"),
                solves: [
                    "R2 U' R' U' R U R U R U' R"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.a-clockwise',
                id: 'pll-a-horario',
                imageUrl: '/img/training/3x3x3/pll/pll-case-a-clockwise.png',
                generateSetupScramble: ()=> newAlgorithmSetup("x R' U R' D2 R U' R' D2 R2 x'"),
                solves: [
                    "x R' U R' D2 R U' R' D2 R2 x'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.a-anticlockwise',
                id: 'pll-a-anti-horario',
                imageUrl: '/img/training/3x3x3/pll/pll-case-a-anticlockwise.png',
                generateSetupScramble: ()=> newAlgorithmSetup("x R2' D2 R U R' D2 R U' R x'"),
                solves: [
                    "x R2' D2 R U R' D2 R U' R x'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.h',
                id: 'pll-h',
                imageUrl: '/img/training/3x3x3/pll/pll-case-h.png',
                generateSetupScramble: ()=> newAlgorithmSetup("M2 U M2 U2 M2 U M2"),
                solves: [
                    "M2 U M2 U2 M2 U M2"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.z',
                id: 'pll-z',
                imageUrl: '/img/training/3x3x3/pll/pll-case-z.png',
                generateSetupScramble: ()=> newAlgorithmSetup("M2 U M2 U M' U2 M2 U2 M'"),
                solves: [
                    "M2 U M2 U M' U2 M2 U2 M'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.t',
                id: 'pll-t',
                imageUrl: '/img/training/3x3x3/pll/pll-case-t.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U R' U' R' F R2 U' R' U' R U R' F'"),
                solves: [
                    "R U R' U' R' F R2 U' R' U' R U R' F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.f',
                id: 'pll-f',
                imageUrl: '/img/training/3x3x3/pll/pll-case-f.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"),
                solves: [
                    "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.y',
                id: 'pll-y',
                imageUrl: '/img/training/3x3x3/pll/pll-case-y.png',
                generateSetupScramble: ()=> newAlgorithmSetup("F R U' R' U' R U R' F' R U R' U' R' F R F'"),
                solves: [
                    "F R U' R' U' R U R' F' R U R' U' R' F R F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.e',
                id: 'pll-e',
                imageUrl: '/img/training/3x3x3/pll/pll-case-e.png',
                generateSetupScramble: ()=> newAlgorithmSetup("x' R U' R' D R U R' D' R U R' D R U' R' D' x"),
                solves: [
                    "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.v',
                id: 'pll-v',
                imageUrl: '/img/training/3x3x3/pll/pll-case-v.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U R' Dw' R' F' R2 U' R' U R' F R F"),
                solves: [
                    "R' U R' Dw' R' F' R2 U' R' U R' F R F"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.ra',
                id: 'pll-ra',
                imageUrl: '/img/training/3x3x3/pll/pll-case-ra.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U' R' U' R U R D R' U' R D' R' U2 R' U'"),
                solves: [
                    "R U' R' U' R U R D R' U' R D' R' U2 R' U'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.rb',
                id: 'pll-rb',
                imageUrl: '/img/training/3x3x3/pll/pll-case-rb.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U2 R U2' R' F R U R' U' R' F' R2 U'"),
                solves: [
                    "R' U2 R U2' R' F R U R' U' R' F' R2 U'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.ja',
                id: 'pll-ja',
                imageUrl: '/img/training/3x3x3/pll/pll-case-ja.png',
                generateSetupScramble: ()=> newAlgorithmSetup("x R2 F R F' R U2 Rw' U Rw U2 x'"),
                solves: [
                    "x R2 F R F' R U2 Rw' U Rw U2 x'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.jb',
                id: 'pll-jb',
                imageUrl: '/img/training/3x3x3/pll/pll-case-jb.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U R' F' R U R' U' R' F R2 U' R' U'"),
                solves: [
                    "R U R' F' R U R' U' R' F R2 U' R' U'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.na',
                id: 'pll-na',
                imageUrl: '/img/training/3x3x3/pll/pll-case-na.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"),
                solves: [
                    "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.nb',
                id: 'pll-nb',
                imageUrl: '/img/training/3x3x3/pll/pll-case-nb.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U R U' R' F' U' F R U R' F R' F' R U' R"),
                solves: [
                    "R' U R U' R' F' U' F R U R' F R' F' R U' R"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.ga',
                id: 'pll-ga',
                imageUrl: '/img/training/3x3x3/pll/pll-case-ga.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R2' Uw R' U R' U' R Uw' R2 y' R' U R"),
                solves: [
                    "R2' Uw R' U R' U' R Uw' R2 y' R' U R"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.gb',
                id: 'pll-gb',
                imageUrl: '/img/training/3x3x3/pll/pll-case-gb.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R' U' R U D' R2 U R' U R U' R U' R2 D U'"),
                solves: [
                    "R' U' R U D' R2 U R' U R U' R U' R2 D U'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.gc',
                id: 'pll-gc',
                imageUrl: '/img/training/3x3x3/pll/pll-case-gc.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R2 U' R U' R U R' U R2 D' U R U' R' D U'"),
                solves: [
                    "R2 U' R U' R U R' U R2 D' U R U' R' D U'"
                ]
            },
            {
                nameKey: 'training.3x3x3.pll.cases.gd',
                id: 'pll-gd',
                imageUrl: '/img/training/3x3x3/pll/pll-case-gd.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U R' y' R2 Uw' R U' R' U R' Uw R2"),
                solves: [
                    "R U R' y' R2 Uw' R U' R' U R' Uw R2"
                ]
            },
        ]
    },
    {
        nameKey: 'training.3x3x3.oll.name',
        id: 'oll',
        descriptionKey: 'training.3x3x3.oll.description',
        imageUrl: '/img/training/3x3x3/oll.png',
        algorithms: [
            {
                nameKey: 'training.3x3x3.oll.cases.point-1',
                id: 'oll-point-1',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-1.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U2 R2' F R F' U2' R' F R F'"),
                solves: [
                    "R U2 R2' F R F' U2' R' F R F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-2',
                id: 'oll-point-2',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-2.png',
                generateSetupScramble: ()=> newAlgorithmSetup("F R U R' U' S R U R' U' Fw'"),
                solves: [
                    "F R U R' U' S R U R' U' Fw'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-3',
                id: 'oll-point-3',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-3.png',
                generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' Fw' U' F R U R' U' F'"),
                solves: [
                    "Fw R U R' U' Fw' U' F R U R' U' F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-4',
                id: 'oll-point-4',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-4.png',
                generateSetupScramble: ()=> newAlgorithmSetup("Fw R U R' U' Fw' U F R U R' U' F'"),
                solves: [
                    "Fw R U R' U' Fw' U F R U R' U' F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-17',
                id: 'oll-point-17',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-17.png',
                generateSetupScramble: ()=> newAlgorithmSetup("R U R' U R' F R F' U2 R' F R F'"),
                solves: [
                    "R U R' U R' F R F' U2 R' F R F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-18',
                id: 'oll-point-18',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-18.png',
                generateSetupScramble: ()=> newAlgorithmSetup("Rw U R' U R U2 Rw2 U' R U' R' U2 Rw"),
                solves: [
                    "Rw U R' U R U2 Rw2 U' R U' R' U2 Rw"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.point-19',
                id: 'oll-point-19',
                imageUrl: '/img/training/3x3x3/oll/oll-case-point-19.png',
                generateSetupScramble: ()=> newAlgorithmSetup("M U R U R' U' M' R' F R F'"),
                solves: [
                    "M U R U R' U' M' R' F R F'"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.square-5',
                id: 'oll-square-5',
                imageUrl: '/img/training/3x3x3/oll/oll-case-square-5.png',
                generateSetupScramble: ()=> newAlgorithmSetup("Rw' U2 R U R' U Rw"),
                solves: [
                    "Rw' U2 R U R' U Rw"
                ]
            },
            {
                nameKey: 'training.3x3x3.oll.cases.square-6',
                id: 'oll-square-6',
                imageUrl: '/img/training/3x3x3/oll/oll-case-square-6.png',
                generateSetupScramble: ()=> newAlgorithmSetup("Rw U2 R' U' R U' Rw'"),
                solves: [
                    "Rw U2 R' U' R U' Rw'"
                ]
            }
        ]
    }
]

export default trainingSets333
