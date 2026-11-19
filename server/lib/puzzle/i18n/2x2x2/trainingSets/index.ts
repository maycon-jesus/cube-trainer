import { mergeLanguages } from "~~/lib/translator/helpers";
import ortegaOll from "./ortega-oll";
import ortegaPbl from "./ortega-pbl";

export default mergeLanguages(ortegaOll, ortegaPbl)
