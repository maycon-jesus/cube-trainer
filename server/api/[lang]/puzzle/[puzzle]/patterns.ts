import { cubesDefinition } from "~~/lib/cubev2/cubesDefinition"
import cubesTranslations from "~~/lib/cubev2/i18n"
import { Translator } from "~~/lib/translator/translator"
import { responseWithCache } from "~~/server/utils/responseWithCache"


const translator = new Translator()
translator.registerLanguages(cubesTranslations)

export default defineEventHandler(async (event) => {
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
    const patterns = structuredClone(cubeDefinition.patterns!)

    for (const pattern of patterns) {
        pattern.name = t(pattern.name)
        pattern.description = t(pattern.description)
    }

    return responseWithCache(event, patterns)
})
