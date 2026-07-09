<template>
    <div class="theme-preview rounded-lg" :style="{ background: colors.background }">
        <div class="theme-preview__bar" :style="{ background: colors.surface }">
            <span class="theme-preview__dot" :style="{ background: colors.primary }" />
        </div>
        <div class="theme-preview__lines">
            <span :style="{ background: colors.surface }" style="width: 70%" />
            <span :style="{ background: colors.surface }" style="width: 45%" />
            <span :style="{ background: colors.primary }" style="width: 30%" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    /** Theme colors to preview; expects `background`, `surface` and `primary`. */
    colors: Record<string, string>
}>()
</script>

<style scoped>
.theme-preview {
    height: 84px;
    padding: 8px;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.15);
}

.theme-preview__bar {
    display: flex;
    align-items: center;
    height: 18px;
    border-radius: 5px;
    padding: 0 6px;
    margin-bottom: 8px;
}

.theme-preview__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.theme-preview__lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.theme-preview__lines span {
    height: 7px;
    border-radius: 4px;
    opacity: 0.9;
}
</style>
