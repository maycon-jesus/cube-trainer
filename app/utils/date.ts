export function formatTimestamp(locale: string,timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString(locale)
}