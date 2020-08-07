import { Editor } from "../../Editor";
import { $$, ElementInfo, ct } from "utils";
import { Style, Paragraph } from "../elementTypes";
import { Constants } from "../../Constants";
import { DocNodeTypesMap } from "../docElementTypes";

export function docExt<K extends keyof DocNodeTypesMap>(editor: Editor, type: K) {
    return (ele: HTMLElement) => {
        ele.setAttribute('data-editor-doc-type', type);

        return {
        }
    }
}