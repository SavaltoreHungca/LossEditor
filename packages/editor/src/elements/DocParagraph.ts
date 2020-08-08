import { DocNode } from "./DocNode";
import { Editor } from "../Editor";
import { ct } from "utils";
import { Paragraph } from "./Paragraph";

export interface DocParagraph extends DocNode {
    getParaUiEle(): Paragraph
}

export function docParaExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            getParaUiEle: function (): Paragraph {
                return ct(ele.children[0].children[0].children[0]);
            }
        }
    }
}