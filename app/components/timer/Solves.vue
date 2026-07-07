<template>
    <v-card class="pa-4">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-bold">Tempos</span>
            <v-btn size="small" variant="text" color="error" :disabled="!solves.length" @click="clearAll">
                Limpar
            </v-btn>
        </div>

        <v-list v-if="solves.length" density="compact" bg-color="transparent" class="times-list">
            <v-list-item v-for="(solve, i) in solves" :key="solve.id" class="px-2" @click="openSolveDetails(solve)">
                <template #prepend>
                    <span class="text-caption text-medium-emphasis mr-3" style="width: 28px">
                        {{ solves.length - i }}.
                    </span>
                </template>
                <v-list-item-title
class="font-weight-medium"
                    :class="{ 'text-decoration-line-through text-medium-emphasis': solve.penalty === 'dnf' }">
                    {{ formatSolve(solve) }}
                </v-list-item-title>
                <template #append>
                    <v-btn
icon="mdi-numeric-2-box-outline" size="x-small" variant="text"
                        :color="solve.penalty === '+2' ? 'amber' : undefined" title="+2"
                        @click.stop="setPenalty(solve, '+2')" />
                    <v-btn
icon="mdi-cancel" size="x-small" variant="text"
                        :color="solve.penalty === 'dnf' ? 'error' : undefined" title="DNF"
                        @click.stop="setPenalty(solve, 'dnf')" />
                    <v-btn
icon="mdi-delete-outline" size="x-small" variant="text" title="Remover"
                        @click.stop="removeSolve(solve)" />
                </template>
            </v-list-item>
        </v-list>
        <div v-else class="text-medium-emphasis text-center py-6">
            {{ t('timer.solves.empty') }}
        </div>
        <LazySolveDetailsDialog v-if="modalSolve" v-model="openModalSolve" :solve="modalSolve" @set-penalty="setPenalty" @delete-solve="removeSolve" />
    </v-card>
</template>

<script setup lang="ts">
import { useSolvesStore, type Penalty, type Solve } from '~/stores/db/solves';

const props = defineProps<{
    solves: Solve[],
}>()

const emits = defineEmits<{
    (e: 'solves-updated'): void
}>()

const { t } = useI18n()
const solvesStore = useSolvesStore()
const modalSolve = ref<Solve | null>(null)
const openModalSolve = ref(false)

// --- Solve actions --------------------------------------------------------
async function setPenalty(solve: Solve, penalty: Penalty) {
    const nSolve = { ...solve, penalty: solve.penalty === penalty ? 'none' : penalty }
  await solvesStore.update(nSolve)
  modalSolve.value = nSolve
  emits('solves-updated')
}
async function removeSolve(solve: Solve) {
  if (solve.id !== undefined) await solvesStore.remove(solve.id)
  openModalSolve.value = false
    emits('solves-updated')
}
async function clearAll() {
  if (confirm('Apagar todos os tempos?')) await solvesStore.clear()
    emits('solves-updated')
}

function openSolveDetails(solve: Solve) {
  modalSolve.value = solve
  openModalSolve.value = true
}
</script>