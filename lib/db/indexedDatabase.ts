import { uuidv7 } from "../uuid/v7"

export interface IndexDefinition {
    name: string
    keyPath: string | string[]
    options?: IDBIndexParameters
}

export interface DatabaseOptions {
    version?: number
    indexes?: IndexDefinition[]
    upgradeTransactions?: Record<number, (store: IDBObjectStore) => void>
    journaling?: boolean
}

export type StoredItemPreset<T> = T & { id: string }

export type TypedCursor<T> = Omit<IDBCursorWithValue, 'value'> & { readonly value: T }
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type JournalEntryType = 'add' | 'update' | 'delete'

export type JournalEntry<KeyType extends IDBValidKey = string> = {
    id: string
    type: JournalEntryType
    targetId: KeyType
    createdAt: number
}

type JournalWriter<KeyType extends IDBValidKey> = (type: JournalEntryType, targetIds: KeyType[]) => void

export const JOURNAL_STORE = '__journal'

export class IndexedDatabase<StoredItem extends StoredItemPreset<object>, KeyType extends IDBValidKey = string> {
    private dbPromise: Promise<IDBDatabase> | null = null
    private version: number
    private indexes: IndexDefinition[]
    private upgradeTransactions: Record<number, (store: IDBObjectStore) => void>
    private journaling: boolean

