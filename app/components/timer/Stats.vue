<template>
  <CustomCard :title="t('timer.stats.title')" :subtitle="t('timer.stats.solvesCount', { count: props.solves.length })">
    <v-row density="compact">
      <v-col cols="6">
        <div class="stat-label">{{ t('timer.stats.best') }}</div>
        <div class="stat-value">{{ formatMs(stats.best) }}</div>
      </v-col>
      <v-col cols="6">
        <div class="stat-label">{{ t('timer.stats.mean') }}</div>
        <div class="stat-value">{{ formatMs(stats.mean) }}</div>
      </v-col>
      <v-col cols="6">
        <div class="stat-label">{{ t('timer.stats.ao5') }}</div>
        <div class="stat-value">{{ formatMs(stats.ao5) }}</div>
      </v-col>
      <v-col cols="6">
        <div class="stat-label">{{ t('timer.stats.ao12') }}</div>
        <div class="stat-value">{{ formatMs(stats.ao12) }}</div>
      </v-col>
    </v-row>
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
.stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>