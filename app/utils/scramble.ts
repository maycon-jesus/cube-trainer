export function getScrambleLines(scramble: string): string[] {
  return scramble.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
}