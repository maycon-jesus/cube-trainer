import { createHash } from "node:crypto"

type CacheOptions = {
    maxAge: number,
    sMaxAge: number,
    staleWhileRevalidate: number
}

const defaultCahce: CacheOptions = {
    maxAge: 3600,
    sMaxAge: 86400,
    staleWhileRevalidate: 604800
}

function getPayload(bodyJson: any) {
    const body = JSON.stringify(bodyJson)
    const etag = `"${createHash("sha256").update(body).digest("hex").slice(0, 32)}"`
    return { body, etag }
}

export function responseWithCache(event: any, jsonBody: any, cacheOptions: CacheOptions = defaultCahce) {
    const { etag, body } = getPayload(jsonBody)

    const CACHE_CONTROL = `public, max-age=${cacheOptions.maxAge}, s-maxage=${cacheOptions.sMaxAge}, stale-while-revalidate=${cacheOptions.staleWhileRevalidate}`
    setResponseHeader(event, "Cache-Control", CACHE_CONTROL)
    setResponseHeader(event, "ETag", etag)
    setResponseHeader(event, "Vary", "Accept-Encoding")

    if (getRequestHeader(event, "if-none-match") === etag) {
        setResponseStatus(event, 304)
        return ""
    }

    setResponseHeader(event, "Content-Type", "application/json; charset=utf-8")
    return body
}