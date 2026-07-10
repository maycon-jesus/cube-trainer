<template>
    <v-container class="py-6">
        <LayoutsPageHeader :title="t('nav.history')" :subtitle="t('history.subtitle')">
            <template #append>
                <div class="filters d-flex flex-wrap ga-3">
                    <SessionSelector v-model="sessionId" show-all-option />
                    <CubeSelector v-model="puzzle" show-all-option />
                </div>
            </template>
        </LayoutsPageHeader>

        <CustomCard :title="t('history.solves')" :subtitle="t('history.count', { count: total }, total)">
            <v-list v-if="solves.length" density="compact" bg-color="transparent">
                <v-list-item v-for="solve in solves" :key="solve.id" class="px-2" @click="openSolveDetails(solve)">
                    <template #prepend>
                        <v-icon v-if="cubesDefinition[solve.puzzle]?.icon" class="mr-1">
                            <component :is="cubesDefinition[solve.puzzle]!.icon" />
                        </v-icon>
                    </template>
                    <v-list-item-title
                        class="font-weight-medium"
                        :class="{ 'text-decoration-line-through text-medium-emphasis': solve.penalty === 'dnf' }">
                        {{ formatSolve(solve) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ t(`cube.${solve.puzzle}`) }}
                    </v-list-item-subtitle>
                    <template #append>
                        <span class="text-caption text-medium-emphasis">
                            {{ formatTimestamp(locale, solve.createdAt) }}
                        </span>
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
import { useSolvesStore, type Penalty, type Solve, type SolvesFilter } from '~/stores/db/solves'
import { cubesDefinition } from '~~/lib/cube/cubesDefinition'
import CubeSelector from '~/components/session/CubeSelector.vue'
import SessionSelector from '~/components/session/SessionSelector.vue'

const { locale, t } = useI18n()
const solvesStore = useSolvesStore()

usePageSeo('history')

const PAGE_SIZE = 20

const sessionId = ref<number>(ALL_SESSIONS)
const puzzle = ref<string>(ALL_PUZZLES)

const page = ref(1)
const total = ref(0)
const solves = ref<Solve[]>([])
const loading = ref(false)

const pageCount = computed(() => Math.ceil(total.value / PAGE_SIZE))

const filter = computed<SolvesFilter>(() => ({
    sessionId: sessionId.value === ALL_SESSIONS ? undefined : sessionId.value,
    puzzle: puzzle.value === ALL_PUZZLES ? undefined : puzzle.value,
}))

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
