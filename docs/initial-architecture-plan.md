# Framework App Implementation Plan

## Purpose

Framework App will replace the current browser-plus-Plumber GUI with a local-first desktop application.

The app will:

- manage Framework state on the machine as a whole
- manage Framework state inside projects
- preserve compatibility with the existing Framework project contract
- support Linux, macOS, and Windows from the start

The app will not depend on a local web server for normal operation.

## Product Boundary

### The desktop app owns

- application shell and navigation
- global settings and project registry management
- project create, import, open, untrack, and delete workflows
- reading and writing `settings.yml` and split `settings/*.yml`
- `.env` editing and validation
- docs browsing from `docs.db`
- project scanning and local file inspection
- diagnostics for Git, Quarto, R, and Framework installation status
- launching supported local tools like editors, terminals, Git, and Quarto

### The R package continues to own

- in-project runtime behavior such as `scaffold()`
- analysis-time helpers, queries, caching, and publishing helpers
- project-side workflows used from within R
- docs generation pipelines where R remains the easiest owner

### The main rule

The app and the R package should share a file contract, not a runtime.

That contract includes:

- `settings.yml`
- split config files under `settings/`
- `.env`
- templates and generated project files
- `framework.db`
- `docs.db`
- global settings and project registry structure where practical

## Architecture

### Stack

- Electron
- Vue 3
- TypeScript
- Vite
- pnpm workspaces
- Zod
- Vitest
- Playwright
- electron-builder

### Repository shape

```text
framework-app/
  apps/
    desktop/
    cli/
  packages/
    contracts/
    core/
    docs/
    node-adapters/
    ui-shared/
  resources/
    catalogs/
    templates/
  docs/
  scripts/
  package.json
  pnpm-workspace.yaml
```

### Process model

```text
Vue renderer
  -> preload bridge
  -> Electron main
  -> shared TypeScript core
  -> filesystem / sqlite / child processes
```

### Responsibility split

#### Renderer

- UI only
- Vue views, forms, navigation, local presentation state
- no direct filesystem access
- no direct shell or child process access

#### Preload

- exposes a narrow `window.framework` API
- validates payloads before forwarding
- prevents renderer access to Node internals

#### Main process

- owns privileged operations
- owns dialogs, menus, windows, recent projects, and file watching
- validates IPC requests and delegates to shared services

#### Shared core

- global settings and registry logic
- project contract parsing and writing
- migrations
- project lifecycle operations
- docs querying helpers
- diagnostics logic

## Cross-Platform Requirements

Cross-platform support is mandatory, not optional.

### Supported platforms

- Linux
- macOS
- Windows

### Operating rules

- use Node path utilities for all path work
- normalize and validate paths at all boundaries
- never assume POSIX shell behavior
- launch executables with argument arrays, not shell strings
- avoid hardcoded home, temp, config, or executable paths
- test file watching, dialogs, and tool launching separately on each OS
- gate optional features on actual tool availability

### Packaging targets

- Linux: AppImage plus a portable archive if useful
- macOS: DMG and zip
- Windows: installer via NSIS or equivalent

### Cross-platform validation gates

- project creation works on all three OSes
- import and open flows work on all three OSes
- path normalization works with spaces and mixed separators
- docs database access works on all three OSes
- optional Git, Quarto, R detection works on all three OSes
- packaged app boots on all three OSes

## Compatibility Strategy

The first versions of the app should stay compatible with the existing Framework project format.

### Required compatibility areas

- `settings.yml` shape
- split-file settings behavior
- global settings behavior
- project registry behavior where practical
- template outputs
- `docs.db` usage
- project directory conventions

### High-risk semantic areas

The current R package supports behavior that must be matched or deliberately narrowed:

- environment overlays in config files
- split-file resolution
- `.env` loading before interpolation
- `env()` interpolation
- `!expr` evaluation

### Recommended v1 stance

- support environment overlays
- support split-file resolution
- support `.env` loading and `env()` interpolation
- detect and warn on `!expr` unless a hard requirement emerges for full parity

## Domain Model

### Global app state

- config home
- global settings
- projects root
- project registry
- settings catalog overrides
- user template overrides
- migration version state
- recent projects

### Project state

- project metadata
- project type
- directories and render directories
- packages and `renv` flags
- Quarto settings
- AI settings
- Git settings and hooks
- connections
- security settings
- `.env`
- project files and outputs
- local database artifacts such as `framework.db`

### Machine state

