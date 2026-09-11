<template>
  <v-card
    class="pattern-card d-flex flex-column h-100"
    rounded="lg"
    border
    flat
    @click="$emit('details', pattern)"
  >
    <div class="pattern-card__preview pa-4 d-flex align-center justify-center">
      <nuxt-img
        :src="pattern.imageUrl"
        :alt="name"
        width="220"
        height="220"
        class="pattern-card__net rounded-lg"
      />

      <span class="pattern-card__badge d-inline-flex align-center ga-1 text-body-small font-weight-medium">
        <v-icon size="13" icon="mdi-rotate-3d-variant" />
        {{ t('patterns.moveCount', moveCount) }}
      </span>
    </div>

    <div class="pa-4 pt-3 d-flex flex-column flex-fill ga-2">
      <div class="d-flex align-center ga-2">
        <h3 class="text-title-medium font-weight-bold mb-0">{{ name }}</h3>
        <v-chip
          size="x-small"
          variant="tonal"
          :color="difficultyColor"
          class="ms-auto flex-shrink-0"
        >
          {{ t(`patterns.difficulty.${pattern.difficulty}`) }}
        </v-chip>
      </div>

      <p v-if="description" class="pattern-card__description text-body-medium text-medium-emphasis mb-0">
        {{ description }}
      </p>

      <div class="d-flex align-center ga-1 mt-auto pt-1">
        <code class="pattern-card__algorithm text-body-medium text-on-surface px-2 py-1 rounded flex-fill">
          {{ pattern.algorithm }}
        </code>
        <v-btn
          :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
          :color="copied ? 'success' : undefined"
          variant="text"
          size="small"
          :aria-label="t('patterns.copy')"
          @click.stop="copy(pattern.algorithm)"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { CubePattern } from '~~/lib/cube/cubesDefinition'

const { t } = useI18n()

const props = defineProps<{
  pattern: CubePattern
}>()
defineEmits<{
  (e: 'details', pattern: CubePattern): void
}>()

const labels = usePatternLabels()
const { copied, copy } = useCopyToClipboard()

const name = computed(() => labels.name(props.pattern))
const description = computed(() => labels.description(props.pattern))
const moveCount = computed(() => countMoves(props.pattern.algorithm))

const difficultyColors: Record<CubePattern['difficulty'], string> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
}
const difficultyColor = computed(() => difficultyColors[props.pattern.difficulty])
</script>

<style scoped lang="scss">
@use '../../assets/mixins' as mixins;
@use '../../assets/variables' as vars;

.pattern-card {
  cursor: pointer;
  @include mixins.hover-primary-border;
}

.pattern-card__preview {
  position: relative;
  background:
    radial-gradient(130% 100% at 50% -10%, rgba(var(--v-theme-primary), 0.16), transparent 65%),
    rgba(var(--v-theme-on-surface), 0.035);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.pattern-card__net {
  width: 100%;
  max-width: 220px;
  height: auto;
}

.pattern-card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px 3px 7px;
  border-radius: 999px;
  color: rgba(var(--v-theme-on-surface), 0.85);
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  backdrop-filter: blur(6px);
}

.pattern-card__description {
  line-height: 1.4;
}

.pattern-card__algorithm {
  font-family: vars.$font-family-mono;
  background: rgba(var(--v-theme-primary), 0.08);
  white-space: normal;
  word-break: break-word;
}
</style>
