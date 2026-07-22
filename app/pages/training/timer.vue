<template>
  <v-container fluid class="pa-4">
        <v-row density="comfortable">
          <v-col cols="12" lg="4" xxl="2" >
            <v-row density="comfortable">
              <v-col cols="12" md="6" lg="12">
                  <CustomCard :title="trainingSetName" :subtitle="trainingSetDescription">
                      <SessionSelector v-model="configStore.sessionId" />
                  <v-list-item
                    v-if="currentAlgorithm"
                    class="px-0 mt-4"
                    :title="currentAlgorithmName"
                    subtitle="Caso atual"
                  >
                    <template #prepend>
                      <v-avatar v-if="currentAlgorithm.imageUrl" rounded="lg" size="48">
                        <v-img :src="currentAlgorithm.imageUrl" :alt="currentAlgorithmName" />
                      </v-avatar>
                    </template>
                  </v-list-item>
                </CustomCard>
              </v-col>
              <v-col v-if="display.mdAndUp.value" cols="12" md="6" lg="12">
                <TimerStats :solves="solves" />
              </v-col>
              <v-col v-if="display.lgAndUp.value" cols="12">
                <TimerSolves :solves="solves.slice(0, 12)" @solves-updated="refreshSolves()" />
              </v-col>
            </v-row>
          </v-col>

          <!-- Timer column -->
          <v-col cols="12" lg="8">
            <!-- Scramble -->
            <v-row density="comfortable">
              <v-col cols="12">
              <TimerScramble v-show="scramble" :scramble="scramble" @refresh="newScramble()" />
            </v-col>
            </v-row>

            <!-- Timer surface -->
            <v-row density="comfortable">
              <v-col cols="12">
              <Timer :scramble="scramble" :class="{elevated: started}" :last-solve="solves[0]?? undefined" :session-id="configStore.sessionId" :type="'training'" :puzzle="puzzle" :training-algorithm-id="currentAlgorithm?.id" @solve="resolved" @start="started=true" @stop="started=false" />
            </v-col>
            </v-row>

            <!-- Scramble preview -->
            <v-row density="comfortable">
              <v-col cols="12">
                <v-card v-if="puzzle === '3x3x3'" class="pa-4 d-flex justify-center">
                  <ClientOnly>
                    <ScrambleCube :scramble="scramble" />
                  </ClientOnly>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Sidebar: times -->
          <v-col v-if="display.mdAndDown.value" cols="12">
            <v-row>
              <v-col v-if="display.smAndDown.value" cols="12">
                <TimerStats :solves="solves" />
              </v-col>
              <v-col cols="12">
                <TimerSolves :solves="solves.slice(0, 12)" @solves-updated="refreshSolves()" />
              </v-col>
            </v-row>
        </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'
import { useCustomTimerStore } from '~/stores/customTimer'
import { useSolvesStore, type Solve } from '~/stores/db/solves'
import type { TrainingAlgorithm } from '~~/lib/cube/cubesDefinition'

const solvesStore = useSolvesStore()
const configStore = useConfigStore()
const customTimerStore = useCustomTimerStore()
const display = useDisplay()
const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo('index', { suffix: false })

const { add } = solvesStore
const solves = ref<Solve[]>([])
const started = ref(false)

// --- Training set (predefined scrambles) ----------------------------------
const trainingSet = computed(() => customTimerStore.trainingSet)
const puzzle = computed(() => customTimerStore.puzzle ?? '')

const currentAlgorithm = ref<TrainingAlgorithm | null>(null)
const scramble = ref('')

// Pick a random algorithm from the training set and one of its setup scrambles.
async function newScramble() {
  const algorithms = trainingSet.value ? trainingSet.value.algorithms : []
  if (algorithms.length === 0) {
    currentAlgorithm.value = null
    scramble.value = ''
    return
  }
  const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]!
  currentAlgorithm.value = algorithm
  scramble.value = await algorithm.generateSetupScramble()

}

onBeforeMount(async () => {
  // Guard: this screen only makes sense with a training set loaded.
  const algorithms = trainingSet.value ? trainingSet.value.algorithms : []
  if (algorithms.length === 0) {
    await navigateTo(localePath({ name: 'training' }))
    return
  }
  await newScramble()
  await refreshSolves()
})

async function resolved(solve: Solve) {
  await add(solve)
  await newScramble()
  await refreshSolves()
}

async function refreshSolves() {
  solves.value = await solvesStore.getAll('training', configStore.sessionId, puzzle.value, currentAlgorithm.value?.id ?? '')
}

watch([() => configStore.sessionId, () => trainingSet.value?.id], async () => {
  await newScramble()
  await refreshSolves()
})

const trainingSetName = computed(() => {
  if (!trainingSet.value) return ''
  return trainingSet.value.name ?? t(trainingSet.value.nameKey??'')
})

const trainingSetDescription = computed(() => {
  if (!trainingSet.value) return undefined
  return trainingSet.value.description ?? (trainingSet.value.descriptionKey? t(trainingSet.value.descriptionKey) : undefined)
})

const currentAlgorithmName = computed(() => {
  if (!currentAlgorithm.value) return ''
  return currentAlgorithm.value.name ?? t(currentAlgorithm.value.nameKey??'')
})
</script>

<style scoped>
.elevated{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 99vw;
  height: 99vh;
  z-index: 10000;
  border: 0.5rem solid rgb(var(--v-theme-primary));
}
</style>
