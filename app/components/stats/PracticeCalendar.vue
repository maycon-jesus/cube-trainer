<template>
  <StatsSection :title="t('stats.calendar.title')">
    <template #actions>
      <div class="d-flex align-center ga-2 text-medium-emphasis">
        <span class="text-caption">{{ t('stats.calendar.less') }}</span>
        <span v-for="l in 5" :key="l" class="cal__legend" :style="{ background: levelColor(l - 1) }" />
        <span class="text-caption">{{ t('stats.calendar.more') }}</span>
      </div>
    </template>

    <div class="cal__scroll">
      <div class="cal">
        <div class="cal__months">
          <span
            v-for="m in monthLabels" :key="m.index"
            class="cal__month" :style="{ gridColumnStart: m.index + 1 }"
          >{{ m.label }}</span>
        </div>
        <div class="cal__grid">
          <div v-for="(week, wi) in grid" :key="wi" class="cal__week">
            <span
              v-for="(day, di) in week" :key="di"
              class="cal__day"
              :class="{ 'cal__day--empty': day.count < 0 }"
              :style="day.count >= 0 ? { background: levelColor(level(day.count)) } : {}"
              :title="day.count >= 0 ? `${formatDay(day.date)}: ${day.count}` : ''"
            />
          </div>
        </div>
      </div>
    </div>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { practiceCalendar } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t, locale } = useI18n()

const grid = computed(() => practiceCalendar(props.solves, 53))

const maxCount = computed(() => {
  let m = 1
  for (const week of grid.value) for (const d of week) if (d.count > m) m = d.count
  return m
})

function level(count: number): number {
  if (count <= 0) return 0
  const ratio = count / maxCount.value
  if (ratio > 0.75) return 4
  if (ratio > 0.5) return 3
  if (ratio > 0.25) return 2
  return 1
}

function levelColor(lvl: number): string {
  const alphas = [0.06, 0.3, 0.5, 0.72, 1]
  if (lvl === 0) return 'rgba(var(--v-theme-on-surface), 0.06)'
  return `rgba(var(--v-theme-primary), ${alphas[lvl]})`
}

const monthFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short' }))
const dayFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }))

function formatDay(ts: number): string {
  return dayFormatter.value.format(ts)
}

// One label per week-column where the month changes (skip the very first, matches GitHub).
const monthLabels = computed(() => {
  const labels: { index: number, label: string }[] = []
  let lastMonth = -1
  grid.value.forEach((week, i) => {
    const firstReal = week.find((d) => d.count >= 0) ?? week[0]!
    const month = new Date(firstReal.date).getMonth()
    if (month !== lastMonth) {
      labels.push({ index: i, label: monthFormatter.value.format(firstReal.date) })
      lastMonth = month
    }
  })
  return labels
})
</script>

<style scoped>
.cal__scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
.cal {
  min-width: max-content;
}
.cal__months {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 15px;
  margin-bottom: 6px;
  height: 16px;
}
.cal__month {
  grid-row: 1;
  font-size: 0.7rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}
.cal__grid {
  display: flex;
  gap: 3px;
}
.cal__week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.cal__day {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  
}
.cal__day--empty {
  background: transparent !important;
}
.cal__legend {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
</style>
