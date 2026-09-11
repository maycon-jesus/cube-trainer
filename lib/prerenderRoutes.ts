import trainingSets333 from "./cube/3x3x3/training"
import patterns333 from "./cube/3x3x3/patterns"
import type { TrainingSet } from "./cube/training/types"
import type { CubePattern } from "./cube/patterns/types"

const PREFIXED_LOCALES = ['pt', 'es', 'zh'] as const

const trainingPuzzles: Record<string, TrainingSet[]> = {
  '3x3x3': trainingSets333,
}

const patternPuzzles: Record<string, CubePattern[]> = {
  '3x3x3': patterns333,
}

const staticRoutes = [
  '/',
  '/sessions',
  '/history',
  '/stats',
  '/settings',
  '/patterns',
  '/training',
  '/training/timer',
]

function withLocales(route: string): string[] {
  return [route, ...PREFIXED_LOCALES.map((locale) => `/${locale}${route}`)]
}

function trainingRoutes(): string[] {
  const routes: string[] = []
  for (const [puzzleId, sets] of Object.entries(trainingPuzzles)) {
    routes.push(`/training/${puzzleId}`)
    for (const set of sets) {
      routes.push(`/training/${puzzleId}/${set.id}`)
    }
  }
  return routes
}

function patternRoutes(): string[] {
  return Object.entries(patternPuzzles)
    .filter(([, patterns]) => patterns.length)
    .map(([puzzleId]) => `/patterns/${puzzleId}`)
}

export function getPrerenderRoutes(): string[] {
  return [...staticRoutes, ...trainingRoutes(), ...patternRoutes()].flatMap(withLocales)
}
