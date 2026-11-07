import { SoftwareApplication } from "./softwareApplication";
import type { Text } from "./types";

export class WebApplication extends SoftwareApplication {
    protected type: string = "WebApplication"

    browserRequirements(requirements: Text): this {
        this.setData("browserRequirements", requirements)
        return this
    }
}