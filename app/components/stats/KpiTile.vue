<template>
  <v-card class="kpi-tile h-100">
    <v-card-text class="pa-4">
      <div class="kpi-tile__icon mb-4" :style="{ background: gradient }">
        <v-icon :icon="icon" size="20" color="white" />
      </div>
      <div class="kpi-tile__value">{{ value }}</div>
      <div class="kpi-tile__label text-medium-emphasis">{{ label }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { IconValue } from 'vuetify/lib/composables/icons.mjs';

const props = withDefaults(defineProps<{
  icon: IconValue
  value: string | number
  label: string
  color?: string
}>(), {
  color: '#7C6CF5',
})

const gradient = computed(() => `linear-gradient(135deg, ${props.color}, ${props.color}cc)`)
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.kpi-tile {
  border-radius: 16px;
}
.kpi-tile__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-tile__value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  font-family: vars.$font-family-mono;
}
.kpi-tile__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 2px;
}
</style>
