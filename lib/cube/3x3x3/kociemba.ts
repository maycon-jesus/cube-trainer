// Kociemba two-phase 3x3x3 solver.
//
// Public entry point: `solveCube(faces)` receives the cube as six faces of nine
// numbers each (`number[][]`), where each number identifies a color. The faces
// must be given in the project's `FaceIndex` order — `[L, U, F, D, R, B]` — and
// each face's nine stickers in render (row-major) order, exactly like
// `Cube333.faces[f].pieces`. The color values themselves are arbitrary: the
// solver reads the center of each face to learn the color scheme.
//
// The heavy lifting is a standard Kociemba search over the cubie group:
//   Phase 1 reduces the cube to the subgroup G1 = <U, D, R2, L2, F2, B2>
//           (all corner/edge orientations solved, UD-slice edges in the slice).
//   Phase 2 solves the cube while staying inside G1.
//
// Rather than hard-coding Kociemba's facelet tables, the six basic move
// permutations are derived at init time from the project's own `Cube333`
// engine, so the solver always agrees with the engine's move semantics.

import { Cube333, FaceIndex } from './index'

// ---------------------------------------------------------------------------
// Cubie model
// ---------------------------------------------------------------------------
//
// Corners are enumerated URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB (index ===
// solved position); the order is fixed by CORNER_RAW below. Edges are UR, UF,
// UL, UB, DR, DF, DL, DB, FR, FL, BL, BR — indices 8..11 (FR, FL, BL, BR) are
// the UD-slice edges.

interface CubieCube {
  cp: Int8Array // corner permutation: cp[slot] = cubie currently there
  co: Int8Array // corner orientation (0..2)
  ep: Int8Array // edge permutation: ep[slot] = cubie currently there
  eo: Int8Array // edge orientation (0..1)
}

function solvedCube(): CubieCube {
  const cp = Int8Array.from([0, 1, 2, 3, 4, 5, 6, 7])
  const co = new Int8Array(8)
  const ep = Int8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  const eo = new Int8Array(12)
  return { cp, co, ep, eo }
}

/** result = state after applying move `b` to state `a` (Kociemba composition). */
function multiply(a: CubieCube, b: CubieCube): CubieCube {
  const cp = new Int8Array(8)
  const co = new Int8Array(8)
  const ep = new Int8Array(12)
  const eo = new Int8Array(12)
  for (let c = 0; c < 8; c++) {
    cp[c] = a.cp[b.cp[c]!]!
    co[c] = (a.co[b.cp[c]!]! + b.co[c]!) % 3
  }
  for (let e = 0; e < 12; e++) {
    ep[e] = a.ep[b.ep[e]!]!
    eo[e] = (a.eo[b.ep[e]!]! + b.eo[e]!) % 2
  }
  return { cp, co, ep, eo }
}

// ---------------------------------------------------------------------------
// Facelet geometry: which (face, stickerIndex) form each corner / edge, in the
// project's net orientation (U above F, L F R B in a row, D below F).
// ---------------------------------------------------------------------------

const L = FaceIndex.L, U = FaceIndex.U, F = FaceIndex.F, D = FaceIndex.D, R = FaceIndex.R, B = FaceIndex.B

type Facelet = [FaceIndex, number] // [face, stickerIndex 0..8]

// Raw corner facelets (order within each corner is normalized below).
const CORNER_RAW: Facelet[][] = [
  [[U, 8], [R, 0], [F, 2]], // URF
  [[U, 6], [F, 0], [L, 2]], // UFL
  [[U, 0], [L, 0], [B, 2]], // ULB
  [[U, 2], [B, 0], [R, 2]], // UBR
  [[D, 2], [F, 8], [R, 6]], // DFR
  [[D, 0], [L, 8], [F, 6]], // DLF
  [[D, 6], [B, 8], [L, 6]], // DBL
  [[D, 8], [R, 8], [B, 6]], // DRB
]

