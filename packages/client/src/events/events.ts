import { MemLoss } from "../MemLoss";
import { initializeRightPadContent } from "./initializeRightPadContent";
import { initializeLeftPadContent } from './initializeLeftPadContent';

export function registryEvents(memLoss: MemLoss) {
    initializeLeftPadContent(memLoss);
    initializeRightPadContent(memLoss);
}


