// Port of the Go `Cube333` to TypeScript for the web app.
//
// The Go terminal rendering (`fmt.Print` + the `tint` ANSI styles) does not
// apply in a browser, so `render()` returns a structured 3x3 grid per face
// (paired with `ColorHex` from ./cube) for a component to draw the unfolded
// cube instead of an ANSI string.

import {
  CubeColor,
  ColorHex,
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

export const Cube333Rotations: Record<string, string[]> = {
  x: ['R', "M'", "L'"],
}

// Wide (double-layer) moves.
export const Cube333WideMoves: Record<string, string[]> = {
  Rw: ['R', "M'"],
  Fw: ['F', 'S'],
  Dw: ['D', 'E'],
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

    const last = move[move.length - 1]
    const double = last === '2'
    const reverse = last === "'"
    const base = double || reverse ? move.slice(0, -1) : move

    const sequence = Cube333Rotations[base] ?? Cube333WideMoves[base]
    if (sequence) {
      const seq = reverse ? invertScramble(sequence.join(' ')).split(' ') : sequence
      const times = double ? 2 : 1
      for (let i = 0; i < times; i++) {
        this.applyMoves(seq)
      }
      return
    }

    const moveSet = Cube333MovesCollection[base]
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

  /**
   * Renders the cube as a self-contained SVG string of the unfolded net (the
   * classic cross: U on top, L F R B in the middle row, D at the bottom).
   *
   * The return is a plain string so the front-end can drop it straight into
   * `v-html`, an `<img src>` via {@link renderSvgDataUri}, or a download —
   * no per-sticker Vue markup required.
   */
  renderSvg(options: RenderSvgOptions = {}): string {
    const sticker = options.stickerSize ?? 16
    const gap = options.gap ?? 2
    const stroke = options.stroke ?? '#00000073'
    const background = options.background ?? 'transparent'
    const radius = options.radius ?? 2

    const face = sticker * 3 + gap * 2 // side length of one 3x3 face
    // Net layout in face units: [column, row] for each face.
    const layout: Record<keyof typeof FaceIndex, [number, number]> = {
      U: [1, 0],
      L: [0, 1],
      F: [1, 1],
      R: [2, 1],
      B: [3, 1],
      D: [1, 2],
    }

    const grids = this.render()
    const rects: string[] = []

    for (const key of Object.keys(layout) as (keyof typeof FaceIndex)[]) {
      const [fcol, frow] = layout[key]
      const originX = fcol * (face + gap)
      const originY = frow * (face + gap)

      grids[key].forEach((line, r) => {
        line.forEach((color, c) => {
          const x = originX + c * (sticker + gap)
          const y = originY + r * (sticker + gap)
          rects.push(
            `<rect x="${x}" y="${y}" width="${sticker}" height="${sticker}" rx="${radius}" ` +
            `fill="${ColorHex[color]}" stroke="${stroke}" stroke-width="1"/>`,
          )
        })
      })
    }

    const width = 4 * face + 3 * gap
    const height = 3 * face + 2 * gap

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
      `viewBox="0 0 ${width} ${height}">` +
      `<rect width="${width}" height="${height}" fill="${background}"/>` +
      rects.join('') +
      `</svg>`
    )
  }

  /**
   * Same as {@link renderSvg} but as a `data:` URI, ready to use directly as an
   * `<img :src>` value on the front-end. Uses UTF-8 percent-encoding so it works
   * both in the browser and during SSR without `btoa`/`Buffer`.
   */
  renderSvgDataUri(options: RenderSvgOptions = {}): string {
    const svg = this.renderSvg(options)
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }
}

export interface RenderSvgOptions {
  /** Side length of a single sticker in px. Default `16`. */
  stickerSize?: number
  /** Gap in px between stickers and between faces. Default `2`. */
  gap?: number
  /** Sticker border color. Default `#00000073`. */
  stroke?: string
  /** Background fill of the whole SVG. Default `transparent`. */
  background?: string
  /** Sticker corner radius in px. Default `2`. */
  radius?: number
}

export function createCube(): Cube333 {
  return new Cube333()
}

export function generateScramble(movesCount: number = 20): string {
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

export function randomAUFScramble(scramble: string): string {
  const AUFs: (string|null)[] = ["U", "U'", "U2", null]
  const [auf, _] = randomFromArr(AUFs)
  return auf ? auf + ' ' + scramble : scramble
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