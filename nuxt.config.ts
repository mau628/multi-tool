// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2024-11-01',
  css: ["~/assets/css/global.scss"],
  devtools: { enabled: true },
  ssr: false,
})
