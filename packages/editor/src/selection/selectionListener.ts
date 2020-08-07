import { DragState, $$, ct } from "utils";
import { getType, getDocNodeFromChild } from "../utils";
import { Editor } from "../Editor";

export function listenUserChangeSelection(editor: Editor) {
    $$.addDragEvent(editor.viewLines, (e: DragState) => {
        if (!e.event?.target) return;

        const srcElement: HTMLElement = ct(e.event.target);
        const node = getDocNodeFromChild(srcElement);
        if(node){
            editor.docTree.setSelection(editor.uiMap.getNode(node), e);
        }
    })
}