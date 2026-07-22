<template>
    <v-select
        v-model="model"
        :label="t('solve.type.label')"
        :items="items"
        :item-props="itemProps"
        hide-details />
</template>

<script setup lang="ts">
import type { Type } from '~/stores/db/solves'

const props = defineProps<{
    showAllOption?: boolean
}>()

const model = defineModel<Type | typeof ALL_TYPES>()

const { t } = useI18n()

type Item = {
    title: string
    value: string
    icon?: string
}

const items = computed<Item[]>(() => {
    const all: Item[] = [
        { title: t('solve.type.normal'), value: 'normal', icon: 'mdi-timer-outline' },
        { title: t('solve.type.training'), value: 'training', icon: 'mdi-school-outline' },
    ]

    if (props.showAllOption) {
        all.unshift({ title: t('solve.type.all'), value: ALL_TYPES })
    }

    return all
})

function itemProps(item: Item) {
    return { prependIcon: item.icon }
}
</script>
