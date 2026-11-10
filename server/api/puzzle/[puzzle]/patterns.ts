import { cubesDefinition } from "~~/lib/cubev2/cubesDefinition"

export default defineEventHandler((event) => {
    const puzzle = getRouterParam(event, "puzzle")
    const cubeDef = cubesDefinition[puzzle!]
    if (!cubeDef) throw createError({
        status: 404,
        statusText: "Puzzle not found"
    })
    return cubeDef.patterns
})