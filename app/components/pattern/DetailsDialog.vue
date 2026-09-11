<template>
  <v-dialog v-model="model" max-width="600" scrollable>
    <v-card v-if="pattern">
      <template #title>
        <div class="d-flex align-center ga-2">
          <span class="text-title-large font-weight-bold">{{ name }}</span>
          <v-chip size="x-small" variant="tonal" :color="difficultyColor">
            {{ t(`patterns.difficulty.${pattern.difficulty}`) }}
          </v-chip>
        </div>
      </template>

      <template #text>
        <div class="pattern-details__preview d-flex align-center justify-center rounded-lg pa-4 mb-4">
          <nuxt-img
            :src="pattern.imageUrl"
            :alt="name"
            width="320"
            height="320"
            class="pattern-details__net rounded-lg"
          />
        </div>

        <p v-if="description" class="text-body-medium text-medium-emphasis mb-4">
          {{ description }}
        </p>

        <PatternMoveList
          :title="t('patterns.algorithm')"
          :subtitle="t('patterns.fromSolved')"
          :moves="pattern.algorithm"
        />

        <PatternMoveList
          class="mt-3"
          :title="t('patterns.reverse')"
          :subtitle="t('patterns.backToSolved')"
          :moves="reverseAlgorithm"
        />
      </template>

      <template #actions>
        <v-btn color="primary" @click="model = false">{{ t('patterns.close') }}</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { CubePattern } from '~~/lib/cube/cubesDefinition'
import { invertScramble } from '~~/lib/cube/3x3x3'

const { t } = useI18n()

const props = defineProps<{
  pattern: CubePattern | null
}>()
const model = defineModel<boolean>()

const labels = usePatternLabels()

const name = computed(() => props.pattern ? labels.name(props.pattern) : '')
const description = computed(() => props.pattern ? labels.description(props.pattern) : '')
const reverseAlgorithm = computed(() => props.pattern ? invertScramble(props.pattern.algorithm) : '')

const difficultyColors: Record<CubePattern['difficulty'], string> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
}
const difficultyColor = computed(() => props.pattern ? difficultyColors[props.pattern.difficulty] : undefined)
</script>

<style scoped lang="scss">
.pattern-details__preview {
  background:
    radial-gradient(130% 100% at 50% -10%, rgba(var(--v-theme-primary), 0.16), transparent 65%),
    rgba(var(--v-theme-on-surface), 0.035);
}

.pattern-details__net {
  width: 100%;
  max-width: 320px;
  height: auto;
}
</style>
