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

export abstract class CubeEngine {
  abstract generateScramble(movesCount: number): string
  abstract applyMove(move: string): void
  abstract applyMoves(moves: string[]): void
  abstract render(): Record<number, CubeColor[][]>
}

export type CubeFaceFiller<Piece> = Piece | Piece[]

export class CubeFace<Piece> {
  private size: number
  private filler: CubeFaceFiller<Piece>
  pieces: Piece[]

  constructor(size: number, filler: CubeFaceFiller<Piece>) {
    this.size = size
    this.filler = filler

    this.pieces = new Array<Piece>(size)
    if (Array.isArray(filler)) {
      this.pieces = structuredClone(filler)
    } else {
      this.pieces.fill(structuredClone(filler))
    }
  }

  clone(): CubeFace<Piece> {
    return new CubeFace<Piece>(this.size, this.pieces)
  }
}

export interface PieceMove {
  srcFace: number
  srcPos: number[]
  dstFace: number
  dstPos: number[]
}

export type MoveSet = PieceMove[]
export type MovesCollection = Record<string, MoveSet>

/**
 * Applies a move set to the faces. All transfers read from a snapshot taken
 * before any write, so the permutation is applied simultaneously.
 */
export function resolveMoveSet<Piece>(faces: CubeFace<Piece>[], moveSet: MoveSet): void {
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
