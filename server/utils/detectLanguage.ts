export function detectLanguage(event: any): string {
    const { lang } = getQuery(event)
    if (lang) {
        return lang.toString()
    }

    const langParam = getRouterParam(event, 'lang')
    if (langParam) {
        return langParam
    }

    return "en"
}