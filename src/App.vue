<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const frameMode = computed(() => route.meta?.frameMode || 'mobile')
</script>

<template>
  <div class="app-shell" :data-frame="frameMode">
    <div class="app-frame">
      <router-view v-slot="{ Component, route: r }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="r.fullPath" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: var(--bg);
}
.app-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (min-width: 768px) {
  .app-shell {
    padding: 24px 0;
    background: #e9ecf3;
  }
  .app-frame {
    border-radius: 28px;
    min-height: calc(100vh - 48px);
    box-shadow: 0 30px 80px -30px rgba(15, 23, 42, 0.25);
    overflow: hidden;
  }
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
</style>
