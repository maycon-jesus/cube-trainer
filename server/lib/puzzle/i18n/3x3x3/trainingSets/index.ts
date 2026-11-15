import { mergeLanguages } from "~~/lib/translator/helpers";
import f2l from "./f2l";
import oll from "./oll";
import pll from "./pll";

export default mergeLanguages(f2l, oll, pll)