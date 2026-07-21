import type { TrainingAlgorithm } from "../../training/types";
import { newAlgorithmSetup } from "./setup";

function newOllSetup(id:string, solve: string){
    return newAlgorithmSetup("oll", id, solve)
}

export const ollAlgorithms: TrainingAlgorithm[] = [
    newOllSetup("oll-1", "R U R' U R U2 R'"),
    newOllSetup("oll-2", "R U2 R' U' R U' R'"),
    newOllSetup("oll-3", "F R U R' U' F'"),
    newOllSetup("oll-4", "R U R' U' R' F R F'"),
    newOllSetup("oll-5", "R2 U2 R U2 R2"),
    newOllSetup("oll-6", "F R U R' U' R U R' U' F'"),
    newOllSetup("oll-7", "R U R U' L' U R' U' x'")
]