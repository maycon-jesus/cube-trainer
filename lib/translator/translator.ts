export type Languages = Record<string, LanguageMessages>

export interface LanguageMessages {
    [x: string]: string | LanguageMessages
}

export class Translator {
    langs: Languages = {}

    constructor(langs?: Languages) {
        if (langs) {
            this.langs = langs
        }
    }

    registerLanguage(lang: string, messages: LanguageMessages) {
        this.langs[lang] = messages
    }

    registerLanguages(langs: Languages) {
        this.langs = langs
    }

    t(language: string): (key: string) => string {
        return (key: string) => {
            let currentLeaf: LanguageMessages | string = this.langs[language]
            if (!currentLeaf) return key
            const keySplitted = key.split(".")

            for (const k of keySplitted) {
                if (!currentLeaf) return key
                if (typeof currentLeaf == "string") {
                    return key
                }
                currentLeaf = currentLeaf[k]
            }

            if (typeof currentLeaf == "string") return currentLeaf
            return key
        }
    }
}