<script setup lang="ts">
import { createCube333, type Cube333 } from '~~/lib/cube/333'

const props = defineProps<{ scramble: string }>()

// Build the unfolded net for the given scramble as a data-URI SVG (classic
// cross: U on top, L F R B middle, D bottom), used directly as an <img src>.
const src = computed(() => {
  const cube: Cube333 = createCube333()
  const moves = props.scramble.trim().split(/\s+/).filter(Boolean)
  if (moves.length) cube.applyMoves(moves)
  return cube.renderSvgDataUri()
})
</script>

<template>
  <img class="net" :src="src" alt="Scramble preview" >
</template>

<style scoped>
.net {
  display: inline-block;
}
</style>
