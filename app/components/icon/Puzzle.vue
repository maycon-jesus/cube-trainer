<template>
  <component :is="puzzleIdComputed"></component>
</template>

<script lang="ts" setup>
const icons = {
  Default: defineAsyncComponent(() => import('./puzzle/Default.vue')),
  "2x2x2": defineAsyncComponent(() => import('./puzzle/Cube2x2x2.vue')),
  "3x3x3": defineAsyncComponent(() => import('./puzzle/Cube3x3x3.vue')),
  "4x4x4": defineAsyncComponent(() => import('./puzzle/Cube4x4x4.vue')),
  "5x5x5": defineAsyncComponent(() => import('./puzzle/Cube5x5x5.vue')),
  "6x6x6": defineAsyncComponent(() => import('./puzzle/Cube6x6x6.vue')),
  "7x7x7": defineAsyncComponent(() => import('./puzzle/Cube7x7x7.vue')),
  megaminx: defineAsyncComponent(() => import('./puzzle/Megaminx.vue')),
  "mirror-2x2x2": defineAsyncComponent(() => import('./puzzle/Mirror2x2.vue')),
  "mirror-3x3x3": defineAsyncComponent(() => import('./puzzle/Mirror3x3.vue')),
  pyraminx: defineAsyncComponent(() => import('./puzzle/Pyraminx.vue')),
  "gear-2x2x2": defineAsyncComponent(() => import('./puzzle/GearCube2x2x2.vue')),
  "gear-3x3x3": defineAsyncComponent(() => import('./puzzle/GearCube3x3x3.vue')),
  fto: defineAsyncComponent(() => import('./puzzle/FTO.vue')),
} as Record<string, Component>

const props = defineProps<{
  puzzleId: string
}>()

const puzzleIdComputed = computed(() => {
  if (icons[props.puzzleId]) {
    return icons[props.puzzleId]
  }
  return icons.Default
})
</script>