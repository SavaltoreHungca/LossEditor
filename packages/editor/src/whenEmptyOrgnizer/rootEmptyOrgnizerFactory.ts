import { Editor } from "../Editor";
import { EmptyOrgnizerNodeRnderBehavior, Node } from "editor-core";

export function rootEmptyOrgnizerFactory(editor: Editor): EmptyOrgnizerNodeRnderBehavior {
    return (node: Node) => {
        const sentinel = new Node('sentinel', true);
        node.children = [sentinel];
        sentinel.parent = node;
    }
}

