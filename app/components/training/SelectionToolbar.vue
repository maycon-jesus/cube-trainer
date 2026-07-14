<template>
  <v-slide-y-reverse-transition>
    <div v-if="count > 0" class="selection-toolbar d-flex justify-center px-4">
      <v-card
        class="selection-toolbar__card d-flex flex-wrap align-center ga-3 px-4 py-3"
        rounded="xl"
        elevation="8"
      >
        <v-btn
          icon
          variant="text"
          size="small"
          :aria-label="t('training.selection.clear')"
          @click="emit('clear')"
        >
          <v-icon icon="mdi-close" />
          <v-tooltip activator="parent" location="top">{{ t('training.selection.clear') }}</v-tooltip>
        </v-btn>

        <span class="text-body-1 font-weight-medium">
          {{ t('training.selection.count', count) }}
        </span>

        <v-spacer />

        <v-btn
          variant="tonal"
          rounded="pill"
          prepend-icon="mdi-playlist-plus"
          disabled
        >
          {{ t('training.selection.createPlaylist') }}
          <v-tooltip activator="parent" location="top">{{ t('training.selection.comingSoon') }}</v-tooltip>
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-play"
          @click="emit('train')"
        >
          {{ t('training.selection.trainSelected') }}
        </v-btn>
      </v-card>
    </div>
  </v-slide-y-reverse-transition>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  count: number
}>()

const emit = defineEmits<{
  (e: 'train' | 'clear'): void
}>()
</script>

<style scoped>
.selection-toolbar {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none;
}

.selection-toolbar__card {
  width: 100%;
  max-width: 720px;
  pointer-events: auto;
}
</style>
