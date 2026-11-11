import { createHash } from "node:crypto"
import { loaders } from "~~/lib/cubev2/3x3x3/patterns.i18n"
import { cubesDefinition } from "~~/lib/cubev2/cubesDefinition"
import { Translator } from "~~/lib/translator/translator"

const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"

const translator = new Translator()
translator.registerLanguages(loaders)

function getPayload(bodyJson: any) {
    const body = JSON.stringify(bodyJson)
    const etag = `"${createHash("sha256").update(body).digest("hex").slice(0, 32)}"`
    return { body, etag }
}

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

    const patterns = cubesDefinition[puzzle]!.patterns!


    for (const pattern of patterns) {
        if (pattern.nameKey) pattern.name = t(pattern.nameKey)
        if (pattern.descriptionKey) pattern.description = t(pattern.descriptionKey)
    }

    const { body, etag } = getPayload(patterns)

    setResponseHeader(event, "Cache-Control", CACHE_CONTROL)
    setResponseHeader(event, "ETag", etag)
    setResponseHeader(event, "Vary", "Accept-Encoding")

    if (getRequestHeader(event, "if-none-match") === etag) {
        setResponseStatus(event, 304)
        return ""
    }

    setResponseHeader(event, "Content-Type", "application/json; charset=utf-8")
    return body
})
