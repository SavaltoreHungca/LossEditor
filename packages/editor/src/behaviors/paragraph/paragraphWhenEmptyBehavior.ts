import { Node } from "editor-core";
import { ct } from "utils";
import { Editor } from "../../Editor";
import { DocParagraph } from "../../elements/docs/DocParagraph";

export function paragraphWhenEmptyBehavior(editor: Editor) {
    return (node: Node)=>{
        const docParagraph: DocParagraph = ct(editor.uiMap.hasThenGetElement(node));
        if(docParagraph.isEmpty()){
            const docParent = docParagraph.getParentDocNode();
            editor.uiMap.delete(node);
            
            editor.docTree.childHasRemoved(editor.uiMap.getNode(docParent), node);
        }
    }
}