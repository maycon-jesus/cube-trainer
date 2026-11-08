export const i18nLoaders = {
    en: () => import('./en.json'),
    pt: () => import('./pt.json'),
    es: () => import('./es.json'),
    zh: () => import('./zh.json'),
} as const