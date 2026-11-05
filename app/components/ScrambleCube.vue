<script setup lang="ts">
import type { CubeData } from '~~/lib/cube/cubesDefinition'

const props = withDefaults(defineProps<{ scramble: string, cubeDefinition?: CubeData, alt?: string }>(), {
  alt: 'Scramble preview',
  cubeDefinition: undefined,
})

// Build the unfolded net for the given scramble as a data-URI SVG (classic
// cross: U on top, L F R B middle, D bottom), used directly as an <img src>.
// The engine always comes from the puzzle definition.
const src = computed(() => {
  const cube = props.cubeDefinition?.createEngine?.()
  if (!cube) return ''
  const moves = props.scramble.trim().split(/\s+/).filter(Boolean)
  if (moves.length) cube.applyMoves(moves)
  return cube.renderSvgDataUri?.() ?? ''
})
</script>

<template>
  <img class="net" :src="src" :alt="props.alt" >
</template>

<style scoped>
.net {
  display: inline-block;
}
</style>
