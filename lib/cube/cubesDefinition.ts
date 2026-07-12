import { generateScramble333 } from "./333"
import { generateScrambleMegaminx } from "./megaminx"
import { generateScramblePyraminx } from "./pyraminx"
import type { CubeEngine } from "./cube"
import {MegaminxIcon, Mirror2x2Icon, Cube2x2x2Icon, Cube3x3x3Icon, Cube4x4x4Icon, Cube5x5x5Icon, Cube6x6x6Icon, Cube7x7x7Icon, Mirror3x3Icon, PyraminxIcon, OtherIcon} from "@icon"
import type { Component } from "vue"

export type TrainingAlgorithm = {
    name: string,
    id: string,
    imageUrl: string,
    setups: string[],
    solves: string[],
}

export type TrainingSet = {
    name: string,
    id: string,
    description: string,
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
                name: 'PLL',
                id: 'pll',
                description: 'Practice PLL algorithms',
                imageUrl: '/img/training/3x3x3/pll.png',
                algorithms: [
                    {
                        name: 'Caso U horário',
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
                        name: 'Caso U anti-horário',
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
                        name: 'Caso A horário',
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
                        name: 'Caso A anti-horário',
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
                        name: 'Caso H',
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
                        name: 'Caso Z',
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
                        name: 'Caso T',
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
                        name: 'Caso F',
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
                        name: 'Caso Y',
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
                        name: 'Caso E',
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
                        name: 'Caso V',
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
                        name: 'Caso R1',
                        id: 'pll-r1',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-r1.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U' R' U' R U R D R' U' R D' R' U2 R' U'"
                        ]
                    },
                    {
                        name: 'Caso R2',
                        id: 'pll-r2',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-r2.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U2 R U2' R' F R U R' U' R' F' R2 U'"
                        ]
                    },
                    {
                        name: 'Caso J1',
                        id: 'pll-j1',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-j1.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "x R2 F R F' R U2 Rw' U Rw U2 x'"
                        ]
                    },
                    {
                        name: 'Caso J2',
                        id: 'pll-j2',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-j2.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' F' R U R' U' R' F R2 U' R' U'"
                        ]
                    },
                    {
                        name: 'Caso N1',
                        id: 'pll-n1',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-n1.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
                        ]
                    },
                    {
                        name: 'Caso N2',
                        id: 'pll-n2',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-n2.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U R U' R' F' U' F R U R' F R' F' R U' R"
                        ]
                    },
                    {
                        name: 'Caso G1',
                        id: 'pll-g1',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-g1.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R2' Uw R' U R' U' R Uw' R2 y' R' U R"
                        ]
                    },
                    {
                        name: 'Caso G2',
                        id: 'pll-g2',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-g2.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R' U' R U D' R2 U R' U R U' R U' R2 D U'"
                        ]
                    },
                    {
                        name: 'Caso G3',
                        id: 'pll-g3',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-g3.png',
                        setups: [
                            "R R R"
                        ],
                        solves: [
                            "R2 U' R U' R U R' U R2 D' U R U' R' D U'"
                        ]
                    },
                    {
                        name: 'Caso G4',
                        id: 'pll-g4',
                        imageUrl: '/img/training/3x3x3/pll/pll-case-g4.png',
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