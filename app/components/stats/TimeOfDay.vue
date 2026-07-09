<template>
  <StatsSection :title="t('stats.timeOfDay.title')">
    <v-row>
      <v-col cols="12" md="6">
        <StatsLineChart
          :series="series"
          :height="230"
          :y-format="formatMs"
          :x-format="formatHour"
          :x-tick-values="[0, 6, 12, 18, 23]"
          :empty-text="t('stats.common.notEnoughData')"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column ga-3 justify-center">
        <div class="d-flex ga-3">
          <div class="tod-badge flex-1-1">
            <v-icon icon="mdi-weather-night" color="primary" class="mb-1" />
            <div class="tod-badge__label text-medium-emphasis">{{ t('stats.timeOfDay.bestTime') }}</div>
            <div class="tod-badge__value">
              {{ data.best ? t(`stats.timeOfDay.periods.${data.best.key}`) : '—' }}
            </div>
          </div>
          <div class="tod-badge flex-1-1">
            <v-icon icon="mdi-trending-up" color="#22A06B" class="mb-1" />
            <div class="tod-badge__label text-medium-emphasis">{{ t('stats.timeOfDay.boost') }}</div>
            <div class="tod-badge__value" style="color: #22a06b">{{ boostText }}</div>
          </div>
        </div>
        <div v-if="data.best && data.boost" class="tod-insight">
          <i18n-t keypath="stats.timeOfDay.insight" tag="span" scope="global">
            <template #period><strong>{{ t(`stats.timeOfDay.periods.${data.best.key}`) }}</strong></template>
            <template #time><strong>{{ formatMs(data.best.avg) }}</strong></template>
            <template #boost><span style="color: #22a06b; font-weight: 600">{{ boostText }}</span></template>
          </i18n-t>
        </div>
      </v-col>
    </v-row>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { timeOfDay } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t } = useI18n()

const data = computed(() => timeOfDay(props.solves))

const series = computed(() =>
  data.value.hours
    .filter((h) => h.avg !== null)
    .map((h) => ({ x: h.hour, y: h.avg as number })),
)

const boostText = computed(() =>
  data.value.boost !== null ? `+${(data.value.boost * 100).toFixed(1)}%` : '—',
)

function formatHour(h: number): string {
  return `${h.toString().padStart(2, '0')}:00`
}
</script>

<style scoped>
.tod-badge {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 16px;
}
.tod-badge__label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.tod-badge__value {
  font-size: 1.25rem;
  font-weight: 700;
}
.tod-insight {
  border-left: 3px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.06);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
}
</style>
