import { Editor } from '../Editor';
import { Node } from 'editor-core';
import { DocNode } from '../elements/DocNode';

export function mountChild(editor: Editor, parent: Node, child: Node, ifAbsense?: (node: Node)=>DocNode) {
    const parentUi = editor.uiMap.getElement(parent); if(!parentUi) throw new Error('无法找到父节点Doc容器');
    const nodeUi = editor.uiMap.getElement(child, ifAbsense);
    
    if (nodeUi.parentElement !== parentUi) {
        nodeUi.parentElement?.removeChild(nodeUi);
        parentUi.appendChild(nodeUi);
    }
    
    nodeUi.innerHTML = '';
    return {
        parentUi: parentUi,
        nodeUi: nodeUi
    }
}