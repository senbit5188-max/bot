<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="launchpad card" @click="router.push('/product/aist')">
    <div class="launchpad-header">
      <h4>新币上线 Launchpad</h4>
      <span class="launch-badge">即将开始</span>
      <span class="countdown-label">开始倒计时</span>
    </div>

    <div class="launchpad-body">
      <div class="launchpad-left">
        <div class="launch-token-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1a1a2e" />
            <path d="M20 8L12 32h5l3-8 3 8h5L20 8z" fill="#2962ff" />
          </svg>
        </div>
        <div class="launch-token-info">
          <div class="launch-token-name">AIST</div>
          <div class="launch-token-desc">AI 驱动的下一代交易基础设施</div>
        </div>
      </div>
      <div class="launchpad-right">
        <div class="countdown-timer">
          <div class="countdown-item"><span class="cd-num num">02</span><span class="cd-label">天</span></div>
          <div class="countdown-item"><span class="cd-num num">18</span><span class="cd-label">时</span></div>
          <div class="countdown-item"><span class="cd-num num">45</span><span class="cd-label">分</span></div>
          <div class="countdown-item"><span class="cd-num num">12</span><span class="cd-label">秒</span></div>
        </div>
        <button class="subscribe-btn" @click.stop="router.push('/product/aist')">参与申购</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.launchpad {
  cursor: pointer;
  margin-bottom: 24px;
}
.launchpad-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.launchpad-header h4 {
  font-size: 15px;
  font-weight: 700;
}
.launch-badge {
  background: var(--red-soft);
  color: var(--red);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-weight: 600;
}
.countdown-label {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-muted);
}
.launchpad-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.launchpad-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.launch-token-icon {
  flex-shrink: 0;
}
.launch-token-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.launch-token-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.launchpad-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
.countdown-timer {
  display: flex;
  gap: 4px;
  align-items: center;
}
.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.cd-num {
  background: var(--text-primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: var(--radius-xs);
  letter-spacing: 0.04em;
}
.cd-label {
  font-size: 9px;
  color: var(--text-muted);
}
.subscribe-btn {
  background: var(--primary);
  color: white;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
}
.subscribe-btn:active {
  background: var(--primary-deep);
}
</style>
