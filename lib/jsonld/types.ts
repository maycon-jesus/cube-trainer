import type { Thing } from "./thing"

export type Text = string
export type URL = Text

export type Primitives = Text | URL | boolean | number
export interface JsonLdData {
    [key: string]: Thing | Primitives | undefined | Thing[] | Primitives[]
}
export interface JsonLdTree<T = Primitives> {
    [key: string]: JsonLdTree<T> | T | JsonLdTreeArr<T>
}

export type JsonLdTreeArr<T = Primitives> = (JsonLdTree<T> | Primitives)[]