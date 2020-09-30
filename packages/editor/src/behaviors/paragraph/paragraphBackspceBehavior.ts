import { Editor } from '../../Editor';
import { Selection, Point } from 'editor-core';
import { getType } from '../../utils';
import { ct } from 'utils';
import { DocParagraph } from '../../elements/docs/DocParagraph';
import { Inlineblock } from '../../elements/Inlineblock';
import { ParagraphLine } from '../../elements/ParagraphLine';
import { Paragraph } from '../../elements/Paragraph';
import { NodeParagraph } from '../../elements/nodes/NodeParagraph';

export function paragraphBackspaceFactory(editor: Editor) {
    return (selection: Selection) => {
        const { left, right } = selection.leftAndRight;
        const docParagraph: DocParagraph = ct(editor.uiMap.getElement(left.node));
        const paragraph = docParagraph.getParaUiEle();

        const nodeParagraph: NodeParagraph = ct(left.node);

        const leftLine: ParagraphLine = docParagraph.getLineByOffset(left.offset);

        if (selection.isCollapsed) {
            const p = backspceCollapsed(nodeParagraph, left, leftLine);
            editor.docTree.typesetting(left);

            if(docParagraph.isEmpty()){
                // editor.docTree.
            }

            editor.docTree.changeSelection(p, p);
            return;
        }

        const rightLine: ParagraphLine = docParagraph.getLineByOffset(right.offset);

        let p;
        if (leftLine !== rightLine) {
            p = backspceDiffLine(left, right, leftLine, rightLine);
        } else {
            p = backspaceSameLine(left, right, leftLine);
        }

        nodeParagraph.content.str = nodeParagraph.content.str.substring(0, left.offset)
            + nodeParagraph.content.str.substring(right.offset);

        editor.docTree.typesetting(left);
        editor.docTree.changeSelection(p, p);
    }
}
function backspceCollapsed(nodeParagraph: NodeParagraph, left: Point, leftLine: ParagraphLine): Point {
    const ele: Inlineblock = ct(leftLine.getInlineBlockByOffset(left.offset));
    const eleOffset = left.offset - ele.getElementStart();

    switch (getType(ele)) {
        case 'text': {
            ele.innerText = ele.innerText.substring(0, eleOffset - 1)
                + ele.innerText.substring(eleOffset);
            nodeParagraph.content.str = nodeParagraph.content.str.substring(0, left.offset - 1)
                + nodeParagraph.content.str.substring(left.offset);

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

    const leftEle = leftLine.getInlineBlockByOffset(left.offset);
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


    const rightEle = rightLine.getInlineBlockByOffset(right.offset);
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
    const leftEle = line.getInlineBlockByOffset(left.offset);
    const rightEle = line.getInlineBlockByOffset(right.offset);

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