// Raw edge facelets. Indices 8..11 are the UD-slice edges (FR, FL, BL, BR).
const EDGE_RAW: Facelet[][] = [
  [[U, 5], [R, 1]], // UR
  [[U, 7], [F, 1]], // UF
  [[U, 3], [L, 1]], // UL
  [[U, 1], [B, 1]], // UB
  [[D, 5], [R, 7]], // DR
  [[D, 1], [F, 7]], // DF
  [[D, 3], [L, 7]], // DL
  [[D, 7], [B, 7]], // DB
  [[F, 5], [R, 3]], // FR
  [[F, 3], [L, 5]], // FL
  [[B, 5], [L, 3]], // BL
  [[B, 3], [R, 5]], // BR
]

// Axis vectors per face, used to give every corner a consistent (clockwise)
// facelet order so that corner-orientation composes additively mod 3.
const AXIS: Record<FaceIndex, [number, number, number]> = {
  [U]: [0, 1, 0],
  [D]: [0, -1, 0],
  [R]: [1, 0, 0],
  [L]: [-1, 0, 0],
  [F]: [0, 0, 1],
  [B]: [0, 0, -1],
}

function det3(a: number[], b: number[], c: number[]): number {
  return (
    a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!)
    - a[1]! * (b[0]! * c[2]! - b[2]! * c[0]!)
    + a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)
  )
}

const isUD = (f: FaceIndex) => f === U || f === D
const isFB = (f: FaceIndex) => f === F || f === B

// Corner facelets ordered [U/D facelet, then the two sides clockwise].
const CORNER_FACELETS: Facelet[][] = CORNER_RAW.map((fl) => {
  const udIdx = fl.findIndex(([f]) => isUD(f))
  const first = fl[udIdx]!
  const others = fl.filter((_, i) => i !== udIdx)
  if (det3(AXIS[first[0]], AXIS[others[0]![0]], AXIS[others[1]![0]]) > 0) others.reverse()
  return [first, others[0]!, others[1]!]
})

// Edge facelets ordered [primary facelet, other]. Primary = U/D facelet for
// layer edges, F/B facelet for slice edges (Kociemba's edge-orientation ref).
const EDGE_FACELETS: Facelet[][] = EDGE_RAW.map((fl) => {
  const hasUD = fl.some(([f]) => isUD(f))
  const primIdx = hasUD
    ? fl.findIndex(([f]) => isUD(f))
    : fl.findIndex(([f]) => isFB(f))
  const first = fl[primIdx]!
  const other = fl[primIdx === 0 ? 1 : 0]!
  return [first, other]
})

// Solved face-sets used to identify a cubie from the faces it touches.
const cornerKey = (faces: FaceIndex[]) => [...faces].sort((a, b) => a - b).join(',')
const CORNER_LOOKUP = new Map<string, number>()
CORNER_FACELETS.forEach((fl, j) => CORNER_LOOKUP.set(cornerKey(fl.map(([f]) => f)), j))
const EDGE_LOOKUP = new Map<string, number>()
EDGE_FACELETS.forEach((fl, j) => EDGE_LOOKUP.set(cornerKey(fl.map(([f]) => f)), j))

// ---------------------------------------------------------------------------
// Reading a cube state from raw faces
// ---------------------------------------------------------------------------

export class InvalidCubeError extends Error {}

