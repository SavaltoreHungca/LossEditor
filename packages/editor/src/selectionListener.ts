import { DragState, $$, ct } from "utils";
import { getType, getDocNodeFromChild } from "./utils";
import { Editor } from "./Editor";
import { Point, Selection } from "editor-core";

export function listenUserClick(editor: Editor) {
    $$.addDragEvent(editor.viewLines, (e: DragState) => {
        if (!e.event?.target) return;

        editor.whenClick = e;

        const srcElement: HTMLElement = ct(e.event.target);
        const docNode = getDocNodeFromChild(srcElement);
        if (docNode) {
            const node = editor.uiMap.getNode(docNode);
            const behavior = editor.behaviorSet.SetSelectionBehavior.get(node.type);
            if (behavior) {
                const rlt = behavior(node);
                if(!rlt) return;
                if(rlt.pointType === 'start'){
                    editor.tmpSelection = new Selection({
                        node: node,
                        offset: rlt.offset
                    });
                }
                else if(rlt.pointType === 'end' && editor.tmpSelection){
                    editor.tmpSelection.end = {
                        node: node,
                        offset: rlt.offset
                    }
                    editor.docTree.changeSelection(ct(editor.tmpSelection.start), editor.tmpSelection.end);
                }
            }
            else {
                throw new Error(`${node.type}的鼠标点击改变selection的行为未设置`);
            }
        }
    })
}

export function listenSelectionToSetCursor(editor: Editor) {
    editor.docTree.addEventListener('selection_change', selection => {
        const point: Point = ct(selection.end);
        const behavior = editor.behaviorSet.CursorPositionBehavior.get(point.node.type);
        if (!behavior) return;
        const result = behavior(editor.uiMap.getElement(point.node), point.offset, editor);
        if (result) {
            editor.cursor.setPosition(result.left, result.top, result.height)
        }
        editor.cursor.focus({ preventScroll: true });
    })
}