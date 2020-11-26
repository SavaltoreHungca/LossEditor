import { Editor } from "../../Editor";
import { EmptyOrgnizerNodeRnderBehavior, Node } from "editor-core";
import { nodeCreator } from "../../elements/nodes/nodeTypes";

// 在第一次渲染时, 如果其下没有子节点则
export function rootEmptyOrgnizerFactory(editor: Editor): EmptyOrgnizerNodeRnderBehavior {
    return (node: Node) => {
        const sentinel = nodeCreator({
            type: 'sentinel',
            isPresenter: true,
            parent: node
        });
        node.children = [sentinel];
    }
}

