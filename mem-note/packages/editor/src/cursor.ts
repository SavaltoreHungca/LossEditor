import { Utils } from "utils";
import { isTextNode } from "./utils";
import { Constants } from "./Constants";

export function setCursorPosition(selection: Selection, cursor: HTMLTextAreaElement, container: HTMLElement) {

    let node: HTMLElement;
    if (selection.focusNode === null) return;
    if (selection.focusNode.nodeType === 3) {
        const textNode = selection.focusNode;
        node = <HTMLElement>selection.focusNode.parentElement;
        if (!isTextNode(node)) return;
        const posi = Utils.getRelativePosition(node, container);
        const offset =
            Utils.getStrPx(<string>textNode.nodeValue?.substring(0, selection.focusOffset), node).width

        Utils.setStyle(cursor, {
            left: posi.left + offset + 'px',
            top: posi.top + 'px',
            height: node.offsetHeight + 'px',
            visibility: 'visible'
        })
    } else {
        return;
    }
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