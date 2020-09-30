import { DocNode } from "./DocNode";
import { Editor } from "../../Editor";
import { ct, Nil, $$ } from "utils";
import { Paragraph } from "../Paragraph";
import { Node } from 'editor-core';
import { Style } from "../elementTypes";
import { ParagraphLine } from "../ParagraphLine";
import { binarySearchWhichRange } from "./docElementTypes";
import { NodeParagraph } from "../nodes/NodeParagraph";

export interface DocParagraph extends DocNode {
    getParaUiEle(): Paragraph
    getLineByOffset(offset: number): ParagraphLine
    isEmpty(): boolean
}

export function docParaExt(editor: Editor) {
    return (docParagraph: DocNode) => {
        return {
            getParaUiEle: function (): Paragraph {
                return ct(docParagraph.children[0].children[0].children[0]);
            },
            getLineByOffset: function (offset: number): ParagraphLine {
                return ct(binarySearchWhichRange(this.getParaUiEle().children, offset));
            },
            isEmpty: function(){
                const nodeParagraph = ct<NodeParagraph>(editor.uiMap.getNode(ct(docParagraph)));
                if(nodeParagraph.content.str === ''){
                    return true;
                }

                if(docParagraph.childElementCount === 0) return true;
                const paragraph = this.getParaUiEle();

                if(paragraph.childElementCount === 0) return true;

                return false;
            }
        }
    }
}