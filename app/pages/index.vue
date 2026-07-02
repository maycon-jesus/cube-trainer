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
  await add({ ms, scramble: scramble.value, penalty: 'none', createdAt: Date.now(), category: "normal", puzzle: configStore.puzzle, sessionId: configStore.sessionId, trainingId: '' })
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
