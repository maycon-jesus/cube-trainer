<template>
  <StatsSection :title="t('stats.streak.title')" glow>
    <template #actions>
      <div class="d-flex align-center ga-1 text-medium-emphasis">
        <span class="text-caption">{{ t('stats.streak.sub') }}</span>
        <v-text-field
          v-model.number="threshold"
          type="number"
          density="compact"
          variant="outlined"
          hide-details
          min="1"
          class="streak__input"
        />
        <span class="text-caption">s</span>
      </div>
    </template>

    <v-row density="comfortable">
      <v-col v-for="item in items" :key="item.label" cols="4">
        <div class="streak-cell" :style="{ '--accent': item.color }">
          <div class="streak-cell__value">{{ item.value }}</div>
          <div class="streak-cell__label text-medium-emphasis">{{ item.label }}</div>
        </div>
      </v-col>
    </v-row>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { subStreak } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t } = useI18n()

const threshold = ref(15)

const streak = computed(() => subStreak(props.solves, (Number(threshold.value) || 0) * 1000))

const items = computed(() => [
  { value: streak.value.current, label: t('stats.streak.current'), color: '#7C6CF5' },
  { value: streak.value.best, label: t('stats.streak.best'), color: '#E8A517' },
  { value: streak.value.days, label: t('stats.streak.days'), color: '#22A06B' },
])
</script>

<style scoped>
.streak__input {
  width: 68px;
}
.streak-cell {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-top: 2px solid var(--accent);
  padding: 16px 12px;
  text-align: center;
}
.streak-cell__value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.streak-cell__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 4px;
}
</style>
