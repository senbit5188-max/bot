<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Plus, Minus } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import { useMarketStore } from '../stores/market'

const market = useMarketStore()
const side = ref('buy')
const orderType = ref('限价单')
const orderTab = ref('当前委托')
const sliderPct = ref(0)
const qty = ref('')
const periods = ['1m', '5m', '15m', '1H', '4H', '1D']

const focused = computed(() => market.focused)

const askOrders = [
  { price: 104525.20, qty: 0.3212, total: 3.2145 },
  { price: 104525.00, qty: 0.2567, total: 2.8933 },
  { price: 104524.80, qty: 0.1984, total: 2.6366 },
  { price: 104524.60, qty: 0.1421, total: 2.4382 },
  { price: 104524.40, qty: 0.1123, total: 2.2961 }
]

const bidOrders = [
  { price: 104523.60, qty: 0.1567, total: 0.1567 },
  { price: 104523.40, qty: 0.2315, total: 0.3882 },
  { price: 104523.20, qty: 0.3176, total: 0.7058 },
  { price: 104523.00, qty: 0.4212, total: 1.1270 },
  { price: 104522.80, qty: 0.5423, total: 1.6693 }
]

const currentOrders = [
  { pair: 'BTC/USDT', side: '买入', type: '限价单', price: 104000, qty: 0.01, filled: 0.003, amount: '312.00 / 1,040.00', date: '2025-05-20 09:40:15' }
]

