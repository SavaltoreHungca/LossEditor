import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $, $$, ct, innerHtml } from "utils"
import { creEle } from "./elementTypes";
import { ScrollPage } from "scroll-page";

export interface ScrollFrame extends UiElement { }

export function scrollFrameExt(editor: Editor) {
    return (ele: UiElement)=>{
        const idset = {
            container: $$.randmonId()
        }

        innerHtml(ele, `
            <div id="${idset.container}"></div>
        `);

        editor.container = creEle(editor, 'container', $(idset.container));

        const scrollPage = new ScrollPage({
            container: ele,
            containerWidth: editor.settings.width,
            containerHeight: editor.settings.height,
        });

        return {}
    }
}