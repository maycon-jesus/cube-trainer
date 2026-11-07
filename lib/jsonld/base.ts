import type { JsonLdData, JsonLdTree, Text } from "./types";
import { dataToJson } from "./utils";

export abstract class JsonLdBase {
    protected abstract type: Text
    protected data: JsonLdData = {}

    protected setData<K extends keyof JsonLdData>(key: K, value?: JsonLdData[K]) {
        this.data[key] = value ?? undefined
    }

    protected internalToJson(): JsonLdTree {
        return dataToJson(this.data)
    }

    public toJson(): JsonLdTree {
        const obj: JsonLdTree = {
            "@type": this.type,
            ...this.internalToJson()
        }
        return obj
    }
    public toUseJson(): JsonLdTree {
        const obj: JsonLdTree = {
            "@context": "https://schema.org",
            ...this.toJson()
        }
        return obj
    }
    public toUseJsonString(): string {
        return JSON.stringify(this.toUseJson())
    }

    public toUseHead() {
        return {
            script: [
                {
                    type: 'application/ld+json' as const,
                    key: 'jsonld',
                    innerHTML: this.toUseJsonString(),
                }
            ],
        }
    }
}