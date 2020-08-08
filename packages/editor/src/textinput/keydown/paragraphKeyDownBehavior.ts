import { Editor } from "../../Editor";
import { KeyDownBehavior } from "../../behaviorTypes";
import { isHotkey } from 'is-hotkey';
import { ct } from "utils";
import { Point, Selection } from "editor-core";

export function paragraphKeyDownBehavior(editor: Editor): KeyDownBehavior {
    return (event, selection) => {
        const point: Point = ct(selection.end);
        if (isHotkey('ArrowLeft', event)) {
            arrowLeft(editor, point, selection);
        }
        else if(isHotkey('ArrowRight', event)){
            arrowRight(editor, point, selection);
        }
    }
}

function arrowLeft(editor: Editor, point: Point, selection: Selection) {
    point.offset -= 1;
    editor.docTree.changeSelection(point, point);
}

function arrowRight(editor: Editor, point: Point, selection: Selection) {
    point.offset += 1;
    editor.docTree.changeSelection(point, point);
}