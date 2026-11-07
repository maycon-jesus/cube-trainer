import type { IdReference } from "./id";
import { Thing } from "./thing";
import type { Text, URL } from "./types";

export class CreativeWork extends Thing {
    protected type: string = "CreativeWork"

    inLanguage(lang: Text): this {
        this.setData("inLanguage", lang)
        return this
    }

    mainEntity(entity: Thing): this {
        this.setData("mainEntity", entity)
        return this
    }

    isPartOf(part: CreativeWork | URL | IdReference): this {
        this.setData("isPartOf", part)
        return this
    }
}