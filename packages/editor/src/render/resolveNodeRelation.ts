import { Editor } from '../Editor';
import { Node } from 'editor-core';

export function mountChild(editor: Editor, parent: Node | undefined, child: Node) {
    if (!parent) throw new Error(`无法找到承载的父容器`);
    const parentUi = <HTMLElement>editor.uiMap.getElement(parent);
    const nodeUi = <HTMLElement>editor.uiMap.getElement(child);

    if (nodeUi.parentElement !== parentUi) {
        nodeUi.parentElement?.removeChild(nodeUi);
        parentUi.appendChild(nodeUi);
    }
    nodeUi.innerHTML = '';
    nodeUi.innerText = '';
    return {
        parentUi: parentUi,
        nodeUi: nodeUi
    }
}