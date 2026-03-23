<script setup lang="ts">
import { computed, ref } from 'vue'

type ModeId = 'framework' | 'projects' | 'docs'

interface NavItem {
  id: string
  label: string
}

interface ModeDefinition {
  id: ModeId
  label: string
  title: string
  description: string
  items: NavItem[]
}

const modeDefinitions: ModeDefinition[] = [
  {
    id: 'framework',
    label: 'Project Defaults',
    title: 'Framework Defaults',
    description: 'Machine-wide defaults and configuration live here.',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'basics', label: 'Basics' },
      { id: 'project-structure', label: 'Project Structure' },
      { id: 'packages', label: 'Packages' },
      { id: 'connections', label: 'Connections' },
      { id: 'env', label: '.env Defaults' },
      { id: 'git', label: 'Git & Hooks' },
      { id: 'ai', label: 'AI Assistants' },
      { id: 'quarto', label: 'Quarto' },
      { id: 'scaffold', label: 'Scaffold Behavior' },
      { id: 'templates', label: 'Templates' }
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects',
    description: 'Project creation, import, and management will live here.',
    items: [
      { id: 'registry', label: 'Project Registry' },
      { id: 'create', label: 'New Project' },
      { id: 'import', label: 'Import Project' }
    ]
  },
  {
    id: 'docs',
    label: 'Docs',
    title: 'Documentation',
    description: 'Framework documentation browsing and search will live here.',
    items: [
      { id: 'categories', label: 'Categories' },
      { id: 'functions', label: 'Functions' },
      { id: 'search', label: 'Search' }
    ]
  }
]

const activeMode = ref<ModeId>('framework')
const activeItems = ref<Record<ModeId, string>>({
  framework: 'overview',
  projects: 'registry',
  docs: 'categories'
})

const fallbackMode: ModeDefinition = {
  id: 'framework',
  label: 'Project Defaults',
  title: 'Framework Defaults',
  description: 'Machine-wide defaults and configuration live here.',
  items: [{ id: 'overview', label: 'Overview' }]
}

const currentMode = computed<ModeDefinition>(() => {
  return modeDefinitions.find((mode) => mode.id === activeMode.value) ?? fallbackMode
})

const currentItem = computed(() => {
  return currentMode.value.items.find((item) => item.id === activeItems.value[activeMode.value]) ?? currentMode.value.items[0] ?? null
})

function selectMode(mode: ModeId): void {
  activeMode.value = mode
}

function selectItem(itemId: string): void {
  activeItems.value = {
    ...activeItems.value,
    [activeMode.value]: itemId
  }
}
</script>

<template>
  <main class="app-shell">
    <aside class="activity-bar" aria-label="App modes">
      <button
        type="button"
        class="activity-button"
        :class="{ 'activity-button-active': activeMode === 'framework' }"
        aria-label="Project Defaults"
        title="Project Defaults"
        @click="selectMode('framework')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.25 4.5 7.5v9L12 20.75l7.5-4.25v-9L12 3.25Z" />
          <path d="M9 10.5h6" />
          <path d="M9 13.5h6" />
          <path d="M12 7.75v8.5" />
        </svg>
        <span class="activity-button-label">Project Defaults</span>
      </button>

      <button
        type="button"
        class="activity-button"
        :class="{ 'activity-button-active': activeMode === 'projects' }"
        aria-label="Projects"
        title="Projects"
        @click="selectMode('projects')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.75 6.75h5l1.5 2h9v8.5a1 1 0 0 1-1 1h-13.5a1 1 0 0 1-1-1v-10.5a1 1 0 0 1 1-1Z" />
        </svg>
        <span class="activity-button-label">Projects</span>
      </button>

      <button
        type="button"
        class="activity-button"
        :class="{ 'activity-button-active': activeMode === 'docs' }"
        aria-label="Docs"
        title="Docs"
        @click="selectMode('docs')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.75 4.75h9.5a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1h-9.5a2 2 0 0 0-2 2v-14.5a2 2 0 0 1 2-2Z" />
          <path d="M8.75 8.25h5.5" />
          <path d="M8.75 11.25h5.5" />
        </svg>
        <span class="activity-button-label">Docs</span>
      </button>
    </aside>

    <aside class="mode-sidebar" aria-label="Sidebar navigation">
      <header class="mode-sidebar-header">
        <p class="mode-label">{{ currentMode.label }}</p>
      </header>

      <nav class="mode-nav">
        <button
          v-for="item in currentMode.items"
          :key="item.id"
          type="button"
          class="mode-nav-item"
          :class="{ 'mode-nav-item-active': currentItem?.id === item.id }"
          @click="selectItem(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <section class="content-area">
      <header class="content-header">
        <p class="content-eyebrow">{{ currentMode.label }}</p>
        <h1>{{ currentItem?.label ?? currentMode.title }}</h1>
      </header>

      <section class="content-body">
        <p>{{ currentMode.description }}</p>
      </section>
    </section>
  </main>
</template>
