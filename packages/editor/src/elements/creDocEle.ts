import { DocNodeTypesMap } from "./docElementTypes";
import { Editor } from "../Editor";
import { extend, $$ } from "utils";
import { docParaExt } from "./docExt/docParaExt";
import { docExt } from "./docExt/docExt";

export function creDocEle<K extends keyof DocNodeTypesMap>(editor: Editor, type: K, ele?: HTMLElement): DocNodeTypesMap[K] {
    switch (type) {
        case 'doc-paragraph':
            return extend($$.creEle('block'), [docExt(editor, type), docParaExt(editor)]);
        case 'doc-sentinal':
            return extend($$.creEle('block'), [docExt(editor, type)]);
    }

    throw new Error();
}