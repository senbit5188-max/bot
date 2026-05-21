<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown, ChevronLeft, Star, Share2 } from 'lucide-vue-next'
import { useMarketStore } from '../stores/market'

const route = useRoute()
const router = useRouter()
const market = useMarketStore()

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M']

const coin = computed(() => {
  const sym = String(route.params.symbol || 'btc').toUpperCase()
  return market.coins.find((c) => c.symbol === sym) || market.coins[0]
})

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const greenBars = new Set([0, 1, 2, 5, 6, 8, 9, 12, 13, 15, 16, 18, 20, 21, 23, 24])

const candles = Array.from({ length: 25 }, (_, i) => {
  const x = 16 + i * 15
  const isGreen = greenBars.has(i)
  const base = 100 - i * 1.5 + Math.sin(i * 0.8) * 15
  const open = base
  const close = open + (isGreen ? -8 - seededRandom(i * 3) * 6 : 6 + seededRandom(i * 3 + 1) * 5)
  const high = Math.min(open, close) - 2 - seededRandom(i * 3 + 2) * 4
  const low = Math.max(open, close) + 2 + seededRandom(i * 3 + 3) * 4
  return { x, isGreen, open, close, high, low }
})

const volumes = Array.from({ length: 25 }, (_, i) => {
  const x = 16 + i * 15
  const h = 5 + seededRandom(i * 7 + 50) * 15
  return { x, h, isGreen: greenBars.has(i) }
})

const askDepth = [
  { price: '104,525.20', qty: '0.3212', pct: 80 },
  { price: '104,525.00', qty: '0.2567', pct: 65 },
  { price: '104,524.80', qty: '0.1984', pct: 50 },
  { price: '104,524.60', qty: '0.1421', pct: 35 },
  { price: '104,524.40', qty: '0.1123', pct: 28 }
]

const bidDepth = [
  { price: '104,523.60', qty: '0.1567', pct: 30 },
  { price: '104,523.40', qty: '0.2315', pct: 45 },
  { price: '104,523.20', qty: '0.3176', pct: 60 },
  { price: '104,523.00', qty: '0.4212', pct: 75 },
  { price: '104,522.80', qty: '0.5423', pct: 85 }
]

function fmtPct(p) {
  return `${p > 0 ? '+' : ''}${p.toFixed(2)}%`
}
</script>

<template>
  <div class="coin-detail-page">
    <div class="cd-header">
      <button class="cd-back" @click="router.back()">
        <ChevronLeft :size="22" />
      </button>
      <div class="cd-header-info">
        <span class="cd-coin-icon" :style="{ background: coin.iconBg }">{{ coin.icon }}</span>
        <span class="cd-coin-name">{{ coin.symbol }}/USDT</span>
        <ChevronDown :size="14" />
      </div>
      <div class="cd-header-actions">
        <Star :size="18" :fill="coin.favored ? '#f7931a' : 'none'" :color="coin.favored ? '#f7931a' : '#9ca3af'" />
        <Share2 :size="18" />
      </div>
    </div>

    <div class="cd-price-section">
      <div class="cd-price-main">
        <div class="cd-big-price num" :class="coin.pct >= 0 ? 'price-green' : 'price-red'">
          {{ coin.priceStr }}
        </div>
        <div class="cd-price-meta num">
          <span :class="coin.pct >= 0 ? 'price-green' : 'price-red'">{{ fmtPct(coin.pct) }}</span>
          <span class="cd-approx">≈ ${{ coin.priceStr }}</span>
        </div>
      </div>
      <div class="cd-price-stats num">
        <div><span>24h 最高</span><span>105,842.21</span></div>
        <div><span>24h 最低</span><span>103,112.45</span></div>
        <div><span>24h 成交量</span><span>{{ coin.vol }} {{ coin.symbol }}</span></div>
        <div><span>24h 成交额</span><span>2.54B USDT</span></div>
      </div>
    </div>

    <div class="cd-chart-card">
      <div class="cd-chart-tabs">
        <button
          v-for="(t, i) in timeframes"
          :key="t"
          class="cd-chart-tab"
          :class="{ active: i === 3 }"
        >{{ t }}</button>
      </div>
      <div class="cd-chart">
        <svg viewBox="0 0 400 180" width="100%" height="180" preserveAspectRatio="none">
          <g v-for="(c, i) in candles" :key="`c-${i}`">
            <line
              :x1="c.x" :y1="c.high" :x2="c.x" :y2="c.low"
              :stroke="c.isGreen ? '#00c853' : '#ff1744'"
              stroke-width="0.8"
            />
            <rect
              :x="c.x - 3"
              :y="Math.min(c.open, c.close)"
              width="6"
              :height="Math.abs(c.close - c.open) || 2"
              :fill="c.isGreen ? '#00c853' : '#ff1744'"
            />
          </g>
          <rect
            v-for="(v, i) in volumes"
            :key="`v-${i}`"
            :x="v.x - 3"
            :y="180 - v.h"
            width="6"
            :height="v.h"
            :fill="v.isGreen ? 'rgba(0,200,83,0.3)' : 'rgba(255,23,68,0.3)'"
          />
          <line x1="0" y1="60" x2="400" y2="60" stroke="#2962ff" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4" />
        </svg>
      </div>
    </div>

    <div class="cd-market-overview">
      <h4>市场概况</h4>
      <div class="cd-overview-grid num">
        <div class="cd-ov-item"><div class="cd-ov-label">市值</div><div class="cd-ov-value">$2.05T</div></div>
        <div class="cd-ov-item"><div class="cd-ov-label">流通市值</div><div class="cd-ov-value">$2.05T</div></div>
        <div class="cd-ov-item"><div class="cd-ov-label">流通量</div><div class="cd-ov-value">19,625,000</div></div>
        <div class="cd-ov-item"><div class="cd-ov-label">最大供应量</div><div class="cd-ov-value">21,000,000</div></div>
      </div>
    </div>

    <div class="cd-about">
      <h4>关于 {{ coin.name }}</h4>
      <p>{{ coin.name }} ({{ coin.symbol }}) 是 AISTER 平台上线的现货 / 永续交易对之一,日均成交额 {{ coin.vol }} USDT。当前价格 ≈ ${{ coin.priceStr }}, 24H 波动 {{ fmtPct(coin.pct) }}。</p>
    </div>

    <div class="cd-depth-card">
      <h4>市场深度</h4>
      <div class="cd-depth-header">
        <span>价格 (USDT)</span>
        <span>数量 ({{ coin.symbol }})</span>
      </div>
      <div class="cd-depth-asks">
        <div v-for="(o, i) in askDepth" :key="`a-${i}`" class="depth-row ask">
          <div class="depth-bar ask-bar" :style="{ width: `${o.pct}%` }" />
          <span class="price-red num">{{ o.price }}</span>
          <span class="num">{{ o.qty }}</span>
        </div>
      </div>
      <div class="cd-depth-mid num">
        <span :class="coin.pct >= 0 ? 'price-green' : 'price-red'">{{ coin.priceStr }}</span>
        <span class="depth-approx">≈ ${{ coin.priceStr }}</span>
      </div>
      <div class="cd-depth-bids">
        <div v-for="(o, i) in bidDepth" :key="`b-${i}`" class="depth-row bid">
          <div class="depth-bar bid-bar" :style="{ width: `${o.pct}%` }" />
          <span class="price-green num">{{ o.price }}</span>
          <span class="num">{{ o.qty }}</span>
        </div>
      </div>
    </div>

    <div class="cd-bottom-actions">
      <button class="cd-btn buy" @click="router.push('/trade')">买入</button>
      <button class="cd-btn sell" @click="router.push('/trade')">卖出</button>
    </div>
  </div>
