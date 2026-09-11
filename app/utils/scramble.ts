export function getScrambleLines(scramble: string): string[] {
  return scramble.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
}

export function countMoves(scramble: string): number {
  return scramble.trim().split(/\s+/).filter(Boolean).length
}