<script setup lang="ts">
import { cubesDefinition, type TrainingSet } from '~~/lib/cube/cubesDefinition';
import { useTrainingPlaylistsStore, type TrainingPlaylist } from '~/stores/db/trainingPlaylists';
import { useCustomTimerStore } from '~/stores/customTimer';

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo('training')

const trainablePuzzles = Object.values(cubesDefinition).filter((puzzle) => !!puzzle.trainingSets)

const playlistsStore = useTrainingPlaylistsStore()
const customTimerStore = useCustomTimerStore()

const playlists = ref<TrainingPlaylist[]>([])
const dialogOpen = ref(false)
const editTarget = ref<TrainingPlaylist | null>(null)
const deleteTarget = ref<TrainingPlaylist | null>(null)
const deleting = ref(false)

async function refreshPlaylists() {
  playlists.value = await playlistsStore.getAll()
}

onMounted(refreshPlaylists)

function openCreate() {
  editTarget.value = null
  dialogOpen.value = true
}

function openEdit(playlist: TrainingPlaylist) {
  editTarget.value = playlist
  dialogOpen.value = true
}

function trainPlaylist(playlist: TrainingPlaylist) {
  const sets = cubesDefinition[playlist.puzzleId]?.trainingSets ?? []
  customTimerStore.useTrainingSetDefault(playlist.puzzleId)
  for (const trainingCase of playlist.trainingCases) {
    const set = sets.find((s) => s.id === trainingCase.trainingSetId)
    const algorithm = set?.algorithms.find((a) => a.id === trainingCase.algorithmId)
    if (algorithm) customTimerStore.addAlgorithmToTrainingSet(algorithm)
  }
  navigateTo(localePath({ name: 'training-timer' }))
}

async function confirmDelete() {
  if (!deleteTarget.value?.id) return
  deleting.value = true
  await playlistsStore.remove(deleteTarget.value.id)
  deleting.value = false
  deleteTarget.value = null
  await refreshPlaylists()
}

const setsByPuzzle: Record<string, TrainingSet[]> = {}
const caseCounts: Record<string, number> = {}

for (const puzzle of trainablePuzzles) {
  const sets = puzzle.trainingSets!
  setsByPuzzle[puzzle.id] = sets
  // Surface each set's case count on the card.
  for (const set of sets) {
    caseCounts[`${puzzle.id}:${set.id}`] = set.algorithms.length
  }
}

// Sets carry either an i18n `nameKey`/`descriptionKey` or a literal `name`/`description`.
function setItems(puzzleId: string) {
  return (setsByPuzzle[puzzleId] ?? []).map((set) => {
    const count = caseCounts[`${puzzleId}:${set.id}`]
    return {
      title: set.nameKey ? t(set.nameKey) : set.name ?? '',
      value: set.id,
      imageUrl: set.imageUrl || undefined,
      path: localePath(`/training/${puzzleId}/${set.id}`),
      meta: set.descriptionKey ? t(set.descriptionKey) : set.description ?? undefined,
      badge: count != null ? t('training.caseCount', count) : undefined,
      badgeIcon: 'mdi-view-grid-outline',
    }
  })
}
</script>

<template>
  <v-container class="py-6" style="max-width: 1200px;">
    <LayoutsPageHeader :title="t('training.title')" :subtitle="t('training.subtitle')" />

    <section class="mb-10">
      <div class="d-flex flex-wrap align-center ga-3 mb-4">
        <h2 class="text-headline-small font-weight-bold mb-0 mt-0">{{ t('training.playlists.title') }}</h2>
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-playlist-plus"
          class="ms-auto"
          @click="openCreate"
        >
          {{ t('training.playlists.create') }}
        </v-btn>
      </div>

      <v-row v-if="playlists.length">
        <v-col
          v-for="playlist in playlists"
          :key="playlist.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <TrainingPlaylistCard
            :playlist="playlist"
            @train="trainPlaylist"
            @edit="openEdit"
            @delete="deleteTarget = $event"
          />
        </v-col>
      </v-row>

      <v-card v-else variant="tonal" rounded="lg" class="pa-6 text-center text-medium-emphasis">
        <v-icon icon="mdi-playlist-music-outline" size="40" class="mb-2 d-block mx-auto" />
        {{ t('training.playlists.empty') }}
      </v-card>
    </section>

    <section
      v-for="puzzle in trainablePuzzles"
      :key="puzzle.id"
      class="mb-10"
    >
      <div class="d-flex align-center ga-3 mb-4">
        <span class="training-puzzle-heading__icon-box d-inline-flex align-center justify-center flex-shrink-0 rounded-lg">
          <component :is="puzzle.icon" class="training-puzzle-heading__icon" />
        </span>
        <h2 class="text-headline-small font-weight-bold mb-0 mt-0">{{ t(`cube.${puzzle.id}`) }}</h2>
        <NuxtLink
          :to="localePath(`/training/${puzzle.id}`)"
          class="training-puzzle-heading__link d-inline-flex align-center ga-1 ms-auto text-body-medium font-weight-medium text-decoration-none"
        >
          {{ t('training.viewAll') }}
          <v-icon icon="mdi-arrow-right" size="16" class="training-puzzle-heading__arrow" />
        </NuxtLink>
      </div>

      <TrainingPuzzleSelector :items="setItems(puzzle.id)" />
    </section>

    <TrainingPlaylistDialog v-model="dialogOpen" :playlist="editTarget" @saved="refreshPlaylists" />

    <v-dialog :model-value="!!deleteTarget" max-width="440" @update:model-value="deleteTarget = null">
      <v-card>
        <v-card-item>
          <template #prepend>
            <v-icon icon="mdi-alert-outline" color="error" />
          </template>
          <v-card-title>{{ t('training.playlists.deleteConfirmTitle') }}</v-card-title>
        </v-card-item>
        <v-card-text class="text-body-medium text-medium-emphasis">
          {{ t('training.playlists.deleteConfirmText', { name: deleteTarget?.name ?? '' }) }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn :disabled="deleting" @click="deleteTarget = null">
            {{ t('training.playlists.cancel') }}
          </v-btn>
          <v-btn color="error" variant="flat" rounded="xl" :loading="deleting" @click="confirmDelete">
            {{ t('training.playlists.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped lang="scss">
.training-puzzle-heading__icon-box {
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.training-puzzle-heading__icon {
  width: 24px;
  height: 24px;
  color: rgb(var(--v-theme-primary));
}

.training-puzzle-heading__link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-primary));

    .training-puzzle-heading__arrow {
      transform: translateX(3px);
    }
  }
}

.training-puzzle-heading__arrow {
  transition: transform 0.2s ease;
}
</style>
