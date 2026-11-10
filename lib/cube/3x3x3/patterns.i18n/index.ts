const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
    en: () => import('./en.json'),
    pt: () => import('./pt.json'),
    es: () => import('./es.json'),
    zh: () => import('./zh.json'),
}

export async function loadPatternMessages(locale: string): Promise<Record<string, unknown> | undefined> {
    const loader = loaders[locale]
    if (!loader) return undefined
    return (await loader()).default
}
