<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <LayoutsPageHeader
      :title="t(`training.${puzzleId}.header.title`)"
      :subtitle="t(`training.${puzzleId}.header.subtitle`)"
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
      :selected-ids="selectedIds"
      @add-to-list="toggleSelection"
      @train="trainSingle"
      @train-set="trainSet"
    />

    <TrainingSelectionToolbar
      :count="selectedAlgorithms.length"
      @train="trainSelected"
      @clear="clearSelection"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useCustomTimerStore } from '~/stores/customTimer';
import { cubesDefinition, type TrainingAlgorithm, type TrainingSet } from '~~/lib/cube/cubesDefinition';

const puzzleId = useRoute().params.puzzle as string
const puzzle = cubesDefinition[puzzleId]
if (!puzzle) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle not found'
  })
}
if(!puzzle.loadTrainingSets) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle does not have training sets'
  })
}

const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo(`puzzle.${puzzleId}`)

const trainingSets = ref<TrainingSet[]>([])
puzzle.loadTrainingSets().then((sets) => {
  trainingSets.value = sets
})
const sections = new Map<string, HTMLElement>()
const customTimerStore = useCustomTimerStore()

// Algorithms picked via "add to list" build a selection surfaced in the toolbar.
const selectedAlgorithms = ref<TrainingAlgorithm[]>([])
const selectedIds = computed(() => new Set(selectedAlgorithms.value.map((a) => a.id)))

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

function toggleSelection(algorithm: TrainingAlgorithm) {
  const index = selectedAlgorithms.value.findIndex((a) => a.id === algorithm.id)
  if (index >= 0) {
    selectedAlgorithms.value.splice(index, 1)
  } else {
    selectedAlgorithms.value.push(algorithm)
  }
}

function clearSelection() {
  selectedAlgorithms.value = []
}

function trainSingle(algorithm: TrainingAlgorithm) {
  customTimerStore.useTrainingSetDefault(puzzleId)
  customTimerStore.addAlgorithmToTrainingSet(algorithm)
  navigateTo(localePath({ name: 'training-timer' }))
}

function trainSelected() {
  if (!selectedAlgorithms.value.length) return
  customTimerStore.useTrainingSetDefault(puzzleId)
  for (const algorithm of selectedAlgorithms.value) {
    customTimerStore.addAlgorithmToTrainingSet(algorithm)
  }
  navigateTo(localePath({ name: 'training-timer' }))
}

function trainSet(set: TrainingSet) {
  customTimerStore.useTrainingSet(set)
  navigateTo(localePath({ name: 'training-timer' }))
}
</script>
