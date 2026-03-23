<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import OverviewCard from '../components/OverviewCard.vue'
import { useAppData } from '../composables/useAppData'

const route = useRoute()
const { settings } = useAppData()

const draftSettings = reactive({
  projectsRoot: '',
  projectType: 'project',
  notebookFormat: 'quarto',
  ide: 'vscode',
  canonicalFile: 'CLAUDE.md',
  authorName: '',
  authorEmail: '',
  authorAffiliation: ''
})

const sections = [
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
] as const

const activeSection = computed(() => {
  const section = typeof route.params.section === 'string' ? route.params.section : 'overview'
  return sections.some((item) => item.id === section) ? section : 'overview'
})

watch(
  settings,
  (current) => {
    if (!current) {
      return
    }

    draftSettings.projectsRoot = current.global.projectsRoot
    draftSettings.projectType = current.defaults.projectType
    draftSettings.notebookFormat = current.defaults.notebookFormat
    draftSettings.ide = current.defaults.ide
    draftSettings.canonicalFile = current.defaults.ai.canonicalFile
    draftSettings.authorName = current.author.name
    draftSettings.authorEmail = current.author.email
    draftSettings.authorAffiliation = current.author.affiliation
  },
  { immediate: true }
)

const overviewCards = computed(() => {
  const current = settings.value
  if (!current) {
    return []
  }

  return [
    {
      title: 'Projects Root',
      value: current.global.projectsRoot,
      description: 'Default location for newly created Framework projects.'
    },
    {
      title: 'Default Project Type',
      value: current.defaults.projectType,
      description: 'The starting project shape used by the New Project flow.'
    },
    {
      title: 'Preferred IDE',
      value: current.defaults.ide,
      description: 'Desktop launch and workspace defaults should align with this preference.'
    },
    {
      title: 'AI Canonical File',
      value: current.defaults.ai.canonicalFile,
      description: 'Used to seed project-side AI context and sync behavior.'
    }
  ]
})

const hasUnsavedChanges = computed(() => {
  const current = settings.value
  if (!current) {
    return false
  }

  return (
    draftSettings.projectsRoot !== current.global.projectsRoot ||
    draftSettings.projectType !== current.defaults.projectType ||
    draftSettings.notebookFormat !== current.defaults.notebookFormat ||
    draftSettings.ide !== current.defaults.ide ||
    draftSettings.canonicalFile !== current.defaults.ai.canonicalFile ||
    draftSettings.authorName !== current.author.name ||
    draftSettings.authorEmail !== current.author.email ||
    draftSettings.authorAffiliation !== current.author.affiliation
  )
})

function resetDraft(): void {
  const current = settings.value
  if (!current) {
    return
  }

  draftSettings.projectsRoot = current.global.projectsRoot
  draftSettings.projectType = current.defaults.projectType
  draftSettings.notebookFormat = current.defaults.notebookFormat
  draftSettings.ide = current.defaults.ide
  draftSettings.canonicalFile = current.defaults.ai.canonicalFile
  draftSettings.authorName = current.author.name
  draftSettings.authorEmail = current.author.email
  draftSettings.authorAffiliation = current.author.affiliation
}
</script>

<template>
  <section class="workspace-content page-stack">
      <PageHeader eyebrow="Framework Defaults" title="Machine-wide defaults" description="Configure the defaults used when new Framework projects are created." />

      <section v-if="activeSection === 'overview'" class="page-stack">
        <div class="card-grid">
          <OverviewCard
            v-for="card in overviewCards"
            :key="card.title"
            :title="card.title"
            :value="card.value"
            :description="card.description"
          />
        </div>

        <article class="content-section detail-panel">
          <p class="panel-kicker">Next</p>
          <h2 class="panel-title">Port the real defaults editors</h2>
          <p class="panel-copy">Structure, packages, connections, env, git, AI, Quarto, scaffold behavior, and templates land here next.</p>
        </article>
      </section>

      <section v-else-if="activeSection === 'basics'" class="page-stack">
        <article v-if="settings" class="content-section detail-panel">
          <div class="split-row">
            <div>
              <p class="panel-kicker">General</p>
              <h2 class="panel-title">Framework-wide defaults</h2>
            </div>
            <span class="status-chip">Draft</span>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>Default Projects Directory</span>
              <input v-model="draftSettings.projectsRoot" />
            </label>
            <label class="field">
              <span>Default Project Type</span>
              <select v-model="draftSettings.projectType">
                <option value="project">project</option>
                <option value="project_sensitive">project_sensitive</option>
                <option value="course">course</option>
                <option value="presentation">presentation</option>
              </select>
            </label>
            <label class="field">
              <span>Notebook Format</span>
              <select v-model="draftSettings.notebookFormat">
                <option value="quarto">quarto</option>
                <option value="rmarkdown">rmarkdown</option>
              </select>
            </label>
            <label class="field">
              <span>IDE</span>
              <select v-model="draftSettings.ide">
                <option value="positron">positron</option>
                <option value="vscode">vscode</option>
                <option value="rstudio">rstudio</option>
              </select>
            </label>
            <label class="field field-full">
              <span>AI Canonical File</span>
              <input v-model="draftSettings.canonicalFile" />
            </label>
          </div>
        </article>

        <article v-if="settings" class="content-section detail-panel">
          <div class="split-row">
            <div>
              <p class="panel-kicker">Identity</p>
              <h2 class="panel-title">Project authorship defaults</h2>
            </div>
            <span class="status-chip">Draft</span>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>Name</span>
              <input v-model="draftSettings.authorName" />
            </label>
            <label class="field">
              <span>Email</span>
              <input v-model="draftSettings.authorEmail" />
            </label>
            <label class="field field-full">
              <span>Affiliation</span>
              <input v-model="draftSettings.authorAffiliation" />
            </label>
          </div>

          <div class="toolbar-row">
            <button type="button" class="primary-button" :disabled="!hasUnsavedChanges">Save Changes</button>
            <button type="button" class="secondary-button" :disabled="!hasUnsavedChanges" @click="resetDraft">Reset</button>
          </div>
        </article>
      </section>

      <section v-else class="content-section detail-panel">
        <p class="panel-kicker">Queued Surface</p>
        <h2 class="panel-title">{{ sections.find((section) => section.id === activeSection)?.label }}</h2>
        <p class="panel-copy">This section is next in the port plan.</p>
      </section>
  </section>
</template>
