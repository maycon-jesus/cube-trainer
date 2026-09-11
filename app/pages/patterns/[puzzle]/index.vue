<script setup lang="ts">
import { cubesDefinition, type CubePattern, type PatternDifficulty } from '~~/lib/cube/cubesDefinition'

const puzzleId = useRoute().params.puzzle as string
const puzzle = cubesDefinition[puzzleId]
if (!puzzle) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle not found'
  })
}
if (!puzzle.patterns?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle does not have patterns'
  })
}

const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo(`patterns.puzzles.${puzzleId}`)

const patterns = puzzle.patterns
const difficulties: PatternDifficulty[] = ['easy', 'medium', 'hard']

const difficulty = ref<PatternDifficulty>()

const selectedPattern = ref<CubePattern | null>(null)
const detailsOpen = ref(false)

const filteredPatterns = computed(() =>
  patterns.filter((pattern) => !difficulty.value || pattern.difficulty === difficulty.value),
)

function openDetails(pattern: CubePattern) {
  selectedPattern.value = pattern
  detailsOpen.value = true
}
</script>

<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <v-btn
      variant="text"
      class="mb-2 px-2 text-none"
      prepend-icon="mdi-arrow-left"
      :to="localePath('/patterns')"
    >
      {{ t('patterns.title') }}
    </v-btn>

    <LayoutsPageHeader
      :title="t(`patterns.${puzzleId}.header.title`)"
      :subtitle="t(`patterns.${puzzleId}.header.subtitle`)"
    >
      <template #append>
        <span class="patterns-count d-inline-flex align-center ga-2 text-body-medium font-weight-medium">
          <v-icon icon="mdi-view-grid-outline" size="18" />
          {{ t('patterns.patternCount', patterns.length) }}
        </span>
      </template>
    </LayoutsPageHeader>

    <v-alert
      type="info"
      variant="tonal"
      rounded="lg"
      density="comfortable"
      class="mb-6 text-body-medium"
      icon="mdi-lightbulb-on-outline"
    >
      {{ t('patterns.tip') }}
    </v-alert>

    <v-chip-group v-model="difficulty" class="mb-4" selected-class="text-primary">
      <v-chip
        v-for="value in difficulties"
        :key="value"
        :value="value"
        variant="outlined"
        filter
      >
        {{ t(`patterns.difficulty.${value}`) }}
      </v-chip>
    </v-chip-group>

    <v-row>
      <v-col
        v-for="pattern in filteredPatterns"
        :key="pattern.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <PatternCard :pattern="pattern" @details="openDetails" />
      </v-col>
    </v-row>

    <v-card
      v-if="!filteredPatterns.length"
      variant="tonal"
      rounded="lg"
      class="pa-6 text-center text-medium-emphasis"
    >
      <v-icon icon="mdi-cube-outline" size="40" class="mb-2 d-block mx-auto" />
      {{ t('patterns.empty') }}
    </v-card>

    <PatternDetailsDialog v-model="detailsOpen" :pattern="selectedPattern" />
  </v-container>
</template>

<style scoped lang="scss">
.patterns-count {
  padding: 6px 12px;
  border-radius: 999px;
  color: rgba(var(--v-theme-on-surface), 0.75);
  background: rgba(var(--v-theme-on-surface), 0.05);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
