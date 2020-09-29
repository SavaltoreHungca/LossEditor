import { DocNode } from "./DocNode";
import { Editor } from "../../Editor";
import { ct, Nil, $$ } from "utils";
import { Paragraph } from "../Paragraph";
import { Node } from 'editor-core';
import { Style } from "../elementTypes";
import { ParagraphLine } from "../ParagraphLine";
import { binarySearchWhichRange } from "./docElementTypes";

export interface DocParagraph extends DocNode {
    getParaUiEle(): Paragraph
    getLineByOffset(offset: number): ParagraphLine
}

export function docParaExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            getParaUiEle: function (): Paragraph {
                return ct(ele.children[0].children[0].children[0]);
            },
            getLineByOffset: function (offset: number): ParagraphLine {
                return ct(binarySearchWhichRange(this.getParaUiEle().children, offset));
            }
        }
    }
}