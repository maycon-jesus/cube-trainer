<template>
  <v-container fluid class="pa-4">
        <v-row density="comfortable">
          <v-col cols="12" lg="4" xxl="2" >
            <v-row density="comfortable">
              <v-col cols="12" md="6" lg="12">
                <TimerSessionPuzzleSelector class="fill-height" />
              </v-col>
              <v-col v-if="display.mdAndUp.value" cols="12" md="6" lg="12">
                <TimerStats :solves="solves" />
              </v-col>
              <v-col v-if="display.lgAndUp.value" cols="12">
                <TimerSolves :solves="solves.slice(0, 12)" @solves-updated="refrehSolves()" />
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
              <Timer :scramble="scramble" :class="{elevated: started}" :last-solve="solves[0]?? undefined" :session-id="configStore.sessionId" :category="'normal'" :puzzle="configStore.puzzle" @solve="resolved" @start="started=true" @stop="started=false" />
            </v-col>
            </v-row>

            <!-- Scramble preview -->
            <v-row density="comfortable">
              <v-col cols="12">
                <v-card v-if="configStore.puzzle === '3x3x3'" class="pa-4 d-flex justify-center">
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
                <TimerSolves :solves="solves.slice(0, 12)" @solves-updated="refrehSolves()" />
              </v-col>
            </v-row>
        </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'
import { useSolvesStore, type Solve } from '~/stores/db/solves'
import { cubesDefinition } from '~~/lib/cube/cubesDefinition'

const solvesStore = useSolvesStore()
const configStore = useConfigStore()
const display = useDisplay()

usePageSeo('index', { suffix: false })

const { add } = solvesStore
const solves= ref<Solve[]>([])
const started = ref(false)

// --- Scramble -------------------------------------------------------------
const scramble = ref('')
const cubeDefinition = computed(() => cubesDefinition[configStore.puzzle])

function newScramble() {
  scramble.value = cubeDefinition.value?.generateScramble?.() ?? ''
}

onBeforeMount(async() => {
  newScramble()
  await refrehSolves()
})

async function resolved(solve: Solve) {
  await add(solve)
  newScramble()
  await refrehSolves()
}

async function refrehSolves() {
  solves.value = await solvesStore.getAll('normal', configStore.sessionId, configStore.puzzle, '')
}

watch([() => configStore.puzzle, ()=> configStore.sessionId], async ()=>{
  newScramble()
  await refrehSolves()
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
