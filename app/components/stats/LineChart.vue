<template>
  <div class="line-chart">
    <svg
      v-if="series.length"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="xMidYMid meet"
      class="line-chart__svg"
      role="img"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- horizontal gridlines + y labels -->
      <g v-for="tick in yTicksData" :key="`y-${tick.v}`">
        <line
          :x1="padL" :x2="W - padR" :y1="tick.y" :y2="tick.y"
          class="line-chart__grid"
        />
        <text :x="padL - 8" :y="tick.y + 4" text-anchor="end" class="line-chart__label">
          {{ yFormat ? yFormat(tick.v) : tick.v }}
        </text>
      </g>

      <!-- x labels -->
      <text
        v-for="tick in xTicksData" :key="`x-${tick.x}`"
        :x="tick.x" :y="H - padB + 18" text-anchor="middle" class="line-chart__label"
      >
        {{ xFormat ? xFormat(tick.v) : tick.v }}
      </text>

      <!-- area -->
      <path v-if="area && series.length > 1" :d="areaPath" :fill="`url(#${gradientId})`" />
      <!-- line -->
      <path
        v-if="series.length > 1"
        :d="linePath" fill="none" :stroke="color" stroke-width="2"
        stroke-linejoin="round" stroke-linecap="round"
      />
      <!-- dots -->
      <template v-if="dots">
        <circle
          v-for="(p, i) in projected" :key="i"
          :cx="p.x" :cy="p.y" :r="series.length > 40 ? 2 : 4"
          :fill="dotFill" :stroke="color" stroke-width="2"
        />
      </template>
    </svg>

    <div v-else class="line-chart__empty text-medium-emphasis">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  series: { x: number, y: number }[]
  height?: number
  color?: string
  area?: boolean
  dots?: boolean
  yFormat?: (v: number) => string
  xFormat?: (v: number) => string
  yTicks?: number
  xTickValues?: number[]
  emptyText?: string
}>(), {
  height: 260,
  color: 'rgb(var(--v-theme-primary))',
  area: true,
  dots: true,
  yTicks: 5,
  emptyText: '',
})

const W = 700
const H = computed(() => props.height)
const padL = 56
const padR = 24
const padT = 16
const padB = 32

const gradientId = `lc-grad-${Math.random().toString(36).slice(2, 9)}`
const dotFill = 'rgb(var(--v-theme-surface))'

const bounds = computed(() => {
  const xs = props.series.map((p) => p.x)
  const ys = props.series.map((p) => p.y)
  let minY = Math.min(...ys)
  let maxY = Math.max(...ys)
  if (minY === maxY) {
    minY -= 1
    maxY += 1
  } else {
    const pad = (maxY - minY) * 0.1
    minY -= pad
    maxY += pad
  }
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  return { minX, maxX: maxX === minX ? minX + 1 : maxX, minY, maxY }
})

function projectX(x: number): number {
  const { minX, maxX } = bounds.value
  return padL + ((x - minX) / (maxX - minX)) * (W - padL - padR)
}
function projectY(y: number): number {
  const { minY, maxY } = bounds.value
  return padT + (1 - (y - minY) / (maxY - minY)) * (H.value - padT - padB)
}

const projected = computed(() =>
  props.series.map((p) => ({ x: projectX(p.x), y: projectY(p.y) })),
)

const linePath = computed(() =>
  projected.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '),
)

const areaPath = computed(() => {
  const pts = projected.value
  if (pts.length < 2) return ''
  const base = H.value - padB
  return `${linePath.value} L${pts[pts.length - 1]!.x},${base} L${pts[0]!.x},${base} Z`
})

const yTicksData = computed(() => {
  const { minY, maxY } = bounds.value
  const n = props.yTicks
  return Array.from({ length: n }, (_, i) => {
    const v = minY + ((maxY - minY) * i) / (n - 1)
    return { v, y: projectY(v) }
  })
})

const xTicksData = computed(() => {
  const values = props.xTickValues ?? [props.series[0]!.x, props.series[props.series.length - 1]!.x]
  const seen = new Set<number>()
  return values
    .filter((v) => (seen.has(v) ? false : (seen.add(v), true)))
    .map((v) => ({ v, x: projectX(v) }))
})
</script>

<style scoped>
.line-chart__svg {
  width: 100%;
  height: auto;
  display: block;
}
.line-chart__grid {
  stroke: rgba(var(--v-border-color), 0.12);
  stroke-dasharray: 3 4;
}
.line-chart__label {
  fill: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.line-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  font-size: 0.9rem;
}
</style>
