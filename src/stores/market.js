import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function seededRand(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function buildSpark(seed, base, vol = 0.02) {
  const rand = seededRand(seed)
  const out = []
  let v = base
  for (let i = 0; i < 32; i += 1) {
    v += (rand() - 0.5) * (base * vol)
    out.push(Number(v.toFixed(Math.max(2, 6 - Math.floor(Math.log10(base + 1))))))
  }
  return out
}

// Hero indexes — major crypto pairs styled as AISTER market indexes
const INDEX_RAW = [
  {
    code: 'BTC/USDT',
    name: '比特币 · Bitcoin',
    last: 68420.55,
    chg: 612.30,
    pct: 0.91,
    high: 69100.00,
    low: 67820.40,
    vol24h: '128.4 亿 USDT',
    cap: '1.34 万亿 USDT',
    weight: '现货深度 #1 · 永续未平仓 38.2 亿',
    sparkSeed: 11,
    badge: 'BTC',
    badgeColor: '#f7931a'
  },
  {
    code: 'ETH/USDT',
    name: '以太坊 · Ethereum',
    last: 3412.08,
    chg: 18.42,
    pct: 0.54,
    high: 3438.50,
    low: 3392.10,
    vol24h: '52.7 亿 USDT',
    cap: '4108 亿 USDT',
    weight: '现货深度 #2 · 永续未平仓 14.6 亿',
    sparkSeed: 23,
    badge: 'Ξ',
    badgeColor: '#627eea'
  },
  {
    code: 'SOL/USDT',
    name: '索拉纳 · Solana',
    last: 168.32,
    chg: 4.62,
    pct: 2.82,
    high: 170.50,
    low: 162.41,
    vol24h: '18.2 亿 USDT',
    cap: '764 亿 USDT',
    weight: 'L1 蓝筹 · 永续未平仓 3.8 亿',
    sparkSeed: 37,
    badge: '◎',
    badgeColor: '#9945ff'
  },
  {
    code: 'AISTER/USDT',
    name: '艾斯特平台币 · AISTER',
    last: 12.86,
    chg: 0.54,
    pct: 4.38,
    high: 13.12,
    low: 12.22,
    vol24h: '3.42 亿 USDT',
    cap: '128.6 亿 USDT',
    weight: '平台币 · 持有 AISTER 享手续费折扣',
    sparkSeed: 49,
    badge: 'A',
    badgeColor: '#c5a44e'
  },
  {
    code: 'BNB/USDT',
    name: '币安币 · BNB',
    last: 612.40,
    chg: -2.18,
    pct: -0.35,
    high: 618.20,
    low: 608.15,
    vol24h: '8.74 亿 USDT',
    cap: '892 亿 USDT',
    weight: 'CEX 平台币 · 主网生态龙头',
    sparkSeed: 61,
    badge: 'B',
    badgeColor: '#f3ba2f'
  }
]

const MOVERS_RAW = [
  { code: 'BTC/USDT', name: '比特币', last: 68420.55, pct: 0.91, vol: '128.4 亿', favored: true, sparkSeed: 71, badge: 'BTC', badgeColor: '#f7931a' },
  { code: 'ETH/USDT', name: '以太坊', last: 3412.08, pct: 0.54, vol: '52.7 亿', favored: true, sparkSeed: 73, badge: 'Ξ', badgeColor: '#627eea' },
  { code: 'SOL/USDT', name: '索拉纳', last: 168.32, pct: 2.82, vol: '18.2 亿', favored: true, sparkSeed: 79, badge: '◎', badgeColor: '#9945ff' },
  { code: 'AISTER/USDT', name: '艾斯特', last: 12.86, pct: 4.38, vol: '3.42 亿', favored: true, sparkSeed: 83, badge: 'A', badgeColor: '#c5a44e' },
  { code: 'BNB/USDT', name: '币安币', last: 612.40, pct: -0.35, vol: '8.74 亿', favored: true, sparkSeed: 89, badge: 'B', badgeColor: '#f3ba2f' },
  { code: 'XRP/USDT', name: '瑞波币', last: 0.5418, pct: 1.27, vol: '4.62 亿', favored: false, sparkSeed: 97, badge: 'X', badgeColor: '#23292f' },
  { code: 'DOGE/USDT', name: '狗狗币', last: 0.1378, pct: -1.84, vol: '3.18 亿', favored: false, sparkSeed: 101, badge: 'Ð', badgeColor: '#c2a633' },
  { code: 'TON/USDT', name: '电报币', last: 6.84, pct: 5.62, vol: '2.06 亿', favored: false, sparkSeed: 103, badge: 'T', badgeColor: '#0098ea' },
  { code: 'ADA/USDT', name: '艾达币', last: 0.4612, pct: 0.22, vol: '2.91 亿', favored: false, sparkSeed: 107, badge: 'A', badgeColor: '#0033ad' },
  { code: 'AVAX/USDT', name: '雪崩协议', last: 38.42, pct: -2.18, vol: '1.74 亿', favored: false, sparkSeed: 109, badge: 'X', badgeColor: '#e84142' },
  { code: 'LINK/USDT', name: '预言机', last: 14.62, pct: 3.42, vol: '1.42 亿', favored: false, sparkSeed: 113, badge: 'L', badgeColor: '#375bd2' },
  { code: 'DOT/USDT', name: '波卡', last: 7.18, pct: -0.94, vol: '0.92 亿', favored: false, sparkSeed: 127, badge: 'D', badgeColor: '#e6007a' },
  { code: 'MATIC/USDT', name: 'Polygon', last: 0.5841, pct: 6.84, vol: '1.06 亿', favored: false, sparkSeed: 131, badge: 'M', badgeColor: '#8247e5' },
  { code: 'OP/USDT', name: 'Optimism', last: 2.18, pct: -3.62, vol: '0.62 亿', favored: false, sparkSeed: 137, badge: 'O', badgeColor: '#ff0420' }
]

export const useMarketStore = defineStore('market', () => {
  const indexes = ref(
    INDEX_RAW.map((it) => ({
      ...it,
      spark: buildSpark(it.sparkSeed, it.last, 0.015)
    }))
  )

  const movers = ref(
    MOVERS_RAW.map((it) => ({
      ...it,
      spark: buildSpark(it.sparkSeed, it.last, 0.015)
    }))
  )

  const focus = ref(indexes.value[0].code)

  const focused = computed(
    () => indexes.value.find((i) => i.code === focus.value) || indexes.value[0]
  )

  const ticker = computed(() =>
    indexes.value.map((it) => ({
      code: it.code,
      last: it.last,
      pct: it.pct
    }))
  )

  const favorites = computed(() => movers.value.filter((m) => m.favored))

  const gainers = computed(() =>
    [...movers.value].sort((a, b) => b.pct - a.pct).slice(0, 8)
  )

  const losers = computed(() =>
    [...movers.value].sort((a, b) => a.pct - b.pct).slice(0, 8)
  )

  const hot = computed(() =>
    [...movers.value]
      .sort((a, b) => parseFloat(b.vol) - parseFloat(a.vol))
      .slice(0, 8)
  )

  function setFocus(code) {
    focus.value = code
  }

  return {
    indexes,
    movers,
    focus,
    focused,
    ticker,
    favorites,
    gainers,
    losers,
    hot,
    setFocus
  }
})
