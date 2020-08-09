import { Editor } from "../Editor";
import { Point, Node } from "editor-core";
import { ct } from "utils";

export function sentinelTextInputBehaviorFactory(editor: Editor) {
    return (point: Point, text: string) => {
        const parent: Node = ct(point.node.parent);

        editor.uiMap.delete(point.node);


        const paragraph = editor.uiMap.addNewNode(parent, {
            type: 'paragraph',
            isPresenter: true,
            content: { str: '' }
        })

        point = {
            node: paragraph,
            offset: 0
        }

        editor.docTree.changeSelection(point, point);
        editor.docTree.textInput(text);
    }
}