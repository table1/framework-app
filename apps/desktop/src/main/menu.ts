import { Menu, type MenuItemConstructorOptions } from 'electron'

export function buildApplicationMenu(): Menu {
  const template: MenuItemConstructorOptions[] = [
    { label: 'File', submenu: [] },
    { label: 'Framework Defaults', submenu: [] },
    { label: 'Projects', submenu: [] },
    { label: 'Docs', submenu: [] },
    { label: 'Help', submenu: [] }
  ]

  return Menu.buildFromTemplate(template)
}

export function installApplicationMenu(): void {
  Menu.setApplicationMenu(buildApplicationMenu())
}
