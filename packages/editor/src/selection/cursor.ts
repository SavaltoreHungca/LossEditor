import { Utils } from "utils";
import { Constants } from "../Constants";
import { Editor, SetCursorPositionResult } from "../Editor";
import { Point } from 'editor-core';

export function listenSelectionToSetCursor(editor: Editor) {
    editor.docTree.addEventListener('selection_change', selection => {
        const point = <Point>selection.end;
        const behavior = editor.setCursorPositionBehaviorSet.get(point.node.type);
        if (!behavior) return;
        const result = <SetCursorPositionResult>behavior(editor.uiMap.getElement(point.node), point.offset, editor);
        if (result) {
            setCursorPosition(editor.cursor, result.left, result.top, result.height);
        }
        editor.cursor.focus({ preventScroll: true });
    })
}
