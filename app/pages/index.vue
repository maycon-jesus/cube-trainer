<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '~/stores/db/config'
import { useSolvesStore, type Penalty, type Solve } from '~/stores/db/solves'

const solvesStore = useSolvesStore()
const configStore = useConfigStore()
const { solves } = storeToRefs(solvesStore)
const { add } = solvesStore

// --- Scramble -------------------------------------------------------------
const { scramble, newScramble } = useScramble()

onBeforeMount(() => {
  newScramble()
})

async function resolved(solve: Solve) {
  await add(solve)
  newScramble()
}
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
            <v-sheet rounded="lg" color="surface" class="pa-4 mb-4 text-center">
              <div class="text-h6 text-md-h5 font-monospace text-medium-emphasis">
                {{ scramble }}
              </div>
            </v-sheet>

            <!-- Timer surface -->
            <Timer :last-solve="solves[0]?? undefined" :session-id="configStore.sessionId" :category="'normal'" :puzzle="configStore.puzzle" @solve="resolved" />

            <!-- Scramble preview -->
            <v-sheet rounded="lg" color="surface" class="pa-4 mt-4 d-flex justify-center">
              <ClientOnly>
                <ScrambleCube :scramble="scramble" />
              </ClientOnly>
            </v-sheet>
          </v-col>

          <!-- Sidebar: times -->
          <v-col cols="12" md="2">
            <TimerSolves :solves="solves" />
        </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.font-monospace {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  letter-spacing: 0.04em;
}
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
