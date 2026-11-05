<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
// Per-locale <html lang>, hreflang alternates (+ x-default), canonical and
// og:locale / og:locale:alternate. Requires i18n.baseUrl to be set.
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

const { t, tm, rt, locale, locales } = useI18n()
const runtimeConfig = useRuntimeConfig()

// JSON-LD (schema.org WebApplication). Description and inLanguage follow the
// active locale; the description reuses the `seo.index.description` key.
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://cubetrainer.net/#webapp',
  name: 'Cube Trainer',
  url: 'https://cubetrainer.net/',
  description: t('seo.index.description'),
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  softwareVersion: runtimeConfig.public.version,
  image: 'https://cubetrainer.net/og.png',
  inLanguage: locales.value.find(l => l.code === locale.value)?.language ?? locale.value,
  isAccessibleForFree: true,
  featureList: (tm('jsonld.index.featureList') as unknown[]).map(item => rt(item as string)),
  creator: {
    '@type': 'Person',
    name: 'Maycon Jesus',
    url: 'https://github.com/maycon-jesus',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}))

useHead(() => ({
  titleTemplate: '%s — Cube Trainer',
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto' | undefined,
  },
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
  script: [
    {
      type: 'application/ld+json',
      key: "jsonld",
      innerHTML: JSON.stringify(jsonLd.value),
    },
  ],
}))
</script>