import { cubesDefinition } from "~~/lib/cubev2/cubesDefinition"
import { cubesDefinitionI18n } from "~~/lib/cubev2/cubesDefinition.i18n"
import { Translator } from "~~/lib/translator/translator"

type ResponseType = {
    id: string,
    name: string,
    imageUrl: string,
    hasPatterns: boolean
}

const translator = new Translator()
translator.registerLanguages(cubesDefinitionI18n)

export default defineEventHandler((event) => {
    const lang = detectLanguage(event)
    const t = translator.t(lang)

    const resp = Object.entries(cubesDefinition)
        .map<ResponseType>(([id, cube]) => {
            return {
                id,
                name: cube.name,
                imageUrl: cube.imageUrl,
                hasPatterns: !!cube.patterns && cube.patterns.length > 0
            }
        })
        .map(r => {
            r.name = t(r.name)
            return r
        })

    return resp
})