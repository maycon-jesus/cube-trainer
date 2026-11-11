<template>
  <section v-if="patterns?.length" class="mb-10">
    <div class="d-flex align-center ga-3 mb-4">
      <span v-if="icon"
        class="pattern-section__icon-box d-inline-flex align-center justify-center flex-shrink-0 rounded-lg">
        <component :is="icon" class="pattern-section__icon" />
      </span>
      <h2 class="text-headline-small font-weight-bold mb-0 mt-0">{{ puzzle.name }}</h2>
      <span class="text-body-medium text-medium-emphasis">
        {{ t('patterns.patternCount', patterns.length) }}
      </span>
      <NuxtLink :to="localePath(`/patterns/${puzzle.id}`)"
        class="pattern-section__link d-inline-flex align-center ga-1 ms-auto text-body-medium font-weight-medium text-decoration-none">
        {{ t('patterns.viewAll') }}
        <v-icon icon="mdi-arrow-right" size="16" class="pattern-section__arrow" />
      </NuxtLink>
    </div>

    <v-row>
      <v-col v-for="pattern in previewPatterns" :key="pattern.id" cols="12" sm="6" lg="4" xl="3">
        <PatternCard :pattern="pattern" @details="emit('details', $event, puzzle.id)" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { cubesDefinition, type CubePattern } from '~~/lib/cube/cubesDefinition'
import { cubeIcons } from '~/components/icon'

type PuzzleSummary = {
  id: string,
  name: string,
  imageUrl: string,
  hasPatterns: boolean
}

const PREVIEW_COUNT = 4

const props = defineProps<{
  puzzle: PuzzleSummary
}>()

const emit = defineEmits<{
  details: [pattern: CubePattern, puzzleId: string]
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: patterns } = await useFetch<CubePattern[]>(() => `/api/${locale.value}/puzzle/${props.puzzle.id}/patterns`)

const previewPatterns = computed(() => (patterns.value ?? []).slice(0, PREVIEW_COUNT))

// Ícone é só de UI/cliente; a API não o expõe.
const icon = computed(() => {
  const name = cubesDefinition[props.puzzle.id]?.icon
  return name ? cubeIcons[name] : undefined
})
</script>

<style scoped lang="scss">
.pattern-section__icon-box {
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.pattern-section__icon {
  width: 24px;
  height: 24px;
  color: rgb(var(--v-theme-primary));
}

.pattern-section__link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-primary));

    .pattern-section__arrow {
      transform: translateX(3px);
    }
  }
}

.pattern-section__arrow {
  transition: transform 0.2s ease;
}
</style>
