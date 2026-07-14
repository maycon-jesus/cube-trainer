<template>
    <v-card
        class="puzzle-card d-flex flex-column h-100 rounded-xl overflow-hidden"
        border
        :ripple="false"
    >
        <div class="puzzle-card__media">
            <nuxt-img
                :src="props.imageUrl"
                :alt="props.title"
                :aspect-ratio="1"
                height="300"
                width="300"
                class="puzzle-card__img d-block"
            />
        </div>

        <div class="puzzle-card__body d-flex align-center justify-space-between ga-2 pa-4">
            <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold text-truncate">{{ props.title }}</div>
                <div
                    v-if="props.sets"
                    class="puzzle-card__meta text-caption text-medium-emphasis d-flex align-center ga-1"
                >
                    <v-icon size="14" icon="mdi-cards-outline" />
                    <span>{{ props.sets }}</span>
                </div>
            </div>

            <v-icon class="puzzle-card__arrow" icon="mdi-arrow-right" />
        </div>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string,
    imageUrl: string,
    sets?: string
}>()
</script>

<style lang="scss" scoped>
@use '../../assets/mixins' as mixins;

.puzzle-card {
    cursor: pointer;
    @include mixins.hover-primary-border;

    &:hover .puzzle-card__arrow {
        transform: translateX(3px);
        color: rgb(var(--v-theme-primary));
    }

    &:hover .puzzle-card__img {
        transform: scale(1.04);
    }
}

.puzzle-card__media {
    background:
        radial-gradient(120% 90% at 50% 0%, rgba(var(--v-theme-primary), 0.14), transparent 70%),
        rgba(var(--v-theme-on-surface), 0.04);
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.puzzle-card__img {
    transition: transform 0.25s ease;
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
}

.puzzle-card__body {
    background: rgb(var(--v-theme-surface));
}

.min-w-0 {
    min-width: 0;
}

.puzzle-card__arrow {
    flex-shrink: 0;
    transition: transform 0.2s ease, color 0.2s ease;
}
</style>
