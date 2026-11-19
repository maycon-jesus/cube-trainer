import { mergeLanguages } from "~~/lib/translator/helpers";
import oll from "./oll";
import ortegaPbl from "./ortega-pbl";

export default mergeLanguages(oll, ortegaPbl)
