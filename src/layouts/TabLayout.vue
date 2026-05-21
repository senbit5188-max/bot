<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, BarChart3, ArrowLeftRight, FileText, Wallet } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'home', label: '首页', path: '/', icon: Home },
  { name: 'market', label: '行情', path: '/market', icon: BarChart3 },
  { name: 'trade', label: '交易', path: '/trade', icon: ArrowLeftRight },
  { name: 'contract', label: '合约', path: '/contract', icon: FileText },
  { name: 'assets', label: '资产', path: '/assets', icon: Wallet }
]

const showNav = computed(() => !!route.meta?.tab)

function go(p) {
  if (route.path === p) return
  router.push(p)
}
</script>

<template>
  <div class="tab-shell">
    <router-view />
    <nav v-if="showNav" class="bottom-nav" aria-label="主导航">
      <button
        v-for="t in tabs"
        :key="t.name"
        type="button"
        class="nav-item"
        :class="{ active: route.meta?.tab === t.name }"
        :aria-current="route.meta?.tab === t.name ? 'page' : undefined"
        @click="go(t.path)"
      >
        <component
          :is="t.icon"
          :size="22"
          :stroke-width="route.meta?.tab === t.name ? 2.2 : 1.8"
        />
        <span>{{ t.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.tab-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  background: var(--bg);
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: var(--nav-h);
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid var(--border);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--text-muted);
  font-size: 10px;
  padding: 4px 12px;
  transition: color 0.2s ease;
}
.nav-item.active {
  color: var(--primary);
}
.nav-item span {
  margin-top: 2px;
}
</style>
