<template>
    <div class="puzzle-grid">
        <NuxtLink
            v-for="value in props.items"
            :key="value.value"
            :to="value.path"
            class="text-decoration-none"
        >
            <TrainingPuzzleSelectorCard
                :title="value.title"
                :image-url="value.imageUrl"
                :sets="value.sets"
                @click="$emit('select', value.value)"
            />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
type Puzzle = {
    title: string,
    value: string,
    imageUrl: string,
    path: string,
    sets?: string
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
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
}

@media (max-width: 599px) {
    .puzzle-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }
}
</style>
