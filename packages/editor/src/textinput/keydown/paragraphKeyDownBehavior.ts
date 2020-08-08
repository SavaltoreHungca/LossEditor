import { Editor } from "../..";
import { KeyDownBehavior } from "../../behaviorTypes";
import { isHotkey } from 'is-hotkey';
import { ct } from "utils";
import { Point } from "editor-core";

export function paragraphKeyDownBehavior(editor: Editor): KeyDownBehavior {
    return (event, selection) => {
        const point: Point = ct(selection.end);
        if(isHotkey('ArrowLeft', event)){
            arrowLeft(point);
        }
    }
}

function arrowLeft(point: Point){

}