<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <v-btn
      variant="text"
      class="mb-2 px-2 text-none"
      prepend-icon="mdi-arrow-left"
      :to="localePath('/training')"
    >
      {{ t('training.title') }}
    </v-btn>

    <LayoutsPageHeader
      :title="t(`training.${puzzleId}.header.title`)"
      :subtitle="t(`training.${puzzleId}.header.subtitle`)"
    >
      <template #append>
        <span
          v-if="setItems.length"
          class="training-set-count d-inline-flex align-center ga-2 text-body-medium font-weight-medium"
        >
          <v-icon icon="mdi-layers-triple-outline" size="18" />
          {{ t('training.sets', setItems.length) }}
        </span>
      </template>
    </LayoutsPageHeader>

    <TrainingPuzzleSelector :items="setItems" />
  </v-container>
</template>

<script setup lang="ts">
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';

const puzzleId = useRoute().params.puzzle as string
const puzzle = cubesDefinition[puzzleId]
if (!puzzle) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle not found'
  })
}
if (!puzzle.trainingSets) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle does not have training sets'
  })
}

const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo(`puzzle.${puzzleId}`)

const trainingSets = puzzle.trainingSets

// Sets carry either an i18n `nameKey`/`descriptionKey` or a literal `name`/`description`.
const setItems = computed(() =>
  trainingSets.map((set) => {
    const count = set.algorithms.length
    return {
      title: set.nameKey ? t(set.nameKey) : set.name ?? '',
      value: set.id,
      imageUrl: set.imageUrl || undefined,
      path: localePath(`/training/${puzzleId}/${set.id}`),
      meta: set.descriptionKey ? t(set.descriptionKey) : set.description ?? undefined,
      badge: count != null ? t('training.caseCount', count) : undefined,
      badgeIcon: 'mdi-view-grid-outline',
    }
  }),
)
</script>

<style scoped lang="scss">
.training-set-count {
  padding: 6px 12px;
  border-radius: 999px;
  color: rgba(var(--v-theme-on-surface), 0.75);
  background: rgba(var(--v-theme-on-surface), 0.05);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
