import { DocTree } from "./DocTree";
import { doc } from "./testdata";
import { DocTreeResolver } from "./DocTreeResolver";
import { Node } from "./Node";

export class TestEditor {
    nodeMap = new Map<Node, HTMLElement>();
    container: HTMLElement;
    docTree: DocTree;

    constructor(container: HTMLElement) {
        this.container = container;

        const root = DocTreeResolver.fromObj(doc);
        this.docTree = new DocTree()
        this.docTree.addEventListener('node_created', (parent, child) => {
            // console.log(parent, child);
            this.renderUI(parent, child);
        })
        this.docTree.setTree(root);

        const selectedNode: Node = <Node>((<any>root).children)[1].children[0].children[0].children[0];

        this.docTree.setSelection({
            start: {
                node: selectedNode,
                offset: 5
            },
            end: {
                node: selectedNode,
                offset: 5
            }
        })

        this.docTree.regisCursorMoveBehavior('paragraph', (point, offset, horizongtal)=>{
            if(point.node.content.length === 1){
                return {
                    isExceed: true,
                    offset: -1
                };
            }else {
                return {
                    isExceed: false,
                    offset: 10
                };
            }
        })
    }


    renderUI(parent: Node | undefined, child: Node) {
        let parentUi;
        if (parent) {
            parentUi = this.nodeMap.get(parent);
        } else {
            this.nodeMap.set(child, this.container);
            return;
        }
        if (!parentUi) throw new Error();
        switch (child.type) {
            case 'paragraph': {
                const childUi = document.createElement('div');
                childUi.innerText = child.content;
                parentUi.appendChild(childUi);
                this.nodeMap.set(child, childUi);
                break;
            }
            case 'table': {
                const childUi = document.createElement('div');
                parentUi.appendChild(childUi);
                this.nodeMap.set(child, childUi);
                break;
            }
            case 'row': {
                const childUi = document.createElement('div');
                parentUi.appendChild(childUi);
                this.nodeMap.set(child, childUi);
                break;
            }
            case 'cell': {
                const childUi = document.createElement('div');
                parentUi.appendChild(childUi);
                this.nodeMap.set(child, childUi);
                break;
            }
        }

    }
}




