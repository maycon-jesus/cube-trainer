<template>
    <v-card>
        <v-card-title>Estatísticas</v-card-title>
        <v-card-subtitle>{{ props.solves.length }} solves</v-card-subtitle>
        <v-card-text>
            <v-row density="compact">
                <v-col cols="6">
                  <div class="stat-label">melhor</div>
                  <div class="stat-value">{{ formatMs(stats.best) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">média</div>
                  <div class="stat-value">{{ formatMs(stats.mean) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">ao5</div>
                  <div class="stat-value">{{ formatMs(stats.ao5) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-label">ao12</div>
                  <div class="stat-value">{{ formatMs(stats.ao12) }}</div>
                </v-col>
              </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Solve } from '~/stores/db/solves';

const props = defineProps<{
    solves: Solve[]
}>()

// --- Stats ----------------------------------------------------------------
const stats = computed(() => ({
  count: props.solves.length,
  best: bestOf(props.solves),
  ao5: averageOf(props.solves, 5),
  ao12: averageOf(props.solves, 12),
  mean: meanOf(props.solves),
}))
</script>