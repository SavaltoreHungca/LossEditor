import { Editor } from '../../Editor';
import { paragraphProps, getType } from "../../utils";
import { Utils } from "utils";

export function setCursorPositionForParagraph(paragraph: HTMLElement, offset: number, editor: Editor) {
    const ans = {
        left: 0,
        top: 0,
        height: 0
    };

    const paragraphLines = paragraph.children[0].children[0].children[0].children;
    const line = binarySearchWhichRange(paragraphLines, offset);
    const inLineElement = binarySearchWhichRange(line.children, offset);

    switch (getType(inLineElement)) {
        case 'text': {
            const posi = Utils.getRelativePosition(inLineElement, editor.viewLines);
            const textOffset = Utils.getStrPx(
                inLineElement.innerText.substring(0, offset - paragraphProps.getElementStart(inLineElement)),
                inLineElement
            ).width;

            ans.left = posi.left + textOffset;
            ans.top = posi.top;
            ans.height = inLineElement.offsetHeight;
            break;
        }
        case 'unit-block': {
            const posi = Utils.getRelativePosition(inLineElement, editor.viewLines);
            let blockOffset = -Utils.getElementInfo(editor.cursor).width;
            if (offset > paragraphProps.getElementStart(inLineElement)) {
                blockOffset = Utils.getElementInfo(inLineElement).width;
            }

            ans.left = posi.left + blockOffset;
            ans.top = posi.top;
            ans.height = inLineElement.offsetHeight;
            break;
        }
        default: return undefined;
    }

    return ans;
}

export function binarySearchWhichRange(array: HTMLCollection, offset: number) {
    let foundLine;
    let right = array.length - 1;
    let left = 0;

    if (array.length === 1) {
        foundLine = array[0];
    }

    while (!foundLine && left < right) {
        const nextLine = <HTMLElement>array[right];

        const rightStart = paragraphProps.getElementStart(nextLine);

        const len = Math.abs(left - right);
        const mid = left + Math.floor(len / 2);
        const midStart = paragraphProps.getElementStart(<HTMLElement>array[mid]);

        if (offset > midStart) {
            left = mid;
        } else if (offset <= midStart) {
            right = mid;
        }

        if (len === 1) {
            if (offset > rightStart) {
                foundLine = nextLine;
            } else {
                break;
            }
        }
    }
    if (!foundLine) {
        foundLine = array[left];
    }
    return <HTMLElement>foundLine;
}