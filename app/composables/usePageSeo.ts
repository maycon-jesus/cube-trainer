type PageSeoOptions = {
  /** When false, disables the global '%s — Cube Trainer' titleTemplate (the title key must already contain the brand). */
  suffix?: boolean
}

/**
 * Applies title/description + Open Graph meta for a page from the
 * `seo.<page>.title` / `seo.<page>.description` i18n keys.
 */
export function usePageSeo(page: string, options: PageSeoOptions = {}) {
  const { suffix = true } = options
  const { t } = useI18n()

  if (!suffix) {
    useHead({ titleTemplate: null })
  }

  useSeoMeta({
    title: () => t(`seo.${page}.title`),
    ogTitle: () =>
      suffix ? `${t(`seo.${page}.title`)} — Cube Trainer` : t(`seo.${page}.title`),
    description: () => t(`seo.${page}.description`),
    ogDescription: () => t(`seo.${page}.description`),
  })
}
