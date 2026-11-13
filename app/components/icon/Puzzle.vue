<template>
  <component :is="puzzleIdComputed"></component>
</template>

<script lang="ts" setup>
const icons = {
  "2x2x2": defineAsyncComponent(() => import('./puzzle/Cube2x2x2.vue')),
  "3x3x3": defineAsyncComponent(() => import('./puzzle/Cube3x3x3.vue')),
  "4x4x4": defineAsyncComponent(() => import('./puzzle/Cube4x4x4.vue')),
  "5x5x5": defineAsyncComponent(() => import('./puzzle/Cube5x5x5.vue')),
  "6x6x6": defineAsyncComponent(() => import('./puzzle/Cube6x6x6.vue')),
  "7x7x7": defineAsyncComponent(() => import('./puzzle/Cube7x7x7.vue')),
  Megaminx: defineAsyncComponent(() => import('./puzzle/Megaminx.vue')),
  Mirror2x2: defineAsyncComponent(() => import('./puzzle/Mirror2x2.vue')),
  Mirror3x3: defineAsyncComponent(() => import('./puzzle/Mirror3x3.vue')),
  Pyraminx: defineAsyncComponent(() => import('./puzzle/Pyraminx.vue')),
  GearCube2x2x2: defineAsyncComponent(() => import('./puzzle/GearCube2x2x2.vue')),
  GearCube3x3x3: defineAsyncComponent(() => import('./puzzle/GearCube3x3x3.vue')),
  FTO: defineAsyncComponent(() => import('./puzzle/FTO.vue')),
  Puzzle: defineAsyncComponent(() => import('./puzzle/Puzzle.vue')),
} as Record<string, Component>

const props = defineProps<{
  puzzleId: string
}>()

const puzzleIdComputed = computed(() => {
  if (icons[props.puzzleId]) {
    return icons[props.puzzleId]
  }
  return icons.Puzzle
})
</script>