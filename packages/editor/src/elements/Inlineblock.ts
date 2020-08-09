import { ParagraphContext } from "./ParagraphContext";
import { Editor } from "../Editor"
import { $$, ct } from "utils"
import { getType } from "../utils";

export interface Inlineblock extends ParagraphContext {
    setEleUniId(id?: string): void
    getEleUniId(): string
}

export function inlineBlockExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            setEleUniId: function (id?: string): void {
                ele.setAttribute('data-uni-id', id || $$.randmonId());
            },
            getEleUniId: function (): string {
                return <string>ele.getAttribute('data-uni-id');
            }
        }
    }
}