<template>
    <v-select
        :label="t('session.label')"
        :items="items"
        v-model="configStore.sessionId"
        hide-details
    />
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore } from '~/stores/db/sessions';

const { t } = useI18n()
const sessionStore = useSessionsStore()
const configStore = useConfigStore()
const items = computed(() => {
    return sessionStore.sessions.map(it => {
        return {
            title: it.name,
            value: it.id
        }
    })
})
</script>
