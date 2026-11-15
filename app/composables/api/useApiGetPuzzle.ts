type ResponseData = {
    id: string,
    name: string,
    imageUrl: string,
    hasPatterns: boolean
    hasTrainingSets: boolean
}

export function useApiGetPuzzle() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzle: MaybeRefOrGetter<string>) => {
            return $fetch<ResponseData>(`/api/${locale.value}/puzzle/${toValue(puzzle)}`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzle: MaybeRefOrGetter<string>) {
            return useAsyncData(this.getId(puzzle), () => this.$fetch(puzzle))
        },
        getId: (puzzle: MaybeRefOrGetter<string>) => {
            return computed(() => `api-${locale.value}-puzzle-${toValue(puzzle)}`)
        }
    }
}
