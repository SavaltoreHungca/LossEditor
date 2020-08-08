import { ParagraphContext } from "./ParagraphContext";
import { Editor } from "../Editor"
import { $$, ct } from "utils"
import { Paragraph } from "./Paragraph";

export interface ParagraphLine extends ParagraphContext {
    fitContent(): void
    autoWidth(): void
    getParagraph(): Paragraph
}

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