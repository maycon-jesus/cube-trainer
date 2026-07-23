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
              <Timer :scramble="scramble" :class="{elevated: started}" :last-solve="solves[0]?? undefined" :session-id="configStore.sessionId" :type="'normal'" :puzzle="configStore.puzzle" @solve="resolved" @penalty="setLastPenalty" @delete="deleteLast" @start="started=true" @stop="started=false" />
            </v-col>
            </v-row>

            <!-- Scramble preview -->
            <v-row density="comfortable">
              <v-col cols="12">
                <CustomCard v-if="configStore.puzzle === '3x3x3'" :title="$t('timer.scramble.preview')">
                  <div class="d-flex justify-center py-2">
                    <ClientOnly>
                      <ScrambleCube :scramble="scramble" class="scramble-preview" />
                    </ClientOnly>
                  </div>
                </CustomCard>
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

async function setLastPenalty(penalty: Solve['penalty']) {
  const last = solves.value[0]
  if (!last) return
  await solvesStore.update({ ...last, penalty })
  await refrehSolves()
}

async function deleteLast() {
  const last = solves.value[0]
  if (last?.id !== undefined) await solvesStore.remove(last.id)
  await refrehSolves()
}

async function refrehSolves() {
  solves.value = await solvesStore.getAllWithFilter({
    type: 'normal',
    sessionId: configStore.sessionId,
    puzzle: configStore.puzzle,
    pageSize: 1000,
    page: 1,
  })
}

watch([() => configStore.puzzle, ()=> configStore.sessionId], async ()=>{
  newScramble()
  await refrehSolves()
})
</script>

<style scoped>
.elevated{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  z-index: 10000;
  border: 0.5rem solid rgb(var(--v-theme-primary));
}

.scramble-preview {
  width: 100%;
  max-width: 340px;
  height: auto;
}
</style>
