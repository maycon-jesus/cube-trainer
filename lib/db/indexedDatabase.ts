import { uuidv7 } from "../uuid/v7"
import { JournalingLogger } from "./journaling"

export interface IndexDefinition {
    name: string
    keyPath: string | string[]
    options?: IDBIndexParameters
}

export interface DatabaseOptions {
    version?: number
    indexes?: IndexDefinition[]
    upgradeTransactions?: Record<number, (store: IDBObjectStore) => void>
}

export type StoredItemPreset<T> = T & { id: string }

export type TypedCursor<T> = Omit<IDBCursorWithValue, 'value'> & { readonly value: T }
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export class IndexedDatabase<StoredItem extends StoredItemPreset<object>, KeyType extends IDBValidKey = string> {
    private dbPromise: Promise<IDBDatabase> | null = null
    private version: number
    private indexes: IndexDefinition[]
    private upgradeTransactions: Record<number, (store: IDBObjectStore) => void>
    private journalingLogger?: JournalingLogger

    constructor(private name: string, options: DatabaseOptions) {
        this.version = options.version ?? 1
        this.indexes = options.indexes ?? []
        this.upgradeTransactions = options.upgradeTransactions ?? []
    }

    static get supported(): boolean {
        return typeof indexedDB !== 'undefined'
    }

    private open(): Promise<IDBDatabase> {
        if (this.dbPromise) return this.dbPromise

        this.dbPromise = new Promise((resolve, reject) => {
            if (!IndexedDatabase.supported) {
                reject(new Error('IndexedDB is not available in this environment'))
                return
            }

            const req = indexedDB.open(this.name, this.version)
            req.onupgradeneeded = async (ev) => {
                const db = req.result
                const store = db.objectStoreNames.contains(this.name)
                    ? req.transaction!.objectStore(this.name)
                    : db.createObjectStore(this.name, {
                        autoIncrement: false,
                        keyPath: "id"
                    })

                const wanted = new Set(this.indexes.map((index) => index.name))
                for (const name of Array.from(store.indexNames)) {
                    if (!wanted.has(name)) store.deleteIndex(name)
                }

                for (const index of this.indexes) {
                    if (store.indexNames.contains(index.name)) store.deleteIndex(index.name)
                    store.createIndex(index.name, index.keyPath, index.options)
                }

                if (!ev.newVersion) return
                for (let i = ev.oldVersion + 1; i <= ev.newVersion; i++) {
                    if (!this.upgradeTransactions[i]) continue
                    this.upgradeTransactions[i](store)
                }
            }
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
        })

        return this.dbPromise
    }

    protected async tx<R>(
        mode: IDBTransactionMode,
        fn: (store: IDBObjectStore) => Promise<R>,
    ): Promise<R> {
        const db = await this.open()
        const transaction = db.transaction(this.name, mode)
        const done = new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onabort = () => reject(transaction.error ?? new Error('Transaction aborted'))
        })
        done.catch(() => { })

        try {
            const result = await fn(transaction.objectStore(this.name))
            await done
            return result
        } catch (err) {
            try { transaction.abort() } catch { }
            throw err
        }
    }

    protected waitDbRequest<R>(req: IDBRequest<R>): Promise<R> {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
        })
    }

    protected iterateDbRequest(
        req: IDBRequest<IDBCursorWithValue | null>,
        onSuccess: (cursor: TypedCursor<StoredItem> | null) => boolean,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => {
                try {
                    if (onSuccess(req.result as TypedCursor<StoredItem> | null)) resolve()
                } catch (err) {
                    reject(err)
                }
            }
            req.onerror = () => reject(req.error)
        })
    }

    public async count(query?: IDBValidKey | IDBKeyRange | undefined): Promise<number> {
        return this.tx('readonly', async (store) => {
            return await this.waitDbRequest(store.count(query))
        })
    }

    public async countByIndex(indexName: string, query?: IDBValidKey | IDBKeyRange | undefined): Promise<number> {
        return this.tx('readonly', async (store) => {
            return await this.waitDbRequest(store.index(indexName).count(query))
        })
    }

    public async get(id: IDBValidKey | IDBKeyRange): Promise<StoredItem | undefined> {
        return this.tx("readonly", async (store) => {
            return await this.waitDbRequest(store.get(id))
        })
    }

    public async getAll(queryOrOptions?: IDBValidKey | IDBKeyRange | null | undefined, count?: number): Promise<StoredItem[]> {
        return this.tx('readonly', (s) => this.waitDbRequest(s.getAll(queryOrOptions, count)))
    }

    public async getAllByIndex(indexName: string, queryOrOptions?: IDBValidKey | IDBKeyRange | null | undefined, count?: number): Promise<StoredItem[]> {
        return this.tx('readonly', (s) => this.waitDbRequest(s.index(indexName).getAll(queryOrOptions, count)))
    }

    public async getEntries(query: IDBValidKey | IDBKeyRange | null | undefined, direction: IDBCursorDirection = 'next', size: number = -1, filter?: (val: StoredItem) => boolean): Promise<StoredItem[]> {
        return this.tx("readonly", async (store) => {
            const cursorReq = store.openCursor(query, direction)
            const results: StoredItem[] = []
            await this.iterateDbRequest(cursorReq, (result) => {
                if (!result) {
                    return true
                }

                if (!filter || filter(result.value)) {
                    results.push(result.value)
                }

                if (size >= 0 && results.length >= size) {
                    return true
                }

                result.continue()
                return false
            })
            return results
        })
    }

    public async getEntriesByIndex(indexName: string, query: IDBValidKey | IDBKeyRange | null | undefined, direction: IDBCursorDirection = 'next', size: number = -1, filter?: (val: StoredItem) => boolean): Promise<StoredItem[]> {
        return this.tx("readonly", async (store) => {
            const cursorReq = store.index(indexName).openCursor(query, direction)
            const results: StoredItem[] = []
            await this.iterateDbRequest(cursorReq, (result) => {
                if (!result) {
                    return true
                }

                if (!filter || filter(result.value)) {
                    results.push(result.value)
                }

                if (size >= 0 && results.length >= size) {
                    return true
                }

                result.continue()
                return false
            })
            return results
        })
    }

    private withId(value: PartialBy<StoredItem, "id">): StoredItem {
        if (value.id) return value as StoredItem
        return { ...value, id: uuidv7() } as StoredItem
    }

    public async add(value: PartialBy<StoredItem, "id">): Promise<KeyType> {
        const valueWithId = this.withId(value)
        const key = await this.tx('readwrite', async (s) => await this.waitDbRequest(s.add(valueWithId)))
        await this.journalingLogger?.log('add', key)
        return key as KeyType
    }

    public async bulkAdd(values: PartialBy<StoredItem, "id">[]): Promise<KeyType[]> {
        const keys = await this.tx("readwrite", async (store) => {
            const ids = await Promise.all(values.map(v => this.waitDbRequest(store.add(this.withId(v)))))
            return ids as KeyType[]
        })
        await this.journalingLogger?.bulkLogSameType("add", keys)
        return keys
    }

    public async put(value: StoredItem): Promise<KeyType> {
        const key = await this.tx('readwrite', async (s) => await this.waitDbRequest(s.put(value)))
        await this.journalingLogger?.log('update', key)
        return key as KeyType
    }

    public async bulkPut(values: StoredItem[]): Promise<KeyType[]> {
        const keys = await this.tx("readwrite", async (store) => {
            const ids = await Promise.all(values.map(v => this.waitDbRequest(store.put(v))))
            return ids as KeyType[]
        })
        await this.journalingLogger?.bulkLogSameType("add", keys)
        return keys
    }

    public async delete(id: IDBValidKey | IDBKeyRange): Promise<void> {
        await this.tx('readwrite', async (s) => await this.waitDbRequest(s.delete(id)))
        await this.journalingLogger?.log('delete', id)
    }

    public async bulkDelete(ids: KeyType[]): Promise<void> {
        await this.tx("readwrite", async (store) => {
            for (const id of ids) {
                store.delete(id)
            }
        })
    }

    public async clear(): Promise<void> {
        await this.tx('readwrite', (s) => this.waitDbRequest(s.clear()))
    }

    public async close(): Promise<void> {
        if (!this.dbPromise) return
        const db = await this.dbPromise
        db.close()
        this.dbPromise = null
    }

    async deleteDB(): Promise<void> {
        if (!IndexedDatabase.supported) {
            throw new Error('IndexedDB is not available in this environment')
        }
        await this.close()
        await this.waitDbRequest(indexedDB.deleteDatabase(this.name))
        return
    }

    // export

    async exportEach(onBatch: (rows: StoredItem[]) => Promise<void>, batchSize = 1000): Promise<void> {
        let after: IDBValidKey | null = null
        for (; ;) {
            const range = after != null ? IDBKeyRange.lowerBound(after, true) : null
            const page = await this.getEntries(range, 'next', batchSize)
            if (page.length === 0) break
            await onBatch(page)
            if (page.length < batchSize) break
            after = page[page.length - 1].id!
        }
    }

    async importBatch(rows: StoredItem[]): Promise<void> {
        await this.bulkAdd(rows)
    }
}