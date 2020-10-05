import { Editor } from "../../Editor";
import { KeyDownBehavior } from "../../behaviorTypes";
import { isHotkey } from 'is-hotkey';
import { ct, $$, Nil } from "utils";
import { Point, Selection } from "editor-core";
import { DocParagraph } from "../../elements/docs/DocParagraph";
import { ParagraphLine } from "../../elements/ParagraphLine";
import { Inlineblock } from "../../elements/Inlineblock";
import { getType } from "../../utils";
import { NodeParagraph } from "../../elements/nodes/NodeParagraph";

export function paragraphKeyDownBehavior(editor: Editor): KeyDownBehavior {
    return (event, selection) => {
        const point: Point = ct(selection.end);
        if (isHotkey('ArrowLeft', event)) {
            arrowLeft(editor, point, selection);
        }
        else if (isHotkey('ArrowRight', event)) {
            arrowRight(editor, point, selection);
        }
        else if (isHotkey('ArrowUp', event)) {
            arrowUp(editor, point, selection);
        }
        else if (isHotkey('ArrowDown', event)) {
            arrowDown(editor, point, selection);
        }
        else if(isHotkey('enter', event)) {
            console.log('shit');
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

function arrowUp(editor: Editor, point: Point, selection: Selection) {
    const nodeParagraph: NodeParagraph = ct(point.node);
    const docParagraph: DocParagraph = ct(editor.uiMap.getElement(nodeParagraph));
    const line = docParagraph.getLineByOffset(point.offset);
    const cursorPosi = editor.cursor.getPosiRelativeToViewLines()
    const linePosi = line.getPosiRelativeToViewLines()
    console.log(cursorPosi);
    console.log(linePosi);

    const preLine: ParagraphLine = ct(line.previousElementSibling);
    if (!preLine) return;

    const diff = point.offset - line.getElementStart();
    const preLineCursorOffset = preLine.getElementStart() + diff;
    point.offset = preLineCursorOffset;
    editor.docTree.changeSelection(point, point);
    return;
}

function arrowDown(editor: Editor, point: Point, selection: Selection) {
    const nodeParagraph: NodeParagraph = ct(point.node);
    const docParagraph: DocParagraph = ct(editor.uiMap.getElement(nodeParagraph));
    const line = docParagraph.getLineByOffset(point.offset);
    const cursorPosi = editor.cursor.getPosiRelativeToViewLines()
    const linePosi = line.getPosiRelativeToViewLines()

    const nextLine: ParagraphLine = ct(line.nextElementSibling);
    if (!nextLine) return;

    const diff = point.offset - line.getElementStart();
    const nextLineCursorOffset = nextLine.getElementStart() + diff;
    point.offset = nextLineCursorOffset;
    editor.docTree.changeSelection(point, point);
    return;
}

