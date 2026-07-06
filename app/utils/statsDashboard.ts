// Aggregations for the statistics dashboard (app/pages/stats.vue).
// Pure functions over Solve[]; time formatting/WCA helpers live in ./stats.

import type { Solve } from '../stores/db/solves'
import { effectiveMs, averageOf, bestOf } from './stats'

const DAY_MS = 24 * 60 * 60 * 1000

/** Local midnight timestamp for a given epoch ms. */
export function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Number of whole days between two local midnights. */
function daysBetween(a: number, b: number): number {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS)
}

/** Solves sorted oldest -> newest (a copy; input is left untouched). */
export function chronological(solves: Solve[]): Solve[] {
  return [...solves].sort((a, b) => a.createdAt - b.createdAt)
}

/** Effective times that are real (not DNF), paired with their timestamp. */
export function finitePoints(solves: Solve[]): { createdAt: number, ms: number }[] {
  return chronological(solves)
    .map((s) => ({ createdAt: s.createdAt, ms: effectiveMs(s) }))
    .filter((p) => isFinite(p.ms))
}

// --- Headline KPIs ---------------------------------------------------------

/** Distinct calendar days that have at least one solve. */
export function daysPracticed(solves: Solve[]): number {
  const days = new Set(solves.map((s) => startOfDay(s.createdAt)))
  return days.size
}

/**
 * Consecutive-day practice streak ending on the most recent practice day.
 * (The count of back-to-back days with at least one solve.)
 */
export function practiceDayStreak(solves: Solve[]): number {
  if (solves.length === 0) return 0
  const days = [...new Set(solves.map((s) => startOfDay(s.createdAt)))].sort((a, b) => b - a)
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    if (daysBetween(days[i]!, days[i - 1]!) === 1) streak++
    else break
  }
  return streak
}

// --- Best averages (current window + best rolling) -------------------------

export type AverageStat = {
  n: number
  current: number | null
  best: number | null
}

/** Best (lowest) rolling AoN across every consecutive window of `n` solves. */
export function bestRollingAverage(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null
  const asc = chronological(solves)
  let best: number | null = null
  for (let i = 0; i + n <= asc.length; i++) {
    const avg = averageOf(asc.slice(i, i + n), n)
    if (avg === null || !isFinite(avg)) continue
    if (best === null || avg < best) best = avg
  }
  return best
}

/** Current AoN (most recent `n` solves) plus the best rolling AoN. */
export function averageStat(solves: Solve[], n: number): AverageStat {
  const asc = chronological(solves)
  const current = asc.length >= n ? averageOf(asc.slice(asc.length - n), n) : null
  return { n, current, best: bestRollingAverage(solves, n) }
}

// --- Sub-X streaks ---------------------------------------------------------

export type SubStreak = {
  current: number
  best: number
  /** Distinct days touched by the current streak. */
  days: number
}

/**
 * Runs of consecutive solves whose effective time is under `thresholdMs`.
 * `current` counts back from the newest solve; `best` is the longest run.
 */
export function subStreak(solves: Solve[], thresholdMs: number): SubStreak {
  const asc = chronological(solves)
  const hit = asc.map((s) => isFinite(effectiveMs(s)) && effectiveMs(s) < thresholdMs)

  let best = 0
  let run = 0
  for (const ok of hit) {
    run = ok ? run + 1 : 0
    if (run > best) best = run
  }

  let current = 0
  const currentDays = new Set<number>()
  for (let i = asc.length - 1; i >= 0; i--) {
    if (!hit[i]) break
    current++
    currentDays.add(startOfDay(asc[i]!.createdAt))
  }

  return { current, best, days: currentDays.size }
}

// --- Time of day -----------------------------------------------------------

export type HourAverage = { hour: number, avg: number | null, count: number }

export type DayPeriod = {
  key: 'night' | 'morning' | 'afternoon' | 'evening'
  avg: number | null
  count: number
}

export type TimeOfDay = {
  hours: HourAverage[]
  periods: DayPeriod[]
  best: DayPeriod | null
  worst: DayPeriod | null
  /** How much faster the best period is vs the worst, as a fraction (0..1). */
  boost: number | null
}

