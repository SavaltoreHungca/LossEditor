import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { $$, DragState } from 'utils';

export interface ResizeBar extends Element {
}

export function resizeBarExt(memloss: MemLoss){
    return (resizeBar: Element) => {
        $$.addDragEvent(resizeBar, (e: DragState) => {
            const {leftSidePad, rightSidePad} = memloss;
            // nodeList.scrollPage.settings
            const sidPadInfo = leftSidePad.getInfo();
            const editorFrameInfo = rightSidePad.getInfo();

            leftSidePad.setWidth(sidPadInfo.width + e.deltaX);
            rightSidePad.setWidth(editorFrameInfo.width - e.deltaX);
        })

        return {};
    }
}