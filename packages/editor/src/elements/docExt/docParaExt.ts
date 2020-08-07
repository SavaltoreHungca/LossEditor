import { Editor } from "../../Editor";
import { $$, ElementInfo, ct } from "utils";
import { Style, Paragraph } from "../elementTypes";
import { Constants } from "../../Constants";

export function docParaExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            getParaUiEle: function (): Paragraph {
                return ct(ele.children[0].children[0].children[0]);
            }
        }
    }
}