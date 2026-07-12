<template>
  <v-card
    class="training-card d-flex flex-column h-100"
    rounded="lg"
    border
    flat
  >
    <div class="training-card__image pa-3 d-flex align-center justify-center">
      <nuxt-img
:src="algorithm.imageUrl"
        :alt="t(algorithm.nameKey)"
        width="200"
        class="rounded-lg aspect-ratio-1-1" />
    </div>

    <div class="pa-4 pt-2 d-flex flex-column flex-fill">
      <h3 class="text-title-medium font-weight-bold mb-2">{{ t(algorithm.nameKey) }}</h3>

      <div class="d-flex flex-column ga-1 mb-4">
        <code
          v-for="(solve, i) in algorithm.solves"
          :key="i"
          class="training-card__solve text-body-large text-on-surface px-2 py-1 rounded"
        >
          {{ solve }}
        </code>
      </div>

      <div class="d-flex align-center justify-end ga-2 mt-auto">
        <v-btn
          icon="mdi-cart-outline"
          variant="tonal"
          size="small"
          aria-label="Adicionar à lista"
          @click="$emit('add-to-list', algorithm)"
        />
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-play"
          @click="$emit('train', algorithm)"
        >
          Treinar
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { TrainingAlgorithm } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()

defineProps<{
  algorithm: TrainingAlgorithm
}>()
defineEmits<{
  (e: 'train' | 'add-to-list', algorithm: TrainingAlgorithm): void
}>()
</script>

<style scoped lang="scss">
@use '../../assets/mixins' as mixins;
@use '../../assets/variables' as vars;

.training-card {
  @include mixins.hover-primary-border;
}

.training-card__image {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.training-card__solve {
  font-family: vars.$font-family-mono;
  background: rgba(var(--v-theme-primary), 0.08);
  white-space: normal;
  word-break: break-word;
}

.aspect-ratio-1-1{
  aspect-ratio: 1/1;
}
</style>
