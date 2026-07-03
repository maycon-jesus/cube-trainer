<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '~/stores/db/config'
import { useSolvesStore, type Penalty, type Solve } from '~/stores/db/solves'
import { cubesDefinition } from '~~/lib/cube/cubesDefinition'

const solvesStore = useSolvesStore()
const configStore = useConfigStore()
const { add } = solvesStore
const solves= ref<Solve[]>([])

// --- Scramble -------------------------------------------------------------
const scramble = ref('')
const cubeDefinition = computed(() => cubesDefinition[configStore.puzzle])

function newScramble() {
  scramble.value = cubeDefinition.value?.generateScramble?.() ?? ''
}

onBeforeMount(() => {
  newScramble()
})

async function resolved(solve: Solve) {
  await add(solve)
  newScramble()
  await refrehSolves()
}

async function refrehSolves() {
  solves.value = await solvesStore.getAll('normal', configStore.sessionId, configStore.puzzle, '')
}

watch(() => configStore.puzzle, async ()=>{
  newScramble()
  await refrehSolves()
})
</script>

<template>
  <v-container fluid class="pa-4">
        <v-row cols="12" md="2">
          <v-col>
            <v-row>
              <v-col cols="12">
                <TimerSessionPuzzleSelector />
              </v-col>
              <v-col cols="12">
                <TimerStats :solves="solves" />
              </v-col>
            </v-row>
          </v-col>

          <!-- Timer column -->
          <v-col cols="12" md="8" class="d-flex flex-column">
            <!-- Scramble -->
             <TimerScramble class="mb-4" :scramble="scramble" v-show="scramble" @refresh="newScramble()" />

            <!-- Timer surface -->
            <Timer :last-solve="solves[0]?? undefined" :session-id="configStore.sessionId" :category="'normal'" :puzzle="configStore.puzzle" @solve="resolved" />

            <!-- Scramble preview -->
            <v-card class="pa-4 mt-4 d-flex justify-center" v-if="configStore.puzzle === '3x3x3'">
              <ClientOnly>
                <ScrambleCube :scramble="scramble" />
              </ClientOnly>
            </v-card>
          </v-col>

          <!-- Sidebar: times -->
          <v-col cols="12" md="2">
            <TimerSolves :solves="solves" @solves-updated="refrehSolves()" />
        </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.timer-surface {
  min-height: 320px;
  user-select: none;
  cursor: pointer;
}
.timer-value {
  font-size: clamp(3.5rem, 14vw, 9rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.1s ease;
}
.stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
}
.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.times-list {
  max-height: 420px;
  overflow-y: auto;
}
kbd {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.85em;
}
</style>
