<script setup lang="ts">
const { t } = useI18n()

const layoutState = useLayoutStateStore()

const navItems = computed(() => [
  { title: t('nav.play'), icon: 'mdi-play', to: '/' },
  { title: t('nav.settings'), icon: 'mdi-cog', to: '/settings' },
])
</script>

<template>
  <v-navigation-drawer v-model="layoutState.drawerOpen">
    <v-list nav>
      <v-list-item v-for="item in navItems" :key="item.to" :to="item.to" :prepend-icon="item.icon"
        :title="item.title" />
    </v-list>
  </v-navigation-drawer>
</template>
