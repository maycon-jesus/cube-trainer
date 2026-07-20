<template>
  <v-dialog v-model="model" max-width="760" scrollable>
    <CustomCard
      :title="isEdit ? t('training.playlists.edit') : t('training.playlists.create')"
      :icon="isEdit ? 'mdi-playlist-edit' : 'mdi-playlist-plus'"
      icon-color="primary"
    >
        <v-row dense class="pt-2">
          <v-col cols="12" sm="7">
            <v-text-field
              v-model="name"
              :label="t('training.playlists.nameLabel')"
              variant="outlined"
              autofocus
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="5">
            <v-select
              v-model="puzzleId"
              :items="puzzleItems"
              :label="t('training.playlists.puzzleLabel')"
              variant="outlined"
              hide-details
              :disabled="puzzleItems.length <= 1"
            />
          </v-col>
        </v-row>

        <template v-if="sets.length">
          <v-row dense align="center" class="mt-4 mb-2">
            <v-col cols="auto">
              <span class="text-body-medium font-weight-medium">{{ t('training.playlists.selectAlgorithms') }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <span class="text-body-medium text-medium-emphasis">
                {{ t('training.playlists.selectedCount', selectedCount) }}
              </span>
            </v-col>
          </v-row>

          <v-expansion-panels multiple>
            <v-expansion-panel v-for="set in sets" :key="set.id">
              <v-expansion-panel-title>
                <div class="d-flex align-center ga-2 flex-fill">
                  <v-checkbox-btn
                    :model-value="setAllSelected(set)"
                    :indeterminate="setPartiallySelected(set)"
                    density="compact"
                    hide-details
                    @click.stop="toggleSet(set)"
                  />
                  <span class="font-weight-medium">{{ setName(set) }}</span>
                  <v-spacer />
                  <span class="text-body-small text-medium-emphasis me-2">
                    {{ countInSet(set) }}/{{ set.algorithms.length }}
                  </span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row dense>
                  <v-col
                    v-for="alg in set.algorithms"
                    :key="alg.id"
                    cols="4"
                    sm="3"
                    md="2"
                  >
                    <button
                      type="button"
                      class="playlist-alg d-flex flex-column align-center ga-1 pa-2 rounded"
                      :class="{ 'playlist-alg--selected': isSelected(set.id, alg.id) }"
                      @click="toggleAlgorithm(set.id, alg.id)"
                    >
                      <nuxt-img
                        :src="alg.imageUrl"
                        :alt="algName(alg)"
                        width="64"
                        height="64"
                        class="rounded"
                      />
                      <span class="playlist-alg__name text-body-small text-center">{{ algName(alg) }}</span>
                      <v-icon
                        v-if="isSelected(set.id, alg.id)"
                        icon="mdi-check-circle"
                        color="primary"
                        size="18"
                        class="playlist-alg__check"
                      />
                    </button>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>

      <template #actions>
        <v-spacer />
        <v-btn :disabled="saving" @click="model = false">
          {{ t('training.playlists.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="saving"
          :disabled="!canSave"
          @click="save"
        >
          {{ isEdit ? t('training.playlists.saveChanges') : t('training.playlists.save') }}
        </v-btn>
      </template>
    </CustomCard>
  </v-dialog>
</template>

<script setup lang="ts">
import { cubesDefinition, type TrainingAlgorithm, type TrainingSet } from '~~/lib/cube/cubesDefinition';
import { useTrainingPlaylistsStore, type TrainingCase, type TrainingPlaylist } from '~/stores/db/trainingPlaylists';

const model = defineModel<boolean>()
const props = defineProps<{
  playlist?: TrainingPlaylist | null
  preset?: { puzzleId: string, trainingCases: TrainingCase[] } | null
}>()
const emit = defineEmits<{ (e: 'saved'): void }>()

const { t } = useI18n()
const playlistsStore = useTrainingPlaylistsStore()

const trainablePuzzles = Object.values(cubesDefinition).filter((p) => !!p.trainingSets?.length)
const puzzleItems = trainablePuzzles.map((p) => ({ title: t(`cube.${p.id}`), value: p.id }))

const isEdit = computed(() => !!props.playlist)

const name = ref('')
const puzzleId = ref<string>(puzzleItems[0]?.value ?? '')
const selectedKeys = ref<Set<string>>(new Set())
const saving = ref(false)
const hydrating = ref(false)

const sets = computed<TrainingSet[]>(() => cubesDefinition[puzzleId.value]?.trainingSets ?? [])
const selectedCount = computed(() => selectedKeys.value.size)
const canSave = computed(() => !!name.value.trim() && selectedCount.value > 0)

const key = (setId: string, algorithmId: string) => `${setId}::${algorithmId}`
const isSelected = (setId: string, algorithmId: string) => selectedKeys.value.has(key(setId, algorithmId))

function setName(set: TrainingSet) {
  return set.nameKey ? t(set.nameKey) : set.name ?? ''
}

function algName(alg: TrainingAlgorithm) {
  return alg.nameKey ? t(alg.nameKey) : alg.name ?? ''
}

function countInSet(set: TrainingSet) {
  return set.algorithms.filter((a) => isSelected(set.id, a.id)).length
}

function setAllSelected(set: TrainingSet) {
  return set.algorithms.length > 0 && countInSet(set) === set.algorithms.length
}

function setPartiallySelected(set: TrainingSet) {
  const count = countInSet(set)
  return count > 0 && count < set.algorithms.length
}

function toggleAlgorithm(setId: string, algorithmId: string) {
  const next = new Set(selectedKeys.value)
  const k = key(setId, algorithmId)
  if (next.has(k)) next.delete(k)
  else next.add(k)
  selectedKeys.value = next
}

function toggleSet(set: TrainingSet) {
  const next = new Set(selectedKeys.value)
  if (setAllSelected(set)) {
    for (const a of set.algorithms) next.delete(key(set.id, a.id))
  } else {
    for (const a of set.algorithms) next.add(key(set.id, a.id))
  }
  selectedKeys.value = next
}

function hydrate() {
  hydrating.value = true
  if (props.playlist) {
    name.value = props.playlist.name
    puzzleId.value = props.playlist.puzzleId
    selectedKeys.value = new Set(
      props.playlist.trainingCases.map((c) => key(c.trainingSetId, c.algorithmId)),
    )
  } else if (props.preset) {
    name.value = ''
    puzzleId.value = props.preset.puzzleId
    selectedKeys.value = new Set(
      props.preset.trainingCases.map((c) => key(c.trainingSetId, c.algorithmId)),
    )
  } else {
    name.value = ''
    puzzleId.value = puzzleItems[0]?.value ?? ''
    selectedKeys.value = new Set()
  }
  nextTick(() => { hydrating.value = false })
}

async function save() {
  if (!canSave.value) return
  saving.value = true
  const trainingCases: TrainingCase[] = [...selectedKeys.value].map((k) => {
    const [trainingSetId, algorithmId] = k.split('::')
    return { trainingSetId: trainingSetId!, algorithmId: algorithmId! }
  })
  if (props.playlist?.id != null) {
    await playlistsStore.update({ ...props.playlist, name: name.value.trim(), puzzleId: puzzleId.value, trainingCases })
  } else {
    await playlistsStore.add({ name: name.value.trim(), puzzleId: puzzleId.value, trainingCases })
  }
  saving.value = false
  model.value = false
  emit('saved')
}

watch(model, (open) => {
  if (open) hydrate()
})
watch(puzzleId, () => {
  if (hydrating.value) return
  selectedKeys.value = new Set()
})
</script>

<style scoped lang="scss">
.playlist-alg {
  position: relative;
  width: 100%;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgba(var(--v-theme-on-surface), 0.02);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: rgba(var(--v-theme-primary), 0.5);
  }
}

.playlist-alg--selected {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}

.playlist-alg__name {
  line-height: 1.1;
  word-break: break-word;
}

.playlist-alg__check {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
