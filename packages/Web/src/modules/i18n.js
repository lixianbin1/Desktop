import { createI18n } from 'vue-i18n'

const messages = Object.fromEntries(
  Object.entries(import.meta.glob('../language/*.y(a)?ml',{ eager: true }))
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(12, yaml ? -5 : -4), value.default]
    }),
)

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})

export const install = (app) => {
  app.use(i18n)
}
export default install
