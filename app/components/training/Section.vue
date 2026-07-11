<template>
  <section class="training-section mb-10">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <h2 class="text-headline-small font-weight-bold mb-0">{{ set.name }}</h2>
        <p v-if="set.description" class="text-body-2 text-medium-emphasis mb-0">
          {{ set.description }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-play"
        rounded="pill"
      >
        Treinar todos {{ set.name }}
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="algorithm in set.algorithms"
        :key="algorithm.name"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <TrainingAlgorithmCard :algorithm="algorithm" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import type { TrainingSet } from '~~/lib/cube/cubesDefinition';

defineProps<{
  set: TrainingSet
}>()
</script>

<style scoped>
.training-section {
  scroll-margin-top: 80px;
}
</style>
