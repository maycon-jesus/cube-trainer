import { cubesDefinition } from "~~/server/lib/cube/cubesDefinition"
import cubesTranslations from "~~/server/lib/cube/i18n"
import { Translator } from "~~/lib/translator/translator"
import { detectLanguage } from "~~/server/lib/utils/detectLanguage"
import { responseWithCache } from "~~/server/lib/utils/responseWithCache"

type ResponseType = {
    id: string,
    name: string,
    imageUrl: string,
    solves: string[],
}

const translator = new Translator()
translator.registerLanguages(cubesTranslations)

export default defineEventHandler((event) => {
    const lang = detectLanguage(event)
    const puzzle = getRouterParam(event, "puzzle")
    const setId = getRouterParam(event, "setId")
    const t = translator.t(lang)

    // hasOwn evita que chaves herdadas do prototype (ex.: "constructor") passem.
    if (!puzzle || !Object.hasOwn(cubesDefinition, puzzle)) {
        throw createError({
            status: 404,
            statusText: "Puzzle not found"
        })
    }

    const trainingSet = (cubesDefinition[puzzle]!.trainingSets ?? []).find(s => s.id === setId)
    if (!trainingSet) {
        throw createError({
            status: 404,
            statusText: "Training set not found"
        })
    }

    const resp = trainingSet.algorithms.map<ResponseType>((algorithm) => ({
        id: algorithm.id,
        name: t(t.name),
        imageUrl: algorithm.imageUrl,
        solves: algorithm.solves,
    }))

    return responseWithCache(event, resp)
})