    constructor(private name: string, options: DatabaseOptions) {
        this.version = options.version ?? 1
        this.indexes = options.indexes ?? []
        this.upgradeTransactions = options.upgradeTransactions ?? {}
        this.journaling = options.journaling ?? true
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
            req.onupgradeneeded = (ev) => {
                const db = req.result
                const store = db.objectStoreNames.contains(this.name)
                    ? req.transaction!.objectStore(this.name)
                    : db.createObjectStore(this.name, {
                        autoIncrement: false,
                        keyPath: "id"
                    })

                if (!db.objectStoreNames.contains(JOURNAL_STORE)) {
                    const journal = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id' })
                    journal.createIndex('targetId', 'targetId', { unique: false })
                }

                const wanted = new Set(this.indexes.map((index) => index.name))
                for (const name of Array.from(store.indexNames)) {
                    if (!wanted.has(name)) store.deleteIndex(name)
                }

                for (const index of this.indexes) {
                    if (store.indexNames.contains(index.name)) store.deleteIndex(index.name)
                    store.createIndex(index.name, index.keyPath, index.options)
                }

                for (let i = ev.oldVersion + 1; i <= this.version; i++) {
                    this.upgradeTransactions[i]?.(store)
                }
            }
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
        })

        return this.dbPromise
    }

    /**
     * Runs `fn` in a single transaction. For `readwrite`, `log` writes journal entries
     * into the same transaction, so data and journal commit (or abort) together.
     */
    protected async tx<R>(
        mode: IDBTransactionMode,
        fn: (store: IDBObjectStore, log: JournalWriter<KeyType>) => Promise<R>,
    ): Promise<R> {
        const withJournal = mode === 'readwrite' && this.journaling
        const stores = withJournal ? [this.name, JOURNAL_STORE] : [this.name]

        return this.runTransaction(stores, mode, (transaction) => {
            const log: JournalWriter<KeyType> = (type, targetIds) => {
                if (!withJournal) return
                const journal = transaction.objectStore(JOURNAL_STORE)
                const createdAt = Date.now()
                for (const targetId of targetIds) {
                    const entry: JournalEntry<KeyType> = { id: uuidv7(), type, targetId, createdAt }
                    journal.add(entry)
                }
            }
            return fn(transaction.objectStore(this.name), log)
        })
    }

    /** Opens a transaction over `stores`, runs `fn` and resolves only after the commit. */
    private async runTransaction<R>(
        stores: string[],
        mode: IDBTransactionMode,
        fn: (transaction: IDBTransaction) => Promise<R>,
    ): Promise<R> {
        const db = await this.open()
        const transaction = db.transaction(stores, mode)
        const done = new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onabort = () => reject(transaction.error ?? new Error('Transaction aborted'))
        })
        done.catch(() => { })

        try {
            const result = await fn(transaction)
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

    protected iterateDbRequest<C extends IDBCursor = TypedCursor<StoredItem>>(
        req: IDBRequest<IDBCursorWithValue | null> | IDBRequest<IDBCursor | null>,
        onSuccess: (cursor: C) => boolean,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => {
                try {
                    if (!req.result) return resolve()
                    if (onSuccess(req.result as C)) resolve()
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

    public async getAllKeys(queryOrOptions?: IDBValidKey | IDBKeyRange | null, count?: number): Promise<KeyType[]> {
        const keys = await this.tx('readonly', (s) => this.waitDbRequest(s.getAllKeys(queryOrOptions, count)))
        return keys as KeyType[]
    }

    public async getEntries(query: IDBValidKey | IDBKeyRange | null | undefined, direction: IDBCursorDirection = 'next', size: number = -1, filter?: (val: StoredItem) => boolean): Promise<StoredItem[]> {
        return this.tx("readonly", async (store) => {
            const cursorReq = store.openCursor(query, direction)
            const results: StoredItem[] = []
            await this.iterateDbRequest(cursorReq, (result) => {
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
        return this.tx('readwrite', async (s, log) => {
            const key = await this.waitDbRequest(s.add(valueWithId)) as KeyType
            log('add', [key])
            return key
        })
    }

    public async bulkAdd(values: PartialBy<StoredItem, "id">[]): Promise<KeyType[]> {
        return this.tx("readwrite", async (store, log) => {
            const keys = await Promise.all(values.map(v => this.waitDbRequest(store.add(this.withId(v))))) as KeyType[]
            log('add', keys)
            return keys
        })
    }

    /** Upsert: journals `add` when the key did not exist, `update` otherwise. */
    public async put(value: StoredItem): Promise<KeyType> {
        const [key] = await this.bulkPut([value])
        return key!
    }

    public async bulkPut(values: StoredItem[]): Promise<KeyType[]> {
        return this.tx("readwrite", async (store, log) => {
            const existing = await Promise.all(values.map(v => this.waitDbRequest(store.getKey(v.id))))
            const keys = await Promise.all(values.map(v => this.waitDbRequest(store.put(v)))) as KeyType[]
            log('add', keys.filter((_, i) => existing[i] === undefined))
            log('update', keys.filter((_, i) => existing[i] !== undefined))
            return keys
        })
    }

    public async delete(id: IDBValidKey | IDBKeyRange): Promise<void> {
        await this.tx('readwrite', async (s, log) => {
            const ids = await this.waitDbRequest(s.getAllKeys(id)) as KeyType[]
            await this.waitDbRequest(s.delete(id))
            log('delete', ids)
        })
    }

    public async deleteByIndex(indexName: string, query: IDBValidKey | IDBKeyRange): Promise<void> {
        await this.tx("readwrite", async (s, log) => {
            const ids: KeyType[] = []
            const req = s.index(indexName).openKeyCursor(query)
            await this.iterateDbRequest<IDBCursor>(req, (result) => {
                s.delete(result.primaryKey)
                ids.push(result.primaryKey as KeyType)
                result.continue()
                return false
            })
            log('delete', ids)
        })
    }

    public async bulkDelete(ids: KeyType[]): Promise<void> {
        await this.tx("readwrite", async (store, log) => {
            for (const id of ids) {
                store.delete(id)
            }
            log('delete', ids)
        })
    }

    /**
     * Removes every item, journaling one `delete` per id (never a "clear" entry):
     * when syncing, other devices must delete only the items that existed here,
     * not wipe their own local data.
     */
    public async clear(): Promise<void> {
        await this.tx('readwrite', async (s, log) => {
            const ids = await this.waitDbRequest(s.getAllKeys()) as KeyType[]
            await this.waitDbRequest(s.clear())
            log('delete', ids)
        })
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

    // journal

    public async getJournal(afterId?: string, limit?: number): Promise<JournalEntry<KeyType>[]> {
        const range = afterId ? IDBKeyRange.lowerBound(afterId, true) : null
        return this.runTransaction([JOURNAL_STORE], 'readonly', (t) =>
            this.waitDbRequest(t.objectStore(JOURNAL_STORE).getAll(range, limit)))
    }

    public async clearJournal(upToId?: string): Promise<void> {
        await this.runTransaction([JOURNAL_STORE], 'readwrite', (t) => {
            const store = t.objectStore(JOURNAL_STORE)
            return this.waitDbRequest(upToId ? store.delete(IDBKeyRange.upperBound(upToId)) : store.clear())
        })
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

    /** Restores a backup. Bypasses the journal: restored rows are not new local changes. */
    async importBatch(rows: StoredItem[]): Promise<void> {
        await this.runTransaction([this.name], 'readwrite', async (t) => {
            const store = t.objectStore(this.name)
            await Promise.all(rows.map(v => this.waitDbRequest(store.put(v))))
        })
    }
}
