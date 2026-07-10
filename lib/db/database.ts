export interface IndexDefinition {
    name: string
    keyPath: string | string[]
    options?: IDBIndexParameters
}

export interface DatabaseOptions {
    version?: number
    keyPath?: string
    autoIncrement?: boolean
    indexes?: IndexDefinition[]
}

export type IndexQuery = IDBValidKey | IDBKeyRange | undefined | null

export type Stored<T> = T & { id?: number }

export class Database<T extends Record<string, unknown>> {
    private readonly name: string
    private readonly store: string
    private readonly version: number
    private readonly keyPath: string
    private readonly autoIncrement: boolean
    private readonly indexes: IndexDefinition[]
    private dbPromise: Promise<IDBDatabase> | null = null

    constructor(name: string, store: string, options: DatabaseOptions = {}) {
        this.name = name
        this.store = store
        this.version = options.version ?? 1
        this.keyPath = options.keyPath ?? 'id'
        this.autoIncrement = options.autoIncrement ?? true
        this.indexes = options.indexes ?? []
    }

    static get supported(): boolean {
        return typeof indexedDB !== 'undefined'
    }

    private open(): Promise<IDBDatabase> {
        if (this.dbPromise) return this.dbPromise

        this.dbPromise = new Promise((resolve, reject) => {
            if (!Database.supported) {
                reject(new Error('IndexedDB is not available in this environment'))
                return
            }

            const req = indexedDB.open(this.name, this.version)
            req.onupgradeneeded = () => {
                const db = req.result
                const store = db.objectStoreNames.contains(this.store)
                    ? req.transaction!.objectStore(this.store)
                    : db.createObjectStore(this.store, {
                        keyPath: this.keyPath,
                        autoIncrement: this.autoIncrement,
                    })

                for (const index of this.indexes) {
                    if (!store.indexNames.contains(index.name)) {
                        store.createIndex(index.name, index.keyPath, index.options)
                    }
                }
            }
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
        })

        return this.dbPromise
    }

