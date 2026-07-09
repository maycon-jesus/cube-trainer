<template>
    <CustomCard :title="t('settings.data.title')" :subtitle="t('settings.data.subtitle')" icon="mdi-database-outline">
        <SettingsDialogImport v-model="importDialog" />
        <SettingsDialogExport v-model="exportDialog" />
        <SettingsDialogResetData v-model="resetDialog" />

        <div class="d-flex flex-column ga-3">
            <div
                v-for="action in transferActions"
                :key="action.key"
                class="data-row d-flex align-center ga-4 pa-3 rounded-lg"
            >
                <v-avatar :color="action.color" variant="tonal" rounded="lg" size="44">
                    <v-icon :icon="action.icon" />
                </v-avatar>

                <div class="flex-grow-1">
                    <div class="text-body-1 font-weight-medium">{{ t(action.title) }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ t(action.subtitle) }}</div>
                </div>

                <v-btn
                    variant="elevated"
                    rounded="xl"
                    :color="action.color"
                    :prepend-icon="action.icon"
                    @click="action.open"
                >
                    {{ t(action.label) }}
                </v-btn>
            </div>
        </div>

        <v-divider class="my-5" />

        <div class="danger-zone d-flex align-center ga-4 pa-4 rounded-lg">
            <v-avatar color="error" variant="tonal" rounded="lg" size="44">
                <v-icon icon="mdi-alert-outline" />
            </v-avatar>

            <div class="flex-grow-1">
                <div class="text-body-1 font-weight-medium text-error">{{ t('settings.data.reset.action') }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ t('settings.data.reset.description') }}</div>
            </div>

            <v-btn
                color="error"
                variant="text"
                rounded="xl"
                prepend-icon="mdi-delete-outline"
                @click="resetDialog = true"
            >
                {{ t('settings.data.reset.action') }}
            </v-btn>
        </div>
    </CustomCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { t } = useI18n()
const importDialog = ref(false)
const exportDialog = ref(false)
const resetDialog = ref(false)

const transferActions = [
    {
        key: 'import',
        icon: 'mdi-database-import-outline',
        color: 'primary',
        title: 'settings.data.import.title',
        subtitle: 'settings.data.import.subtitle',
        label: 'settings.data.import.action',
        open: () => { importDialog.value = true },
    },
    {
        key: 'export',
        icon: 'mdi-database-export-outline',
        color: 'primary',
        title: 'settings.data.export.title',
        subtitle: 'settings.data.export.subtitle',
        label: 'settings.data.export.action',
        open: () => { exportDialog.value = true },
    },
]
</script>

<style scoped>
.data-row {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-theme-on-surface), 0.02);
}

.danger-zone {
    border: 1px solid rgba(var(--v-theme-error), 0.35);
    background: rgba(var(--v-theme-error), 0.04);
}

@media (max-width: 599px) {
    .data-row,
    .danger-zone {
        flex-direction: column;
        text-align: center;
    }

    .data-row .v-btn,
    .danger-zone .v-btn {
        width: 100%;
    }
}
</style>
