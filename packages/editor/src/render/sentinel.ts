import { Editor } from "../Editor";
import { Node } from 'editor-core';
import { mountChild } from "./mountChild";
import { $$ } from "utils";

export function sentinelRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();
        
        const {parentUi, nodeUi} = mountChild(editor, parent, node);

        if(parent.sentinelAct){
            $$.setStyle(nodeUi, parent.sentinelAct.style);
            nodeUi.innerText = parent.sentinelAct.placeholder || '';
        }
    }
}