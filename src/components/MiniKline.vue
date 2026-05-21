<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  width: { type: Number, default: 320 },
  height: { type: Number, default: 110 },
  upColor: { type: String, default: 'var(--gdi-up)' },
  downColor: { type: String, default: 'var(--gdi-down)' }
})

const path = computed(() => {
  const d = props.data
  if (!d || d.length < 2) return { line: '', area: '', pts: [] }
  const min = Math.min(...d)
  const max = Math.max(...d)
  const range = max - min || 1
  const padY = 8
  const usableH = props.height - padY * 2
  const stepX = props.width / (d.length - 1)
  const pts = d.map((v, i) => {
    const x = i * stepX
    const y = padY + usableH - ((v - min) / range) * usableH
    return { x, y, v }
  })
  const line = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
  const area = `${line} L${props.width} ${props.height} L0 ${props.height} Z`
  return { line, area, pts }
})

const trendUp = computed(() => {
  if (!props.data || props.data.length < 2) return true
  return props.data[props.data.length - 1] >= props.data[0]
})

const trendColor = computed(() => (trendUp.value ? props.upColor : props.downColor))
const gradId = `kg-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" class="mini-kline" :width="width" :height="height" preserveAspectRatio="none">
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="trendColor" stop-opacity="0.32" />
        <stop offset="100%" :stop-color="trendColor" stop-opacity="0" />
      </linearGradient>
      <pattern id="kline-grid" x="0" y="0" width="40" height="22" patternUnits="userSpaceOnUse">
        <path d="M40 0 H0 V22" stroke="var(--gdi-line)" stroke-width="0.6" fill="none" opacity="0.6" />
      </pattern>
    </defs>
    <rect x="0" y="0" :width="width" :height="height" fill="url(#kline-grid)" />
    <path :d="path.area" :fill="`url(#${gradId})`" />
    <path :d="path.line" :stroke="trendColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <circle
      v-if="path.pts.length"
      :cx="path.pts[path.pts.length - 1].x"
      :cy="path.pts[path.pts.length - 1].y"
      r="2.5"
      :fill="trendColor"
    />
  </svg>
</template>

<style scoped>
.mini-kline {
  display: block;
  width: 100%;
  height: auto;
}
</style>
