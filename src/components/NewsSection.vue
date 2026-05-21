<script setup>
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()

const announcements = [
  { text: '关于上线 AISTER/USDT 现货交易的公告', date: '05/20', slug: 'aister-listing' },
  { text: '关于系统升级维护的公告(5月20日)', date: '05/19', slug: 'maintenance-0520' },
  { text: 'AISTER 合约交易大赛正式开启', date: '05/18', slug: 'contract-tournament' }
]

const flash = [
  { text: '美联储会议纪要:多位官员认为通胀风险仍存,需保持谨慎', time: '2 分钟前', slug: 'fed-minutes' },
  { text: 'BTC 突破 104,000 USDT,24H 涨幅 1.23%', time: '5 分钟前', slug: 'btc-104k' }
]
</script>

<template>
  <div class="news-section card">
    <div class="news-columns">
      <div class="news-col">
        <div class="news-col-header">
          <h4>公告</h4>
          <button class="more-btn" @click="router.push('/notifications')">
            更多 <ChevronRight :size="14" />
          </button>
        </div>
        <ul class="news-list">
          <li v-for="a in announcements" :key="a.slug" @click="router.push(`/announcement/${a.slug}`)">
            <span class="news-text">• {{ a.text }}</span>
            <span class="news-date">{{ a.date }}</span>
          </li>
        </ul>
      </div>
      <div class="news-col">
        <div class="news-col-header">
          <h4>快讯</h4>
          <button class="more-btn" @click="router.push('/info/news')">
            更多 <ChevronRight :size="14" />
          </button>
        </div>
        <ul class="news-list">
          <li v-for="n in flash" :key="n.slug" @click="router.push(`/news/${n.slug}`)">
            <div class="news-item-flash">
              <span class="flash-tag">快讯</span>
              <span class="news-text">{{ n.text }}</span>
            </div>
            <span class="news-date">{{ n.time }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-section {
  padding: 16px;
}
.news-columns {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.news-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.news-col-header h4 {
  font-size: 15px;
  font-weight: 700;
}
.more-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--text-muted);
  font-size: 12px;
}
.news-list {
  list-style: none;
}
.news-list li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
}
.news-list li:active {
  opacity: 0.6;
}
.news-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}
.news-date {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.news-item-flash {
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
}
.flash-tag {
  background: var(--red-soft);
  color: var(--red);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}
</style>
