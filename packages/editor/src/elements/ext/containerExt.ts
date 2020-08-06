import { Editor } from "../../Editor";
import { $$ } from "utils";

export function containerExt(editor: Editor) {
    return (ele: HTMLElement)=>{
        $$.setStyle(editor.container, {
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