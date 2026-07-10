<template>
    <v-dialog v-model="model" :max-width="440" :persistent="isImporting">
        <CustomCard :title="t('settings.data.import.title')" :subtitle="t('settings.data.import.subtitle')" icon="mdi-database-import-outline">
            <template #default>
                <AnimationExpand :model-value="isSelectingFile">
                    <v-file-input v-model="importFile" class="mt-1" :label="t('settings.data.import.action')" accept=".txt,text/plain,application/json,.json" :multiple="false"/>
                </AnimationExpand>

                <AnimationExpand :model-value="isImporting">
                    <div class="text-center">
                        <v-progress-circular indeterminate class="d-block mx-auto"/>
                        <div class="text-caption text-medium-emphasis mt-2">
                            {{ t('settings.data.import.progress', { count: importedCount, total: totalCount }) }}
                        </div>
                    </div>
                </AnimationExpand>

                <AnimationExpand :model-value="isFinished">
                    <v-alert v-if="!importErrorMessage" type="success">{{ t('settings.data.import.success', { count: importedCount }) }}</v-alert>
                    <v-alert v-else-if="importErrorMessage" type="error">{{ importErrorMessage }}</v-alert>
                </AnimationExpand>

            </template>

            <template #actions>
                <v-btn color="btn" :disabled="isImporting" @click="model = false">{{ isFinished? t('settings.close') : t('settings.cancel') }}</v-btn>
                <v-btn v-if="!isFinished" :loading="isImporting" @click="nextStep">{{ t('settings.data.import.action') }}</v-btn>
            </template>
        </CustomCard>
    </v-dialog>
</template>

<script setup lang="ts">
import { InvalidBackupFileError } from '~/stores/migration'

const { t } = useI18n()

const model = defineModel<boolean>('modelValue', {
    default: false,
})

enum steps {
    selectFile,
    importing,
    finished
}

const importFile = ref<File | null>(null)
const importStep = ref(steps.selectFile)
const importedCount = ref(0)
const totalCount = ref(0)
const importErrorMessage = ref<string|undefined>(undefined)
const migration = useMigrationStore()

const isSelectingFile = computed(() => importStep.value === steps.selectFile)
const isImporting = computed(() => importStep.value === steps.importing)
const isFinished = computed(() => importStep.value === steps.finished)

async function importData() {
  if (!importFile.value) return
  importedCount.value = 0
  totalCount.value = 0
  try {
    await migration.importAll(importFile.value, {
      onProgress: (imported, total) => { importedCount.value = imported; totalCount.value = total },
    })
  } catch (err) {
    console.error(err)
    importErrorMessage.value = err instanceof InvalidBackupFileError
      ? t('settings.data.import.invalidFile')
      : t('settings.data.import.error')
  }
}

async function nextStep() {
    if (importStep.value === steps.selectFile) {
        importStep.value = steps.importing
        await importData()
        importStep.value = steps.finished
    }
}

async function reset() {
    importStep.value = steps.selectFile
    importFile.value = null
    importedCount.value = 0
    totalCount.value = 0
    importErrorMessage.value = undefined
}

watch(model, (newValue) => {
    if (!newValue) {
        reset()
    }
})
</script>