<template>
  <StatsSection :title="t('stats.distribution.title')" class="h-100">
    <div v-if="bins.length" class="dist">
      <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="dist__svg">
        <rect
          v-for="(b, i) in bins" :key="i"
          :x="i * barW + gap / 2"
          :y="H - barHeight(b.count)"
          :width="barW - gap"
          :height="barHeight(b.count)"
          rx="2"
          fill="rgb(var(--v-theme-primary))"
          :opacity="0.55 + 0.45 * (b.count / maxCount)"
        >
          <title>{{ formatMs(b.start) }}–{{ formatMs(b.end) }}: {{ b.count }}</title>
        </rect>
      </svg>
      <div class="dist__axis text-medium-emphasis">
        <span>{{ formatMs(bins[0]!.start) }}</span>
        <span>{{ formatMs(bins[bins.length - 1]!.end) }}</span>
      </div>
    </div>
    <div v-else class="dist__empty text-medium-emphasis">
      {{ t('stats.distribution.empty') }}
    </div>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { distribution } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t } = useI18n()

const W = 300
const H = 200
const gap = 4

const bins = computed(() => distribution(props.solves, 12))
const barW = computed(() => W / (bins.value.length || 1))
const maxCount = computed(() => Math.max(1, ...bins.value.map((b) => b.count)))

function barHeight(count: number): number {
  return maxCount.value ? (count / maxCount.value) * (H - 8) : 0
}
</script>

<style scoped>
.dist__svg {
  width: 100%;
  height: 100%;
  display: block;
}
.dist__axis {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
}
.dist__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  font-size: 0.9rem;
  text-align: center;
}
</style>