- Git availability and version
- Quarto availability and version
- R availability and version
- Framework R package availability
- editor availability where relevant
- config path health and permissions

### Docs state

- docs categories
- function metadata
- docs search index and results
- docs database location and health

## IPC Design

IPC should be task-oriented and explicit.

### Good channel examples

- `projects:list`
- `projects:create`
- `projects:import`
- `projects:get`
- `projects:updateSettings`
- `projects:updateEnv`
- `projects:scanFiles`
- `settings:getGlobal`
- `settings:saveGlobal`
- `docs:listCategories`
- `docs:getFunction`
- `doctor:getStatus`
- `tools:openEditor`
- `tools:runQuarto`

### Avoid

- `fs:readAnyFile`
- `shell:runCommand`
- any generic renderer-driven machine power

## Security Model

Required defaults:

- `contextIsolation: true`
- `nodeIntegration: false`
- renderer never accesses filesystem directly
- all privileged access goes through preload and IPC
- Zod validation on IPC boundaries
- allowlisted tool execution only
- path traversal protection and path normalization everywhere
- explicit secrets handling for `.env` and credentials-related fields

## MVP Scope

### MVP screens

- Projects list
- New Project
- Project detail overview
- Project settings editor
- Project structure editor
- Packages editor
- Connections editor
- `.env` editor
- Global defaults editor
- Docs browser
- Doctor / diagnostics screen

### MVP capabilities

- create projects
- import existing projects
- open project folder and supported editors
- untrack projects
- delete projects
- read and write global settings
- read and write project settings
- read and write `.env`
- browse docs from `docs.db`
- run diagnostics
- optionally regenerate Quarto files if Quarto exists

## Full Delivery Plan

### Phase 0 - Discovery and contracts

- map every current Plumber endpoint to a future IPC command
- identify what is retained, narrowed, or deferred
- collect real project fixtures from Framework projects
- freeze the v1 contract strategy

### Phase 1 - Repository bootstrap

- create the monorepo structure
- configure pnpm workspaces
- configure TypeScript, ESLint, Prettier, Vitest, Playwright
- bootstrap Electron main, preload, and Vue renderer
- configure secure Electron defaults

### Phase 2 - Contracts package

- define schemas for global settings
- define schemas for project registry entries
- define schemas for project settings sections
- define schemas for diagnostics and docs DTOs
- define typed IPC contracts

### Phase 3 - Core package

- implement config-home resolution
- implement global settings read and write
- implement projects registry read and write
- implement project settings parsing
- implement split-file resolution
- implement environment overlay resolution
- implement `.env` read and write
- implement migrations

### Phase 4 - Lifecycle operations

- implement project creation
- implement import and root resolution
- implement untrack and delete flows
- implement directory and template generation
- implement AI file generation
- implement `.gitignore` generation
- implement optional Git and Quarto adapters

### Phase 5 - Desktop app flows

- build app shell and routing
- build projects screen
- build new project screen
- build global defaults screen
- build project detail flows
- wire renderer to typed IPC services

### Phase 6 - Docs and inspection

- implement `docs.db` access helpers
- build docs categories and function detail flows
- build docs search
- implement project file and output scanning

### Phase 7 - Diagnostics and machine awareness

- detect Git
- detect Quarto
- detect R
- detect Framework R package
- surface clear health states and actions
- gate optional features based on availability

### Phase 8 - Packaging and deployment

- configure electron-builder targets for all three OSes
- add CI matrix for Linux, macOS, and Windows
- verify packaged app startup on each platform
- define macOS signing and notarization path
- define Windows installer path
- define Linux artifact strategy

### Phase 9 - CLI

- expose shared core through a CLI
- implement `doctor`, `init`, `import`, `validate`, and `open`
- keep CLI and desktop behavior aligned through shared contracts

## Implementation Checklist

### Planning and contract checklist

- [ ] inventory all current API endpoints in `framework/inst/plumber.R`
- [ ] map each endpoint to an IPC intent
- [ ] decide which behaviors are in v1, deferred, or removed
- [ ] decide v1 treatment of `!expr`
- [ ] document migration compatibility rules

### Monorepo checklist

- [ ] create `apps/desktop`
- [ ] create `apps/cli`
- [ ] create `packages/contracts`
- [ ] create `packages/core`
- [ ] create `packages/docs`
- [ ] create `packages/node-adapters`
- [ ] create `packages/ui-shared`
- [ ] create `resources/catalogs`
- [ ] create `resources/templates`
- [ ] configure root workspace scripts

### Desktop foundation checklist

