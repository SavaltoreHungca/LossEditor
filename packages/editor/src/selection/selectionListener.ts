import { DragState, $$, ct } from "utils";
import { getType, getDocNodeFromChild } from "../utils";
import { Editor } from "../Editor";
import { Point } from "editor-core";

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

export function listenSelectionToSetCursor(editor: Editor) {
    editor.docTree.addEventListener('selection_change', selection => {
        const point: Point = ct(selection.end);
        const behavior = editor.setCursorPositionBehaviorSet.get(point.node.type);
        if (!behavior) return;
        const result = behavior(editor.uiMap.getElement(point.node), point.offset, editor);
        if (result) {
            editor.cursor.setPosition(result.left, result.top, result.height)
        }
        editor.cursor.focus({ preventScroll: true });
    })
}