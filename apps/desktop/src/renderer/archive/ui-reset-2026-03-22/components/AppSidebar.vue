<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import frameworkHex from '../assets/framework-hex.png'

const route = useRoute()
const router = useRouter()

type GlobalNavKey = 'settings' | 'projects' | 'docs'

const settingsSections = [
  { label: 'Overview', to: '/settings/overview' },
  { label: 'Basics', to: '/settings/basics' },
  { label: 'Project Structure', to: '/settings/project-structure' },
  { label: 'Packages', to: '/settings/packages' },
  { label: 'Connections', to: '/settings/connections' },
  { label: '.env Defaults', to: '/settings/env' },
  { label: 'Git & Hooks', to: '/settings/git' },
  { label: 'AI Assistants', to: '/settings/ai' },
  { label: 'Quarto', to: '/settings/quarto' },
  { label: 'Scaffold Behavior', to: '/settings/scaffold' },
  { label: 'Templates', to: '/settings/templates' }
] as const

const projectSections = [
  { label: 'Project Registry', to: '/projects' },
  { label: 'New Project', to: '/projects#create' },
  { label: 'Import Project', to: '/projects#import' }
] as const

const docsSections = [
  { label: 'Categories', to: '/docs' },
  { label: 'Functions', to: '/docs#functions' },
  { label: 'Search', to: '/docs#search' }
] as const

const globalItems = [
  {
    key: 'settings' as const,
    label: 'Framework Defaults',
    to: '/settings/overview'
  },
  {
    key: 'projects' as const,
    label: 'Projects',
    to: '/projects'
  },
  {
    key: 'docs' as const,
    label: 'Documentation',
    to: '/docs'
  }
]

const activeGlobalKey = computed<GlobalNavKey>(() => {
  if (route.path.startsWith('/projects')) {
    return 'projects'
  }

  if (route.path.startsWith('/docs')) {
    return 'docs'
  }

  return 'settings'
})

const sidebarLevel = ref<'global' | 'contextual'>('global')

watch(
  activeGlobalKey,
  () => {
    sidebarLevel.value = 'contextual'
  },
  { immediate: true }
)

const activeGlobalItem = computed(() => {
  return globalItems.find((item) => item.key === activeGlobalKey.value) ?? globalItems[0]
})

const contextualItems = computed(() => {
  if (activeGlobalKey.value === 'projects') {
    return projectSections
  }

  if (activeGlobalKey.value === 'docs') {
    return docsSections
  }

  return settingsSections
})

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function openGlobalLevel(): void {
  sidebarLevel.value = 'global'
}

function openContextualLevel(item: (typeof globalItems)[number]): void {
  sidebarLevel.value = 'contextual'
  void router.push(item.to)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-header-zone">
        <RouterLink to="/settings" class="sidebar-brand-link" aria-label="Framework App home">
          <img :src="frameworkHex" alt="" class="sidebar-logo" />
          <span class="sidebar-wordmark">Framework</span>
        </RouterLink>
      </div>

      <template v-if="sidebarLevel === 'global'">
        <nav class="sidebar-nav" aria-label="Primary navigation">
          <button
            v-for="item in globalItems"
            :key="item.key"
            type="button"
            class="sidebar-tab"
            :class="{ 'sidebar-tab-active': item.key === activeGlobalKey }"
            @click="openContextualLevel(item)"
          >
            {{ item.label }}
          </button>
        </nav>
      </template>

      <template v-else>
        <div class="sidebar-context-header">
          <button type="button" class="sidebar-back" @click="openGlobalLevel">&larr; Back</button>
          <p class="sidebar-context-title">{{ activeGlobalItem?.label }}</p>
        </div>

        <nav class="sidebar-subnav" :aria-label="activeGlobalItem?.label">
          <RouterLink
            v-for="item in contextualItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-subtab"
            :class="{ 'sidebar-subtab-active': isActive(item.to) }"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </template>
    </div>
  </aside>
</template>
