<template>
    <CustomCard
        :title="t('settings.appearance.title')"
        :subtitle="t('settings.appearance.subtitle')"
        icon="mdi-palette-outline"
    >
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
    </CustomCard>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'

const { t, locale, locales, setLocale } = useI18n()

const theme = useTheme()
const config = useConfigStore()

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
            origin: '50% 50%',
        })
        config.theme = name
    },
})
</script>
