<template>
    <v-select
v-model="model" :label="t('puzzle.label')" :items="items" hide-details item-title="title"
        item-value="value" item-icon="icon">
        <template #selection="{item}">
            <v-icon v-if="item.icon" class="mr-2"><component :is="item.icon"/></v-icon>
            <span>{{ item.title }}</span>
        </template>
        <template #item="{ item, props: attrs }">
            <v-list-item v-bind="attrs">
                <template v-if="item.icon" #prepend>
                    <v-icon>
                        <component :is="item.icon" />
                    </v-icon>
                </template>
                <template #title>
                    {{ item.title }}
                </template>
            </v-list-item>
        </template>
    </v-select>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';

const props = defineProps<{
    showAllOption?: boolean
}>()

const model = defineModel<string>()

const { t } = useI18n()

type Item = {
    value: string
    title: string
    icon?: Component
}

const items = computed<Item[]>(() => {
    const all: Item[] = Object.entries(cubesDefinition).map(([, cube]) => {
        return {
            value: cube.id,
            title: t(`cube.${cube.id}`),
            icon: cube.icon
        }
    })
    if (props.showAllOption) {
        all.unshift({
            title: t('puzzle.all'),
            value: 'all',
            icon: undefined
        })
    }
    return all
})
</script>