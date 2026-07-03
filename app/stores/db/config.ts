import { Database } from "~~/lib/db/database"
import { useSessionsStore } from "./sessions"
import { cubesDefinition } from "~~/lib/cube/cubesDefinition"
import type { ThemeInstance } from "vuetify"

export type Config = {
    id?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

const db = new Database<Config>('config', 'config', {
    autoIncrement: false,
})

enum ConfigKeys {
    SessionId = 'sessionId',
    Puzzle = 'puzzle',
    Theme = 'theme'
}

const configEntry = <T>(id: ConfigKeys, value: T) => {
    const entry = ref(value)
    return computed({
        get: () => entry.value,
        set: async (value: T) => {
            await db.put({
                id: id,
                value: value
            })
            entry.value = value
        }
    })
}

export const useConfigStore = defineStore('config', () => {
    const $theme = useTheme()

    const sessionId = configEntry(ConfigKeys.SessionId, 0)
    const puzzle = configEntry(ConfigKeys.Puzzle, '')
    const theme = configEntry(ConfigKeys.Theme, '')


    async function load() {
        sessionId.value = await loadSelectedSessionId()
        puzzle.value = await loadSelectedCubeType()
        theme.value = await loadSelectedTheme($theme)
    }

    async function reset() {
        sessionId.value = 0
        puzzle.value = ''
        theme.value = ''
        await db.deleteDB()
    }

    return { load, sessionId, puzzle, theme, reset }
})

async function loadSelectedSessionId(): Promise<number> {
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
        const sessionIdParsed = parseInt(sessionId.value)

        const exists = await useSessionsStore().getSession(sessionIdParsed)
        if (!exists) {
            await db.delete(ConfigKeys.SessionId)
            return loadSelectedSessionId()
        } else {
            return sessionIdParsed
        }
    }
}

async function loadSelectedCubeType() {
    const selectedCubeType = await db.get(ConfigKeys.Puzzle)
    if (!selectedCubeType) {
        const cubeType = Object.keys(cubesDefinition)[1]
        if (!cubeType) {
            throw new Error("Not exists cube definition")
        }
        await db.add({
            id: ConfigKeys.Puzzle,
            value: cubeType
        })
        return loadSelectedCubeType()
    } else {
        const cubeDefinition = cubesDefinition[selectedCubeType.value]
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