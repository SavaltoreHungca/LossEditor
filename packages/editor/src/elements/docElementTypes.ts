import { Editor } from "../Editor";
import { extend, $$ } from "utils";
import { DocParagraph, docParaExt } from "./DocParagraph";
import { DocSentinal } from "./DocSentinel";
import { docExt } from "./DocNode";


export type DocNodeTypesMap = {
    'paragraph': DocParagraph
    'sentinel': DocSentinal
}

export function creDocEle<K extends keyof DocNodeTypesMap>(editor: Editor, type: K, ele?: HTMLElement): DocNodeTypesMap[K] {
    switch (type) {
        case 'paragraph':
            return extend($$.creEle('block'), [docExt(editor, type), docParaExt(editor)]);
        case 'sentinel':
            return extend($$.creEle('block'), [docExt(editor, type)]);
    }

    throw new Error();
}

