# Framework GUI Port Staged Plan

## Goal

Port the current Framework GUI from `/home/erik/Projects/framework/gui-dev/src` into the Electron app in a staged way that preserves the existing Framework project contract while replacing the browser-plus-Plumber architecture.

The implementation order is:

1. Framework defaults
2. project creation
3. project editing
4. docs and project inspection
5. diagnostics and lifecycle polish

## Current GUI Surface

### Core routes

- `/projects`
- `/projects/new`
- `/project/:id`
- `/settings/:section?/:subsection?`
- `/docs/category/:categoryId`

### Primary views

- `gui-dev/src/views/SettingsView.vue`
- `gui-dev/src/views/NewProjectView.vue`
- `gui-dev/src/views/ProjectDetailView.vue`
- `gui-dev/src/views/ProjectsView.vue`
- `gui-dev/src/views/DocsCategoryView.vue`

### Reusable logic worth porting early

- `gui-dev/src/utils/structureHelpers.js`
- `gui-dev/src/utils/structureMapping.js`
- `gui-dev/src/utils/envHelpers.js`
- `gui-dev/src/utils/connectionHelpers.js`
- `gui-dev/src/utils/packageHelpers.js`
- `gui-dev/src/utils/gitHelpers.js`

### Reusable components worth porting early

- `gui-dev/src/components/settings/ProjectStructureEditor.vue`
- `gui-dev/src/components/settings/PackagesEditor.vue`
- `gui-dev/src/components/settings/ConnectionsPanel.vue`
- `gui-dev/src/components/settings/GitHooksPanel.vue`
- `gui-dev/src/components/settings/AIAssistantsPanel.vue`
- `gui-dev/src/components/env/EnvEditor.vue`

## Stage 0 - Contracts And Port Prep

- map current REST endpoints to IPC intents
- define shared contracts for settings, templates, projects, docs, and diagnostics
- create fixtures from current GUI smoke tests and Framework sample projects
- port helper utilities into shared TypeScript modules

## Stage 1 - Framework Defaults

### Why first

Both the new-project flow and project-detail flow hydrate from Framework defaults. If this surface is stable first, later work becomes reuse rather than reinvention.

### Build order

1. app shell and router
2. settings overview
3. settings basics
4. project structure defaults
5. packages defaults
6. git and hooks defaults
7. AI defaults
8. connections defaults
9. `.env` defaults
10. scaffold behavior and Quarto defaults
11. template editing

### Required IPC

- `settings:getGlobal`
- `settings:getCatalog`
- `settings:saveGlobal`
- `templates:get`
- `templates:save`

### Definition of done

- a user can configure Framework defaults entirely in the Electron app
- values roundtrip in a structure compatible with current Framework settings files
- the app covers the same core cases currently exercised in `gui-dev/tests/integration/settings-ui-smoke.spec.js`

## Stage 2 - Project Creation

- build the projects list shell
- port the new project flow from `gui-dev/src/views/NewProjectView.vue`
- hydrate everything from Stage 1 defaults
- implement create, import, and resolve-root IPC flows

## Stage 3 - Project Editing

- port the project editor from `gui-dev/src/views/ProjectDetailView.vue`
- start with overview, basics, structure, packages, connections, `.env`, git, AI, and Quarto
- leave secondary inspection surfaces until after the primary settings work is solid

## Stage 4 - Docs And Project Inspection

- restore docs browsing from `docs.db`
- add file browsers for inputs, outputs, notebooks, and results
- add the data catalog editor

## Stage 5 - Diagnostics And Lifecycle Polish

- add the doctor screen and machine tool detection
- finish import, untrack, delete, and launch-tool actions
- add recent projects and app niceties

## Practical Execution Order

1. shared TypeScript helper extraction
2. settings shell plus overview and basics
3. remaining defaults panels
4. projects list
5. new project flow
6. project detail primary sections
7. docs browser
8. inspection surfaces
9. doctor and machine diagnostics

## Current Build Focus

The current implementation focus is Stage 1 first:

- app shell
- router
- settings navigation
- settings overview
- settings basics
- initial settings contracts and IPC
