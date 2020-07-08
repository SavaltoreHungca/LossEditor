import uuid from 'uuid';

export interface DragState {
    startX: number;
    startY: number;
    pressed: boolean;
    registered: boolean;
    deltaX: number;
    deltaY: number;
    event?: Event
}

export interface ElementInfo {
    width: number;
    height: number;
    top: number;
    left: number;
    innerWidth: number;
    innerHeight: number;
    innerTop: number;
    innerLeft: number
}

export class Utils {
    static setStyle(element: HTMLElement, style: Object) {
        if (this.isObject(style)) {
            for (let name in style) {
                switch (name) {
                    case 'top': case 'left': case 'bottom': case 'right': case 'width': case 'height':
                    case 'padding': case 'padding-left': case 'padding-top': case 'padding-right': case 'padding-bottom':
                        if (typeof style[name] === 'number') {
                            style[name] = style[name] + 'px';
                        }
                        break;
                }
            }
        }

        let getCssText = (style: Object) => {
            let ans = "";
            if (!this.isObject(style)) return "";
            for (let name in style) {
                ans += name + ':' + style[name] + ';';
            }
            return ans;
        }

        let getCssStyle = (cssText: String) => {
            if (cssText) {
                let ans = {};
                let styles = cssText.split(';').filter(Boolean);
                for (let style of styles) {
                    let [name, value] = style.split(':');
                    ans[name] = value;
                }
                return ans;
            }
            return {}
        }

        if (element.style.cssText) {
            let beforeStyle = getCssStyle(element.style.cssText)
            for (let name in style) {
                if (style[name] === "") {
                    delete beforeStyle[name];
                } else {
                    beforeStyle[name] = style[name];
                }
            }
            element.style.cssText = getCssText(beforeStyle);
        } else {
            if (!this.isObject(style)) return;
            element.style.cssText = getCssText(style)
        }
    }

    static getInlineCssStyle(element: HTMLElement) {
        let cssText = element.style.cssText;
        if (cssText) {
            let ans = {};
            let styles = cssText.split(';').filter(Boolean);
            for (let style of styles) {
                let [name, value] = style.split(':');
                ans[name] = value;
            }
            return ans;
        }
    }

    static getElementInfoBatch(consumer: (...info: ElementInfo[]) => void, ...elements: HTMLElement[]) {
        const infos: Array<ElementInfo> = new Array<ElementInfo>();
        for (let elemnt of elements) {
            infos.push(this.getElementInfo(elemnt));
        }
        consumer(...infos);
    }

    static getElementInfo(element: HTMLElement, consumer?: (info: ElementInfo) => void) {
        let ans: ElementInfo = {
            width: element.offsetWidth,
            height: element.offsetHeight,
            top: element.offsetTop,
            left: element.offsetLeft,
            innerWidth: element.offsetWidth,
            innerHeight: element.offsetHeight,
            innerTop: 0,
            innerLeft: 0
        };

        if (element.style.borderLeftWidth) {
            ans.innerWidth -= parseInt(element.style.borderLeftWidth);
        }
        if (element.style.borderRightWidth) {
            ans.innerWidth -= parseInt(element.style.borderRightWidth);
        }
        if (element.style.borderTopWidth) {
            ans.innerHeight -= parseInt(element.style.borderTopWidth);
        }
        if (element.style.borderBottomWidth) {
            ans.innerHeight -= parseInt(element.style.borderBottomWidth);
        }

        if (element.style.paddingLeft) {
            ans.innerWidth -= parseInt(element.style.paddingLeft);
            ans.innerLeft += parseInt(element.style.paddingLeft);
            if (element.style.boxSizing === 'boder-box') {
                ans.innerLeft += parseInt(element.style.borderLeftWidth);
            }
        }
        if (element.style.paddingRight) {
            ans.innerWidth -= parseInt(element.style.paddingRight);
        }
        if (element.style.paddingTop) {
            ans.innerHeight -= parseInt(element.style.paddingTop);
            ans.innerTop += parseInt(element.style.paddingTop);
            if (element.style.boxSizing === 'boder-box') {
                ans.innerTop += parseInt(element.style.borderTopWidth);
            }
        }
        if (element.style.paddingBottom) {
            ans.innerHeight -= parseInt(element.style.paddingBottom);
        }
        if (consumer) {
            consumer(ans);
        }
        return ans;
    }

