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

    /**
     * Read up to `size` records by walking a cursor in key order.
     *
     * @param size Maximum number of records to return; the cursor stops once this many are collected.
     * @param direction Cursor traversal direction: `next`/`prev` for ascending/descending key order,
     *   `nextunique`/`prevunique` to visit only the first record of each key value.
     * @param filter Optional predicate; only records for which it returns true are kept
     *   (filtered-out records still count toward the walk but not toward `size`).
     * @returns The collected records, in traversal order.
     */
    async getEntries(indexQuery:IndexQuery, size: number, direction: IDBCursorDirection, filter?: (val: T) => boolean): Promise<T[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readonly')
            const store = transaction.objectStore(this.store)
            const results: T[] = []
            const cursorReq = store.openCursor(indexQuery, direction)

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result
                if (cursor && results.length < size) {
                    if (!filter || filter(cursor.value)) {
                        results.push(cursor.value)
                    }
                    cursor.continue()
                } else {
                    resolve(results)
                }
            }
            cursorReq.onerror = () => reject(cursorReq.error)
        })
    }

    /**
     * Read up to `size` records by walking a cursor over an index, in that index's key order.
     *
     * @param indexName Name of the index to traverse; records are ordered by the index's keyPath.
     * @param size Maximum number of records to return; the cursor stops once this many are collected.
     * @param direction Cursor traversal direction: `next`/`prev` for ascending/descending key order,
     *   `nextunique`/`prevunique` to visit only the first record of each index key value.
     * @param filter Optional predicate; only records for which it returns true are kept
     *   (filtered-out records still count toward the walk but not toward `size`).
     * @returns The collected records, in traversal order.
     */
    async getEntriesByIndex(indexName: string, indexQuery:IndexQuery ,size: number, direction: IDBCursorDirection, filter?: (val: T) => boolean): Promise<T[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.store, 'readonly')
            const store = transaction.objectStore(this.store)
            const index = store.index(indexName)
            const results: T[] = []
            const cursorReq = index.openCursor(indexQuery, direction)

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result
                if (cursor && results.length < size) {
                    if (!filter || filter(cursor.value)) {
                        results.push(cursor.value)
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

    countByIndex(indexName: string, value: NonNullable<IndexQuery>): Promise<number> {
        return this.tx('readonly', (s) => s.index(indexName).count(value))
    }

    /** Insert a new record and resolve its generated id. */
    async add(value: T): Promise<number> {
        const key = await this.tx('readwrite', (s) => s.add(value))
        return key as number
    }

    /** Insert or replace a record (requires the primary key to be present). */
    async put(value: T): Promise<number> {
        const key = await this.tx('readwrite', (s) => s.put(value))
        return key as number
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

    /** Close the underlying connection. The next call reopens it. */
    async close(): Promise<void> {
        if (!this.dbPromise) return
        const db = await this.dbPromise
        db.close()
        this.dbPromise = null
    }
}
