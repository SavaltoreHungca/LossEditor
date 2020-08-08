import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $$ } from "utils"

export interface ParagraphContext extends UiElement {
    setElementStart(start: number): void
    getElementStart(): number
}

export function paraCntxtExt(editor: Editor) {
    return (ele: HTMLElement)=>{
        $$.setStyle(ele, {
            cursor: 'text',
        })

        return {
            setElementStart: function(start: number): void{
                ele.setAttribute('data-start-point', start + '')
            },
            getElementStart: function(): number{
                return parseInt(<string>ele.getAttribute('data-start-point'))
            }
        }
    }
}