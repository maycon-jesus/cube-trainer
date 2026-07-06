<template>
  <StatsSection :title="t('stats.bestAverages.title')">
    <v-row density="comfortable">
      <v-col v-for="stat in stats" :key="stat.n" cols="6" sm="3">
        <div class="avg-cell">
          <div class="avg-cell__name">Ao{{ stat.n }}</div>
          <div class="avg-cell__current">{{ formatMs(stat.current) }}</div>
          <div class="avg-cell__best">
            <span class="text-medium-emphasis">{{ t('stats.bestAverages.best') }}</span>
            <span class="avg-cell__best-value">{{ formatMs(stat.best) }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { averageStat } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t } = useI18n()

const stats = computed(() => [5, 12, 50, 100].map((n) => averageStat(props.solves, n)))
</script>

<style scoped>
.avg-cell {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 12px;
  text-align: center;
}
.avg-cell__name {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 6px;
}
.avg-cell__current {
  font-size: 1.15rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.avg-cell__best {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(var(--v-border-color), 0.08);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.avg-cell__best-value {
  color: #22a06b;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
