import { Editor } from './Editor';
import { Constants } from './Constants';
import { Utils } from 'utils';
import { getType } from './utils';
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
            case 'paragraph-line': {
                const { left, right } = selection.leftAndRight;

                const leftPosi = Utils.getRelativePosition(left.node, editor.viewLines);
                const rightPosi = Utils.getRelativePosition(right.node, editor.viewLines);
                const linePosi = Utils.getRelativePosition(ancestor, editor.viewLines);
                const leftPointSelectWidth = getPointSelectedWidth(left);
                const rightPointSelectWidth = getPointSelectedWidth(right);

                const region = document.createElement('div');
                editor.regionContainer.innerHTML = '';
                editor.regionContainer.appendChild(region);

                Utils.setStyle(region, {
                    position: 'absolute',
                    display: 'block',
                    background: '#add6ff',
                    left: leftPosi.left + leftPointSelectWidth,
                    top: linePosi.top,
                    width: Math.abs((leftPosi.left + leftPointSelectWidth) - (rightPosi.left + rightPointSelectWidth)),
                    height: ancestor.offsetHeight,
                    'border-radius': '3px 3px 3px 3px',
                    'z-index': '-1'
                });

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
                    const region = document.createElement('div');
                    editor.regionContainer.appendChild(region);
                    const middlePosi = Utils.getRelativePosition(middleLine, editor.viewLines);
                    Utils.setStyle(region, {
                        position: 'absolute',
                        display: 'block',
                        background: '#add6ff',
                        left: middlePosi.left,
                        top: middlePosi.top,
                        width: middleLine.offsetWidth,
                        height: middleLine.offsetHeight,
                        'border-radius': '3px 3px 3px 3px',
                        'z-index': '-1'
                    });
                }

                break;
            }
        }
    });
}

function getPointSelectedWidth(point: Point): number {
    switch (getType(point.node)) {
        case 'unit-block':
            return getUnitBlockSelectedWidth(point);
        case 'text':
            return getTextSelectedWidth(point);
    }
    throw new Error();
}

function getTextSelectedWidth(point: Point): number {
    const node = point.node;
    return Utils.getStrPx(node.innerText.substring(0, point.offset), node).width;
}

function getUnitBlockSelectedWidth(point: Point) {
    const node = point.node;
    if (point.offset === 1) {
        return Utils.getElementInfo(node).width;
    }
    return 0;
}

function setRegionForText() {

}