/** Convert six faces (`[L,U,F,D,R,B]`, 9 stickers each) into a CubieCube. */
export function readFromFaces(faces: number[][]): CubieCube {
  if (faces.length !== 6) throw new InvalidCubeError('expected 6 faces')
  for (const f of faces) {
    if (f.length !== 9) throw new InvalidCubeError('each face must have 9 stickers')
  }

  // Learn the color scheme from the centers.
  const colorToFace = new Map<number, FaceIndex>()
  for (let f = 0; f < 6; f++) colorToFace.set(faces[f]![4]!, f as FaceIndex)
  if (colorToFace.size !== 6) throw new InvalidCubeError('the six centers must have distinct colors')

  const faceOf = (fc: Facelet): FaceIndex => {
    const color = faces[fc[0]]![fc[1]]!
    const face = colorToFace.get(color)
    if (face === undefined) throw new InvalidCubeError(`unknown sticker color ${color}`)
    return face
  }

  const cube = solvedCube()

  for (let slot = 0; slot < 8; slot++) {
    const facelets = CORNER_FACELETS[slot]!
    const facesHere = facelets.map(faceOf)
    const cubie = CORNER_LOOKUP.get(cornerKey(facesHere))
    if (cubie === undefined) throw new InvalidCubeError(`invalid corner at slot ${slot}`)
    const ori = facesHere.findIndex((f) => isUD(f))
    if (ori < 0) throw new InvalidCubeError(`corner at slot ${slot} has no U/D facelet`)
    cube.cp[slot] = cubie
    cube.co[slot] = ori
  }

  for (let slot = 0; slot < 12; slot++) {
    const facelets = EDGE_FACELETS[slot]!
    const facesHere = facelets.map(faceOf)
    const cubie = EDGE_LOOKUP.get(cornerKey(facesHere))
    if (cubie === undefined) throw new InvalidCubeError(`invalid edge at slot ${slot}`)
    const sliceEdge = !facesHere.some(isUD)
    const ori = facesHere.findIndex((f) => (sliceEdge ? isFB(f) : isUD(f)))
    if (ori < 0) throw new InvalidCubeError(`edge at slot ${slot} has no reference facelet`)
    cube.ep[slot] = cubie
    cube.eo[slot] = ori
  }

  validate(cube)
  return cube
}

function validate(c: CubieCube): void {
  const seenC = new Set(c.cp)
  if (seenC.size !== 8) throw new InvalidCubeError('corner permutation is not a bijection')
  const seenE = new Set(c.ep)
  if (seenE.size !== 12) throw new InvalidCubeError('edge permutation is not a bijection')

  let coSum = 0
  for (const o of c.co) coSum += o
  if (coSum % 3 !== 0) throw new InvalidCubeError('corner orientation parity is invalid')

  let eoSum = 0
  for (const o of c.eo) eoSum += o
  if (eoSum % 2 !== 0) throw new InvalidCubeError('edge orientation parity is invalid')

  if (permParity(Array.from(c.cp)) !== permParity(Array.from(c.ep))) {
    throw new InvalidCubeError('permutation parity of corners and edges differ')
  }
}

function permParity(p: number[]): number {
  let parity = 0
  for (let i = 0; i < p.length; i++) {
    for (let j = i + 1; j < p.length; j++) if (p[i]! > p[j]!) parity ^= 1
  }
  return parity
}

// ---------------------------------------------------------------------------
// Permutation / combination indexing helpers
// ---------------------------------------------------------------------------

function permToIndex(arr: ArrayLike<number>): number {
  const n = arr.length
  let idx = 0
  for (let i = 0; i < n; i++) {
    let cnt = 0
    for (let j = i + 1; j < n; j++) if (arr[j]! < arr[i]!) cnt++
    idx = idx * (n - i) + cnt
  }
  return idx
}

function indexToPerm(idx: number, n: number): number[] {
  const code = new Array<number>(n)
  for (let i = n - 1; i >= 0; i--) {
    const radix = n - i
    code[i] = idx % radix
    idx = Math.floor(idx / radix)
  }
  const elems: number[] = []
  for (let i = 0; i < n; i++) elems.push(i)
  const perm = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    perm[i] = elems[code[i]!]!
    elems.splice(code[i]!, 1)
  }
  return perm
}

// Enumerate the C(12,4) = 495 UD-slice location combinations.
const SLICE_LIST: number[][] = []
const SLICE_INDEX = new Map<number, number>()
for (let a = 0; a < 12; a++) {
  for (let b = a + 1; b < 12; b++) {
    for (let c = b + 1; c < 12; c++) {
      for (let d = c + 1; d < 12; d++) {
        const mask = (1 << a) | (1 << b) | (1 << c) | (1 << d)
        SLICE_INDEX.set(mask, SLICE_LIST.length)
        SLICE_LIST.push([a, b, c, d])
      }
    }
  }
}
const N_SLICE = SLICE_LIST.length // 495

