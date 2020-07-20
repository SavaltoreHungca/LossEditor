import { Editor } from "../Editor";
import { Constants } from "../Constants";

let skipInputEvent = false;
export function listenTextInput(editor: Editor) {

    editor.cursor.addEventListener("compositionstart", (event) => {
        skipInputEvent = true;
    })
    editor.cursor.addEventListener("compositionend", (event: any) => {
        editor.docTree.textInput(event.data);
        skipInputEvent = false;
        editor.eventManager.triggleEvent(Constants.events.TEXT_INPUT);
    })
    editor.cursor.addEventListener('input', (event: any) => {
        const evt: InputEvent = event;
        if (skipInputEvent) return;
        editor.docTree.textInput(evt.data || '');
    })
}