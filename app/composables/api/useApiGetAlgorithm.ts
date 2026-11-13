export type AlgorithmResponse = {
    id: string,
    name: string,
    imageUrl: string,
    solves: string[],
    set: {
        name: string,
    }
}
export function useApiGetAlgorithm() {
    const { locale } = useI18n()
    return {
        $fetch: (puzzle: string, algorithmId: string) => {
            return $fetch<AlgorithmResponse>(`/api/${locale.value}/puzzle/${puzzle}/algorithm/${algorithmId}`, {
                retry: 3,
                retryDelay: 3000,
            })
        },
        getId: (puzzle: string, algorithmId: string) => {
            return computed(() => `api-${locale.value}-puzzle-${puzzle}-algorithm-${algorithmId}`)
        }
    }
}