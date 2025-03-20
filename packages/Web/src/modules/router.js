import { createRouter,createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'

export const routes = setupLayouts(generatedRoutes)
export const router = createRouter({
  history: createWebHistory(),
  routes,
})
export const install = (app) => {
  app.use(router)
}
export default install