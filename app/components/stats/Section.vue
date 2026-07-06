<template>
  <v-card class="stats-section h-100" :class="{ 'stats-section--glow': glow }">
    <div class="d-flex align-center justify-space-between px-4 pt-4 pb-2 ga-2">
      <div class="stats-section__title text-medium-emphasis">{{ title }}</div>
      <slot name="actions" />
    </div>
    <div class="px-4 pb-4">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  glow?: boolean
}>()
</script>

<style scoped>
.stats-section {
  border-radius: 16px;
}
.stats-section__title {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.stats-section--glow {
  position: relative;
  overflow: hidden;
}
.stats-section--glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 100% 0%, rgba(var(--v-theme-primary), 0.12), transparent 60%);
  pointer-events: none;
}
</style>
