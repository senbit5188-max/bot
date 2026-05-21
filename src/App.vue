<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
    <div class="frame-chrome" aria-hidden="true"></div>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  width: 100%;
  background: var(--gdi-paper2);
  display: flex;
  justify-content: center;
  align-items: stretch;
  font-family: var(--font-sans);
  color: var(--gdi-ink);
}
.app-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: var(--gdi-paper);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--gdi-line2), 0 30px 80px -40px rgba(11, 11, 12, 0.35);
}
@media (min-width: 768px) {
  .app-shell {
    padding: 24px 0;
    background: var(--gdi-paper3);
  }
  .app-frame {
    border-radius: 28px;
    box-shadow: 0 0 0 1px var(--gdi-line), 0 30px 80px -30px rgba(11, 11, 12, 0.35);
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
