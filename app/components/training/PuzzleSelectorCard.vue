<template>
    <v-card
        class="puzzle-card d-flex flex-column h-100 rounded-xl overflow-hidden"
        :class="{ 'puzzle-card--disabled': props.disabled }"
        border
        :ripple="false"
    >
        <div class="puzzle-card__media d-flex align-center justify-center">
            <span
                v-if="props.badge"
                class="puzzle-card__badge d-inline-flex align-center ga-1 text-body-small font-weight-medium"
            >
                <v-icon size="13" :icon="props.badgeIcon ?? 'mdi-cube-outline'" />
                {{ props.badge }}
            </span>

            <nuxt-img
                v-if="props.imageUrl"
                :src="props.imageUrl"
                :alt="props.title"
                :aspect-ratio="1"
                height="300"
                width="300"
                class="puzzle-card__img d-block"
            />
            <component
                :is="props.icon"
                v-else-if="props.icon"
                class="puzzle-card__icon"
            />
        </div>

        <div class="puzzle-card__body d-flex flex-column ga-2 pa-4">
            <div class="d-flex align-center justify-space-between ga-3">
                <div class="text-title-medium font-weight-bold text-truncate">{{ props.title }}</div>

                <span class="puzzle-card__arrow d-inline-flex align-center justify-center flex-shrink-0 rounded-circle">
                    <v-icon
                        size="20"
                        :icon="props.disabled ? 'mdi-lock-outline' : 'mdi-arrow-right'"
                    />
                </span>
            </div>

            <p
                v-if="props.meta"
                class="puzzle-card__meta text-body-medium text-medium-emphasis mb-0"
            >
                {{ props.meta }}
            </p>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
    title: string,
    imageUrl?: string,
    icon?: Component,
    meta?: string,
    badge?: string,
    badgeIcon?: string,
    disabled?: boolean,
}>()
</script>

<style lang="scss" scoped>
@use '../../assets/mixins' as mixins;

.puzzle-card {
    cursor: pointer;
    @include mixins.hover-primary-border;

    &:hover:not(.puzzle-card--disabled) {
        .puzzle-card__arrow {
            background: rgb(var(--v-theme-primary));
            color: rgb(var(--v-theme-on-primary));
            transform: translateX(2px);
        }

        .puzzle-card__img {
            transform: scale(1.05);
        }
    }
}

.puzzle-card--disabled {
    cursor: default;
    opacity: 0.55;
}

.puzzle-card__media {
    position: relative;
    aspect-ratio: 1 / 1;
    background:
        radial-gradient(130% 100% at 50% -10%, rgba(var(--v-theme-primary), 0.18), transparent 65%),
        rgba(var(--v-theme-on-surface), 0.035);
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.puzzle-card__badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 3px 9px 3px 7px;
    border-radius: 999px;
    color: rgba(var(--v-theme-on-surface), 0.85);
    background: rgba(var(--v-theme-surface), 0.72);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    backdrop-filter: blur(6px);
    z-index: 1;
}

.puzzle-card__img {
    transition: transform 0.3s ease;
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
}

.puzzle-card__icon {
    width: 40%;
    height: 40%;
    color: rgba(var(--v-theme-on-surface), 0.65);
}

.puzzle-card__body {
    flex: 1 1 auto;
    background: rgb(var(--v-theme-surface));
}

.puzzle-card__meta {
    line-height: 1.4;
}

.puzzle-card__arrow {
    width: 36px;
    height: 36px;
    color: rgba(var(--v-theme-on-surface), 0.7);
    background: rgba(var(--v-theme-on-surface), 0.06);
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
</style>
