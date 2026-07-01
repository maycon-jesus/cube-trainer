// Time formatting and speedcubing statistics helpers.

import type { Solve } from '../stores/db/solves'

/** Effective time of a solve in ms, applying its penalty. DNF -> Infinity. */
export function effectiveMs(solve: Solve): number {
  if (solve.penalty === 'dnf') return Infinity
  if (solve.penalty === '+2') return solve.ms + 2000
  return solve.ms
}

/** Formats milliseconds as cstimer does: `s.cc` or `m:ss.cc`. */
export function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !isFinite(ms)) return ms === Infinity ? 'DNF' : '—'
  const totalCs = Math.round(ms / 10)
  const cs = totalCs % 100
  const totalS = Math.floor(totalCs / 100)
  const s = totalS % 60
  const m = Math.floor(totalS / 60)
  const cc = cs.toString().padStart(2, '0')
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}.${cc}`
  return `${s}.${cc}`
}

/** Display string for a single solve, including its penalty. */
export function formatSolve(solve: Solve): string {
  if (solve.penalty === 'dnf') return 'DNF'
  const base = formatMs(effectiveMs(solve))
  return solve.penalty === '+2' ? `${base}+` : base
}

/**
 * WCA average of `n`: drop the best and worst, mean the rest. Needs at least
 * `n` solves. More than one DNF among the trimmed set makes it a DNF.
 * Returns a number (ms), Infinity for DNF, or null when not enough solves.
 */
export function averageOf(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null
  const window = solves.slice(0, n).map(effectiveMs)
  const sorted = [...window].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1)
  if (trimmed.some((v) => !isFinite(v))) return Infinity
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length
}

/** Arithmetic mean over all solves (DNFs make it Infinity). */
export function meanOf(solves: Solve[]): number | null {
  if (solves.length === 0) return null
  const vals = solves.map(effectiveMs)
  if (vals.some((v) => !isFinite(v))) return Infinity
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

/** Best (lowest) effective time, ignoring DNFs. */
export function bestOf(solves: Solve[]): number | null {
  const finite = solves.map(effectiveMs).filter(isFinite)
  return finite.length ? Math.min(...finite) : null
}
