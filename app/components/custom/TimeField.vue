<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom start">
        <template #activator="{ props: activator }">
            <v-text-field
                v-bind="activator" :model-value="model" :label="label" readonly
                prepend-inner-icon="mdi-clock-outline" hide-details />
        </template>
        <v-time-picker
            :model-value="model" format="24hr" hide-header @update:model-value="model = $event ?? undefined"
            @update:minute="menu = false" />
    </v-menu>
</template>

<script setup lang="ts">
defineProps<{
    label?: string
}>()

// Model is a `HH:MM` string (24h).
const model = defineModel<string>()

const menu = ref(false)
</script>
