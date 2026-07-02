import { Database } from "~~/lib/db/database"
import { useSessionsStore } from "./sessions"
import { cubesDefinition } from "~~/lib/cube/cubesDefinition"
import type { ThemeInstance } from "vuetify"

export type Config = {
    id?: string,
    value: any
}

const db = new Database<Config>('config', 'config', {
    autoIncrement: false,
})

export const useConfigStore = defineStore('config', () => {
    const theme = useTheme()

    const selectedSessionId = ref(0)
    const selectedCubeType = ref('')
    const selectedTheme = ref('')
    const ready = ref(false)

    async function load() {
        selectedSessionId.value = await loadSelectedSessionId()
        selectedCubeType.value = await loadSelectedCubeType()
        selectedTheme.value = await loadSelectedTheme(theme)
        ready.value = true
    }

    async function reset() {
        ready.value = false
        selectedSessionId.value = 0
        selectedCubeType.value = ''
        selectedTheme.value = ''
        await db.deleteDB()
    }

    async function saveAll() {
        await db.put({
            id: 'selectedTheme',
            value: selectedTheme.value
        })
    }

    return { saveAll, load, selectedSessionId, selectedCubeType, selectedTheme, ready, reset }
})

async function loadSelectedSessionId(): Promise<number> {
    const sessionId = await db.get('selectedSessionId')
    if (!sessionId) {
        const lastSession = await useSessionsStore().getLastSession()
        if (lastSession) {
            await db.add({
                id: 'selectedSessionId',
                value: lastSession.id?.toString()
            })
        }
        return loadSelectedSessionId()
    } else {
        const sessionIdParsed = parseInt(sessionId.value)

        const exists = await useSessionsStore().getSession(sessionIdParsed)
        if (!exists) {
            await db.delete('selectedSessionId')
            return loadSelectedSessionId()
        } else {
            return sessionIdParsed
        }
    }
}

async function loadSelectedCubeType() {
    const selectedCubeType = await db.get('selectedCubeType')
    if (!selectedCubeType) {
        const cubeType = Object.keys(cubesDefinition)[0]
        if (!cubeType) {
            throw new Error("Not exists cube definition")
        }
        await db.add({
            id: 'selectedCubeType',
            value: cubeType
        })
        return loadSelectedCubeType()
    } else {
        const cubeDefinition = cubesDefinition[selectedCubeType.value]
        if (!cubeDefinition) {
            await db.delete('selectedCubeType')
            return loadSelectedCubeType()
        } else {
            return cubeDefinition.id
        }
    }
}

async function loadSelectedTheme(themeInstance: ThemeInstance) {
    const selectedTheme = await db.get('selectedTheme')
    if (!selectedTheme) {
        await db.add({
            id: 'selectedTheme',
            value: themeInstance.name.value
        })
        return loadSelectedTheme(themeInstance)
    } else {
        return selectedTheme.value
    }
}