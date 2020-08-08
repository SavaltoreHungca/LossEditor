import { UiElement } from "./UiElement";
import { Editor } from "../Editor";
import { $$ } from "utils";

export interface ViewLines extends UiElement { }

export function viewLinesExt(editor: Editor) {
    return (viewLines: HTMLElement) => {
        $$.setStyle(viewLines, {
            outline: 'none',
            'user-select': 'none',
        })
        viewLines.setAttribute('tabindex', '1');
        return {

        }
    }
}