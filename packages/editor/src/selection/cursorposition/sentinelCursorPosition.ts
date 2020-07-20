import { Editor } from "../../Editor";
import { Utils } from "utils";

export function setCursorPositionForSentinel(sentinel: HTMLElement, offset: number, editor: Editor) {
    const posi = Utils.getRelativePosition(sentinel, editor.viewLines);
    return {
        left: posi.left,
        top: posi.top,
        height: sentinel.offsetHeight
    };
}