import { Editor } from "../Editor";
import { Constants } from "../Constants";

let skipInputEvent = false;
export function listenTextInput(editor: Editor) {

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
    if(data && data !== ''){
        editor.docTree.textInput(data);
    }
}