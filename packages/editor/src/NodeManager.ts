import { Editor } from './Editor';
import { BidMap, $$, ct, MapObj } from "utils";
import { Node } from 'editor-core';
import { DocNodeTypesMap, creDocEle } from './elements/docs/docElementTypes';
import { DocNode } from './elements/docs/DocNode';
import { mountChild } from './render/mountChild';
import { nodeCreator } from './elements/nodes/nodeTypes';

// node 和 docElement 的映射
export class NodeManager {
    private nodeMap = new BidMap<Node, DocNode>();
    private editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
    }

    hasElement(node: Node | undefined): boolean {
        return node && this.nodeMap.getvalue(node) ? true : false;
    }

    getElement(node: Node, ifAbsense?: (node: Node) => DocNode) {
        let ele = this.nodeMap.getvalue(node);
        if (!ele) {
            if (ifAbsense)
                ele = ifAbsense(node);
            else if (node.type === 'root') {
                ele = this.editor.viewLines;
            }
            else
                ele = creDocEle(this.editor, ct<keyof DocNodeTypesMap>(node.type));
            this.setElement(node, ele);
        }
        return ele;
    }

    addNewNode(parent: Node, nodeValue: MapObj, beforeRender?: (node: Node) => void) {
        const node = nodeCreator(nodeValue);
        parent.children = parent.children || [];
        parent.children.push(node);
        node.parent = parent;
        beforeRender && beforeRender(node);
        this.editor.docTree.render(node);
        return node;
    }

    getNode(element: DocNode) {
        return this.nodeMap.getkey(element);
    }

    setElement(node: Node, element: DocNode) {
        element.setAttribute('data-editor-doc-type', node.type);
        this.nodeMap.set(node, element);
    }

    delete(node: Node) {
        if (this.hasElement(node.parent)) {
            const ele = this.getElement(<Node>node.parent);
            if (this.hasElement(node)) {
                ele.removeChild(this.getElement(node))
            }
        }
        this.nodeMap.remove(node);
        node.delete();
    }

}