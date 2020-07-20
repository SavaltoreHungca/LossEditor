import { Editor } from '../../Editor';
import { Constants } from '../../Constants';
import { Utils } from 'utils';
import { getType } from '../../utils';
import { Point } from './Selection';

// #e5ebf1
export function listenSelectionChangeToSetSelectedRegion(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.SELECTION_CHANGE, () => {
        const selection = editor.selection;
        if (!selection) return;
        if (selection.isCollapsed) return;

        const endPoint = selection.end;
        const startPoint = selection.start;
        const ancestor = selection.ancestor;
        if (!endPoint || !startPoint || !ancestor) throw new Error();

        switch (getType(ancestor)) {
            case 'text':
            case 'unit-block':
            case 'image':
            case 'paragraph-line': {
                const { left, right } = selection.leftAndRight;

                const linePosi = Utils.getRelativePosition(ancestor, editor.viewLines);
                const leftInfo = getPointInfo(left, editor.viewLines);
                const rightInfo = getPointInfo(right, editor.viewLines);
                appendRegion(editor.regionContainer,
                    leftInfo.selectedRightBorderLeft,
                    linePosi.top,
                    Math.abs(leftInfo.selectedRightBorderLeft - rightInfo.selectedRightBorderLeft),
                    ancestor.offsetHeight,
                    true)

                break;
            }
            case 'paragraph': {
                editor.regionContainer.innerHTML = '';

                const { left, right } = selection.leftAndRight;
                const leftLine = left.node.parentElement;
                const rightLine = right.node.parentElement;
                
                let middleLine = leftLine;
                while (middleLine?.nextElementSibling !== rightLine) {
                    middleLine = <HTMLElement>middleLine?.nextElementSibling;
                    const middlePosi = Utils.getRelativePosition(middleLine, editor.viewLines);
                    appendRegion(editor.regionContainer,
                        middlePosi.left,
                        middlePosi.top,
                        middleLine.offsetWidth,
                        middleLine.offsetHeight)
                }

                if (!leftLine || !rightLine) throw new Error();

                const leftLinePosi = Utils.getRelativePosition(leftLine, editor.viewLines);
                const rightLinePosi = Utils.getRelativePosition(rightLine, editor.viewLines);

                const leftInfo = getPointInfo(left, editor.viewLines);
                const rightInfo = getPointInfo(right, editor.viewLines);
                appendRegion(editor.regionContainer,
                    leftInfo.selectedRightBorderLeft,
                    leftLinePosi.top,
                    leftLinePosi.rightBoderLeft - leftInfo.selectedRightBorderLeft,
                    leftLine.offsetHeight)
                
                appendRegion(editor.regionContainer,
                    rightLinePosi.left,
                    rightLinePosi.top,
                    rightInfo.selectedRightBorderLeft - rightLinePosi.left,
                    rightLine.offsetHeight)

                break;
            }
            case 'view-lines': {
                
            }
        }
    });
}

function getPointInfo(point: Point, container: HTMLElement) {
    const posi = Utils.getRelativePosition(point.node, container);
    const selectedWidth = getPointSelectedWidth(point);
    return {
        ...posi,
        selectedWidth: selectedWidth,
        selectedRightBorderLeft: posi.left + selectedWidth
    }
}

function getPointSelectedWidth(point: Point): number {
    switch (getType(point.node)) {
        case 'paragraph-line':
        case 'image':
        case 'unit-block':
            return getBlockSelectedWidth(point);
        case 'text':
            return getTextSelectedWidth(point);
    }
    throw new Error();
}

function getTextSelectedWidth(point: Point): number {
    const node = point.node;
    return Utils.getStrPx(node.innerText.substring(0, point.offset), node).width;
}

function getBlockSelectedWidth(point: Point) {
    const node = point.node;
    if (point.offset === 1) {
        return Utils.getElementInfo(node).width;
    }
    return 0;
}

function appendRegion(container: HTMLElement, left: number, top: number, width: number, height: number, clearContainer?: boolean) {
    if (clearContainer) container.innerHTML = '';

    const region = document.createElement('div');
    container.appendChild(region);
    Utils.setStyle(region, {
        position: 'absolute',
        display: 'block',
        background: '#add6ff',
        left: left,
        top: top,
        width: width,
        height: height,
        'border-radius': '3px 3px 3px 3px',
        'z-index': '-1'
    });
}