<template>
    <v-select v-model="model" :label="t('puzzle.label')" :items="items" hide-details item-title="title"
        item-value="value" item-icon="icon">
        <template #selection="{ item }">
            <v-icon class="mr-2" v-if="item">
                <IconPuzzle :puzzle-id="item.value" />
            </v-icon>
            <span>{{ item.title }}</span>
        </template>
        <template #item="{ item, props: attrs }">
            <v-list-item v-bind="attrs">
                <template #prepend>
                    <v-icon>
                        <IconPuzzle :puzzle-id="item.value" />
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
const props = defineProps<{
    showAllOption?: boolean
}>()

const model = defineModel<string>()

const { t } = useI18n()

const { data: puzzles } = await useApiGetPuzzles().useAsyncData()

type Item = {
    value: string
    title: string
}

const items = computed<Item[]>(() => {
    const all: Item[] = puzzles.value?.map((cube) => {
        return {
            value: cube.id,
            title: cube.name
        }
    }) ?? []
    if (props.showAllOption) {
        all.unshift({
            title: t('puzzle.all'),
            value: ALL_PUZZLES,
        })
    }
    return all
})
</script>