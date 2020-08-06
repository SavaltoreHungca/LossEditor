import { Editor } from "../../Editor";
import { $$, ElementInfo } from "utils";
import { Style } from "../elementTypes";

export function inlineBlockExt(editor: Editor) {
    return (ele: HTMLElement)=>{
        return {
            setEleUniId: function(id?: string): void{
                ele.setAttribute('data-uni-id', id || $$.randmonId());
            },
            getEleUniId: function(): string{
                return <string>ele.getAttribute('data-uni-id');
            }
        }
    }
}