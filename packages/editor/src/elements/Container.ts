import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $, $$, ct, innerHtml } from "utils"
import { creEle } from "./elementTypes";

export interface Container extends UiElement { }

export function containerExt(editor: Editor) {
    return (ele: UiElement)=>{
        ct<any>(ele).editor = editor;

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
        
        ele.setStyle({
            width: editor.settings.width * 0.6,
            height: editor.settings.height * 0.6
        })

        const containerInfo = ele.getInfo();
        const idset = {
            viewlines: $$.randmonId(),
            backlayer: $$.randmonId(),
            cursor: $$.randmonId(),
            region: $$.randmonId(),
        }

        innerHtml(ele, `
            <div id="${idset.viewlines}" 
                style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; width: ${containerInfo.innerWidth}px;"></div>

            <div id="${idset.backlayer}"
                style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; z-index: -1">
                <textarea id="${idset.cursor}"></textarea>
                <div id="${idset.region}"
                    style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; z-index: -1"></div>
            </div>
        `);

        editor.viewLines = creEle(editor, 'view-lines', $(idset.viewlines));
        editor.backLayer = creEle(editor, 'back-layer', $(idset.backlayer));
        editor.regionContainer = creEle(editor, 'region-container', $(idset.region));
        editor.cursor = creEle(editor, 'cursor', $(idset.cursor));

        return {}
    }
}