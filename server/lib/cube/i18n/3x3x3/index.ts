import { mergeLanguages } from "~~/lib/translator/helpers";
import patterns from "./patterns";
import trainingSets from "./trainingSets";

export default mergeLanguages(patterns, trainingSets)