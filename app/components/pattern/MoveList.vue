<template>
  <v-card variant="tonal" rounded="lg">
    <div class="pa-3 d-flex align-center ga-2">
      <div class="flex-fill">
        <div class="text-label-large font-weight-medium">{{ props.title }}</div>
        <div v-if="props.subtitle" class="text-body-small text-medium-emphasis">{{ props.subtitle }}</div>
      </div>
      <v-btn
        :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
        :color="copied ? 'success' : undefined"
        variant="text"
        size="small"
        :aria-label="t('patterns.copy')"
        @click="copy(props.moves)"
      />
    </div>

    <div class="px-3 pb-3 d-flex flex-wrap ga-1">
      <span
        v-for="(move, index) in moves"
        :key="index"
        class="pattern-move-list__move px-2 py-1 rounded text-body-medium"
      >
        {{ move }}
      </span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  title: string
  subtitle?: string
  moves: string
}>()

const { copied, copy } = useCopyToClipboard()

const moves = computed(() => props.moves.trim().split(/\s+/).filter(Boolean))
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.pattern-move-list__move {
  font-family: vars.$font-family-mono;
  background: rgba(var(--v-theme-on-surface), 0.08);
  min-width: 38px;
  text-align: center;
}
</style>
