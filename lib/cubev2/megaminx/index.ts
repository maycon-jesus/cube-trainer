export function generateScramble(movesCount: number = 10): string {
    const lines = 7
    const moves: string[] = []

    const axisMoves: string[][] = [
        ['R++', 'R--'],
        ['D++', 'D--'],
    ]

    const lastMoves: string[] = ['U', 'U\'']

    for (let line = 0; line < lines; line++) {
        for (let moveIndex = 0; moveIndex < movesCount; moveIndex++) {
            const axis = Math.floor(Math.random() * axisMoves.length)
            const move = axisMoves[axis]![Math.floor(Math.random() * axisMoves[axis]!.length)]
            moves.push(move!)
        }
        moves.push(lastMoves[Math.floor(Math.random() * lastMoves.length)]!)
        moves.push('\n')
    }

    return moves.join(' ')
}