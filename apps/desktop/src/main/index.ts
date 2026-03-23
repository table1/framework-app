import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { AppInfoService, DocsService, ProjectRegistryService, SettingsService } from '@framework/core'
import {
  APP_INFO_CHANNEL,
  DOCS_LIST_CATEGORIES_CHANNEL,
  PROJECTS_LIST_CHANNEL,
  SETTINGS_GET_GLOBAL_CHANNEL
} from '@framework/contracts'
import { installApplicationMenu } from './menu'

const appInfoService = new AppInfoService()
const settingsService = new SettingsService()
const projectRegistryService = new ProjectRegistryService()
const docsService = new DocsService()

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void window.loadFile(join(__dirname, '../../dist/index.html'))
  }

  return window
}

function registerIpcHandlers(): void {
  ipcMain.handle(APP_INFO_CHANNEL, async () => appInfoService.getAppInfo())
  ipcMain.handle(SETTINGS_GET_GLOBAL_CHANNEL, async () => settingsService.getGlobalSettings())
  ipcMain.handle(PROJECTS_LIST_CHANNEL, async () => projectRegistryService.listProjects())
  ipcMain.handle(DOCS_LIST_CATEGORIES_CHANNEL, async () => docsService.listCategories())
}

app.whenReady().then(() => {
  registerIpcHandlers()
  installApplicationMenu()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
