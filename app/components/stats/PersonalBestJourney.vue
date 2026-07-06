<template>
  <StatsSection :title="t('stats.pbJourney.title')">
    <v-row>
      <v-col cols="12" md="8">
        <StatsLineChart
          :series="series"
          :height="240"
          :y-format="formatMs"
          :x-format="formatDate"
          :x-tick-values="xTicks"
          color="rgb(var(--v-theme-primary))"
          :empty-text="t('stats.common.notEnoughData')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <div v-if="list.length" class="pb-list">
          <div v-for="(item, i) in list" :key="item.createdAt" class="pb-item">
            <div class="pb-item__rank" :class="{ 'pb-item__rank--gold': i === 0 }">{{ i + 1 }}</div>
            <div class="pb-item__main">
              <div class="pb-item__time">{{ formatMs(item.ms) }}</div>
              <div class="pb-item__date text-medium-emphasis">{{ formatDate(item.createdAt) }}</div>
            </div>
            <div v-if="item.delta > 0" class="pb-item__delta">-{{ formatDelta(item.delta) }}</div>
          </div>
        </div>
        <div v-else class="pb-list__empty text-medium-emphasis">
          {{ t('stats.common.notEnoughData') }}
        </div>
      </v-col>
    </v-row>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { personalBestJourney } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t, locale } = useI18n()

const milestones = computed(() => personalBestJourney(props.solves))
const series = computed(() => milestones.value.map((m) => ({ x: m.createdAt, y: m.ms })))
// Newest (and therefore best) first.
const list = computed(() => [...milestones.value].reverse())

const xTicks = computed(() => {
  if (milestones.value.length < 2) return undefined
  return [milestones.value[0]!.createdAt, milestones.value[milestones.value.length - 1]!.createdAt]
})

const dateFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short', year: 'numeric' }),
)

function formatDate(ts: number): string {
  return dateFormatter.value.format(ts)
}

function formatDelta(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`
}
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.pb-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
}
.pb-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 12px;
  padding: 10px 12px;
}
.pb-item__rank {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background: rgb(var(--v-theme-primary));
}
.pb-item__rank--gold {
  background: #e8a517;
}
.pb-item__main {
  flex: 1 1 auto;
  min-width: 0;
}
.pb-item__time {
  font-size: 1.05rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-family: vars.$font-family-mono;
}
.pb-item__date {
  font-size: 0.72rem;
}
.pb-item__delta {
  color: #22a06b;
  font-weight: 600;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}
.pb-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  font-size: 0.9rem;
}
</style>
