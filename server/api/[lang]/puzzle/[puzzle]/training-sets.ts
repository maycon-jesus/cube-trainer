import { cubesDefinition } from "~~/server/lib/cube/cubesDefinition"
import cubesTranslations from "~~/server/lib/cube/i18n"
import { Translator } from "~~/lib/translator/translator"
import { detectLanguage } from "~~/server/lib/utils/detectLanguage"
import { responseWithCache } from "~~/server/lib/utils/responseWithCache"

type ResponseType = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    algorithmCount: number,
}

const translator = new Translator()
translator.registerLanguages(cubesTranslations)

export default defineEventHandler((event) => {
    const lang = detectLanguage(event)
    const puzzle = getRouterParam(event, "puzzle")
    const t = translator.t(lang)

    // hasOwn evita que chaves herdadas do prototype (ex.: "constructor") passem.
    if (!puzzle || !Object.hasOwn(cubesDefinition, puzzle)) {
        throw createError({
            status: 404,
            statusText: "Puzzle not found"
        })
    }

    const cubeDefinition = cubesDefinition[puzzle]!
    const trainingSets = cubeDefinition.trainingSets ?? []

    const resp = trainingSets.map<ResponseType>((set) => {
        return {
            id: set.id,
            name: t(set.name),
            description: t(set.description),
            imageUrl: set.imageUrl,
            algorithmCount: set.algorithms.length,
        }
    })

    return responseWithCache(event, resp)
})
