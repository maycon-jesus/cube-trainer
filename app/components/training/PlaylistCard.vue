<template>
  <v-card class="playlist-card d-flex flex-column h-100" rounded="lg" border flat>
    <div class="pa-4 d-flex flex-column flex-fill">
      <div class="d-flex align-center ga-3 mb-3">
        <span class="playlist-card__icon-box d-inline-flex align-center justify-center flex-shrink-0 rounded-lg">
          <component :is="puzzle?.icon" v-if="puzzle?.icon" class="playlist-card__icon" />
        </span>
        <div class="flex-fill" style="min-width: 0;">
          <h3 class="text-title-medium font-weight-bold mb-0 text-truncate">{{ playlist.name }}</h3>
          <span class="text-body-medium text-medium-emphasis">{{ puzzleName }}</span>
        </div>
      </div>

      <v-chip size="small" variant="tonal" class="align-self-start mb-4" prepend-icon="mdi-view-grid-outline">
        {{ t('training.caseCount', playlist.trainingCases.length) }}
      </v-chip>

      <div class="d-flex align-center justify-end ga-2 mt-auto">
        <v-btn
          icon="mdi-pencil-outline"
          variant="text"
          size="small"
          :aria-label="t('training.playlists.edit')"
          @click="$emit('edit', playlist)"
        />
        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          size="small"
          color="error"
          :aria-label="t('training.playlists.delete')"
          @click="$emit('delete', playlist)"
        />
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-play"
          @click="$emit('train', playlist)"
        >
          {{ t('training.train') }}
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';
import type { TrainingPlaylist } from '~/stores/db/trainingPlaylists';

const { t } = useI18n()

const props = defineProps<{
  playlist: TrainingPlaylist
}>()

defineEmits<{
  (e: 'train' | 'edit' | 'delete', playlist: TrainingPlaylist): void
}>()

const puzzle = computed(() => cubesDefinition[props.playlist.puzzleId])
const puzzleName = computed(() => (puzzle.value ? t(`cube.${puzzle.value.id}`) : props.playlist.puzzleId))
</script>

<style scoped lang="scss">
@use '../../assets/mixins' as mixins;

.playlist-card {
  @include mixins.hover-primary-border;
}

.playlist-card__icon-box {
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.playlist-card__icon {
  width: 24px;
  height: 24px;
  color: rgb(var(--v-theme-primary));
}
</style>
