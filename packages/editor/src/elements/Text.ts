import { Inlineblock } from "./Inlineblock";
import { Editor } from "..";
import { $$, ct } from "utils";

export interface Text extends Inlineblock {
    insertTextBefore: (text: string, offset: number) => void
}

export function textExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            insertTextBefore: function (text: string, offset: number): void {
                const textEle: Text = ct(ele);
                textEle.innerText = $$.insertStrBefore(textEle.innerText, offset - textEle.getElementStart(), text);
            }
        }
    }
}