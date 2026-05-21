import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function seededRand(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function buildSpark(seed, base, vol = 0.015, trendUp = true) {
  const rand = seededRand(seed)
  const out = []
  let v = base * 0.96
  const drift = ((base - v) / 31) * (trendUp ? 1 : -1)
  for (let i = 0; i < 32; i += 1) {
    v += drift + (rand() - 0.5) * (base * vol)
    out.push(Number(v.toFixed(6)))
  }
  return out
}

const COINS = [
  { symbol: 'BTC', name: '比特币', icon: '₿', iconBg: '#f7931a', last: 104523.78, pct: 1.23, vol: '24.32B', tag: '主流币', favored: true, sparkSeed: 11 },
  { symbol: 'ETH', name: '以太坊', icon: 'Ξ', iconBg: '#627eea', last: 2529.65, pct: 2.01, vol: '12.18B', tag: '主流币', favored: true, sparkSeed: 23 },
  { symbol: 'SOL', name: '索拉纳', icon: '◎', iconBg: '#9945ff', last: 162.35, pct: 1.45, vol: '3.21B', tag: '主流币', favored: true, sparkSeed: 37 },
  { symbol: 'AISTER', name: '艾斯特', icon: 'A', iconBg: '#2962ff', last: 0.1867, pct: 5.36, vol: '0.86B', tag: '平台币', favored: true, sparkSeed: 49 },
  { symbol: 'BNB', name: '币安币', icon: 'B', iconBg: '#f3ba2f', last: 612.40, pct: -0.35, vol: '8.74B', tag: '主流币', favored: false, sparkSeed: 61 },
  { symbol: 'XRP', name: '瑞波币', icon: 'X', iconBg: '#23292f', last: 0.5418, pct: 1.27, vol: '4.62B', tag: '主流币', favored: false, sparkSeed: 73 },
  { symbol: 'DOGE', name: '狗狗币', icon: 'Ð', iconBg: '#c2a633', last: 0.1378, pct: -1.84, vol: '3.18B', tag: '模因币', favored: false, sparkSeed: 79 },
  { symbol: 'TON', name: '电报币', icon: 'T', iconBg: '#0098ea', last: 6.84, pct: 5.62, vol: '2.06B', tag: '主流币', favored: false, sparkSeed: 83 },
  { symbol: 'ADA', name: '艾达币', icon: 'A', iconBg: '#0033ad', last: 0.4612, pct: 0.22, vol: '2.91B', tag: '主流币', favored: false, sparkSeed: 89 },
  { symbol: 'AVAX', name: '雪崩协议', icon: 'X', iconBg: '#e84142', last: 38.42, pct: -2.18, vol: '1.74B', tag: '主流币', favored: false, sparkSeed: 97 },
  { symbol: 'LINK', name: '预言机', icon: 'L', iconBg: '#375bd2', last: 14.62, pct: 3.42, vol: '1.42B', tag: 'DeFi', favored: false, sparkSeed: 101 },
  { symbol: 'OP', name: 'Optimism', icon: 'O', iconBg: '#ff0420', last: 2.18, pct: -3.62, vol: '0.62B', tag: 'L2', favored: false, sparkSeed: 103 },
  { symbol: 'MATIC', name: 'Polygon', icon: 'M', iconBg: '#8247e5', last: 0.5841, pct: 6.84, vol: '1.06B', tag: 'L2', favored: false, sparkSeed: 107 },
  { symbol: 'DOT', name: '波卡', icon: 'D', iconBg: '#e6007a', last: 7.18, pct: -0.94, vol: '0.92B', tag: '主流币', favored: false, sparkSeed: 113 }
]

const CONTRACT_LIST = [
  { symbol: 'ETH', pair: 'USDT 永续', last: 2529.65, pct: 2.01, leverage: '125x' },
  { symbol: 'BTC', pair: 'USDT 永续', last: 104523.78, pct: 1.23, leverage: '125x' },
  { symbol: 'SOL', pair: 'USDT 永续', last: 162.35, pct: 1.45, leverage: '75x' },
  { symbol: 'AISTER', pair: 'USDT 永续', last: 0.1867, pct: 5.36, leverage: '50x' },
  { symbol: 'BNB', pair: 'USDT 永续', last: 612.40, pct: -0.35, leverage: '75x' },
  { symbol: 'XRP', pair: 'USDT 永续', last: 0.5418, pct: 1.27, leverage: '50x' }
]

function fmtPrice(v) {
  if (v >= 1000) return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (v >= 100) return v.toFixed(2)
  if (v >= 10) return v.toFixed(3)
  if (v >= 1) return v.toFixed(4)
  return v.toFixed(4)
}

export const useMarketStore = defineStore('market', () => {
  const coins = ref(
    COINS.map((c) => ({
      ...c,
      pair: 'USDT',
      priceStr: fmtPrice(c.last),
      spark: buildSpark(c.sparkSeed, c.last, 0.015, c.pct >= 0)
    }))
  )

  const focus = ref('BTC')

  const focused = computed(
    () => coins.value.find((c) => c.symbol === focus.value) || coins.value[0]
  )

  const ticker = computed(() => coins.value.slice(0, 4))

  const favorites = computed(() => coins.value.filter((c) => c.favored))

  const gainers = computed(() =>
    [...coins.value].sort((a, b) => b.pct - a.pct).slice(0, 6)
  )

  const losers = computed(() =>
    [...coins.value].sort((a, b) => a.pct - b.pct).slice(0, 6)
  )

  const hot = computed(() =>
    [...coins.value]
      .sort((a, b) => parseFloat(b.vol) - parseFloat(a.vol))
      .slice(0, 6)
  )

  const contracts = ref(CONTRACT_LIST)

  function setFocus(symbol) {
    focus.value = symbol
  }

  return {
    coins,
    focus,
    focused,
    ticker,
    favorites,
    gainers,
    losers,
    hot,
    contracts,
    setFocus,
    fmtPrice
  }
})
