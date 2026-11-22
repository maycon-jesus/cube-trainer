<template>
  <CustomCard :title="$t('timer.scramble.title')">
    <template #title-append>
      <div class="d-flex align-center ga-1">
        <v-chip v-if="moves.length" size="small" variant="tonal" label>
          {{ moves.length }}
        </v-chip>
        <v-btn size="small" variant="text" icon="mdi-refresh" :title="$t('actions.newScramble')"
          @click="emits('refresh')" />
      </div>
    </template>

    <div class="scramble-moves font-monospace" :class="{ 'is-multiline': lines.length > 1 }">
      <div v-for="(line, i) in lines" :key="i" class="scramble-line">
        <span v-for="(move, j) in line" :key="j" class="scramble-move">{{ move }}</span>
      </div>
    </div>
  </CustomCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  scramble: string
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const lines = computed(() =>
  getScrambleLines(props.scramble).map((line) => line.split(/\s+/).filter(Boolean)),
)

const moves = computed(() => lines.value.flat())
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.font-monospace {
  font-family: vars.$font-family-mono;
}

.scramble-moves {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
}

.scramble-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7em;
  text-wrap: balance;
}

.scramble-move {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(var(--v-theme-on-surface), 0.82);
  background: rgba(var(--v-theme-on-surface), var(--v-activated-opacity));
  border-radius: 0.3em;
  padding: 0.15em 0.4em;
  transition: color 0.12s ease;
}

.is-multiline .scramble-move {
  font-size: clamp(0.85rem, 1.5vw, 1.1rem);
  font-weight: 500;
}

.scramble-move:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), var(--v-activated-opacity));
}
</style>