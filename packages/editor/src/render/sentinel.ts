import { Editor } from "../Editor";
import { Node } from 'editor-core';
import { mountChild } from "./resolveNodeRelation";
import { Utils } from "utils";

export function sentinelRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        const {parentUi, nodeUi} = mountChild(editor, parent, node);
        parent = <Node> parent;
        Utils.setStyle(nodeUi, {
            cursor: 'text',
        });
        if(parent.sentinelAct){
            Utils.setStyle(nodeUi, parent.sentinelAct.style);
            nodeUi.innerText = parent.sentinelAct.placeholder || '';
        }
    }
}