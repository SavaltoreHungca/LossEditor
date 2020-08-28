import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { $$, DragState } from 'utils';

export interface ResizeBar extends Element {
}

export function resizeBarExt(memloss: MemLoss) {
    return (resizeBar: Element) => {
        $$.addDragEvent(resizeBar, (e: DragState) => {
            const { leftSidePad, rightSidePad } = memloss;
            const { leftSidePadMinWidth, leftSidePadMaxWidth } = memloss.settings;
            // nodeList.scrollPage.settings
            const sidPadInfo = leftSidePad.getInfo();
            const editorFrameInfo = rightSidePad.getInfo();

            let leftSidePadSize = sidPadInfo.width + e.deltaX;

            if (leftSidePadSize < leftSidePadMinWidth) leftSidePadSize = leftSidePadMinWidth;
            else if (leftSidePadSize > leftSidePadMaxWidth) leftSidePadSize = leftSidePadMaxWidth;

            let rightSidePadSize = editorFrameInfo.width - e.deltaX;



            leftSidePad.setWidth(leftSidePadSize);
            rightSidePad.setWidth(rightSidePadSize);

            leftSidePad.nodeListPad.updateSize();
        })

        return {};
    }
}