// ---------------------------------------------------------------------------
// Coordinates
// ---------------------------------------------------------------------------

const N_TWIST = 2187 // 3^7
const N_FLIP = 2048 // 2^11
const N_CORNPERM = 40320 // 8!
const N_UDEDGE = 40320 // 8!
const N_SLICEEDGE = 24 // 4!

function getTwist(c: CubieCube): number {
  let r = 0
  for (let i = 0; i < 7; i++) r = r * 3 + c.co[i]!
  return r
}
function getFlip(c: CubieCube): number {
  let r = 0
  for (let i = 0; i < 11; i++) r = r * 2 + c.eo[i]!
  return r
}
function getSlice(c: CubieCube): number {
  let mask = 0
  for (let p = 0; p < 12; p++) if (c.ep[p]! >= 8) mask |= 1 << p
  return SLICE_INDEX.get(mask)!
}
function getCornPerm(c: CubieCube): number {
  return permToIndex(c.cp)
}
function getUDEdge(c: CubieCube): number {
  return permToIndex(c.ep.subarray(0, 8))
}
function getSliceEdge(c: CubieCube): number {
  const s = [c.ep[8]! - 8, c.ep[9]! - 8, c.ep[10]! - 8, c.ep[11]! - 8]
  return permToIndex(s)
}

const GOAL_SLICE = getSlice(solvedCube())

// ---------------------------------------------------------------------------
// Moves
// ---------------------------------------------------------------------------

// Search move order: U R F D L B, three powers each (quarter, double, prime).
const FACE_LETTERS = ['U', 'R', 'F', 'D', 'L', 'B'] as const
const N_MOVES = 18
// Phase-2 keeps R/L/F/B to double turns only.
const PHASE2_MOVES = [0, 1, 2, 9, 10, 11, 4, 7, 13, 16] // indices into the 18 moves
const N_P2MOVES = PHASE2_MOVES.length

function moveName(m: number): string {
  const face = (m / 3) | 0
  const power = m % 3
  return FACE_LETTERS[face]! + ['', '2', "'"][power]
}
const moveFace = (m: number): number => (m / 3) | 0

// Derive the six basic (quarter-turn) move cubes from the engine, then expand
// to all 18 by composition.
function buildMoveCubes(): CubieCube[] {
  const basic: CubieCube[] = FACE_LETTERS.map((letter) => {
    const cube = new Cube333()
    cube.applyMove(letter)
    const faces = cube.faces.map((f) => Array.from(f.pieces) as number[])
    return readFromFaces(faces)
  })
  const moves: CubieCube[] = new Array(N_MOVES)
  for (let face = 0; face < 6; face++) {
    let acc = solvedCube()
    for (let power = 0; power < 3; power++) {
      acc = multiply(acc, basic[face]!)
      moves[face * 3 + power] = acc
    }
  }
  return moves
}

// ---------------------------------------------------------------------------
// Lazily-built move and pruning tables
// ---------------------------------------------------------------------------

interface Tables {
  moveCubes: CubieCube[]
  // phase 1
  twistMove: Int16Array // [N_TWIST][18]
  flipMove: Int16Array // [N_FLIP][18]
  sliceMove: Int16Array // [N_SLICE][18]
  pruneTwistSlice: Int8Array // [N_TWIST * N_SLICE]
  pruneFlipSlice: Int8Array // [N_FLIP * N_SLICE]
  // phase 2
  cornMove: Int32Array // [N_CORNPERM][10]
  udMove: Int32Array // [N_UDEDGE][10]
  sliceEdgeMove: Int8Array // [N_SLICEEDGE][10]
  pruneCornSlice: Int8Array // [N_CORNPERM * 24]
  pruneUDSlice: Int8Array // [N_UDEDGE * 24]
}

