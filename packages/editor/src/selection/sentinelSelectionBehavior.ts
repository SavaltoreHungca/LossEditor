import { DragState } from "utils";
import { SetSelectionResult } from "editor-core";
import { getNodeFromChild } from "../utils";
import { Node } from 'editor-core';

export function sentinelSelectionBehavior(node: Node, e: DragState) {
    const ans: SetSelectionResult = {
        pointType: 'end',
        offset: 0
    };
    const srcElement = <HTMLElement>getNodeFromChild(<HTMLElement>e.event?.target);

    if (e.pressed && !e.registered) {
        ans.pointType = 'start'
    }
    return ans;
}