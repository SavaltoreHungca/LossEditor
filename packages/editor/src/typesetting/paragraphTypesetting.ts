import { paragraphProps, getType } from './../utils';
import { Editor } from '../Editor';
import { Point } from 'editor-core';
import { binarySearchWhichRange } from '../selection/cursorposition/paragraphCursorPosition';

export function paragraphTypesettingFactory(editor: Editor) {
    return (point: Point) => {
        const paragraphUi = editor.uiMap.getElement(point.node);
        const paragraph = paragraphUi.children[0].children[0].children[0];
        const line = binarySearchWhichRange(paragraph.children, point.offset);
        const ele = binarySearchWhichRange(line.children, point.offset);

        let nextstart = paragraphProps.getElementStart(ele);
        nextstart = updateNextStart(ele, nextstart);



    }
}

function fillIn(line: HTMLElement, nextLine: HTMLElement){
    const lastEle = line.lastElementChild;
    const nextEle = nextLine.firstElementChild;

    
}

function updateNextStart(ele: HTMLElement, nextstart: number): number {
    paragraphProps.setElementStart(ele, nextstart);
    return nextstart + getEleLen(ele);
}

function getEleLen(ele: HTMLElement): number {
    switch (getType(ele)) {
        case 'text': {
            return ele.innerText.length;
        }
        case 'unit-block': {
            return paragraphProps.getUnitblockOffset(ele)
        }
        case 'paragraph-line': {
            let next = ele.firstElementChild;
            let ans = 0
            while (next) {
                ans += getEleLen(<HTMLElement>next);
                next = next.nextElementSibling;
            }
            return ans;
        }
    }
    throw new Error();
}