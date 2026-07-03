<script setup lang="ts">
import logo from '~/assets/logo-color.svg';
import { useConfigStore } from '~/stores/db/config';

const theme = useTheme()
const configStore = useConfigStore()
const { t } = useI18n()

const layoutState = useLayoutStateStore()

onMounted(() => {
  useLoader().start()
  useMigrationStore().load()
    .then(() => {
      theme.change(configStore.theme, true)
      useLoader().end()
    })
    .catch(err => {
      console.error(err)
    })
})

const wakeLock = ref<WakeLockSentinel|null>(null);

async function requestWakeLock() {
  try {
    wakeLock.value = await navigator.wakeLock.request('screen');
  } catch (err: any) {
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

onBeforeMount(()=>{
  requestWakeLock()
})
onBeforeUnmount(()=>{
  releaseWakeLock()
})
</script>

<template>
  <v-app>
    <Loading />
    <v-app-bar flat density="comfortable" color="surface">
      <template #prepend>
        <v-app-bar-nav-icon @click="layoutState.drawerOpen = !layoutState.drawerOpen" />
      </template>
      <v-app-bar-title>
        <div>
        <NuxtLink to="/" class="font-weight-bold d-flex align-center flex-nowrap text-no-wrap flex-row no-decoration">
          <v-img :src="logo" alt="logo" width="28" height="28" class="mr-2 flex-grow-0" /><span>{{ t('app.title')
            }}</span>
        </NuxtLink>
      </div>
      </v-app-bar-title>
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