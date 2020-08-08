import { Editor } from "../../Editor";
import { $$ } from "utils";
import { DocSentinal } from "../../elements/DocSentinel";

export function setCursorPositionForSentinel(sentinel: DocSentinal, offset: number, editor: Editor) {
    const posi = $$.getRelativePosition(sentinel, editor.viewLines);
    return {
        left: posi.left,
        top: posi.top,
        height: sentinel.offsetHeight
    };
}