import { Editor } from "../../Editor";
import { KeyDownBehavior } from "../../behaviorTypes";
import { isHotkey } from 'is-hotkey';
import { ct } from "utils";
import { Point, Selection } from "editor-core";
import { NodeParagraph, DocParagraph } from "../../elements/DocParagraph";

export function paragraphKeyDownBehavior(editor: Editor): KeyDownBehavior {
    return (event, selection) => {
        const point: Point = ct(selection.end);
        if (isHotkey('ArrowLeft', event)) {
            arrowLeft(editor, point, selection);
        }
        else if (isHotkey('ArrowRight', event)) {
            arrowRight(editor, point, selection);
        }
        else if (isHotkey('ArrowTop', event)) {
            arrowTop(editor, point, selection);
        }
    }
}

function arrowLeft(editor: Editor, point: Point, selection: Selection) {
    point.offset -= 1;
    if (point.offset < 0) point.offset = 0;
    editor.docTree.changeSelection(point, point);
}

function arrowRight(editor: Editor, point: Point, selection: Selection) {
    const nodeParagraph: NodeParagraph = ct(point.node);
    point.offset += 1;
    if (point.offset > nodeParagraph.content.str.length) point.offset -= 1;

    editor.docTree.changeSelection(point, point);
}

function arrowTop(editor: Editor, point: Point, selection: Selection) {
    const nodeParagraph: NodeParagraph = ct(point.node);
    const docParagraph: DocParagraph = ct(editor.uiMap.getElement(nodeParagraph));
    docParagraph.getLineByOffset(point.offset);
}