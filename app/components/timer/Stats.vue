<template>
  <CustomCard :title="t('timer.stats.title')" :subtitle="t('timer.stats.solvesCount', { count: props.solves.length })">
    <div class="stat-grid">
      <div class="stat-tile stat-tile--accent">
        <div class="stat-label">{{ t('statLabels.best') }}</div>
        <div class="stat-value">{{ formatMs(stats.best) }}</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">{{ t('statLabels.mean') }}</div>
        <div class="stat-value">{{ formatMs(stats.mean) }}</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">{{ t('statLabels.ao5') }}</div>
        <div class="stat-value">{{ formatMs(stats.ao5) }}</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">{{ t('statLabels.ao12') }}</div>
        <div class="stat-value">{{ formatMs(stats.ao12) }}</div>
      </div>
    </div>
  </CustomCard>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves';

const { t } = useI18n()

const props = defineProps<{
  solves: Solve[]
}>()

// --- Stats ----------------------------------------------------------------
const stats = computed(() => ({
  count: props.solves.length,
  best: bestOf(props.solves),
  ao5: averageOf(props.solves, 5),
  ao12: averageOf(props.solves, 12),
  mean: meanOf(props.solves),
}))
</script>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.stat-tile {
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.stat-tile--accent {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.24);
}

.stat-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
  margin-bottom: 0.15rem;
}

.stat-tile--accent .stat-label {
  color: rgb(var(--v-theme-primary));
  opacity: 0.9;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.stat-tile--accent .stat-value {
  color: rgb(var(--v-theme-primary));
}
</style>