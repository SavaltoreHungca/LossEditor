import { Editor } from "../Editor";
import { DocNodeTypesMap } from "./docElementTypes";

export interface DocNode extends HTMLElement {

}

export function docExt<K extends keyof DocNodeTypesMap>(editor: Editor, type: K) {
    return (ele: HTMLElement) => {
        ele.setAttribute('data-editor-doc-type', type);

        return {
        }
    }
}