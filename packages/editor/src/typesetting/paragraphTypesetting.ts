import { getType } from './../utils';
import { Editor } from '../Editor';
import { Point } from 'editor-core';
import { binarySearchWhichRange } from '../selection/cursorposition/paragraphCursorPosition';
import { $, ct } from 'utils';
import { DocParagraph } from '../elements/DocParagraph';
import { ParagraphLine } from '../elements/ParagraphLine';
import { Inlineblock } from '../elements/Inlineblock';
import { ParagraphContext } from '../elements/ParagraphContext';
import { UnitBlock } from '../elements/UnitBlock';
import { creEle } from '../elements/elementTypes';

export function paragraphTypesettingFactory(editor: Editor) {
    return (point: Point) => {
        const paragraphUi: DocParagraph = ct(editor.uiMap.getElement(point.node));
        const paragraph = paragraphUi.getParaUiEle();
        let line: ParagraphLine = ct(binarySearchWhichRange(paragraph.children, point.offset));
        if (line?.previousElementSibling) line = ct(line.previousElementSibling);
        line = ct(findSuitableStartLine(line));

        if (!line) return;

        let ele: Inlineblock = ct(line.firstElementChild);
        let nextstart = ele.getElementStart();
        while (line) {
            ele = ct(line.firstElementChild);
            while (ele) {
                const next: Inlineblock = ct(ele.nextElementSibling);
                if (isEmptyEle(ele)) {
                    line.removeChild(ele);
                }
                ele = next;
            }

            ele = ct(line.firstElementChild);
            if (ele) {
                isLineExceed(line) ? appendUpLine(editor, line) : fillUpLine(editor, line);
                while (ele) {
                    nextstart = updateNextStart(ele, nextstart);
                    ele = ct(ele.nextElementSibling);
                }
            }

            const next: ParagraphLine = ct(line.nextElementSibling);

            if (!line.firstElementChild) {
                paragraph.removeChild(line);
            } else {
                line.setElementStart(ct<Inlineblock>(line.firstElementChild).getElementStart());
            }
            line = next;
        }
    }
}

function findSuitableStartLine(line: ParagraphLine): ParagraphLine | undefined {
    if (!line) return undefined;

    const paragraph = line.getParagraph();
    let ele: Inlineblock = ct(line.firstElementChild);
    if (!ele) {
        let next: ParagraphLine = ct(line.nextElementSibling);
        paragraph.removeChild(line)
        return findSuitableStartLine(next);
    }
    else if (isEmptyEle(ele)) {
        while (ele && isEmptyEle(ele)) {
            let next: Inlineblock = ct(ele.nextElementSibling);
            line.removeChild(ele);
            ele = next;
        }
        if (!ele) {
            return findSuitableStartLine(line);
        } else {
            return line;
        }
    }
    else {
        return line;
    }
}

function isLineExceed(line: ParagraphLine): boolean {
    const paragraph = line.getParagraph();
    const maxWidth = paragraph.getInfo().innerWidth;
    line.fitContent();
    const exceed = line.offsetWidth > maxWidth;
    line.autoWidth();
    return exceed;
}

function fillUpLine(editor: Editor, line: ParagraphLine) {
    const paragraph = line.getParagraph();
    const maxWidth = paragraph.getInfo().innerWidth;
    const lastEle = <Inlineblock>line.lastElementChild;
    if (!lastEle) return;
    const suitableLine = findSuitableStartLine(<ParagraphLine>line.nextElementSibling);
    if (!suitableLine) return;
    const nextEle = <Inlineblock>suitableLine.firstElementChild;

    const lastEleType = getType(lastEle);
    const nextEleType = getType(nextEle);


    const nEleAppend = () => {
        const nEle = creEle(editor, 'text');
        nEle.setEleUniId(nextEleId);
        nEle.setStyle(nextEleStyle)
        line.appendChild(nEle);

        const firstChar = nextEle.innerText.substring(0, 1);
        nEle.innerText += firstChar;
        if (line.offsetWidth > maxWidth) {
            line.removeChild(nEle);
            line.autoWidth();
            return;
        }
        else {
            nextEle.innerText = nextEle.innerText.substring(1);
            line.autoWidth();
            fillUpLine(editor, line);
            return;
        }
    }

    line.fitContent();
    const lastEleId = lastEle.getEleUniId();
    const nextEleId = nextEle.getEleUniId();
    const lastEleStyle = lastEle.getStyle();
    const nextEleStyle = nextEle.getStyle();

    if (nextEleType === 'unit-block') {
        suitableLine.removeChild(nextEle);
        line.appendChild(nextEle);
        if (line.offsetWidth > maxWidth) {
            line.removeChild(nextEle);
            suitableLine.insertBefore(nextEle, suitableLine.firstElementChild);
            line.autoWidth();
            return;
        }
        else {
            line.autoWidth();
            fillUpLine(editor, line);
            return;
        }
    }
    else if (lastEleType === 'text') {
        if (lastEleId === nextEleId || (typeof lastEleStyle === 'undefined' && typeof nextEleStyle === 'undefined')) {
            const firstChar = nextEle.innerText.substring(0, 1);
            lastEle.innerText += firstChar;
            if (line.offsetWidth > maxWidth) {
                lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
                line.autoWidth();
                return;
            }
            else {
                nextEle.innerText = nextEle.innerText.substring(1);
                fillUpLine(editor, line);
                line.autoWidth();
                return;
            }
        }
        else {
            nEleAppend();
            return;
        }
    }
    else if (lastEleType === 'unit-block') {
        nEleAppend();
        return;
    }
}

