import { Utils } from "utils";

export function createCursor(): HTMLTextAreaElement {
    const cursor = document.createElement("textarea");

    Utils.setStyle(cursor, {
        "min-width": "0",
        "min-height": "0",
        "margin": "0",
        "padding": "0",
        "position": "absolute",
        "outline": "none!important",
        "resize": "none",
        "border": "none",
        "border-right": "3px black solid",
        "overflow": "hidden",
        "color": "transparent",
        "background-color": "transparent",
        "font-family": 'Menlo, Monaco, "Courier New", monospace',
        "font-weight": "normal",
        "font-size": "12px",
        "font-feature-settings": '"liga" 0, "calt" 0',
        "line-height": "18px",
        "letter-spacing": "0px",
        "top": "209px",
        "left": "91px",
        "width": "1px",
        "height": "18px"
    })

    const blink = ()=>{
        if(Utils.getComputedStyle(cursor, "opacity") !== 100){
            Utils.setStyle(cursor, {opacity: 100})
        }else{
            Utils.setStyle(cursor, {opacity: 0})
        }
        setTimeout(blink, 700);
    }
    blink();
    return cursor;
}