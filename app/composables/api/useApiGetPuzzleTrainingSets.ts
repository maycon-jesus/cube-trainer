type ResponseData = TrainingSet[]

export function useApiGetPuzzleTrainingSets() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzleId: MaybeRefOrGetter<string>) => {
            return $fetch<ResponseData>(`/api/${locale.value}/puzzle/${toValue(puzzleId)}/training-sets`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzleId: MaybeRefOrGetter<string>) {
            return useAsyncData(this.getId(puzzleId), () => this.$fetch(puzzleId))
        },
        getId: (puzzleId: MaybeRefOrGetter<string>) => {
            return computed(() => `api-${locale.value}-puzzle-${toValue(puzzleId)}-training-sets`)
        }
    }
}
