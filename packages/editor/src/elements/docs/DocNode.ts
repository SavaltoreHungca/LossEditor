import { Editor } from "../../Editor";
import { getDocNodeFromChild } from "../../utils";
import { DocNodeTypesMap } from "./docElementTypes";

export interface DocNode extends HTMLElement {
    getParentDocNode(): DocNode
}

export function docExt<K extends keyof DocNodeTypesMap>(editor: Editor, type: K) {
    return (ele: HTMLElement) => {
        ele.setAttribute('data-editor-doc-type', type);

        return {
            getParentDocNode: function() {
                if(ele.parentElement){
                    return getDocNodeFromChild(ele.parentElement);
                }
            }
        }
    }
}