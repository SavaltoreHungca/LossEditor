import { Utils } from "utils";
import { Constants } from "../Constants";
import { Editor, SetCursorPositionResult } from "../Editor";
import { Point } from 'editor-core';

export function listenSelectionToSetCursor(editor: Editor) {
    editor.docTree.addEventListener('selection_change', selection => {
        const point = <Point>selection.end;
        const behavior = editor.setCursorPositionBehaviorSet.get(point.node.type);
        if (!behavior) return;
        const result = <SetCursorPositionResult>behavior(editor.uiMap.getvalue(point.node), point.offset, editor);
        if(result){
            setCursorPosition(editor.cursor, result.left, result.top, result.height);
        }
    })  
}

function setCursorPosition(cursor: HTMLElement, left: number, top: number, height: number) {
    Utils.setStyle(cursor, {
        left: left,
        top: top,
        height: height,
        visibility: 'visible'
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
        const evt: InputEvent = event;
        if (skipInputEvent) return;
        editor.inputText = evt.data || '';
        editor.eventManager.triggleEvent(Constants.events.TEXT_INPUT);
    })
    return cursor;
}