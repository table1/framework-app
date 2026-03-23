import { computed, onMounted, ref } from 'vue'
import type { DocsCategory, FrameworkSettings, ProjectSummary } from '@framework/contracts'

const settings = ref<FrameworkSettings | null>(null)
const projects = ref<ProjectSummary[]>([])
const docsCategories = ref<DocsCategory[]>([])
const loadError = ref('')
const loaded = ref(false)

async function loadAppData(): Promise<void> {
  try {
    if (!window.framework) {
      throw new Error('Framework preload API is unavailable. Restart the desktop dev process.')
    }

    const [nextSettings, nextProjects, nextDocsCategories] = await Promise.all([
      window.framework.getGlobalSettings(),
      window.framework.listProjects(),
      window.framework.listDocsCategories()
    ])

    settings.value = nextSettings
    projects.value = nextProjects
    docsCategories.value = nextDocsCategories
    loadError.value = ''
    loaded.value = true
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Failed to load app data'
  }
}

export function useAppData() {
  onMounted(() => {
    if (!loaded.value) {
      void loadAppData()
    }
  })

  return {
    settings: computed(() => settings.value),
    projects: computed(() => projects.value),
    docsCategories: computed(() => docsCategories.value),
    loadError: computed(() => loadError.value),
    loaded: computed(() => loaded.value),
    reloadAppData: loadAppData
  }
}
