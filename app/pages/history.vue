<template>
    <v-container class="py-6">
        <LayoutsPageHeader :title="t('nav.history')" :subtitle="t('history.subtitle')">
            <template #append>
                <div class="filters d-flex flex-wrap ga-3">
                    <SolveTypeSelector v-model="type" show-all-option />
                    <SessionSelector v-model="sessionId" show-all-option />
                    <CubeSelector v-model="puzzle" show-all-option />
                </div>
            </template>
        </LayoutsPageHeader>

        <CustomCard :title="t('history.solves')" :subtitle="t('history.count', { count: total }, total)">
            <v-list v-if="rows.length" density="compact" bg-color="transparent">
                <v-list-item v-for="{ solve, training, timestamp } in rows" :key="solve.id" class="px-2" @click="openSolveDetails(solve)">
                    <template #prepend>
                        <v-avatar v-if="training?.algorithm?.imageUrl" rounded="lg" size="32" class="mr-2">
                            <v-img :src="training.algorithm.imageUrl" :alt="training.algorithmName" />
                        </v-avatar>
                        <v-icon v-else-if="cubesDefinition[solve.puzzle]?.icon" class="mr-1" size="32">
                            <component :is="cubesDefinition[solve.puzzle]!.icon" />
                        </v-icon>
                    </template>
                    <v-list-item-title
                        class="font-weight-medium"
                        :class="{ 'text-decoration-line-through text-medium-emphasis': solve.penalty === 'dnf' }">
                        {{ formatSolve(solve) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center flex-wrap ga-2">
                        <span>{{ t(`cube.${solve.puzzle}`) }}</span>
                        <span>·</span>
                        <span>{{ sessionName(solve.sessionId) }}</span>
                        <v-chip
                            v-if="training"
                            size="x-small"
                            color="primary"
                            variant="tonal"
                            label
                            prepend-icon="mdi-school-outline">
                            {{ [training.setName, training.algorithmName].filter(Boolean).join(' · ') }}
                        </v-chip>
                    </v-list-item-subtitle>
                    <template #append>
                        <div class="d-flex flex-column text-end text-caption text-medium-emphasis" style="line-height: 1.2">
                            <span>{{ timestamp.date }}</span>
                            <span>{{ timestamp.time }}</span>
                        </div>
                    </template>
                </v-list-item>
            </v-list>
            <div v-else class="text-medium-emphasis text-center py-6">
                {{ t('history.empty') }}
            </div>

            <v-pagination
                v-if="pageCount > 1"
                v-model="page"
                :length="pageCount"
                :total-visible="7"
                :disabled="loading"
                density="comfortable"
                class="mt-4" />
        </CustomCard>

        <LazySolveDetailsDialog
            v-if="modalSolve"
            v-model="openModalSolve"
            :solve="modalSolve"
            @set-penalty="setPenalty"
            @delete-solve="removeSolve" />
    </v-container>
</template>

<script setup lang="ts">
import { useSolvesStore, type Penalty, type Solve, type SolvesFilter, type Type } from '~/stores/db/solves'
import { useSessionsStore } from '~/stores/db/sessions'
import { cubesDefinition } from '~~/lib/cube/cubesDefinition'
import CubeSelector from '~/components/session/CubeSelector.vue'
import SessionSelector from '~/components/session/SessionSelector.vue'
import SolveTypeSelector from '~/components/solve/TypeSelector.vue'

const { locale, t } = useI18n()
const solvesStore = useSolvesStore()
const sessionsStore = useSessionsStore()
const trainingLabels = useTrainingLabels()

const sessionNames = computed(() => new Map(sessionsStore.sessions.map(s => [s.id, s.name])))

function sessionName(id: number) {
    return sessionNames.value.get(id) ?? t('history.unknownSession')
}

usePageSeo('history')

const PAGE_SIZE = 20

const type = ref<Type | typeof ALL_TYPES>(ALL_TYPES)
const sessionId = ref<number>(ALL_SESSIONS)
const puzzle = ref<string>(ALL_PUZZLES)

const page = ref(1)
const total = ref(0)
const solves = ref<Solve[]>([])
const loading = ref(false)

const pageCount = computed(() => Math.ceil(total.value / PAGE_SIZE))

const filter = computed<SolvesFilter>(() => ({
    type: type.value === ALL_TYPES ? undefined : type.value,
    sessionId: sessionId.value === ALL_SESSIONS ? undefined : sessionId.value,
    puzzle: puzzle.value === ALL_PUZZLES ? undefined : puzzle.value,
}))

const rows = computed(() => solves.value.map(solve => ({
    solve,
    training: trainingLabels.ofSolve(solve),
    timestamp: formatTimestampParts(locale.value, solve.createdAt),
})))

async function loadPage() {
    if (!import.meta.client) return
    loading.value = true
    try {
        solves.value = await solvesStore.getAllWithFilter({ ...filter.value, page: page.value, pageSize: PAGE_SIZE })

        // The current page can disappear (e.g. after deleting the last solve on it).
        if (page.value > 1 && !solves.value.length) {
            page.value--
        }
    }
    finally {
        loading.value = false
    }
}

async function loadPagination(){
    total.value = 0
    total.value = await solvesStore.countWithFilter(filter.value)
}

watch(filter, async () => {
    if (page.value === 1) {
        await loadPage()
        await loadPagination()
    }
    else page.value = 1
})
watch(page, loadPage)
onMounted(async()=>{
    await loadPage()
    await loadPagination()
})

// --- Solve details ---------------------------------------------------------
const modalSolve = ref<Solve | null>(null)
const openModalSolve = ref(false)

function openSolveDetails(solve: Solve) {
    modalSolve.value = solve
    openModalSolve.value = true
}

async function setPenalty(solve: Solve, penalty: Penalty) {
    const nSolve = { ...solve, penalty: solve.penalty === penalty ? 'none' as Penalty : penalty }
    await solvesStore.update(nSolve)
    modalSolve.value = nSolve
    await loadPage()
}

async function removeSolve(solve: Solve) {
    if (solve.id !== undefined) await solvesStore.remove(solve.id)
    openModalSolve.value = false
    await loadPage()
}
</script>

<style scoped>
.filters {
    min-width: 260px;
}

.filters :deep(.v-select) {
    min-width: 180px;
}
</style>
