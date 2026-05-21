<script setup>
import { useRouter } from 'vue-router'
import {
  ChevronRight, Shield, CreditCard, Users, Key, Target,
  Headphones, Settings, Info, Star, Copy
} from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()

const menuSections = [
  {
    title: '账户服务',
    items: [
      { icon: Shield, label: '实名认证', desc: '未认证', badge: '去认证', badgeColor: '#ff9800', to: '/kyc' },
      { icon: Shield, label: '安全中心', desc: '安全等级:中', to: '/account/security' },
      { icon: CreditCard, label: '收款方式', desc: '未设置', to: '/account/addresses' }
    ]
  },
  {
    title: '交易工具',
    items: [
      { icon: Users, label: '邀请返佣', desc: '邀请好友享交易返佣', to: '/info/invest' },
      { icon: Key, label: 'API 管理', desc: '创建和管理 API 密钥', to: '/account/devices' },
      { icon: Target, label: '任务中心', desc: '完成任务赚取奖励', badge: '3', badgeColor: '#ff1744', to: '/info/activity' }
    ]
  },
  {
    title: '帮助与设置',
    items: [
      { icon: Headphones, label: '在线客服', desc: '7×24 小时在线', to: '/cs' },
      { icon: Settings, label: '设置', desc: '语言 · 通知 · 偏好', to: '/account/profile' },
      { icon: Info, label: '关于 AISTER', desc: 'v2.1.0', to: '/info/about' }
    ]
  }
]

const vipBenefits = [
  { level: 'VIP 1', maker: '0.10%', taker: '0.10%', withdraw: '100 BTC' },
  { level: 'VIP 2', maker: '0.08%', taker: '0.09%', withdraw: '200 BTC' },
  { level: 'VIP 3', maker: '0.06%', taker: '0.08%', withdraw: '300 BTC' }
]
</script>

<template>
  <div class="page profile-page">
    <AppHeader />

    <div class="profile-user-card">
      <div class="puc-top">
        <div class="puc-avatar">A</div>
        <div class="puc-info">
          <div class="puc-name">AISTER_User</div>
          <div class="puc-uid">
            UID: 88216453
            <Copy :size="12" />
          </div>
        </div>
        <div class="puc-right">
          <span class="vip-badge">
            <Star :size="14" fill="#c5a44e" color="#c5a44e" />
            VIP 1
          </span>
        </div>
      </div>

      <div class="security-level">
        <div class="sl-header">
          <span>账户安全等级</span>
          <span class="sl-badge">中</span>
        </div>
        <div class="sl-bar">
          <div class="sl-fill" style="width: 60%" />
        </div>
        <div class="sl-checks">
          <span class="check-done">邮箱验证</span>
          <span class="check-done">手机绑定</span>
          <span class="check-pending">Google 2FA</span>
          <span class="check-pending">资金密码</span>
        </div>
      </div>
    </div>

    <div class="profile-stats-row">
      <div class="ps-item">
        <div class="ps-value num">$35,170.65</div>
        <div class="ps-label">总资产估值</div>
      </div>
      <div class="ps-divider" />
      <div class="ps-item">
        <div class="ps-value num">128</div>
        <div class="ps-label">累计交易</div>
      </div>
      <div class="ps-divider" />
      <div class="ps-item">
        <div class="ps-value num">32 天</div>
        <div class="ps-label">注册天数</div>
      </div>
    </div>

    <div v-for="s in menuSections" :key="s.title" class="profile-menu-section">
      <h4 class="pms-title">{{ s.title }}</h4>
      <div class="pms-list">
        <div
          v-for="item in s.items"
          :key="item.label"
          class="pms-item"
          @click="router.push(item.to)"
        >
          <span class="pms-icon"><component :is="item.icon" :size="20" /></span>
          <div class="pms-content">
            <div class="pms-label">{{ item.label }}</div>
            <div class="pms-desc">{{ item.desc }}</div>
          </div>
          <span
            v-if="item.badge"
            class="pms-badge"
            :style="{ background: item.badgeColor }"
          >{{ item.badge }}</span>
          <ChevronRight :size="16" color="#ccc" />
        </div>
      </div>
    </div>

    <div class="vip-section">
      <div class="section-header">
        <h4>VIP 权益</h4>
        <span class="more-link">查看详情 <ChevronRight :size="12" /></span>
      </div>
      <div class="vip-table">
        <div class="vip-row header">
          <span>等级</span>
          <span>Maker</span>
          <span>Taker</span>
          <span>提币上限</span>
        </div>
        <div v-for="v in vipBenefits" :key="v.level" class="vip-row">
          <span>{{ v.level }}</span>
          <span class="num">{{ v.maker }}</span>
          <span class="num">{{ v.taker }}</span>
          <span class="num">{{ v.withdraw }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100%;
  background: var(--bg);
  padding-bottom: calc(var(--nav-h) + 24px);
}
.profile-user-card {
  background: var(--card-bg);
  margin: 12px 16px;
  border-radius: var(--radius);
  padding: 16px;
}
.puc-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.puc-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2962ff 0%, #1e4bd0 100%);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}
.puc-info {
  flex: 1;
}
.puc-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.puc-uid {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
.vip-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(197, 164, 78, 0.12);
  color: #c5a44e;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 600;
}
.security-level {
  background: var(--bg);
  padding: 12px;
  border-radius: var(--radius-sm);
}
.sl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.sl-badge {
  background: #ff9800;
  color: white;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  font-weight: 600;
}
.sl-bar {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}
.sl-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%);
  border-radius: 3px;
}
.sl-checks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 11px;
}
.check-done {
  color: var(--green);
}
.check-done::before {
  content: '✓ ';
}
.check-pending {
  color: var(--text-muted);
}
.check-pending::before {
  content: '○ ';
}
.profile-stats-row {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  margin: 0 16px 12px;
  border-radius: var(--radius);
  padding: 14px;
}
.ps-item {
  flex: 1;
  text-align: center;
}
.ps-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.ps-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.ps-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
}
.profile-menu-section {
  margin: 0 16px 12px;
}
.pms-title {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  padding: 8px 4px;
}
.pms-list {
  background: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
}
.pms-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
}
.pms-item:last-child {
  border-bottom: none;
}
.pms-item:active {
  background: var(--bg);
}
.pms-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pms-content {
  flex: 1;
}
.pms-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.pms-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.pms-badge {
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  font-weight: 600;
}
.vip-section {
  background: var(--card-bg);
  margin: 0 16px 24px;
  border-radius: var(--radius);
  padding: 14px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.section-header h4 {
  font-size: 14px;
  font-weight: 700;
}
.more-link {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: var(--text-muted);
}
.vip-table {
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.vip-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.2fr;
  gap: 4px;
  padding: 8px 4px;
  font-size: 12px;
  border-bottom: 1px solid var(--border-soft);
}
.vip-row:last-child {
  border-bottom: none;
}
.vip-row.header {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
