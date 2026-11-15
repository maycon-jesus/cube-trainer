type ResponseData = TrainingSet

export function useApiGetPuzzleTrainingSet() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzleId: string, setId: string) => {
            return $fetch<ResponseData>(`/api/${locale.value}/puzzle/${puzzleId}/training-set/${setId}`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzleId: string, setId: string) {
            return useAsyncData(this.getId(puzzleId, setId), () => this.$fetch(puzzleId, setId))
        },
        getId: (puzzleId: string, setId: string) => {
            return computed(() => `api-${locale.value}-puzzle-${puzzleId}-training-set-${setId}`)
        }
    }
}
