import { Inlineblock } from "./Inlineblock";
import { Editor } from "..";
import { $$, ct } from "utils";

export interface EmptyLineTag extends Inlineblock {
    
}

export function emptyLineTagExt(editor: Editor) {
    return (ele: HTMLElement) => {
        return {
            
        }
    }
}