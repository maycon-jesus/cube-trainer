<template>
    <v-container class="py-6">
        <!-- Header -->
        <LayoutsPageHeader :title="t('nav.stats')" :subtitle="t('stats.subtitle')">
            <template #append>
                <div class="filters d-flex flex-wrap ga-3">
                    <SessionSelector v-model="sessionId" show-all-option />
                    <CubeSelector v-model="puzzle" show-all-option />
                </div>
            </template>
        </LayoutsPageHeader>

        <!-- Headline KPIs -->
        <StatsKpiRow :solves="solves" />

        <!-- Averages + streaks -->
        <v-row density="comfortable">
            <v-col cols="12" lg="6">
                <StatsBestAverages :solves="solves" />
            </v-col>
            <v-col cols="12" lg="6">
                <StatsStreakTracker :solves="solves" />
            </v-col>
        </v-row>

        <!-- Time of day -->
        <!-- <v-row density="comfortable">
            <v-col cols="12">
                <StatsTimeOfDay :solves="solves" />
            </v-col>
        </v-row> -->

        <!-- Performance + distribution -->
        <!-- <v-row density="comfortable">
            <v-col cols="12" md="8">
                <StatsPerformanceOverTime :solves="solves" />
            </v-col>
            <v-col cols="12" md="4">
                <StatsDistribution :solves="solves" />
            </v-col>
        </v-row> -->

        <!-- Practice calendar -->
        <!-- <v-row density="comfortable">
            <v-col cols="12">
                <StatsPracticeCalendar :solves="solves" />
            </v-col>
        </v-row> -->

        <!-- Personal best journey -->
        <!-- <v-row density="comfortable">
            <v-col cols="12">
                <StatsPersonalBestJourney :solves="solves" />
            </v-col>
        </v-row> -->
        
    </v-container>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'
import { useSolvesStore } from '~/stores/db/solves'
import CubeSelector from '~/components/session/CubeSelector.vue'
import SessionSelector from '~/components/session/SessionSelector.vue'

const { t } = useI18n()
const config = useConfigStore()
const solvesStore = useSolvesStore()

usePageSeo('stats')

const puzzle = ref<string>(config.puzzle || ALL_PUZZLES)
const sessionId = ref<number>(config.sessionId || ALL_SESSIONS)

// Keep selectors in sync once the persisted config finishes loading.
watch(() => config.puzzle, (value) => {
    if (value) puzzle.value = value
})
watch(() => config.sessionId, (value) => {
    if (value) sessionId.value = value
})

const solves = computed(() =>
    solvesStore.solves.filter((s) => {
        if (puzzle.value !== ALL_PUZZLES && s.puzzle !== puzzle.value) return false
        if (sessionId.value !== ALL_SESSIONS && s.sessionId !== sessionId.value) return false
        return true
    }),
)
</script>

<style scoped>
.filters {
    min-width: 260px;
}

.filters :deep(.v-select) {
    min-width: 180px;
}
</style>