    static isObject(obj: any) {
        return !this.isUndfined(obj) && !this.isArray(obj) && typeof obj === 'object';
    }

    static isEmptyStr(str: any) {
        return str === "" || this.isUndfined(str);
    }

    static isUndfined(obj: any) {
        return obj === null || typeof obj === 'undefined';
    }

    static isArray(obj: any) {
        return Array.isArray(obj);
    }

    static isFunction(f: any) {
        return typeof f === 'function';
    }

    static in(obj: any, array: any) {
        if (this.isObject(array)) {
            for (let item of array) {
                if (obj === item) {
                    return true;
                }
            }
        }
        return false;
    }
    static get(obj: any, propName: string): any {
        return obj[propName];
    }
    static getMousePositionInElement(elemt: HTMLElement, event: MouseEvent): {
        left: number,
        top: number,
        bottom: number,
        right: number,
        leaved: boolean
    } {
        const { clientX, clientY } = event;
        const eleInfo = this.getElementInfo(elemt);
        const position = elemt.getBoundingClientRect();
        const left = clientX - position.x;
        const top = clientY - position.y;
        const bottom = eleInfo.innerHeight - top;
        const right = eleInfo.innerWidth - left;
        let leaved = left < 0 || top < 0 || bottom < 0 || right < 0;
        return {
            left: left,
            top: top,
            bottom: bottom,
            right: right,
            leaved: leaved
        }
    }
    static getComputedStyle(node: HTMLElement, attr: string) {
        if (typeof getComputedStyle != 'undefined') {
            let value: any = getComputedStyle(node, null).getPropertyValue(attr);
            return attr == 'opacity' ? value * 100 : value; //兼容不透明度，如果是不透明度，则返回整数方便计算
        } else if (typeof this.get(node, "currentStyle") != 'undefined') {
            if (attr == 'opacity') { //兼容不透明度
                return Number(this.get(node, "currentStyle").getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1]);
            } else {
                return this.get(node, "currentStyle").getAttribute(attr);
            }
        }
    }
    static getStrPx(str: string, container: HTMLElement) {
        const span = window.document.createElement("span");
        span.innerText = str;
        this.setStyle(span, {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "white-space": "pre",
            "z-index": "-9999",
            "visibility": "hidden",
            "display": "inline-block",
            "font": this.getComputedStyle(container, "font"),
            "font-family": this.getComputedStyle(container, "font-family"),
            "font-weight": this.getComputedStyle(container, "font-weight"),
            "font-size": this.getComputedStyle(container, "font-size"),
            "font-feature-settings": this.getComputedStyle(container, "font-feature-settings"),
            "line-height": this.getComputedStyle(container, "line-height"),
            "letter-spacing": this.getComputedStyle(container, "letter-spacing"),
        });
        window.document.body.append(span);
        const textWidth = span.clientWidth;
        const ans = {
            width: span.clientWidth,
            height: span.clientHeight
        }
        span.parentElement?.removeChild(span);
        return ans;
    }
    static getRelativePosition(elemt: HTMLElement, parent: HTMLElement) {
        const ans = {
            left: 0, top: 0,
            right: 0, bottom: 0
        }
        while (elemt !== parent) {
            ans.left += elemt.offsetLeft;
            ans.top += elemt.offsetTop;
            elemt = <HTMLElement>elemt.offsetParent;
        }
        const parentInfo = this.getElementInfo(parent);
        const elemtInfo = this.getElementInfo(elemt);
        ans.bottom = parentInfo.innerHeight - ans.top - elemtInfo.height;
        ans.right = parentInfo.innerWidth - ans.left - elemtInfo.width;
        return ans;
    }
    static splitToSuitLength(container: HTMLElement, str: string) {
        const containerInfo = Utils.getElementInfo(container);
        if (str.length === 0 || Utils.getStrPx(str, container).width <= containerInfo.innerWidth) {
            return [str, ""];
        }
        let critical = str.length / 2;
        while (true) {
            const { width } = Utils.getStrPx(str.substring(0, critical), container);
            const accuracy = containerInfo.innerWidth - width;
            if (accuracy >= 0 && accuracy < 10) {
                return [str.substring(0, critical), str.substring(critical)]
            }
            if (width > containerInfo.innerWidth) {
                critical -= critical / 2;
            } else if (width < containerInfo.innerWidth) {
                critical += critical / 2;
            }
        }
    }

    static cancelLastTimeout(id: string) {
        let ids = this.timeoutIdMap.get(id) || [];
        for (let i of ids) {
            clearTimeout(i);
        }
    }

    static timeoutIdMap: Map<String, Array<number>> = new Map();
    static setLastTimeout(id: string, func: Function, delay: number) {
        let ids = this.timeoutIdMap.get(id);
        if (!Utils.isArray(ids)) {
            ids = [];
            this.timeoutIdMap.set(id, ids);
        }
        this.cancelLastTimeout(id);
        ids?.push(window.setTimeout(func, delay));
    }


    private static dragStates: Map<string, DragState> = new Map();
    static addEventListener(
        name: string,
        element: HTMLElement,
        callback: Function,
        option?: boolean | AddEventListenerOptions
    ) {
        if (name === 'drag') {
            const dragStateId = uuid.v1();
            this.dragStates.set(dragStateId, {
                startX: 0,
                startY: 0,
                pressed: false,
                deltaX: 0,
                deltaY: 0,
                registered: false,
                event: undefined
            });
            const startResize = (event: MouseEvent) => {
                let dragState = this.dragStates.get(dragStateId);
                if (!dragState) throw new Error('Sys error');
                window.getSelection()?.removeAllRanges();
                if (dragState.pressed && !dragState.registered) {
                    dragState.registered = true;
                    Utils.setStyle(document.body, { "user-select": "none" });
                    window.getSelection()?.removeAllRanges();
                    document.addEventListener('mousemove', resizing);
                    document.addEventListener('mouseup', resizeDone);
                    document.removeEventListener('mousemove', startResize);
                }
            }
            const resizing = (event: MouseEvent) => {
                let dragState = this.dragStates.get(dragStateId);
                if (!dragState) throw new Error('Sys error');
                if (dragState.pressed && dragState.registered) {
                    dragState.deltaX = event.screenX - dragState.startX;
                    dragState.deltaY = event.screenY - dragState.startY;
                    dragState.startX += dragState.deltaX;
                    dragState.startY += dragState.deltaY;
                    window.getSelection()?.removeAllRanges();
                    dragState.event = event;
                    callback(dragState);
                }
            };
            const resizeDone = (event: MouseEvent) => {
                let dragState = this.dragStates.get(dragStateId);
                if (!dragState) throw new Error('Sys error');
                if (dragState.pressed) {
                    dragState.pressed = false;
                    dragState.registered = false;
                    Utils.setStyle(document.body, { "user-select": "" });
                    window.getSelection()?.removeAllRanges();
                    dragState.event = event;
                    callback(dragState);
                    document.removeEventListener('mousemove', resizing);
                    document.removeEventListener('mouseup', resizeDone);
                    element.removeEventListener('mouseup', resizeDone);
                }
            };
            element.addEventListener('mousedown', (event) => {
                let dragState = this.dragStates.get(dragStateId);
                if (!dragState) throw new Error('Sys error');
                dragState.startX = event.screenX;
                dragState.startY = event.screenY;
                dragState.pressed = true;
                dragState.registered = false;
                dragState.event = event;
                callback(dragState);
                document.addEventListener('mousemove', startResize);
                element.addEventListener('mouseup', resizeDone);
            })
        } else {
            element.addEventListener(name, callback as any, option);
        }
    }

    static statckPeek<T>(stack: Array<T>) {
        if (this.isArray(stack)) {
            if (stack.length > 0) {
                return stack[stack.length - 1];
            }
        }
        return undefined;
    }

    static addClass(elemt: HTMLElement, c: string) {
        elemt.className += " " + c;
    }

    static anonyFunction(func: Function): string {
        const funcName = "_" + uuid.v1().replace(/-/g, '');
        window[funcName] = func;
        return funcName;
    }
}