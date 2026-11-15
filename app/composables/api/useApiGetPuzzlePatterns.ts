type ResponseData = Pattern[]

export function useApiGetPuzzlePatterns() {
    const l = useLocale()
    return {
        $fetch: (puzzleId: string) => {
            return $fetch<ResponseData>(`/api/${l.current.value}/puzzle/${puzzleId}/patterns`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzleId: string) {
            return useAsyncData(this.getId(puzzleId), () => this.$fetch(puzzleId))
        },
        getId: (puzzleId: string) => {
            return computed(() => `api-${l.current.value}-puzzle-${puzzleId}-patterns`)
        }
    }
}