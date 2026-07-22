<template>
    <v-dialog v-model="model" max-width="600">
        <v-card>
            <template #title>
                {{ t('solve.details.title') }}
            </template>

            <template #text>
                <v-row density="comfortable">
                     <v-col cols="12">
                        <p class="time-value">{{formatSolve(props.solve)  }}</p>
                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex justify-center ga-2">
                            <v-btn :variant="isDNF(props.solve)? 'elevated':'tonal'" :color="isDNF(props.solve)? 'primary' : 'btn'" @click="() => emits('setPenalty', props.solve, 'dnf')">DNF</v-btn>
                            <v-btn :variant="isPlus2(props.solve)? 'elevated':'tonal'" :color="isPlus2(props.solve)? 'primary' : 'btn'" @click="() => emits('setPenalty', props.solve, '+2')">+2</v-btn>
                            <v-btn variant="outlined" color="error" @click="() => emits('deleteSolve', props.solve)">{{ t('solve.details.delete') }}</v-btn>
                        </div>
                    </v-col>
                    <v-col v-show="!!props.solve.scramble" cols="12">
                        <v-card variant="tonal" >
                            <v-card-title class="text-body-small">{{ t('solve.details.scramble') }}</v-card-title>
                            <v-card-text>
                                <span v-for="(line, index) in getScrambleLines(props.solve.scramble)" :key="index" class="d-block text-center">
                                    {{ line }}
                                </span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card variant="tonal" >
                            <v-card-title class="text-body-small">{{ t('solve.details.puzzle') }}</v-card-title>
                            <v-card-text class="d-flex align-center">
                                <v-icon v-if="cube?.icon">
                                    <component :is="cube.icon" />
                                </v-icon>
                                <span class="text-body-large ml-1">
                                    {{ t(`cube.${props.solve.puzzle}`) }}
                                </span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col v-if="training" cols="12">
                        <v-card variant="tonal">
                            <v-card-title class="text-body-small">{{ t('solve.details.training') }}</v-card-title>
                            <v-card-text class="d-flex align-center ga-3">
                                <v-avatar v-if="training.algorithm?.imageUrl" rounded="lg" size="48">
                                    <v-img :src="training.algorithm.imageUrl" :alt="training.algorithmName" />
                                </v-avatar>
                                <div>
                                    <p class="text-body-large">{{ training.algorithmName || t('solve.details.trainingUnknownCase') }}</p>
                                    <p class="text-medium-emphasis">{{ training.setName }}</p>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card variant="tonal">
                            <v-card-title class="text-body-small">{{ t('solve.details.date') }}</v-card-title>
                            <v-card-text>
                                {{ formatTimestamp(locale,props.solve.createdAt) }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <template #actions>
                <v-btn color="primary" @click="model = false">{{ t('solve.details.close') }}</v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Penalty, Solve } from '~/stores/db/solves';
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';
const {locale, t} = useI18n()

const props = defineProps<{
    solve: Solve
}>()
const emits = defineEmits<{
    (e: 'setPenalty', solve: Solve, penalty: Penalty): void
    (e: 'deleteSolve', solve: Solve): void
}>()
const model = defineModel<boolean>()

const cube = computed(() => cubesDefinition[props.solve.puzzle])

const trainingLabels = useTrainingLabels()
const training = computed(() => trainingLabels.ofSolve(props.solve))

</script>

<style scoped>
.time-value {
    font-size: clamp(2.5rem, 14vw, 3.5rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-align: center;
}
</style>