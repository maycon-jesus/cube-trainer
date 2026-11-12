import type { CubeEngine} from "../cube";
import { CubeFace, resolveMoveSet } from "../cube"
import { FaceIndex, PieceColor, PieceColorHex } from "./faces";
import { CubeMovesCollection, CubeRotations, CubeWideMoves } from "./movesCollection";
import { generateScramble, invertScramble } from "./scramble";

export class Engine implements CubeEngine {
  readonly faces: CubeFace<PieceColor>[] = new Array(6)

  constructor() {
    this.faces[FaceIndex.L] = new CubeFace(9, PieceColor.Orange)
    this.faces[FaceIndex.U] = new CubeFace(9, PieceColor.White)
    this.faces[FaceIndex.F] = new CubeFace(9, PieceColor.Green)
    this.faces[FaceIndex.D] = new CubeFace(9, PieceColor.Yellow)
    this.faces[FaceIndex.R] = new CubeFace(9, PieceColor.Red)
    this.faces[FaceIndex.B] = new CubeFace(9, PieceColor.Blue)
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

  /**
   * Returns each face as a 3x3 grid of colors, in the same layout the Go
   * `Render` produced, ready for a component to draw the unfolded cube.
   */
  render(): Record<keyof typeof FaceIndex, PieceColor[][]> {
    const grid = (face: FaceIndex): PieceColor[][] => {
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
  renderSvg(): string {
    const sticker = 16
    const gap = 2
    const stroke = '#00000073'
    const background = 'transparent'
    const radius = 2

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
            `fill="${PieceColorHex[color]}" stroke="${stroke}" stroke-width="1"/>`,
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
  renderSvgDataUri(): string {
    const svg = this.renderSvg()
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  generateScramble(movesCount: number): string {
      return generateScramble(movesCount)
  }
}