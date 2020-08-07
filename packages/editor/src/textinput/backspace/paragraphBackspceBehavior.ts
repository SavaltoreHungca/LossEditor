import { Editor } from '../../Editor';
import { Selection, Point } from 'editor-core';
import { binarySearchWhichRange } from '../../selection/cursorposition/paragraphCursorPosition';
import { getType } from '../../utils';
import { TextContent } from '../../render/paragraph';
import { DocParagraph } from '../../elements/docElementTypes';
import { ct } from 'utils';
import { Inlineblock, ParagraphLine, Paragraph } from '../../elements/elementTypes';

export function paragraphBackspaceFactory(editor: Editor) {
    return (selection: Selection) => {
        const { left, right } = selection.leftAndRight;
        const paragraphUi: DocParagraph = ct(editor.uiMap.getElement(left.node));
        const paragraph = paragraphUi.getParaUiEle();

        const textContent = <TextContent>left.node.content;

        const leftLine: ParagraphLine = ct(binarySearchWhichRange(paragraph.children, left.offset));

        if (selection.isCollapsed) {
            const p = backspceCollapsed(textContent, left, leftLine);
            editor.docTree.typesetting(left);
            editor.docTree.changeSelection(p, p);
            return;
        }

        const rightLine: ParagraphLine = ct(binarySearchWhichRange(paragraph.children, right.offset));

        let p;
        if (leftLine !== rightLine) {
            p = backspceDiffLine(left, right, leftLine, rightLine);
        } else {
            p = backspaceSameLine(left, right, leftLine);
        }

        textContent.str = textContent.str.substring(0, left.offset)
            + textContent.str.substring(right.offset);

        editor.docTree.typesetting(left);
        editor.docTree.changeSelection(p, p);
    }
}
function backspceCollapsed(textContent: TextContent, left: Point, leftLine: ParagraphLine): Point {
    const ele: Inlineblock = ct(binarySearchWhichRange(leftLine.children, left.offset));
    const eleOffset = left.offset - ele.getElementStart();

    switch (getType(ele)) {
        case 'text': {
            ele.innerText = ele.innerText.substring(0, eleOffset - 1)
                + ele.innerText.substring(eleOffset);
            textContent.str = textContent.str.substring(0, left.offset - 1)
                + textContent.str.substring(left.offset);

            left.offset -= 1;
            return left;
        }
        case 'unit-block': {
            if (eleOffset > 0) {
                leftLine.removeChild(ele);
                left.offset -= eleOffset;
            }
            return left;
        }
    }
    throw new Error();
}

function backspceDiffLine(left: Point, right: Point, leftLine: ParagraphLine, rightLine: ParagraphLine): Point {
    const paragraph: Paragraph = leftLine.getParagraph();
    while (leftLine.nextElementSibling && leftLine.nextElementSibling !== rightLine) {
        paragraph.removeChild(leftLine.nextElementSibling);
    }

    const leftEle = binarySearchWhichRange(leftLine.children, left.offset);
    while (leftEle.nextElementSibling) {
        leftLine.removeChild(leftEle.nextElementSibling);
    }

    switch (getType(leftEle)) {
        case 'text': {
            let innerText = leftEle.innerText;
            innerText = innerText.substring(0,
                left.offset - leftEle.getElementStart());
            if (innerText === '') {
                leftLine.removeChild(leftEle);
            } else {
                leftEle.innerText = innerText;
            }
            break;
        }
        case 'unit-block': {
            const blockoffset = left.offset - leftEle.getElementStart();
            if (blockoffset === 0) {
                leftLine.removeChild(leftEle);
            }
            break;
        }
    }


    const rightEle = binarySearchWhichRange(rightLine.children, right.offset);
    while (rightEle.previousElementSibling) {
        rightLine.removeChild(rightEle.previousElementSibling);
    }

    switch (getType(rightEle)) {
        case 'text': {
            let innerText = rightEle.innerText;
            innerText = innerText.substring(right.offset - rightEle.getElementStart());
            if (innerText === '') {
                rightLine.removeChild(rightEle);
            } else {
                rightEle.innerText = innerText;
            }
            break;
        }
        case 'unit-block': {
            const blockoffset = right.offset - rightEle.getElementStart();
            if (blockoffset > 0) {
                rightLine.removeChild(rightEle);
            }
            break;
        }
    }
    return left;
}

function backspaceSameLine(left: Point, right: Point, line: ParagraphLine): Point {
    const leftEle = binarySearchWhichRange(line.children, left.offset);
    const rightEle = binarySearchWhichRange(line.children, right.offset);

    if (leftEle !== rightEle) {
        while (leftEle.nextElementSibling && leftEle.nextElementSibling !== rightEle) {
            line.removeChild(leftEle.nextElementSibling);
        }

        switch (getType(leftEle)) {
            case 'text': {
                let innerText = leftEle.innerText;
                innerText = innerText.substring(0,
                    left.offset - leftEle.getElementStart());
                if (innerText === '') {
                    line.removeChild(leftEle);
                } else {
                    leftEle.innerText = innerText;
                }
                break;
            }
            case 'unit-block': {
                const blockoffset = left.offset - leftEle.getElementStart();
                if (blockoffset === 0) {
                    line.removeChild(leftEle);
                }
                break;
            }
        }

        switch (getType(rightEle)) {
            case 'text': {
                let innerText = rightEle.innerText;
                innerText = innerText.substring(right.offset - rightEle.getElementStart());
                if (innerText === '') {
                    line.removeChild(rightEle);
                } else {
                    rightEle.innerText = innerText;
                }
                break;
            }
            case 'unit-block': {
                const blockoffset = right.offset - rightEle.getElementStart();
                if (blockoffset > 0) {
                    line.removeChild(rightEle);
                }
                break;
            }
        }

    } else {
        switch (getType(leftEle)) {
            case 'text': {
                leftEle.innerText = leftEle.innerText.substring(0, left.offset - leftEle.getElementStart())
                    + leftEle.innerText.substring(right.offset - leftEle.getElementStart());
                if (leftEle.innerText === '') {
                    line.removeChild(leftEle);
                }
                break;
            }
            case 'unit-block': {
                if (left.offset !== right.offset) {
                    line.removeChild(leftEle);
                }
                break;
            }
        }
    }
    return left;
}