function periodOfHour(hour: number): DayPeriod['key'] {
  if (hour < 6) return 'night'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export function timeOfDay(solves: Solve[]): TimeOfDay {
  const hourSum = new Array(24).fill(0)
  const hourCount = new Array(24).fill(0)
  const periodKeys: DayPeriod['key'][] = ['night', 'morning', 'afternoon', 'evening']
  const periodSum: Record<string, number> = { night: 0, morning: 0, afternoon: 0, evening: 0 }
  const periodCount: Record<string, number> = { night: 0, morning: 0, afternoon: 0, evening: 0 }

  for (const s of solves) {
    const ms = effectiveMs(s)
    if (!isFinite(ms)) continue
    const hour = new Date(s.createdAt).getHours()
    hourSum[hour] += ms
    hourCount[hour]++
    const p = periodOfHour(hour)
    periodSum[p] += ms
    periodCount[p]++
  }

  const hours: HourAverage[] = hourSum.map((sum, hour) => ({
    hour,
    count: hourCount[hour],
    avg: hourCount[hour] ? sum / hourCount[hour] : null,
  }))

  const periods: DayPeriod[] = periodKeys.map((key) => ({
    key,
    count: periodCount[key],
    avg: periodCount[key] ? periodSum[key]! / periodCount[key]! : null,
  }))

  const withData = periods.filter((p) => p.avg !== null) as (DayPeriod & { avg: number })[]
  let best: DayPeriod | null = null
  let worst: DayPeriod | null = null
  let boost: number | null = null
  if (withData.length) {
    best = withData.reduce((a, b) => (b.avg < a.avg ? b : a))
    worst = withData.reduce((a, b) => (b.avg > a.avg ? b : a))
    if (best.avg && worst.avg && worst.avg > 0 && best !== worst) {
      boost = (worst.avg! - best.avg!) / worst.avg!
    }
  }

  return { hours, periods, best, worst, boost }
}

// --- Distribution (histogram) ---------------------------------------------

export type HistogramBin = { start: number, end: number, count: number }

export function distribution(solves: Solve[], bins = 12): HistogramBin[] {
  const times = finitePoints(solves).map((p) => p.ms)
  if (times.length < 5) return []
  const min = Math.min(...times)
  const max = Math.max(...times)
  if (max === min) return [{ start: min, end: max, count: times.length }]
  const width = (max - min) / bins
  const out: HistogramBin[] = Array.from({ length: bins }, (_, i) => ({
    start: min + i * width,
    end: min + (i + 1) * width,
    count: 0,
  }))
  for (const t of times) {
    let idx = Math.floor((t - min) / width)
    if (idx >= bins) idx = bins - 1
    out[idx]!.count++
  }
  return out
}

// --- Performance over time -------------------------------------------------

export type Period = 'week' | 'month' | 'year' | 'all'

const PERIOD_MS: Record<Exclude<Period, 'all'>, number> = {
  week: 7 * DAY_MS,
  month: 30 * DAY_MS,
  year: 365 * DAY_MS,
}

/** Finite solve points within the selected trailing period. */
export function performanceOverTime(
  solves: Solve[],
  period: Period,
  now = Date.now(),
): { createdAt: number, ms: number }[] {
  const points = finitePoints(solves)
  if (period === 'all') return points
  const cutoff = now - PERIOD_MS[period]
  return points.filter((p) => p.createdAt >= cutoff)
}

// --- Practice calendar (GitHub-style heatmap) ------------------------------

export type CalendarDay = { date: number, count: number }

/**
 * Solve counts per day for the trailing `weeks`, laid out in week-columns
 * (each column is a Sun..Sat run), oldest column first.
 */
export function practiceCalendar(solves: Solve[], weeks = 53, now = Date.now()): CalendarDay[][] {
  const counts = new Map<number, number>()
  for (const s of solves) {
    const key = startOfDay(s.createdAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const end = startOfDay(now)
  // Walk back to the Sunday that starts the earliest visible week.
  const startSunday = end - (weeks - 1) * 7 * DAY_MS - new Date(end).getDay() * DAY_MS

  const grid: CalendarDay[][] = []
  for (let w = 0; w < weeks; w++) {
    const col: CalendarDay[] = []
    for (let d = 0; d < 7; d++) {
      const date = startSunday + (w * 7 + d) * DAY_MS
      col.push({ date, count: date <= end ? counts.get(date) ?? 0 : -1 })
    }
    grid.push(col)
  }
  return grid
}

// --- Personal best journey -------------------------------------------------

export type PBMilestone = {
  createdAt: number
  ms: number
  /** Improvement over the previous PB in ms (0 for the first). */
  delta: number
}

/** Chronological list of solves that set a new personal best. */
export function personalBestJourney(solves: Solve[]): PBMilestone[] {
  const asc = finitePoints(solves)
  const out: PBMilestone[] = []
  let best = Infinity
  for (const p of asc) {
    if (p.ms < best) {
      out.push({ createdAt: p.createdAt, ms: p.ms, delta: best === Infinity ? 0 : best - p.ms })
      best = p.ms
    }
  }
  return out
}

/** Convenience re-export so the page can pull the single overall best. */
export function personalBest(solves: Solve[]): number | null {
  return bestOf(solves)
}
