import { Editor } from "../../Editor";
import { Node, Point } from "editor-core";
import { nodeCreator } from "../../elements/nodes/nodeTypes";
import { ct } from "utils";

export function rootChildHasRemovedBehavior(editor: Editor) {
    return (node: Node, child: Node) => {
        editor.reRenderNode(node);
        const point: Point = {
            node: ct<any>(node.children)[0],
            offset: 0
        }
        editor.docTree.changeSelection(point, point);
    }
}

