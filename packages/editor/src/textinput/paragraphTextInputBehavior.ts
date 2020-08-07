import { $$ } from 'utils';
import { Editor } from '../Editor';
import { Point } from "editor-core";
import { binarySearchWhichRange } from '../selection/cursorposition/paragraphCursorPosition';

export function paragraphTextInputBehaviorFactory(editor: Editor) {
    return (point: Point, text: string) => {
        if (!point.node.content) point.node.content = {str: ''};
        point.node.content.str = $$.insertStrBefore(point.node.content.str, point.offset, text);

        const paragraphUi = editor.uiMap.getElement(point.node);
        const lines = paragraphUi.children[0].children[0].children[0].children;
        const line = binarySearchWhichRange(lines, point.offset);
        const ele = binarySearchWhichRange(line.children, point.offset);

        ele.innerText = $$.insertStrBefore(ele.innerText, point.offset - ele.getElementStart(), text);
        
        const p = {
            node: point.node,
            offset: point.offset + text.length
        }
        editor.docTree.typesetting(point);
        editor.docTree.changeSelection(p, p);
    }
}