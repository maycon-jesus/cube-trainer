import type { Solve } from "~/stores/db/solves"

export function isDNF(solve: Solve): boolean {
  return solve.penalty === 'dnf'
}

export function isPlus2(solve: Solve): boolean {
  return solve.penalty === '+2'
}