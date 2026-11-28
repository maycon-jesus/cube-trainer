export function useApiGetAlgorithm() {
    const { locale } = useI18n()
    return {
        $fetch: async (puzzle: string, algorithmId: string) => {
            return $fetch<TrainingSetAlgorithm>(`/api/${locale.value}/puzzle/${puzzle}/algorithm/${algorithmId}`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        useAsyncData: function (puzzle: string, algorithmId: string) {
            return useAsyncData(this.getId(puzzle,algorithmId), () => this.$fetch(puzzle,algorithmId))
        },
        getId: (puzzle: string, algorithmId: string) => {
            return computed(() => `api-${locale.value}-puzzle-${puzzle}-algorithm-${algorithmId}`)
        }
    }
}