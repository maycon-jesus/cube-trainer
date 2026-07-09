<template>
    <v-dialog v-model="model" :max-width="440" :persistent="isExporting">
        <CustomCard :title="t('settings.data.export.title')" :subtitle="t('settings.data.export.subtitle')" icon="mdi-database-export-outline">
            <template #default>
                <AnimationExpand :model-value="isNaming">
                    <v-text-field
                        v-model="filename"
                        class="mt-1"
                        :label="t('settings.data.filename.label')"
                        suffix=".json"
                        :rules="[(v: string) => !!v.trim() || t('settings.data.filename.required')]"
                    />
                </AnimationExpand>

                <AnimationExpand :model-value="isExporting">
                    <v-progress-circular indeterminate class="d-block mx-auto"/>
                </AnimationExpand>

                <AnimationExpand :model-value="isFinished">
                    <v-alert type="success">{{ t('settings.data.export.success') }}</v-alert>
                </AnimationExpand>
            </template>

            <template #actions>
                <v-btn color="btn" :disabled="isExporting" @click="model = false">{{ isFinished ? t('settings.close') : t('settings.cancel') }}</v-btn>
                <v-btn v-if="!isFinished" :loading="isExporting" :disabled="!filename.trim()" @click="nextStep">{{ t('settings.data.export.action') }}</v-btn>
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
    finished
}

const filename = ref('cube-trainer-export')
const exportStep = ref(steps.naming)
const migration = useMigrationStore()

const isNaming = computed(() => exportStep.value === steps.naming)
const isExporting = computed(() => exportStep.value === steps.exporting)
const isFinished = computed(() => exportStep.value === steps.finished)

async function nextStep() {
    if (exportStep.value === steps.naming && filename.value.trim()) {
        exportStep.value = steps.exporting
        await migration.exportAll(filename.value.trim())
        exportStep.value = steps.finished
    }
}

function reset() {
    exportStep.value = steps.naming
    filename.value = 'cube-trainer-export'
}

watch(model, (newValue) => {
    if (!newValue) {
        reset()
    }
})
</script>
