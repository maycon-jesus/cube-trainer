<script setup lang="ts">
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo('training')

function getPuzzleRoute(puzzleId: string) {
  return localePath(`/training/${puzzleId}`)
}

const setsCounts = ref<Record<string, number>>({})

const trainablePuzzles = Object.values(cubesDefinition).filter((puzzle) => !!puzzle.loadTrainingSets)

onMounted(async () => {
  await Promise.all(
    trainablePuzzles.map(async (puzzle) => {
      const sets = await puzzle.loadTrainingSets!()
      setsCounts.value[puzzle.id] = sets.length
    }),
  )
})

const trainingCubes = computed(() => {
  return trainablePuzzles.map((puzzle) => {
    const setsCount = setsCounts.value[puzzle.id] ?? 0
    return {
      title: t(`cube.${puzzle.id}`),
      value: puzzle.id,
      imageUrl: puzzle.imageUrl || '',
      path: getPuzzleRoute(puzzle.id),
      sets: t('training.sets', setsCount),
    }
  })
})
</script>

<template>
  <v-container class="py-6">
    <LayoutsPageHeader :title="t('training.title')" :subtitle="t('training.subtitle')" />
    <TrainingPuzzleSelector :items="trainingCubes" />
  </v-container>
</template>
