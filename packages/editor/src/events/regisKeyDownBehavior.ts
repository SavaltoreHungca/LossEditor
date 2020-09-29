import { Editor } from "../Editor";
import { paragraphKeyDownBehavior } from "../behaviors/paragraph/paragraphKeyDownBehavior";

export function regisKeyDownBehavior(editor: Editor) {
    editor.regisKeyDownBehavior('paragraph', paragraphKeyDownBehavior(editor));
}