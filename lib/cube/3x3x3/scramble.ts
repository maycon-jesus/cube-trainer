import { randomFromArr } from "../../utils/array"

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