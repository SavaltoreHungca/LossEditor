import { Editor } from '../../Editor';
import { DragState, $$, ct } from "utils";
import { getNodeFromChild, getType } from "../../utils";
import { Constants } from "../../Constants";
import { Node } from 'editor-core';
import { ParagraphContext } from '../../elements/ParagraphContext';
import { Text } from '../../elements/Text';
import { UnitBlock } from '../../elements/UnitBlock';
import { SetSelectionResult } from "../../behaviorTypes";

// 设置 Selection 的行为
export function paragraphSelectionBehaviorFactory(editor: Editor) {
    
    return (node: Node)=>{
        const e = editor.whenClick;

        const ans: SetSelectionResult = {
            pointType: 'end',
            offset: 0
        };
    
        const srcElement: ParagraphContext = ct(getNodeFromChild(ct(e.event?.target)));

        const offset = getMouseOffsetInElement(srcElement, <MouseEvent>e.event);
        if (typeof offset === 'undefined') {
            return undefined;
        }

        if (e.pressed && !e.registered) {
            ans.pointType = 'start'
        }else{
            editor.whenClick.clickdInlineEle = ct(srcElement);
        }

        ans.offset = offset;
        return ans;
    }
}


function getMouseOffsetInElement(node: ParagraphContext, mouseEvent: MouseEvent): number | undefined {
    switch (getType(node)) {
        case 'text': return getOffsetInText(ct(node), mouseEvent);
        case 'unit-block': return getOffsetInUnitBlock(ct(node), mouseEvent);
    }
    return undefined;
}

function getOffsetInText(textNode: Text, mouseEvent: MouseEvent) {
    const mousePosi = $$.getMousePositionInElement(textNode, mouseEvent);
    const accuracyWidth = $$.getStrPx(Constants.WIDTH_BASE_CHAR, textNode).width;
    let critical = textNode.innerText.length / 2 + 1;
    while (true) {
        let text = textNode.innerText.substring(0, critical);
        let textLen = $$.getStrPx(text, textNode).width;
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
                nextTextLen = $$.getStrPx(nextText, textNode).width;
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

            return text.length + textNode.getElementStart();
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

function getOffsetInUnitBlock(blockNode: UnitBlock, mouseEvent: MouseEvent) {
    const mousePosi = $$.getMousePositionInElement(blockNode, mouseEvent);
    const unitBlockInfo = $$.getElementInfo(blockNode);
    let offset = 0;
    if (mousePosi.left > unitBlockInfo.width / 2) {
        offset = 1;
    }

    if (offset === 0) return blockNode.getElementStart();

    return blockNode.getUnitblockOffset() + blockNode.getElementStart();
}