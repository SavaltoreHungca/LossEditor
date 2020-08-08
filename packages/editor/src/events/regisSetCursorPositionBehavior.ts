import { Editor } from "../Editor";
import { setCursorPositionForParagraph } from "../selection/cursorposition/paragraphCursorPosition";
import { setCursorPositionForSentinel } from "../selection/cursorposition/sentinelCursorPosition";

export function regisSetCursorPositionBehavior(editor: Editor) {
    editor.regisSetCursorPositionBehavior('paragraph', setCursorPositionForParagraph);
    editor.regisSetCursorPositionBehavior('sentinel', setCursorPositionForSentinel);
}