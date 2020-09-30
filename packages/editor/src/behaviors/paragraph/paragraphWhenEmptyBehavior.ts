import { Node } from "editor-core";
import { ct } from "utils";
import { Editor } from "../../Editor";
import { DocParagraph } from "../../elements/docs/DocParagraph";

export function paragraphBackspaceFactory(editor: Editor) {
    return (node: Node)=>{
        const docParagraph: DocParagraph = ct(editor.uiMap.hasThenGetElement(node));

        

    }
}