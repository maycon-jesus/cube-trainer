import { cubesDefinition } from "~~/server/lib/puzzle/cubesDefinition"
import cubesTranslations from "~~/server/lib/puzzle/i18n"
import { Translator } from "~~/lib/translator/translator"
import { detectLanguage } from "~~/server/lib/utils/detectLanguage"
import { responseWithCache } from "~~/server/lib/utils/responseWithCache"
import { TrainingAlgorithm, TrainingSet } from "~~/server/lib/puzzle/types/training"
import { TrainingSetAlgorithm } from "~~/shared/types/trainingSet"

type ResponseType = TrainingSetAlgorithm

const translator = new Translator()
translator.registerLanguages(cubesTranslations)

export default defineEventHandler((event) => {
    const lang = detectLanguage(event)
    const puzzle = getRouterParam(event, "puzzle")
    const algorithmId = getRouterParam(event, "algorithmId")
    const t = translator.t(lang)

    // hasOwn evita que chaves herdadas do prototype (ex.: "constructor") passem.
    if (!puzzle || !Object.hasOwn(cubesDefinition, puzzle)) {
        throw createError({
            status: 404,
            statusText: "Puzzle not found"
        })
    }

    let algorithmFinded: TrainingAlgorithm | undefined = undefined
    let setFinded: TrainingSet | undefined = undefined

    for (const trainingSet of cubesDefinition[puzzle]!.trainingSets) {
        const algorithm = trainingSet.algorithms.find(a => a.id === algorithmId)
        if (algorithm) {
            algorithmFinded = algorithm
            setFinded = trainingSet
            break
        }
    }

    if (!algorithmFinded || !setFinded) {
        throw createError({
            status: 404,
            statusText: "Algorithm not found"
        })
    }

    const resp: ResponseType = {
        id: algorithmFinded.id,
        name: t(algorithmFinded.name),
        imageUrl: algorithmFinded.imageUrl,
        solves: algorithmFinded.solves,
        puzzleId: puzzle,
        setId: setFinded.id
    }

    return responseWithCache(event, resp)
})
