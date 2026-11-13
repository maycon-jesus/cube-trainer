type ResponseData = {
    id: string,
    name: string,
    imageUrl: string,
    hasPatterns: boolean
    hasTrainingSets: boolean
}

export function useApiGetPuzzles() {
    const { locale } = useI18n()
    return {
        $fetch: () => {
            return $fetch<ResponseData>(`/api/${locale.value}/puzzles`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function () {
            return useAsyncData(this.getId(), () => this.$fetch())
        },
        getId: () => {
            return computed(() => `api-${locale.value}-puzzles`)
        }
    }
}