<template>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold mb-0">{{ props.title }}</h1>
                <p v-if="props.subtitle" class="text-body-2 text-medium-emphasis mb-0">{{ props.subtitle }}</p>
            </div>

            <slot name="append" />
        </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle?: string
}>()
</script>