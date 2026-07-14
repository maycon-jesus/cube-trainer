<template>
  <v-card
    class="training-card d-flex flex-column h-100"
    :class="{ 'training-card--selected': selected }"
    rounded="lg"
    border
    flat
  >
    <div class="training-card__image pa-3 d-flex align-center justify-center">
      <nuxt-img
        :src="algorithm.imageUrl"
        :alt="algorithmName"
        width="200"
        height="200"
        class="rounded-lg aspect-ratio-1-1"
      />
    </div>

    <div class="pa-4 pt-2 d-flex flex-column flex-fill">
      <h3 class="text-title-medium font-weight-bold mb-2">{{ algorithmName }}</h3>

      <div class="d-flex flex-column ga-1 mb-2">
        <code
          v-for="(solve, i) in algorithm.solves"
          :key="i"
          class="training-card__solve text-body-large text-on-surface px-2 py-1 rounded"
        >
          {{ solve }}
        </code>
      </div>

      <div v-if="algorithm.setups.length" class="mb-4">
        <v-btn
          variant="text"
          size="small"
          color="on-surface"
          class="training-card__setup-toggle px-1 text-none"
          prepend-icon="mdi-cube-scan"
          :append-icon="showSetups ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="showSetups = !showSetups"
        >
          {{ setupLabel }}
        </v-btn>
        <AnimationExpand :model-value="showSetups">
          <div class="d-flex flex-column ga-1 pt-1">
            <code
              v-for="(setup, i) in algorithm.setups"
              :key="i"
              class="training-card__setup text-body-large text-on-surface px-2 py-1 rounded"
            >
              {{ setup }}
            </code>
          </div>
        </AnimationExpand>
      </div>

      <div class="mb-4">
        <div class="d-flex align-center justify-end mb-1 px-1">
          <span class="text-label-small text-medium-emphasis">
            {{ t('training.solveCount', caseSolves.length) }}
          </span>
        </div>
        <div class="d-flex flex-wrap ga-2">
          <div
            v-for="stat in statTiles"
            :key="stat.label"
            class="training-card__stat d-flex flex-column align-center px-3 py-1 rounded flex-fill"
          >
            <span class="training-card__stat-label text-label-small text-medium-emphasis">{{ stat.label }}</span>
            <span class="training-card__stat-value text-body-medium font-weight-bold">{{ formatMs(stat.value) }}</span>
          </div>
        </div>
      </div>

      <div class="d-flex align-center justify-end ga-2 mt-auto">
        <v-btn
          icon
          :variant="selected ? 'flat' : 'tonal'"
          :color="selected ? 'primary' : undefined"
          size="small"
          :aria-label="selected ? t('training.removeFromList') : t('training.addToList')"
          @click="$emit('add-to-list', algorithm)"
        >
          <v-icon :icon="selected ? 'mdi-playlist-check' : 'mdi-playlist-plus'" />
          <v-tooltip activator="parent" location="top">
            {{ selected ? t('training.removeFromList') : t('training.addToList') }}
          </v-tooltip>
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-play"
          @click="$emit('train', algorithm)"
        >
          {{ t('training.train') }}
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { TrainingAlgorithm } from '~~/lib/cube/cubesDefinition';
import { useSolvesStore } from '~/stores/db/solves';
import { bestOf, formatMs, trainingAverages } from '~/utils/stats';

const { t } = useI18n()

const props = defineProps<{
  algorithm: TrainingAlgorithm
  selected?: boolean
}>()
defineEmits<{
  (e: 'train' | 'add-to-list', algorithm: TrainingAlgorithm): void
}>()

const solvesStore = useSolvesStore()

const showSetups = ref(false)

const algorithmName = computed(() =>
  props.algorithm.nameKey ? t(props.algorithm.nameKey) : props.algorithm.name ?? '',
)

const caseSolves = computed(() => solvesStore.getByAlgorithmId(props.algorithm.id))

const statTiles = computed(() => [
  { label: t('statLabels.best'), value: bestOf(caseSolves.value) },
  ...trainingAverages(caseSolves.value).map((avg) => ({
    label: t(`statLabels.${avg.label}`),
    value: avg.value,
  })),
])

const setupLabel = computed(() =>
  t('training.setup', showSetups.value ? 1 : props.algorithm.setups.length),
)
</script>

<style scoped lang="scss">
@use '../../assets/mixins' as mixins;
@use '../../assets/variables' as vars;

.training-card {
  @include mixins.hover-primary-border;
}

.training-card--selected {
  border-color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.04);
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

.training-card__setup-toggle {
  opacity: 0.7;
}

.training-card__setup {
  font-family: vars.$font-family-mono;
  background: rgba(var(--v-theme-on-surface), 0.06);
  white-space: normal;
  word-break: break-word;
}

.training-card__stat {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.training-card__stat-value {
  font-family: vars.$font-family-mono;
}

.aspect-ratio-1-1{
  aspect-ratio: 1/1;
}
</style>
