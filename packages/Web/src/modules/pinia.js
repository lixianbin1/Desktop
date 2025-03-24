import { createPinia } from 'pinia'

export const PiniaStore = createPinia()
export const install = (app) => {
  app.use(PiniaStore)
}
export default install