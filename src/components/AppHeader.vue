<script setup>
import { useRouter } from 'vue-router'
import { Search, ScanLine, Bell, User } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <header class="app-header">
    <div class="header-logo" @click="router.push('/')">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2L4 28h8l4-10 4 10h8L16 2z" fill="#2962ff" />
      </svg>
      <span class="logo-text">AISTER</span>
    </div>
    <div class="header-actions">
      <button class="header-btn" aria-label="搜索" @click="router.push('/search')">
        <Search :size="20" />
      </button>
      <button class="header-btn" aria-label="扫码">
        <ScanLine :size="20" />
      </button>
      <button class="header-btn notification-btn" aria-label="通知" @click="router.push('/notifications')">
        <Bell :size="20" />
        <span class="notification-dot"></span>
      </button>
      <button class="header-btn" aria-label="个人中心" @click="router.push('/account')">
        <User :size="20" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--card-bg);
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}
.notification-btn {
  position: relative;
}
.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background: var(--red);
  border-radius: 50%;
}
</style>