function fmtNum(v) {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="page trade-page">
    <AppHeader />

    <section class="trade-price-header">
      <div class="trade-pair-row">
        <div class="trade-pair-left">
          <span class="pair-icon" :style="{ background: focused.iconBg }">{{ focused.icon }}</span>
          <span class="trade-pair-name">{{ focused.symbol }}/USDT</span>
          <ChevronDown :size="14" />
        </div>
        <span class="trade-24h-badge">24H</span>
      </div>
      <div class="trade-price-row">
        <div class="price-left">
          <div class="trade-big-price num">{{ focused.priceStr }}</div>
          <div class="trade-price-meta num">
            <span :class="focused.pct >= 0 ? 'price-green' : 'price-red'">
              {{ focused.pct > 0 ? '+' : '' }}{{ focused.pct.toFixed(2) }}%
            </span>
            <span class="trade-approx">≈ ${{ focused.priceStr }}</span>
          </div>
        </div>
        <div class="price-right-stats num">
          <div class="stat-line"><span>24h 最高</span><span>105,842.21</span></div>
          <div class="stat-line"><span>24h 最低</span><span>103,112.45</span></div>
          <div class="stat-line"><span>24h 成交量</span><span>24,328.65</span></div>
          <div class="stat-line"><span>24h 成交额</span><span>2.54B</span></div>
        </div>
      </div>
    </section>

    <section class="trade-chart-section">
      <svg viewBox="0 0 400 120" width="100%" height="120" class="trade-line-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tradeAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2962ff" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#2962ff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#tradeAreaGrad)"
          points="0,90 30,85 60,88 90,75 120,80 150,60 180,65 210,50 240,55 270,40 300,45 330,35 360,30 400,25 400,120 0,120"
        />
        <polyline
          fill="none"
          stroke="#2962ff"
          stroke-width="1.6"
          points="0,90 30,85 60,88 90,75 120,80 150,60 180,65 210,50 240,55 270,40 300,45 330,35 360,30 400,25"
        />
        <line x1="0" y1="55" x2="400" y2="55" stroke="#2962ff" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.4" />
      </svg>
      <div class="chart-time-tabs">
        <button
          v-for="(t, i) in periods"
          :key="t"
          class="chart-time-tab"
          :class="{ active: i === 1 }"
        >{{ t }}</button>
        <button class="chart-time-tab">更多 <ChevronDown :size="10" /></button>
      </div>
    </section>

    <section class="trade-main-grid">
      <div class="trade-form-col">
        <div class="side-tabs">
          <button class="side-tab buy" :class="{ active: side === 'buy' }" @click="side = 'buy'">买入</button>
          <button class="side-tab sell" :class="{ active: side === 'sell' }" @click="side = 'sell'">卖出</button>
        </div>

        <div class="order-type-select">
          <span>{{ orderType }}</span>
          <ChevronDown :size="12" />
        </div>

        <div class="trade-input-group">
          <label>价格 (USDT)</label>
          <div class="trade-input">
            <button class="input-btn"><Minus :size="14" /></button>
            <input type="text" :value="focused.priceStr" readonly />
            <button class="input-btn"><Plus :size="14" /></button>
          </div>
        </div>

        <div class="trade-input-group">
          <label>数量 ({{ focused.symbol }})</label>
          <div class="trade-input">
            <button class="input-btn"><Minus :size="14" /></button>
            <input v-model="qty" type="text" placeholder="请输入数量" />
            <button class="input-btn"><Plus :size="14" /></button>
          </div>
        </div>

        <div class="trade-slider">
          <input v-model="sliderPct" type="range" min="0" max="100" class="slider-range" />
          <div class="slider-labels">
            <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>

        <div class="trade-info-rows num">
          <div class="trade-info-row"><span>可用</span><span>2,342.56 USDT</span></div>
          <div class="trade-info-row"><span>可买</span><span>0.02238 {{ focused.symbol }}</span></div>
        </div>

        <button class="trade-submit-btn" :class="side">
          {{ side === 'buy' ? `买入 ${focused.symbol}` : `卖出 ${focused.symbol}` }}
        </button>
      </div>

      <div class="orderbook-col">
        <div class="ob-header">
          <span>价格</span>
          <span>数量</span>
          <span>合计</span>
        </div>
        <div class="ob-asks">
          <div v-for="(o, i) in askOrders" :key="i" class="ob-row ask num">
            <span class="price-red">{{ fmtNum(o.price) }}</span>
            <span>{{ o.qty.toFixed(4) }}</span>
            <span>{{ o.total.toFixed(4) }}</span>
          </div>
        </div>
        <div class="ob-mid-price num">
          <span :class="focused.pct >= 0 ? 'price-green' : 'price-red'">{{ focused.priceStr }}</span>
          <span class="ob-approx">≈ ${{ focused.priceStr }}</span>
        </div>
        <div class="ob-bids">
          <div v-for="(o, i) in bidOrders" :key="i" class="ob-row bid num">
            <span class="price-green">{{ fmtNum(o.price) }}</span>
            <span>{{ o.qty.toFixed(4) }}</span>
            <span>{{ o.total.toFixed(4) }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="trade-orders-section">
      <div class="orders-tabs">
        <button
          v-for="t in ['当前委托', '历史委托']"
          :key="t"
          class="orders-tab"
          :class="{ active: orderTab === t }"
          @click="orderTab = t"
        >{{ t }}</button>
        <span class="orders-count">({{ currentOrders.length }})</span>
        <button class="cancel-all-btn">全部撤单</button>
      </div>
      <div class="orders-list">
        <div v-for="(o, i) in currentOrders" :key="i" class="order-row">
          <div class="o-meta">
            <span class="o-pair">{{ o.pair }}</span>
            <span class="o-side" :class="o.side === '买入' ? 'price-green' : 'price-red'">{{ o.side }}</span>
            <span class="o-type">{{ o.type }}</span>
          </div>
          <div class="o-grid num">
            <div><label>委托价</label>{{ fmtNum(o.price) }}</div>
            <div><label>委托量</label>{{ o.qty.toFixed(4) }}</div>
            <div><label>已成交</label>{{ o.filled.toFixed(4) }}</div>
            <div><label>金额</label>{{ o.amount }}</div>
          </div>
          <div class="o-date">{{ o.date }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.trade-page {
  min-height: 100%;
  background: var(--bg);
  padding-bottom: calc(var(--nav-h) + 24px);
}
.trade-price-header {
  background: var(--card-bg);
  padding: 12px 16px;
}
.trade-pair-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.trade-pair-left {
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
.trade-pair-name {
  font-size: 16px;
  font-weight: 700;
}
.trade-24h-badge {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: var(--radius-xs);
}
.trade-price-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.trade-big-price {
  font-size: 24px;
  font-weight: 800;
}
.trade-price-meta {
  display: flex;
  gap: 8px;
  margin-top: 2px;
  font-size: 12px;
}
.trade-approx {
  color: var(--text-muted);
}
.price-right-stats {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.stat-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
}
.stat-line span:first-child {
  color: var(--text-muted);
}
.trade-chart-section {
  background: var(--card-bg);
  margin: 8px 16px;
  border-radius: var(--radius);
  padding: 12px;
}
.chart-time-tabs {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
.chart-time-tab {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
  border-radius: var(--radius-xs);
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.chart-time-tab.active {
  background: var(--primary);
  color: white;
}
.trade-main-grid {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 12px;
}
.trade-form-col,
.orderbook-col {
  flex: 1;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 12px;
}
.side-tabs {
  display: flex;
  margin-bottom: 10px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg);
}
.side-tab {
  flex: 1;
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}
.side-tab.buy.active {
  background: var(--green);
  color: white;
}
.side-tab.sell.active {
  background: var(--red);
  color: white;
}
.order-type-select {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-primary);
  padding: 6px 0;
  margin-bottom: 8px;
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
.trade-slider {
  margin-bottom: 12px;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 6px;
}
.trade-info-rows {
  margin-bottom: 12px;
}
.trade-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 3px 0;
}
.trade-info-row span:first-child {
  color: var(--text-muted);
}
.trade-submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  color: white;
}
.trade-submit-btn.buy {
  background: var(--green);
}
.trade-submit-btn.sell {
  background: var(--red);
}
.ob-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 10px;
  color: var(--text-muted);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-soft);
}
.ob-header span:nth-child(2),
.ob-row span:nth-child(2) {
  text-align: center;
}
.ob-header span:nth-child(3),
.ob-row span:nth-child(3) {
  text-align: right;
}
.ob-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 11px;
  padding: 2px 0;
}
.ob-mid-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  margin: 4px 0;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
  font-size: 13px;
  font-weight: 700;
}
.ob-approx {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
}
.trade-orders-section {
  background: var(--card-bg);
  margin: 0 16px;
  padding: 12px;
  border-radius: var(--radius);
}
.orders-tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft);
}
.orders-tab {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  padding-bottom: 4px;
}
.orders-tab.active {
  color: var(--text-primary);
  font-weight: 700;
  border-bottom: 2px solid var(--primary);
}
.orders-count {
  font-size: 11px;
  color: var(--text-muted);
}
.cancel-all-btn {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-muted);
}
.order-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-soft);
}
.order-row:last-child {
  border-bottom: none;
}
.o-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}
.o-side {
  font-weight: 600;
  font-size: 12px;
}
.o-type {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
}
.o-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
  font-size: 12px;
  margin-bottom: 4px;
}
.o-grid label {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.o-date {
  font-size: 10px;
  color: var(--text-muted);
}
</style>
