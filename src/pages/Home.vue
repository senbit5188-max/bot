<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketStore } from '../stores/market'
import Sparkline from '../components/Sparkline.vue'
import MiniKline from '../components/MiniKline.vue'

const router = useRouter()
const market = useMarketStore()

const listTab = ref('favorites')

const listData = computed(() => {
  if (listTab.value === 'favorites') return market.favorites
  if (listTab.value === 'gainers') return market.gainers
  if (listTab.value === 'losers') return market.losers
  return market.hot
})

const tickerLoop = computed(() => [...market.ticker, ...market.ticker])

const tabs = [
  { key: 'favorites', label: '自选' },
  { key: 'hot', label: '热门' },
  { key: 'gainers', label: '涨幅榜' },
  { key: 'losers', label: '跌幅榜' }
]

function fmtPct(p) {
  const sign = p > 0 ? '+' : ''
  return `${sign}${p.toFixed(2)}%`
}

function fmtPrice(v) {
  if (v >= 1000) return v.toFixed(2)
  if (v >= 100) return v.toFixed(2)
  if (v >= 10) return v.toFixed(3)
  return v.toFixed(4)
}

function goTrade(code) {
  const slug = code.toLowerCase().replace('/', '-')
  router.push(`/product/${slug}`)
}

function goSearch() {
  router.push('/search')
}

function goNotifications() {
  router.push('/notifications')
}
</script>

