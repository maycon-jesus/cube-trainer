import { useSessionsStore } from "./sessions"
import type { ThemeInstance } from "vuetify"
import { puzzlesDefinition } from "~~/lib/puzzle/puzzlesDefinition"
import { IndexedDatabase } from "~~/lib/db/indexedDatabase"

export type Config = {
    id: string,
    value: any
}

const db = new IndexedDatabase<Config>('config', {})

enum ConfigKeys {
    SessionId = 'sessionId',
    Puzzle = 'puzzle',
    Theme = 'theme'
}

const configEntry = <T>(id: ConfigKeys, defValue: T) => {
    const entry = ref(defValue)
    return computed({
        get: () => entry.value,
        set: async (value: T) => {
            if(entry.value !== defValue){
                await db.put({
                    id: id,
                    value: value
                })
            }
            entry.value = value
        }
    })
}

export const useConfigStore = defineStore('config', () => {
    const $theme = useTheme()

    const sessionId = configEntry(ConfigKeys.SessionId, '')
    const puzzle = configEntry(ConfigKeys.Puzzle, '')
    const theme = configEntry(ConfigKeys.Theme, '')


    async function load() {
        sessionId.value = await loadSelectedSessionId()
        puzzle.value = await loadSelectedCubeType()
        theme.value = await loadSelectedTheme($theme)
    }

    async function reset() {
        sessionId.value = ''
        puzzle.value = ''
        theme.value = ''
        await db.deleteDB()
    }

    return {
        load, sessionId, puzzle, theme, reset,
        clear: () => db.clear(),
        count: () => db.count(),
        exportEach: db.exportEach.bind(db),
        importBatch: db.importBatch.bind(db),
    }
})

async function loadSelectedSessionId(): Promise<string> {
    const sessionId = await db.get(ConfigKeys.SessionId)
    if (!sessionId) {
        const lastSession = await useSessionsStore().getLastSession()
        if (lastSession) {
            await db.add({
                id: ConfigKeys.SessionId,
                value: lastSession.id?.toString()
            })
        }
        return loadSelectedSessionId()
    } else {
        const exists = await useSessionsStore().getSession(sessionId.value)
        if (!exists) {
            await db.delete(ConfigKeys.SessionId)
            return loadSelectedSessionId()
        } else {
            return sessionId.value
        }
    }
}

async function loadSelectedCubeType() {
    const selectedCubeType = await db.get(ConfigKeys.Puzzle)
    if (!selectedCubeType) {
        const cubeType = Object.keys(puzzlesDefinition)[1]
        if (!cubeType) {
            throw new Error("Not exists cube definition")
        }
        await db.add({
            id: ConfigKeys.Puzzle,
            value: cubeType
        })
        return loadSelectedCubeType()
    } else {
        const cubeDefinition = puzzlesDefinition[selectedCubeType.value]
        if (!cubeDefinition) {
            await db.delete(ConfigKeys.Puzzle)
            return loadSelectedCubeType()
        } else {
            return cubeDefinition.id
        }
    }
}

async function loadSelectedTheme(themeInstance: ThemeInstance) {
    const selectedTheme = await db.get(ConfigKeys.Theme)
    if (!selectedTheme) {
        await db.add({
            id: ConfigKeys.Theme,
            value: themeInstance.name.value
        })
        return loadSelectedTheme(themeInstance)
    } else {
        return selectedTheme.value
    }
}