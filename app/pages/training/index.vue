<script setup lang="ts">
import { cubesDefinition, type TrainingSet } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo('training')

const trainablePuzzles = Object.values(cubesDefinition).filter((puzzle) => !!puzzle.loadTrainingSets)

const setsByPuzzle = ref<Record<string, TrainingSet[]>>({})
const caseCounts = ref<Record<string, number>>({})

onMounted(async () => {
  await Promise.all(
    trainablePuzzles.map(async (puzzle) => {
      const sets = await puzzle.loadTrainingSets!()
      setsByPuzzle.value[puzzle.id] = sets
      // Load each set's algorithms once to surface the case count on the card.
      await Promise.all(
        sets.map(async (set) => {
          const algorithms = await set.algorithms()
          caseCounts.value[`${puzzle.id}:${set.id}`] = algorithms.length
        }),
      )
    }),
  )
})

// Sets carry either an i18n `nameKey`/`descriptionKey` or a literal `name`/`description`.
function setItems(puzzleId: string) {
  return (setsByPuzzle.value[puzzleId] ?? []).map((set) => {
    const count = caseCounts.value[`${puzzleId}:${set.id}`]
    return {
      title: set.nameKey ? t(set.nameKey) : set.name ?? '',
      value: set.id,
      imageUrl: set.imageUrl || undefined,
      path: localePath(`/training/${puzzleId}/${set.id}`),
      meta: set.descriptionKey ? t(set.descriptionKey) : set.description ?? undefined,
      badge: count != null ? t('training.caseCount', count) : undefined,
      badgeIcon: 'mdi-view-grid-outline',
    }
  })
}
</script>

<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <LayoutsPageHeader :title="t('training.title')" :subtitle="t('training.subtitle')" />

    <section
      v-for="puzzle in trainablePuzzles"
      :key="puzzle.id"
      class="mb-10"
    >
      <div class="d-flex align-center ga-3 mb-4">
        <span class="training-puzzle-heading__icon-box d-inline-flex align-center justify-center flex-shrink-0 rounded-lg">
          <component :is="puzzle.icon" class="training-puzzle-heading__icon" />
        </span>
        <h2 class="text-headline-small font-weight-bold mb-0 mt-0">{{ t(`cube.${puzzle.id}`) }}</h2>
        <NuxtLink
          :to="localePath(`/training/${puzzle.id}`)"
          class="training-puzzle-heading__link d-inline-flex align-center ga-1 ms-auto text-body-medium font-weight-medium text-decoration-none"
        >
          {{ t('training.viewAll') }}
          <v-icon icon="mdi-arrow-right" size="16" class="training-puzzle-heading__arrow" />
        </NuxtLink>
      </div>

      <TrainingPuzzleSelector :items="setItems(puzzle.id)" />
    </section>
  </v-container>
</template>

<style scoped lang="scss">
.training-puzzle-heading__icon-box {
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.training-puzzle-heading__icon {
  width: 24px;
  height: 24px;
  color: rgb(var(--v-theme-primary));
}

.training-puzzle-heading__link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-primary));

    .training-puzzle-heading__arrow {
      transform: translateX(3px);
    }
  }
}

.training-puzzle-heading__arrow {
  transition: transform 0.2s ease;
}
</style>
