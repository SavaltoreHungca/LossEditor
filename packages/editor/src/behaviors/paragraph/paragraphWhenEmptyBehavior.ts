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
            
            // 当 paragraph 为空后, 通知其父节点其将被移除
            editor.docTree.childHasRemoved(editor.uiMap.getNode(docParent), node);
        }
    }
}