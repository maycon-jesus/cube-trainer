export function useGetAbsoluteUrl() {
    const { public: { appUrl } } = useRuntimeConfig()
    const base = String(appUrl).replace(/\/$/, '')

    return (path = ''): string => `${base}${path}`
}
