<template>
    <v-card
        class="timer-surface d-flex flex-column align-center justify-center flex-grow-1 pa-4"
        @touchstart.prevent="onTouchStart" @touchend.prevent="onTouchEnd">
        <div class="timer-value font-weight-bold" :class="timerColor">
            {{ display }}
        </div>
        <div class="text-medium-emphasis mt-4">
            Segure <kbd>espaço</kbd> e solte para iniciar · pressione para parar
        </div>
    </v-card>
</template>

<script setup lang="ts">
import type { Category, Solve } from '~/stores/db/solves';

const props = defineProps<{
    lastSolve?: Solve
    category: Category
    puzzle: string
    sessionId: number
    trainingId?: string
}>()
const emits = defineEmits<{
    (e: 'solve', solve: Solve): void
    (e: 'start'): void
    (e: 'stop'): void
}>()

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
  const last = props.lastSolve
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
  emits('start')
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
  emits('solve', { ms, scramble: '', penalty: 'none', createdAt: Date.now(), category: props.category, puzzle: props.puzzle, sessionId: props.sessionId, trainingId: props.trainingId?? '' })
  emits('stop')
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
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (holdTimer) clearTimeout(holdTimer)
})
</script>

<style lang="scss" scoped>
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
</style>