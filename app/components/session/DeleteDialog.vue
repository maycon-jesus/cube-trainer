<template>
  <v-dialog v-model="model" max-width="440" persistent>
    <v-card>
      <v-card-item>
        <template #prepend>
          <v-icon icon="mdi-alert-outline" color="error" />
        </template>
        <v-card-title>{{ t('sessions.deleteConfirmTitle') }}</v-card-title>
      </v-card-item>
      <v-card-text class="text-body-2 text-medium-emphasis">
        {{ t(moveSolves ? 'sessions.deleteConfirmTextMove' : 'sessions.deleteConfirmText', { name: target?.name ?? '' }) }}
        <v-row density="comfortable">
          <v-col cols="12">
            <v-switch v-model="moveSolves" :label="t('sessions.moveSolves')" hide-details />
          </v-col>
        </v-row>
        <animation-expand v-model="moveSolves">
          <v-row density="comfortable" class="pt-2">
            <v-col cols="12">
              <session-selector v-model="sessionSelected" :excluded-ids="target && target.id ? [target.id] : []" />
            </v-col>
          </v-row>
        </animation-expand>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn :disabled="deleting" @click="model = false">
          {{ t('sessions.cancel') }}
        </v-btn>
        <v-btn color="error" variant="flat" rounded="xl" :loading="deleting" @click="confirmDelete">
          {{ t('sessions.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSessionsStore, type Session } from '~/stores/db/sessions';
import SessionSelector from './SessionSelector.vue';


const props = defineProps<{
  target: Session | null
}>()

const model = defineModel<boolean>()

const emits = defineEmits<{
  (e: 'updated'): void
}>()

const { t } = useI18n()
const sessionStore = useSessionsStore()

const deleting = ref(false)
const moveSolves = ref(false)
const sessionSelected = ref<number | undefined>(undefined)

const moveSolvesToSessionId = computed(() => {
  if (moveSolves.value) {
    return sessionSelected.value
  }
  return null
})

async function confirmDelete() {
  const target = props.target
  if (!target || target.id === undefined) return
  deleting.value = true
  await sessionStore.remove(target.id,moveSolvesToSessionId.value)
  deleting.value = false
  model.value = false
  emits('updated')
}
</script>