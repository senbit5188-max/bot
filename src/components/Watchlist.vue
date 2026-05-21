<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Star, SlidersHorizontal } from 'lucide-vue-next'
import { useMarketStore } from '../stores/market'

const router = useRouter()
const market = useMarketStore()
const tabs = ['自选', '热门', '涨幅榜', '跌幅榜']
const activeTab = ref('自选')

const items = computed(() => {
  if (activeTab.value === '自选') return market.favorites
  if (activeTab.value === '热门') return market.hot
  if (activeTab.value === '涨幅榜') return market.gainers
  if (activeTab.value === '跌幅榜') return market.losers
  return market.favorites
})

function fmtPct(p) {
  return `${p > 0 ? '+' : ''}${p.toFixed(2)}%`
}

function sparkPoints(spark) {
  const w = 60
  const h = 24
  const min = Math.min(...spark)
  const max = Math.max(...spark)
  const range = max - min || 1
  const step = w / (spark.length - 1)
  return spark
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`)
    .join(' ')
}

function goCoin(symbol) {
  router.push(`/coin/${symbol.toLowerCase()}`)
}
</script>

<template>
  <div class="watchlist card">
    <div class="watchlist-header">
      <h3 class="watchlist-title">自选列表</h3>
      <div class="watchlist-tabs">
        <button
          v-for="t in tabs"
          :key="t"
          class="wl-tab"
          :class="{ active: activeTab === t }"
          @click="activeTab = t"
        >{{ t }}</button>
      </div>
      <button class="manage-btn" @click="router.push('/market')">
        <SlidersHorizontal :size="14" />
        <span>管理</span>
      </button>
    </div>

    <div class="watchlist-table-header">
      <div class="wl-col-name">名称 / 成交额 ↕</div>
      <div class="wl-col-price">最新价</div>
      <div class="wl-col-change">24H涨跌幅 ↕</div>
    </div>

    <div class="watchlist-items">
      <div
        v-for="item in items"
        :key="item.symbol"
        class="wl-item"
        @click="goCoin(item.symbol)"
      >
        <div class="wl-item-left">
          <Star
            :size="14"
            :fill="item.favored ? '#f7931a' : 'none'"
            :color="item.favored ? '#f7931a' : '#ccc'"
          />
          <div class="wl-item-icon" :style="{ background: item.iconBg }">
            {{ item.icon }}
          </div>
          <div class="wl-item-info">
            <div class="wl-item-symbol">
              <strong>{{ item.symbol }}</strong>
              <span>/{{ item.pair }}</span>
            </div>
            <div class="wl-item-vol">{{ item.vol }} USDT</div>
          </div>
        </div>
        <div class="wl-item-mid">
          <div class="wl-item-price num">{{ item.priceStr }}</div>
          <div class="wl-item-usd num">≈ ${{ item.priceStr }}</div>
        </div>
        <div class="wl-item-right">
          <svg viewBox="0 0 60 24" width="60" height="24" class="mini-sparkline">
            <polyline
              fill="none"
              :stroke="item.pct >= 0 ? 'var(--green)' : 'var(--red)'"
              stroke-width="1.6"
              :points="sparkPoints(item.spark)"
            />
          </svg>
          <span :class="item.pct >= 0 ? 'badge-green' : 'badge-red'">
            {{ fmtPct(item.pct) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watchlist {
  padding: 16px;
}
.watchlist-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.watchlist-title {
  font-size: 16px;
  font-weight: 700;
}
.watchlist-tabs {
  display: flex;
  gap: 2px;
}
.wl-tab {
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}
.wl-tab.active {
  color: var(--text-primary);
  font-weight: 700;
  border-bottom: 2px solid var(--text-primary);
  border-radius: 0;
}
.manage-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 12px;
}
.watchlist-table-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-muted);
}
.wl-col-name {
  flex: 1;
}
.wl-col-price {
  width: 96px;
  text-align: right;
}
.wl-col-change {
  width: 110px;
  text-align: right;
}
.watchlist-items {
  margin-top: 4px;
}
.wl-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.wl-item:last-child {
  border-bottom: none;
}
.wl-item:active {
  background: var(--bg);
}
.wl-item-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.wl-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.wl-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.wl-item-symbol {
  font-size: 14px;
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
}
.wl-item-symbol strong {
  font-weight: 700;
  color: var(--text-primary);
}
.wl-item-symbol span {
  color: var(--text-muted);
  font-size: 12px;
}
.wl-item-vol {
  font-size: 11px;
  color: var(--text-muted);
}
.wl-item-mid {
  width: 96px;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.wl-item-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.wl-item-usd {
  font-size: 11px;
  color: var(--text-muted);
}
.wl-item-right {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.mini-sparkline {
  display: block;
}
</style>
