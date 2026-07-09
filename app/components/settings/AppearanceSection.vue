<template>
    <CustomCard
        :title="t('settings.appearance.title')"
        :subtitle="t('settings.appearance.subtitle')"
        icon="mdi-palette-outline"
    >
        <div class="mb-6">
            <div class="text-subtitle-2 mb-3">{{ t('settings.appearance.theme') }}</div>

            <div ref="gridEl" class="theme-grid">
                <button
                    v-for="option in visibleThemes"
                    :key="option.value"
                    type="button"
                    class="theme-tile rounded-lg pa-2"
                    :class="{ 'theme-tile--active': currentTheme === option.value }"
                    :aria-pressed="currentTheme === option.value"
                    @click="currentTheme = option.value"
                >
                    <SettingsThemePreview :colors="option.colors" />

                    <div class="d-flex align-center ga-2 mt-2 px-1">
                        <v-icon :icon="option.icon" size="18" />
                        <span class="text-body-2 font-weight-medium">{{ t(option.label) }}</span>
                        <v-spacer />
                        <v-icon
                            v-if="currentTheme === option.value"
                            icon="mdi-check-circle"
                            color="primary"
                            size="18"
                        />
                    </div>
                </button>
            </div>

            <div v-if="canExpand" class="d-flex justify-center mt-3">
                <v-btn
                    variant="text"
                    color="primary"
                    rounded="xl"
                    :append-icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="expanded = !expanded"
                >
                    {{ expanded ? t('settings.appearance.showLess') : t('settings.appearance.showMore', { count: hiddenCount }) }}
                </v-btn>
            </div>
        </div>

        <div class="text-subtitle-2 mb-3">{{ t('settings.appearance.language') }}</div>
        <v-select
            v-model="currentLocale"
            :items="availableLocales"
            item-title="name"
            item-value="code"
            prepend-inner-icon="mdi-translate"
            variant="outlined"
            rounded="lg"
            density="comfortable"
            hide-details
        />
    </CustomCard>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'
import { themeOptions as themeOptionDefs, themes } from '~~/config/themes'

const { t, locale, locales, setLocale } = useI18n()

const theme = useTheme()
const config = useConfigStore()

const themeOptions = themeOptionDefs.map((option) => ({
    ...option,
    colors: themes[option.value].colors as Record<string, string>,
}))

// Minimum tile width and gap; keep in sync with the `.theme-grid` styles below.
const TILE_MIN_WIDTH = 140
const GRID_GAP = 12
const VISIBLE_ROWS = 2

const gridEl = ref<HTMLElement | null>(null)
const columns = ref(1)
const expanded = ref(false)

function measureColumns() {
    const el = gridEl.value
    if (!el) return
    const cols = Math.floor((el.clientWidth + GRID_GAP) / (TILE_MIN_WIDTH + GRID_GAP))
    columns.value = Math.max(1, cols)
}

let resizeObserver: ResizeObserver | undefined
onMounted(() => {
    measureColumns()
    resizeObserver = new ResizeObserver(measureColumns)
    if (gridEl.value) resizeObserver.observe(gridEl.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const collapsedCount = computed(() => columns.value * VISIBLE_ROWS)
const canExpand = computed(() => themeOptions.length > collapsedCount.value)
const hiddenCount = computed(() => themeOptions.length - collapsedCount.value)
const visibleThemes = computed(() =>
    expanded.value ? themeOptions : themeOptions.slice(0, collapsedCount.value),
)

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

<style scoped>
.theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
}

.theme-tile {
    display: block;
    width: 100%;
    text-align: left;
    background: transparent;
    border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

.theme-tile:hover {
    border-color: rgba(var(--v-theme-primary), 0.5);
}

.theme-tile--active {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.06);
}
</style>
