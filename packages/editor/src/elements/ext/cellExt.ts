import { Editor } from "../../Editor";
import { $$, ElementInfo } from "utils";
import { Style } from "../elementTypes";
import { Constants } from "../../Constants";

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