import { $$ } from 'utils';
import { Editor } from "../../Editor";
import { Node } from "editor-core";
import { mountChild } from './mountChild';

export function tableRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        $$.setStyle(nodeUi, {

        })
    }
}

export function rowRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        $$.setStyle(nodeUi, {
            display: 'flex'
        })
    }
}

export function cellRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        const children = <Array<Node>>parent.children;

        $$.setStyle(nodeUi, {
            'flex-basis': 1 / children.length * 100 + '%',
            overflow: 'hidden'
        })
    }
}