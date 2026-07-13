<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

const { t } = useI18n()
const localePath = useLocalePath()
const { public: { buyMeCoffeeUrl } } = useRuntimeConfig()

const layoutState = useLayoutStateStore()

const navItems = computed<{
  title: string
  icon: string
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined
}[]>(() => [
  { title: t('nav.play'), icon: 'mdi-timer-outline', to: localePath({ name: 'index' }) },
  { title: t('nav.training-algorithms'), icon: 'mdi-dumbbell', to: localePath({ name: 'training' }) },
  { title: t('nav.patterns'), icon: 'mdi-view-grid', to: localePath({ name: 'patterns' }) },
  { title: t('nav.sessions'), icon: 'mdi-folder-multiple', to: localePath({ name: 'sessions' }) },
  { title: t('nav.history'), icon: 'mdi-history', to: localePath({ name: 'history' }) },
  { title: t('nav.stats'), icon: 'mdi-chart-bar', to: localePath({ name: 'stats' }) },
  { title: t('nav.settings'), icon: 'mdi-cog', to: localePath({ name: 'settings' }) },
])
</script>

<template>
  <v-navigation-drawer v-model="layoutState.drawerOpen">
    <v-list nav color="primary" variant="flat">
      <v-list-item
v-for="item in navItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
        :title="item.title" />
    </v-list>

    <template #append>
      <v-list nav>
        <v-list-item
:href="buyMeCoffeeUrl" target="_blank" rel="noopener noreferrer" prepend-icon="mdi-coffee"
          :title="t('footer.buyMeCoffee')" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
