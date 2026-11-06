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

useHead(() => ({
  titleTemplate: '%s — Cube Trainer',
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto' | undefined,
  },
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))
</script>