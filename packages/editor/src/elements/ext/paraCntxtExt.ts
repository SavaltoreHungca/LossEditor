import { Editor } from "../../Editor";
import { $$, ElementInfo } from "utils";
import { Style } from "../elementTypes";

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