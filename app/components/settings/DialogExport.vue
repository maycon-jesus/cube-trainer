<template>
    <v-dialog v-model="model" :max-width="440" :persistent="isExporting">
        <CustomCard :title="t('settings.data.export.title')" :subtitle="t('settings.data.export.subtitle')" icon="mdi-database-export-outline">
            <template #default>
                <AnimationExpand :model-value="isNaming">
                    <v-text-field
                        v-model="filename"
                        class="mt-1"
                        :label="t('settings.data.filename.label')"
                        suffix=".txt"
                        :rules="[(v: string) => !!v.trim() || t('settings.data.filename.required')]"
                    />
                </AnimationExpand>

                <AnimationExpand :model-value="isExporting">
                    <div class="text-center">
                        <v-progress-circular indeterminate class="d-block mx-auto"/>
                        <div class="text-caption text-medium-emphasis mt-2">
                            {{ t('settings.data.export.progress', { count: exportedCount, total: totalCount }) }}
                        </div>
                    </div>
                </AnimationExpand>

                <AnimationExpand :model-value="isFinished">
                    <v-alert type="success">{{ t('settings.data.export.success', { count: exportedCount }) }}</v-alert>
                </AnimationExpand>

                <AnimationExpand :model-value="isError">
                    <v-alert type="error">{{ t('settings.data.export.error') }}</v-alert>
                </AnimationExpand>
            </template>

            <template #actions>
                <v-btn color="btn" :disabled="isExporting" @click="model = false">{{ isFinished || isError ? t('settings.close') : t('settings.cancel') }}</v-btn>
                <v-btn v-if="!isFinished" :loading="isExporting" :disabled="!filename.trim()" @click="nextStep">{{ isError ? t('settings.data.export.retry') : t('settings.data.export.action') }}</v-btn>
            </template>
        </CustomCard>
    </v-dialog>
</template>

<script setup lang="ts">
const { t } = useI18n()

const model = defineModel<boolean>('modelValue', {
    default: false,
})

enum steps {
    naming,
    exporting,
    finished,
    error
}

const filename = ref('cube-trainer-export')
const exportStep = ref(steps.naming)
const exportedCount = ref(0)
const totalCount = ref(0)
const migration = useMigrationStore()

const isNaming = computed(() => exportStep.value === steps.naming)
const isExporting = computed(() => exportStep.value === steps.exporting)
const isFinished = computed(() => exportStep.value === steps.finished)
const isError = computed(() => exportStep.value === steps.error)

async function nextStep() {
    if ((isNaming.value || isError.value) && filename.value.trim()) {
        exportStep.value = steps.exporting
        exportedCount.value = 0
        totalCount.value = 0
        try {
            const written = await migration.exportAll(filename.value.trim(), {
                onProgress: (exported, total) => { exportedCount.value = exported; totalCount.value = total },
            })
            // `false` = user dismissed the browser's save dialog; go back to naming.
            exportStep.value = written ? steps.finished : steps.naming
        } catch (err) {
            console.error(err)
            exportStep.value = steps.error
        }
    }
}

function reset() {
    exportStep.value = steps.naming
    exportedCount.value = 0
    totalCount.value = 0
    filename.value = 'cube-trainer-export'
}

watch(model, (newValue) => {
    if (!newValue) {
        reset()
    }
})
</script>
