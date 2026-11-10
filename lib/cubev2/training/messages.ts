type LocaleModule = { default: Record<string, unknown> }

// Builds a `TrainingSet.loadMessages` from per-locale JSON loaders.
// Locales without a loader resolve to `undefined` (nothing is merged).
export function createMessageLoader(loaders: Record<string, () => Promise<LocaleModule>>) {
    return async (locale: string): Promise<Record<string, unknown> | undefined> => {
        const loader = loaders[locale]
        if (!loader) return undefined
        return (await loader()).default
    }
}
