export function useCopyToClipboard(resetMs = 1500) {
    const copied = ref(false)
    let timeout: ReturnType<typeof setTimeout> | undefined

    async function copy(text: string) {
        if (!import.meta.client || !navigator.clipboard) return
        try {
            await navigator.clipboard.writeText(text)
        }
        catch {
            return
        }
        copied.value = true
        clearTimeout(timeout)
        timeout = setTimeout(() => (copied.value = false), resetMs)
    }

    onScopeDispose(() => clearTimeout(timeout))

    return { copied, copy }
}
