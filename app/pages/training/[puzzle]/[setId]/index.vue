<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <v-btn variant="text" class="mb-2 px-2 text-none" prepend-icon="mdi-arrow-left"
      :to="localePath(`/training/${puzzleId}`)">
      {{ t(`training.${puzzleId}.header.title`) }}
    </v-btn>
    <TrainingSection v-if="trainingSet" :set="trainingSet" :algorithms="algorithms" :selected-ids="selectedIds"
      @add-to-list="toggleSelection" @train="trainSingle" @train-set="trainSet" />

    <TrainingSelectionToolbar :count="selectedAlgorithms.length" @train="trainSelected" @clear="clearSelection"
      @create-playlist="playlistDialogOpen = true" />

    <TrainingPlaylistDialog v-model="playlistDialogOpen" :preset="playlistPreset" @saved="onPlaylistSaved" />
  </v-container>
</template>

<script setup lang="ts">
import { useCustomTimerStore } from '~/stores/customTimer';
import type { TrainingCase } from '~/stores/db/trainingPlaylists';

const route = useRoute()
const puzzleId = route.params.puzzle as string
const setId = route.params.setId as string

const { data: puzzle } = await useApiGetPuzzle().useAsyncData(puzzleId)
if (!puzzle.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle not found'
  })
}
if (!puzzle.value.hasTrainingSets) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Puzzle does not have training sets'
  })
}

const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo(`puzzle.${puzzleId}.sets.${setId}`)

const customTimerStore = useCustomTimerStore()

// Algorithms picked via "add to list" build a selection surfaced in the toolbar.
const selectedAlgorithms = ref<TrainingSetAlgorithm[]>([])
const selectedIds = computed(() => new Set(selectedAlgorithms.value.map((a) => a.id)))

const playlistDialogOpen = ref(false)
const playlistPreset = computed(() => ({
  puzzleId,
  trainingCases: selectedAlgorithms.value.map<TrainingCase>((a) => ({ setId, algorithmId: a.id })),
}))

onMounted(() => {
  customTimerStore.useTrainingSetDefault(puzzleId)
})

const { data: trainingSet } = await useApiGetPuzzleTrainingSet().useAsyncData(puzzle.value.id, setId)
if (!trainingSet.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Training set not found'
  })
}

const { data: algorithms } = await useApiGetPuzzleTrainingSetAlgorithms().useAsyncData(puzzle.value.id, setId)
if (!algorithms.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Training set has not algorithms'
  })
}

function toggleSelection(algorithm: TrainingSetAlgorithm) {
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

function onPlaylistSaved() {
  playlistDialogOpen.value = false
  clearSelection()
}

function trainSingle(algorithm: TrainingSetAlgorithm) {
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
  customTimerStore.useTrainingSet(set, algorithms.value ?? [])
  navigateTo(localePath({ name: 'training-timer' }))
}
</script>
