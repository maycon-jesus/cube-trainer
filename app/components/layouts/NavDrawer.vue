<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

const { t } = useI18n()
const { public: { buyMeCoffeeUrl } } = useRuntimeConfig()

const layoutState = useLayoutStateStore()

const navItems = computed<{
  title: string
  icon: string
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined
}[]>(() => [
  { title: t('nav.play'), icon: 'mdi-timer-outline', to: {name: 'index'} },
  { title: t('nav.training'), icon: 'mdi-dumbbell', to: {name: 'training'} },
  { title: t('nav.patterns'), icon: 'mdi-view-grid', to: {name: 'patterns'} },
  { title: t('nav.sessions'), icon: 'mdi-folder-multiple', to: {name: 'sessions'} },
  { title: t('nav.history'), icon: 'mdi-history', to: {name: 'history'} },
  { title: t('nav.stats'), icon: 'mdi-chart-bar', to: {name: 'stats'} },
  { title: t('nav.settings'), icon: 'mdi-cog', to: {name: 'settings'} },
])
</script>

<template>
  <v-navigation-drawer v-model="layoutState.drawerOpen">
    <v-list nav>
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
