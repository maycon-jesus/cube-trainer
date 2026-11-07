import { Thing } from "./thing";
import type { JsonLdData } from "./types";

export class Person extends Thing {
    protected type: string = "Person";
    protected data: JsonLdData = {}
}
