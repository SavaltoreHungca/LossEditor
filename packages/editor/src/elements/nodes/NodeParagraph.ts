import { Editor } from "../../Editor";
import { ct, Nil, $$ } from "utils";
import { Paragraph } from "../Paragraph";
import { Node } from 'editor-core';
import { Style } from "../elementTypes";
import { ParagraphLine } from "../ParagraphLine";

export interface NodeParagraph extends Node {
    content: TextContent
    getStyleMapAndSortedRanges: () => { styleMap: StyleMap, sortedRanges: Array<[number, number]> }
    insertTextBefore: (text: string, offset: number) => void
}

export function nodeParaExt(node: Node) {
    return {
        getStyleMapAndSortedRanges: function () {
            const textContent: TextContent = node.content;
            const styleMap = new Map<[number, number], Style>();
            const sortedRanges = new Array<[number, number]>();
            (textContent.styleList || []).forEach(item => {
                const range: [number, number] = [item[0], item[1]];
                sortedRanges.push(range);
                styleMap.set(range, item[2]);
            });
            return {
                styleMap: styleMap,
                sortedRanges: sortedRanges
            }
        },
        insertTextBefore: function (text: string, offset: number): void {
            if (!node.content) node.content = {str: ''};
            node.content.str = $$.insertStrBefore(node.content.str, offset, text);
        }
    }
}

export interface TextContent {
    str: string
    styleList?: StyleList
}

export type StyleList = Array<[number, number, Style]>;

export type StyleMap = Map<[number, number], Style>;