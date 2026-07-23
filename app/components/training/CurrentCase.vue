<template>
  <div>
    <v-list-item
      class="px-0"
      :title="algorithmName"
      :subtitle="t('training.currentCase')"
    >
      <template v-if="algorithm.imageUrl" #prepend>
        <v-avatar rounded="lg" size="48">
          <v-img :src="algorithm.imageUrl" :alt="algorithmName" />
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
          v-for="(solution, i) in algorithm.solves"
          :key="i"
          class="current-case__solution text-body-large text-on-surface px-2 py-1 rounded"
        >
          {{ solution }}
        </code>
        <span v-if="algorithm.solves.length === 0" class="text-label-medium text-medium-emphasis px-2">
          {{ t('training.noSolutions') }}
        </span>
      </div>
    </AnimationExpand>
  </div>
</template>

<script setup lang="ts">
import type { TrainingAlgorithm } from '~~/lib/cube/cubesDefinition'

const props = defineProps<{
  algorithm: TrainingAlgorithm
}>()

const { t } = useI18n()

const showSolutions = ref(false)

watch(() => props.algorithm.id, () => {
  showSolutions.value = false
})

const algorithmName = computed(() =>
  props.algorithm.nameKey ? t(props.algorithm.nameKey) : props.algorithm.name ?? '',
)
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
