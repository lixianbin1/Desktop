import { App } from 'vue'
import { createPinia } from 'pinia'

export const PiniaStore = createPinia()
export const install = (app:App) => {
  app.use(PiniaStore)
}
export default install