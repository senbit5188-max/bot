<script setup>
import { useRouter } from 'vue-router'
import { Download, Upload, ArrowLeftRight, QrCode, Gift } from 'lucide-vue-next'

const router = useRouter()
const actions = [
  { icon: Download, label: '充币', to: '/recharge' },
  { icon: Upload, label: '提币', to: '/withdraw' },
  { icon: ArrowLeftRight, label: '划转', to: '/wallet' },
  { icon: QrCode, label: '快捷买币', to: '/trade' },
  { icon: Gift, label: '福利中心', to: '/info/activity' }
]
</script>

<template>
  <div class="quick-actions card">
    <button
      v-for="a in actions"
      :key="a.label"
      class="action-item"
      @click="router.push(a.to)"
    >
      <span class="action-icon">
        <component :is="a.icon" :size="22" :stroke-width="1.5" />
      </span>
      <span class="action-label">{{ a.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.quick-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}
.action-item:active {
  opacity: 0.6;
}
.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}
.action-label {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
