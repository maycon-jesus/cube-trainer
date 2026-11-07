import { Intangible } from "./intangible";
import type { Thing } from "./thing";
import type { Text } from "./types";

export class ListItem extends Intangible {
    protected type: string = "ListItem"

    item(item: Thing): this {
        this.setData("item", item)
        return this
    }

    position(position: Text | number): this {
        this.setData("position", position)
        return this
    }
}