import { ParagraphContext } from "./ParagraphContext";
import { Editor } from "../Editor"
import { $$, ct } from "utils"
import { Paragraph } from "./Paragraph";
import { Inlineblock } from "./Inlineblock";
import { binarySearchWhichRange } from "./docs/docElementTypes";

export interface ParagraphLine extends ParagraphContext {
    fitContent(): void
    autoWidth(): void
    getParagraph(): Paragraph
    getInlineBlockByOffset(offset: number): Inlineblock
    priviousLine(): ParagraphLine | undefined;
    nextLine(): ParagraphLine | undefined;
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
            },
            getInlineBlockByOffset: function (offset: number): Inlineblock {
                return ct(binarySearchWhichRange(ele.children, offset));
            },
            priviousLine: function(){
                const privous = ele.previousElementSibling;
                if(privous) return ct(privous);
            },
            nextLine: function(){
                const next = ele.nextElementSibling;
                if(next) return ct(next);
            }
        }
    }
}