<script setup lang="ts">
const { t } = useI18n()

usePageSeo('patterns')

const { data: puzzles } = useApiGetPuzzles().useAsyncData()

const sections = computed(() => puzzles.value?.filter(p => p.hasPatterns) ?? [])

const selectedPattern = ref<Pattern | null>(null)
const selectedPuzzleId = ref<string | null>(null)
const detailsOpen = ref(false)

const sectionsJsonld = computed(() => sections.value.map(puzzle => {
  return {
    name: t(`seo.patterns.puzzles.${puzzle.id}.title`),
    description: t(`seo.patterns.puzzles.${puzzle.id}.description`),
    url: `/patterns/${puzzle.id}`,
    imageUrl: puzzle.imageUrl
  }
}))

function openDetails(pattern: Pattern, puzzleId: string) {
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

    <PatternDetailsDialog v-model="detailsOpen" :pattern="selectedPattern" />
  </v-container>
</template>
