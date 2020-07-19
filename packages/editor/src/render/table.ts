import { Utils } from 'utils';
import { Editor } from "../Editor";
import { Node } from "editor-core";

export function tableRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if (!parent) throw new Error(`无法找到承载的父容器`);
        const parentUi = <HTMLElement>editor.uiMap.getvalue(parent);
        const nodeUi = <HTMLElement>editor.uiMap.getvalue(node);

        if (nodeUi.parentElement !== parentUi) {
            nodeUi.parentElement?.removeChild(nodeUi);
            parentUi.appendChild(nodeUi);
        }

        Utils.setStyle(nodeUi, {

        })
    }
}

export function rowRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if (!parent) throw new Error(`无法找到承载的父容器`);
        const parentUi = <HTMLElement>editor.uiMap.getvalue(parent);
        const nodeUi = <HTMLElement>editor.uiMap.getvalue(node);

        if (nodeUi.parentElement !== parentUi) {
            nodeUi.parentElement?.removeChild(nodeUi);
            parentUi.appendChild(nodeUi);
        }

        Utils.setStyle(nodeUi, {
            display: 'flex'
        })
    }
}

export function cellRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if (!parent) throw new Error(`无法找到承载的父容器`);
        const children = <Array<Node>>parent.children;
        const parentUi = <HTMLElement>editor.uiMap.getvalue(parent);
        const nodeUi = <HTMLElement>editor.uiMap.getvalue(node);

        if (nodeUi.parentElement !== parentUi) {
            nodeUi.parentElement?.removeChild(nodeUi);
            parentUi.appendChild(nodeUi);
        }

        Utils.setStyle(nodeUi, {
            'flex-basis': 1 / children.length * 100 + '%',
            overflow: 'hidden'
        })
    }
}