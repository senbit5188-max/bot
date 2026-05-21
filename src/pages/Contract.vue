<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, ChevronRight, Eye, EyeOff, Star, Plus, Minus, BarChart3 } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import { useMarketStore } from '../stores/market'

const router = useRouter()
const market = useMarketStore()
const leverageOptions = [10, 20, 50, 100]
const leverage = ref(20)
const showBalance = ref(true)
const chartTabs = ['1分', '15分', '1小时', '4小时']
const orderTypes = ['限价', '市价', '止盈止损']

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const greenSet = new Set([0, 1, 3, 4, 7, 8, 10, 13, 14, 16, 17, 19])
const candles = Array.from({ length: 20 }, (_, i) => {
  const x = 20 + i * 19
  const isGreen = greenSet.has(i)
  const open = 80 + Math.sin(i * 0.5) * 20 + (i > 10 ? -15 : 0)
  const close = open + (isGreen ? -10 - seededRandom(i * 4) * 8 : 8 + seededRandom(i * 4 + 1) * 6)
  const high = Math.min(open, close) - 3 - seededRandom(i * 4 + 2) * 5
  const low = Math.max(open, close) + 3 + seededRandom(i * 4 + 3) * 5
  return { x, isGreen, open, close, high, low }
})
</script>

<template>
  <div class="page contract-page">
    <AppHeader />

    <div class="contract-title-row">
      <h2>合约</h2>
      <button class="tutorial-btn">📖 合约教程</button>
    </div>

    <div class="contract-account-card">
      <div class="cac-top">
        <div class="cac-left">
          <div class="cac-label">
            合约账户 (USDT)
            <button class="eye-btn-sm" @click="showBalance = !showBalance">
              <Eye v-if="showBalance" :size="14" />
              <EyeOff v-else :size="14" />
            </button>
          </div>
          <div class="cac-amount num">{{ showBalance ? '24,328.50' : '****' }}</div>
          <div class="cac-approx num">{{ showBalance ? '≈ $24,328.50' : '****' }}</div>
        </div>
        <div class="cac-right">
          <div class="cac-pnl-label">今日盈亏</div>
          <div class="cac-pnl price-green num">{{ showBalance ? '+1,248.75' : '****' }}</div>
          <div class="cac-pnl-pct price-green num">{{ showBalance ? '+5.39%' : '' }}</div>
        </div>
      </div>
      <div class="cac-stats">
        <div class="cac-stat"><span>钱包余额</span><span class="num">{{ showBalance ? '20,124.35' : '****' }}</span></div>
        <div class="cac-stat"><span>可用保证金</span><span class="num">{{ showBalance ? '16,504.21' : '****' }}</span></div>
        <div class="cac-stat"><span>占用保证金</span><span class="num">{{ showBalance ? '3,824.14' : '****' }}</span></div>
        <div class="cac-stat">
          <span>保证金率</span>
          <span class="num">12.65% <BarChart3 :size="12" color="#2962ff" /></span>
        </div>
      </div>
    </div>

    <div class="contract-pair-card">
      <div class="cpair-header">
        <div class="cpair-left">
          <span class="cpair-name">BTCUSDT</span>
          <ChevronDown :size="14" />
          <span class="cpair-type">永续</span>
          <Star :size="14" fill="#f7931a" color="#f7931a" />
        </div>
        <div class="cpair-stats num">
          <div><span>24H 最高</span><span>105,160.00</span></div>
          <div><span>24H 最低</span><span>102,980.50</span></div>
        </div>
      </div>
      <div class="cpair-price-row num">
        <span class="cpair-price price-green">104,523.78</span>
        <span class="cpair-change price-green">+1.23%</span>
      </div>

      <div class="contract-chart-tabs">
        <button
          v-for="(t, i) in chartTabs"
          :key="t"
          class="cchart-tab"
          :class="{ active: i === 1 }"
        >{{ t }}</button>
        <button class="cchart-tab">更多 <ChevronDown :size="10" /></button>
      </div>

      <div class="contract-chart">
        <svg viewBox="0 0 400 160" width="100%" height="160" preserveAspectRatio="none">
          <g v-for="(c, i) in candles" :key="i">
            <line
              :x1="c.x" :y1="c.high" :x2="c.x" :y2="c.low"
              :stroke="c.isGreen ? '#00c853' : '#ff1744'"
              stroke-width="1"
            />
            <rect
              :x="c.x - 4"
              :y="Math.min(c.open, c.close)"
              width="8"
              :height="Math.abs(c.close - c.open) || 2"
              :fill="c.isGreen ? '#00c853' : '#ff1744'"
            />
          </g>
          <line x1="0" y1="70" x2="400" y2="70" stroke="#2962ff" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.5" />
          <rect x="350" y="64" width="50" height="18" rx="3" fill="#2962ff" />
          <text x="375" y="76" fill="white" font-size="9" text-anchor="middle">104,523.78</text>
        </svg>
      </div>
    </div>

    <div class="contract-trade-card">
      <div class="ct-row-top">
        <div class="ct-mode">
          <span>全仓</span>
          <ChevronDown :size="12" />
        </div>
        <div class="ct-leverage-quick">
          <button
            v-for="l in leverageOptions"
            :key="l"
            class="lev-btn"
            :class="{ active: leverage === l }"
            @click="leverage = l"
          >{{ l }}x</button>
        </div>
      </div>

      <div class="ct-order-types">
        <button
          v-for="(t, i) in orderTypes"
          :key="t"
          class="ct-ot"
          :class="{ active: i === 0 }"
        >{{ t }}</button>
        <ChevronDown :size="12" color="#9ca3af" />
      </div>

      <div class="ct-form-grid">
        <div class="ct-form-left">
          <div class="trade-input-group">
            <label>价格 (USDT)</label>
            <div class="trade-input">
              <button class="input-btn"><Minus :size="14" /></button>
              <input type="text" value="104,523.78" readonly />
              <button class="input-btn"><Plus :size="14" /></button>
            </div>
          </div>
          <div class="trade-input-group">
            <label>数量 (BTC)</label>
            <div class="trade-input">
              <input type="text" placeholder="请输入数量" />
              <span class="input-unit">BTC <ChevronDown :size="10" /></span>
            </div>
          </div>
          <div class="ct-slider">
            <input type="range" min="0" max="100" value="60" class="slider-range" />
          </div>
          <div class="ct-info">
            <span>可用 16,504.21 USDT</span>
          </div>
        </div>
        <div class="ct-form-right">
          <button class="ct-open-btn long">
            开多 ↑
            <span class="ct-available">可开多 15,823.45 USDT</span>
          </button>
          <button class="ct-open-btn short">
            开空 ↓
            <span class="ct-available">可开空 15,823.45 USDT</span>
          </button>
        </div>
      </div>
    </div>

    <div class="hot-contracts card">
      <div class="hc-header">
        <span class="hc-title">热门合约</span>
        <button class="hc-more" @click="router.push('/market')">查看全部 <ChevronRight :size="12" /></button>
      </div>
      <div
        v-for="c in market.contracts"
        :key="c.symbol"
        class="hc-row"
        @click="router.push(`/coin/${c.symbol.toLowerCase()}`)"
      >
        <div class="hc-left">
          <strong>{{ c.symbol }}</strong>
          <span>{{ c.pair }}</span>
          <em class="hc-lev">{{ c.leverage }}</em>
        </div>
        <div class="hc-price num">{{ market.fmtPrice(c.last) }}</div>
        <div class="hc-pct">
          <span :class="c.pct >= 0 ? 'badge-green' : 'badge-red'">
            {{ c.pct > 0 ? '+' : '' }}{{ c.pct.toFixed(2) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contract-page {
  min-height: 100%;
  background: var(--bg);
  padding-bottom: calc(var(--nav-h) + 24px);
}
.contract-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 4px;
}
.contract-title-row h2 {
  font-size: 18px;
  font-weight: 700;
}
.tutorial-btn {
  color: var(--text-secondary);
  font-size: 12px;
  background: var(--card-bg);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}
.contract-account-card {
  background: var(--card-bg);
  margin: 8px 16px;
  border-radius: var(--radius);
  padding: 16px;
}
.cac-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}
.cac-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}
.eye-btn-sm {
  display: inline-flex;
  align-items: center;
  color: var(--text-muted);
}
.cac-amount {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 4px;
}
.cac-approx {
  font-size: 12px;
  color: var(--text-muted);
}
.cac-right {
  text-align: right;
}
.cac-pnl-label {
  font-size: 12px;
  color: var(--text-muted);
}
.cac-pnl {
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
}
.cac-pnl-pct {
  font-size: 12px;
  font-weight: 600;
}
.cac-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
}
.cac-stat {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.cac-stat span:first-child {
  color: var(--text-muted);
}
.contract-pair-card {
  background: var(--card-bg);
  margin: 0 16px 8px;
  border-radius: var(--radius);
  padding: 12px;
}
.cpair-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.cpair-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cpair-name {
  font-size: 15px;
  font-weight: 700;
}
.cpair-type {
  font-size: 11px;
  background: var(--primary-light);
  color: var(--primary);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  font-weight: 600;
}
.cpair-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
}
.cpair-stats div {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.cpair-stats div span:first-child {
  color: var(--text-muted);
}
.cpair-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}
.cpair-price {
  font-size: 22px;
  font-weight: 800;
}
.cpair-change {
  font-size: 13px;
  font-weight: 600;
}
.contract-chart-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}
.cchart-tab {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
  border-radius: var(--radius-xs);
}
.cchart-tab.active {
  background: var(--primary);
  color: white;
}
.contract-chart {
  width: 100%;
  height: 160px;
}
.contract-trade-card {
  background: var(--card-bg);
  margin: 0 16px 8px;
  border-radius: var(--radius);
  padding: 12px;
}
.ct-row-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.ct-mode {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg);
  padding: 5px 10px;
  border-radius: var(--radius-pill);
}
.ct-leverage-quick {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.lev-btn {
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: var(--radius-xs);
}
.lev-btn.active {
  background: var(--primary);
  color: white;
}
.ct-order-types {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft);
}
.ct-ot {
  font-size: 12px;
  color: var(--text-muted);
}
.ct-ot.active {
  color: var(--text-primary);
  font-weight: 700;
}
.ct-form-grid {
  display: flex;
  gap: 10px;
}
.ct-form-left {
  flex: 1;
}
.ct-form-right {
  flex: 0.7;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-end;
}
.trade-input-group {
  margin-bottom: 8px;
}
.trade-input-group label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  display: block;
}
.trade-input {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.trade-input input {
  flex: 1;
  border: none;
  background: none;
  padding: 8px 4px;
  font-size: 13px;
  text-align: center;
  outline: none;
  color: var(--text-primary);
}
.input-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text-primary);
}
.input-unit {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 0 8px;
}
.ct-slider {
  margin: 8px 0;
}
.slider-range {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border);
  border-radius: 2px;
  outline: none;
}
.slider-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  border: 2px solid white;
}
.ct-info {
  font-size: 11px;
  color: var(--text-muted);
}
.ct-open-btn {
  flex: 1;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.ct-open-btn.long {
  background: var(--green);
}
.ct-open-btn.short {
  background: var(--red);
}
.ct-available {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.85;
}
.hot-contracts {
  padding: 14px 16px;
  margin: 8px 16px 24px;
}
.hc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.hc-title {
  font-size: 15px;
  font-weight: 700;
}
.hc-more {
  font-size: 12px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.hc-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
}
.hc-row:last-child {
  border-bottom: none;
}
.hc-left {
  flex: 1;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  font-size: 13px;
}
.hc-left strong {
  font-weight: 700;
}
.hc-left span {
  color: var(--text-muted);
  font-size: 11px;
}
.hc-lev {
  font-style: normal;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  margin-left: 4px;
}
.hc-price {
  width: 96px;
  text-align: right;
  font-weight: 600;
  font-size: 13px;
}
.hc-pct {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}
</style>
