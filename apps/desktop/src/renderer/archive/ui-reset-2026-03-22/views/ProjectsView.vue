<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useAppData } from '../composables/useAppData'

const { projects, settings } = useAppData()

const sections = [
  { id: 'registry', label: 'Project Registry' },
  { id: 'create', label: 'New Project' },
  { id: 'import', label: 'Import Project' }
]

const projectRows = computed(() => projects.value)
const activeSection = ref('registry')
const activeProjectId = ref<string>('forecasting-pipeline')

const activeProject = computed(() => {
  return projectRows.value.find((project) => project.id === activeProjectId.value) ?? projectRows.value[0] ?? null
})

const detailRows = computed(() => {
  if (!activeProject.value) {
    return []
  }

  return [
    { label: 'Project Type', value: activeProject.value.type },
    { label: 'Projects Root', value: settings.value?.global.projectsRoot ?? 'Loading...' },
    { label: 'Suggested Action', value: activeSection.value === 'create' ? 'Create project' : 'Open registry' }
  ]
})

function selectSection(sectionId: string): void {
  activeSection.value = sectionId
}

function selectProject(projectId: string): void {
  activeProjectId.value = projectId
}
</script>

<template>
  <section class="workspace-content page-stack">
      <PageHeader eyebrow="Projects" title="Project workspace" description="Create, import, open, and manage Framework projects." />

      <article class="content-section detail-panel">
        <div class="split-row">
          <div>
            <p class="panel-kicker">Selection</p>
            <h2 class="panel-title">{{ activeProject?.name ?? 'Project registry' }}</h2>
          </div>
          <span class="status-chip">{{ activeSection === 'create' ? 'Create' : activeSection === 'import' ? 'Import' : 'Registry' }}</span>
        </div>

        <p class="panel-copy" v-if="activeProject">{{ activeProject.path }}</p>
        <p class="panel-copy" v-else>No project selected yet.</p>

        <div class="info-grid">
          <div v-for="row in detailRows" :key="row.label" class="info-tile">
            <span class="info-label">{{ row.label }}</span>
            <strong class="info-value">{{ row.value }}</strong>
          </div>
        </div>

        <div class="toolbar-row">
          <button type="button" class="primary-button">Open</button>
          <button type="button" class="secondary-button">Reveal in Folder</button>
          <button type="button" class="secondary-button">Import Existing</button>
        </div>

        <p class="panel-copy">Next step: wire these actions into real project operations.</p>
      </article>
  </section>
</template>
