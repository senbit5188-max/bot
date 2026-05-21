<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ChevronRight, Filter } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const showBalance = ref(true)
const accountTab = ref('现货账户')
const recordTab = ref('全部')

const assetData = [
  { symbol: 'BTC', name: 'Bitcoin', holding: '0.512348', available: '0.500000', frozen: '0.012348', valueUsd: '53,048.25', approx: '≈ 53,048.25 USD', icon: '₿', iconBg: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', holding: '2.52965', available: '2.52965', frozen: '0.00000', valueUsd: '5,529.65', approx: '≈ 5,529.65 USD', icon: 'Ξ', iconBg: '#627eea' },
  { symbol: 'USDT', name: 'Tether', holding: '1,250.0000', available: '1,250.0000', frozen: '0.0000', valueUsd: '1,250.00', approx: '≈ 1,250.00 USD', icon: '₮', iconBg: '#26a17b' },
  { symbol: 'SOL', name: 'Solana', holding: '10.0000', available: '10.0000', frozen: '0.0000', valueUsd: '1,023.50', approx: '≈ 1,023.50 USD', icon: '◎', iconBg: '#9945ff' },
  { symbol: 'AISTER', name: '艾斯特', holding: '1,000.0000', available: '1,000.0000', frozen: '0.0000', valueUsd: '186.70', approx: '≈ 186.70 USD', icon: 'A', iconBg: '#2962ff' }
]

const records = [
  { type: '充值', coin: 'USDT', amount: '+1,000.00', date: '2024-05-20 14:35:22', status: '已完成', color: '#00c853', iconBg: '#e8f5e9', kind: 'in' },
  { type: '提币', coin: 'BTC', amount: '-0.020000', date: '2024-05-19 18:22:10', status: '已完成', color: '#2962ff', iconBg: '#e3f2fd', kind: 'out' },
  { type: '划转', coin: '现货 → 合约', amount: '-500.00 USDT', date: '2024-05-19 11:05:33', status: '已完成', color: '#7c4dff', iconBg: '#ede7f6', kind: 'swap' }
]

const segments = [
  { label: '现货', pct: 60.11, color: '#2962ff' },
  { label: '合约', pct: 25.23, color: '#1a1a2e' },
  { label: '理财', pct: 10.12, color: '#f7931a' },
  { label: '其他', pct: 4.54, color: '#d1d5db' }
]

const piePaths = (() => {
  let cum = 0
  const r = 40
  const cx = 50
  const cy = 50
  return segments.map((seg) => {
    const s = (cum / 100) * 360
    cum += seg.pct
    const e = (cum / 100) * 360
    const sr = ((s - 90) * Math.PI) / 180
    const er = ((e - 90) * Math.PI) / 180
    const la = seg.pct > 50 ? 1 : 0
    return {
      label: seg.label,
      color: seg.color,
      d: `M ${cx} ${cy} L ${cx + r * Math.cos(sr)} ${cy + r * Math.sin(sr)} A ${r} ${r} 0 ${la} 1 ${cx + r * Math.cos(er)} ${cy + r * Math.sin(er)} Z`
    }
  })
})()
</script>

<template>
  <div class="page assets-page">
    <AppHeader />

    <div class="assets-overview-card">
      <div class="overview-top">
        <div class="overview-left">
          <div class="overview-title-row">
            <span class="overview-title">资产总览</span>
            <button class="eye-btn" @click="showBalance = !showBalance">
              <Eye v-if="showBalance" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
          <div class="overview-label">总资产估值</div>
          <div class="overview-amount num">
            <template v-if="showBalance">
              <span class="amount-number">104,523.78</span>
              <span class="amount-unit"> USD</span>
            </template>
            <template v-else>****</template>
          </div>
          <div class="overview-usdt num">{{ showBalance ? '≈ 104,523.78 USDT' : '****' }}</div>
          <div class="overview-pnl">
            今日收益
            <span class="pnl-value price-green num">{{ showBalance ? '+1,253.20 USD (+1.21%)' : '****' }}</span>
            <ChevronRight :size="14" />
          </div>
        </div>
        <div class="overview-right">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path v-for="p in piePaths" :key="p.label" :d="p.d" :fill="p.color" />
            <circle cx="50" cy="50" r="24" fill="white" />
          </svg>
          <div class="pie-legend">
            <div v-for="s in segments" :key="s.label" class="legend-item">
              <span class="legend-dot" :style="{ background: s.color }" />
              <span class="legend-label">{{ s.label }}</span>
              <span class="legend-pct num">{{ s.pct }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="assets-actions-bar">
      <button class="assets-action-btn" @click="router.push('/recharge')">
        <span class="action-icon-wrap"><ArrowDownLeft :size="18" /></span>
        <span>充值</span>
      </button>
      <button class="assets-action-btn" @click="router.push('/withdraw')">
        <span class="action-icon-wrap"><ArrowUpRight :size="18" /></span>
        <span>提币</span>
      </button>
      <button class="assets-action-btn" @click="router.push('/wallet')">
        <span class="action-icon-wrap"><ArrowLeftRight :size="18" /></span>
        <span>划转</span>
      </button>
    </div>

    <div class="account-tabs-card">
      <div class="account-tabs">
        <button
          v-for="tab in ['现货账户', '合约账户', '理财账户']"
          :key="tab"
          class="account-tab"
          :class="{ active: accountTab === tab }"
          @click="accountTab = tab"
        >{{ tab }}</button>
      </div>

      <div class="account-value-label">现货账户估值</div>
      <div class="account-value-amount num">
        <span class="account-amount">{{ showBalance ? '62,872.19' : '****' }}</span>
        <span class="account-unit"> USD</span>
      </div>
      <div class="account-today">
        今日收益
        <span class="price-green">{{ showBalance ? '+712.36 USD (+1.15%)' : '****' }}</span>
      </div>

      <div class="asset-table-header">
        <span class="atc coin-col">币种</span>
        <span class="atc">持仓 / 估值</span>
        <span class="atc value-col">操作</span>
      </div>
      <div class="asset-table-body">
        <div v-for="a in assetData" :key="a.symbol" class="asset-table-row">
          <div class="atc coin-col">
            <span class="asset-icon-sm" :style="{ background: a.iconBg }">{{ a.icon }}</span>
            <span class="ac-meta">
              <span class="asset-sym">{{ a.symbol }}</span>
              <span class="asset-subname">{{ a.name }}</span>
            </span>
          </div>
          <div class="atc">
            <div class="cell-main num">{{ showBalance ? a.holding : '****' }}</div>
            <div class="cell-sub num">{{ showBalance ? a.approx : '****' }}</div>
          </div>
          <div class="atc value-col">
            <span class="num">{{ showBalance ? a.valueUsd : '****' }}</span>
            <ChevronRight :size="14" color="#ccc" />
          </div>
        </div>
      </div>
      <button class="view-all-btn">查看全部资产 <ChevronRight :size="14" /></button>
    </div>

    <div class="asset-records-card">
      <div class="records-header">
        <h3>资产记录</h3>
        <div class="records-right">
          <label class="hide-small"><input type="checkbox" /> 隐藏小额</label>
          <Filter :size="16" color="#9ca3af" />
        </div>
      </div>
      <div class="record-tabs no-scrollbar">
        <button
          v-for="tab in ['全部', '充值', '提币', '划转', '交易', '收益']"
          :key="tab"
          class="record-tab"
          :class="{ active: recordTab === tab }"
          @click="recordTab = tab"
        >{{ tab }}</button>
      </div>
      <div class="record-list">
        <div v-for="(r, i) in records" :key="i" class="record-item">
          <div class="record-left">
            <span class="record-icon" :style="{ background: r.iconBg, color: r.color }">
              <ArrowDownLeft v-if="r.kind === 'in'" :size="16" />
              <ArrowUpRight v-else-if="r.kind === 'out'" :size="16" />
              <ArrowLeftRight v-else :size="16" />
            </span>
            <span class="rl-meta">
              <span class="record-type">{{ r.type }}</span>
              <span class="record-coin">{{ r.coin }}</span>
            </span>
          </div>
          <div class="record-right-info">
            <div class="record-amount num" :class="r.amount.startsWith('+') ? 'price-green' : ''">
              {{ showBalance ? r.amount : '****' }}
            </div>
            <div class="record-date">{{ r.date }}</div>
            <div class="record-status">{{ r.status }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assets-page {
  min-height: 100%;
  background: var(--bg);
  padding-bottom: calc(var(--nav-h) + 24px);
}
.assets-overview-card {
  background: var(--card-bg);
  margin: 12px 16px;
  border-radius: var(--radius);
  padding: 16px;
}
.overview-top {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
.overview-left {
  flex: 1;
}
.overview-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.overview-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.eye-btn {
  color: var(--text-muted);
}
.overview-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
}
.overview-amount {
  font-size: 26px;
  font-weight: 800;
  margin-top: 4px;
  letter-spacing: -0.02em;
}
.amount-unit {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}
.overview-usdt {
  font-size: 12px;
  color: var(--text-muted);
}
.overview-pnl {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}
.pnl-value {
  font-weight: 600;
}
.overview-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.pie-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  width: 130px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-secondary);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-pct {
  margin-left: auto;
  font-weight: 600;
  color: var(--text-primary);
}
.assets-actions-bar {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 12px;
}
.assets-action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 12px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}
.action-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.account-tabs-card {
  background: var(--card-bg);
  margin: 0 16px 12px;
  border-radius: var(--radius);
  padding: 14px;
}
.account-tabs {
  display: flex;
  gap: 14px;
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.account-tab {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  padding-bottom: 4px;
}
.account-tab.active {
  color: var(--text-primary);
  font-weight: 700;
  border-bottom: 2px solid var(--primary);
}
.account-value-label {
  font-size: 11px;
  color: var(--text-muted);
}
.account-value-amount {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 4px 0;
}
.account-unit {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}
.account-today {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.asset-table-header {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 8px 0;
  border-bottom: 1px solid var(--border-soft);
}
.atc.value-col {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}
.asset-table-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-soft);
  align-items: center;
}
.asset-table-row:last-child {
  border-bottom: none;
}
.coin-col {
  display: flex;
  align-items: center;
  gap: 8px;
}
.asset-icon-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ac-meta {
  display: flex;
  flex-direction: column;
}
.asset-sym {
  font-size: 13px;
  font-weight: 700;
}
.asset-subname {
  font-size: 10px;
  color: var(--text-muted);
}
.cell-main {
  font-size: 12px;
  font-weight: 600;
}
.cell-sub {
  font-size: 10px;
  color: var(--text-muted);
}
.view-all-btn {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.asset-records-card {
  background: var(--card-bg);
  margin: 0 16px 24px;
  border-radius: var(--radius);
  padding: 14px;
}
.records-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.records-header h3 {
  font-size: 14px;
  font-weight: 700;
}
.records-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
}
.hide-small input {
  margin-right: 4px;
}
.record-tabs {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft);
  overflow-x: auto;
}
.record-tab {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}
.record-tab.active {
  color: var(--text-primary);
  font-weight: 700;
}
.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-soft);
}
.record-item:last-child {
  border-bottom: none;
}
.record-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.record-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.rl-meta {
  display: flex;
  flex-direction: column;
}
.record-type {
  font-size: 13px;
  font-weight: 600;
}
.record-coin {
  font-size: 11px;
  color: var(--text-muted);
}
.record-right-info {
  text-align: right;
}
.record-amount {
  font-size: 13px;
  font-weight: 700;
}
.record-date {
  font-size: 10px;
  color: var(--text-muted);
}
.record-status {
  font-size: 10px;
  color: var(--text-muted);
}
</style>
