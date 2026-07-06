import { fileURLToPath } from "node:url";
import { md3 } from "vuetify/blueprints";
import pkg from "./package.json";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      version: pkg.version,
      githubUrl: 'https://github.com/maycon-jesus/cube-trainer',
      licenseUrl: 'https://github.com/maycon-jesus/cube-trainer/blob/main/LICENSE',
      buyMeCoffeeUrl: 'https://buymeacoffee.com/mayconjesus',
    },
  },
  app: {
    head: {
      title: 'Cube Trainer — Free Speedcubing Timer & Statistics',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Speedcubing timer for Rubik\'s cube' },
        { name: 'theme-color', content: '#F56217' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Cube Trainer' },
        { property: 'og:title', content: 'Cube Trainer — Free Speedcubing Timer & Statistics' },
        { property: 'og:description', content: 'Speedcubing timer for Rubik\'s cube' },
        { property: 'og:image', content: '/pwa-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:image:alt', content: 'Cube Trainer' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'pt_BR' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Cube Trainer — Free Speedcubing Timer & Statistics' },
        { name: 'twitter:description', content: 'Speedcubing timer for Rubik\'s cube' },
        { name: 'twitter:image', content: '/pwa-512x512.png' },
        { name: 'twitter:image:alt', content: 'Cube Trainer' },
      ],
      link: [
        // PWA
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      script: [
        // JSON-LD structured data
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Cube Trainer',
            url: 'https://cubetrainer.net/',
            description: 'Speedcubing timer for Rubik\'s cube',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            browserRequirements: 'Requires JavaScript',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        },
      ]
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@vercel/analytics',
    '@vercel/speed-insights'
  ],
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
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
    moduleOptions: {
      styles: { configFile: 'assets/vuetify-settings.scss' },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            colors: {
              primary: '#F56217',
              background: '#060708',
              surface: '#121417',
            }
          },
          light: {
            dark: false,
            colors: {
              primary: '#F56217',
              background: '#FBFCFD',
              surface: '#EFF1F4',
            }
          }
        }
      },
      blueprint: md3
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff2}'],
      navigateFallback: '/',
    },
    manifest: {
      name: 'Cube Trainer',
      short_name: 'Cube Trainer',
      description: 'Speedcubing timer for Rubik\'s cube',
      lang: 'en',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display_override: ['fullscreen', 'minimal-ui'],
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#060708',
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
  alias: {
    '@icon': fileURLToPath(new URL('./app/components/icon', import.meta.url)),
  },
  eslint: {
    config: {
      stylistic: false
    }
  },
})