<script setup>
import AppHeader from '../components/AppHeader.vue'
import PriceBanner from '../components/PriceBanner.vue'
import QuickActions from '../components/QuickActions.vue'
import PriceTicker from '../components/PriceTicker.vue'
import Watchlist from '../components/Watchlist.vue'
import NewsSection from '../components/NewsSection.vue'
import Launchpad from '../components/Launchpad.vue'
</script>

<template>
  <div class="page home-page">
    <AppHeader />
    <PriceBanner />
    <QuickActions />
    <PriceTicker />
    <Watchlist />
    <NewsSection />
    <Launchpad />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100%;
  background: var(--bg);
}
</style>
