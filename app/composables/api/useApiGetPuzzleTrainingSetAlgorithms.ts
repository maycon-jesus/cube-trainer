type ResponseData = TrainingSetAlgorithm[]

export function useApiGetPuzzleTrainingSetAlgorithms() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzleId: string, setId: string) => {
            return $fetch<ResponseData>(`/api/${locale.value}/puzzle/${puzzleId}/training-set/${setId}/algorithms`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzleId: string, setId: string) {
            return useAsyncData(this.getId(puzzleId, setId), () => this.$fetch(puzzleId, setId), {
                default() {
                    return []
                },
            })
        },
        getId: (puzzleId: string, setId: string) => {
            return computed(() => `api-${locale.value}-puzzle-${puzzleId}-training-set-${setId}-algorithms`)
        }
    }
}
