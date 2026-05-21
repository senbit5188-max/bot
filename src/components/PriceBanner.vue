<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { useMarketStore } from '../stores/market'

const router = useRouter()
const market = useMarketStore()
const periods = ['1H', '24H', '7D', '30D']
const activePeriod = ref('24H')

const chart = computed(() => {
  const d = market.focused.spark
  const w = 200
  const h = 80
  const min = Math.min(...d)
  const max = Math.max(...d)
  const range = max - min || 1
  const step = w / (d.length - 1)
  const pts = d
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 6) - 3).toFixed(1)}`)
    .join(' ')
  const area = `${pts} ${w},${h} 0,${h}`
  return { pts, area }
})

const color = computed(() => (market.focused.pct >= 0 ? 'var(--green)' : 'var(--red)'))
const colorRaw = computed(() => (market.focused.pct >= 0 ? '#00c853' : '#ff1744'))

function fmtPct(p) {
  return `${p > 0 ? '+' : ''}${p.toFixed(2)}%`
}
</script>

<template>
  <div class="price-banner card">
    <div class="banner-header">
      <button class="pair-selector" @click="router.push('/market')">
        <span class="pair-icon" :style="{ background: market.focused.iconBg }">{{ market.focused.icon }}</span>
        <span class="pair-name">{{ market.focused.symbol }}/USDT</span>
        <ChevronDown :size="16" />
      </button>
      <div class="time-badge">{{ activePeriod }}</div>
    </div>

    <div class="banner-body">
      <div class="banner-left">
        <div class="banner-price num">{{ market.focused.priceStr }}</div>
        <div class="banner-change num" :class="market.focused.pct >= 0 ? 'price-green' : 'price-red'">
          {{ fmtPct(market.focused.pct) }}
        </div>
        <div class="banner-usd num">≈ ${{ market.focused.priceStr }}</div>
        <div class="banner-info">
          <span class="info-tag">{{ market.focused.tag }}</span>
          <span class="info-vol">成交量 {{ market.focused.vol }} USDT</span>
        </div>
        <button class="trade-btn" @click="router.push('/trade')">交易</button>
      </div>
      <div class="banner-right">
        <svg viewBox="0 0 200 80" class="chart-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="banner-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="colorRaw" stop-opacity="0.22" />
              <stop offset="100%" :stop-color="colorRaw" stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#banner-grad)" :points="chart.area" />
          <polyline fill="none" :stroke="color" stroke-width="2" :points="chart.pts" />
        </svg>
      </div>
    </div>

    <div class="banner-time-tabs">
      <div class="chart-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div class="time-tabs">
        <button
          v-for="p in periods"
          :key="p"
          class="time-tab"
          :class="{ active: p === activePeriod }"
          @click="activePeriod = p"
        >{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-banner {
  margin-top: 8px;
}
.banner-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.pair-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pair-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 700;
}
.pair-name {
  font-weight: 600;
  font-size: 14px;
}
.time-badge {
  background: var(--bg);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.banner-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.banner-left {
  flex: 1;
}
.banner-price {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.banner-change {
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
}
.banner-usd {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}
.banner-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.info-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-size: 11px;
  font-weight: 600;
}
.info-vol {
  font-size: 11px;
  color: var(--text-muted);
}
.trade-btn {
  margin-top: 14px;
  background: var(--primary);
  color: white;
  padding: 9px 48px;
  border-radius: var(--radius-pill);
  font-size: 15px;
  font-weight: 600;
  transition: background 0.15s ease;
}
.trade-btn:active {
  background: var(--primary-deep);
}
.banner-right {
  width: 140px;
  height: 70px;
}
.chart-svg {
  width: 100%;
  height: 100%;
}
.banner-time-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
.chart-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
}
.dot.active {
  background: var(--primary);
  width: 16px;
  border-radius: 3px;
}
.time-tabs {
  display: flex;
  gap: 4px;
}
.time-tab {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}
.time-tab.active {
  background: var(--text-primary);
  color: white;
}
</style>
