export interface Node {
    type: string
    children: Array<Node>
    parent?: Node
    content: any
}

export class DocTreeBuilder {
    private doc: Array<Node>;

    private buildMiddles: Map<string, (parent: Node, child: Node) => Node>
        = new Map();

    constructor(doc: Array<Node>) {
        this.doc = doc;
    }

    build() {
        const root: Node = {
            type: 'root',
            children: [],
            content: "type something"
        }

        this.doc.forEach(child => {
            const middle = this.buildMiddles.get(child.type);
            if (!middle) throw new Error();

            root.children.push(
                middle(root, child)
            )
        })
    }

}