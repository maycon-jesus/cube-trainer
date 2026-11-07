import { Thing } from "./thing";
import type { JsonLdData, JsonLdTree } from "./types";

export function dataToJson(data: JsonLdData): JsonLdTree {
    const nObj: JsonLdTree = {}
    for (const key in data) {
        if (data[key] === undefined) {
            continue
        }
        if (Array.isArray(data[key])) {
            for (const el of data[key]) {
                if (el instanceof Thing) {
                    nObj[key] = el.toJson()
                    continue
                }
                nObj[key] = el
            }
            continue
        }
        if (data[key] instanceof Thing) {
            nObj[key] = data[key].toJson()
            continue
        }
        nObj[key] = data[key]
    }

    return nObj
}

export function mergeJsonLdTree(tree1: JsonLdTree, tree2: JsonLdTree): JsonLdTree {
    const merged = Object.assign({}, tree1, tree2)
    return merged
}