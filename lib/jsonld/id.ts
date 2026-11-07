import { Thing } from "./thing";
import type { JsonLdTree } from "./types";

export class IdReference extends Thing {
    constructor(id: string) {
        super()
        this.id(id)
    }

    public toJson(): JsonLdTree {
        return this.internalToJson()
    }
}