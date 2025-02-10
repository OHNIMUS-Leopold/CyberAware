export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint'
  ],

  // runtimeConfig: {
  //   public: {
  //     apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
  //   },
  // },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});