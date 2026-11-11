export type Languages = Record<string, LanguageMessages>

export interface LanguageMessages {
    [x: string]: string | LanguageMessages
}

export class Translator {
    langs: Languages = {}

    registerLanguage(lang: string, messages: LanguageMessages) {
        this.langs[lang] = messages
    }

    registerLanguages(langs: Languages) {
        this.langs = langs
    }

    t(language: string, key: string): string {
        const keySplitted = key.split(".")
        let currentLeaf: LanguageMessages | string = this.langs[language]
        if (!currentLeaf) return key

        for (const k of keySplitted) {
            if (typeof currentLeaf == "string") {
                return key
            }
            currentLeaf = currentLeaf[k]
        }

        if (typeof currentLeaf == "string") return currentLeaf
        return key
    }
}