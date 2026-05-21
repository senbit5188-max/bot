<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Star } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import { useMarketStore } from '../stores/market'

const router = useRouter()
const market = useMarketStore()
const tabs = ['自选', '现货', '合约', '涨幅', '跌幅', '成交']
const activeTab = ref('现货')

const list = computed(() => {
  if (activeTab.value === '自选') return market.favorites
  if (activeTab.value === '涨幅') return market.gainers
  if (activeTab.value === '跌幅') return market.losers
  if (activeTab.value === '成交') return market.hot
  return market.coins
})

function fmtPct(p) {
  return `${p > 0 ? '+' : ''}${p.toFixed(2)}%`
}
</script>

<template>
  <div class="page market-page">
    <AppHeader />
    <div class="market-search card">
      <Search :size="16" />
      <span class="search-ph">搜索币种 / 交易对</span>
    </div>
    <div class="market-tabs no-scrollbar">
      <button
        v-for="t in tabs"
        :key="t"
        class="m-tab"
        :class="{ active: t === activeTab }"
        @click="activeTab = t"
      >{{ t }}</button>
    </div>

    <div class="market-list">
      <div class="ml-head">
        <span class="ml-c1">名称</span>
        <span class="ml-c2">最新价</span>
        <span class="ml-c3">24H 涨跌</span>
      </div>
      <div
        v-for="c in list"
        :key="c.symbol"
        class="ml-row"
        @click="router.push(`/coin/${c.symbol.toLowerCase()}`)"
      >
        <div class="ml-name">
          <Star :size="13" :fill="c.favored ? '#f7931a' : 'none'" :color="c.favored ? '#f7931a' : '#ccc'" />
          <span class="ml-icon" :style="{ background: c.iconBg }">{{ c.icon }}</span>
          <span class="ml-meta">
            <span class="ml-sym"><strong>{{ c.symbol }}</strong><em>/USDT</em></span>
            <span class="ml-vol">{{ c.vol }} USDT</span>
          </span>
        </div>
        <div class="ml-price num">{{ c.priceStr }}</div>
        <div class="ml-pct">
          <span :class="c.pct >= 0 ? 'badge-green' : 'badge-red'">{{ fmtPct(c.pct) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-page {
  min-height: 100%;
}
.market-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 16px 0;
  padding: 10px 14px;
  background: var(--card-bg);
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: 13px;
}
.search-ph {
  color: var(--text-muted);
}
.market-tabs {
  display: flex;
  gap: 14px;
  padding: 14px 16px 8px;
  overflow-x: auto;
  background: var(--bg);
}
.m-tab {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  padding-bottom: 4px;
  white-space: nowrap;
}
.m-tab.active {
  color: var(--text-primary);
  font-weight: 700;
  border-bottom: 2px solid var(--primary);
}
.market-list {
  background: var(--card-bg);
  margin: 0 16px 24px;
  border-radius: var(--radius);
  overflow: hidden;
}
.ml-head {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  font-size: 11px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}
.ml-c1 {
  flex: 1;
}
.ml-c2 {
  width: 96px;
  text-align: right;
}
.ml-c3 {
  width: 90px;
  text-align: right;
}
.ml-row {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
}
.ml-row:last-child {
  border-bottom: none;
}
.ml-row:active {
  background: var(--bg);
}
.ml-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ml-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.ml-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.ml-sym {
  font-size: 14px;
  color: var(--text-primary);
}
.ml-sym em {
  font-style: normal;
  color: var(--text-muted);
  font-size: 12px;
}
.ml-vol {
  font-size: 11px;
  color: var(--text-muted);
}
.ml-price {
  width: 96px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.ml-pct {
  width: 90px;
  display: flex;
  justify-content: flex-end;
}
</style>
