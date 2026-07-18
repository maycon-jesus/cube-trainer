<template>
    <div class="puzzle-grid">
        <template v-for="value in props.items" :key="value.value">
            <NuxtLink
                v-if="!value.disabled && value.path"
                :to="value.path"
                class="text-decoration-none"
            >
                <TrainingPuzzleSelectorCard
                    :title="value.title"
                    :image-url="value.imageUrl"
                    :icon="value.icon"
                    :meta="value.meta"
                    :badge="value.badge"
                    :badge-icon="value.badgeIcon"
                    @click="$emit('select', value.value)"
                />
            </NuxtLink>
            <TrainingPuzzleSelectorCard
                v-else
                :title="value.title"
                :image-url="value.imageUrl"
                :icon="value.icon"
                :meta="value.meta"
                :badge="value.badge"
                :badge-icon="value.badgeIcon"
                disabled
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

type Puzzle = {
    title: string,
    value: string,
    imageUrl?: string,
    icon?: Component,
    path?: string,
    meta?: string,
    badge?: string,
    badgeIcon?: string,
    disabled?: boolean,
}
const props = defineProps<{
    items: Puzzle[]
}>()
defineEmits<{
    (e: 'select', value: string): void
}>()
</script>

<style lang="scss" scoped>
.puzzle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

@media (max-width: 599px) {
    .puzzle-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 14px;
    }
}
</style>
