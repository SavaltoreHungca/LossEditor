import { BidMap } from "utils";
import { Node } from 'editor-core';

export class NodeManager {
    private nodeMap = new BidMap<Node, HTMLElement>();

    hasElement(node: Node | undefined): boolean {
        return node && this.nodeMap.getvalue(node) ? true : false;
    }

    getElement(node: Node) {
        let ele = this.nodeMap.getvalue(node);
        if (!ele) {
            ele = document.createElement('div');
            this.setElement(node, ele);
        }
        return ele;
    }

    getNode(element: HTMLElement) {
        return this.nodeMap.getkey(element);
    }

    setElement(node: Node, element: HTMLElement) {
        element.setAttribute('data-node-type', node.type);
        this.nodeMap.set(node, element);
    }

    delete(node: Node) {
        if (this.hasElement(node.parent)) {
            const ele = this.getElement(<Node>node.parent);
            if(this.hasElement(node)){
                ele.removeChild(this.getElement(node))
            }
        }
        this.nodeMap.remove(node);
        node.delete();
    }

}