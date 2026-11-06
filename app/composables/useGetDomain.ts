export function useGetDomain() {
  const { public: { appUrl } } = useRuntimeConfig()
  const base = String(appUrl).replace(/\/$/, '')

  return (path = '', suffix = ''): string => `${base}${path}${suffix}`
}
