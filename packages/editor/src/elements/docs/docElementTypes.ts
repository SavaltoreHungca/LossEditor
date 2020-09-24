import { Editor } from "../../Editor";
import { extend, $$, Nil, ct } from "utils";
import { DocParagraph, docParaExt } from "./DocParagraph";
import { DocSentinal, docSentinelExt } from "./DocSentinel";
import { docExt } from "./DocNode";
import { ParagraphContext } from "../ParagraphContext";


export type DocNodeTypesMap = {
    'paragraph': DocParagraph
    'sentinel': DocSentinal
}

export function creDocEle<K extends keyof DocNodeTypesMap>(editor: Editor, type: K, ele?: HTMLElement): DocNodeTypesMap[K] {
    switch (type) {
        case 'paragraph':
            return extend($$.creEle('block'), [docExt(editor, type), docParaExt(editor)]);
        case 'sentinel':
            return extend($$.creEle('block'), [docExt(editor, type), docSentinelExt(editor)]);
    }

    throw new Error();
}



export function binarySearchWhichRange(array: HTMLCollection, offset: number) {
    let foundLine: ParagraphContext = Nil;
    let right = array.length - 1;
    let left = 0;

    if (array.length === 1) {
        foundLine = ct(array[0]);
    }

    while (!foundLine && left < right) {
        const nextLine: ParagraphContext = ct(array[right]);

        const rightStart = nextLine.getElementStart();

        const len = Math.abs(left - right);
        const mid = left + Math.floor(len / 2);
        const midStart = (<ParagraphContext>ct(array[mid])).getElementStart();

        if (offset > midStart) {
            left = mid;
        } else if (offset <= midStart) {
            right = mid;
        }

        if (len === 1) {
            if (offset > rightStart) {
                foundLine = nextLine;
            } else {
                break;
            }
        }
    }
    if (!foundLine) {
        foundLine = ct(array[left]);
    }
    return foundLine;
}