let tables: Tables | null = null

function buildTables(): Tables {
  const moveCubes = buildMoveCubes()

  // --- Phase 1 move tables -------------------------------------------------
  const twistMove = new Int16Array(N_TWIST * N_MOVES)
  for (let t = 0; t < N_TWIST; t++) {
    const co = new Int8Array(8)
    let x = t, parity = 0
    for (let i = 6; i >= 0; i--) { const o = x % 3; x = (x - o) / 3; co[i] = o; parity += o }
    co[7] = (3 - (parity % 3)) % 3
    for (let m = 0; m < N_MOVES; m++) {
      const mc = moveCubes[m]!
      let r = 0
      for (let c = 0; c < 7; c++) r = r * 3 + ((co[mc.cp[c]!]! + mc.co[c]!) % 3)
      twistMove[t * N_MOVES + m] = r
    }
  }

  const flipMove = new Int16Array(N_FLIP * N_MOVES)
  for (let f = 0; f < N_FLIP; f++) {
    const eo = new Int8Array(12)
    let x = f, parity = 0
    for (let i = 10; i >= 0; i--) { const o = x % 2; x = (x - o) / 2; eo[i] = o; parity += o }
    eo[11] = parity % 2
    for (let m = 0; m < N_MOVES; m++) {
      const mc = moveCubes[m]!
      let r = 0
      for (let e = 0; e < 11; e++) r = r * 2 + ((eo[mc.ep[e]!]! + mc.eo[e]!) % 2)
      flipMove[f * N_MOVES + m] = r
    }
  }

  const sliceMove = new Int16Array(N_SLICE * N_MOVES)
  for (let s = 0; s < N_SLICE; s++) {
    const ep = new Int8Array(12)
    const pos = SLICE_LIST[s]!
    let sv = 8, ov = 0
    for (let p = 0; p < 12; p++) ep[p] = pos.includes(p) ? sv++ : ov++
    for (let m = 0; m < N_MOVES; m++) {
      const mc = moveCubes[m]!
      let mask = 0
      for (let p = 0; p < 12; p++) if (ep[mc.ep[p]!]! >= 8) mask |= 1 << p
      sliceMove[s * N_MOVES + m] = SLICE_INDEX.get(mask)!
    }
  }

  // --- Phase 2 move tables -------------------------------------------------
  const cornMove = new Int32Array(N_CORNPERM * N_P2MOVES)
  for (let c = 0; c < N_CORNPERM; c++) {
    const cp = indexToPerm(c, 8)
    for (let mi = 0; mi < N_P2MOVES; mi++) {
      const mc = moveCubes[PHASE2_MOVES[mi]!]!
      const np = new Array<number>(8)
      for (let i = 0; i < 8; i++) np[i] = cp[mc.cp[i]!]!
      cornMove[c * N_P2MOVES + mi] = permToIndex(np)
    }
  }

  const udMove = new Int32Array(N_UDEDGE * N_P2MOVES)
  for (let u = 0; u < N_UDEDGE; u++) {
    const perm = indexToPerm(u, 8)
    const ep = [...perm, 8, 9, 10, 11]
    for (let mi = 0; mi < N_P2MOVES; mi++) {
      const mc = moveCubes[PHASE2_MOVES[mi]!]!
      const np = new Array<number>(8)
      for (let i = 0; i < 8; i++) np[i] = ep[mc.ep[i]!]!
      udMove[u * N_P2MOVES + mi] = permToIndex(np)
    }
  }

  const sliceEdgeMove = new Int8Array(N_SLICEEDGE * N_P2MOVES)
  for (let s = 0; s < N_SLICEEDGE; s++) {
    const perm = indexToPerm(s, 4)
    const ep = [0, 1, 2, 3, 4, 5, 6, 7, perm[0]! + 8, perm[1]! + 8, perm[2]! + 8, perm[3]! + 8]
    for (let mi = 0; mi < N_P2MOVES; mi++) {
      const mc = moveCubes[PHASE2_MOVES[mi]!]!
      const np = new Array<number>(4)
      for (let i = 0; i < 4; i++) np[i] = ep[mc.ep[8 + i]!]! - 8
      sliceEdgeMove[s * N_P2MOVES + mi] = permToIndex(np)
    }
  }

  // --- Pruning tables (BFS from the solved coordinate) ---------------------
  const pruneTwistSlice = bfsPrune(N_TWIST * N_SLICE, 0 * N_SLICE + GOAL_SLICE, N_MOVES,
    (idx, m) => {
      const t = (idx / N_SLICE) | 0, s = idx % N_SLICE
      return twistMove[t * N_MOVES + m]! * N_SLICE + sliceMove[s * N_MOVES + m]!
    })

  const pruneFlipSlice = bfsPrune(N_FLIP * N_SLICE, 0 * N_SLICE + GOAL_SLICE, N_MOVES,
    (idx, m) => {
      const f = (idx / N_SLICE) | 0, s = idx % N_SLICE
      return flipMove[f * N_MOVES + m]! * N_SLICE + sliceMove[s * N_MOVES + m]!
    })

  const pruneCornSlice = bfsPrune(N_CORNPERM * N_SLICEEDGE, 0, N_P2MOVES,
    (idx, mi) => {
      const c = (idx / N_SLICEEDGE) | 0, s = idx % N_SLICEEDGE
      return cornMove[c * N_P2MOVES + mi]! * N_SLICEEDGE + sliceEdgeMove[s * N_P2MOVES + mi]!
    })

  const pruneUDSlice = bfsPrune(N_UDEDGE * N_SLICEEDGE, 0, N_P2MOVES,
    (idx, mi) => {
      const u = (idx / N_SLICEEDGE) | 0, s = idx % N_SLICEEDGE
      return udMove[u * N_P2MOVES + mi]! * N_SLICEEDGE + sliceEdgeMove[s * N_P2MOVES + mi]!
    })

  return {
    moveCubes, twistMove, flipMove, sliceMove, pruneTwistSlice, pruneFlipSlice,
    cornMove, udMove, sliceEdgeMove, pruneCornSlice, pruneUDSlice,
  }
}

