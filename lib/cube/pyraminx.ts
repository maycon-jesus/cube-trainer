function randomFromArr<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * WCA Pyraminx scrambles have two parts: `movesCount` random turns of the 4
 * main faces (U, L, R, B — clockwise with no suffix, counterclockwise with
 * `'`; there is no `2` modifier since a 240° turn is just the opposite
 * direction), never repeating the same face twice in a row, followed by up
 * to one tip turn per vertex (lowercase u, l, r, b), each independently
 * left untouched, turned clockwise, or turned counterclockwise.
 */
export function generateScramblePyraminx(movesCount: number = 11): string {
  const faces = ['U', 'L', 'R', 'B']
  const modifiers = ['', "'"]
  const tips = ['u', 'l', 'r', 'b']

  const moves: string[] = []
  let lastFace = ''

  while (moves.length < movesCount) {
    const face = randomFromArr(faces)
    if (face === lastFace) {
      continue
    }

    const modifier = randomFromArr(modifiers)

    moves.push(face + modifier)
    lastFace = face
  }

  for (const tip of tips) {
    const roll = Math.floor(Math.random() * 3)
    if (roll === 0) {
      continue
    }

    moves.push(tip + (roll === 1 ? '' : "'"))
  }

  return moves.join(' ')
}
