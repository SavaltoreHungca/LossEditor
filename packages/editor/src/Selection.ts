import { Editor } from "./Editor";
import { DragState, Utils } from "utils";
import { isTextNode, isViewLines } from "./utils";
import { Constants } from "./Constants";
import { runInThisContext } from "vm";

export interface Point {
    offset: number;
    node: HTMLElement;
}
export class Selection {
    start: Point | undefined;
    end: Point | undefined;
    private _ancestor: HTMLElement | undefined;
    private _startSecondParent: HTMLElement | "NOT_EXIST" | undefined; // 位于 ancestor 下的第二级节点
    private _endSecondParent: HTMLElement | "NOT_EXIST" | undefined; // 位于 ancestor 下的第二级节点
    private _relativePostionStartEnd: "START_IN_RIGHT" | "START_IN_LEFT" | "OVERLAPPING" | "START_IS_PARENT" | "END_IS_PARENT" | undefined; // start 是否位于 ancestor 的左边
    private _middleElements: Array<HTMLElement> | undefined;


    get isCollapsed(): boolean {
        return this.start?.node === this.end?.node
            && this.start?.offset === this.end?.offset;
    }

    get startSecondParent() {
        if (this._startSecondParent) return this._startSecondParent;
        this._ancestor = this.ancestor;
        return this._startSecondParent;
    }

    get endSecondParent() {
        if (this._endSecondParent) return this._endSecondParent;
        this._ancestor = this.ancestor;
        return this._endSecondParent;
    }

    get relativePostionStartEnd() {
        if (this._relativePostionStartEnd) return this._relativePostionStartEnd;
        this._ancestor = this.ancestor;
        return this._relativePostionStartEnd;
    }

    get ancestor(): HTMLElement | undefined {
        if (this._ancestor) return this._ancestor;
        if (typeof this.start === 'undefined' || typeof this.end === 'undefined') return;
        if (this.start.node === this.end.node) {
            this._relativePostionStartEnd = "OVERLAPPING";
            this._startSecondParent = "NOT_EXIST";
            this._endSecondParent = "NOT_EXIST";
            this._ancestor = this.start.node;
            return this._ancestor;
        }
        if (this.end.node.parentElement && this.start.node === this.end.node.parentElement) {
            this._relativePostionStartEnd = "START_IS_PARENT";
            this._startSecondParent = "NOT_EXIST";
            this._endSecondParent = this.end.node;
            this._ancestor = this.start.node;
            return this._ancestor;
        }
        if (this.start.node.parentElement && this.start.node.parentElement === this.end.node) {
            this._relativePostionStartEnd = "END_IS_PARENT";
            this._startSecondParent = this.start.node;
            this._endSecondParent = "NOT_EXIST";
            this._ancestor = this.end.node;
            return this._ancestor;
        }
        const startParents = [];
        const endParents = [];
        let parent: HTMLElement | null = this.start.node;
        while (true) {
            if (parent) {
                startParents.push(parent);
                if (isViewLines(parent)) {
                    break;
                }
                parent = parent.parentElement;
            } else {
                break;
            }
        }

        parent = this.end.node;
        while (true) {
            if (parent) {
                endParents.push(parent);
                for (let startParent of startParents) {
                    if (parent === startParent) {
                        this._ancestor = parent;
                        break;
                    }
                }
                if (this._ancestor) break;
                parent = parent.parentElement;
            } else {
                break;
            }
        }

        while (Utils.statckPeek(startParents) !== this._ancestor) {
            startParents.pop();
        }

        while (Utils.statckPeek(endParents) !== this._ancestor) {
            endParents.pop();
        }

        this._startSecondParent = startParents[startParents.length - 2];
        this._endSecondParent = endParents[endParents.length - 2];
        let nextElementSibling = this._startSecondParent.nextElementSibling;
        this._relativePostionStartEnd = "START_IN_RIGHT";
        while (nextElementSibling) {
            if (nextElementSibling === this._endSecondParent) {
                this._relativePostionStartEnd = "START_IN_LEFT";
                break;
            }
            nextElementSibling = nextElementSibling.nextElementSibling;
        }
        return this._ancestor;
    }

    get middleElements(): Array<HTMLElement> | undefined {
        if (this._middleElements) return this._middleElements;
        if (typeof this.ancestor === 'undefined') return;
        let right;
        let left;
        if (this.relativePostionStartEnd === "START_IN_LEFT") {
            left = this.start?.node;
            right = this.end?.node;
        } else if (this.relativePostionStartEnd === "START_IN_RIGHT") {
            right = this.start?.node;
            left = this.end?.node;
        } else {
            return;
        }

        return;
    }
}

let selection: Selection;
export function listenUserChangeSelection(editor: Editor) {
    Utils.addEventListener('drag', editor.viewLines, (e: DragState) => {
        console.log(e.event?.target);
        if (e.event?.target) {
            const srcElement = <HTMLElement>e.event.target;

            if (e.pressed === true && e.registered === false)
                selection = new Selection();

            if (isTextNode(srcElement)) {
                const mousePosi = Utils.getMousePositionInElement(srcElement, <MouseEvent>e.event);
                const accuracyWidth = Utils.getStrPx(Constants.WIDTH_BASE_CHAR, srcElement).width;
                let critical = srcElement.innerText.length / 2 + 1;
                while (true) {
                    let text = srcElement.innerText.substring(0, critical);
                    let textLen = Utils.getStrPx(text, srcElement).width;
                    let accuracy = Math.abs(mousePosi.left - textLen);
                    if (accuracy < accuracyWidth) {
                        let nextText;
                        let nextTextLen;
                        let nextAccuracy;
                        let nextCritical;
                        while(true){
                            if(mousePosi.left > textLen){
                                nextCritical = critical + 1;
                            }else{
                                nextCritical =  critical - 1;
                            }
                            nextText = srcElement.innerText.substring(0, nextCritical);
                            nextTextLen = Utils.getStrPx(nextText, srcElement).width;
                            nextAccuracy = Math.abs(mousePosi.left - nextTextLen);
                            if(nextAccuracy >= accuracy){
                                break;
                            }else{
                                text = nextText;
                                textLen = nextTextLen;
                                accuracy = nextAccuracy;
                                critical = nextCritical;
                            }
                        }
                        
                        if (e.pressed && e.registered === false) {
                            selection.start = { offset: text.length, node: srcElement }
                        } else if (!Utils.isUndfined(selection)) {
                            selection.end = { offset: text.length, node: srcElement }
                            editor.selection = selection;
                            editor.eventManager.triggleEvent(Constants.events.SELECTION_CHANGE);
                        }
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
        }
    })
}