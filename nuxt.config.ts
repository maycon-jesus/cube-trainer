// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Cube Timer',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Timer de speedcubing para cubo mágico' },
        { name: 'theme-color', content: '#F56217' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Cube Timer' },
        { property: 'og:title', content: 'Cube Timer' },
        { property: 'og:description', content: 'Timer de speedcubing para cubo mágico' },
        { property: 'og:image', content: '/pwa-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:image:alt', content: 'Cube Timer' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'pt_BR' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Cube Timer' },
        { name: 'twitter:description', content: 'Timer de speedcubing para cubo mágico' },
        { name: 'twitter:image', content: '/pwa-512x512.png' },
        { name: 'twitter:image:alt', content: 'Cube Timer' },
      ],
      link: [
        // PWA
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ]
    },
  },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@vercel/analytics',
    '@vercel/speed-insights'
  ],
  routeRules: {
    '/': {
      prerender: true
    },
    '/**': {
      prerender: true
    }
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff2}'],
      navigateFallback: '/',
    },
    manifest: {
      name: 'Cube Timer',
      short_name: 'Cube Timer',
      description: 'Timer de speedcubing para cubo mágico',
      lang: 'en',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display_override: ['fullscreen', 'minimal-ui'],
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#121212',
      theme_color: '#F56217',
      categories: ['utilities', 'productivity'],
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },
})