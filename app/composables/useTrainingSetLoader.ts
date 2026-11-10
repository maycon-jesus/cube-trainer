import type { CubeData, TrainingSet } from '~~/lib/cube/cubesDefinition'

const loadedSets = reactive<Record<string, TrainingSet[]>>({})

// Loads a puzzle's training sets and merges each set's locale messages into
// vue-i18n first, so nameKey/descriptionKey (set and algorithm) resolve on render.
// Must be called during setup; the returned loader reads the locale at call time.
export function useTrainingSetLoader() {
  const { locale, mergeLocaleMessage, t } = useI18n({ useScope: 'local' })

  return async function loadTrainingSets(puzzle: CubeData): Promise<TrainingSet[]> {
    if (loadedSets[puzzle.id]) {
      return Promise.resolve(loadedSets[puzzle.id]!)
    }

    const sets = (await puzzle.loadTrainingSets?.()) ?? []
    const current = locale.value
    await Promise.all(sets.map(async (set) => {
      const messages = await set.loadMessages?.(current)
      if (messages) mergeLocaleMessage(current, messages)
    }))

    for (const set of sets) {
      if (set.descriptionKey) set.description = t(set.descriptionKey)
      if (set.nameKey) set.name = t(set.nameKey)
      for (const algorith of set.algorithms) {
        if (algorith.nameKey) algorith.name = t(algorith.nameKey)
      }
    }
    loadedSets[puzzle.id] = sets
    return sets
  }
}
