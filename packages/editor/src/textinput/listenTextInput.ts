import { Editor } from "../Editor";
import { Constants } from "../Constants";
import isHotkey from "is-hotkey";

let skipInputEvent = false;
export function listenTextInput(editor: Editor) {
    editor.container.addEventListener('keydown', (event) => {
        if (isHotkey('backspace', event)) {
            editor.docTree.backspace();
        }
        else if (editor.docTree.selection) {
            const point = editor.docTree.selection.end;
            if (point) {
                const behavior = editor.keyDownBehaviorSet.get(point.node.type);
                if (behavior) behavior(event, editor.docTree.selection);
            };
        }
    })

    editor.cursor.addEventListener("compositionstart", (event) => {
        skipInputEvent = true;
    })
    editor.cursor.addEventListener("compositionend", (event: any) => {
        triggleTextInput(editor, event.data)
        skipInputEvent = false;
    })
    editor.cursor.addEventListener('input', (event: any) => {
        if (skipInputEvent) return;
        triggleTextInput(editor, event.data)
    })
}

function triggleTextInput(editor: Editor, data: string | undefined | null) {
    if (data && data !== '') {
        editor.docTree.textInput(data);
    }
}