import { Node } from './Node'
import { DocTree } from './DocTree';
import { MapObj, ct, Nil } from 'utils';

export class DocTreeResolver {

    private docTree: DocTree

    constructor(docTree: DocTree) {
        this.docTree = docTree;
    }

    private getDocument(doc: string | MapObj): MapObj {
        return typeof doc === 'string'? JSON.parse(doc) : doc;
    }

    resolve(obj: MapObj | string): Node {
        const document = this.getDocument(obj);

        let ans: Node = Nil;
        const stack = [document];

        const parentMap = new Map<any, Node>();

        while (stack.length > 0) {
            const root: MapObj = ct(stack.shift());

            let rootNode: Node;

            if (parentMap.get(root)) {
                rootNode = ct(parentMap.get(root));
            } else {
                rootNode = this.docTree.nodeCreator(ct(root));
                parentMap.set(root, rootNode);
            }
            if (!ans) {
                ans = rootNode;
            }
            if (root.children) {
                rootNode.children = [];
                root.children.forEach((item: any) => {
                    const childNode = this.docTree.nodeCreator(ct(item));
                    parentMap.set(item, childNode);
                    rootNode.children?.push(childNode);
                    childNode.parent = rootNode;
                    stack.push(item);
                });
            }
        }
        return ans;
    }
}