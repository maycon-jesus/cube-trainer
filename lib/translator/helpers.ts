import { Languages, LanguageMessages } from "./translator"

export function mergeLanguages(...all: Languages[]): Languages {
    const n: Languages = {}
    for (const def of all) {
        deepMerge(n, def)
    }
    return n
}

function deepMerge(base: LanguageMessages, override: LanguageMessages): LanguageMessages {
    for (const key in override) {
        const message = override[key]
        if (!base[key]) {
            base[key] = message
            continue
        }
        if (typeof base[key] === "string" || typeof message === "string") {
            base[key] = message
            continue
        }
        base[key] = deepMerge(base[key], message)
    }
    return base
}