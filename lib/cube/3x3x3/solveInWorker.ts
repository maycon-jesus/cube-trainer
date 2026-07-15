// Wrapper de main-thread para o solver Kociemba rodando em Web Worker.
//
// `solveCube333InWorker` recebe uma instância de `Cube333`, extrai suas faces
// (`number[][]`, mesma serialização usada por `solveCube333`) e delega o solve
// pesado ao worker, devolvendo a solução como `Promise<string>`. Um único worker
// é criado sob demanda e reutilizado entre chamadas.

import type { Cube333 } from './index'
import type { SolveOptions } from './kociemba'
import type { SolverWorkerRequest, SolverWorkerResponse } from './solver.worker'

interface PendingSolve {
  resolve: (solution: string) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
let nextId = 0
const pending = new Map<number, PendingSolve>()

function getWorker(): Worker {
  if (worker) return worker

  worker = new Worker(new URL('./solver.worker.ts', import.meta.url), { type: 'module' })

  worker.addEventListener('message', (event: MessageEvent<SolverWorkerResponse>) => {
    const data = event.data
    const entry = pending.get(data.id)
    if (!entry) return
    pending.delete(data.id)
    if (data.ok) entry.resolve(data.solution)
    else entry.reject(new Error(data.error))
  })

  worker.addEventListener('error', (event) => {
    const error = new Error(event.message || 'solver worker crashed')
    for (const entry of pending.values()) entry.reject(error)
    pending.clear()
    // Descarta o worker quebrado; o próximo solve recria.
    worker?.terminate()
    worker = null
  })

  return worker
}

/**
 * Resolve o cubo dado usando o solver Kociemba em um Web Worker.
 *
 * @param cube  instância de `Cube333` já embaralhada.
 * @param options  limites opcionais (`maxDepth`, `timeoutMs`).
 * @returns a solução como string de moves separados por espaço (ex.: `"R U R' U'"`).
 */
export function solveCube333InWorker(cube: Cube333, options?: SolveOptions): Promise<string> {
  const faces = cube.faces.map((face) => Array.from(face.pieces) as number[])
  const id = nextId++
  const request: SolverWorkerRequest = { id, faces, options }

  return new Promise<string>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    getWorker().postMessage(request)
  })
}

/** Encerra o worker e rejeita quaisquer solves pendentes. Útil em teardown. */
export function terminateSolverWorker(): void {
  if (!worker) return
  const error = new Error('solver worker terminated')
  for (const entry of pending.values()) entry.reject(error)
  pending.clear()
  worker.terminate()
  worker = null
}
