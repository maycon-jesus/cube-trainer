import { fileURLToPath } from "node:url";
import { md3 } from "vuetify/blueprints";
import pkg from "./package.json";
import { themes, defaultThemeName } from "./config/themes";

function getAllRoutesLocale(route: string){
  const locales = ['pt', 'es', 'zh']
  const routes = [route, ...locales.map(locale => `/${locale}${route}`)]
  return routes
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-07',
  devtools: { enabled: true },
  features: {
    inlineStyles: false,
  },
  site: {
    url: 'https://cubetrainer.net',
    name: 'Cube Trainer',
  },
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
      // htmlAttrs.lang and og:locale / og:locale:alternate are managed per-locale
      // by useLocaleHead({ seo: true }) in app.vue.
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Free Rubik\'s Cube timer. Get scrambles for 2x2, 3x3 and Megaminx, track your solve times and averages, and follow your progress with charts. Works offline.' },
        { name: 'theme-color', content: '#F56217' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Cube Trainer' },
        { property: 'og:title', content: 'Cube Trainer — Free Speedcubing Timer & Statistics' },
        { property: 'og:description', content: 'Free Rubik\'s Cube timer. Get scrambles for 2x2, 3x3 and Megaminx, track your solve times and averages, and follow your progress with charts. Works offline.' },
        { property: 'og:image', content: 'https://cubetrainer.net/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Cube Trainer' },
        // Twitter Card (title/description fall back to og:*)
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://cubetrainer.net/og.png' },
        { name: 'twitter:image:alt', content: 'Cube Trainer' },
      ],
      link: [
        // Favicon
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
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
            description: 'Free Rubik\'s Cube timer. Get scrambles for 2x2, 3x3 and Megaminx, track your solve times and averages, and follow your progress with charts. Works offline.',
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
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@vercel/analytics',
    '@vercel/speed-insights',
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
      prerender: true,
    }
  },
  nitro: {
    prerender: {
      routes: [
        ...getAllRoutesLocale('/training/3x3x3'),
      ]
    }
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // Absolute base URL — required so i18n can emit correct hreflang / canonical
    // links and og:url for the SEO head (useLocaleHead in app.vue).
    baseUrl: 'https://cubetrainer.net',
    locales: [
      { code: 'pt', name: 'Português', language: 'pt-BR', file: 'pt.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
      { code: 'es', name: 'Español', language: 'es-ES', file: 'es.json' },
      { code: 'zh', name: '简体中文', language: 'zh-CN', file: 'zh.json' },
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
        defaultTheme: defaultThemeName,
        themes,
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
      description: 'Free Rubik\'s Cube timer. Get scrambles for 2x2, 3x3 and Megaminx, track your solve times and averages, and follow your progress with charts. Works offline.',
      lang: 'en',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display_override: ['minimal-ui'],
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
  sitemap: {
    zeroRuntime: true
  }
})