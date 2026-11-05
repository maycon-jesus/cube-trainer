import { defineAsyncComponent, type Component } from 'vue'

// Mapa nome-do-ícone -> componente. `lib/cube/cubesDefinition.ts` guarda só o nome (string),
// e a UI resolve o componente aqui.
export const cubeIcons: Record<string, Component> = {
  Cube2x2x2: defineAsyncComponent(() => import('./Cube2x2x2.vue')),
  Cube3x3x3: defineAsyncComponent(() => import('./Cube3x3x3.vue')),
  Cube4x4x4: defineAsyncComponent(() => import('./Cube4x4x4.vue')),
  Cube5x5x5: defineAsyncComponent(() => import('./Cube5x5x5.vue')),
  Cube6x6x6: defineAsyncComponent(() => import('./Cube6x6x6.vue')),
  Cube7x7x7: defineAsyncComponent(() => import('./Cube7x7x7.vue')),
  Megaminx: defineAsyncComponent(() => import('./Megaminx.vue')),
  Mirror2x2: defineAsyncComponent(() => import('./Mirror2x2.vue')),
  Mirror3x3: defineAsyncComponent(() => import('./Mirror3x3.vue')),
  Pyraminx: defineAsyncComponent(() => import('./Pyraminx.vue')),
  GearCube2x2x2: defineAsyncComponent(() => import('./GearCube2x2x2.vue')),
  GearCube3x3x3: defineAsyncComponent(() => import('./GearCube3x3x3.vue')),
  FTO: defineAsyncComponent(() => import('./FTO.vue')),
  Puzzle: defineAsyncComponent(() => import('./Puzzle.vue')),
}