<template>
  <div class="page home">
    <!-- Header: brand + search + bell -->
    <header class="hd">
      <div class="hd-brand" @click="router.push('/info/platform')">
        <span class="hd-logo" aria-label="AISTER">
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
            <path d="M16 4 L28 28 H4 Z" fill="#2962ff" />
            <path d="M16 14 L23 28 H9 Z" fill="#f5f3ee" opacity="0.92" />
          </svg>
        </span>
        <span class="hd-name">
          <span class="hd-name-en">AISTER</span>
          <span class="hd-sub">艾斯特 · 全球数字资产交易所</span>
        </span>
      </div>
      <div class="hd-actions">
        <button class="hd-btn" aria-label="搜索" @click="goSearch">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
        </button>
        <button class="hd-btn" aria-label="通知" @click="goNotifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 18V11a6 6 0 1 1 12 0v7" />
            <path d="M4 18h16" />
            <path d="M10 21h4" />
          </svg>
          <span class="hd-dot" />
        </button>
      </div>
    </header>

    <!-- Ticker: scrolling top market strip -->
    <div class="ticker no-scrollbar" role="marquee" aria-label="行情滚动条">
      <div class="ticker-track">
        <button
          v-for="(t, idx) in tickerLoop"
          :key="`${t.code}-${idx}`"
          class="ticker-item"
          @click="market.setFocus(t.code)"
        >
          <span class="ticker-code">{{ t.code }}</span>
          <span class="ticker-price num">{{ fmtPrice(t.last) }}</span>
          <span class="ticker-pct num" :class="t.pct >= 0 ? 'up' : 'down'">{{ fmtPct(t.pct) }}</span>
        </button>
      </div>
    </div>

    <!-- Hero index card -->
    <section class="hero" :class="market.focused.pct >= 0 ? 'is-up' : 'is-down'">
      <div class="hero-pill" aria-hidden="true"></div>
      <div class="hero-top">
        <div class="hero-meta">
          <div class="hero-code-row">
            <span
              class="hero-badge"
              :style="{ background: market.focused.badgeColor }"
            >{{ market.focused.badge }}</span>
            <span class="hero-code">{{ market.focused.code }}</span>
          </div>
          <div class="hero-name">{{ market.focused.name }}</div>
        </div>
        <div class="hero-tag">实时 · 现货</div>
      </div>
      <div class="hero-price-row">
        <div class="hero-price num">{{ fmtPrice(market.focused.last) }}</div>
        <div class="hero-chg num" :class="market.focused.pct >= 0 ? 'up' : 'down'">
          <span>{{ market.focused.pct >= 0 ? '+' : '' }}{{ market.focused.chg.toFixed(2) }}</span>
          <span>{{ fmtPct(market.focused.pct) }}</span>
        </div>
      </div>
      <MiniKline :data="market.focused.spark" :height="120" />
      <div class="hero-foot">
        <div>
          <div class="hero-foot-k">24h 高</div>
          <div class="hero-foot-v num">{{ fmtPrice(market.focused.high) }}</div>
        </div>
        <div>
          <div class="hero-foot-k">24h 低</div>
          <div class="hero-foot-v num">{{ fmtPrice(market.focused.low) }}</div>
        </div>
        <div>
          <div class="hero-foot-k">24h 量</div>
          <div class="hero-foot-v num">{{ market.focused.vol24h }}</div>
        </div>
        <div>
          <div class="hero-foot-k">总市值</div>
          <div class="hero-foot-v num">{{ market.focused.cap }}</div>
        </div>
      </div>
      <div class="hero-weight">权重 · {{ market.focused.weight }}</div>
    </section>

    <!-- Index selector pills -->
    <section class="index-row no-scrollbar">
      <button
        v-for="i in market.indexes"
        :key="i.code"
        class="idx-card"
        :class="{ 'is-active': i.code === market.focus, 'is-up': i.pct >= 0, 'is-down': i.pct < 0 }"
        @click="market.setFocus(i.code)"
      >
        <div class="idx-code">{{ i.code }}</div>
        <div class="idx-last num">{{ fmtPrice(i.last) }}</div>
        <div class="idx-pct num">{{ fmtPct(i.pct) }}</div>
        <Sparkline
          :data="i.spark"
          :width="78"
          :height="22"
          :color="i.pct >= 0 ? 'var(--gdi-up)' : 'var(--gdi-down)'"
        />
      </button>
    </section>

    <!-- Quick actions -->
    <section class="quick">
      <button class="quick-item" @click="router.push('/wallet')">
        <span class="quick-icon" data-tone="ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="6" width="18" height="13" rx="2.5" />
            <path d="M3 10h18" />
            <circle cx="17" cy="14.5" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span class="quick-l">钱包</span>
      </button>
      <button class="quick-item" @click="router.push('/recharge')">
        <span class="quick-icon" data-tone="ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </span>
        <span class="quick-l">充值</span>
      </button>
      <button class="quick-item" @click="router.push('/withdraw')">
        <span class="quick-icon" data-tone="ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5" />
            <path d="m5 12 7 7 7-7" />
          </svg>
        </span>
        <span class="quick-l">提现</span>
      </button>
      <button class="quick-item" @click="router.push('/orders')">
        <span class="quick-icon" data-tone="ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7h16" />
            <path d="M4 12h10" />
            <path d="M4 17h16" />
          </svg>
        </span>
        <span class="quick-l">订单</span>
      </button>
      <button class="quick-item" @click="router.push('/compare')">
        <span class="quick-icon" data-tone="ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h12" />
            <path d="m11 2 4 4-4 4" />
            <path d="M21 18H9" />
            <path d="m13 14-4 4 4 4" />
          </svg>
        </span>
        <span class="quick-l">对比</span>
      </button>
    </section>

    <!-- Tabs + asset list -->
    <section class="list-card">
      <div class="list-tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="list-tab"
          :class="{ 'is-active': listTab === t.key }"
          @click="listTab = t.key"
        >
          {{ t.label }}
          <span class="list-tab-underline" />
        </button>
        <div class="list-tab-spacer"></div>
        <button class="list-more" @click="router.push('/market')">
          更多
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="m6 4 4 4-4 4" />
          </svg>
        </button>
      </div>

      <div class="list-head">
        <span class="lh-name">代码 · 名称</span>
        <span class="lh-price">最新价</span>
        <span class="lh-chg">24h 涨跌</span>
      </div>

      <ul class="rows">
        <li
          v-for="m in listData"
          :key="m.code"
          class="row"
          @click="goTrade(m.code)"
        >
          <div class="row-l">
            <span class="row-avatar" :style="{ background: m.badgeColor }">{{ m.badge }}</span>
            <div class="row-meta">
              <span class="row-code">{{ m.code }}</span>
              <span class="row-name">{{ m.name }} · 24h {{ m.vol }} USDT</span>
            </div>
          </div>
          <div class="row-spark">
            <Sparkline
              :data="m.spark"
              :width="58"
              :height="22"
              :color="m.pct >= 0 ? 'var(--gdi-up)' : 'var(--gdi-down)'"
            />
          </div>
          <div class="row-price num">{{ fmtPrice(m.last) }}</div>
          <div class="row-pct num" :class="m.pct >= 0 ? 'up' : 'down'">
            {{ fmtPct(m.pct) }}
          </div>
        </li>
      </ul>
    </section>

    <!-- Highlights -->
    <section class="highlight" @click="router.push('/product/aister')">
      <div class="hl-meta">
        <div class="hl-tag">AISTER LAUNCHPAD</div>
        <div class="hl-title">持有 AISTER 享 50% 手续费折扣 · 永续仓位免开仓费</div>
        <div class="hl-sub">VIP3 起当日活跃自动累计 · 当前活动 T-7 · 名额 38% 剩余</div>
      </div>
      <div class="hl-arrow">›</div>
    </section>

    <!-- Disclosure -->
    <p class="disclosure">行情为模拟数据 · 仅供 AISTER 移动端演示 · 不构成投资建议</p>
  </div>
