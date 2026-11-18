<template>
  <section class="training-section mb-10">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <h2 class="text-headline-small font-weight-bold mb-0">{{ props.set.name }}</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ props.set.description }}
        </p>
      </div>
      <v-btn class="ms-auto" color="primary" variant="flat" prepend-icon="mdi-play" rounded="pill" @click="$emit('train-set', set)">
        {{ t('training.trainAll', { set: props.set.name }) }}
      </v-btn>
    </div>

    <v-row>
      <v-col v-for="algorithm in props.algorithms" :key="algorithm.id" cols="12" sm="6" lg="4" xl="3">
        <TrainingAlgorithmCard :algorithm="algorithm" :selected="selectedIds?.has(algorithm.id)"
          @train="$emit('train', $event)" @add-to-list="$emit('add-to-list', $event)" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  set: TrainingSet
  algorithms: TrainingSetAlgorithm[]
  selectedIds?: Set<string>
}>()

defineEmits<{
  (e: 'train' | 'add-to-list', algorithm: TrainingSetAlgorithm): void
  (e: 'train-set', set: TrainingSet): void
}>()
</script>

<style scoped>
.training-section {
  scroll-margin-top: 80px;
}
</style>
