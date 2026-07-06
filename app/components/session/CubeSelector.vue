<template>
    <v-select v-model="model" :label="t('puzzle.label')" :items="items" hide-details />
</template>

<script setup lang="ts">
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';

const props = defineProps<{
    showAllOption?: boolean
}>()

const model = defineModel<string>()

const { t } = useI18n()

const items = computed(() => {
    const all = Object.entries(cubesDefinition).map(([, cube]) => {
        return {
            value: cube.id,
            title: t(`cube.${cube.id}`)
        }
    })
    if (props.showAllOption) {
        all.unshift({
            title: t('sessions.all'),
            value: 'all'
        })
    }
    return all
})
</script>