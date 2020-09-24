import { $$, ct } from 'utils';
import { Editor } from '../Editor';
import { Point } from "editor-core";
import { DocParagraph, NodeParagraph } from '../elements/docs/DocParagraph';
import { getType } from '../utils';
import { Text } from '../elements/Text';

export function paragraphTextInputBehaviorFactory(editor: Editor) {
    return (point: Point, text: string) => {
        const nodeParagraph: NodeParagraph = ct(point.node);
        nodeParagraph.insertTextBefore(text, point.offset);

        const docParagraph: DocParagraph = ct(editor.uiMap.getElement(point.node));
        const line = docParagraph.getLineByOffset(point.offset);
        const ele = line.getInlineBlockByOffset(point.offset);

        switch (getType(ele)) {
            case 'unit-block':
                break;
            case 'text':
                ct<Text>(ele).insertTextBefore(text, point.offset);
                break;
        }


        const p = {
            node: point.node,
            offset: point.offset + text.length
        }
        editor.docTree.typesetting(point);
        editor.docTree.changeSelection(p, p);
    }
}