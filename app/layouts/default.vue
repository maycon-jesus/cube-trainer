<script setup lang="ts">
import logo from '~/assets/logo-color.svg';
import { useConfigStore } from '~/stores/db/config';

const theme = useTheme()
const configStore = useConfigStore()
const { t } = useI18n()
const localePath = useLocalePath()

const layoutState = useLayoutStateStore()

onMounted(() => {
  useLoader().start()
  useMigrationStore().load()
    .then(() => {
      if(configStore.theme){
        theme.change(configStore.theme, true)
      }
      useLoader().end()
    })
    .catch(err => {
      console.error(err)
    })
})

const wakeLock = ref<WakeLockSentinel|null>(null);
const wakeLockSupported = ref(false);
const wakeLockActive = computed(() => wakeLock.value !== null)

const wakeLockTooltip = computed(() => {
  if (!wakeLockSupported.value) return t('common.wakeLock.unsupported')
  return wakeLockActive.value ? t('common.wakeLock.active') : t('common.wakeLock.inactive')
})

async function requestWakeLock() {
  if (!wakeLockSupported.value || wakeLock.value !== null) return
  try {
    const sentinel = await navigator.wakeLock.request('screen');
    // The browser releases the lock on its own when the tab is hidden.
    sentinel.addEventListener('release', () => {
      if (wakeLock.value === sentinel) wakeLock.value = null
    })
    wakeLock.value = sentinel;
  } catch (err: unknown) {
    console.error(err)
  }
}

// Releasing a wake lock
async function releaseWakeLock() {
  if (wakeLock.value !== null) {
    await wakeLock.value.release();
    wakeLock.value = null;
  }
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') requestWakeLock()
}

onBeforeMount(()=>{
  wakeLockSupported.value = import.meta.client && 'wakeLock' in navigator
  requestWakeLock()
  if (import.meta.client) document.addEventListener('visibilitychange', onVisibilityChange)
})
onBeforeUnmount(()=>{
  if (import.meta.client) document.removeEventListener('visibilitychange', onVisibilityChange)
  releaseWakeLock()
})
</script>

<template>
  <v-app>
    <AppLoading />
    <v-app-bar flat density="comfortable" color="surface">
      <template #prepend>
        <v-app-bar-nav-icon @click="layoutState.drawerOpen = !layoutState.drawerOpen" />
      </template>
      <v-app-bar-title>
        <div>
        <NuxtLink :to="localePath('/')" class="font-weight-bold d-flex align-center flex-nowrap text-no-wrap flex-row no-decoration">
          <v-img :src="logo" alt="logo" width="28" height="28" class="mr-2 flex-grow-0" /><span>{{ t('app.title')
            }}</span>
        </NuxtLink>
      </div>
      </v-app-bar-title>
      <template #append>
        <span class="d-inline-flex align-center mr-2">
          <v-icon
            :icon="wakeLockActive ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off-outline'"
            :color="wakeLockActive ? 'primary' : undefined"
            :class="{ 'text-medium-emphasis': !wakeLockActive }"
          />
          <v-tooltip activator="parent" location="bottom">{{ wakeLockTooltip }}</v-tooltip>
        </span>
      </template>
    </v-app-bar>

    <LayoutsNavDrawer />

    <v-main :style="{minHeight: '100vh'}">
      <slot />
    </v-main>

    <LayoutsFooter />
  </v-app>
</template>

<style lang="scss" scoped>
.no-decoration {
  text-decoration: none;
  color: inherit;
}
</style>