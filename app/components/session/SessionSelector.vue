<template>
    <v-select
        v-model="configStore.sessionId"
        :label="t('session.label')"
        :items="items"
        hide-details
    >
    <template #append-item>
        <v-list-item @click="openCreateDialog=true">
            <template #prepend>
                <v-icon>mdi-plus</v-icon>
            </template>
            <v-list-item-title>{{ t('sessions.create') }}</v-list-item-title>
        </v-list-item>
    </template>
    </v-select>
    <session-create-rename-dialog v-model="openCreateDialog" form-mode="create" />
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore } from '~/stores/db/sessions';

const { t } = useI18n()
const sessionStore = useSessionsStore()
const configStore = useConfigStore()

const openCreateDialog = ref(false)
const items = computed(() => {
    return sessionStore.sessions.map(it => {
        return {
            title: it.name,
            value: it.id
        }
    })
})
</script>
