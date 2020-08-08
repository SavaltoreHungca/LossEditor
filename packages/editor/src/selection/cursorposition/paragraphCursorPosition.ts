import { Editor } from '../../Editor';
import { getType } from "../../utils";
import { $$, ct, Nil } from "utils";
import { DocParagraph } from '../../elements/DocParagraph';
import { ParagraphContext } from '../../elements/ParagraphContext';
import { ParagraphLine } from '../../elements/ParagraphLine';
import { Inlineblock } from '../../elements/Inlineblock';

export function setCursorPositionForParagraph(paragraph: DocParagraph, offset: number, editor: Editor) {
    const ans = {
        left: 0,
        top: 0,
        height: 0
    };

    const paragraphLines = paragraph.getParaUiEle().children;
    const line = <ParagraphLine>binarySearchWhichRange(paragraphLines, offset);
    const inLineElement = <Inlineblock>binarySearchWhichRange(line.children, offset);

    switch (getType(inLineElement)) {
        case 'text': {
            const posi = $$.getRelativePosition(inLineElement, editor.viewLines);
            const textOffset = $$.getStrPx(
                inLineElement.innerText.substring(0, offset - inLineElement.getElementStart()),
                inLineElement
            ).width;

            ans.left = posi.left + textOffset;
            ans.top = posi.top;
            ans.height = inLineElement.offsetHeight;
            break;
        }
        case 'unit-block': {
            const posi = $$.getRelativePosition(inLineElement, editor.viewLines);
            let blockOffset = -$$.getElementInfo(editor.cursor).width;
            if (offset > inLineElement.getElementStart()) {
                blockOffset = $$.getElementInfo(inLineElement).width;
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
    let foundLine: ParagraphContext = Nil;
    let right = array.length - 1;
    let left = 0;

    if (array.length === 1) {
        foundLine = ct(array[0]);
    }

    while (!foundLine && left < right) {
        const nextLine: ParagraphContext = ct(array[right]);

        const rightStart = nextLine.getElementStart();

        const len = Math.abs(left - right);
        const mid = left + Math.floor(len / 2);
        const midStart = (<ParagraphContext>ct(array[mid])).getElementStart();

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
        foundLine = ct(array[left]);
    }
    return foundLine;
}