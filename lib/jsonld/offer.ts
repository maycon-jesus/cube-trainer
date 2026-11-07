import { Intangible } from "./intangible";
import type { Text } from "./types";

export class Offer extends Intangible {
    protected type: string = "Offer"

    price(price: Text): this {
        this.setData("price", price)
        return this
    }

    priceCurrency(currency: Text): this {
        this.setData("priceCurrency", currency)
        return this
    }
}