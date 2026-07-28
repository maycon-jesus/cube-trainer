<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom start">
        <template #activator="{ props: activator }">
            <v-text-field
                v-bind="activator" :model-value="display" :label="label" readonly
                prepend-inner-icon="mdi-calendar" hide-details />
        </template>
        <v-date-picker :model-value="dateValue" show-adjacent-months hide-header @update:model-value="onPick" />
    </v-menu>
</template>

<script setup lang="ts">
defineProps<{
    label?: string
}>()

// Model is a `YYYY-MM-DD` string (local date).
const model = defineModel<string>()

const { locale } = useI18n()
const menu = ref(false)

function pad(n: number) {
    return n.toString().padStart(2, '0')
}

const dateValue = computed(() => {
    if (!model.value) return undefined
    const [y, m, d] = model.value.split('-').map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
})

const display = computed(() => dateValue.value ? dateValue.value.toLocaleDateString(locale.value) : '')

function onPick(value: unknown) {
    const d = value as Date
    model.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    menu.value = false
}
</script>
