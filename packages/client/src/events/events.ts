import { MemLoss } from "../MemLoss";
import { initializeData } from "./initializeData";
import { initializeRightPadContent } from "./initializeRightPadContent";

export function registryEvents(memLoss: MemLoss) {
    initializeData(memLoss);
    initializeRightPadContent(memLoss);
}