function bfsPrune(size: number, start: number, nMoves: number, next: (idx: number, m: number) => number): Int8Array {
  const table = new Int8Array(size).fill(-1)
  table[start] = 0
  let frontier = [start]
  let depth = 0
  while (frontier.length > 0) {
    const nextFrontier: number[] = []
    for (const idx of frontier) {
      for (let m = 0; m < nMoves; m++) {
        const ni = next(idx, m)
        if (table[ni] === -1) {
          table[ni] = depth + 1
          nextFrontier.push(ni)
        }
      }
    }
    frontier = nextFrontier
    depth++
  }
  return table
}

/** Pre-build all tables. Called automatically on first solve; safe to call early. */
export function initSolver(): void {
  if (!tables) tables = buildTables()
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

// Forbid consecutive moves on the same face, and fix a canonical order for
// opposite-face pairs to avoid searching both orderings.
function skipMove(prevFace: number, face: number): boolean {
  if (prevFace < 0) return false
  if (prevFace === face) return true
  if (prevFace % 3 === face % 3 && prevFace > face) return true
  return false
}

export interface SolveOptions {
  /** Maximum total solution length. Default 26. */
  maxDepth?: number
  /** Wall-clock budget in milliseconds. Default 4000. */
  timeoutMs?: number
}

/** Solve a cube given as a CubieCube. Returns a space-separated move string. */
function solveCubie(cc: CubieCube): string {
  const T = tables!
  const maxDepth = 26
  const deadline = Date.now() + 4000

  const startTwist = getTwist(cc)
  const startFlip = getFlip(cc)
  const startSlice = getSlice(cc)

  let best: number[] | null = null
  const phase1Path: number[] = []

  const tryPhase2 = (): void => {
    let cube = cc
    for (const m of phase1Path) cube = multiply(cube, T.moveCubes[m]!)

    const corn = getCornPerm(cube)
    const ud = getUDEdge(cube)
    const se = getSliceEdge(cube)
    if (corn === 0 && ud === 0 && se === 0) {
      best = phase1Path.slice()
      return
    }

    const cap = Math.min((best ? best.length - 1 : maxDepth) - phase1Path.length, 18)
    const path: number[] = []

    const search2 = (c: number, u: number, s: number, depth: number, prevFace: number): boolean => {
      if (depth === 0) return c === 0 && u === 0 && s === 0
      const h = Math.max(T.pruneCornSlice[c * N_SLICEEDGE + s]!, T.pruneUDSlice[u * N_SLICEEDGE + s]!)
      if (h > depth) return false
      for (let mi = 0; mi < N_P2MOVES; mi++) {
        const m = PHASE2_MOVES[mi]!
        const face = moveFace(m)
        if (skipMove(prevFace, face)) continue
        path.push(m)
        if (search2(
          T.cornMove[c * N_P2MOVES + mi]!,
          T.udMove[u * N_P2MOVES + mi]!,
          T.sliceEdgeMove[s * N_P2MOVES + mi]!,
          depth - 1, face)) return true
        path.pop()
      }
      return false
    }

    const prevFace = phase1Path.length ? moveFace(phase1Path[phase1Path.length - 1]!) : -1
    for (let d = Math.max(T.pruneCornSlice[corn * N_SLICEEDGE + se]!, T.pruneUDSlice[ud * N_SLICEEDGE + se]!); d <= cap; d++) {
      if (search2(corn, ud, se, d, prevFace)) {
        best = phase1Path.concat(path)
        return
      }
    }
  }

  const search1 = (t: number, f: number, s: number, depth: number, prevFace: number): void => {
    if (best) return
    if (depth === 0) {
      if (t === 0 && f === 0 && s === GOAL_SLICE) tryPhase2()
      return
    }
    const h = Math.max(T.pruneTwistSlice[t * N_SLICE + s]!, T.pruneFlipSlice[f * N_SLICE + s]!)
    if (h > depth) return
    for (let m = 0; m < N_MOVES; m++) {
      const face = moveFace(m)
      if (skipMove(prevFace, face)) continue
      phase1Path.push(m)
      search1(T.twistMove[t * N_MOVES + m]!, T.flipMove[f * N_MOVES + m]!, T.sliceMove[s * N_MOVES + m]!, depth - 1, face)
      phase1Path.pop()
      if (best) return
    }
  }

  const startH = Math.max(
    T.pruneTwistSlice[startTwist * N_SLICE + startSlice]!,
    T.pruneFlipSlice[startFlip * N_SLICE + startSlice]!,
  )
  for (let d = startH; d <= maxDepth; d++) {
    search1(startTwist, startFlip, startSlice, d, -1)
    if (best) break
    if (Date.now() > deadline) break
  }

  if (!best) throw new Error('no solution found within the search budget')
  return (best as number[]).map(moveName).join(' ')
}

/**
 * Solve a scrambled 3x3x3 given as six faces of nine color numbers each.
 *
 * `faces` must be in `FaceIndex` order — `[L, U, F, D, R, B]` — with each face's
 * nine stickers in render (row-major) order. Returns the solution as a
 * space-separated move string (e.g. `"R U R' U'"`). Throws `InvalidCubeError`
 * if the faces don't describe a solvable cube.
 */
export function solveCube(faces: number[][], _options?: SolveOptions): string {
  initSolver()
  return solveCubie(readFromFaces(faces))
}

/** Convenience overload for the project's own engine. */
export function solveCube333(cube: Cube333): string {
  const faces = cube.faces.map((f) => Array.from(f.pieces) as number[])
  return solveCube(faces)
}
