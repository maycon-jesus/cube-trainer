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
      :key="set.id"
      :ref="(el) => registerSection(set.id, el)"
      :set="set"
      @add-to-list="addToTrainingList"
      @train="addToTrainingList"
      @train-set="trainSet"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useCustomTimerStore } from '~/stores/customTimer';
import { cubesDefinition, type TrainingAlgorithm } from '~~/lib/cube/cubesDefinition';

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

const localePath = useLocalePath()

const trainingSets = puzzle.trainingSets
const sections = new Map<string, HTMLElement>()
const customTimerStore = useCustomTimerStore()

function registerSection(id: string, el: Element | ComponentPublicInstance | null) {
  const dom = el instanceof HTMLElement ? el : (el as ComponentPublicInstance | null)?.$el
  if (dom instanceof HTMLElement) {
    sections.set(id, dom)
  } else {
    sections.delete(id)
  }
}

function scrollToSet(id: string) {
  sections.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(()=>{
  customTimerStore.useTrainingSetDefault(puzzleId)
})

function addToTrainingList(algorithm: TrainingAlgorithm) {
  console.log('Adding algorithm to training list:', algorithm)
  customTimerStore.addAlgorithmToTrainingSet(algorithm)
  navigateTo(localePath({ name: 'training-timer' }))
}

function trainSet(set: typeof trainingSets[number]) {
  customTimerStore.useTrainingSet(set)
  navigateTo(localePath({ name: 'training-timer' }))
}
</script>
