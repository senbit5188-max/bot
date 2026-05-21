<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  hint: { type: String, default: '该页面属于完整移动端,仅在此演示导航与首页交易所样式。' }
})

const router = useRouter()
</script>

<template>
  <div class="page page--noNav placeholder">
    <header class="ph-hd">
      <button class="ph-back" aria-label="返回" @click="router.back()">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <span class="ph-title">{{ title }}</span>
      <span class="ph-sp" />
    </header>
    <main class="ph-body">
      <div class="ph-card">
        <div class="ph-tag">DEMO</div>
        <h1 class="ph-h1">{{ title }}</h1>
        <p v-if="subtitle" class="ph-sub">{{ subtitle }}</p>
        <p class="ph-hint">{{ hint }}</p>
        <slot />
        <button class="ph-cta" @click="router.push('/')">回到首页 · 体验交易所样式</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.placeholder {
  min-height: 100vh;
  background: var(--gdi-paper);
}
.ph-hd {
  position: sticky;
  top: 0;
  z-index: 30;
  height: var(--header-h);
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(245, 243, 238, 0.92);
  backdrop-filter: saturate(160%) blur(20px);
  -webkit-backdrop-filter: saturate(160%) blur(20px);
  border-bottom: 1px solid var(--gdi-line2);
}
.ph-back {
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  color: var(--gdi-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ph-back:active {
  background: var(--gdi-line2);
}
.ph-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--gdi-ink);
  letter-spacing: 0.02em;
}
.ph-sp {
  width: 40px;
}
.ph-body {
  padding: 32px 16px 80px;
}
.ph-card {
  background: #fff;
  border: 1px solid var(--gdi-line2);
  border-radius: var(--r-lg);
  padding: 24px 18px;
  text-align: left;
  box-shadow: 0 10px 30px -28px rgba(11, 11, 12, 0.4);
}
.ph-tag {
  display: inline-block;
  background: var(--gdi-blue-soft);
  color: var(--gdi-accent);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  letter-spacing: 0.08em;
  font-weight: 700;
}
.ph-h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gdi-ink);
  margin: 10px 0 6px;
  letter-spacing: -0.01em;
}
.ph-sub {
  margin: 0 0 8px;
  color: var(--gdi-ink2);
  font-size: 13px;
}
.ph-hint {
  color: var(--gdi-ink3);
  font-size: 12px;
  margin: 4px 0 18px;
  line-height: 1.6;
}
.ph-cta {
  margin-top: 18px;
  display: inline-flex;
  padding: 10px 16px;
  background: var(--gdi-accent);
  color: var(--gdi-paper);
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.ph-cta:active {
  background: var(--gdi-accent3);
}
</style>
