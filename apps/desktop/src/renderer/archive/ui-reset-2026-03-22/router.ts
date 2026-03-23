import { createRouter, createWebHashHistory } from 'vue-router'
import DocsView from './views/DocsView.vue'
import ProjectsView from './views/ProjectsView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/settings'
    },
    {
      path: '/settings/:section?/:subsection?',
      name: 'settings',
      component: SettingsView,
      props: true
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView
    }
  ]
})

export default router
