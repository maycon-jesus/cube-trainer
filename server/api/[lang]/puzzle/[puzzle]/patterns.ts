import { cubesDefinition } from "~~/server/lib/puzzle/cubesDefinition"
import cubesTranslations from "~~/server/lib/puzzle/i18n"
import { Translator } from "~~/lib/translator/translator"
import { detectLanguage } from "~~/server/lib/utils/detectLanguage"
import { responseWithCache } from "~~/server/lib/utils/responseWithCache"
import { Pattern } from "~~/shared/types/pattern"

type ResponseType = Pattern

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
    const patterns: ResponseType[] = structuredClone(cubeDefinition.patterns!)
        .map(p => {
            return {
                ...p,
                name: t(p.name),
                description: t(p.description),
                puzzleId: puzzle
            }
        })


    return responseWithCache(event, patterns)
})
