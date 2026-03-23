import type { AppInfo, DocsCategory, FrameworkSettings, ProjectSummary } from '@framework/contracts'

export class AppInfoService {
  getAppInfo(): AppInfo {
    return {
      appName: 'Framework App',
      platform: process.platform,
      nodeVersion: process.version,
      electronVersion: process.versions.electron ?? 'unknown'
    }
  }
}

export class SettingsService {
  getGlobalSettings(): FrameworkSettings {
    return {
      author: {
        name: 'Erik Westlund',
        email: 'erik@table1.org',
        affiliation: 'Table 1'
      },
      global: {
        projectsRoot: '~/Projects'
      },
      defaults: {
        projectType: 'project',
        notebookFormat: 'quarto',
        ide: 'positron',
        ai: {
          canonicalFile: 'CLAUDE.md',
          assistants: ['claude', 'cursor']
        }
      }
    }
  }
}

export class ProjectRegistryService {
  listProjects(): ProjectSummary[] {
    return [
      {
        id: 'forecasting-pipeline',
        name: 'Forecasting Pipeline',
        path: '/home/erik/Projects/forecasting-pipeline',
        type: 'project'
      },
      {
        id: 'phi-registry',
        name: 'PHI Registry',
        path: '/home/erik/Projects/phi-registry',
        type: 'project_sensitive'
      },
      {
        id: 'biostats-course',
        name: 'Biostats Course',
        path: '/home/erik/Projects/biostats-course',
        type: 'course'
      }
    ]
  }
}

export class DocsService {
  listCategories(): DocsCategory[] {
    return [
      { id: 1, name: 'Project Setup', functionCount: 18 },
      { id: 2, name: 'Data Workflow', functionCount: 24 },
      { id: 3, name: 'Publishing', functionCount: 11 }
    ]
  }
}
