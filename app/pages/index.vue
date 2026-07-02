<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '~/stores/db/config'
import { useSolvesStore, type Penalty, type Solve } from '~/stores/db/solves'

const solvesStore = useSolvesStore()
const configStore = useConfigStore()
const { solves } = storeToRefs(solvesStore)
const { add, update, remove, clear } = solvesStore

// --- Scramble -------------------------------------------------------------
const { scramble, newScramble } = useScramble()

// --- Timer state machine --------------------------------------------------
// idle -> holding -> ready -> running -> idle
type Phase = 'idle' | 'holding' | 'ready' | 'running'
const phase = ref<Phase>('idle')
const HOLD_THRESHOLD = 300 // ms the spacebar must be held before it goes "ready"

const elapsed = ref(0)
let startTime = 0
let rafId: number | null = null
let holdTimer: ReturnType<typeof setTimeout> | null = null

const display = computed(() => {
  if (phase.value === 'running') return formatMs(elapsed.value)
  const last = solves.value[0]
  if (phase.value === 'idle' && last) return formatSolve(last)
  return formatMs(elapsed.value)
})

const timerColor = computed(() => {
  if (phase.value === 'ready') return 'text-green-accent-3'
  if (phase.value === 'holding') return 'text-amber-accent-3'
  return 'text-white'
})

function tick() {
  elapsed.value = performance.now() - startTime
  rafId = requestAnimationFrame(tick)
}

function startRunning() {
  phase.value = 'running'
  startTime = performance.now()
  elapsed.value = 0
  rafId = requestAnimationFrame(tick)
}

async function stopRunning() {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = null
  const ms = performance.now() - startTime
  elapsed.value = ms
  phase.value = 'idle'
  await add({ ms, scramble: scramble.value, penalty: 'none', createdAt: Date.now(), category: "normal", puzzle: configStore.puzzle, sessionId: configStore.sessionId })
  newScramble()
}

// --- Keyboard handling ----------------------------------------------------
function onKeyDown(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  // Avoid scrolling / button activation while interacting with the timer.
  if (e.repeat) {
    e.preventDefault()
    return
  }
  e.preventDefault()

  if (phase.value === 'running') {
    stopRunning()
    return
  }
  if (phase.value === 'idle') {
    phase.value = 'holding'
    holdTimer = setTimeout(() => {
      if (phase.value === 'holding') phase.value = 'ready'
    }, HOLD_THRESHOLD)
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  e.preventDefault()
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (phase.value === 'ready') {
    startRunning()
  } else if (phase.value === 'holding') {
    // Released too early, cancel the arm.
    phase.value = 'idle'
  }
}

// --- Touch handling (mobile) ---------------------------------------------
function onTouchStart() {
  if (phase.value === 'running') {
    stopRunning()
    return
  }
  if (phase.value === 'idle') {
    phase.value = 'holding'
    holdTimer = setTimeout(() => {
      if (phase.value === 'holding') phase.value = 'ready'
    }, HOLD_THRESHOLD)
  }
}
function onTouchEnd() {
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (phase.value === 'ready') startRunning()
  else if (phase.value === 'holding') phase.value = 'idle'
}

// --- Solve actions --------------------------------------------------------
async function setPenalty(solve: Solve, penalty: Penalty) {
  await update({ ...solve, penalty: solve.penalty === penalty ? 'none' : penalty })
}
async function removeSolve(solve: Solve) {
  if (solve.id !== undefined) await remove(solve.id)
}
async function clearAll() {
  if (confirm('Apagar todos os tempos?')) await clear()
}

// --- Stats ----------------------------------------------------------------
const stats = computed(() => ({
  count: solves.value.length,
  best: bestOf(solves.value),
  ao5: averageOf(solves.value, 5),
  ao12: averageOf(solves.value, 12),
  mean: meanOf(solves.value),
}))

// --- Lifecycle ------------------------------------------------------------
onBeforeMount(()=>{
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
})
onMounted(() => {
  newScramble()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (holdTimer) clearTimeout(holdTimer)
})

</script>

<template>
  <v-container fluid class="pa-4">
        <v-row cols="12" md="2">
          <v-col>
            <v-sheet rounded="lg" color="surface" class="pa-4 mb-4">
              <SessionSelector/>
              <SessionCubeSelector/>
            </v-sheet>

            <v-sheet rounded="lg" color="surface" class="pa-4 mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-1 font-weight-bold">Estatísticas</span>
                <span class="text-caption text-medium-emphasis">{{ stats.count }} solves</span>
              </div>
              <v-row density="compact">
                <v-col cols="6">
                  <div class="stat-label">melhor</div>
                  <div class="stat-value">{{ formatMs(stats.best) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">média</div>
                  <div class="stat-value">{{ formatMs(stats.mean) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">ao5</div>
                  <div class="stat-value">{{ formatMs(stats.ao5) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">ao12</div>
                  <div class="stat-value">{{ formatMs(stats.ao12) }}</div>
                </v-col>
              </v-row>
            </v-sheet>
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
            <v-sheet
              rounded="lg"
              color="surface"
              class="timer-surface d-flex flex-column align-center justify-center flex-grow-1"
              @touchstart.prevent="onTouchStart"
              @touchend.prevent="onTouchEnd"
            >
              <div class="timer-value font-weight-bold" :class="timerColor">
                {{ display }}
              </div>
              <div class="text-medium-emphasis mt-4">
                Segure <kbd>espaço</kbd> e solte para iniciar · pressione para parar
              </div>
            </v-sheet>

            <!-- Scramble preview -->
            <v-sheet rounded="lg" color="surface" class="pa-4 mt-4 d-flex justify-center">
              <ClientOnly>
                <ScrambleCube :scramble="scramble" />
              </ClientOnly>
            </v-sheet>
          </v-col>

          <!-- Sidebar: times -->
          <v-col cols="12" md="2">
            <v-sheet rounded="lg" color="surface" class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-1 font-weight-bold">Tempos</span>
                <v-btn
                  size="small"
                  variant="text"
                  color="error"
                  :disabled="!solves.length"
                  @click="clearAll"
                >
                  Limpar
                </v-btn>
              </div>

              <v-list v-if="solves.length" density="compact" bg-color="transparent" class="times-list">
                <v-list-item v-for="(solve, i) in solves" :key="solve.id" class="px-2">
                  <template #prepend>
                    <span class="text-caption text-medium-emphasis mr-3" style="width: 28px">
                      {{ solves.length - i }}.
                    </span>
                  </template>
                  <v-list-item-title
                    class="font-weight-medium"
                    :class="{ 'text-decoration-line-through text-medium-emphasis': solve.penalty === 'dnf' }"
                  >
                    {{ formatSolve(solve) }}
                  </v-list-item-title>
                  <template #append>
                    <v-btn
                      icon="mdi-numeric-2-box-outline"
                      size="x-small"
                      variant="text"
                      :color="solve.penalty === '+2' ? 'amber' : undefined"
                      title="+2"
                      @click="setPenalty(solve, '+2')"
                    />
                    <v-btn
                      icon="mdi-cancel"
                      size="x-small"
                      variant="text"
                      :color="solve.penalty === 'dnf' ? 'error' : undefined"
                      title="DNF"
                      @click="setPenalty(solve, 'dnf')"
                    />
                    <v-btn
                      icon="mdi-delete-outline"
                      size="x-small"
                      variant="text"
                      title="Remover"
                      @click="removeSolve(solve)"
                    />
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-medium-emphasis text-center py-6">
                Nenhum tempo ainda. Resolva o cubo!
              </div>
            </v-sheet>
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
