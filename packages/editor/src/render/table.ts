import { Utils } from 'utils';
import { Editor } from "../Editor";
import { Node } from "editor-core";
import { mountChild } from './resolveNodeRelation';

export function tableRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        Utils.setStyle(nodeUi, {

        })
    }
}

export function rowRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        Utils.setStyle(nodeUi, {
            display: 'flex'
        })
    }
}

export function cellRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        const { parentUi, nodeUi } = mountChild(editor, parent, node);
        parent = <Node>parent;
        const children = <Array<Node>>parent.children;

        Utils.setStyle(nodeUi, {
            'flex-basis': 1 / children.length * 100 + '%',
            overflow: 'hidden'
        })
    }
}