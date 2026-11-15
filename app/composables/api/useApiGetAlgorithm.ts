export function useApiGetAlgorithm() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzle: string, algorithmId: string) => {
            return $fetch<TrainingSetAlgorithm>(`/api/${locale.value}/puzzle/${puzzle}/algorithm/${algorithmId}`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        getId: (puzzle: string, algorithmId: string) => {
            return computed(() => `api-${locale.value}-puzzle-${puzzle}-algorithm-${algorithmId}`)
        }
    }
}