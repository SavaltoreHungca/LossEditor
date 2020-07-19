import { DragState, Utils } from "utils";
import { getType, getDocNodeFromChild } from "../utils";
import { Editor } from "../Editor";

export function listenUserChangeSelection(editor: Editor) {
    Utils.addEventListener('drag', editor.viewLines, (e: DragState) => {
        if (!e.event?.target) return;

        const srcElement = <HTMLElement>e.event.target;
        const node = getDocNodeFromChild(srcElement);
        if(node){
            editor.docTree.setSelection(editor.uiMap.getkey(node), e);
        }
    })
}