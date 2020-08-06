import { Editor } from "../Editor";
import { Node } from 'editor-core';
import { mountChild } from "./resolveNodeRelation";
import { $$ } from "utils";

export function sentinelRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const {parentUi, nodeUi} = mountChild(editor, parent, node);
        parent = <Node> parent;
        $$.setStyle(nodeUi, {
            cursor: 'text',
        });
        if(parent.sentinelAct){
            $$.setStyle(nodeUi, parent.sentinelAct.style);
            nodeUi.innerText = parent.sentinelAct.placeholder || '';
        }
    }
}