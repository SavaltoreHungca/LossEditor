import { Editor } from "../../Editor";
import { $$, ElementInfo, ct } from "utils";
import { Style, Paragraph } from "../elementTypes";

export function lineExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            fitContent: () => {
                $$.setStyle(ele, { width: 'fit-content' });
            },
            autoWidth: () => {
                $$.setStyle(ele, { width: 'auto' });
            },
            getParagraph: function (): Paragraph {
                return ct(ele.parentElement);
            }
        }
    }
}