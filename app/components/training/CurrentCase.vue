<template>
  <div>
    <v-list-item
      class="px-0"
      :title="props.algorithm.name"
      :subtitle="t('training.currentCase')"
    >
      <template v-if="props.algorithm.imageUrl" #prepend>
        <v-avatar rounded="lg" size="48">
          <v-img :src="props.algorithm.imageUrl" :alt="props.algorithm.name" />
        </v-avatar>
      </template>
    </v-list-item>

    <v-btn
      variant="text"
      size="small"
      color="on-surface"
      class="current-case__toggle px-1 text-none"
      prepend-icon="mdi-lightbulb-on-outline"
      :append-icon="showSolutions ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      @click="showSolutions = !showSolutions"
    >
      {{ showSolutions ? t('training.hideSolutions') : t('training.showSolutions') }}
    </v-btn>

    <AnimationExpand :model-value="showSolutions">
      <div class="d-flex flex-column ga-1 pt-1">
        <code
          v-for="(solution, i) in props.algorithm.solves"
          :key="i"
          class="current-case__solution text-body-large text-on-surface px-2 py-1 rounded"
        >
          {{ solution }}
        </code>
        <span v-if="props.algorithm.solves.length === 0" class="text-label-medium text-medium-emphasis px-2">
          {{ t('training.noSolutions') }}
        </span>
      </div>
    </AnimationExpand>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  algorithm: TrainingSetAlgorithm
}>()

const { t } = useI18n()

const showSolutions = ref(false)

watch(() => props.algorithm.id, () => {
  showSolutions.value = false
})
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.current-case__toggle {
  opacity: 0.7;
}

.current-case__solution {
  font-family: vars.$font-family-mono;
  background: rgba(var(--v-theme-primary), 0.08);
  white-space: normal;
  word-break: break-word;
}
</style>
