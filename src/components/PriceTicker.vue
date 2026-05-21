<script setup>
import { useMarketStore } from '../stores/market'

const market = useMarketStore()

function fmtPct(p) {
  return `${p > 0 ? '+' : ''}${p.toFixed(2)}%`
}
</script>

<template>
  <div class="price-ticker card">
    <button
      v-for="t in market.ticker"
      :key="t.symbol"
      class="ticker-item"
      :class="{ active: t.symbol === market.focus }"
      @click="market.setFocus(t.symbol)"
    >
      <div class="ticker-pair">
        <span class="ticker-symbol">{{ t.symbol }}</span>
        <span class="ticker-slash">/USDT</span>
      </div>
      <div class="ticker-price num">{{ t.priceStr }}</div>
      <div class="ticker-change num" :class="t.pct >= 0 ? 'price-green' : 'price-red'">
        {{ fmtPct(t.pct) }}
      </div>
    </button>
  </div>
</template>

<style scoped>
.price-ticker {
  display: flex;
  gap: 4px;
  padding: 12px 8px;
}
.ticker-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 6px;
  border-radius: var(--radius-sm);
  text-align: left;
  transition: background 0.15s ease;
}
.ticker-item.active {
  background: var(--primary-light);
}
.ticker-pair {
  font-size: 11px;
  display: flex;
  align-items: baseline;
  gap: 1px;
}
.ticker-symbol {
  font-weight: 700;
  color: var(--text-primary);
}
.ticker-slash {
  color: var(--text-muted);
  font-weight: 500;
}
.ticker-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.ticker-change {
  font-size: 12px;
  font-weight: 600;
}
</style>
