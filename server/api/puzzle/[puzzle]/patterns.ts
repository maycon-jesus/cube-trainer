import { createHash } from "node:crypto"
import { cubesDefinition } from "~~/lib/cubev2/cubesDefinition"

// Os padrões são dados estáticos embutidos no bundle: o corpo e o ETag são
// calculados uma única vez por puzzle e reaproveitados nas próximas requisições.
const cache = new Map<string, { body: string, etag: string }>()

const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"

function getPayload(puzzle: string) {
    let entry = cache.get(puzzle)
    if (!entry) {
        const body = JSON.stringify(cubesDefinition[puzzle]!.patterns)
        const etag = `"${createHash("sha256").update(body).digest("hex").slice(0, 32)}"`
        entry = { body, etag }
        cache.set(puzzle, entry)
    }
    return entry
}

export default defineEventHandler((event) => {
    const puzzle = getRouterParam(event, "puzzle")

    // hasOwn evita que chaves herdadas do prototype (ex.: "constructor") passem.
    if (!puzzle || !Object.hasOwn(cubesDefinition, puzzle)) {
        throw createError({
            status: 404,
            statusText: "Puzzle not found"
        })
    }

    const { body, etag } = getPayload(puzzle)

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
