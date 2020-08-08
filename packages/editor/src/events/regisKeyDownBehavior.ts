import { Editor } from "../Editor";
import { paragraphKeyDownBehavior } from "../textinput/keydown/paragraphKeyDownBehavior";

export function regisKeyDownBehavior(editor: Editor) {
    editor.regisKeyDownBehavior('paragraph', paragraphKeyDownBehavior(editor));
}