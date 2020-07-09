import { Editor } from "./Editor";
import { DragState, Utils } from "utils";
import { getType, getUnitBlockFromChild, getImageBlockFromChild } from "./utils";
import { Constants } from "./Constants";

export interface Point {
    offset: number;
    node: HTMLElement;
}
export class Selection {
    start: Point | undefined;
    end: Point | undefined;

    get leftAndRight(): { left: Point, right: Point } {
        if (!this.end || !this.start) throw new Error();
        let left = this.end;
        let right = this.start;
        const relative = selection.relativePostionStartEnd;
        if (relative === 'OVERLAPPING' && this.end.offset > this.start.offset) {
            left = this.start;
            right = this.end;
        } else if (relative === 'START_IN_LEFT') {
            left = this.start;
            right = this.end;
        }
        return {
            left: left,
            right: right
        };
    }

    get isCollapsed(): boolean {
        return this.start?.node === this.end?.node
            && this.start?.offset === this.end?.offset;
    }

    get startSecondParent() {
        return Utils.getRefStageNode(this.start?.node, this.ancestor, 1, node => node?.parentElement);
    }

    get endSecondParent() {
        return Utils.getRefStageNode(this.end?.node, this.ancestor, 1, node => node?.parentElement);
    }

    get relativePostionStartEnd(): "START_IN_RIGHT" | "START_IN_LEFT" | "OVERLAPPING" {
        let startSecondParent = this.startSecondParent;
        let endSecondParent = this.endSecondParent;
        if (startSecondParent === endSecondParent) return 'OVERLAPPING';
        while (startSecondParent?.nextElementSibling) {
            startSecondParent = <HTMLElement>startSecondParent.nextElementSibling
            if (startSecondParent === endSecondParent) {
                return 'START_IN_LEFT';
            }
        }
        return 'START_IN_RIGHT';
    }

    get ancestor(): HTMLElement | undefined {
        return Utils.getCommonAncestor(this.start?.node, this.end?.node, node => node?.parentElement)
    }
}

let selection: Selection;
export function listenUserChangeSelection(editor: Editor) {
    Utils.addEventListener('drag', editor.viewLines, (e: DragState) => {
        if (!e.event?.target) return;


        const srcElement = <HTMLElement>e.event.target;

        if (e.pressed === true && e.registered === false) {
            selection = new Selection();
        }

        switch (getType(srcElement)) {
            case 'text':
                setSelectionForText(editor, selection, e, srcElement);
                break;
            case 'paragraph-line':
                setSelectionForParagraphLine(editor, selection, e, srcElement);
                break;
            case 'content-container':
                setSelectionForContentContainer(editor, selection, e, srcElement);
                break;
        }

        const unitBlock = getUnitBlockFromChild(srcElement);
        if (unitBlock) {
            setSelectionForBlock(editor, selection, e, unitBlock);
        }

        const imageBlock = getImageBlockFromChild(srcElement);
        if (imageBlock) {
            setSelectionForBlock(editor, selection, e, imageBlock);
        }
    })
}

function setSelection(editor: Editor, selection: Selection, e: DragState, offset: number, node: HTMLElement) {
    if (e.pressed && e.registered === false) {
        selection.start = { offset: offset, node: node }
    } else if (!Utils.isUndfined(selection)) {
        selection.end = { offset: offset, node: node }
        editor.selection = selection;
        console.log(selection);
        editor.eventManager.triggleEvent(Constants.events.SELECTION_CHANGE);
    }
}

function setSelectionForText(editor: Editor, selection: Selection, e: DragState, textNode: HTMLElement) {
    const mousePosi = Utils.getMousePositionInElement(textNode, <MouseEvent>e.event);
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

            setSelection(editor, selection, e, text.length, textNode);
            break;
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

function setSelectionForBlock(editor: Editor, selection: Selection, e: DragState, blockNode: HTMLElement) {
    const mousePosi = Utils.getMousePositionInElement(blockNode, <MouseEvent>e.event);
    const unitBlockInfo = Utils.getElementInfo(blockNode);
    let offset = 0;
    if (mousePosi.left > unitBlockInfo.width / 2) {
        offset = 1;
    }
    setSelection(editor, selection, e, offset, blockNode);
}

function setSelectionForParagraphLine(editor: Editor, selection: Selection, e: DragState, paragraphLine: HTMLElement) {
    const latestElement = <HTMLElement>paragraphLine.lastElementChild;
    switch (getType(latestElement)) {
        case 'text': {
            const text = latestElement.innerText;
            setSelection(editor, selection, e, text.length, latestElement);
            break;
        }
        case 'unit-block': {
            setSelectionForBlock(editor, selection, e, latestElement);
            break;
        }
    }
}

function setSelectionForContentContainer(editor: Editor, selection: Selection, e: DragState, container: HTMLElement) {
    if (container.childElementCount !== 1) {
        throw new Error('错误的 content-container 数量');
    }
    const innerElement = <HTMLElement>container.firstElementChild;
    switch (getType(innerElement)) {
        case 'image':
            setSelectionForBlock(editor, selection, e, innerElement);
            break;
    }
}