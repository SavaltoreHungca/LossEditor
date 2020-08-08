import { Editor } from "../../Editor";
import { $$ } from "utils";
import { DocNode } from "../../elements/DocNode";

export function setCursorPositionForSentinel(sentinel: DocNode, offset: number, editor: Editor) {
    const posi = $$.getRelativePosition(sentinel, editor.viewLines);
    return {
        left: posi.left,
        top: posi.top,
        height: sentinel.offsetHeight
    };
}