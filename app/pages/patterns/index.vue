<script setup lang="ts">
import { cubesDefinition, type CubePattern } from '~~/lib/cube/cubesDefinition'

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo('patterns')

const PREVIEW_COUNT = 4

const patternPuzzles = Object.values(cubesDefinition).filter((puzzle) => puzzle.patterns?.length)

const selectedPattern = ref<CubePattern | null>(null)
const detailsOpen = ref(false)

const sections = patternPuzzles.map((puzzle) => ({
  puzzle,
  total: puzzle.patterns!.length,
  patterns: puzzle.patterns!.slice(0, PREVIEW_COUNT),
}))

function openDetails(pattern: CubePattern) {
  selectedPattern.value = pattern
  detailsOpen.value = true
}
</script>

<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <LayoutsPageHeader :title="t('patterns.title')" :subtitle="t('patterns.subtitle')" />

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

    <section
      v-for="section in sections"
      :key="section.puzzle.id"
      class="mb-10"
    >
      <div class="d-flex align-center ga-3 mb-4">
        <span class="patterns-heading__icon-box d-inline-flex align-center justify-center flex-shrink-0 rounded-lg">
          <component :is="section.puzzle.icon" class="patterns-heading__icon" />
        </span>
        <h2 class="text-headline-small font-weight-bold mb-0 mt-0">{{ t(`cube.${section.puzzle.id}`) }}</h2>
        <span class="text-body-medium text-medium-emphasis">
          {{ t('patterns.patternCount', section.total) }}
        </span>
        <NuxtLink
          :to="localePath(`/patterns/${section.puzzle.id}`)"
          class="patterns-heading__link d-inline-flex align-center ga-1 ms-auto text-body-medium font-weight-medium text-decoration-none"
        >
          {{ t('patterns.viewAll') }}
          <v-icon icon="mdi-arrow-right" size="16" class="patterns-heading__arrow" />
        </NuxtLink>
      </div>

      <v-row>
        <v-col
          v-for="pattern in section.patterns"
          :key="pattern.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <PatternCard :pattern="pattern" @details="openDetails" />
        </v-col>
      </v-row>
    </section>

    <v-card
      v-if="!sections.length"
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
.patterns-heading__icon-box {
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.patterns-heading__icon {
  width: 24px;
  height: 24px;
  color: rgb(var(--v-theme-primary));
}

.patterns-heading__link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-primary));

    .patterns-heading__arrow {
      transform: translateX(3px);
    }
  }
}

.patterns-heading__arrow {
  transition: transform 0.2s ease;
}
</style>
