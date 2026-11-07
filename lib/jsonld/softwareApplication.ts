import { CreativeWork } from "./creativeWork";
import type { IdReference } from "./id";
import type { Offer } from "./offer";
import type { Person } from "./person";
import type { Text } from "./types";

export class SoftwareApplication extends CreativeWork {
    protected type: string = "SoftwareApplication"

    applicationCategory(category: Text): this {
        this.setData("applicationCategory", category)
        return this
    }

    operatingSystem(name: Text): this {
        this.setData("operatingSystem", name)
        return this
    }

    softwareVersion(version: Text): this {
        this.setData("softwareVersion", version)
        return this
    }

    isAccessibleForFree(accessible: boolean): this {
        this.setData("isAccessibleForFree", accessible)
        return this
    }

    featureList(list: Text | Text[]): this {
        this.setData("featureList", list)
        return this
    }

    creator(creator: Person | IdReference): this {
        this.setData("creator", creator)
        return this
    }

    offers(offer: Offer): this {
        this.setData("offers", offer)
        return this
    }
}