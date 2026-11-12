<script setup lang="ts">
import { cubesDefinition, type CubePattern } from '~~/lib/cube/cubesDefinition'

type PuzzleSummary = {
  id: string,
  name: string,
  imageUrl: string,
  hasPatterns: boolean
}

const { locale, t } = useI18n()

usePageSeo('patterns')

const { data: puzzles, error } = await useFetch<PuzzleSummary[]>(() => `/api/${locale.value}/puzzles`)
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.message
  })
}

const sections = computed(() => (puzzles.value ?? []).filter(p => p.hasPatterns))

const selectedPattern = ref<CubePattern | null>(null)
const selectedPuzzleId = ref<string | null>(null)
const detailsOpen = ref(false)

// Inversão de scramble é só de UI/cliente; a API não a expõe.
const selectedCubeDefinition = computed(() => selectedPuzzleId.value ? cubesDefinition[selectedPuzzleId.value] ?? null : null)

const sectionsJsonld = computed(() => sections.value.map(puzzle => {
  return {
    name: t(`seo.patterns.puzzles.${puzzle.id}.title`),
    description: t(`seo.patterns.puzzles.${puzzle.id}.description`),
    url: `/patterns/${puzzle.id}`,
    imageUrl: puzzle.imageUrl
  }
}))

function openDetails(pattern: CubePattern, puzzleId: string) {
  selectedPattern.value = pattern
  selectedPuzzleId.value = puzzleId
  detailsOpen.value = true
}
</script>

<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <JsonldPatterns :items="sectionsJsonld" />
    <LayoutsPageHeader :title="t('patterns.title')" :subtitle="t('patterns.subtitle')" />

    <v-alert type="info" variant="tonal" rounded="lg" density="comfortable" class="mb-6 text-body-medium"
      icon="mdi-lightbulb-on-outline">
      {{ t('patterns.tip') }}
    </v-alert>

    <PatternSection v-for="puzzle in sections" :key="puzzle.id" :puzzle="puzzle" @details="openDetails" />

    <v-card v-if="!sections.length" variant="tonal" rounded="lg" class="pa-6 text-center text-medium-emphasis">
      <v-icon icon="mdi-cube-outline" size="40" class="mb-2 d-block mx-auto" />
      {{ t('patterns.empty') }}
    </v-card>

    <PatternDetailsDialog v-model="detailsOpen" :pattern="selectedPattern" :cube-definition="selectedCubeDefinition" />
  </v-container>
</template>
