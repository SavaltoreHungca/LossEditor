import { paragraphProps, getType, props, createElement } from './../utils';
import { Editor } from '../Editor';
import { Point } from 'editor-core';
import { binarySearchWhichRange } from '../selection/cursorposition/paragraphCursorPosition';
import { Utils } from 'utils';

export function paragraphTypesettingFactory(editor: Editor) {
    return (point: Point) => {
        const paragraphUi = editor.uiMap.getElement(point.node);
        const paragraph = paragraphUi.children[0].children[0].children[0];
        let line: HTMLElement | null | undefined = binarySearchWhichRange(paragraph.children, point.offset);
        if (line?.previousElementSibling) line = <HTMLElement>line.previousElementSibling;
        line = findSuitableStartLine(line);

        if (!line) return;

        let ele = <HTMLElement>line.firstElementChild;
        let nextstart = paragraphProps.getElementStart(ele);
        while (line) {
            ele = <HTMLElement>line.firstElementChild;
            while (ele) {
                const next = ele.nextElementSibling;
                if (isEmptyEle(ele)) {
                    line.removeChild(ele);
                }
                ele = <HTMLElement>next;
            }

            ele = <HTMLElement>line.firstElementChild;
            if (ele) {
                isLineExceed(line) ? appendUpLine(line) : fillUpLine(line);
                while (ele) {
                    nextstart = updateNextStart(ele, nextstart);
                    ele = <HTMLElement>ele.nextElementSibling;
                }
            }

            const next = line.nextElementSibling;

            if (!line.firstElementChild) {
                paragraph.removeChild(line);
            } else {
                paragraphProps.setElementStart(line,
                    paragraphProps.getElementStart(<HTMLElement>line.firstElementChild));
            }
            line = <HTMLElement>next;
        }
    }
}

