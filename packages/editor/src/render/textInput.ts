import { $$ } from 'utils';
import { Editor } from "../Editor";
import { mountChild } from "./resolveNodeRelation";
import { Node } from 'editor-core';

export type InputTextContent = {
    str: string
}

export function textInputRendererFactor(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);
        const content = <InputTextContent>node.content;

        $$.setStyle(nodeUi, {
            'overflow': 'hidden',
            'white-space': 'pre',
            'text-overflow': 'ellipsis',
        })
        nodeUi.innerText = content.str;
    }
}