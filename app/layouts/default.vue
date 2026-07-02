<script setup lang="ts">
import logo from '~/assets/logo-color.svg';
import { useConfigStore } from '~/stores/db/config';

const theme = useTheme()
const { newScramble } = useScramble()
const { t } = useI18n()

const layoutState = useLayoutStateStore()

onMounted(() => {
  useLoader().start()
  useMigrationStore().load()
    .then(() => {
      theme.change(useConfigStore().selectedTheme, true)
      useLoader().end()
    })
    .catch(err => {
      console.error(err)
    })
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
      <template #append>
        <v-btn variant="text" prepend-icon="mdi-refresh" @click="newScramble">{{ t('actions.newScramble') }}</v-btn>
      </template>
    </v-app-bar>

    <LayoutsNavDrawer />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.no-decoration {
  text-decoration: none;
  color: inherit;
}
</style>