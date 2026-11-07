export function useGetCurrentLocale(): string {
    const { locales, locale } = useI18n()
    return locales.value.find(l => l.code === locale.value)?.language ?? locale.value
}