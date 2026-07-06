<template>
  <v-row density="comfortable">
    <v-col v-for="tile in tiles" :key="tile.label" cols="6" lg="3">
      <StatsKpiTile :icon="tile.icon" :value="tile.value" :label="tile.label" :color="tile.color" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves'
import { daysPracticed, practiceDayStreak, personalBest } from '~/utils/statsDashboard'

const props = defineProps<{
  solves: Solve[]
}>()

const { t } = useI18n()

const tiles = computed(() => [
  {
    icon: 'mdi-star-outline',
    value: props.solves.length,
    label: t('stats.kpi.totalSolves'),
    color: '#7C6CF5',
  },
  {
    icon: 'mdi-trophy-outline',
    value: formatMs(personalBest(props.solves)),
    label: t('stats.kpi.personalBest'),
    color: '#E8A517',
  },
  {
    icon: 'mdi-fire',
    value: practiceDayStreak(props.solves),
    label: t('stats.kpi.currentStreak'),
    color: '#F1622C',
  },
  {
    icon: 'mdi-calendar-check-outline',
    value: daysPracticed(props.solves),
    label: t('stats.kpi.daysPracticed'),
    color: '#22A06B',
  },
])
</script>
