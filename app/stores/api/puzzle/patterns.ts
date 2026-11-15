export const usePuzzlePatterns = defineStore('api-puzzle-patterns', () => {
    const apiPatterns = useApiGetPuzzlePatterns()
    const mapPatterns = new Map<string, ReturnType<typeof apiPatterns.useAsyncData>>()

    const getPatterns = async (puzzleId: string) => {
        const hasCache = mapPatterns.has(puzzleId)
        if (hasCache) {
            return mapPatterns.get(puzzleId)!.data
        }

        const asyncData = apiPatterns.useAsyncData(puzzleId)
        mapPatterns.set(puzzleId, asyncData)
        await asyncData
        return asyncData.data
    }

    return {
        getPatterns
    }
})