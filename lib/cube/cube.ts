// Base types for the cube engine, ported from the Go `cube` package.
//
// The Go terminal rendering (the `tint` ANSI styles) is not portable to the
// browser, so colors are exposed as an enum plus a hex map for components to
// consume. Piece positions stay 1-based in the move tables to match the Go
// source and are converted to 0-based when indexing the piece arrays.

export enum CubeColor {
  Orange = 1,
  White,
  Green,
  Yellow,
  Red,
  Blue,
}

/** CSS hex value for each color, replacing the Go `tint` terminal styles. */
export const ColorHex: Record<CubeColor, string> = {
  [CubeColor.Orange]: '#ffa500',
  [CubeColor.White]: '#ffffff',
  [CubeColor.Green]: '#00ff00',
  [CubeColor.Yellow]: '#ffff00',
  [CubeColor.Red]: '#ff0000',
  [CubeColor.Blue]: '#0000ff',
}

export enum CubeFaceIndex {
  L = 0,
  U,
  F,
  D,
  R,
  B,
}

export class CubeFace {
  color: CubeColor
  pieces: CubeColor[]

  constructor(color: CubeColor, size: number) {
    this.color = color
    this.pieces = new Array<CubeColor>(size * size).fill(color)
  }

  clone(): CubeFace {
    const clone = Object.create(CubeFace.prototype) as CubeFace
    clone.color = this.color
    clone.pieces = [...this.pieces]
    return clone
  }
}

/**
 * Layout of the pieces on each face:
 *
 *     1 2 3
 *     4 5 6
 *     7 8 9
 */
export interface PieceMove {
  srcFace: CubeFaceIndex
  srcPos: number[]
  dstFace: CubeFaceIndex
  dstPos: number[]
}

export type MoveSet = PieceMove[]
export type MovesCollection = Record<string, MoveSet>

/**
 * Applies a move set to the faces. All transfers read from a snapshot taken
 * before any write, so the permutation is applied simultaneously.
 */
export function resolveMoveSet(faces: CubeFace[], moveSet: MoveSet): void {
  const facesSrc = faces.map((face) => face.clone())

  for (const move of moveSet) {
    const dstFace = faces[move.dstFace]!
    const srcFace = facesSrc[move.srcFace]!
    for (let i = 0; i < move.srcPos.length; i++) {
      // Subtract 1 to adjust the position from 1-9 to 0-8.
      dstFace.pieces[move.dstPos[i]! - 1] = srcFace.pieces[move.srcPos[i]! - 1]!
    }
  }
}
