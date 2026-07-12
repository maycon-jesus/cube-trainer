<template>
  <section class="training-section mb-10">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <h2 class="text-headline-small font-weight-bold mb-0">{{ t(set.nameKey) }}</h2>
        <p v-if="set.descriptionKey" class="text-body-2 text-medium-emphasis mb-0">
          {{ t(set.descriptionKey) }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-play"
        rounded="pill"
        @click="$emit('train-set', set)"
      >
        Treinar todos {{ t(set.nameKey) }}
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="algorithm in set.algorithms"
        :key="algorithm.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <TrainingAlgorithmCard :algorithm="algorithm" @train="$emit('train', $event)" @add-to-list="$emit('add-to-list', $event)" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import type { TrainingAlgorithm, TrainingSet } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()

defineProps<{
  set: TrainingSet
}>()
defineEmits<{
  (e: 'train' | 'add-to-list', algorithm: TrainingAlgorithm): void
  (e: 'train-set', set: TrainingSet): void
}>()
</script>

<style scoped>
.training-section {
  scroll-margin-top: 80px;
}
</style>
