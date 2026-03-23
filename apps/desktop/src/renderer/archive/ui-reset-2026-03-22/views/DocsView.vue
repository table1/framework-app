<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useAppData } from '../composables/useAppData'

const { docsCategories } = useAppData()

const sections = [
  { id: 'categories', label: 'Categories' },
  { id: 'functions', label: 'Functions' },
  { id: 'search', label: 'Search' }
]

const categoryRows = computed(() => docsCategories.value)
const activeSection = ref('categories')
const activeCategoryId = ref<number>(1)

const activeCategory = computed(() => {
  return categoryRows.value.find((category) => category.id === activeCategoryId.value) ?? categoryRows.value[0] ?? null
})

function selectSection(sectionId: string): void {
  activeSection.value = sectionId
}

function selectCategory(categoryId: number): void {
  activeCategoryId.value = categoryId
}
</script>

<template>
  <section class="workspace-content page-stack">
      <PageHeader eyebrow="Docs" title="Documentation browser" description="Browse Framework documentation from local docs data." />

      <article class="content-section detail-panel">
        <div class="split-row">
          <div>
            <p class="panel-kicker">Selection</p>
            <h2 class="panel-title">{{ activeCategory?.name ?? 'Docs categories' }}</h2>
          </div>
          <span class="status-chip">{{ activeSection }}</span>
        </div>

        <div class="info-grid">
          <div class="info-tile">
            <span class="info-label">Functions</span>
            <strong class="info-value">{{ activeCategory?.functionCount ?? 0 }}</strong>
          </div>
          <div class="info-tile">
            <span class="info-label">Source</span>
            <strong class="info-value">docs.db</strong>
          </div>
          <div class="info-tile">
            <span class="info-label">Next Step</span>
            <strong class="info-value">Query category details</strong>
          </div>
        </div>

        <p class="panel-copy">Next step: wire the list to real docs queries and function details.</p>
      </article>
  </section>
</template>
