import type { CubePattern } from "../patterns/types"

const patterns333: CubePattern[] = [
    {
        nameKey: 'patterns.3x3x3.cases.checkerboard.name',
        descriptionKey: 'patterns.3x3x3.cases.checkerboard.description',
        id: 'checkerboard',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/checkerboard.png',
        algorithm: 'M2 E2 S2'
    },
    {
        nameKey: 'patterns.3x3x3.cases.wire.name',
        descriptionKey: 'patterns.3x3x3.cases.wire.description',
        id: 'wire',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/wire.png',
        algorithm: 'M2 U2 M2 U2'
    },
    {
        nameKey: 'patterns.3x3x3.cases.plus-minus.name',
        descriptionKey: 'patterns.3x3x3.cases.plus-minus.description',
        id: 'plus-minus',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/plus-minus.png',
        algorithm: 'U2 R2 L2 U2 R2 L2'
    },
    {
        nameKey: 'patterns.3x3x3.cases.four-spots.name',
        descriptionKey: 'patterns.3x3x3.cases.four-spots.description',
        id: 'four-spots',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/four-spots.png',
        algorithm: "F2 B2 U D' R2 L2 U D'"
    },
    {
        nameKey: 'patterns.3x3x3.cases.six-spots.name',
        descriptionKey: 'patterns.3x3x3.cases.six-spots.description',
        id: 'six-spots',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/six-spots.png',
        algorithm: "U D' R L' F B' U D'"
    },
    {
        nameKey: 'patterns.3x3x3.cases.tetris.name',
        descriptionKey: 'patterns.3x3x3.cases.tetris.description',
        id: 'tetris',
        difficulty: 'easy',
        imageUrl: '/img/patterns/3x3x3/tetris.png',
        algorithm: "L R F B U' D' L' R'"
    },
    {
        nameKey: 'patterns.3x3x3.cases.cube-in-cube.name',
        descriptionKey: 'patterns.3x3x3.cases.cube-in-cube.description',
        id: 'cube-in-cube',
        difficulty: 'medium',
        imageUrl: '/img/patterns/3x3x3/cube-in-cube.png',
        algorithm: "F L F U' R U F2 L2 U' L' B D' B' L2 U"
    },
    {
        nameKey: 'patterns.3x3x3.cases.cross.name',
        descriptionKey: 'patterns.3x3x3.cases.cross.description',
        id: 'cross',
        difficulty: 'medium',
        imageUrl: '/img/patterns/3x3x3/cross.png',
        algorithm: "R2 L' D F2 R' D' R' L U' D R D B2 R' U D2"
    },
    {
        nameKey: 'patterns.3x3x3.cases.vertical-stripes.name',
        descriptionKey: 'patterns.3x3x3.cases.vertical-stripes.description',
        id: 'vertical-stripes',
        difficulty: 'medium',
        imageUrl: '/img/patterns/3x3x3/vertical-stripes.png',
        algorithm: "F U F R L2 B D' R D2 L D' B R2 L F U F"
    },
    {
        nameKey: 'patterns.3x3x3.cases.cube-in-cube-in-cube.name',
        descriptionKey: 'patterns.3x3x3.cases.cube-in-cube-in-cube.description',
        id: 'cube-in-cube-in-cube',
        difficulty: 'hard',
        imageUrl: '/img/patterns/3x3x3/cube-in-cube-in-cube.png',
        algorithm: "U' L' U' F' R2 B' R F U B2 U B' L U' F U R F'"
    },
    {
        nameKey: 'patterns.3x3x3.cases.superflip.name',
        descriptionKey: 'patterns.3x3x3.cases.superflip.description',
        id: 'superflip',
        difficulty: 'hard',
        imageUrl: '/img/patterns/3x3x3/superflip.png',
        algorithm: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
    }
]

export default patterns333
