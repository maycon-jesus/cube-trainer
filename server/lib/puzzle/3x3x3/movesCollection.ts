import type { MovesCollection } from "../cube"
import { FaceIndex } from "./faces"

export const CubeMovesCollection: MovesCollection = {
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
  M: [
    { srcFace: FaceIndex.U, srcPos: [2, 5, 8], dstFace: FaceIndex.F, dstPos: [2, 5, 8] },
    { srcFace: FaceIndex.F, srcPos: [2, 5, 8], dstFace: FaceIndex.D, dstPos: [2, 5, 8] },
    { srcFace: FaceIndex.D, srcPos: [2, 5, 8], dstFace: FaceIndex.B, dstPos: [8, 5, 2] },
    { srcFace: FaceIndex.B, srcPos: [2, 5, 8], dstFace: FaceIndex.U, dstPos: [8, 5, 2] },
  ],
  S: [
    { srcFace: FaceIndex.U, srcPos: [4, 5, 6], dstFace: FaceIndex.R, dstPos: [2, 5, 8] },
    { srcFace: FaceIndex.R, srcPos: [2, 5, 8], dstFace: FaceIndex.D, dstPos: [6, 5, 4] },
    { srcFace: FaceIndex.D, srcPos: [4, 5, 6], dstFace: FaceIndex.L, dstPos: [2, 5, 8] },
    { srcFace: FaceIndex.L, srcPos: [2, 5, 8], dstFace: FaceIndex.U, dstPos: [6, 5, 4] },
  ],
  E: [
    { srcFace: FaceIndex.L, srcPos: [4, 5, 6], dstFace: FaceIndex.F, dstPos: [4, 5, 6] },
    { srcFace: FaceIndex.F, srcPos: [4, 5, 6], dstFace: FaceIndex.R, dstPos: [4, 5, 6] },
    { srcFace: FaceIndex.R, srcPos: [4, 5, 6], dstFace: FaceIndex.B, dstPos: [4, 5, 6] },
    { srcFace: FaceIndex.B, srcPos: [4, 5, 6], dstFace: FaceIndex.L, dstPos: [4, 5, 6] },
  ],
}

export const CubeRotations: Record<string, string[]> = {
  x: ['R', "M'", "L'"],
  y: ['U', "E'", "D'"],
  z: ['F', 'S', "B'"],
}

// Wide (double-layer) moves.
export const CubeWideMoves: Record<string, string[]> = {
  Rw: ['R', "M'"],
  Fw: ['F', 'S'],
  Dw: ['D', 'E'],
}