</template>

<style scoped>
.home {
  padding-top: 0;
}

/* Header */
.hd {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 52px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(245, 243, 238, 0.92);
  backdrop-filter: saturate(160%) blur(20px);
  -webkit-backdrop-filter: saturate(160%) blur(20px);
  border-bottom: 1px solid var(--gdi-line2);
}
.hd-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hd-logo {
  width: 34px;
  height: 34px;
  border-radius: var(--r-sm);
  background: var(--gdi-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.hd-name {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  gap: 2px;
}
.hd-name-en {
  font-size: 14px;
  font-weight: 800;
  color: var(--gdi-ink);
  letter-spacing: 0.14em;
}
.hd-sub {
  font-size: 11px;
  color: var(--gdi-ink3);
  letter-spacing: 0.04em;
}
.hd-actions {
  display: flex;
  gap: 4px;
}
.hd-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  color: var(--gdi-ink2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.hd-btn:active {
  background: var(--gdi-line2);
}
.hd-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gdi-coral);
  box-shadow: 0 0 0 2px var(--gdi-paper);
}

/* Ticker */
.ticker {
  height: 32px;
  overflow: hidden;
  background: var(--gdi-paper);
  border-bottom: 1px solid var(--gdi-line2);
  position: relative;
}
.ticker-track {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 22px;
  padding: 0 16px;
  white-space: nowrap;
  animation: ticker-scroll 32s linear infinite;
}
@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--gdi-ink3);
}
.ticker-code {
  color: var(--gdi-ink2);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.ticker-price {
  color: var(--gdi-ink2);
}
.ticker-pct {
  font-weight: 600;
}

/* Hero index card */
.hero {
  position: relative;
  margin: 12px 14px 0;
  padding: 16px 16px 14px;
  background: linear-gradient(180deg, #ffffff 0%, var(--gdi-paper3) 100%);
  border: 1px solid var(--gdi-line2);
  border-radius: var(--r-lg);
  box-shadow: 0 10px 24px -22px rgba(11, 11, 12, 0.4);
}
.hero.is-up::before,
.hero.is-down::before {
  content: '';
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 3px;
}
.hero.is-up::before {
  background: var(--gdi-up);
}
.hero.is-down::before {
  background: var(--gdi-down);
}
.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.hero-code-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
}
.hero-meta .hero-code {
  font-size: 14px;
  font-weight: 700;
  color: var(--gdi-ink);
  letter-spacing: 0.04em;
}
.hero-meta .hero-name {
  font-size: 12px;
  color: var(--gdi-ink3);
  margin-top: 4px;
}
.hero-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  background: var(--gdi-warn-soft);
  color: var(--gdi-coral-deep);
  font-weight: 600;
  letter-spacing: 0.04em;
}
.hero-price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 8px 0 10px;
}
.hero-price {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--gdi-ink);
}
.hero-chg {
  display: flex;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
.hero-foot {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 10px;
}
.hero-foot-k {
  font-size: 11px;
  color: var(--gdi-ink3);
  letter-spacing: 0.04em;
}
.hero-foot-v {
  font-size: 13px;
  font-weight: 600;
  color: var(--gdi-ink2);
  margin-top: 2px;
}
.hero-weight {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--gdi-line);
  font-size: 11px;
  color: var(--gdi-ink3);
  letter-spacing: 0.02em;
}