- [ ] main process boot
- [ ] preload bridge
- [ ] Vue renderer boot
- [ ] secure BrowserWindow defaults
- [ ] dev and production path handling
- [ ] central IPC registration pattern
- [ ] global error handling and logging

### Contracts checklist

- [ ] global settings schema
- [ ] project registry schema
- [ ] project metadata schema
- [ ] project settings schema
- [ ] `.env` schema or DTO rules
- [ ] docs DTOs
- [ ] diagnostics DTOs
- [ ] typed IPC requests and responses

### Core compatibility checklist

- [ ] implement config-home resolution
- [ ] implement global settings read and write
- [ ] implement project registry read and write
- [ ] implement settings file discovery
- [ ] implement environment overlays
- [ ] implement split-file resolution
- [ ] implement `.env` loading
- [ ] implement `env()` interpolation
- [ ] implement `!expr` detection and policy
- [ ] implement config migrations

### Project lifecycle checklist

- [ ] create project directories
- [ ] generate `settings.yml`
- [ ] generate split files under `settings/`
- [ ] generate `.env`
- [ ] generate `.gitignore`
- [ ] generate AI files
- [ ] generate `.Rproj`
- [ ] generate workspace files where needed
- [ ] initialize Git when enabled and available
- [ ] regenerate Quarto files when requested and available
- [ ] import existing project
- [ ] resolve project root
- [ ] untrack project
- [ ] delete project safely

### Renderer checklist

- [ ] app shell
- [ ] projects list view
- [ ] new project flow
- [ ] global defaults flow
- [ ] project overview view
- [ ] settings editor
- [ ] structure editor
- [ ] packages editor
- [ ] connections editor
- [ ] `.env` editor
- [ ] docs browser
- [ ] doctor screen

### Docs checklist

- [ ] locate `docs.db`
- [ ] query categories
- [ ] query functions
- [ ] query function detail
- [ ] implement docs search
- [ ] handle docs database missing or stale states

### Diagnostics checklist

- [ ] detect Git
- [ ] detect Quarto
- [ ] detect R
- [ ] detect Framework package
- [ ] detect config-home and permissions problems
- [ ] display remediation guidance

### Cross-platform checklist

- [ ] Linux dev run works
- [ ] macOS dev run works
- [ ] Windows dev run works
- [ ] path handling test coverage exists
- [ ] file dialogs tested on Linux
- [ ] file dialogs tested on macOS
- [ ] file dialogs tested on Windows
- [ ] project create/import/delete tested on Linux
- [ ] project create/import/delete tested on macOS
- [ ] project create/import/delete tested on Windows
- [ ] docs DB access tested on Linux
- [ ] docs DB access tested on macOS
- [ ] docs DB access tested on Windows
- [ ] packaged app smoke-tested on Linux
- [ ] packaged app smoke-tested on macOS
- [ ] packaged app smoke-tested on Windows

### Release checklist

- [ ] CI matrix for Linux, macOS, Windows
- [ ] build desktop artifacts for all three OSes
- [ ] establish signing strategy
- [ ] establish notarization strategy for macOS
- [ ] establish Windows installer strategy
- [ ] define release notes and artifact publishing flow

## Recommended Early Decisions

### TypeScript

Use TypeScript with strict boundaries in contracts, IPC, and shared core.

Keep Vue component typing pragmatic rather than obsessive.

### State management

Start simple, but expect to adopt Pinia once the first major screens are in place.

### SQLite access

Use a focused docs package to query `docs.db`.

Validate the chosen SQLite dependency on Linux, macOS, and Windows early.

### R integration

For v1, detect R and Framework package presence. Do not try to install or manage them automatically yet.

### Windows support scope

Start with normal local installs and local project paths first.

Defer OneDrive and network-drive edge cases until the core flows are stable.

## Biggest Risks

- semantic drift from the R package contract
- under-testing Windows path and process behavior
- late discovery of packaging issues on one OS
- scope drift into full R environment management
- porting large GUI pages without decomposing logic into services and stores

## First Work Sequence

1. Build the endpoint-to-IPC mapping from the current Plumber API.
2. Define the shared TypeScript contracts and schemas.
3. Create compatibility fixtures from real Framework project shapes.
4. Scaffold the monorepo and secure Electron shell.
5. Implement global settings, project registry, and project create/import first.
6. Build Projects, New Project, and Global Defaults screens.
7. Add docs browsing and doctor diagnostics.
8. Add optional Quarto and Git operations after the core flows are stable.
