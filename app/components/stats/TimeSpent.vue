<template>
  <StatsSection :title="t('stats.timeSpent.title')" glow>
    <template #actions>
      <v-btn-toggle
        v-model="range"
        mandatory
        density="compact"
        variant="outlined"
        divided
        class="spent-toggle"
      >
        <v-btn value="today" size="small">{{ t('stats.timeSpent.ranges.today') }}</v-btn>
        <v-btn value="week" size="small">{{ t('stats.timeSpent.ranges.week') }}</v-btn>
        <v-btn value="month" size="small">{{ t('stats.timeSpent.ranges.month') }}</v-btn>
        <v-btn value="year" size="small">{{ t('stats.timeSpent.ranges.year') }}</v-btn>
      </v-btn-toggle>
    </template>

    <v-row density="comfortable" align="center">
      <v-col cols="12" md="4">
        <div class="spent-hero">
          <div class="spent-hero__value">{{ formatDuration(stat.ms) }}</div>
          <div class="spent-hero__label text-medium-emphasis">
            {{ t(`stats.timeSpent.subtitle.${stat.range}`) }}
          </div>
          <div v-if="delta" class="spent-hero__delta" :class="`spent-hero__delta--${delta.tone}`">
            <v-icon size="14" :icon="delta.icon" />
            <span>{{ delta.text }}</span>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <v-row density="comfortable">
          <v-col v-for="item in items" :key="item.label" cols="6" sm="3">
            <div class="spent-cell">
              <div class="spent-cell__value">{{ item.value }}</div>
              <div class="spent-cell__label text-medium-emphasis">{{ item.label }}</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { timeSpent, type TimeRange } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t, n } = useI18n()

const range = ref<TimeRange>('today')

const stat = computed(() => timeSpent(props.solves, range.value))

function formatDuration(ms: number | null): string {
  if (ms === null) return '—'
  const { hours, minutes, seconds } = splitDuration(ms)
  const h = t('stats.timeSpent.units.hour')
  const min = t('stats.timeSpent.units.minute')
  const s = t('stats.timeSpent.units.second')
  if (hours > 0) return `${hours}${h} ${minutes}${min}`
  if (minutes > 0) return `${minutes}${min} ${seconds}${s}`
  return `${seconds}${s}`
}

const items = computed(() => [
  { value: stat.value.solves, label: t('stats.timeSpent.solves') },
  { value: formatMs(stat.value.avgMs), label: t('stats.timeSpent.perSolve') },
  { value: stat.value.activeDays, label: t('stats.timeSpent.activeDays') },
  { value: formatDuration(stat.value.avgPerActiveDayMs), label: t('stats.timeSpent.perDay') },
])

const delta = computed(() => {
  const share = stat.value.deltaShare
  if (share === null) return null
  const text = t('stats.timeSpent.delta', {
    value: n(Math.abs(share), { style: 'percent', maximumFractionDigits: 0 }),
  })
  if (share > 0) return { tone: 'up', icon: 'mdi-trending-up', text: `+${text}` }
  if (share < 0) return { tone: 'down', icon: 'mdi-trending-down', text: `-${text}` }
  return { tone: 'flat', icon: 'mdi-trending-neutral', text }
})
</script>

<style scoped>
.spent-toggle {
  border-radius: 10px;
}
.spent-hero {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-top: 2px solid rgb(var(--v-theme-primary));
  padding: 16px;
}
.spent-hero__value {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.1;
  color: rgb(var(--v-theme-primary));
  font-variant-numeric: tabular-nums;
}
.spent-hero__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 4px;
}
.spent-hero__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.spent-hero__delta--up {
  color: #22a06b;
}
.spent-hero__delta--down {
  color: #e8a517;
}
.spent-hero__delta--flat {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.spent-cell {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  padding: 14px 12px;
  text-align: center;
}
.spent-cell__value {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.spent-cell__label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 4px;
}
</style>
