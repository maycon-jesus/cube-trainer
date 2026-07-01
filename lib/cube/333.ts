// Port of the Go `Cube333` to TypeScript for the web app.
//
// The Go terminal rendering (`fmt.Print` + the `tint` ANSI styles) does not
// apply in a browser, so `render()` returns a structured 3x3 grid per face
// (paired with `ColorHex` from ./cube) for a component to draw the unfolded
// cube instead of an ANSI string.

import {
  CubeColor,
  CubeFace,
  resolveMoveSet,
  type MovesCollection,
} from './cube'

export enum FaceIndex {
  L = 0,
  U,
  F,
  D,
  R,
  B,
}

export const Cube333MovesCollection: MovesCollection = {
  U: [
    { srcFace: FaceIndex.U, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.U, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.L, srcPos: [1, 2, 3], dstFace: FaceIndex.B, dstPos: [1, 2, 3] },
    { srcFace: FaceIndex.B, srcPos: [1, 2, 3], dstFace: FaceIndex.R, dstPos: [1, 2, 3] },
    { srcFace: FaceIndex.R, srcPos: [1, 2, 3], dstFace: FaceIndex.F, dstPos: [1, 2, 3] },
    { srcFace: FaceIndex.F, srcPos: [1, 2, 3], dstFace: FaceIndex.L, dstPos: [1, 2, 3] },
  ],
  D: [
    { srcFace: FaceIndex.D, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.D, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.L, srcPos: [7, 8, 9], dstFace: FaceIndex.F, dstPos: [7, 8, 9] },
    { srcFace: FaceIndex.F, srcPos: [7, 8, 9], dstFace: FaceIndex.R, dstPos: [7, 8, 9] },
    { srcFace: FaceIndex.R, srcPos: [7, 8, 9], dstFace: FaceIndex.B, dstPos: [7, 8, 9] },
    { srcFace: FaceIndex.B, srcPos: [7, 8, 9], dstFace: FaceIndex.L, dstPos: [7, 8, 9] },
  ],
  F: [
    { srcFace: FaceIndex.F, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.F, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.U, srcPos: [7, 8, 9], dstFace: FaceIndex.R, dstPos: [1, 4, 7] },
    { srcFace: FaceIndex.R, srcPos: [1, 4, 7], dstFace: FaceIndex.D, dstPos: [3, 2, 1] },
    { srcFace: FaceIndex.D, srcPos: [1, 2, 3], dstFace: FaceIndex.L, dstPos: [3, 6, 9] },
    { srcFace: FaceIndex.L, srcPos: [3, 6, 9], dstFace: FaceIndex.U, dstPos: [9, 8, 7] },
  ],
  B: [
    { srcFace: FaceIndex.B, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.B, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.R, srcPos: [3, 6, 9], dstFace: FaceIndex.U, dstPos: [1, 2, 3] },
    { srcFace: FaceIndex.U, srcPos: [1, 2, 3], dstFace: FaceIndex.L, dstPos: [7, 4, 1] },
    { srcFace: FaceIndex.L, srcPos: [1, 4, 7], dstFace: FaceIndex.D, dstPos: [7, 8, 9] },
    { srcFace: FaceIndex.D, srcPos: [7, 8, 9], dstFace: FaceIndex.R, dstPos: [9, 6, 3] },
  ],
  R: [
    { srcFace: FaceIndex.R, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.R, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.U, srcPos: [3, 6, 9], dstFace: FaceIndex.B, dstPos: [7, 4, 1] },
    { srcFace: FaceIndex.B, srcPos: [1, 4, 7], dstFace: FaceIndex.D, dstPos: [9, 6, 3] },
    { srcFace: FaceIndex.D, srcPos: [3, 6, 9], dstFace: FaceIndex.F, dstPos: [3, 6, 9] },
    { srcFace: FaceIndex.F, srcPos: [3, 6, 9], dstFace: FaceIndex.U, dstPos: [3, 6, 9] },
  ],
  L: [
    { srcFace: FaceIndex.L, srcPos: [1, 2, 3, 4, 5, 6, 7, 8, 9], dstFace: FaceIndex.L, dstPos: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { srcFace: FaceIndex.U, srcPos: [1, 4, 7], dstFace: FaceIndex.F, dstPos: [1, 4, 7] },
    { srcFace: FaceIndex.F, srcPos: [1, 4, 7], dstFace: FaceIndex.D, dstPos: [1, 4, 7] },
    { srcFace: FaceIndex.D, srcPos: [1, 4, 7], dstFace: FaceIndex.B, dstPos: [9, 6, 3] },
    { srcFace: FaceIndex.B, srcPos: [3, 6, 9], dstFace: FaceIndex.U, dstPos: [7, 4, 1] },
  ],
}

export class Cube333 {
  readonly faces: CubeFace<CubeColor>[] = new Array(6)

  constructor() {
    this.faces[FaceIndex.L] = new CubeFace(9, CubeColor.Orange)
    this.faces[FaceIndex.U] = new CubeFace(9, CubeColor.White)
    this.faces[FaceIndex.F] = new CubeFace(9, CubeColor.Green)
    this.faces[FaceIndex.D] = new CubeFace(9, CubeColor.Yellow)
    this.faces[FaceIndex.R] = new CubeFace(9, CubeColor.Red)
    this.faces[FaceIndex.B] = new CubeFace(9, CubeColor.Blue)
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
  render(): Record<keyof typeof FaceIndex, CubeColor[][]> {
    const grid = (face: FaceIndex): CubeColor[][] => {
      const pieces = this.faces[face]!.pieces
      return [pieces.slice(0, 3), pieces.slice(3, 6), pieces.slice(6, 9)]
    }

    return {
      L: grid(FaceIndex.L),
      U: grid(FaceIndex.U),
      F: grid(FaceIndex.F),
      D: grid(FaceIndex.D),
      R: grid(FaceIndex.R),
      B: grid(FaceIndex.B),
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
