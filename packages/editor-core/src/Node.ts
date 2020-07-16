import { Utils } from 'utils';

export class Node {
    type: string
    isPresenter: boolean
    children?: Array<Node>
    parent?: Node
    content?: any

    constructor(type: string, isPresenter: boolean){
        this.type = type;
        this.isPresenter = isPresenter;
    }

    get nextSibling(): Node | undefined {
        if (this.parent) {
            const children = <Array<Node>>this.parent.children;
            const nextIndex = children.indexOf(this) + 1;
            if (nextIndex < children.length) {
                return children[nextIndex];
            }
        }
    }

    get preSibling(): Node | undefined {
        if (this.parent) {
            const children = <Array<Node>>this.parent.children;
            const preIndex = children.indexOf(this) - 1;
            if (preIndex >= 0) {
                return children[preIndex];
            }
        }
    }

    get nextPresenter(): Node | undefined {
        if (!this.isPresenter) return;

        const findFirstPresenter = (node: Node) => {
            if (node.isPresenter) return node;

            const stack = [node];
            const indexMap = new Map<Node, number>();
            while (stack.length > 0) {
                const root = <Node>Utils.statckPeek(stack);
                const children = root.children || [];
                let childIndex = indexMap.get(root);
                if (!childIndex) childIndex = 0;
                if (childIndex < children.length) {
                    stack.push(children[childIndex]);
                    indexMap.set(root, childIndex + 1);
                } else {
                    stack.pop();
                    if (root.isPresenter) {
                        return root;
                    }
                }
            }
        }

        const findParentNextSibling = (node: Node) => {
            let parent = node.parent;
            while(parent){
                let parentNextSibling = parent.nextSibling;
                if(parentNextSibling) return parentNextSibling;
                parent = parent.parent;
            }
        }

        const nextSibling = this.nextSibling;
        if (nextSibling) {
            return findFirstPresenter(nextSibling);
        } else {
            let parentNetSibling = findParentNextSibling(this);
            while (parentNetSibling) {
                const presenter = findFirstPresenter(parentNetSibling)
                if (presenter) return presenter;
                parentNetSibling = findParentNextSibling(parentNetSibling);
            }
            return;
        }
    }

    get prePresenter(): Node | undefined {
        if (!this.isPresenter) return;

        const findFirstPresenter = (node: Node) => {
            if (node.isPresenter) return node;

            const stack = [node];
            const indexMap = new Map<Node, number>();
            while (stack.length > 0) {
                const root = <Node>Utils.statckPeek(stack);
                const children = root.children || [];
                let childIndex = indexMap.get(root);
                if (!childIndex) childIndex = children.length - 1;
                if (childIndex >= 0) {
                    stack.push(children[childIndex]);
                    indexMap.set(root, childIndex + 1);
                } else {
                    stack.pop();
                    if (root.isPresenter) {
                        return root;
                    }
                }
            }
        }

        const findParentPreSibling = (node: Node) => {
            let parent = node.parent;

            while(parent){
                let parentPreSibling = parent.preSibling;
                if(parentPreSibling) return parentPreSibling;
                parent = parent.parent;
            }
        }

        const preSibling = this.preSibling;
        if (preSibling) {
            return findFirstPresenter(preSibling);
        } else {
            let parentPreSibling = findParentPreSibling(this);
            while (parentPreSibling) {
                const presenter = findFirstPresenter(parentPreSibling)
                if (presenter) return presenter;
                parentPreSibling = findParentPreSibling(parentPreSibling);
            }
            return;
        }
    }
}