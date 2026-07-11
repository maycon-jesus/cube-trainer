<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <LayoutsPageHeader
      :title="`Treinar algoritmos ${puzzle.name}`"
      subtitle="Pratique os algoritmos por conjunto e domine cada caso"
    />

    <TrainingSetSelector
      :sets="trainingSets"
      class="mb-8"
      @select="scrollToSet"
    />

    <TrainingSection
      v-for="set in trainingSets"
      :key="set.name"
      :ref="(el) => registerSection(set.name, el)"
      :set="set"
    />
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
if(!puzzle.trainingSets) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle does not have training sets'
  })
}

const trainingSets = puzzle.trainingSets

const sections = new Map<string, HTMLElement>()

function registerSection(name: string, el: Element | ComponentPublicInstance | null) {
  const dom = el instanceof HTMLElement ? el : (el as ComponentPublicInstance | null)?.$el
  if (dom instanceof HTMLElement) {
    sections.set(name, dom)
  } else {
    sections.delete(name)
  }
}

function scrollToSet(name: string) {
  sections.get(name)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
