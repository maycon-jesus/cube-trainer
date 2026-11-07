import { Intangible } from "./intangible";
import type { ListItem } from "./listItem";
import type { Thing } from "./thing";
import type { Text } from "./types";

export class ItemList extends Intangible {
    protected type: string = "ItemList"

    itemListElement(el: ListItem | Text | Thing | ListItem[] | Text[] | Thing[]): this {
        this.setData("itemListElement", el)
        return this
    }

    numberOfItems(n: number): this {
        this.setData("numberOfItems", n)
        return this
    }
}