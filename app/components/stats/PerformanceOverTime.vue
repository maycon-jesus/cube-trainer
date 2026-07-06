<template>
  <StatsSection :title="t('stats.performance.title')">
    <template #actions>
      <v-btn-toggle
        v-model="period"
        mandatory
        density="compact"
        variant="outlined"
        divided
        class="perf-toggle"
      >
        <v-btn value="week" size="small">{{ t('stats.performance.week') }}</v-btn>
        <v-btn value="month" size="small">{{ t('stats.performance.month') }}</v-btn>
        <v-btn value="year" size="small">{{ t('stats.performance.year') }}</v-btn>
        <v-btn value="all" size="small">{{ t('stats.performance.all') }}</v-btn>
      </v-btn-toggle>
    </template>

    <StatsLineChart
      :series="series"
      :height="280"
      :area="false"
      :y-format="formatMs"
      :x-format="formatDate"
      :x-tick-values="xTicks"
      :empty-text="t('stats.common.notEnoughData')"
    />
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { performanceOverTime, type Period } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t, locale } = useI18n()

const period = ref<Period>('week')

const points = computed(() => performanceOverTime(props.solves, period.value))
const series = computed(() => points.value.map((p) => ({ x: p.createdAt, y: p.ms })))

const xTicks = computed(() => {
  if (points.value.length < 2) return undefined
  return [points.value[0]!.createdAt, points.value[points.value.length - 1]!.createdAt]
})

const dateFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short' }),
)

function formatDate(ts: number): string {
  return dateFormatter.value.format(ts)
}
</script>

<style scoped>
.perf-toggle {
  border-radius: 10px;
}
</style>
