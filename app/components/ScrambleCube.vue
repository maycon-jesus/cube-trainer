<script setup lang="ts">
import { createCube333, type Cube333 } from '~~/lib/cube/333'
import { ColorHex } from '~~/lib/cube/cube'

const props = defineProps<{ scramble: string }>()

// Build the unfolded net for the given scramble. The render() output is keyed
// by face letter; we lay them out in the classic cross:
//        U
//      L F R B
//        D
const net = computed(() => {
  const cube: Cube333 = createCube333()
  const moves = props.scramble.trim().split(/\s+/).filter(Boolean)
  if (moves.length) cube.applyMoves(moves)
  const r = cube.render()
  return {
    rows: [
      [null, r.U, null, null],
      [r.L, r.F, r.R, r.B],
      [null, r.D, null, null],
    ],
  }
})

function hex(color: number) {
  return ColorHex[color as keyof typeof ColorHex]
}
</script>

<template>
  <div class="net">
    <div v-for="(row, ri) in net.rows" :key="ri" class="net-row">
      <div v-for="(face, fi) in row" :key="fi" class="net-cell">
        <div v-if="face" class="face">
          <div v-for="(line, li) in face" :key="li" class="face-row">
            <span
              v-for="(piece, pi) in line"
              :key="pi"
              class="sticker"
              :style="{ background: hex(piece) }"
            />
          </div>
        </div>
        <div v-else class="face-gap" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.net {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}
.net-row {
  display: flex;
  gap: 4px;
}
.face,
.face-gap {
  width: 48px;
  height: 48px;
}
.face {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.face-row {
  display: flex;
  flex: 1;
  gap: 1px;
}
.sticker {
  flex: 1;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.45);
}
</style>
