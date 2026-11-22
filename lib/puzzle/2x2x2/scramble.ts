import { randomFromArr } from "../../utils/array"

export function generateScramble(movesCount: number = 11, variation: number = 2): string {
  movesCount = movesCount + Math.floor(Math.random() * (variation + 1))

  const moves: string[] = []

  const axisMoves: string[][] = [
    ['U', 'D'],
    ['F', 'B'],
    ['L', 'R'],
  ]
  const modifiers = ['', '2', "'"]

  let latestAxis: number = -1

  while (moves.length < movesCount) {
    const [axis, nAxis] = randomFromArr(axisMoves)

    if (latestAxis === nAxis) {
      continue
    }

    const [move] = randomFromArr(axis)
    const [modifier] = randomFromArr(modifiers)

    moves.push(move + modifier)
    latestAxis = nAxis
  }

  return moves.join(' ')
}

export function randomAUFScramble(scramble: string): string {
  const AUFs: (string | null)[] = ["U", "U'", "U2", null]
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