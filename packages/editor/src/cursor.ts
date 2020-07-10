import { Utils } from "utils";
import { getType } from "./utils";
import { Constants } from "./Constants";
import { Editor } from "./Editor";

export function listenSelectionToSetCursor(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.SELECTION_CHANGE, () => {
        const endPoint = editor.selection?.end;
        if (!endPoint) return;

        switch (getType(endPoint.node)) {
            case 'text': {
                const posi = Utils.getRelativePosition(endPoint.node, editor.viewLines);
                const offset =
                    Utils.getStrPx(endPoint.node.innerText.substring(0, endPoint.offset), endPoint.node).width

                Utils.setStyle(editor.cursor, {
                    left: posi.left + offset,
                    top: posi.top,
                    height: endPoint.node.offsetHeight,
                    visibility: 'visible'
                })
                break;
            }
            case 'unit-block': case 'image': {
                const posi = Utils.getRelativePosition(endPoint.node, editor.viewLines);
                let offset = -Utils.getElementInfo(editor.cursor).width;
                if (endPoint.offset === 1) {
                    offset = Utils.getElementInfo(endPoint.node).width;
                }

                Utils.setStyle(editor.cursor, {
                    left: posi.left + offset,
                    top: posi.top,
                    height: endPoint.node.offsetHeight,
                    visibility: 'visible'
                })
                break;
            }
        }
        editor.cursor.value = '';
        editor.cursor.focus({preventScroll: true});
    })
}


let skipInputEvent = false;
export function createCursor(editor: Editor): HTMLTextAreaElement {
    const cursor = document.createElement("textarea");
    cursor.addEventListener("blur", () => {
        // Utils.setStyle(cursor, {visibility: "hidden"});
    })

    Utils.setStyle(cursor, {
        "margin": "0",
        "padding": "0",
        "position": "absolute",
        "outline": "none!important",
        "resize": "none",
        "border": "none",
        "border-left": "0.5px black solid",
        "overflow": "hidden",
        "color": "transparent",
        "background-color": "black",
        "font-family": 'Menlo, Monaco, "Courier New", monospace',
        "font-weight": "normal",
        "font-size": "12px",
        "font-feature-settings": '"liga" 0, "calt" 0',
        "line-height": "18px",
        "letter-spacing": "0px",
        "top": "209px",
        "left": "91px",
        "width": "1px",
        "height": "18px",
        "z-index": "1",
        "user-select": "none",
        'white-space': 'pre',
        animation: 'flashing-cursor 600ms infinite;'
        // "visibility": "hidden"
    })

    cursor.addEventListener("compositionstart", (event) => {
        skipInputEvent = true;
    })
    cursor.addEventListener("compositionend", (event: any) => {
        editor.inputText = event.data;
        skipInputEvent = false;
        editor.eventManager.triggleEvent(Constants.events.TEXT_INPUT);
    })
    cursor.addEventListener('input', (event: any) => {
        if(skipInputEvent) return;
        editor.inputText = event.data;
        editor.eventManager.triggleEvent(Constants.events.TEXT_INPUT);
    })
    return cursor;
}