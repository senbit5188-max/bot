<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'home', label: '行情', path: '/' },
  { name: 'market', label: '产品', path: '/market' },
  { name: 'community', label: '社区', path: '/community' },
  { name: 'holdings', label: '资产', path: '/holdings' },
  { name: 'account', label: '我的', path: '/account' }
]

const active = computed(() => route.meta?.tab || 'home')
const showNav = computed(() => !!route.meta?.tab || route.path === '/wallet')

function go(p) {
  if (route.path === p) return
  router.push(p)
}
</script>

<template>
  <div class="tab-shell">
    <router-view />
    <nav v-if="showNav" class="bottom-nav" role="navigation" aria-label="主导航">
      <button
        v-for="t in tabs"
        :key="t.name"
        type="button"
        class="nav-btn"
        :class="{ 'is-active': active === t.name }"
        :aria-current="active === t.name ? 'page' : undefined"
        @click="go(t.path)"
      >
        <span class="nav-icon" :data-icon="t.name" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="t.name === 'home'">
              <polyline points="4 11 12 4 20 11" />
              <path d="M6 11v8h12v-8" />
              <path d="M10 19v-5h4v5" />
            </template>
            <template v-else-if="t.name === 'market'">
              <rect x="3" y="13" width="4" height="7" rx="1" />
              <rect x="10" y="8" width="4" height="12" rx="1" />
              <rect x="17" y="4" width="4" height="16" rx="1" />
            </template>
            <template v-else-if="t.name === 'community'">
              <path d="M4 18a4 4 0 0 1 4-4h2" />
              <circle cx="9" cy="8" r="3" />
              <path d="M14 18a4 4 0 0 1 4-4" />
              <circle cx="16" cy="9" r="2.5" />
            </template>
            <template v-else-if="t.name === 'holdings'">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M3 12h18" />
            </template>
            <template v-else>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c1.6-3.2 4.4-5 7-5s5.4 1.8 7 5" />
            </template>
          </svg>
        </span>
        <span class="nav-label">{{ t.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.tab-shell {
  min-height: 100vh;
  background: var(--gdi-paper);
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: calc(var(--nav-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(245, 243, 238, 0.92);
  backdrop-filter: saturate(160%) blur(20px);
  -webkit-backdrop-filter: saturate(160%) blur(20px);
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--gdi-line);
  z-index: 100;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--gdi-ink3);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color 0.15s ease;
  padding-top: 6px;
}
.nav-btn.is-active {
  color: var(--gdi-accent);
}
.nav-btn.is-active .nav-icon {
  color: var(--gdi-accent);
  background: var(--gdi-blue-soft);
}
.nav-icon {
  width: 36px;
  height: 32px;
  border-radius: var(--r-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
  color: var(--gdi-ink3);
}
.nav-btn.is-active .nav-label {
  color: var(--gdi-accent);
  font-weight: 600;
}
.nav-label {
  font-family: var(--font-sans);
}
</style>
