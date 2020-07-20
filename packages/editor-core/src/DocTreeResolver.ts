import { Node } from './Node'

export class DocTreeResolver {
    static fromObj(obj: any): Node {
        let ans = undefined;
        const stack = [obj];
        const parentMap = new Map<any, Node>();

        while (stack.length > 0) {
            const root = stack.shift();

            let rootNode: Node;

            if (parentMap.get(root)) {
                rootNode = <Node>parentMap.get(root);
            } else {
                rootNode = this.createNode(root);
                parentMap.set(root, rootNode);
            }
            if (!ans) {
                ans = rootNode;
            }
            if (root.children) {
                rootNode.children = [];
                root.children.forEach((item: any) => {
                    const childNode = this.createNode(item);
                    parentMap.set(item, childNode);
                    rootNode.children?.push(childNode);
                    childNode.parent = rootNode;
                    stack.push(item);
                });
            }
        }
        return <Node>ans;
    }

    private static createNode(obj: any): Node {
        const node = new Node(obj.type, obj.isPresenter);
        node.content = obj.content;
        node.sentinelAct = obj.sentinelAct;
        return node;
    }

}