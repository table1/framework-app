import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppInfo,
  DocsCategory,
  FrameworkApi,
  FrameworkSettings,
  ProjectSummary
} from '@framework/contracts'
import {
  APP_INFO_CHANNEL,
  DOCS_LIST_CATEGORIES_CHANNEL,
  PROJECTS_LIST_CHANNEL,
  SETTINGS_GET_GLOBAL_CHANNEL
} from '@framework/contracts'

const frameworkApi: FrameworkApi = {
  getAppInfo: () => ipcRenderer.invoke(APP_INFO_CHANNEL) as Promise<AppInfo>,
  getGlobalSettings: () => ipcRenderer.invoke(SETTINGS_GET_GLOBAL_CHANNEL) as Promise<FrameworkSettings>,
  listProjects: () => ipcRenderer.invoke(PROJECTS_LIST_CHANNEL) as Promise<ProjectSummary[]>,
  listDocsCategories: () => ipcRenderer.invoke(DOCS_LIST_CATEGORIES_CHANNEL) as Promise<DocsCategory[]>
}

contextBridge.exposeInMainWorld('framework', frameworkApi)
