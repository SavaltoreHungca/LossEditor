import { Paragraph } from "./elementTypes";

export type DocNodeTypesMap = {
    'doc-paragraph': DocParagraph
    'doc-sentinal': DocSentinal
}

export interface DocNode extends HTMLElement {

}

export interface DocParagraph extends DocNode {
    getParaUiEle(): Paragraph
}

export interface DocSentinal extends DocNode {

}