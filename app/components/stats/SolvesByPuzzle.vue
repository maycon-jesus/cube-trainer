<template>
  <StatsSection :title="t('stats.byPuzzle.title')">
    <div v-if="rows.length" class="byp">
      <div v-for="row in rows" :key="row.puzzle" class="byp__row">
        <v-icon class="byp__icon" size="28">
          <component :is="row.icon" />
        </v-icon>
        <div class="byp__body">
          <div class="byp__head">
            <span class="byp__name">{{ row.name }}</span>
            <span class="byp__count text-medium-emphasis">
              {{ row.count }} <span class="byp__share">({{ formatShare(row.share) }})</span>
            </span>
          </div>
          <div class="byp__track">
            <div
              class="byp__bar"
              :style="{ width: `${barWidth(row.count)}%`, opacity: 0.55 + 0.45 * (row.count / max) }"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="byp__empty text-medium-emphasis">
      {{ t('stats.byPuzzle.empty') }}
    </div>
  </StatsSection>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { Solve } from '~/stores/db/solves'
import { solvesByPuzzle } from '~/utils/statsDashboard'
import { cubesDefinition } from '~~/lib/cube/cubesDefinition'
import { OtherIcon } from '@icon'

const props = defineProps<{
  solves: Solve[]
}>()

const { t, n } = useI18n()

type Row = {
  puzzle: string
  count: number
  share: number
  name: string
  icon: Component
}

const rows = computed<Row[]>(() =>
  solvesByPuzzle(props.solves).map((entry) => {
    const cube = cubesDefinition[entry.puzzle]
    return {
      ...entry,
      name: cube ? t(`cube.${cube.id}`) : entry.puzzle,
      icon: cube?.icon ?? OtherIcon,
    }
  }),
)

const max = computed(() => Math.max(1, ...rows.value.map((r) => r.count)))

function barWidth(count: number): number {
  return Math.max(2, (count / max.value) * 100)
}

function formatShare(share: number): string {
  return n(share, { style: 'percent', maximumFractionDigits: 1 })
}
</script>

<style scoped>
.byp {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.byp__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.byp__icon {
  flex: 0 0 auto;
}
.byp__body {
  flex: 1 1 auto;
  min-width: 0;
}
.byp__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.byp__name {
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.byp__count {
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.byp__share {
  font-weight: 400;
}
.byp__track {
  height: 10px;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  overflow: hidden;
}
.byp__bar {
  height: 100%;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  transition: width 0.35s ease;
}
.byp__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  font-size: 0.9rem;
  text-align: center;
}
</style>