</template>

<style scoped>
.coin-detail-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 80px;
}
.cd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--card-bg);
  position: sticky;
  top: 0;
  z-index: 30;
}
.cd-back {
  color: var(--text-primary);
}
.cd-header-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cd-coin-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
}
.cd-coin-name {
  font-size: 16px;
  font-weight: 700;
}
.cd-header-actions {
  display: inline-flex;
  gap: 12px;
}
.cd-price-section {
  background: var(--card-bg);
  padding: 12px 16px;
  margin-bottom: 8px;
}
.cd-big-price {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.cd-price-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-top: 2px;
}
.cd-approx {
  color: var(--text-muted);
}
.cd-price-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
  margin-top: 12px;
  font-size: 11px;
}
.cd-price-stats div {
  display: flex;
  justify-content: space-between;
}
.cd-price-stats span:first-child {
  color: var(--text-muted);
}
.cd-chart-card {
  background: var(--card-bg);
  margin: 8px 16px;
  border-radius: var(--radius);
  padding: 12px;
}
.cd-chart-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  margin-bottom: 8px;
}
.cd-chart-tab {
  padding: 4px 8px;
  font-size: 11px;
  color: var(--text-muted);
  border-radius: var(--radius-xs);
  flex-shrink: 0;
}
.cd-chart-tab.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
}
.cd-chart {
  width: 100%;
  height: 180px;
}
.cd-market-overview,
.cd-about,
.cd-depth-card {
  background: var(--card-bg);
  margin: 8px 16px;
  padding: 14px;
  border-radius: var(--radius);
}
.cd-market-overview h4,
.cd-about h4,
.cd-depth-card h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}
.cd-overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.cd-ov-label {
  font-size: 11px;
  color: var(--text-muted);
}
.cd-ov-value {
  font-size: 13px;
  font-weight: 600;
  margin-top: 2px;
}
.cd-about p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.cd-depth-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-soft);
}
.depth-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px;
  font-size: 12px;
}
.depth-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}
.ask-bar {
  background: rgba(255, 23, 68, 0.08);
}
.bid-bar {
  background: rgba(0, 200, 83, 0.08);
}
.depth-row > span {
  position: relative;
  z-index: 1;
}
.cd-depth-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  margin: 4px 0;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
  font-size: 14px;
  font-weight: 700;
}
.depth-approx {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
.cd-bottom-actions {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--card-bg);
  border-top: 1px solid var(--border);
  z-index: 40;
}
.cd-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 14px;
  font-weight: 700;
}
.cd-btn.buy {
  background: var(--green);
}
.cd-btn.sell {
  background: var(--red);
}
</style>
