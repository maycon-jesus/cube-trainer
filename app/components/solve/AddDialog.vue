<template>
    <v-dialog v-model="model" max-width="420">
        <CustomCard :title="t('timer.solves.add.title')">
            <v-form @submit.prevent="submit()">
                <v-text-field
v-model="displayTime" :label="t('timer.solves.add.time')" placeholder="0.00"
                    inputmode="numeric" :hint="t('timer.solves.add.timeHint')" persistent-hint autofocus
                    class="time-input" />
                <v-text-field
v-model="scramble" :label="t('timer.solves.add.scramble')"
                    :placeholder="t('timer.solves.add.scramblePlaceholder')" class="mt-2" />
                <v-btn-toggle v-model="penalty" mandatory density="comfortable" color="primary" class="mt-2">
                    <v-btn value="none">{{ t('timer.solves.add.penaltyNone') }}</v-btn>
                    <v-btn value="+2">+2</v-btn>
                    <v-btn value="dnf">DNF</v-btn>
                </v-btn-toggle>
                <v-row v-if="editable" density="compact" class="mt-2">
                    <v-col cols="6">
                        <CustomDateField v-model="dateStr" :label="t('timer.solves.add.date')" />
                    </v-col>
                    <v-col cols="6">
                        <CustomTimeField v-model="timeStr" :label="t('timer.solves.add.clock')" />
                    </v-col>
                    <v-col cols="12">
                        <SessionSelector v-model="localSessionId" />
                    </v-col>
                    <v-col cols="12">
                        <CubeSelector v-model="localPuzzle" />
                    </v-col>
                </v-row>
            </v-form>
            <template #actions>
                <v-spacer />
                <v-btn variant="text" @click="model = false">{{ t('timer.solves.add.cancel') }}</v-btn>
                <v-btn color="primary" variant="flat" :disabled="!canSubmit" @click="submit()">{{ t('timer.solves.add.confirm') }}</v-btn>
            </template>
        </CustomCard>
    </v-dialog>
</template>

<script setup lang="ts">
import { useSolvesStore, type Penalty, type Type } from '~/stores/db/solves';
import SessionSelector from '~/components/session/SessionSelector.vue'
import CubeSelector from '~/components/session/CubeSelector.vue'

const props = defineProps<{
    sessionId: number
    puzzle: string
    type: Type
    trainingAlgorithmId?: string
    editable?: boolean
}>()

const emits = defineEmits<{
    (e: 'added'): void
}>()

const model = defineModel<boolean>()

const { t } = useI18n()
const solvesStore = useSolvesStore()

const digits = ref('')
const scramble = ref('')
const penalty = ref<Penalty>('none')
const localSessionId = ref(props.sessionId)
const localPuzzle = ref(props.puzzle)
const dateStr = ref('')
const timeStr = ref('')

// Timer-style mask: digits fill from the right (cc, ss, mm), formatted live.
const displayTime = computed({
  get: () => formatTimeDigits(digits.value),
  set: (value: string) => {
    digits.value = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 7)
  },
})

const ms = computed(() => parseTimeToMs(displayTime.value) || 0)

const createdAt = computed(() => {
  if (!props.editable) return Date.now()
  const parsed = new Date(`${dateStr.value}T${timeStr.value}`).getTime()
  return Number.isNaN(parsed) ? Date.now() : parsed
})

const canSubmit = computed(() => {
  if (!ms.value) return false
  if (!props.editable) return true
  return !!localSessionId.value && !!localPuzzle.value && !Number.isNaN(new Date(`${dateStr.value}T${timeStr.value}`).getTime())
})

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

watch(model, (open) => {
  if (!open) return
  digits.value = ''
  scramble.value = ''
  penalty.value = 'none'
  localSessionId.value = props.sessionId
  localPuzzle.value = props.puzzle
  const now = new Date()
  dateStr.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  timeStr.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`
})

async function submit() {
  if (!canSubmit.value) return
  await solvesStore.add({
    ms: ms.value,
    scramble: scramble.value.trim(),
    penalty: penalty.value,
    createdAt: createdAt.value,
    puzzle: props.editable ? localPuzzle.value : props.puzzle,
    type: props.type,
    sessionId: props.editable ? localSessionId.value : props.sessionId,
    trainingAlgorithmId: props.trainingAlgorithmId ?? '',
  })
  model.value = false
  emits('added')
}
</script>

<style scoped>
.time-input :deep(input) {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}
</style>
