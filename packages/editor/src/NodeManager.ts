import { Editor } from './Editor';
import { BidMap, $$, ct, MapObj, Nil } from "utils";
import { Node } from 'editor-core';
import { DocNodeTypesMap, creDocEle } from './elements/docs/docElementTypes';
import { DocNode } from './elements/docs/DocNode';
import { nodeCreator } from './elements/nodes/nodeTypes';

// node 和 docElement 的映射
export class NodeManager {
    private nodeMap = new BidMap<Node, DocNode>();
    private editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
    }

    hasThenGetElement(node: Node): DocNode{
        if(this.hasElement(node)) return this.getElement(node);
        return Nil;
    }

    hasElement(node: Node | undefined): boolean {
        return node && this.nodeMap.getvalue(node) ? true : false;
    }

    // 获取和 DocTree 相对应的 Html 元素
    getElement(node: Node, ifAbsense?: (node: Node) => DocNode) {
        let ele = this.nodeMap.getvalue(node);
        if (!ele) {
            if (ifAbsense)
                ele = ifAbsense(node);
            else if (node.type === 'root') {
                ele = creDocEle(this.editor, 'root', this.editor.viewLines);
            }
            else
                ele = creDocEle(this.editor, ct<keyof DocNodeTypesMap>(node.type));
            this.setElement(node, ele);
        }
        return ele;
    }

    // 添加 DocTree 的节点
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

    // 设置和 DocTree 相对应的 Html 节点
    setElement(node: Node, element: DocNode) {
        element.setAttribute('data-editor-doc-type', node.type);
        this.nodeMap.set(node, element);
    }

    // 删除 DocTree 的节点并做相应的清理
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