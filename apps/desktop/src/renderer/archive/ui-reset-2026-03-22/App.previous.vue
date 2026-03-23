<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AppInfo } from '@framework/contracts'
import AppSidebar from './components/AppSidebar.vue'
import { useAppData } from './composables/useAppData'

const appInfo = ref<AppInfo | null>(null)
const errorMessage = ref('')
const route = useRoute()
const { loadError } = useAppData()

const routeLabel = computed(() => {
  if (route.path.startsWith('/settings')) {
    return 'Framework Defaults'
  }
  if (route.path.startsWith('/projects')) {
    return 'Projects'
  }
  if (route.path.startsWith('/docs')) {
    return 'Docs'
  }

  return 'Framework App'
})

onMounted(async () => {
  try {
    appInfo.value = await window.framework.getAppInfo()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error'
  }
})
</script>

<template>
  <div class="app-shell">
    <AppSidebar />

    <main class="main-shell">
      <section class="desktop-frame">
        <header class="topbar">
          <div class="topbar-titleblock">
            <p class="eyebrow">Framework App</p>
            <h1 class="topbar-title">{{ routeLabel }}</h1>
          </div>
          <div class="topbar-meta">
            <span class="topbar-runtime">{{ appInfo?.platform ?? '...' }}</span>
          </div>
        </header>

        <section v-if="loadError || errorMessage" class="inline-alert">
          <span class="inline-alert-dot"></span>
          <p>{{ loadError || errorMessage }}</p>
        </section>

        <RouterView />
      </section>
    </main>
  </div>
</template>
