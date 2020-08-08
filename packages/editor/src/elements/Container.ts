import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $$ } from "utils"

export interface Container extends UiElement { }

export function containerExt(editor: Editor) {
    return (ele: HTMLElement)=>{
        $$.setStyle(ele, {
            "white-space": "pre",
            position: "relative",
            "font-family": 'Menlo, Monaco, "Courier New", monospace',
            "font-weight": 'normal',
            "font-size": '12px',
            "font-feature-settings": '"liga" 0, "calt" 0',
            "line-height": '18px',
            "letter-spacing": '0px',
            height: 'fit-content',
            outline: 'none',
            'user-select': 'none',
        });
        ele.setAttribute('tabindex', '1');
        return {}
    }
}