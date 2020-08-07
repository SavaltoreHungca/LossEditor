import { Paragraph } from "./elementTypes";

export type DocNodeTypesMap = {
    'paragraph': DocParagraph
    'sentinel': DocSentinal
}

export interface DocNode extends HTMLElement {

}

export interface DocParagraph extends DocNode {
    getParaUiEle(): Paragraph
}

export interface DocSentinal extends DocNode {

}