function appendUpLine(editor: Editor, line: ParagraphLine) {
    const paragraph = line.getParagraph();
    const maxWidth = paragraph.getInfo().innerWidth;

    line.fitContent();
    if (line.offsetWidth <= maxWidth) {
        line.autoWidth();
        return;
    }

    const lastEle: Inlineblock = ct(line.lastElementChild);
    if (!lastEle) return;
    let suitableLine: ParagraphLine = ct(findSuitableStartLine(ct(line.nextElementSibling)));
    let foundSuitableLine = true;
    if (!suitableLine) {
        suitableLine = creEle(editor, 'paragraph-line');
        paragraph.appendChild(suitableLine);
        foundSuitableLine = false;
    }

    const lastEleType = getType(lastEle);

    const nEleAppend = () => {
        const c = lastEle.innerText.substring(lastEle.innerText.length - 1);
        lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
        const ntext = creEle(editor, 'text');
        ntext.innerText = c;
        suitableLine.appendChild(ntext);
        ntext.setStyle(lastEle.getStyle());
        ntext.setEleUniId(lastEle.getEleUniId());

        if (lastEle.innerText === '') line.removeChild(lastEle);
    }


    if (lastEleType === 'unit-block') {
        line.removeChild(lastEle);
        suitableLine.insertBefore(lastEle, suitableLine.firstElementChild);
        appendUpLine(editor, line);
        return;
    }
    else if (!foundSuitableLine) {
        nEleAppend();
        appendUpLine(editor, line);
        return;
    }
    else {
        const nextEle: Inlineblock = ct(suitableLine.firstElementChild);
        const nextEleType = getType(nextEle);
        const lastEleId = lastEle.getEleUniId();
        const nextEleId = nextEle.getEleUniId();
        const lastEleStyle = lastEle.getStyle();
        const nextEleStyle = nextEle.getStyle();

        if (nextEleType === 'text' && (lastEleId === nextEleId || (typeof lastEleStyle === 'undefined' && typeof nextEleStyle === 'undefined'))) {
            const c = lastEle.innerText.substring(lastEle.innerText.length - 1);
            lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
            nextEle.innerText = c + nextEle.innerText;

            if (lastEle.innerText === '') line.removeChild(lastEle);

            appendUpLine(editor, line);
            return;
        }
        else {
            nEleAppend();
            appendUpLine(editor, line);
            return;
        }
    }
}

function isEmptyEle(ele: Inlineblock) {
    return getType(ele) === 'text' && ele.innerText === '';
}

function updateNextStart(ele: ParagraphContext, nextstart: number): number {
    ele.setElementStart(nextstart);
    return nextstart + getEleLen(ele);
}

function getEleLen(ele: ParagraphContext): number {
    switch (getType(ele)) {
        case 'text': {
            return ele.innerText.length;
        }
        case 'unit-block': {
            return ct<UnitBlock>(ele).getUnitblockOffset();
        }
        case 'paragraph-line': {
            let next = ele.firstElementChild;
            let ans = 0
            while (next) {
                ans += getEleLen(ct(next));
                next = next.nextElementSibling;
            }
            return ans;
        }
    }
    throw new Error();
}