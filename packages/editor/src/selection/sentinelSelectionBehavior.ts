import { Editor } from './../Editor';
import { DragState } from "utils";
import { getNodeFromChild } from "../utils";
import { Node } from 'editor-core';
import { SetSelectionResult } from "../behaviorTypes";

export function sentinelSelectionBehaviorFactory(editor: Editor) {
    return (node: Node)=>{
        const e = editor.whenClick;
        const ans: SetSelectionResult = {
            pointType: 'end',
            offset: 0
        };
    
        if (e.pressed && !e.registered) {
            ans.pointType = 'start'
        }
        return ans;
    }
}