    private async tx<R>(
        mode: IDBTransactionMode,
        fn: (store: IDBObjectStore) => IDBRequest<R>,
    ): Promise<R> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, mode)
            const request = fn(transaction.objectStore(this.store))
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    /** Read every record in the store. */
    getAll(): Promise<T[]> {
        return this.tx('readonly', (s) => s.getAll() as IDBRequest<T[]>)
    }

    async getEntries(indexQuery:IndexQuery, offset: number, size: number, direction: IDBCursorDirection, filter?: (val: T) => boolean): Promise<T[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readonly')
            const store = transaction.objectStore(this.store)
            const results: T[] = []
            const cursorReq = store.openCursor(indexQuery, direction)
            let offsetCount = offset
            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result
                
                if (cursor && results.length < size) {
                    if (offsetCount > 0) {
                        cursor.advance(offsetCount)
                        offsetCount=0
                    }else if (!filter || filter(cursor.value)) {
                        results.push(cursor.value)
                        cursor.continue()
                    }
                } else {
                    resolve(results)
                }
            }
            cursorReq.onerror = () => reject(cursorReq.error)
        })
    }

    async getEntriesByIndex(indexName: string, indexQuery:IndexQuery, offset: number, size: number, direction: IDBCursorDirection, filter?: (val: T) => boolean): Promise<T[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readonly')
            const store = transaction.objectStore(this.store)
            const index = store.index(indexName)
            const results: T[] = []
            const cursorReq = index.openCursor(indexQuery, direction)
            let offsetCount = 0

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result
                if (cursor && results.length < size) {
                    if (!filter || filter(cursor.value)) {
                        if (offsetCount < offset) {
                            offsetCount++
                        } else {
                            results.push(cursor.value)
                        }
                    }
                    cursor.continue()
                } else {
                    resolve(results)
                }
            }
            cursorReq.onerror = () => reject(cursorReq.error)
        })
    }

    /** Read a single record by its primary key, or undefined if absent. */
    get(id: IDBValidKey | IDBKeyRange): Promise<T | undefined> {
        return this.tx('readonly', (s) => s.get(id) as IDBRequest<T | undefined>)
    }

    getAllByIndex(indexName: string, value: IDBValidKey | IDBKeyRange): Promise<T[]> {
        return this.tx(
            'readonly',
            (s) => s.index(indexName).getAll(value) as IDBRequest<T[]>,
        )
    }

    /** Count the records in the store. */
    count(): Promise<number> {
        return this.tx('readonly', (s) => s.count())
    }

    async countEntries(indexQuery: IndexQuery, filter?: (val: T) => boolean): Promise<number> {
        if (!filter) return this.tx('readonly', (s) => s.count(indexQuery ?? undefined))
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readonly')
            const store = transaction.objectStore(this.store)
            const cursorReq = store.openCursor(indexQuery)
            let count = 0

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result
                if (cursor) {
                    if (filter(cursor.value)) count++
                    cursor.continue()
                } else {
                    resolve(count)
                }
            }
            cursorReq.onerror = () => reject(cursorReq.error)
        })
    }

    countByIndex(indexName: string, value: NonNullable<IndexQuery>): Promise<number> {
        return this.tx('readonly', (s) => s.index(indexName).count(value))
    }

    /** Insert a new record and resolve its generated id. */
    async add(value: T): Promise<T["id"]> {
        const key = await this.tx('readwrite', (s) => s.add(value))
        return key as T["id"]
    }

    /** Insert many new records in a single transaction, resolving their generated ids in order. */
    async bulkAdd(values: T[]): Promise<T["id"][]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readwrite')
            const store = transaction.objectStore(this.store)
            const ids: T["id"][] = []
            for (const value of values) {
                const req = store.add(value)
                req.onsuccess = () => ids.push(req.result as T["id"])
            }
            transaction.oncomplete = () => resolve(ids)
            transaction.onerror = () => reject(transaction.error)
        })
    }

    /** Insert or replace a record (requires the primary key to be present). */
    async put(value: T): Promise<number> {
        const key = await this.tx('readwrite', (s) => s.put(value))
        return key as number
    }

    async bulkPut(values: T[]): Promise<T["id"][]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readwrite')
            const store = transaction.objectStore(this.store)
            const ids: T["id"][] = []
            for (const value of values) {
                const req = store.put(value)
                req.onsuccess = () => ids.push(req.result as T["id"])
            }
            transaction.oncomplete = () => resolve(ids)
            transaction.onerror = () => reject(transaction.error)
        })
    }

    /** Delete a single record by its primary key. */
    async delete(id: IDBValidKey | IDBKeyRange): Promise<void> {
        await this.tx('readwrite', (s) => s.delete(id))
    }

    async bulkDelete(ids: number[]): Promise<void> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readwrite')
            const store = transaction.objectStore(this.store)
            for (const id of ids) {
                store.delete(id)
            }
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
        })
    }

    /** Remove every record from the store. */
    async clear(): Promise<void> {
        await this.tx('readwrite', (s) => s.clear())
    }

    async deleteDB(): Promise<void> {
        if (!Database.supported) {
            throw new Error('IndexedDB is not available in this environment')
        }
        await this.close()
        indexedDB.deleteDatabase(this.name)
        return
    }

    // export & import
    async exportEach(onBatch: (rows: T[]) => Promise<void>, batchSize = 1000): Promise<void> {
        let after: IDBValidKey | null = null
        for (;;) {
            const range = after != null ? IDBKeyRange.lowerBound(after, true) : null
            const page = await this.getEntries(range, 0, batchSize, 'next')
            if (page.length === 0) break
            await onBatch(page)
            if (page.length < batchSize) break
            after = (page[page.length - 1] as Record<string, IDBValidKey>)[this.keyPath]!
        }
    }
    
    /** Append one batch of records during a streamed import. */
    async importBatch(rows: T[]): Promise<void> {
        await this.bulkAdd(rows)
    }

    /** Close the underlying connection. The next call reopens it. */
    async close(): Promise<void> {
        if (!this.dbPromise) return
        const db = await this.dbPromise
        db.close()
        this.dbPromise = null
    }
}