/* Index scroller */
.index-row {
  margin: 12px 0 0;
  padding: 0 14px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.idx-card {
  flex: 0 0 auto;
  width: 110px;
  scroll-snap-align: start;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid var(--gdi-line2);
  border-radius: var(--r-md);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.idx-card.is-active {
  border-color: var(--gdi-accent);
  box-shadow: 0 0 0 1px var(--gdi-accent) inset;
}
.idx-code {
  font-size: 11px;
  font-weight: 700;
  color: var(--gdi-accent);
  letter-spacing: 0.06em;
}
.idx-last {
  font-size: 15px;
  font-weight: 600;
  color: var(--gdi-ink);
  margin-top: 2px;
}
.idx-pct {
  font-size: 11px;
  font-weight: 600;
}
.idx-card.is-up .idx-pct {
  color: var(--gdi-up);
}
.idx-card.is-down .idx-pct {
  color: var(--gdi-down);
}
.idx-card svg {
  margin-top: 4px;
}

/* Quick */
.quick {
  margin: 14px 14px 0;
  padding: 12px 6px;
  background: #fff;
  border: 1px solid var(--gdi-line2);
  border-radius: var(--r-md);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--gdi-ink2);
  padding: 4px 0;
}
.quick-item:active {
  opacity: 0.6;
}
.quick-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--gdi-paper3);
  color: var(--gdi-accent);
  border: 1px solid var(--gdi-line2);
}
.quick-l {
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* List card */
.list-card {
  margin: 14px 14px 0;
  background: #fff;
  border: 1px solid var(--gdi-line2);
  border-radius: var(--r-md);
  overflow: hidden;
}
.list-tabs {
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid var(--gdi-line2);
  height: 44px;
}
.list-tab {
  position: relative;
  padding: 0 12px 0 0;
  margin-right: 6px;
  font-size: 14px;
  color: var(--gdi-ink3);
  font-weight: 500;
  height: 44px;
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.02em;
}
.list-tab.is-active {
  color: var(--gdi-ink);
  font-weight: 700;
}
.list-tab .list-tab-underline {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: transparent;
  transition: background 0.15s ease;
}
.list-tab.is-active .list-tab-underline {
  background: var(--gdi-accent);
}
.list-tab-spacer {
  flex: 1;
}
.list-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--gdi-ink3);
}
.list-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 60px 80px 92px;
  padding: 8px 14px 6px;
  font-size: 11px;
  color: var(--gdi-ink3);
  letter-spacing: 0.04em;
}
.lh-price,
.lh-chg {
  text-align: right;
}
.lh-name {
  grid-column: 1 / span 2;
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 60px 80px 92px;
  align-items: center;
  gap: 0;
  padding: 10px 14px;
  border-top: 1px solid var(--gdi-line2);
  cursor: pointer;
}
.row:first-child {
  border-top: none;
}
.row:active {
  background: var(--gdi-paper3);
}
.row-l {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.row-avatar {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.row-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.row-code {
  font-size: 13px;
  font-weight: 700;
  color: var(--gdi-ink);
  letter-spacing: 0.02em;
}
.row-name {
  display: block;
  font-size: 11px;
  color: var(--gdi-ink3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-spark {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 4px;
}
.row-price {
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--gdi-ink);
}
.row-pct {
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  border-radius: var(--r-xs);
  padding: 4px 6px;
  margin-left: 8px;
  background: var(--gdi-paper3);
}
.row-pct.up {
  color: var(--gdi-paper);
  background: var(--gdi-up);
}
.row-pct.down {
  color: var(--gdi-paper);
  background: var(--gdi-down);
}

/* Highlight banner */
.highlight {
  margin: 14px 14px 0;
  padding: 14px 16px;
  background: linear-gradient(135deg, var(--gdi-accent) 0%, var(--gdi-accent2) 100%);
  color: var(--gdi-paper);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 10px 28px -20px rgba(11, 11, 12, 0.5);
}
.highlight:active {
  opacity: 0.92;
}
.hl-tag {
  display: inline-block;
  background: rgba(245, 243, 238, 0.16);
  color: var(--gdi-paper);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  letter-spacing: 0.06em;
  font-weight: 600;
}
.hl-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
  letter-spacing: 0.02em;
}
.hl-sub {
  font-size: 12px;
  color: rgba(245, 243, 238, 0.78);
  margin-top: 3px;
  letter-spacing: 0.02em;
}
.hl-arrow {
  font-size: 22px;
  color: rgba(245, 243, 238, 0.7);
  line-height: 1;
}

.disclosure {
  text-align: center;
  font-size: 11px;
  color: var(--gdi-ink4);
  margin: 20px 14px 0;
  letter-spacing: 0.02em;
}
</style>
