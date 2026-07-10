<template>
    <v-select
        v-model="model"
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
import { useSessionsStore } from '~/stores/db/sessions';

const props = defineProps<{
    excludedIds?: number[]
    showAllOption?: boolean
}>()

const model = defineModel<number>()

const { t } = useI18n()
const sessionStore = useSessionsStore()

const openCreateDialog = ref(false)
const items = computed(() => {
    const all = sessionStore.sessions.map(it => {
        return {
            title: it.name,
            value: it.id
        }
    }).filter(it => it.value && !props.excludedIds?.includes(it.value))

    if (props.showAllOption) {
        all.unshift({
            title: t('sessions.all'),
            value: ALL_SESSIONS
        })
    }

    return all
})
</script>
