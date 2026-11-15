import { cubesDefinition } from "~~/server/lib/puzzle/cubesDefinition"
import cubesTranslations from "~~/server/lib/puzzle/i18n"
import { Translator } from "~~/lib/translator/translator"
import { detectLanguage } from "~~/server/lib/utils/detectLanguage"
import { responseWithCache } from "~~/server/lib/utils/responseWithCache"
import { Puzzle } from "~~/shared/types/puzzle"


const translator = new Translator()
translator.registerLanguages(cubesTranslations)

type ResponseType = Puzzle

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

    const puzzleDef = cubesDefinition[puzzle]!

    const resp: ResponseType = {
        id: puzzleDef.id,
        name: t(puzzleDef.name),
        imageUrl: puzzleDef.imageUrl,
        hasPatterns: !!puzzleDef.patterns && puzzleDef.patterns.length > 0,
        hasTrainingSets: !!puzzleDef.trainingSets && puzzleDef.trainingSets.length > 0
    }

    return responseWithCache(event, resp)

})
