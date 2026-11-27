import { IndexedDatabase } from "./indexedDatabase";

type JournalingLog = {
    id: string,
    type: 'add' | 'delete' | 'update'
    databaseName: string,
    targetId: IDBValidKey
}

export class JournalingLogger {
    static db: IndexedDatabase<JournalingLog> = new IndexedDatabase("journaling", {})

    constructor(private databaseName: string) { }

    public async log(type: JournalingLog["type"], targetId: JournalingLog["targetId"]) {
        await JournalingLogger.db.add({
            databaseName: this.databaseName,
            type,
            targetId
        })
    }

    public async bulkLogSameType(type: JournalingLog["type"], targetIds: JournalingLog["targetId"][]) {
        await JournalingLogger.db.bulkAdd(targetIds.map(t => {
            return {
                databaseName: this.databaseName,
                type,
                targetId: t
            }
        }))
    }
}