function findSuitableStartLine(line: HTMLElement): HTMLElement | undefined {
    if (!line) return undefined;

    const paragraph = <HTMLElement>line.parentElement;
    let ele = <HTMLElement>line.firstElementChild;
    if (!ele) {
        let next = <HTMLElement>line.nextElementSibling;
        paragraph.removeChild(line)
        return findSuitableStartLine(next);
    }
    else if (isEmptyEle(ele)) {
        while (ele && isEmptyEle(ele)) {
            let next = ele.nextElementSibling;
            line.removeChild(ele);
            ele = <HTMLElement>next;
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

function isLineExceed(line: HTMLElement): boolean {
    const paragraph = <HTMLElement>line.parentElement;
    const maxWidth = Utils.getElementInfo(paragraph).innerWidth;
    Utils.setStyle(line, { width: 'fit-content' });
    const exceed = line.offsetWidth > maxWidth;
    Utils.setStyle(line, { width: 'auto' });
    return exceed;
}

function fillUpLine(line: HTMLElement) {
    const paragraph = <HTMLElement>line.parentElement;
    const maxWidth = Utils.getElementInfo(paragraph).innerWidth;
    const lastEle = <HTMLElement>line.lastElementChild;
    if (!lastEle) return;
    const suitableLine = findSuitableStartLine(<HTMLElement>line.nextElementSibling);
    if (!suitableLine) return;
    const nextEle = <HTMLElement>suitableLine.firstElementChild;

    const lastEleType = getType(lastEle);
    const nextEleType = getType(nextEle);


    const nEleAppend = () => {
        const nEle = createElement('text');
        paragraphProps.setEleUniId(nEle, nextEleId);
        props.setStyle(nEle, nextEleStyle);
        line.appendChild(nEle);

        const firstChar = nextEle.innerText.substring(0, 1);
        nEle.innerText += firstChar;
        if (line.offsetWidth > maxWidth) {
            line.removeChild(nEle);
            Utils.setStyle(line, { width: 'auto' });
            return;
        }
        else {
            nextEle.innerText = nextEle.innerText.substring(1);
            Utils.setStyle(line, { width: 'auto' });
            fillUpLine(line);
            return;
        }
    }

    Utils.setStyle(line, { width: 'fit-content' });
    const lastEleId = paragraphProps.getEleUniId(lastEle);
    const nextEleId = paragraphProps.getEleUniId(nextEle);
    const lastEleStyle = props.getStyle(lastEle);
    const nextEleStyle = props.getStyle(nextEle);

    if (nextEleType === 'unit-block') {
        suitableLine.removeChild(nextEle);
        line.appendChild(nextEle);
        if (line.offsetWidth > maxWidth) {
            line.removeChild(nextEle);
            suitableLine.insertBefore(nextEle, suitableLine.firstElementChild);
            Utils.setStyle(line, { width: 'auto' });
            return;
        }
        else {
            Utils.setStyle(line, { width: 'auto' });
            fillUpLine(line);
            return;
        }
    }
    else if (lastEleType === 'text') {
        if (lastEleId === nextEleId || (typeof lastEleStyle === 'undefined' && typeof nextEleStyle === 'undefined')) {
            const firstChar = nextEle.innerText.substring(0, 1);
            lastEle.innerText += firstChar;
            if (line.offsetWidth > maxWidth) {
                lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
                Utils.setStyle(line, { width: 'auto' });
                return;
            }
            else {
                nextEle.innerText = nextEle.innerText.substring(1);
                fillUpLine(line);
                Utils.setStyle(line, { width: 'auto' });
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

function appendUpLine(line: HTMLElement) {
    const paragraph = <HTMLElement>line.parentElement;
    const maxWidth = Utils.getElementInfo(paragraph).innerWidth;

    Utils.setStyle(line, { width: 'fit-content' });
    if (line.offsetWidth <= maxWidth) {
        Utils.setStyle(line, { width: 'auto' });
        return;
    }

    const lastEle = <HTMLElement>line.lastElementChild;
    if (!lastEle) return;
    let suitableLine = findSuitableStartLine(<HTMLElement>line.nextElementSibling);
    let foundSuitableLine = true;
    if (!suitableLine) {
        suitableLine = createElement('paragraph-line');
        paragraph.appendChild(suitableLine);
        foundSuitableLine = false;
    }

    const lastEleType = getType(lastEle);

    const nEleAppend = () => {
        const c = lastEle.innerText.substring(lastEle.innerText.length - 1);
        lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
        const ntext = createElement('text');
        ntext.innerText = c;
        (<HTMLElement>suitableLine).appendChild(ntext);
        props.setStyle(ntext, props.getStyle(lastEle));
        paragraphProps.setEleUniId(ntext, paragraphProps.getEleUniId(lastEle));

        if (lastEle.innerText === '') line.removeChild(lastEle);
    }


    if (lastEleType === 'unit-block') {
        line.removeChild(lastEle);
        suitableLine.insertBefore(lastEle, suitableLine.firstElementChild);
        appendUpLine(line);
        return;
    }
    else if (!foundSuitableLine) {
        nEleAppend();
        appendUpLine(line);
        return;
    }
    else {
        const nextEle = <HTMLElement>suitableLine.firstElementChild;
        const nextEleType = getType(nextEle);
        const lastEleId = paragraphProps.getEleUniId(lastEle);
        const nextEleId = paragraphProps.getEleUniId(nextEle);
        const lastEleStyle = props.getStyle(lastEle);
        const nextEleStyle = props.getStyle(nextEle);

        if (nextEleType === 'text' && (lastEleId === nextEleId || (typeof lastEleStyle === 'undefined' && typeof nextEleStyle === 'undefined'))) {
            const c = lastEle.innerText.substring(lastEle.innerText.length - 1);
            lastEle.innerText = lastEle.innerText.substring(0, lastEle.innerText.length - 1);
            nextEle.innerText = c + nextEle.innerText;

            if (lastEle.innerText === '') line.removeChild(lastEle);

            appendUpLine(line);
            return;
        }
        else {
            nEleAppend();
            appendUpLine(line);
            return;
        }
    }
}

function isEmptyEle(ele: HTMLElement) {
    return getType(ele) === 'text' && ele.innerText === '';
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