import { JsonLdBase } from "./base"
import type { IdReference } from "./id"
import type { Person } from "./person"
import type { Text, URL } from "./types"

export class Thing extends JsonLdBase {
    protected type: string = "Thing"

    id(id: Text): this {
        this.setData("@id", id)
        return this
    }

    name(name?: Text): this {
        this.setData("name", name)
        return this
    }

    image(image?: URL): this {
        this.setData("image", image)
        return this
    }

    url(url?: URL): this {
        this.setData("url", url)
        return this
    }

    owner(owner?: Person | IdReference): this {
        this.setData("owner", owner)
        return this
    }

    description(description?: string): this {
        this.setData("description", description)
        return this
    }
}
