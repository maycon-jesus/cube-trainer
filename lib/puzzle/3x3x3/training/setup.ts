import { invertScramble, randomAUFScramble } from "../scramble"
import { Engine } from "../engine"
import { solveCube333InWorker } from "../solveInWorker"

export async function newAlgorithmSetup(scramble: string): Promise<string> {
    const scrambleInvert = randomAUFScramble(invertScramble(scramble))
    const cube = new Engine()
    cube.applyMoves(scrambleInvert.split(' '))
    return invertScramble(await solveCube333InWorker(cube))
}
