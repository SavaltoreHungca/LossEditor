import { Utils } from "utils";
import { getType } from "./utils";
import { Constants } from "./Constants";
import { Editor } from "./Editor";

export function listenSelectionToSetCursor(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.SELECTION_CHANGE, ()=>{
        console.log(editor.selection);

        const endPoint = editor.selection?.end;
        if(typeof endPoint?.node === 'undefined') return;
        
        const type = getType(endPoint.node);

        if (type === 'text') {
            const posi = Utils.getRelativePosition(endPoint.node, editor.viewLines);
            const offset =
                Utils.getStrPx(endPoint.node.innerText.substring(0, endPoint.offset), endPoint.node).width
    
            Utils.setStyle(editor.cursor, {
                left: posi.left + offset,
                top: posi.top,
                height: endPoint.node.offsetHeight,
                visibility: 'visible'
            })

            return;
        }

        if(type === 'unit-block'){
            const posi = Utils.getRelativePosition(endPoint.node, editor.viewLines);
            let offset = 0;
            if(endPoint.offset === 1){
                offset = Utils.getElementInfo(endPoint.node).width;
            }

            Utils.setStyle(editor.cursor, {
                left: posi.left + offset,
                top: posi.top,
                height: endPoint.node.offsetHeight,
                visibility: 'visible'
            })

            return;
        }
        
    })
}

export function createCursor(): HTMLTextAreaElement {
    const cursor = document.createElement("textarea");
    cursor.addEventListener("blur", ()=>{
        // Utils.setStyle(cursor, {visibility: "hidden"});
    })

    Utils.setStyle(cursor, {
        "min-width": "0",
        "min-height": "0",
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
        "z-index": "-1",
        "user-select": "none",
        // "visibility": "hidden"
    })

    const blink = () => {
        if (Utils.getComputedStyle(cursor, "opacity") !== 100) {
            Utils.setStyle(cursor, { opacity: 100 })
        } else {
            Utils.setStyle(cursor, { opacity: 0 })
        }
        setTimeout(blink, 700);
    }
    blink();

    cursor.addEventListener("compositionstart", (event) => {
        console.log(event);
    })
    cursor.addEventListener("compositionupdate", (event) => {
        console.log(event);
    })
    cursor.addEventListener("compositionend", (event) => {
        console.log(event);
    })
    return cursor;
}