import { Editor } from "../../Editor";
import { $$, ElementInfo } from "utils";
import { Style } from "../elementTypes";

export function lineExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            fitContent: () => {
                $$.setStyle(ele, {width: 'fit-content'});
            },
            autoWidth: () => {
                $$.setStyle(ele, {width: 'auto'});
            }
        }
    }
}