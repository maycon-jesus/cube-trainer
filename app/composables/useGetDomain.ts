export function useGetDomain() {
  const { public: { appUrl } } = useRuntimeConfig()
  const localePath = useLocalePath()
  const base = String(appUrl).replace(/\/$/, '')

  return (path = '', suffix = ''): string => `${base}${localePath(path)}${suffix}`
}

