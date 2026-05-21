<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  width: { type: Number, default: 80 },
  height: { type: Number, default: 28 },
  color: { type: String, default: 'var(--gdi-up)' },
  filled: { type: Boolean, default: false }
})

const path = computed(() => {
  const d = props.data
  if (!d || d.length < 2) return ''
  const min = Math.min(...d)
  const max = Math.max(...d)
  const range = max - min || 1
  const stepX = props.width / (d.length - 1)
  return d
    .map((v, i) => {
      const x = (i * stepX).toFixed(2)
      const y = (props.height - ((v - min) / range) * props.height).toFixed(2)
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`
    })
    .join(' ')
})

const fillPath = computed(() => {
  if (!props.filled) return ''
  const base = path.value
  if (!base) return ''
  return `${base} L${props.width} ${props.height} L0 ${props.height} Z`
})

const gradId = `g-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" class="spark" preserveAspectRatio="none">
    <defs v-if="filled">
      <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.28" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path v-if="filled" :d="fillPath" :fill="`url(#${gradId})`" />
    <path :d="path" fill="none" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.spark {
  display: block;
}
</style>
