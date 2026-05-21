<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  hint: {
    type: String,
    default: '此页面为 AISTER 移动端导航占位 · 完整功能将在下一版本上线'
  }
})

const router = useRouter()
</script>

<template>
  <div class="page page--noNav placeholder">
    <header class="ph-hd">
      <button class="ph-back" aria-label="返回" @click="router.back()">
        <ChevronLeft :size="22" />
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
        <button class="ph-cta" @click="router.push('/')">返回首页 · 体验 AISTER 交易所</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.placeholder {
  min-height: 100vh;
  background: var(--bg);
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
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}
.ph-back {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ph-back:active {
  background: var(--bg);
}
.ph-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}
.ph-sp {
  width: 40px;
}
.ph-body {
  padding: 24px 16px 32px;
}
.ph-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 24px 18px;
  text-align: left;
  box-shadow: 0 10px 30px -28px rgba(15, 23, 42, 0.3);
}
.ph-tag {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.08em;
  font-weight: 700;
}
.ph-h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 10px 0 6px;
  letter-spacing: -0.01em;
}
.ph-sub {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 13px;
}
.ph-hint {
  color: var(--text-muted);
  font-size: 12px;
  margin: 4px 0 18px;
  line-height: 1.6;
}
.ph-cta {
  margin-top: 18px;
  display: inline-flex;
  padding: 10px 18px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.ph-cta:active {
  background: var(--primary-deep);
}
</style>
