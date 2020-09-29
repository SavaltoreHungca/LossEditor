import { Editor } from "../Editor";
import { setCursorPositionForParagraph } from "../behaviors/paragraph/paragraphCursorPosition";
import { setCursorPositionForSentinel } from "../behaviors/sentinel/sentinelCursorPosition";

export function regisSetCursorPositionBehavior(editor: Editor) {
    editor.regisSetCursorPositionBehavior('paragraph', setCursorPositionForParagraph);
    editor.regisSetCursorPositionBehavior('sentinel', setCursorPositionForSentinel);
}