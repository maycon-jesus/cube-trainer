<template>
  <v-dialog v-model="model" :max-width="440" :persistent="isResetting">
    <CustomCard :title="t('confirmTitle')" icon="mdi-alert-outline" icon-color="error">
      <template #default>
        <AnimationExpand :model-value="isConfirming">
          <span class="text-body-2 text-medium-emphasis">
            {{ t('confirmText') }}
          </span>
        </AnimationExpand>

        <AnimationExpand :model-value="isResetting">
          <v-progress-circular indeterminate class="d-block mx-auto" />
        </AnimationExpand>

        <AnimationExpand :model-value="isFinished">
          <v-alert v-if="!resetErrorMessage" type="success">{{ t('success') }}</v-alert>
          <v-alert v-else type="error">{{ resetErrorMessage }}</v-alert>
        </AnimationExpand>
      </template>

      <template #actions>
        <v-btn color="btn" :disabled="isResetting" @click="model = false">
          {{ isFinished ? t('close') : t('cancel') }}
        </v-btn>
        <v-btn
          v-if="!isFinished"
          color="error"
          variant="flat"
          :loading="isResetting"
          @click="confirmReset"
        >
          {{ t('confirm') }}
        </v-btn>
      </template>
    </CustomCard>
  </v-dialog>
</template>

<script setup lang="ts">
const { t } = useI18n()
const migration = useMigrationStore()

const model = defineModel<boolean>({ default: false })

enum steps {
  confirming,
  resetting,
  finished,
}

const resetStep = ref(steps.confirming)
const resetErrorMessage = ref<string | undefined>(undefined)

const isConfirming = computed(() => resetStep.value === steps.confirming)
const isResetting = computed(() => resetStep.value === steps.resetting)
const isFinished = computed(() => resetStep.value === steps.finished)

async function confirmReset() {
  resetStep.value = steps.resetting
  try {
    await migration.resetAndLoad()
    resetErrorMessage.value = undefined
  } catch (err) {
    console.error(err)
    resetErrorMessage.value = t('error')
  } finally {
    resetStep.value = steps.finished
  }
}

function reset() {
  resetStep.value = steps.confirming
  resetErrorMessage.value = undefined
}

watch(model, (newValue) => {
  if (!newValue) {
    reset()
  }
})
</script>

<i18n src="./DialogResetData.i18n.json"></i18n>
