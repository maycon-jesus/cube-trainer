import { generateScramble333 } from "./333"
import { generateScrambleMegaminx } from "./megaminx"
import { generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import {MegaminxIcon, Mirror2x2Icon, Cube2x2x2Icon, Cube3x3x3Icon, Cube4x4x4Icon, Cube5x5x5Icon, Cube6x6x6Icon, Cube7x7x7Icon, Mirror3x3Icon, PyraminxIcon, OtherIcon} from "@icon"
import type { Component } from "vue"

export type TrainingAlgorithm = {
    nameKey?: string,
    name?: string,
    id: string,
    imageUrl: string,
    setups: string[],
    solves: string[],
}

export type TrainingSet = {
    nameKey?: string,
    name?: string,
    id: string,
    descriptionKey?: string,
    description?: string,
    imageUrl: string,
    algorithms: TrainingAlgorithm[]
}

export type CubeData = {
    id: string,
    name: string,
    cubeEngine?: CubeEngine,
    imageUrl?: string,
    generateScramble?: (movesCount?: number) => string,
    icon: Component,
    trainingSets?: TrainingSet[]
}

export const cubesDefinition: Record<string, CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        name: "2x2x2",
        generateScramble: generateScramble333,
        icon: Cube2x2x2Icon
    },
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3",
        generateScramble: generateScramble333,
        icon: Cube3x3x3Icon,
        imageUrl: '/img/puzzle/3x3x3.png',
        trainingSets: [
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
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U R' U' R' U' R' U R U R2"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.u-anticlockwise',
                        id: 'pll-u-anti-horario',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-u-anticlockwise.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R2 U' R' U' R U R U R U' R"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.a-clockwise',
                        id: 'pll-a-horario',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-a-clockwise.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "x R' U R' D2 R U' R' D2 R2 x'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.a-anticlockwise',
                        id: 'pll-a-anti-horario',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-a-anticlockwise.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "x R2' D2 R U R'D2 R U' R x'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.h',
                        id: 'pll-h',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-h.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "M2 U M2 U2 M2 U M2"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.z',
                        id: 'pll-z',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-z.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "M2 U M2 U M' U2 M2 U2 M'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.t',
                        id: 'pll-t',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-t.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' U' R' F R2 U' R' U' R U R' F'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.f',
                        id: 'pll-f',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-f.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.y',
                        id: 'pll-y',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-y.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "F R U' R' U' R U R' F' R U R' U' R' F R F'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.e',
                        id: 'pll-e',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-e.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.v',
                        id: 'pll-v',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-v.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U R' Dw' R' F' R2 U' R' U R' F R F"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.ra',
                        id: 'pll-ra',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-ra.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U' R' U' R U R D R' U' R D' R' U2 R' U'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.rb',
                        id: 'pll-rb',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-rb.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U2 R U2' R' F R U R' U' R' F' R2 U'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.ja',
                        id: 'pll-ja',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-ja.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "x R2 F R F' R U2 Rw' U Rw U2 x'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.jb',
                        id: 'pll-jb',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-jb.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' F' R U R' U' R' F R2 U' R' U'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.na',
                        id: 'pll-na',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-na.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.nb',
                        id: 'pll-nb',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-nb.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U R U' R' F' U' F R U R' F R' F' R U' R"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.ga',
                        id: 'pll-ga',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-ga.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R2' Uw R' U R' U' R Uw' R2 y' R' U R"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.gb',
                        id: 'pll-gb',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-gb.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U' R U D' R2 U R' U R U' R U' R2 D U'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.gc',
                        id: 'pll-gc',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-gc.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R2 U' R U' R U R' U R2 D' U R U' R' D U'"
                        ]
                    },
                    {
                        nameKey: 'training.3x3x3.pll.cases.gd',
                        id: 'pll-gd',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-gd.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' y' R2 Uw' R U' R' U R' Uw R2"
                        ]
                    },
                ]
            },
        ]
    },
    "4x4x4": {
        id: "4x4x4",
        name: "4x4x4",
        icon: Cube4x4x4Icon
    },
    "5x5x5": {
        id: "5x5x5",
        name: "5x5x5",
        icon: Cube5x5x5Icon
    },
    "6x6x6": {
        id: "6x6x6",
        name: "6x6x6",
        icon: Cube6x6x6Icon
    },
    "7x7x7": {
        id: "7x7x7",
        name: "7x7x7",
        icon: Cube7x7x7Icon
    },
    "pyraminx": {
        id: "pyraminx",
        name: "Pyraminx",
        generateScramble: generateScramblePyraminx,
        icon: PyraminxIcon
    },
    "megaminx": {
        id: "megaminx",
        name: "Megaminx",
        generateScramble: generateScrambleMegaminx,
        icon: MegaminxIcon
    },
    "mirror-3x3x3": {
        id: "mirror-3x3x3",
        name: "Mirror 3x3x3",
        icon: Mirror3x3Icon
    },
    "mirror-2x2x2": {
        id: "mirror-2x2x2",
        name: "Mirror 2x2x2",
        icon: Mirror2x2Icon
    },
    "other": {
        id: "other",
        name: "Other",
        icon: OtherIcon
    }
}