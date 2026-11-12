// Web Worker que roda o solver Kociemba (`solveCube`) fora da thread principal.
//
// Uma instância de `Cube333` não pode cruzar a fronteira do worker (o
// structured clone do `postMessage` descarta os métodos da classe), então o
// worker recebe apenas as seis faces já serializadas — `number[][]` na ordem de
// `FaceIndex` ([L, U, F, D, R, B]), exatamente o formato que `solveCube` espera.
// A conversão a partir da instância acontece no wrapper (`solveCube333InWorker`).

import { initSolver, solveCube, type SolveOptions } from './kociemba'

export interface SolverWorkerRequest {
  /** Identifica a requisição para casar com a resposta. */
  id: number
  /** As seis faces em ordem de `FaceIndex`, cada uma com nove cores (row-major). */
  faces: number[][]
  options?: SolveOptions
}

export type SolverWorkerResponse =
  | { id: number; ok: true; solution: string }
  | { id: number; ok: false; error: string }

const ctx = self as unknown as DedicatedWorkerGlobalScope

// Pré-constrói as tabelas assim que o worker sobe, para que o primeiro solve
// não pague o custo de inicialização.
initSolver()

ctx.addEventListener('message', (event: MessageEvent<SolverWorkerRequest>) => {
  const { id, faces, options } = event.data
  try {
    const solution = solveCube(faces, options)
    ctx.postMessage({ id, ok: true, solution } satisfies SolverWorkerResponse)
  } catch (err) {
    ctx.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    } satisfies SolverWorkerResponse)
  }
})
