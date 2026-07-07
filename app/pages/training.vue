<script setup lang="ts">
const { t } = useI18n()

usePageSeo('training')
</script>

<template>
  <v-container class="py-6" style="max-width: 720px">
    <h1 class="text-h5 font-weight-bold mb-6">{{ t('nav.training') }}</h1>

    <v-card class="d-flex flex-column align-center justify-center text-center py-12 ga-3">
      <v-icon icon="mdi-hammer-wrench" size="64" class="text-medium-emphasis" />
      <div class="text-h6 text-medium-emphasis">{{ t('common.underConstruction') }}</div>
    </v-card>
  </v-container>
</template>
