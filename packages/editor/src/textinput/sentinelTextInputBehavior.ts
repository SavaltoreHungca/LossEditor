import { Editor } from "../Editor";
import { Point, Node } from "editor-core";
import { mountChild } from "../render/resolveNodeRelation";

export function sentinelTextInputBehaviorFactory(editor: Editor) {
    return (point: Point, text: string) => {
        const parent = <Node>point.node.parent;

        editor.uiMap.delete(point.node);

        const paragraph = new Node('paragraph', true);
        paragraph.content = {
            str: ''
        }
        paragraph.parent = parent;

        editor.docTree.render(paragraph);

        point = {
            node: paragraph,
            offset: 0
        }
        editor.docTree.changeSelection(point, point);
        editor.docTree.textInput(text);
    }
}