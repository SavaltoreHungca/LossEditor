import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $$ } from "utils"

export interface Cell extends UiElement { }

export function cellExt(editor: Editor) {
    return (ele: HTMLElement) => {
        $$.setStyle(ele, {
            'box-sizing': 'border-box',
            border: '1px black solid',
            padding: '2px',
        })

        return {}
    }
}