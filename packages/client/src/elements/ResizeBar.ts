import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { $$, DragState } from 'utils';

export interface ResizeBar extends Element {
}

export function resizeBarExt(memloss: MemLoss){
    return (resizeBar: Element) => {
        const {leftSidePad, rightSidePad} = memloss;

        $$.addDragEvent(resizeBar, (e: DragState) => {
            // nodeList.scrollPage.settings
            const sidPadInfo = leftSidePad.getInfo();
            const editorFrameInfo = rightSidePad.getInfo();

            leftSidePad.setWidth(sidPadInfo.width + e.deltaX);
            rightSidePad.setWidth(editorFrameInfo.width - e.deltaX);
        })
        
        return {};
    }
}