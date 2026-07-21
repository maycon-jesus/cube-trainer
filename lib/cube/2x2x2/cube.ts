import {
  CubeColor,
  CubeFace,
  resolveMoveSet,
  type MovesCollection,
} from '../cube'

import {randomFromArr} from "../../utils/array"

export enum FaceIndex {
  L = 0,
  U,
  F,
  D,
  R,
  B,
}

export const CubeMovesCollection: MovesCollection = {
  U: [
    { srcFace: FaceIndex.U, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.U, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.L, srcPos: [1, 2], dstFace: FaceIndex.B, dstPos: [1, 2] },
    { srcFace: FaceIndex.B, srcPos: [1, 2], dstFace: FaceIndex.R, dstPos: [1, 2] },
    { srcFace: FaceIndex.R, srcPos: [1, 2], dstFace: FaceIndex.F, dstPos: [1, 2] },
    { srcFace: FaceIndex.F, srcPos: [1, 2], dstFace: FaceIndex.L, dstPos: [1, 2] },
  ],
  D: [
    { srcFace: FaceIndex.D, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.D, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.L, srcPos: [3, 4], dstFace: FaceIndex.F, dstPos: [3, 4] },
    { srcFace: FaceIndex.F, srcPos: [3, 4], dstFace: FaceIndex.R, dstPos: [3, 4] },
    { srcFace: FaceIndex.R, srcPos: [3, 4], dstFace: FaceIndex.B, dstPos: [3, 4] },
    { srcFace: FaceIndex.B, srcPos: [3, 4], dstFace: FaceIndex.L, dstPos: [3, 4] },
  ],
  F: [
    { srcFace: FaceIndex.F, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.F, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.U, srcPos: [3, 4], dstFace: FaceIndex.R, dstPos: [1, 3] },
    { srcFace: FaceIndex.R, srcPos: [1, 3], dstFace: FaceIndex.D, dstPos: [2, 1] },
    { srcFace: FaceIndex.D, srcPos: [1, 2], dstFace: FaceIndex.L, dstPos: [2, 4] },
    { srcFace: FaceIndex.L, srcPos: [2, 4], dstFace: FaceIndex.U, dstPos: [4, 3] },
  ],
  B: [
    { srcFace: FaceIndex.B, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.B, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.R, srcPos: [2, 4], dstFace: FaceIndex.U, dstPos: [1, 2] },
    { srcFace: FaceIndex.U, srcPos: [1, 2], dstFace: FaceIndex.L, dstPos: [3, 1] },
    { srcFace: FaceIndex.L, srcPos: [1, 3], dstFace: FaceIndex.D, dstPos: [3, 4] },
    { srcFace: FaceIndex.D, srcPos: [3, 4], dstFace: FaceIndex.R, dstPos: [4, 2] },
  ],
  R: [
    { srcFace: FaceIndex.R, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.R, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.U, srcPos: [2, 4], dstFace: FaceIndex.B, dstPos: [3, 1] },
    { srcFace: FaceIndex.B, srcPos: [1, 3], dstFace: FaceIndex.D, dstPos: [4, 2] },
    { srcFace: FaceIndex.D, srcPos: [2, 4], dstFace: FaceIndex.F, dstPos: [2, 4] },
    { srcFace: FaceIndex.F, srcPos: [2, 4], dstFace: FaceIndex.U, dstPos: [2, 4] },
  ],
  L: [
    { srcFace: FaceIndex.L, srcPos: [1, 2, 3, 4], dstFace: FaceIndex.L, dstPos: [2, 4, 1, 3] },
    { srcFace: FaceIndex.U, srcPos: [1, 3], dstFace: FaceIndex.F, dstPos: [1, 3] },
    { srcFace: FaceIndex.F, srcPos: [1, 3], dstFace: FaceIndex.D, dstPos: [1, 3] },
    { srcFace: FaceIndex.D, srcPos: [1, 3], dstFace: FaceIndex.B, dstPos: [4, 2] },
    { srcFace: FaceIndex.B, srcPos: [2, 4], dstFace: FaceIndex.U, dstPos: [3, 1] },
  ],
}

export const CubeRotations: Record<string, string[]> = {
  x: ['R', "L'"],
  y: ['U', "D'"],
  z: ['F', "B'"],
}

export const CubeWideMoves: Record<string, string[]> = {
  Rw: ['R', "L'"],
  Fw: ['F', "B'"],
  Dw: ['D', "U'"],
}

export class Cube {
  readonly faces: CubeFace<CubeColor>[] = new Array(6)

  constructor() {
    this.faces[FaceIndex.L] = new CubeFace(4, CubeColor.Orange)
    this.faces[FaceIndex.U] = new CubeFace(4, CubeColor.White)
    this.faces[FaceIndex.F] = new CubeFace(4, CubeColor.Green)
    this.faces[FaceIndex.D] = new CubeFace(4, CubeColor.Yellow)
    this.faces[FaceIndex.R] = new CubeFace(4, CubeColor.Red)
    this.faces[FaceIndex.B] = new CubeFace(4, CubeColor.Blue)
  }

  applyMove(move: string): void {
    if (move.length === 0) {
      throw new Error('invalid move: empty string')
    }

    const last = move[move.length - 1]
    const double = last === '2'
    const reverse = last === "'"
    const base = double || reverse ? move.slice(0, -1) : move

    const sequence = CubeRotations[base] ?? CubeWideMoves[base]
    if (sequence) {
      const seq = reverse ? invertScramble(sequence.join(' ')).split(' ') : sequence
      const times = double ? 2 : 1
      for (let i = 0; i < times; i++) {
        this.applyMoves(seq)
      }
      return
    }

    const moveSet = CubeMovesCollection[base]
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
}

export function invertScramble(scramble: string): string {
  const moves = scramble.split(' ')
  const reversedMoves: string[] = []

  for (let i = moves.length - 1; i >= 0; i--) {
    const move = moves[i]!
    if (move.endsWith("'")) {
      reversedMoves.push(move.slice(0, -1))
    } else if (move.endsWith('2')) {
      reversedMoves.push(move)
    } else {
      reversedMoves.push(move + "'")
    }
  }

  return reversedMoves.join(' ')
}

export function randomAUFScramble(scramble: string): string {
  const AUFs: (string|null)[] = ["U", "U'", "U2", null]
  const [auf, _] = randomFromArr(AUFs)
  return auf ? auf + ' ' + scramble : scramble
}