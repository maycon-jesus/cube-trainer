// Port of the Go `Cube333` to TypeScript for the web app.
//
// The Go terminal rendering (`fmt.Print` + the `tint` ANSI styles) does not
// apply in a browser, so `render()` returns a structured 3x3 grid per face
// (paired with `ColorHex` from ./cube) for a component to draw the unfolded
// cube instead of an ANSI string.

import {
  CubeColor,
  CubeFace,
  CubeFaceIndex,
  resolveMoveSet,
  type MovesCollection,
} from './cube'

const F = CubeFaceIndex

export const Cube333MovesCollection: MovesCollection = {
  U: [
    { srcFace: F.U, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.U, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.L, srcPos: [1, 2, 3], dstFace: F.B, dstPos: [1, 2, 3] },
    { srcFace: F.B, srcPos: [1, 2, 3], dstFace: F.R, dstPos: [1, 2, 3] },
    { srcFace: F.R, srcPos: [1, 2, 3], dstFace: F.F, dstPos: [1, 2, 3] },
    { srcFace: F.F, srcPos: [1, 2, 3], dstFace: F.L, dstPos: [1, 2, 3] },
  ],
  D: [
    { srcFace: F.D, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.D, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.L, srcPos: [7, 8, 9], dstFace: F.F, dstPos: [7, 8, 9] },
    { srcFace: F.F, srcPos: [7, 8, 9], dstFace: F.R, dstPos: [7, 8, 9] },
    { srcFace: F.R, srcPos: [7, 8, 9], dstFace: F.B, dstPos: [7, 8, 9] },
    { srcFace: F.B, srcPos: [7, 8, 9], dstFace: F.L, dstPos: [7, 8, 9] },
  ],
  F: [
    { srcFace: F.F, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.F, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.U, srcPos: [7, 8, 9], dstFace: F.R, dstPos: [1, 4, 7] },
    { srcFace: F.R, srcPos: [1, 4, 7], dstFace: F.D, dstPos: [3, 2, 1] },
    { srcFace: F.D, srcPos: [1, 2, 3], dstFace: F.L, dstPos: [3, 6, 9] },
    { srcFace: F.L, srcPos: [3, 6, 9], dstFace: F.U, dstPos: [9, 8, 7] },
  ],
  B: [
    { srcFace: F.B, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.B, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.R, srcPos: [3, 6, 9], dstFace: F.U, dstPos: [1, 2, 3] },
    { srcFace: F.U, srcPos: [1, 2, 3], dstFace: F.L, dstPos: [7, 4, 1] },
    { srcFace: F.L, srcPos: [1, 4, 7], dstFace: F.D, dstPos: [7, 8, 9] },
    { srcFace: F.D, srcPos: [7, 8, 9], dstFace: F.R, dstPos: [9, 6, 3] },
  ],
  R: [
    { srcFace: F.R, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.R, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.U, srcPos: [3, 6, 9], dstFace: F.B, dstPos: [7, 4, 1] },
    { srcFace: F.B, srcPos: [1, 4, 7], dstFace: F.D, dstPos: [9, 6, 3] },
    { srcFace: F.D, srcPos: [3, 6, 9], dstFace: F.F, dstPos: [3, 6, 9] },
    { srcFace: F.F, srcPos: [3, 6, 9], dstFace: F.U, dstPos: [3, 6, 9] },
  ],
  L: [
    { srcFace: F.L, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: F.L, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: F.U, srcPos: [1, 4, 7], dstFace: F.F, dstPos: [1, 4, 7] },
    { srcFace: F.F, srcPos: [1, 4, 7], dstFace: F.D, dstPos: [1, 4, 7] },
    { srcFace: F.D, srcPos: [1, 4, 7], dstFace: F.B, dstPos: [9, 6, 3] },
    { srcFace: F.B, srcPos: [3, 6, 9], dstFace: F.U, dstPos: [7, 4, 1] },
  ],
}

export class Cube333 {
  readonly faces: CubeFace[] = new Array<CubeFace>(6)

  constructor() {
    this.faces[F.L] = new CubeFace(CubeColor.Orange, 3)
    this.faces[F.U] = new CubeFace(CubeColor.White, 3)
    this.faces[F.F] = new CubeFace(CubeColor.Green, 3)
    this.faces[F.D] = new CubeFace(CubeColor.Yellow, 3)
    this.faces[F.R] = new CubeFace(CubeColor.Red, 3)
    this.faces[F.B] = new CubeFace(CubeColor.Blue, 3)
  }

  applyMove(move: string): void {
    if (move.length === 0) {
      throw new Error('invalid move: empty string')
    }
    if (move.length > 2) {
      throw new Error('invalid move: too long')
    }

    const face = move[0]!
    const last = move[move.length - 1]
    const double = last === '2'
    const reverse = last === "'"

    const moveSet = Cube333MovesCollection[face]
    if (!moveSet) {
      throw new Error('invalid move: ' + move)
    }

    resolveMoveSet(this.faces, moveSet)
    if (double) {
      resolveMoveSet(this.faces, moveSet)
    }
    if (reverse) {
      resolveMoveSet(this.faces, moveSet)
      resolveMoveSet(this.faces, moveSet)
    }
  }

  applyMoves(moves: string[]): void {
    for (const move of moves) {
      this.applyMove(move)
    }
  }

  /**
   * Returns each face as a 3x3 grid of colors, in the same layout the Go
   * `Render` produced, ready for a component to draw the unfolded cube.
   */
  render(): Record<keyof typeof CubeFaceIndex, CubeColor[][]> {
    const grid = (face: CubeFaceIndex): CubeColor[][] => {
      const pieces = this.faces[face]!.pieces
      return [pieces.slice(0, 3), pieces.slice(3, 6), pieces.slice(6, 9)]
    }

    return {
      L: grid(F.L),
      U: grid(F.U),
      F: grid(F.F),
      D: grid(F.D),
      R: grid(F.R),
      B: grid(F.B),
    }
  }
}

export function createCube333(): Cube333 {
  return new Cube333()
}

function randomFromArr<T>(arr: T[]): [T, number] {
  const n = Math.floor(Math.random() * arr.length)
  return [arr[n]!, n]
}

export function generateScramble333(movesCount: number): string {
  const moves: string[] = []

  const axisMoves: string[][] = [
    ['U', 'D'],
    ['F', 'B'],
    ['L', 'R'],
  ]
  const modifiers = ['', '2', "'"]

  const latestAxis: number[] = []
  let latestMove = -1

  while (moves.length < movesCount) {
    const [axis, nAxis] = randomFromArr(axisMoves)

    if (latestAxis.length === 2 && latestAxis[0] === nAxis && latestAxis[1] === nAxis) {
      continue
    }

    const [move, nMove] = randomFromArr(axis)
    if (nMove === latestMove && latestAxis[latestAxis.length - 1] === nAxis) {
      continue
    }

    const [modifier] = randomFromArr(modifiers)

    moves.push(move + modifier)
    latestMove = nMove

    if (latestAxis.length === 2) {
      latestAxis.shift()
    }
    latestAxis.push(nAxis)
  }

  return moves.join(' ')
}
