<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'

const { t, locale, locales, setLocale } = useI18n()

usePageSeo('settings')

const theme = useTheme()
const migration = useMigrationStore()
const config = useConfigStore()
const loader = useLoader()

const availableLocales = computed(() =>
  (locales.value as { code: string; name?: string }[]).map((l) => ({
    code: l.code,
    name: l.name ?? l.code,
  })),
)

const currentLocale = computed({
  get: () => locale.value,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (code: string) => setLocale(code as any),
})

const currentTheme = computed({
  get: () => config.theme,
  set: (name: string) => {
    theme.change(name, {
        origin: '50% 50%'
    })
    config.theme = name
  },
})

const resetDialog = ref(false)
const resetting = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })

async function confirmReset() {
  resetting.value = true
  loader.start()
  try {
    await migration.resetAndLoad()
    snackbar.text = t('settings.data.resetSuccess')
    snackbar.color = 'success'
  } catch (err) {
    console.error(err)
    snackbar.text = t('settings.data.resetError')
    snackbar.color = 'error'
  } finally {
    snackbar.show = true
    resetting.value = false
    resetDialog.value = false
    loader.end()
  }
}
</script>

<template>
  <v-container class="py-6" style="max-width: 720px">
    <h1 class="text-h5 font-weight-bold mb-6">{{ t('settings.title') }}</h1>

    <!-- Appearance -->
    <v-card class="mb-4">
      <v-card-item>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon icon="mdi-palette-outline" size="small" />
          {{ t('settings.appearance.title') }}
        </v-card-title>
        <v-card-subtitle>{{ t('settings.appearance.subtitle') }}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <div class="mb-6">
          <div class="text-subtitle-2 mb-2">{{ t('settings.appearance.theme') }}</div>
          <v-btn-toggle
            id="theme-toggle"
            v-model="currentTheme"
            mandatory
            divided
            rounded="xl"
            color="primary"
            variant="outlined"
            density="comfortable"
          >
            <v-btn value="dark" prepend-icon="mdi-weather-night">
              {{ t('settings.appearance.themeDark') }}
            </v-btn>
            <v-btn value="light" prepend-icon="mdi-white-balance-sunny">
              {{ t('settings.appearance.themeLight') }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <v-select
          v-model="currentLocale"
          :items="availableLocales"
          item-title="name"
          item-value="code"
          :label="t('settings.appearance.language')"
          prepend-inner-icon="mdi-translate"
          variant="outlined"
          rounded="lg"
          hide-details
        />
      </v-card-text>
    </v-card>

    <!-- Data -->
    <v-card class="mb-4">
      <v-card-item>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon icon="mdi-database-outline" size="small" />
          {{ t('settings.data.title') }}
        </v-card-title>
        <v-card-subtitle>{{ t('settings.data.subtitle') }}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ t('settings.data.resetDescription') }}
        </p>
        <v-btn
          color="error"
          variant="tonal"
          rounded="xl"
          prepend-icon="mdi-delete-outline"
          @click="resetDialog = true"
        >
          {{ t('settings.data.reset') }}
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Reset confirmation -->
    <v-dialog v-model="resetDialog" max-width="440" persistent>
      <v-card>
        <v-card-item>
          <template #prepend>
            <v-icon icon="mdi-alert-outline" color="error" />
          </template>
          <v-card-title>{{ t('settings.data.resetConfirmTitle') }}</v-card-title>
        </v-card-item>
        <v-card-text class="text-body-2 text-medium-emphasis">
          {{ t('settings.data.resetConfirmText') }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn :disabled="resetting" @click="resetDialog = false">
            {{ t('settings.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="resetting"
            @click="confirmReset"
          >
            {{ t('settings.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>
