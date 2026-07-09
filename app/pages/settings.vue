<script setup lang="ts">
const { t } = useI18n()

usePageSeo('settings')
</script>

<template>
  <v-container class="py-6">
    <h1 class="text-h5 font-weight-bold mb-6">{{ t('settings.title') }}</h1>

    <v-row>
      <v-col cols="12">
        <SettingsAppearanceSection />
      </v-col>
      <v-col cols="12">
        <SettingsDataSection />
      </v-col>
    </v-row>
  </v-container>
</template>
