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

export class IndexedDatabaseCore {

}