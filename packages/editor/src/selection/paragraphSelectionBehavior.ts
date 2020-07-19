import { DragState, Utils } from "utils";
import { SetSelectionResult } from "editor-core";
import { getNodeFromChild, getType, paragraphProps } from "../utils";
import { Constants } from "../Constants";
import { Node } from 'editor-core';

export function paragraphSelectionBehavior(node: Node, e: DragState) {
    const ans: SetSelectionResult = {
        pointType: 'end',
        offset: 0
    };

    const srcElement = <HTMLElement>getNodeFromChild(<HTMLElement>e.event?.target);

    if (e.pressed && !e.registered) {
        ans.pointType = 'start'
    }
    const offset = getMouseOffsetInElement(srcElement, <MouseEvent>e.event);
    if (typeof offset === 'undefined') {
        return undefined;
    }
    ans.offset = offset;
    return ans;
}


function getMouseOffsetInElement(node: HTMLElement, mouseEvent: MouseEvent): number | undefined {
    switch (getType(node)) {
        case 'text': return getOffsetInText(node, mouseEvent);
        case 'unit-block': return getOffsetInUnitBlock(node, mouseEvent);
    }
    return undefined;
}

function getOffsetInText(textNode: HTMLElement, mouseEvent: MouseEvent) {
    const mousePosi = Utils.getMousePositionInElement(textNode, mouseEvent);
    const accuracyWidth = Utils.getStrPx(Constants.WIDTH_BASE_CHAR, textNode).width;
    let critical = textNode.innerText.length / 2 + 1;
    while (true) {
        let text = textNode.innerText.substring(0, critical);
        let textLen = Utils.getStrPx(text, textNode).width;
        let accuracy = Math.abs(mousePosi.left - textLen);
        if (accuracy < accuracyWidth) {
            let nextText;
            let nextTextLen;
            let nextAccuracy;
            let nextCritical;
            while (true) {
                if (mousePosi.left > textLen) {
                    nextCritical = critical + 1;
                } else {
                    nextCritical = critical - 1;
                }
                nextText = textNode.innerText.substring(0, nextCritical);
                nextTextLen = Utils.getStrPx(nextText, textNode).width;
                nextAccuracy = Math.abs(mousePosi.left - nextTextLen);
                if (nextAccuracy >= accuracy) {
                    break;
                } else {
                    text = nextText;
                    textLen = nextTextLen;
                    accuracy = nextAccuracy;
                    critical = nextCritical;
                }
            }

            return text.length + paragraphProps.getElementStart(textNode);
        }
        if (textLen > mousePosi.left) {
            critical -= critical / 2 + 1;
            continue;
        }
        if (textLen < mousePosi.left) {
            critical += critical / 2 + 1;
            continue;
        }
    }
}

function getOffsetInUnitBlock(blockNode: HTMLElement, mouseEvent: MouseEvent) {
    const mousePosi = Utils.getMousePositionInElement(blockNode, mouseEvent);
    const unitBlockInfo = Utils.getElementInfo(blockNode);
    let offset = 0;
    if (mousePosi.left > unitBlockInfo.width / 2) {
        offset = 1;
    }
    const { type, value } = paragraphProps.getUnitBlockType(blockNode);

    if (offset === 0) return paragraphProps.getElementStart(blockNode);

    return type.length + value.length + 6 + paragraphProps.getElementStart(blockNode);
}