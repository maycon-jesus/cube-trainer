export function formatTimestamp(locale: string,timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString(locale)
}

export function formatTimestampParts(locale: string, timestamp: number): { date: string, time: string } {
  const d = new Date(timestamp)
  return {
    date: d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  }
}