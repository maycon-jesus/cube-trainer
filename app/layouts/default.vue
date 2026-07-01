<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore } from '~/stores/db/sessions';
import logo from '~/assets/logo-color.svg';

const { newScramble } = useScramble()
const { t } = useI18n() 

onMounted(()=>{
  useLoader().start()
  Promise.all([
    useConfigStore().load(),
    useSessionsStore().seed(),
    useSessionsStore().refresh()
  ]).then(()=>{
    useLoader().end()
  })
})

</script>

<template>
  <v-app>
    <Loading/>
    <v-app-bar flat density="comfortable" color="surface">
      <div>
        <NuxtLink class="font-weight-bold d-flex align-center flex-nowrap text-no-wrap flex-row pl-4">
          <v-img :src="logo" alt="logo" width="28" height="28" class="mr-2 flex-grow-0" /><span>{{ t('app.title') }}</span>
        </NuxtLink>
      </div>
      <template #append>
        <v-btn variant="text" prepend-icon="mdi-refresh" @click="newScramble">{{ t('actions.newScramble') }}</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
