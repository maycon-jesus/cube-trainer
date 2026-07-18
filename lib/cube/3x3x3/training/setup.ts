import { Cube333, invertScramble, randomAUFScramble } from ".."
import { solveCube333InWorker } from "../solveInWorker"

export async function newAlgorithmSetup(scramble: string): Promise<string> {
    const scrambleInvert = randomAUFScramble(invertScramble(scramble))
    const cube = new Cube333()
    cube.applyMoves(scrambleInvert.split(' '))
    return invertScramble(await solveCube333InWorker(cube))
}
