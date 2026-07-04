<template>
    <v-dialog v-model="model" max-width="440">
      <v-card>
        <v-card-item>
          <template #prepend>
            <v-icon :icon="formMode === 'create' ? 'mdi-plus-circle-outline' : 'mdi-pencil-outline'" color="primary" />
          </template>
          <v-card-title>
            {{ formMode === 'create' ? t('sessions.new') : t('sessions.rename') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-text-field
v-model="formName" :label="t('sessions.nameLabel')" variant="outlined" autofocus
            hide-details @keyup.enter="submitForm" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn :disabled="saving" @click="model = false">
            {{ t('sessions.cancel') }}
          </v-btn>
          <v-btn
color="primary" variant="flat" :loading="saving" :disabled="!formName.trim()"
            @click="submitForm">
            {{ formMode === 'create' ? t('sessions.create') : t('sessions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore, type Session } from '~/stores/db/sessions';

const model = defineModel<boolean>()

const props = defineProps<{
  formMode: 'create' | 'rename'
  session: Session|null
}>()
const emits = defineEmits<{
  (e: 'updated'): void
}>()

const {t} = useI18n()
const sessionStore = useSessionsStore()
const configStore = useConfigStore()

const formName = ref(props.session?.name ?? '')
const saving = ref(false)

async function submitForm() {
    saving.value = true
    if (props.formMode === 'create') {
        const id = await sessionStore.add(formName.value)
        configStore.sessionId = id
    } else if (props.formMode === 'rename' && props.session) {
        await sessionStore.update({ ...props.session, name: formName.value })
    }
    saving.value = false
    model.value = false
    emits('updated')
}

watch(() => props.session, ()=>{
    formName.value = props.session?.name ?? ''
})
</script>