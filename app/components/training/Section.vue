<template>
  <section class="training-section mb-10">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <h2 class="text-headline-small font-weight-bold mb-0">{{ setName }}</h2>
        <p v-if="setDescription" class="text-body-2 text-medium-emphasis mb-0">
          {{ setDescription }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-play"
        rounded="pill"
        @click="$emit('train-set', set)"
      >
        {{ t('training.trainAll', { set: setName }) }}
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
        <TrainingAlgorithmCard
          :algorithm="algorithm"
          :selected="selectedIds?.has(algorithm.id)"
          @train="$emit('train', $event)"
          @add-to-list="$emit('add-to-list', $event)"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import type { TrainingAlgorithm, TrainingSet } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()

const props = defineProps<{
  set: TrainingSet
  selectedIds?: Set<string>
}>()

// Sets carry either an i18n `nameKey`/`descriptionKey` or a literal `name`/`description`.
const setName = computed(() => props.set.nameKey ? t(props.set.nameKey) : props.set.name ?? '')
const setDescription = computed(() =>
  props.set.descriptionKey ? t(props.set.descriptionKey) : props.set.description ?? '',
)
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
