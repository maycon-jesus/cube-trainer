<template>
    <v-card
        class="timer-surface d-flex flex-column align-center justify-center flex-grow-1 pa-4"
        :class="`is-${phase}`"
        @touchstart.prevent="onTouchStart" @touchend.prevent="onTouchEnd">
        <div class="timer-value font-weight-bold" :class="timerColor">
            {{ display }}
        </div>
        <Transition name="hint-fade" mode="out-in">
            <div v-if="showActions" key="actions" class="timer-actions mt-6" @touchstart.stop @touchend.stop>
                <v-btn
                    size="small" class="text-none" color="success"
                    :variant="lastSolve?.penalty === 'none' ? 'flat' : 'outlined'"
                    @click="setPenalty('none')">
                    {{ t('timer.actions.ok') }}
                </v-btn>
                <v-btn
                    size="small" class="text-none" color="warning"
                    :variant="lastSolve?.penalty === '+2' ? 'flat' : 'outlined'"
                    @click="setPenalty('+2')">
                    +2
                </v-btn>
                <v-btn
                    size="small" class="text-none" color="error"
                    :variant="lastSolve?.penalty === 'dnf' ? 'flat' : 'outlined'"
                    @click="setPenalty('dnf')">
                    DNF
                </v-btn>
                <v-btn
                    size="small" variant="text" color="error" icon="mdi-delete-outline"
                    :title="t('timer.solves.remove')" @click="deleteSolve()" />
            </div>
            <i18n-t
                v-else-if="phase !== 'running'"
                key="hint" keypath="timer.hint" tag="div" class="timer-hint mt-6" scope="global">
                <template #key>
                    <kbd>{{ t('timer.hintKey') }}</kbd>
                </template>
            </i18n-t>
        </Transition>
    </v-card>
</template>

<script setup lang="ts">
import type { Type, Solve, Penalty } from '~/stores/db/solves';

const { t } = useI18n()

const props = defineProps<{
    lastSolve?: Solve
    type: Type
    puzzle: string
    sessionId: number
    trainingAlgorithmId?: string
    scramble: string
}>()
const emits = defineEmits<{
    (e: 'solve', solve: Solve): void
    (e: 'start' | 'stop' | 'delete'): void
    (e: 'penalty', penalty: Penalty): void
}>()

// Quick-adjust controls for the just-finished solve (below the time).
const showActions = computed(() => phase.value === 'idle' && !!props.lastSolve)

function blurActive() {
  (document.activeElement as HTMLElement | null)?.blur()
}
function setPenalty(penalty: Penalty) {
  emits('penalty', penalty)
  blurActive()
}
function deleteSolve() {
  emits('delete')
  blurActive()
}

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
  if (phase.value === 'ready') return 'text-success'
  if (phase.value === 'holding') return 'text-warning'
  return 'text-high-emphasis'
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
  emits('solve', { ms, scramble: props.scramble, penalty: 'none', createdAt: Date.now(), type: props.type, puzzle: props.puzzle, sessionId: props.sessionId, trainingAlgorithmId: props.trainingAlgorithmId?? '' })
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
  min-height: 340px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.timer-surface.is-holding {
  border-color: rgba(var(--v-theme-warning), 0.55);
  background-color: rgba(var(--v-theme-warning), 0.04);
}

.timer-surface.is-ready {
  border-color: rgba(var(--v-theme-success), 0.7);
  background-color: rgba(var(--v-theme-success), 0.06);
  box-shadow: 0 0 44px rgba(var(--v-theme-success), 0.18);
}

.timer-surface.is-running {
  border-color: rgba(var(--v-theme-primary), 0.35);
}

.timer-value {
  font-size: clamp(3.5rem, 15vw, 10rem);
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  transition: color 0.12s ease, transform 0.18s ease;
}

.is-ready .timer-value {
  transform: scale(1.04);
}

.timer-hint {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}

.timer-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

kbd {
  background: rgba(var(--v-theme-on-surface), 0.1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: inherit;
  font-size: 0.82em;
  font-weight: 600;
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.15s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}
</style>