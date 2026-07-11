<script setup lang="ts">
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo('training')

function getPuzzleRoute(puzzleId: string) {
  return localePath(`/training/${puzzleId}`)
}

const trainingCubes = computed(() => {
  return Object.entries(cubesDefinition)
    .filter(([_, puzzle]) => !!puzzle.trainingSets?.length)
    .map(([_, puzzle]) => {
      const setsCount = puzzle.trainingSets?.length ?? 0
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
