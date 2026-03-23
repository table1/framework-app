import { z } from 'zod'

export const APP_INFO_CHANNEL = 'app:getInfo'
export const SETTINGS_GET_GLOBAL_CHANNEL = 'settings:getGlobal'
export const PROJECTS_LIST_CHANNEL = 'projects:list'
export const DOCS_LIST_CATEGORIES_CHANNEL = 'docs:listCategories'

export const appInfoSchema = z.object({
  appName: z.string(),
  platform: z.string(),
  nodeVersion: z.string(),
  electronVersion: z.string()
})

export type AppInfo = z.infer<typeof appInfoSchema>

export const projectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  type: z.string()
})

export type ProjectSummary = z.infer<typeof projectSummarySchema>

export const docsCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  functionCount: z.number()
})

export type DocsCategory = z.infer<typeof docsCategorySchema>

export const frameworkSettingsSchema = z.object({
  author: z.object({
    name: z.string(),
    email: z.string(),
    affiliation: z.string()
  }),
  global: z.object({
    projectsRoot: z.string()
  }),
  defaults: z.object({
    projectType: z.string(),
    notebookFormat: z.string(),
    ide: z.string(),
    ai: z.object({
      canonicalFile: z.string(),
      assistants: z.array(z.string())
    })
  })
})

export type FrameworkSettings = z.infer<typeof frameworkSettingsSchema>

export interface FrameworkApi {
  getAppInfo: () => Promise<AppInfo>
  getGlobalSettings: () => Promise<FrameworkSettings>
  listProjects: () => Promise<ProjectSummary[]>
  listDocsCategories: () => Promise<DocsCategory[]>
}
